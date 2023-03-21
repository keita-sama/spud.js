const { correctType } = require('./Utils');
const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const MenuOption = require('./options/MenuOption');
const Builder = require('./Builder');
const SpudJSError = require('./errors/SpudJSError');

class MenuBuilder extends Builder {
    constructor(commandType) {
        console.log(commandType);
        super(commandType);
        this._options = [];
    }

    /**
     * Sets the placeholder text
     * @param {String} placeholder - The text seen on your Select Menu
     */
    setPlaceholder(placeholder) {
        if (!correctType('string', placeholder)) throw new SpudJSError(`Expected "string", got ${typeof placeholder}`);
        this.placeholder = placeholder;
        return this;
    }
    /**
     * Sets the initial options
     * @param {Array<MenuOption>} options - The options that is initialized with the menu
     */
    setMenuOptions(options) {
        if (!(options instanceof Array)) {
            throw new SpudJSError(`Expected "Array", got ${typeof options}`);
        }
        else {
            options.forEach(option => {
                if (
                    !(option instanceof MenuOption)
                    && typeof option !== 'object'
                ) throw new SpudJSError('Incorrect argument passed, must be either "MenuOption" or "Object"');
            });
        }
        this._options = options;
        return this;
    }
    /**
     * Adds an option to your select menu
     * @param {Function} input - The function used to generate the option
     */
    addMenuOption(input) {
        if (!input) throw new SpudJSError('You can\'t pass nothing!');
        if (typeof input === 'function') {
            this._options.push(input(new MenuOption()));
            return this;
        }
        else if (typeof input === 'object' || input instanceof MenuOption) {
            this._options.push(input);
        }
    }
    /**
     * A getter for the menu's options
     */
    getOptions() {
        return this._options;
    }
    /**
     * Handles the entire interaction
     */
    async send() {
        const { filter, max, time } = this;

        const options = this._options.map(option => {
            return {
                label: option.label,
                description: option.description,
                value: option.value ?? option.label.toLowerCase().replace(/ +/g, '_'),
                default: option?.default ?? false,
                emoji: option?.emoji,
            };
        });

        const menu = new SelectMenuBuilder()
            .setPlaceholder(this.placeholder)
            .addOptions(...options)
            .setCustomId('spud-select');

        let msg;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [this._options[0].embed],
                components: [
                    new ActionRowBuilder().addComponents(menu),
                ],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [this._options[0].embed],
                components: [
                    new ActionRowBuilder().addComponents(menu),
                ],
            });
        }


        const collector = msg.createMessageComponentCollector({ filter, max, time });

        collector.on('collect', async (m) => {
            collector.resetTimer();
            const val = m.values[0];
            await m.update({
                embeds: [
                    this._options.find(option => option.label.toLowerCase().replace(/ /g, '_') === val).embed,
                ],
            });
        });

        collector.on('end', () => {
            if (!this.interaction) {
                msg.edit({
                        components: [
                             new ActionRowBuilder().addComponents(menu.setPlaceholder('Expired').setDisabled(true)),
                    ],
                });
            }
            else {
                this.commandType.editReply({
                        components: [
                             new ActionRowBuilder().addComponents(menu.setPlaceholder('Expired').setDisabled(true)),
                    ],
                });
            }
        });
    }
}

module.exports = MenuBuilder;
