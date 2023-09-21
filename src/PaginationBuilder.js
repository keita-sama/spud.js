const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');
const Builder = require('./Builder');
const SpudJSError = require('./errors/SpudJSError');

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
    'trash': 'trash' // This is lazy I know;
};

class PaginationBuilder extends Builder {
    constructor(input) {
        super(input);
        this._embeds = [];
        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle('Danger'), // createButton('trash', '⛔', 'Danger'),
            right: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle('Primary'), //  createButton('right', '▶', 'Primary'),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle('Primary'), //  createButton('right-fast', '⏭', 'Primary'),
            left: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle('Primary').setDisabled(true), //  createButton('left', '◀', 'Primary'),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle('Primary').setDisabled(true), //  createButton('left-fast', '⏮', 'Primary'),
        };
        this.len = this.getLength();
        this.currentPage = 0;
        this.allowedEditButtonNames = ['previous', 'next'];
    }
    /**
     * @param {Boolean} trashBin - Determines whether this pagination has a button to end it.
     */
    trashBin(trashBin = false) {
        this.trashBin = trashBin;
        this.allowedEditButtonNames.push('trash');
        return this;
    }
    /**
     * Adds fast skipping
     * @param {Boolean} fastSkip - Determines whether this pagination can skip to the first and last pages.
     */
    fastSkip(fastSkip = false) {
        this.fastSkip = fastSkip;
        this.allowedEditButtonNames.push('last');
        this.allowedEditButtonNames.push('first');
        return this;
    }
    /**
     * Sets the initial embeds
     * @param {Array<EmbedBuilder>} embeds - The embeds that is initialized with the pagination.
     */
    setEmbeds(embeds) {
        if (!(embeds instanceof Array)) {
            throw new SpudJSError(`Expected "Array", got ${typeof embeds}`);
        }
        else {
            embeds.forEach(embed => {
                if (
                    !(embed instanceof EmbedBuilder) &&
                    typeof embed !== 'object'
                ) throw new SpudJSError('Incorrect argument passed, must be either "EmbedBuilder" or "Object"');
            });
        }
        this._embeds = embeds;
        return this;
    }
    /**
     * Adds an embed
     * @param {EmbedBuilder} embed - Appends an embed to this instance of pagination
     */
    addEmbed(embed) {
        if (!(embed instanceof EmbedBuilder)) throw new SpudJSError(`Expected "EmbedBuilder", got ${typeof embed}`);
        this._embeds.push(embed);
        return this;
    }
    /**
     * A getter for the embeds.
     * @returns {Array<Embeds>}
     */
    getEmbeds() {
        if (this._embeds.length === 0) throw new SpudJSError('There is no embeds, add some using setEmbeds/addEmbed!');
        return this._embeds;
    }
    /**
     * 
     * @param {String} name - The name of the button you want to edit.
     * @param {Object | ButtonBuilder} style - The Button/Style the pagination will make use of.
     */
    editButton(name, style) {
        if (!this.allowedEditButtonNames.some(x => x === name)) throw new SpudJSError('You didn\'t provide a valid button to edit! (MAKE SURE THE BUTTON NAMES YOU\'RE USING ARE ENABLED!)');
        if (!style || !(style instanceof Object) && !(style instanceof ButtonBuilder)) throw new SpudJSError('"style" argument has been passed incorrectly!');
        if (!['style', 'emoji', 'label'].some(x => x in style)) throw new SpudJSError('Invalid parameters given! Make sure you pass your style with one of the following properties "emoji", "style", "label"');
        const button = this.buttons[paginationButtonMap[name]];

        if (style instanceof ButtonBuilder) {
            // Override button if one was provided;
            this.button[paginationButtonMap[name]] = style;
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
    /**
     * Handles the entire interaction
     */
    async send(callback) {
        const { filter, max, time } = this;

        const navigation = new ActionRowBuilder();

        if (this.trashBin === true) {
            navigation.components.push(this.buttons.left, this.buttons.trash, this.buttons.right);
        }
        else {
            navigation.components.push(this.buttons.left, this.buttons.right);
        }
        if (this.fastSkip === true) {
            navigation.components.unshift(this.buttons.first);
            navigation.components.push(this.buttons.last);
        }

        this.currentPage = 0;
        let totalPages = this.getLength();

        // Initialise the message variable (Will be used for collector)
        let msg;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: [navigation],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: [navigation],
            });
        }


        const collector = msg.createMessageComponentCollector({ time, max, filter });
        const userPropName = this.interaction === true ? 'user' : 'author';

        collector.on('collect', async (i) => {
            if (callback) {
                const resultOfCallback = callback(i, this, collector);
                // Allows callbacks to also skip pagination execution
                if (resultOfCallback === 'RETURN') { 
                    return;
                }
            }
            // Update pagination length - allows embeds to dynamically be updated.
            totalPages = this.getLength();
            // console.log(this._embeds); FOR DEBUG PURPOSES
            if (this.idle === true) {
                await collector.resetTimer();
            }
            if (i.customId === 'right') {
                this.currentPage++;
                if (this.currentPage >= totalPages) {
                    navigation.components.map(button =>
                        button.data.custom_id.startsWith('right') ?
                        button.setDisabled(true)
                        : button.setDisabled(false),
                    );
                } else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
                // update(i, this._embeds, this.currentPage, checkPage(this.currentPage, components, len));
            }
            else if (i.customId === 'left') {
                this.currentPage--;
                if (this.currentPage === 0) {
                    navigation.components.map(button =>
                        button.data.custom_id.startsWith('left') ?
                        button.setDisabled(true)
                        : button.setDisabled(false),
                    );
                } else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
                // cupdate(i, this._embeds, this.currentPage, checkPage(this.currentPage, components, len));
            }
            else if (i.customId === 'right-fast') {
                this.currentPage = totalPages;
                navigation.components.map(button =>
                    button.data.custom_id.startsWith('right') ?
                    button.setDisabled(true)
                    : button.setDisabled(false),
                );
                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
                // update(i, this._embeds, this.currentPage, checkPage(this.currentPage, components, len));
            }
            else if (i.customId === 'left-fast') {
                this.currentPage = 0;
                navigation.components.map(button =>
                    button.data.custom_id.startsWith('left') ?
                    button.setDisabled(true)
                    : button.setDisabled(false),
                );
                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation] });
                // update(i, this._embeds, this.currentPage, checkPage(this.currentPage, components, len));
            }
            else if (i.customId === 'trash') {
                i.update({ components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            navigation.components.map(button => button.setDisabled(true));
            if (!this.interaction) {
                msg.edit({ components: [] });
            }
            else {
                this.commandType.editReply({ components: [] });
            }
        });
    }

    // These are utility functions - useful for people who need this info in things such as callbacks :)
    getLength() {
        return this._embeds.length;
    }
    getPage() {
        return this.currentPage;
    }
    setPage(page) {
        this.currentPage = page;
        return this.getPage();
    }
}

module.exports = PaginationBuilder;