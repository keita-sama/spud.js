const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, CommandInteraction, Message } = require('discord.js');
const SpudJSError = require('../errors/SpudJSError');
const Builder = require('./Builder');

const stylesMap = {
    'Primary': 1,
    'Secondary': 2,
    'Danger': 4,
    'Sucess': 3,
};

const paginationButtonMap = {
    'first': 'left-fast',
    'previous': 'left',
    'next': 'right',
    'last': 'right-fast',
    'trash': 'trash',
};

module.exports = class PaginationBuilder extends Builder {
    /**
     * Add the command interaction or message to reply with
     * @param {CommandInteraction | Message} commandType - Command type to be specified
     */
    constructor(commandType) {
        super(commandType);

        this._embeds = [];
        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle('Danger'),
            right: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle('Primary'),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle('Primary'),
            left: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle('Primary').setDisabled(true),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle('Primary').setDisabled(true),
        };
        this.len = this.getLength();
        this.currentPage = 0;
        this.allowedEditButtonNames = ['previous', 'next'];
    }

    /**
     * Add a trash bin button to the pagination
     * @param {Boolean} [trashBin] - Parameter to toggle the trash bin button
     * @returns {PaginationBuilder}
     */
    trashBin(trashBin = false) {
        this.trashBin = trashBin;
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
        this.allowedEditButtonNames.push('last');
        this.allowedEditButtonNames.push('first');
        return this;
    }

    /**
     * Set the initial embeds
     * @param {EmbedBuilder[]} embeds - Parameter of embeds to be initialized
     * @throws {SpudJSError} If the embeds parameter isn't an array
     * @throws {SpudJSError} If the embeds isn't an EmbedBuilder or an object
     * @returns {PaginationBuilder}
     */
    setEmbeds(embeds) {
        if (!(embeds instanceof Array)) throw new SpudJSError('ParameterTypee', `Expected "Array", got ${typeof embeds}`);
        else embeds.forEach((embed) => {
            if (!(embed instanceof EmbedBuilder) && typeof embed !== 'object') throw new SpudJSError('ParameterType', 'Incorrect argument passed, must be either "EmbedBuilder" or "Object"');
        });

        this._embeds = embeds;
        return this;
    }

    /**
     * Add an embed to the pagination
     *
     * @param {EmbedBuilder} embed - Parameter of the embed to be added to the pagination.
     * @throws {SpudJSError} If the embed parameter isn't an EmbedBuilder
     * @returns {PaginationBuilder}
     */
    addEmbed(embed) {
        if (!(embed instanceof EmbedBuilder)) throw new SpudJSError('ParameterType', `Expected "EmbedBuilder", got ${typeof embed}`);
        this._embeds.push(embed);
        return this;
    }

    /**
     * Get the current embeds in the pagination
     * @throws {SpudJSError} If there are no embeds within the pagination
     * @returns {Embeds[]}
     */
    getEmbeds() {
        return this._embeds;
    }

    /**
     * Edit a button within the pagination
     * @param {String} name - Parameter of the name of the button you want to edit
     * @param {ButtonBuilder | { style?: number | string, emoji?: string, label?: string }} style - Parameter of the button or style to be edited
     * @throws {SpudJSError} If the name parameter isn't valid
     * @throws {SpudJSError} If the style parameter has been passed incorrectly
     * @throws {SpudJSError} If the style parameter has invalid parameters in it
     * @returns {PaginationBuilder}
     */
    editButton(name, style) {
        if (!this.allowedEditButtonNames.some(x => x === name)) throw new SpudJSError('ParameterValue', 'Invalid button name to edit');
        else if (!style || !(style instanceof Object) && !(style instanceof ButtonBuilder)) throw new SpudJSError('ParameterValue', 'Argument style has been passed incorrectly');
        else if (!['style', 'emoji', 'label'].some(x => x in style)) throw new SpudJSError('ParameterValue', 'Invalid parameters given');

        const button = this.buttons[paginationButtonMap[name]];

        if (style instanceof ButtonBuilder) this.button[paginationButtonMap[name]] = style;
        else {
            if ('style' in style) button.setStyle(typeof style['style'] === 'number' ? style['style'] : stylesMap[style['style']]);
            if ('emoji' in style) button.setEmoji(style['emoji']);
            if ('label' in style) button.setLabel(style['label']);
        }

        return this;
    }

    /**
     * Sends & handles the pagination
     * @param {Function} callback
     * @returns {void}
     */
    async send(callback) {
        const { filter, max, time } = this;
        const navigation = new ActionRowBuilder();

        this.trashbin === true ?
            navigation.components.push(this.buttons.left, this.buttons.trash, this.buttons.right) :
            navigation.components.push(this.buttons.left, this.buttons.right);

        if (this.fastSkip === true) {
            navigation.components.unshift(this.buttons.first);
            navigation.components.push(this.buttons.last);
        }

        this.currentPage = 0;

        let totalPages = this.getLength();
        let msg = null;

        if (this.interaction === true) {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: [navigation],
            });
        } else {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: [navigation],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }

        const collector = msg.createMessageComponentCollector({ time, max, filter });

        collector.on('collect', async (i) => {
            if (callback) {
                const resultOfCallback = callback(i, this, collector);
                if (resultOfCallback === 'RETURN') return;
            }

            totalPages = this.getLength();

            if (this.idle === true) await collector.resetTimer();

            if (i.customId === 'right') {
                this.currentPage++;

                if (this.currentPage >= totalPages) navigation.components.map((button) => button.data.custom_id.startsWith('right') ? button.setDisabled(true) : button.setDisabled(false));
                else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
            } else if (i.customId === 'left') {
                this.currentPage--;

                if (this.currentPage === 0) navigation.components.map(button => button.data.custom_id.startsWith('left') ? button.setDisabled(true) : button.setDisabled(false));
                else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
            } else if (i.customId === 'right-fast') {
                this.currentPage = totalPages;
                navigation.components.map(button => button.data.custom_id.startsWith('right') ? button.setDisabled(true) : button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
            } else if (i.customId === 'left-fast') {
                this.currentPage = 0;
                navigation.components.map(button => button.data.custom_id.startsWith('left') ? button.setDisabled(true) : button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
            } else if (i.customId === 'trash') {
                i.update({ components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            navigation.components.map((button) => button.setDisabled(true));
            !this.interaction ? msg.edit({ components: [] }) : this.commandType.editReply({ components: [] });
        });
    }

    /**
     * Get the current length of embeds
     * @returns {Number}
     */
    getLength() {
        return this._embeds.length;
    }

    /**
     * Get the current page number
     * @returns {Number}
     */
    getPage() {
        return this.currentPage;
    }

    /**
     * Set the current page
     * @param {Number} page - Parameter of the page number
     * @returns {void}
     */
    setPage(page) {
        this.currentPage = page;
    }
};
