const { correctType } = require('./Utils');
const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const MenuOption = require('./options/MenuOption');
const BaseBuilder = require('./BaseBuilder');
const SpudJSError = require('./errors/SpudJSError');

class MenuBuilder extends BaseBuilder {
    constructor(message) {
        super(message);
        this._options = [];
    }

    /**
     * Sets the placeholder text
     * @param {String} placeholder - The text seen on your Select Menu
     *
     */
    setPlaceholder(placeholder) {
        if (!correctType('string', placeholder)) throw new SpudJSError(`Expected "string", got ${typeof placeholder}`);
        this.placeholder = placeholder;
        return this;
    }
    /**
     * A getter for your options
     */
    getOptions() {
        return this._options;
    }
    /**
     * Adds an option to your select menu
     * @param {Function} input - The function used to generate the option
     *
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
     * The initiating function
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

        if (this.shouldMention === true) {
            msg = await this.message.channel.send({
                embeds: [this._options[0].embed],
                components: [
                    new ActionRowBuilder().addComponents(menu),
                ],
            });
        }
        else if (this.shouldMention === false) {
            msg = await this.message.channel.send({
                embeds: [this._options[0].embed],
                components: [
                    new ActionRowBuilder().addComponents(menu),
                ],
                allowedMentions: { repliedUser: false },
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
            msg.edit({
                components: [
                    new ActionRowBuilder().addComponents(menu.setPlaceholder('Expired').setDisabled(true)),
                ],
            });
        });
    }
}

module.exports = MenuBuilder;