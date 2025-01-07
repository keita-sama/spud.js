import { Builder } from "./Builder";
import {
    Message,
    ButtonStyle, // TODO: USE THIS
    type Interaction,
    EmbedBuilder,
    ButtonBuilder,
    type SelectMenuType,
    ActionRowBuilder
} from "discord.js";

import { Page } from "./structures/Page";
import { type PageItem } from "./structures/Page";

type ButtonNames = "previous" | "next" | "last" | "first" | "trash";

const buttons = {
    trash: new ButtonBuilder()
        .setCustomId("trash")
        .setEmoji("🗑")
        .setStyle(ButtonStyle.Danger),
    next: new ButtonBuilder()
        .setCustomId("right")
        .setEmoji("▶")
        .setStyle(ButtonStyle.Primary),
    last: new ButtonBuilder()
        .setCustomId("right-fast")
        .setEmoji("⏩")
        .setStyle(ButtonStyle.Primary),
    previous: new ButtonBuilder()
        .setCustomId("left")
        .setEmoji("◀")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    first: new ButtonBuilder()
        .setCustomId("left-fast")
        .setEmoji("⏪")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
};

// TODO: Finish this class - it should represet a page
/* 
What is a page?

A page is obviously something with content
And things to interact with (not including the pagination buttons themselves)
Could be a link to a shop, a button that opens up yet another menu. Possibilities 
are endless!
*/

export class PaginationBuilder<T extends Message | Interaction> extends Builder<T> {
    pages: Page[];
    buttons: object; // FIXME: fix the type;
    linkedComponents?: (ButtonBuilder | SelectMenuType)[];

    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;

    customComponents?: (ButtonBuilder | SelectMenuType)[];
    customComponentHandler?: Function;

    constructor(commandType: T) {
        super(commandType);
        this.pages = [];

        // TODO: add the buttons
        this.buttons = buttons;
        this.currentPage = 0;
        this.editableButtons = ["previous", "next"];
        this.trashBin = false;
        this.fastSkip = false;
    }

    setPages(pages: PageItem[]): this {

        const newPages = pages.map(page => new Page(page));
        this.pages = newPages;
        return this;
    }

    addPage(page: PageItem): this {
        const newPage = new Page(page);
        this.pages.push(newPage);

        return this;
    }

    addFastSkip(): this {
        this.fastSkip = true;
        this.editableButtons.push("last");
        this.editableButtons.push("first");
        return this;
    }

    addTrashBin(): this {
        this.trashBin = true;
        this.editableButtons.push("trash");
        return this;
    }
}
