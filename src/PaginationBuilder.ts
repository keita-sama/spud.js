import { Builder } from "./Builder";
import {
    Message,
    ButtonStyle, // TODO: USE THIS [x]
    type Interaction,
    EmbedBuilder,
    ButtonBuilder,
    type SelectMenuType,
    ActionRowBuilder
} from "discord.js";
import type { MessageBuilder } from "./MessageBuilder";
import type { InteractionBuilder } from "./InteractionBuilder";

interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder;
}

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

export class PaginationBuilder extends Builder {
    pages: Page[];
    buttons: object; // FIXME: fix the type;

    // TODO: Fully remove this later, keeping it incase i drop the Page stuff
    // linkedComponents?: (ButtonBuilder | SelectMenuType)[];

    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;

    // TODO: Similar to the linkedComponents thing, scrapping in favour of Page, keeping just in case
    //customComponents?: (ButtonBuilder | SelectMenuType)[];
    customComponentHandler?: Function;

    constructor(interaction: Interaction | Message) {
        super(interaction)
        this.interaction = interaction;
        this.pages = [];

        // TODO: add the buttons [x]
        this.buttons = buttons;
        this.currentPage = 0;
        this.editableButtons = ["previous", "next"];
        this.trashBin = false;
        this.fastSkip = false;
    }

    setPages(pages: Page[]): this {
        this.pages = pages;
        return this;
    }

    addPage(page: Page): this {
        this.pages.push(page);

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

    setCustomComponentHandler(handler: (i: Interaction) => unknown): this {
        this.customComponentHandler = handler;
        return this;
    }
}
