const { ButtonBuilder, ActionRowBuilder, Message, StringSelectMenuBuilder } = require('discord.js');
const Builder = require('./Builder');

const paginationButtonMap = {
    'first': 'left-fast',
    'previous': 'left',
    'next': 'right',
    'last': 'right-fast',
    'trash': 'trash' // This is lazy I know;
};

// Hybrids are a cool mixture of Menu & Pagination.
class HybridBuilder extends Builder {
    constructor(input) {
        super(input);
        this.components = [];
        this._embeds = [];
        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle('Danger'), // createButton('trash', '⛔', 'Danger'),
            right: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle('Primary'), //  createButton('right', '▶', 'Primary'),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle('Primary'), //  createButton('right-fast', '⏭', 'Primary'),
            left: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle('Primary').setDisabled(true), //  createButton('left', '◀', 'Primary'),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle('Primary').setDisabled(true), //  createButton('left-fast', '⏮', 'Primary'),
        };
        this.len = this.getGroupLength;
        this.currentPage = 0;
        this.placeholder = 'Click here to change the group.';
        this.allowedEditButtonNames = ['right', 'left'];
    }
    /**
     * Adds a extra button that can be used to end the current pagination
     * @param {Boolean} bin - Determines whether this pagination has a trashbin.
     */
    trashBin(bin) {
        this.trashBin = bin;
        this.allowedEditButtonNames.push('trash');
        return this;
    }
    /**
     * Adds fast skipping
     * @param {Boolean} fastSkip - Determines whether this pagination can skip to the first and last pages.
     */
    fastSkip(fastSkip) {
        this.fastSkip = fastSkip;
        this.allowedEditButtonNames.push('first');
        this.allowedEditButtonNames.push('last');
        return this;
    }
    /**
     * Sets the initial embeds
     * @param {EmbedBuilder[]} groups - The embeds that is initialized with the pagination.
     */
    setGroups(groups) {
        this.currentGroup = groups[0].name; // Set the first group to the first provided group
        this._groups = groups;
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    editButton(name, style) {
        if (!this.allowedEditButtonNames.some(x => x === name)) throw new SpudJSError('You didn\'t provide a valid button to edit! (MAKE SURE THE BUTTON NAMES YOU\'RE USING ARE ENABLED!)');
        if (!style || !(style instanceof Object) && !(style instanceof ButtonBuilder)) throw new SpudJSError('"style" argument has been passed incorrectly!');
        if (!['style', 'emoji', 'label'].some(x => x in style)) throw new SpudJSError('Invalid parameters given! Make sure you pass your style with one of the following properties "emoji", "style", "label"');

        if (style instanceof ButtonBuilder) {
            // Override button if one was provided;
            this.buttons[name] = style;
        }
        else {
            if ('style' in style) {
                button.setStyle(typeof style['style'] === 'number' ? style['style'] : stylesMap[style['style']]);
            }
            if ('emoji' in style) {
                button.setEmoji(style['emoji']);
            }
            if ('label' in style) {
                button.setLabel(style['label']);
            }
        }
        // console.log(this.buttons[name].data);
        return this;
    }

    getCurrentEmbed() {
        return this._groups.find(x => x.name === this.currentGroup).embeds[this.currentPage];
    }
    /**
     * Handles the entire interaction
     */
    async send(callback) {
        const { filter, max, time } = this;
        const options = this._groups.map(option => {
            return {
                label: option.name,
                value: option.name,
                emoji: option?.emoji,
            };
        });

        const navigationMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setPlaceholder(this.placeholder)
            .addOptions(options)
            .setCustomId('spud-select-group')
        );
        const navigationPaging = new ActionRowBuilder().addComponents(...this.components);

        if (this.trashBin === true) {
            navigationPaging.components.push(this.buttons.left, this.buttons.trash, this.buttons.right);
        }
        else {
            navigationPaging.components.push(this.buttons.left, this.buttons.right);
        }
        if (navigationPaging.fastSkip === true) {
            navigationPaging.components.unshift(this.buttons.first);
            navigationPaging.components.push(this.buttons.last);
        }
        
        let totalPages = this.getGroupLength;
        
        let msg;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this.getCurrentEmbed()],
                components: [navigationMenu, navigationPaging],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
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
                // Allows callbacks to also skip pagination execution
                if (resultOfCallback === 'RETURN') { 
                    return;
                }
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
                    components: [navigationMenu, navigationPaging]
                });
                
            }

            if (i.customId === 'right') {
                this.currentPage++;
                if (this.currentPage >= totalPages) {
                    navigationPaging.components.map(button =>
                        button.data.custom_id.startsWith('right') ?
                        button.setDisabled(true)
                        : button.setDisabled(false),
                    );
                } else navigationPaging.components.map(button => button.setDisabled(false));

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging]
                });
            }
            else if (i.customId === 'left') {
                this.currentPage--;
                if (this.currentPage === 0) {
                    navigationPaging.components.map(button =>
                        button.data.custom_id.startsWith('left') ?
                        button.setDisabled(true)
                        : button.setDisabled(false),
                    );
                } else navigationPaging.components.map(button => button.setDisabled(false));

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging]
                });
            }
            else if (i.customId === 'right-fast') {
                this.currentPage = this.getGroupLength();

                navigationPaging.components.map(button =>
                    button.data.custom_id.startsWith('right') ?
                    button.setDisabled(true)
                    : button.setDisabled(false),
                );

                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging]
                });
            }
            else if (i.customId === 'left-fast') {
                this.currentPage = 0;
                navigationPaging.components.map(button =>
                    button.data.custom_id.startsWith('right') ?
                    button.setDisabled(true)
                    : button.setDisabled(false),
                );
                return await i.update({
                    embeds: [this.getCurrentEmbed()],
                    components: [navigationMenu, navigationPaging]
                });
            }
            else if (i.customId === 'trash') {
                i.update({ components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (this.commandType instanceof Message) {
                msg.edit({ components: [] });
            }
            else {
                this.commandType.editReply({ components: [] });
            }
        });
    }
    
    // Util functions
    getLength() {
        return this._groups.length;
    }
    getGroupLength() {
        return this._groups.find(x => x.name === this.currentGroup).embeds.length - 1;
    }
}

module.exports = HybridBuilder;