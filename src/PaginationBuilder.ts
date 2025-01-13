import { Builder } from "./Builder";
import {
    Message,
    ButtonStyle, // TODO: USE THIS [x]
    type Interaction,
    EmbedBuilder,
    ButtonBuilder,
    type SelectMenuType,
    ActionRowBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    ButtonInteraction,
    BaseInteraction
} from "discord.js";
import { SpudJSError } from "./Errors/SpudJSError";

interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder;
}

type ButtonNames = "previous" | "next" | "last" | "first" | "trash";

const buttons = {
    trash: new ButtonBuilder().setCustomId("trash").setEmoji("🗑").setStyle(ButtonStyle.Danger),
    next: new ButtonBuilder().setCustomId("right").setEmoji("▶").setStyle(ButtonStyle.Primary),
    last: new ButtonBuilder().setCustomId("right-fast").setEmoji("⏩").setStyle(ButtonStyle.Primary),
    previous: new ButtonBuilder().setCustomId("left").setEmoji("◀").setStyle(ButtonStyle.Primary).setDisabled(true),
    first: new ButtonBuilder().setCustomId("left-fast").setEmoji("⏪").setStyle(ButtonStyle.Primary).setDisabled(true)
};

// TODO: Finish this class - it should represet a page
/* 
What is a page?

A page is obviously something with content
And things to interact with (not including the pagination buttons themselves)
Could be a link to a shop, a button that opens up yet another menu. Possibilities 
are endless!
*/

// TODO: UHH, do types go in separate files?
type ReplyableInteraction = ChatInputCommandInteraction | ButtonInteraction;

export class PaginationBuilder extends Builder {
    pages: Page[];
    buttons: Record<string, ButtonBuilder>; // FIXME: fix the type;

    // TODO: Fully remove this later, keeping it incase i drop the Page stuff
    // linkedComponents?: (ButtonBuilder | SelectMenuType)[];

    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;

    // TODO: Add functionality to this. They use separate logic and work on their own row
    customComponents?: (ButtonBuilder | SelectMenuType)[];
    customComponentHandler?: Function;

    constructor(interaction: ReplyableInteraction | Message) {
        super(interaction);
        this.interaction = interaction;
        this.pages = [];

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

    setCustomComponentHandler(handler: (i: Interaction, ...args: any[]) => unknown): this {
        this.customComponentHandler = handler;
        return this;
    }

    async send(): Promise<void> {
        const { filter, maxInteractions: max, time } = this;
        const navigation: ActionRowBuilder[] = [];

        const paginationComponentsRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();
        const customComponents = this.getPageComponents();

        paginationComponentsRow.setComponents(this.createPaginationComponents());

        let initialMessage;

        if (this.isMessage()) {
            initialMessage = await (this.interaction as Message).reply({
                //content: this.content,
                embeds: [this.getPageEmbed()],
                components: [paginationComponentsRow, customComponents],
            });
        } else if (this.isInteraction()) {
            initialMessage = await (this.interaction as ReplyableInteraction).reply({ content: "sex" });
        } else throw new SpudJSError("Something fucking happened.");

        const collector = initialMessage.createMessageComponentCollector({
            filter,
            max,
            time
        });
    }

    getPage(): Page {
        return this.pages[this.currentPage];
    }

    getPageEmbed(): EmbedBuilder {
        return this.getPage().embed;
    }
    getPageComponents(): ActionRowBuilder | undefined {
        return this.getPage().components;
    }
    setPage(page: number): Page {
        this.currentPage = page;
        return this.getPage();
    }

    createPaginationComponents(): ButtonBuilder[] {
        const paginationComponents: ButtonBuilder[] = [];

        paginationComponents.push(this.buttons.previous);
        if (this.trashBin) paginationComponents.push(this.buttons.trash);
        paginationComponents.push(this.buttons.next);

        if (this.fastSkip) {
            paginationComponents.unshift(this.buttons.first);
            paginationComponents.unshift(this.buttons.last);
        }

        return paginationComponents;
    }
}
