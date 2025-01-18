import { Builder } from "./Builder";
import {
    type Interaction,
    type MessageReplyOptions,
    type InteractionReplyOptions,
    Message,
    ButtonStyle,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ButtonInteraction,
    StringSelectMenuBuilder,
    RoleSelectMenuBuilder
} from "discord.js";
import { SpudJSError } from "./errors/SpudJSError";

// TODO: UHH, do types go in separate files?
type ReplyableInteraction = ChatInputCommandInteraction | ButtonInteraction;
type AcceptedSelectBuilders = StringSelectMenuBuilder | RoleSelectMenuBuilder;
type ButtonNames = "previous" | "next" | "last" | "first" | "trash";

interface Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>;
}

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
    buttons: Record<string, ButtonBuilder> | undefined;
    currentPage: number;
    editableButtons: ButtonNames[];
    trashBin: boolean;
    fastSkip: boolean;

    // TODO: Add functionality to this. They use separate logic and work on their own row
    // customComponents?: (ButtonBuilder | SelectMenuType)[];
    customComponentHandler?: Function;

    constructor(interaction: ReplyableInteraction | Message) {
        super(interaction);
        this.interaction = interaction;
        this.pages = [];
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

    setCustomComponentHandler(handler: (i: Interaction, ...args: any[]) => any): this {
        this.customComponentHandler = handler;
        return this;
    }

    async send(): Promise<void> {
        const { filter, maxInteractions: max, time } = this;

        let navigation = this.createNavigation();
        let totalPages = this.getPageCount();
        // FIXME: Type this properly.
        // Construction of payload
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
            initialMessage = await (this.interaction as ReplyableInteraction).reply(messagePayload as InteractionReplyOptions);
        } else throw new SpudJSError("Something fucking happened.");

        const collector = initialMessage.createMessageComponentCollector({
            filter,
            max,
            time,
            idle: this.idle ? time : undefined
        });

        collector.on("collect", async (i) => {
            if (i.customId === "right") {
                this.currentPage++;
            } else if (i.customId === "right-fast") {
                this.currentPage = totalPages;
            } else if (i.customId === "left") {
                this.currentPage--;
            } else if (i.customId === "left-fast") {
                this.currentPage = 0;
            }

            navigation = this.createNavigation();
            totalPages = this.getPageCount();

            await i.update({
                embeds: [this.getPageEmbed()],
                components: navigation
            });
        });
    }

    getPageData(): Page {
        return this.pages[this.currentPage];
    }
    getPageCount(): number {
        return this.pages.length - 1;
    }
    getPageEmbed(): EmbedBuilder {
        return this.getPageData().embed;
    }
    getPageComponents(): ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined {
        return this.getPageData().components;
    }
    setPage(page: number): Page {
        this.currentPage = page;
        return this.getPageData();
    }

    createPaginationComponents(): ButtonBuilder[] {
        const buttons = this.getPaginationButtons()
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
                .setCustomId("trash")
                .setEmoji("🗑")
                .setStyle(ButtonStyle.Danger),
            next: new ButtonBuilder()
                .setCustomId("right")
                .setEmoji("▶")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPage),
            last: new ButtonBuilder()
                .setCustomId("right-fast")
                .setEmoji("⏩")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === totalPage),
            previous: new ButtonBuilder()
                .setCustomId("left")
                .setEmoji("◀")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
            first: new ButtonBuilder()
                .setCustomId("left-fast")
                .setEmoji("⏪")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0)
        };
    }

    createNavigation() {
        const navigation: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder>[] = [];

        const paginationComponentsRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();
        const customComponents: ActionRowBuilder<AcceptedSelectBuilders | ButtonBuilder> | undefined = this.getPageComponents();

        paginationComponentsRow.setComponents(this.createPaginationComponents());

        navigation.push(...[paginationComponentsRow, customComponents].filter((x) => x !== undefined));

        return navigation;
    }
}
