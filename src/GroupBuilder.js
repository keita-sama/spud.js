const { ButtonBuilder, ActionRowBuilder, Message, SelectMenuBuilder } = require('discord.js');
const Builder = require('./Builder');
const createButton = (id, emoji, style) => new ButtonBuilder().setCustomId(id).setEmoji(emoji).setStyle(style);

function createActionRow(cur, components, max) {
    switch (cur) {
        case 0:
            return new ActionRowBuilder().addComponents(components.map(btn => btn.data.custom_id.startsWith('left') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case max:
            return new ActionRowBuilder().addComponents(components.map(btn => btn.data.custom_id.startsWith('right') ? btn.setDisabled(true) : btn.setDisabled(false)));
        case 'none':
            return new ActionRowBuilder().addComponents(components.map(btn => btn.setDisabled(true)));
        case 'all':
            return new ActionRowBuilder().addComponents(components.map(btn => btn.setDisabled(false)));
        default:
            return new ActionRowBuilder().addComponents(components.map(btn => btn.setDisabled(false)));
    }
}

function update(interaction, self, rows) {
    return interaction.update({
        embeds: [
            self._groups.find(x => x.name === self.currentGroup).embeds[self.currentPage],
        ],
        components: rows,
    });
}

class GroupBuilder extends Builder {
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
        this.currentPage = 0;
        this.placeholder = 'Click here to change the group.';
    }
    _len() {
        return this._groups.find(x => x.name === this.currentGroup).embeds.length - 1;
    }
    _paginationRow(other) {
        return createActionRow((other || this.currentPage), this.components, this._len());
    }
    /**
     * Adds a extra button that can be used to end the current pagination
     * @param {Boolean} bin - Determines whether this pagination has a trashbin.
     */
    trashBin(bin) {
        this.trashBin = bin;
        return this;
    }
    /**
     * Adds fast skipping
     * @param {Boolean} fastSkip - Determines whether this pagination can skip to the first and last pages.
     */
    fastSkip(fastSkip) {
        this.fastSkip = fastSkip;
        return this;
    }
    /**
     * Sets the initial embeds
     * @param {EmbedBuilder[]} embeds - The embeds that is initialized with the pagination.
     */
    setGroups(embeds) {
        this.currentGroup = embeds[0].name;
        this._groups = embeds;
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    editButton(name, style) {
        for (const props in style) {
            if (['style', 'emoji', 'label'].some(x => x === props)) this.buttons[name].data[props] = style[props];
        }
        return this;
    }
    /**
     * Handles the entire interaction
     */
    async send() {
        const { filter, max, time } = this;
        this.components = [];
        const options = this._groups.map(option => {
            return {
                label: option.name,
                value: option.name,
                emoji: option?.emoji,
            };
        });
        const menu = new SelectMenuBuilder()
            .setPlaceholder(this.placeholder)
            .addOptions(options)
            .setCustomId('spud-select-group');
        const menuActionRow = new ActionRowBuilder().addComponents(menu);

        if (this.trashBin === true) {
            this.components.push(this.buttons.left, this.buttons.trash, this.buttons.right);
        }
        else {
            this.components.push(this.buttons.left, this.buttons.right);
        }
        if (this.fastSkip === true) {
            this.components.unshift(this.buttons.first);
            this.components.push(this.buttons.last);
        }

        let msg;
        if (!this.interaction) {
            msg = await this.commandType.reply({
                content: this.content,
                embeds: [
                    this._groups.find(x => x.name === this.currentGroup).embeds[this.currentPage],
                ],
                components: [this._paginationRow(), menuActionRow],
                allowedMentions: { repliedUser: this.shouldMention },
            });
        }
        else {
            msg = await this.commandType[this.interactionOptions.type]({
                content: this.content,
                embeds: [
                    this._groups.find(x => x.name === this.currentGroup).embeds[this.currentPage],
                ],
                components: [this._paginationRow(), menuActionRow],
            });
        }

        const collector = msg.createMessageComponentCollector({ filter, time, max });

        collector.on('collect', async (i) => {
            if (i.customId === 'spud-select-group') {
                this.currentGroup = i.values[0];
                this.currentPage = 0;
                update(i, this, [this._paginationRow(), menuActionRow]);
            }
            if (this.idle === true) {
                collector.resetTimer();
            }
            if (i.customId === 'right') {
                this.currentPage++;
                update(i, this, [this._paginationRow(), menuActionRow]);
            }
            else if (i.customId === 'left') {
                this.currentPage--;
                update(i, this, [this._paginationRow(), menuActionRow]);
            }
            else if (i.customId === 'right-fast') {
                this.currentPage = this._len();
                update(i, this, [this._paginationRow(), menuActionRow]);
            }
            else if (i.customId === 'left-fast') {
                this.currentPage = 0;
                update(i, this, [this._paginationRow(), menuActionRow]);
            }
            else if (i.customId === 'trash') {
                i.update({});
                collector.stop();
            }
        });

        collector.on('end', () => {
            const disabledMenu = new ActionRowBuilder().addComponents(menu.setPlaceholder('Expired').setDisabled(true));
            if (this.commandType instanceof Message) {
                msg.edit({
                    components: [this._paginationRow('none'), disabledMenu],
                });
            }
            else {
                this.commandType.editReply({
                    components: [this._paginationRow('none'), disabledMenu],
                });
            }
        });
    }
}

module.exports = GroupBuilder;