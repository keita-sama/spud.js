import type { CommandInteraction, Message, ButtonBuilder, EmbedBuilder, Interaction } from "discord.js";

type PaginationButtons = "next" | "previous" | "last" | "first" | "trash";

export interface MenuOption {
    label: string;
    value: string;
    embed: EmbedBuilder;
    description?: string;
    default?: boolean;
    emoji?: string;
}

declare class Builder {
    constructor(commandType: CommandInteraction | Message);

    disableMention(mention: boolean): this;
    setTime(duration: number): this;
    setFilter(filter: Function): this;
    setMax(max: number): this;
    setIdle(idle: boolean): this;
    setContent(content: string): this;
}

declare class MenuBuilder extends Builder {
    constructor(commandType: CommandInteraction | Message);

    setPlaceholder(placeholder: string): MenuBuilder;
    setMenuOptions(options: MenuOption[] | object): MenuBuilder;
    addMenuOption(input: Function | MenuOption): MenuBuilder;
    getOptions(): MenuOption[];
    send(): void;
}

declare class PaginationBuilder extends Builder {
    constructor(commandType: CommandInteraction | Message);

    trashBin(bin: boolean): PaginationBuilder;
    fastSkip(fastSkip: boolean): PaginationBuilder;
    setEmbeds(
        embeds: EmbedBuilder[] | object,
        linkedComponents: ButtonBuilder[]
    ): PaginationBuilder;
    addEmbed(embed: EmbedBuilder | object): PaginationBuilder;
    getEmbeds(): EmbedBuilder[];
    editButton(button: PaginationButtons, updated: Function): PaginationBuilder;
    send(callback: (i: Interaction) => any): void;
}