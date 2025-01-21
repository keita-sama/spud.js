import { Builder } from "./Builder";
import { type ButtonInteraction, type RepliableInteraction, Message, EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder } from "discord.js";
type AcceptedSelectBuilders = StringSelectMenuBuilder | RoleSelectMenuBuilder;
type ButtonNames = "previous" | "next" | "last" | "first" | "trash";
interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>;
}
/**
 * Represents a Pagination Instance
 * @class
 */
export declare class PaginationBuilder extends Builder {
    pages: Page[];
    buttons: Record<string, ButtonBuilder> | undefined;
    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;
    customComponents?: ActionRowBuilder<ButtonBuilder | AcceptedSelectBuilders>;
    customComponentHandler?: Function;
    /**
     * Sets the interaction used to collect inputs.
     * @param interaction
     */
    constructor(interaction: RepliableInteraction | Message);
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
     */
    addTrashBin(): this;
    /**
     * Sets custom components that will be available regardless of page.
     * @param customComponents
     */
    setCustomComponets(customComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>): this;
    /**
     * Sets the function used to handling custom components.
     * @param handler
     */
    setCustomComponentHandler(handler: (i: ButtonInteraction) => any): this;
    /**
     * Handles the interaction.
     * @async
     */
    send(): Promise<void>;
    getPageData(): Page;
    getPageCount(): number;
    getPageEmbed(): EmbedBuilder;
    getPageComponents(): ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined;
    setPage(page: number): Page;
    createPaginationComponents(): ButtonBuilder[];
    getPaginationButtons(): Record<ButtonNames, ButtonBuilder>;
    createNavigation(): ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>[];
}
export {};
