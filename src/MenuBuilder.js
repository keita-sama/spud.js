const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const MenuOption = require('./options/MenuOption');
const SpudJSError = require('./errors/SpudJSError');
const Builder = require('./Builder');

/**
 * Replace spaces with underscores in a string
 * @param {string} label - Parameter of the string you want to replace
 * @returns {string}
 */
function createIdFromLabel(label) {
    return label.toLowerCase().replace(/ /g, '_');
}

module.exports = class MenuBuilder extends Builder {
    /**
     * Add custom options to the builder
     * @param {*} input - Options to be specified
     */
    constructor(input) {
        super(input);
        this._options = [];
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
     * Set the initial options
     * @param {MenuOption[]} options - Parameter of the select menu options
     * @throws {SpudJSError} If the options parameter isn't an array
     */
    setMenuOptions(options) {
        if (!(options instanceof Array)) throw new SpudJSError(`Expected "Array", got ${typeof options}`);
        else {
            options.forEach((option) => {
                if (!(option instanceof MenuOption) && typeof option !== 'object') throw new SpudJSError('Incorrect argument passed, must be either "MenuOption" or "Object"')
            });

            this._options = options;
            return this;
        }
    }

    /**
     * Add an option to your select menu
     * @param {*} input - Parameter used to generate the option
     * @throws {SpudJSError} If the input parameter is not specified
     * @returns {MenuBuilder}
     */
    addMenuOption(input) {
        if (!input) throw new SpudJSError('Missing parameter "input"');

        if (typeof input === 'function') this._options.push(input(new MenuOption()));
        else if (typeof input === 'object' || input instanceof MenuOption) this._options.push(input);

        return this;
    }

    /**
     * Get the current menu options
     * @returns {*[] | MenuOption[]}
     */
    get getOptions() {
        return this._options;
    }

    /**
     * Sends & handles the pagination
     * @param {Function} callback
     * @returns {void}
     */
    async send(callback) {
        const { filter, max, time } = this;

        const options = this._options.map((option) => ({
            label: option.label,
            description: option.description,
            value: option.value ?? createIdFromLabel(option.label),
            default: option?.default ?? false,
            emoji: option?.emoji,
        }));

        const navigation = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder(this.placeholder)
                .addOptions(...options)
                .setCustomId('spud-select'),
        );

        let msg = null;

        if (this.interaction === true) {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this._options[0].embed],
                components: [navigation],
            });
        } else {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this._options[0].embed],
                components: [navigation],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }

        const collector = msg.createMessageComponentCollector({ filter, max, time });

        collector.on('collect', async (m) => {
            if (callback) {
                const resultOfCallback = callback(m, this, collector);
                if (resultOfCallback === 'RETURN') return;
            }

            if (this.idle) await collector.resetTimer();

            await m.update({
                embeds: [this._options.find(option => createIdFromLabel(option.label) === m.values[0]).embed],
            });
        });

        collector.on('end', () => {
            if (!this.interaction) msg.edit({ components: [navigation.components.map(x => x.setPlaceholder('Expired').setDisabled(true))] });
            else this.commandType.editReply({ components: [navigation.components.map(x => x.setPlaceholder('Expired').setDisabled(true))] });
        });
    }
}
