import { Builder } from './Builder';
import {
    type ButtonInteraction,
    type MessageReplyOptions,
    type InteractionReplyOptions,
    type RepliableInteraction,
    Message,
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    RoleSelectMenuBuilder
} from 'discord.js';
import { SpudJSError } from './errors/SpudJSError';

// TODO: UHH, do types go in separate files?
type AcceptedSelectBuilders = StringSelectMenuBuilder | RoleSelectMenuBuilder;
type ButtonNames = 'previous' | 'next' | 'last' | 'first' | 'trash';

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
    customComponentHandler?: Function;
    deleteMessage: boolean;
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
        this.trashBin = false;
        this.fastSkip = false;
        this.deleteMessage = false;
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
        this.editableButtons.push('first');
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

    /**
     * Sets the function used to handling custom components.
     * @param handler
     */
    setCustomComponentHandler(handler: (i: ButtonInteraction) => any): this {
        this.customComponentHandler = handler;
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

        const messagePayload: MessageReplyOptions = {
            embeds: [this.getPageEmbed()],
            components: navigation,
            allowedMentions: { repliedUser: this.mention }
        };

        if (this.messageOptions?.content) messagePayload.content = this.messageOptions.content;
        // if (this.messageOptions?.files) messagePayload.files = this.messageOptions.content;

        let initialMessage;
        if (this.isMessage()) {
            initialMessage = await (this.interaction as Message).reply(messagePayload);
        } else if (this.isInteraction()) {
            initialMessage = await (this.interaction as RepliableInteraction).reply(
                messagePayload as InteractionReplyOptions
            );
        } else throw new SpudJSError('Something fucking happened.');

        const collector = initialMessage.createMessageComponentCollector({
            filter,
            max,
            time,
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
                if (this.customComponentHandler) await this.customComponentHandler(i);
            }
            // TODO: trashBin implementation + collector end functions.
            navigation = this.createNavigation();
            totalPages = this.getPageCount();

            await i.update({
                embeds: [this.getPageEmbed()],
                components: navigation
            });
        });

        collector.on('end', async () => {
            if (this.deleteMessage) {
                await initialMessage.delete();
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
            paginationComponents.unshift(buttons.last);
        }

        return paginationComponents;
    }

    getPaginationButtons(): Record<ButtonNames, ButtonBuilder> {
        const totalPage = this.getPageCount();
        const currentPage = this.currentPage;

        return {
            trash: new ButtonBuilder()
                .setCustomId('trash')
                .setEmoji('🗑')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(false),
            next: new ButtonBuilder()
                .setCustomId('right')
                .setEmoji('▶')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPage),
            last: new ButtonBuilder()
                .setCustomId('right-fast')
                .setEmoji('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPage),
            previous: new ButtonBuilder()
                .setCustomId('left')
                .setEmoji('◀')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
            first: new ButtonBuilder()
                .setCustomId('left-fast')
                .setEmoji('⏪')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0)
        };
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
