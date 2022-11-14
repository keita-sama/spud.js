import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, Message } from 'discord.js';
import { correctType } from './Utils';
import BaseBuilder from "./BaseBuilder";
import SpudJSError from './errors/SpudJSError';

export default function checkPage(cur: any, components: any, max: any) {
    switch (cur) {
        case 0:
            return new ActionRowBuilder().addComponents(...components.map(btn => btn.data.custom_id.startsWith('left') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case max:
            return new ActionRowBuilder().addComponents(...components.map(btn => btn.data.custom_id.startsWith('right') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case 'none':
            return new ActionRowBuilder().addComponents(...components.map(btn => btn.setDisabled(true)));
        case 'all':
            return new ActionRowBuilder().addComponents(...components.map(btn => btn.setDisabled(false)));
        default:
            return new ActionRowBuilder().addComponents(...components.map(btn => btn.setDisabled(false)));
    }
}

function update(interaction, embedArr, cur, row) {
    return interaction.update({
        embeds: [
            embedArr[cur],
        ],
        components: [
            row,
        ],
    });
}

function createButton(id, emoji, style) {
    return new ButtonBuilder()
        .setCustomId(id)
        .setEmoji(emoji)
        .setStyle(style);
}

class PaginationBuilder extends BaseBuilder {
	public _embeds: any;
	public message: any;
	public content: any;
	public shouldMention: any;
	public idle: any;
	public filter: any;
	public max: any;
	public time: any;

    constructor (message: Message) {
        super(message);
        this._embeds = [];
    }

    trashBin(bin: boolean) {
        if (!correctType('boolean', bin)) throw new SpudJSError(`Expected "boolean", got ${typeof bin}`);
        (this.trashBin as any) = bin;
        return this;
    }

    fastSkip(fastSkip: any) {
        if (!correctType('boolean', fastSkip)) throw new SpudJSError(`Expected "boolean", got ${typeof fastSkip}`);
        this.fastSkip = fastSkip;
        return this;
    }

    setEmbeds(embeds: EmbedBuilder[]) {
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

    addEmbed(embed: EmbedBuilder) {
        if (!(embed instanceof EmbedBuilder)) throw new SpudJSError(`Expected "EmbedBuilder", got ${typeof embed}`);
        this._embeds.push(embed);
        return this;
    }
    /**
     * A getter for the embed's options
     */
    getEmbeds() {
        if (this._embeds.length === 0) throw new SpudJSError('There is no embeds, Add some using setEmbeds/addEmbed!');
        return this._embeds;
    }
    /**
     * Handles the entire interaction
     */
    async send() {
        const { filter, max, time } = this;

        const components = [];
        const trash = createButton('trash', '⛔', 'Danger');
        const right = createButton('right', '▶', 'Primary');
        const dright = createButton('rightf', '⏭', 'Primary');
        const left = createButton('left', '◀', 'Primary');
        const dleft = createButton('leftf', '⏮', 'Primary');

        if ((this.trashBin as any) === true) {
            components.push((left as never), (trash as never), (right as never));
        }
        else {
            components.push(left, right);
        }
        if ((this.fastSkip as any) === true) {
            components.unshift(dleft);
            components.push(dright);
        }

        let currentPage = 0;
        const len = this._embeds.length - 1;

        const msg = await this.message.reply({
            content: this.content,
            embeds: [
                this._embeds[currentPage],
            ],
            components: [
                checkPage(currentPage, components, len),
            ],
            allowedMentions: { repliedUser: this.shouldMention },
        });

        const collector = msg.createMessageComponentCollector({ filter, time, max });

        collector.on('collect', async (i) => {
            if (this.idle === true) {
                collector.resetTimer();
            }
            if (i.customId === 'right') {
                currentPage++;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            if (i.customId === 'left') {
                currentPage--;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            if (i.customId === 'rightf') {
                currentPage = len;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            if (i.customId === 'leftf') {
                currentPage = 0;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            if (i.customId === 'trash') {
                i.update({
                    components: [
                        new ActionRowBuilder().addComponents(...components.map((btn: ButtonBuilder) => btn.setDisabled(true))),
                    ],
                });
                collector.stop();
            }
        });

        collector.on('end', () => {
            msg.edit({
                components: [
                    checkPage('none', components, len),
                ],
            });
        });
    }
}
