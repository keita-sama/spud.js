import { Builder } from './Builder';
import {
    type MessageReplyOptions,
    type InteractionReplyOptions,
    type RepliableInteraction,
    ButtonInteraction,
    Message,
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ComponentEmojiResolvable,
    MessageFlags,
    Collection,
    MessageComponentInteraction,
    ReadonlyCollection
} from 'discord.js';
import { SpudJSError } from './errors/SpudJSError';

// TODO: UHH, do types go in separate files?
type AcceptedSelectBuilders = StringSelectMenuBuilder | RoleSelectMenuBuilder;
type ButtonNames = 'previous' | 'next' | 'last' | 'first' | 'trash';

type EditButtonSyle = { style?: ButtonStyle; emoji?: ComponentEmojiResolvable; label?: string } & (
    | { style: ButtonStyle }
    | { emoji: ComponentEmojiResolvable }
    | { label: string }
);

interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>;
}

/* 
What is a page?

A page is obviously something with content
And things to interact with (not including the pagination buttons themselves)
Could be a link to a shop, a button that opens up yet another menu. Possibilities 
are endless!
*/

/**
 * Represents a Pagination Instance
 * @class
 */
export class PaginationBuilder extends Builder {
    pages: Page[];
    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;
    customComponents?: ActionRowBuilder<ButtonBuilder | AcceptedSelectBuilders>;
    customComponentHandler?: {
        onCollect?: (i: MessageComponentInteraction) => unknown;
        onEnd?: (collected?: ReadonlyCollection<any, any>, reason?: string) => unknown;
    };
    deleteMessage: boolean;

    buttons: Record<ButtonNames, ButtonBuilder>;
    /**
     * Sets the interaction used to collect inputs.
     * @param interaction
     */
    constructor(interaction: RepliableInteraction | Message) {
        super(interaction);
        this.interaction = interaction;
        this.pages = [];
        this.currentPage = 0;
        this.editableButtons = ['previous', 'next'];
        this.customComponentHandler = {};
        this.trashBin = false;
        this.fastSkip = false;
        this.deleteMessage = false;

        this.buttons = {
            trash: new ButtonBuilder().setCustomId('trash').setEmoji('🗑').setStyle(ButtonStyle.Danger),
            next: new ButtonBuilder().setCustomId('right').setEmoji('▶').setStyle(ButtonStyle.Primary),
            last: new ButtonBuilder().setCustomId('right-fast').setEmoji('⏩').setStyle(ButtonStyle.Primary),
            previous: new ButtonBuilder().setCustomId('left').setEmoji('◀').setStyle(ButtonStyle.Primary),
            first: new ButtonBuilder().setCustomId('left-fast').setEmoji('⏪').setStyle(ButtonStyle.Primary)
        };
    }

    /**
     * Sets the pages that will be used when paging.
     * @param pages
     */
    setPages(pages: Page[]): this {
        this.pages = pages;
        if (this.currentPage === 0) {
            this.setPage(0);
        }
        return this;
    }

    /**
     * Appends a new page. Useful when you have dynamic data.
     * @param page
     */
    addPage(page: Page): this {
        this.pages.push(page);
        return this;
    }

    /**
     * Adds two extra buttons that skips to the beginning and end of your pages.
     */
    addFastSkip(): this {
        this.fastSkip = true;
        this.editableButtons.push('last');
        this.editableButtons.unshift('first');
        return this;
    }

    /**
     * Adds an extra button that forcibly stops the collector.
     * @param deleteMessage - Determines whether the message will get deleted if this instance is trashed.
     */
    addTrashBin(deleteMessage?: boolean): this {
        if (deleteMessage) this.deleteMessage = deleteMessage;
        this.trashBin = true;
        this.editableButtons.push('trash');
        return this;
    }

    /**
     * Sets custom components that will be available regardless of page.
     * @param customComponents
     */
    setCustomComponets(customComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>): this {
        this.customComponents = customComponents;
        return this;
    }

    // TODO: FIX THE COLLECTION TYPE...maybe.
    /**
     * Sets the function used to handling custom components.
     * @param handler
     */
    setCustomComponentHandler(
        onCollect?: (i: MessageComponentInteraction) => unknown,
        onEnd?: (collected?: ReadonlyCollection<any, any>, reason?: string) => unknown
    ): this {
        if (onCollect) {
            this.customComponentHandler!.onCollect = onCollect;
        }
        if (onEnd) {
            this.customComponentHandler!.onEnd = onEnd;
        }

        return this;
    }
    /**
     * Method to custom paginations buttons if you so wish.
     * @param name - Name of the component you want to edit
     */
    editButton(name: ButtonNames, customStyle: ButtonBuilder | EditButtonSyle): this {
        if (customStyle instanceof ButtonBuilder) {
            this.buttons[name] = customStyle as ButtonBuilder;
        } else {
            if (customStyle.style) this.buttons[name].setStyle(customStyle.style);
            if (customStyle.label) this.buttons[name].setLabel(customStyle.label);
            if (customStyle.emoji) this.buttons[name].setEmoji(customStyle.emoji);
        }
        return this;
    }
    /**
     * Handles the interaction.
     * @async
     */
    async send(): Promise<void> {
        const { filter, maxInteractions: max, time } = this;

        let navigation = this.createNavigation();
        let totalPages = this.getPageCount();

        const messagePayload: MessageReplyOptions & InteractionReplyOptions = {
            embeds: [this.getPageEmbed()],
            components: navigation,
            allowedMentions: { repliedUser: this.mention }
        };

        if (this.messageOptions?.content) messagePayload.content = this.messageOptions.content;

        let initialMessage;
        if (this.isMessage()) {
            initialMessage = await (this.interaction as Message).reply(messagePayload);
        } else if (this.isInteraction()) {
            if (this.interaction instanceof ButtonInteraction) {
                const response = await this.interaction.reply({ ...messagePayload, withResponse: true });
                initialMessage = response.resource?.message;
            } else {
                initialMessage = await (this.interaction as RepliableInteraction).reply(messagePayload);
            }
        } else throw new SpudJSError('Something fucking happened.');

        const collector = initialMessage!.createMessageComponentCollector({
            filter,
            max,
            time: this.idle ? undefined : time,
            idle: this.idle ? time : undefined
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'right') {
                this.currentPage++;
            } else if (i.customId === 'right-fast') {
                this.currentPage = totalPages;
            } else if (i.customId === 'left') {
                this.currentPage--;
            } else if (i.customId === 'left-fast') {
                this.currentPage = 0;
            } else if (i.customId === 'trash') {
                await i.update({ components: [] });
                return collector.stop();
            } else if (i.customId) {
                if (this.customComponentHandler?.onCollect) await this.customComponentHandler!.onCollect(i)
            }
            // TODO: trashBin implementation + collector end functions.
            navigation = this.createNavigation();
            totalPages = this.getPageCount();

            await i.update({
                embeds: [this.getPageEmbed()],
                components: navigation
            });
        });

        collector.on('ignore', async (i) => {
            if (this.interactionOptions?.filterMessage) {
                return await i.reply({
                    content: this.interactionOptions.filterMessage,
                    flags: [MessageFlags.Ephemeral]
                });
            } else {
                return await i.reply({
                    content: 'This interaction was filtered. Did you invoke the command?',
                    flags: [MessageFlags.Ephemeral]
                });
            }
        });
        collector.on('end', async (collected, reason) => {
            if (this.deleteMessage) {
                await initialMessage!.delete();
            } else {
                await initialMessage!.edit({ components: [] });
            }
            if (this.customComponentHandler?.onEnd) {
                this.customComponentHandler?.onEnd(collected, reason)
            }
        });
    }

    private createPaginationComponents(): ButtonBuilder[] {
        const buttons = this.getPaginationButtons();
        const paginationComponents: ButtonBuilder[] = [];

        paginationComponents.push(buttons.previous);
        if (this.trashBin) paginationComponents.push(buttons.trash);
        paginationComponents.push(buttons.next);

        if (this.fastSkip) {
            paginationComponents.unshift(buttons.first);
            paginationComponents.push(buttons.last);
        }

        return paginationComponents;
    }

    getPaginationButtons(): Record<ButtonNames, ButtonBuilder> {
        const totalPage = this.getPageCount();
        const currentPage = this.currentPage;
        const { trash, last, first, previous, next } = this.buttons;

        this.buttons = {
            trash,
            next: next.setDisabled(currentPage === totalPage),
            last: last.setDisabled(currentPage === totalPage),
            previous: previous.setDisabled(currentPage === 0),
            first: first.setDisabled(currentPage === 0)
        };

        return this.buttons;
    }

    createNavigation() {
        const navigation: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>[] = [];

        const paginationComponentsRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();
        const pageComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined =
            this.getPageComponents();
        const customComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined =
            this?.customComponents;

        paginationComponentsRow.setComponents(this.createPaginationComponents());

        navigation.push(...[paginationComponentsRow, pageComponents, customComponents].filter((x) => x !== undefined));

        return navigation;
    }

    /**
     * @returns The current page's embed and components if it has any.
     */
    getPageData(): Page {
        return this.pages[this.currentPage];
    }

    /**
     * @returns The amount of pages present in this instance.
     */
    getPageCount(): number {
        return this.pages.length - 1;
    }

    /**
     * @returns This page's embed
     */
    getPageEmbed(): EmbedBuilder {
        return this.getPageData().embed;
    }

    /**
     * @returns This page's components if it has any.
     */

    getPageComponents(): ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined {
        return this.getPageData()?.components;
    }

    /**
     * @param page - The index of the page you would like to navigate to.
     * @returns The current Page's embed and components if it has any.
     */
    setPage(page: number): Page {
        this.currentPage = page;
        return this.getPageData();
    }
}
