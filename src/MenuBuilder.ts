import { correctType } from './Utils';
import { SelectMenuBuilder, ActionRowBuilder, Message } from 'discord.js';
import MenuOption from './options/MenuOption';
import BaseBuilder from './BaseBuilder';
import SpudJSError from './errors/SpudJSError';

export default class MenuBuilder extends BaseBuilder {
    public _options: any;
    public placeholder: any;
    public message: any;
    public content: any;
    public shouldMention: any;
    public filter: any;
    public max: any;
    public time: any;

    constructor(message: Message) {
        super(message);
        this._options = [];
    }

    setPlaceholder(placeholder: String) {
        if (!correctType('string', placeholder)) throw new SpudJSError(`Expected "string", got ${typeof placeholder}`);
        this.placeholder = placeholder;
        return this;
    }

    setMenuOptions(options: Array<MenuOption>) {
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

    addMenuOption(input: Function | any) {
        if (!input) throw new SpudJSError('You can\'t pass nothing!');
        if (typeof input === 'function') {
            this._options.push(input(new MenuOption()));
            return this;
        }
        else if (typeof input === 'object' || input instanceof MenuOption) {
            this._options.push(input);
        }
    }

    getOptions() {
        return this._options;
    }

    async send() {
        const { filter, max, time } = this;

        const options = this._options.map((option: any) => {
            return {
                label: option.label,
                description: option.description,
                value: option.value ?? option.label.toLowerCase().replace(/ +/g, '_'),
                default: option?.default ?? false,
                emoji: option?.emoji,
            };
        });

        const menu: SelectMenuBuilder = new SelectMenuBuilder()
            .setPlaceholder(this.placeholder)
            .addOptions(...options)
            .setCustomId('spud-select');

        const msg = await this.message.reply({
            content: this.content,
            embeds: [this._options[0].embed],
            components: [
                new ActionRowBuilder().addComponents(menu),
            ],
            allowedMentions: { repliedUser: this.shouldMention },
        });


        const collector = msg.createMessageComponentCollector({ filter, max, time });

        collector.on('collect', async (m: any) => {
            collector.resetTimer();
            const val = m.values[0];
            await m.update({
                embeds: [
                    this._options.find((option: any) => option.label.toLowerCase().replace(/ /g, '_') === val).embed,
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