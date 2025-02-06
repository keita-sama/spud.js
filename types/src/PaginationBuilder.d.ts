import { Builder } from './Builder';
import { type RepliableInteraction, Message, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ComponentEmojiResolvable, MessageComponentInteraction, ReadonlyCollection } from 'discord.js';
type AcceptedSelectBuilders = StringSelectMenuBuilder | RoleSelectMenuBuilder;
type ButtonNames = 'previous' | 'next' | 'last' | 'first' | 'trash';
type EditButtonSyle = {
    style?: ButtonStyle;
    emoji?: ComponentEmojiResolvable;
    label?: string;
} & ({
    style: ButtonStyle;
} | {
    emoji: ComponentEmojiResolvable;
} | {
    label: string;
});
interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>;
}
/**
 * Represents a Pagination Instance
 * @class
 */
export declare class PaginationBuilder<T extends RepliableInteraction | Message> extends Builder<T> {
    private pages;
    private currentPage;
    private editableButtons;
    private trashBin;
    private fastSkip;
    private deleteMessage;
    customComponents?: ActionRowBuilder<ButtonBuilder | AcceptedSelectBuilders>;
    customComponentHandler?: {
        onCollect?: (i: MessageComponentInteraction) => unknown;
        onEnd?: (collected?: ReadonlyCollection<any, any>, reason?: string, initialMessage?: Message) => unknown;
    };
    buttons: Record<ButtonNames, ButtonBuilder>;
    /**
     * Sets the interaction used to collect inputs.
     * @param interaction
     */
    constructor(interaction: T);
    /**
     * Sets the pages that will be used when paging.
     * @param pages
     */
    setPages(pages: Page[]): this;
    /**
     * Appends a new page. Useful when you have dynamic data.
     * @param page
     */
    addPage(page: Page): this;
    /**
     * Adds two extra buttons that skips to the beginning and end of your pages.
     */
    addFastSkip(): this;
    /**
     * Adds an extra button that forcibly stops the collector.
     * @param deleteMessage - Determines whether the message will get deleted if this instance is trashed.
     */
    addTrashBin(deleteMessage?: boolean): this;
    /**
     * Sets custom components that will be available regardless of page.
     * @param customComponents
     */
    setCustomComponets(customComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>): this;
    /**
     * Sets the function used to handling custom components.
     * @param handler
     */
    setCustomComponentHandler(onCollect?: (i: MessageComponentInteraction) => unknown, onEnd?: (collected?: ReadonlyCollection<any, any>, reason?: string, initialMessage?: Message) => unknown): this;
    /**
     * Method to custom paginations buttons if you so wish.
     * @param name - Name of the component you want to edit
     */
    editButton(name: ButtonNames, customStyle: ButtonBuilder | EditButtonSyle): this;
    /**
     * Handles the interaction.
     * @async
     */
    send(): Promise<void>;
    protected createPaginationComponents(): ButtonBuilder[];
    protected getPaginationButtons(): Record<ButtonNames, ButtonBuilder>;
    private createNavigation;
    /**
     * @returns The current page's embed and components if it has any.
     */
    getPageData(): Page;
    /**
     * @returns The amount of pages present in this instance.
     */
    getPageCount(): number;
    /**
     * @returns This page's embed
     */
    getPageEmbed(): EmbedBuilder;
    /**
     * @returns This page's components if it has any.
     */
    getPageComponents(): ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined;
    /**
     * @param page - The index of the page you would like to navigate to.
     * @returns The current Page's embed and components if it has any.
     */
    setPage(page: number): Page;
}
export {};
