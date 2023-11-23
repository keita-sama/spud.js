const { ButtonBuilder, ActionRowBuilder, Message, StringSelectMenuBuilder } = require('discord.js');
const Builder = require('./Builder');

const paginationButtonMap = {
    'first': 'left-fast',
    'previous': 'left',
    'next': 'right',
    'last': 'right-fast',
    'trash': 'trash',
};

module.exports = class HybridBuilder extends Builder {
    /**
     * Add the command interaction or message to reply with
     * @param {CommandInteraction | Message} commandType - Command type to be specified
     */
    constructor(commandType) {
        super(commandType);

        this.components = [];
        this._embeds = [];

        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle('Danger'),
            right: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle('Primary'),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle('Primary'),
            left: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle('Primary').setDisabled(true),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle('Primary').setDisabled(true),
        };

        this.len = this.getGroupLength;
        this.currentPage = 0;
        this.placeholder = 'Click here to change the group.';
        this.allowedEditButtonNames = ['right', 'left'];
    }

    /**
     * Add a trash bin button to the pagination
     * @param {Boolean} bin - Parameter to toggle the trash bin button
     * @returns {PaginationBuilder}
     */
    trashBin(bin) {
        this.trashBin = bin;
        this.allowedEditButtonNames.push('trash');

        return this;
    }

    /**
     * Adds fast skipping to the pagination
     * @param {Boolean} [fastSkip] - Parameter to toggle the fast skip buttons
     * @returns {PaginationBuilder}
     */
    fastSkip(fastSkip = false) {
        this.fastSkip = fastSkip;

        this.allowedEditButtonNames.push('first');
        this.allowedEditButtonNames.push('last');

        return this;
    }

    /**
     * Set the initial embeds
     * @param {EmbedBuilder[]} groups - The embeds that is initialized with the pagination
     * @returns {HybridBuilder}
     */
    setGroups(groups) {
        this.currentGroup = groups[0].name;
        this._groups = groups;

        return this;
    }

    /**
     * Set the placeholder text of the menu
     * @param {String} placeholder - Parameter of the placeholder text
     * @returns {MenuBuilder}
     */
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    /**
     * Edit a button within the pagination
     * @param {String} name - Parameter of the name of the button you want to edit
     * @param {ButtonBuilder | { style?: number | string, emoji?: string, label?: string }} style - Parameter of the button or style to be edited
     * @throws {SpudJSError} If parameter name isn't valid
     * @throws {SpudJSError} If parameter style has been passed incorrectly
     * @throws {SpudJSError} If paramter style has invalid parameters in it
     * @returns {PaginationBuilder}
     */
    editButton(name, style) {
        if (!this.allowedEditButtonNames.some((x) => x === name)) {
            throw new SpudJSError('ParameterValue', 'Invalid button name to edit');
        }
        
        if (!style || !(style instanceof Object) && !(style instanceof ButtonBuilder)) {
            throw new SpudJSError('ParameterValue', 'Parameter "style" has been passed incorrectly');
        }

        if (!['style', 'emoji', 'label'].some((x) => x in style)) {
            throw new SpudJSError('ParameterValue', 'Invalid parameters given');
        }

        const button = this.buttons[paginationButtonMap[name]];

        if (style instanceof ButtonBuilder) {
            this.button[paginationButtonMap[name]] = style;
        } else {
            if ('style' in style) {
                button.setStyle(
                    typeof style['style'] === 'number' ?
                        style['style'] :
                        stylesMap[style['style']],
                );
            }

            if ('emoji' in style) {
                button.setEmoji(style['emoji']);
            }

            if ('label' in style) {
                button.setLabel(style['label']);
            }
        }

        return this;
    }

    /**
     * Get the current embed
     * @returns {EmbedBuilder}
     */
    getCurrentEmbed() {
        return this._groups.find((x) => x.name === this.currentGroup).embeds[this.currentPage];
    }

    /**
     * Sends & handles the pagination
     * @param {Function} [callback]
     * @returns {void}
     */
    async send(callback) {
        const { filter, max, time } = this;

        const options = this._groups.map((option) => {
            return {
                label: option.name,
                value: option.name,
                emoji: option?.emoji,
            };
        });

        const navigationMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder(this.placeholder)
                    .addOptions(options)
                    .setCustomId('spud-select-group')
            );

        const navigationPaging = new ActionRowBuilder()
            .addComponents(...this.components);

        this.trashbin === true ?
            navigation.components.push(this.buttons.left, this.buttons.trash, this.buttons.right) :
            navigation.components.push(this.buttons.left, this.buttons.right);

        if (navigationPaging.fastSkip === true) {
            navigationPaging.components.unshift(this.buttons.first);
            navigationPaging.components.push(this.buttons.last);
        }
        
        let totalPages = this.getGroupLength;
        let msg = null;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this.getCurrentEmbed()],
                components: [navigationMenu, navigationPaging],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        } else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this.getCurrentEmbed()],
                components: [navigationMenu, navigationPaging],
            });
        }

        const collector = msg.createMessageComponentCollector({ filter, time, max });

        collector.on('collect', async (i) => {
            if (callback) {
                const resultOfCallback = callback(i, this, collector);
                if (resultOfCallback === 'RETURN') return;
            }

            totalPages = this.getGroupLength();

            if (this.idle === true) {
                collector.resetTimer();
            }

            if (i.customId === 'spud-select-group') {
                this.currentGroup = i.values[0];
                this.currentPage = 0;

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging],
                });
            }

            if (i.customId === 'right') {
                this.currentPage++;

                if (this.currentPage >= totalPages) {
                    navigation.components.map((button) => {
                        return button.data.custom_id.startsWith('right') ?
                            button.setDisabled(true) :
                            button.setDisabled(false);
                    });
                } else {
                    navigation.components.map((button) => button.setDisabled(false));
                }

                return await i.update({ embeds: [this.getCurrentEmbed()], components: [navigationMenu, navigationPaging] });
            } else if (i.customId === 'left') {
                this.currentPage--;

                if (this.currentPage === 0) {
                    navigation.components.map((button) => {
                        return button.data.custom_id.startsWith('left') ?
                            button.setDisabled(true) :
                            button.setDisabled(false);
                    });
                } else {
                    navigation.components.map((button) => button.setDisabled(false));
                }

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging],
                });
            } else if (i.customId === 'right-fast') {
                this.currentPage = this.getGroupLength();

                navigation.components.map((button) => {
                    return button.data.custom_id.startsWith('right') ?
                        button.setDisabled(true) :
                        button.setDisabled(false);
                });

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigation, navigationPaging],
                });
            } else if (i.customId === 'left-fast') {
                this.currentPage = 0;

                navigation.components.map((button) => {
                    return button.data.custom_id.startsWith('left') ?
                        button.setDisabled(true) :
                        button.setDisabled(false);
                });

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging],
                });
            } else if (i.customId === 'trash') {
                i.update({ components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (this.commandType instanceof Message) {
                msg.edit({ components: [] });
            } else {
                this.commandType.editReply({ components: [] });
            }
        });
    }

    /**
     * Get the length of groups
     * @returns {Number}
     */
    getLength() {
        return this._groups.length;
    }

    /**
     * Get the group embeds' length
     * @returns {Number}
     */
    getGroupLength() {
        return this._groups.find((x) => x.name === this.currentGroup).embeds.length - 1;
    }
};
