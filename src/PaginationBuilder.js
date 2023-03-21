const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { correctType } = require('./Utils');
const Builder = require('./Builder');
const SpudJSError = require('./errors/SpudJSError');
const allowedButtonsNames = ['first', 'last', 'right', 'left', 'trash'];

function createButton(id, emoji, style) {
    return new ButtonBuilder()
        .setCustomId(id)
        .setEmoji(emoji)
        .setStyle(style);
}


function checkPage(cur, components, max) {
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

class PaginationBuilder extends Builder {
    constructor(message) {
        super(message);
        this._embeds = [];
        this.buttons = {
            trash: createButton('trash', '⛔', 'Danger'),
            right: createButton('right', '▶', 'Primary'),
            last: createButton('right-fast', '⏭', 'Primary'),
            left: createButton('left', '◀', 'Primary'),
            first: createButton('left-fast', '⏮', 'Primary'),
        };
    }
    /**
     * Adds a extra button that can be used to end the current pagination
     * @param {Boolean} bin - Determines whether this pagination has a trashbin.
     */
    trashBin(bin) {
        if (!correctType('boolean', bin)) throw new SpudJSError(`Expected "boolean", got ${typeof bin}`);
        this.trashBin = bin;
        return this;
    }
    /**
     * Adds fast skipping
     * @param {Boolean} fastSkip - Determines whether this pagination can skip to the first and last pages.
     */
    fastSkip(fastSkip) {
        if (!correctType('boolean', fastSkip)) throw new SpudJSError(`Expected "boolean", got ${typeof fastSkip}`);
        this.fastSkip = fastSkip;
        return this;
    }
    /**
     * Sets the initial embeds
     * @param {EmbedBuilder[]} embeds - The embeds that is initialized with the pagination.
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
     * @param {EmbedBuilder} embed - The embed to add to this pagination
     */
    addEmbed(embed) {
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
    editButton(name, style) {
        // console.log(this.buttons, this.buttons[name])
        if (!allowedButtonsNames.some(x => x === name)) throw new SpudJSError('You didn\'t provide a valid button to edit!');
        if (!style || !(style instanceof Object) && !(style instanceof ButtonBuilder)) throw new SpudJSError('"style" argument has been passed incorrectly!');

        if (!['style', 'emoji', 'label'].some(x => x in style)) throw new SpudJSError('Invalid parameters given! Make sure you pass your style with one of the following properties "emoji", "style", "label"');

        for (const props in style) {
            if (['style', 'emoji', 'label'].some(x => x === props)) {
                this.buttons[name].data[props] = style[props];
            }
        }

        return this;
    }
    /**
     * Handles the entire interaction
     */
    async send() {
        const { filter, max, time } = this;

        const components = [];

        if (this.trashBin === true) {
            components.push(this.buttons.left, this.buttons.trash, this.buttons.right);
        }
        else {
            components.push(this.buttons.left, this.buttons.right);
        }
        if (this.fastSkip === true) {
            components.unshift(this.buttons.first);
            components.push(this.buttons.last);
        }


        let currentPage = 0;
        const len = this._embeds.length - 1;

        let msg;

        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [
                    this._embeds[currentPage],
                ],
                components: [
                    checkPage(currentPage, components, len),
                ],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [
                    this._embeds[currentPage],
                ],
                components: [
                    checkPage(currentPage, components, len),
                ],
            });
        }


        const collector = msg.createMessageComponentCollector({ filter, time, max });

        collector.on('collect', async (i) => {
            if (this.idle === true) {
                collector.resetTimer();
            }
            if (i.customId === 'right') {
                currentPage++;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            else if (i.customId === 'left') {
                currentPage--;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            else if (i.customId === 'right-fast') {
                currentPage = len;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            else if (i.customId === 'left-fast') {
                currentPage = 0;
                update(i, this._embeds, currentPage, checkPage(currentPage, components, len));
            }
            else if (i.customId === 'trash') {
                i.update({
                    components: [
                        new ActionRowBuilder().addComponents(...components.map(btn => btn.setDisabled(true))),
                    ],
                });
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (!this.interaction) {
                msg.edit({
                        components: [
                            checkPage('none', components, len),
                    ],
                });
            }
            else {
                this.commandType.editReply({
                        components: [
                            checkPage('none', components, len),
                    ],
                });
            }
        });
    }
}

module.exports = PaginationBuilder;