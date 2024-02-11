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
        this._linkedComponents = [];
        this._embeds = [];
        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle('Danger'), // createButton('trash', '⛔', 'Danger'),
            next: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle('Primary'), //  createButton('right', '▶', 'Primary'),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle('Primary'), //  createButton('right-fast', '⏭', 'Primary'),
            previous: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle('Primary').setDisabled(true), //  createButton('left', '◀', 'Primary'),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle('Primary').setDisabled(true), //  createButton('left-fast', '⏮', 'Primary'),
        };
        this.currentPage = 0;
        this.allowedEditButtonNames = ['previous', 'next'];
    }
    /**
     * @param {Boolean} trashBin - Determines whether this pagination has a button to end it.
     */
    trashBin(trashBin = true) {
        this.trashBin = trashBin;
        this.allowedEditButtonNames.push('trash');
        return this;
    }
    /**
     * Adds fast skipping
     * @param {Boolean} fastSkip - Determines whether this pagination can skip to the first and last pages.
     */
    fastSkip(fastSkip = true) {
        this.fastSkip = fastSkip;
        this.allowedEditButtonNames.push('last');
        this.allowedEditButtonNames.push('first');
        return this;
    }
    /**
     * Sets the initial embeds
     * @param {Array<EmbedBuilder>} embeds - The embeds that is initialized with the pagination.
     * @param {Array<ButtonBuilder>} linkedComponents - components that are linked to the page (or embed) 
     */
    setEmbeds(embeds, linkedComponents) {
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
        this._linkedComponents = linkedComponents;
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
    setCustomComponents(components=[], componentHandler) {
        if (!components.length) return;
        this.customComponents = components;
        this.customComponentHandler = componentHandler;
        return this;
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

        const button = this.buttons[name];

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
        return this;
    }
    /**
     * Handles the entire interaction
     */
    async send(callback) {
        const { filter, max, time } = this;

        const navigation = new ActionRowBuilder();
        const customComponents = new ActionRowBuilder();

        if (this.trashBin === true) {
            navigation.components.push(this.buttons.previous, this.buttons.trash, this.buttons.next);
        }
        else {
            navigation.components.push(this.buttons.previous, this.buttons.next);
        }
        if (this.fastSkip === true) {
            navigation.components.unshift(this.buttons.first);
            navigation.components.push(this.buttons.last);
        }

        if (this.customComponents) customComponents.components = this.customComponents;

        this.currentPage = 0;
        let totalPages = this.getTotalPages();
        
        const paginationComponents = [navigation, this.getLinkedComponents()].filter(x=>x);
        if (customComponents.components.length)  {
            paginationComponents.push(customComponents);
        }

        // Initialise the message variable (Will be used for collector)
        let msg;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: paginationComponents,
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this._embeds[this.currentPage]],
                components: paginationComponents,
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }


        const collector = msg.createMessageComponentCollector({ time, max, filter });
        // const userPropName = this.interaction === true ? 'user' : 'author';
        
        // Two Collectors

        // This one handles callbacks and custom components
        collector.on('collect', (i) => {
            if (callback) callback(i, this, collector);
            if (this.customComponentHandler) this.customComponentHandler(i);
        });
        
        // This one just handles the pagination
        collector.on('collect', async (i) => {

            // Update pagination length - allows embeds to dynamically be updated.
            totalPages = this.getTotalPages();
            // console.log(this._embeds); FOR DEBUG PURPOSES
            if (this.idle === true) {
                await collector.resetTimer();
            }
            if (i.customId === 'right') {
                this.currentPage++;
                if (this.currentPage >= totalPages) {
                    navigation.components.map(button => this._updateComponents(button, 'right'));
                } else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation, this.getLinkedComponents()].filter(x=>x) });
            }
            else if (i.customId === 'left') {
                this.currentPage--;
                if (this.currentPage === 0) {
                    navigation.components.map(button => this._updateComponents(button, 'left'));
                } else navigation.components.map(button => button.setDisabled(false));

                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation, this.getLinkedComponents()].filter(x=>x) });

            }
            else if (i.customId === 'right-fast') {
                this.currentPage = totalPages;
                navigation.components.map(button => this._updateComponents(button, 'right'));
                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation, this.getLinkedComponents()].filter(x=>x) });
            }
            else if (i.customId === 'left-fast') {
                this.currentPage = 0;
                navigation.components.map(button => this._updateComponents(button, 'left'));
                return await i.update({ embeds: [this._embeds[this.currentPage]], components: [navigation, this.getLinkedComponents()].filter(x=>x) });
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
    getTotalPages() {
        return this._embeds.length - 1;
    }
    getPage() {
        return this.currentPage;
    }
    getLinkedComponents() {
        if (!this._linkedComponents || this.currentPage > (this._linkedComponents.length - 1)) return undefined;
        return this._linkedComponents[this.currentPage];
    }
    setPage(page) {
        this.currentPage = page;
        return this.getPage();
    }
    _updateComponents(button, name) {
        button.data.custom_id.startsWith(name) ?
        button.setDisabled(true)
        : button.setDisabled(false);
    }
}

module.exports = PaginationBuilder;