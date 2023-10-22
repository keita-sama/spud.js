import { CommandInteraction, EmbedBuilder, Message } from 'discord.js';

type PaginationButtons = 'next' | 'previous' | 'last' | 'first' | 'trash';

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

    setTime(durationSeconds: number): this;
    setFilter(filter: Function): this;
    setMax(maxInteractions: number): this;
    setIdle(idle: boolean): this;
    setContent(content: string): this;
    disableMention(mention: boolean): this;
    setInteraction(options: any): this;
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
    setEmbeds(embeds: EmbedBuilder[] | object): PaginationBuilder;
    addEmbed(embed: EmbedBuilder | object): PaginationBuilder;
    getEmbeds(): EmbedBuilder[];
    setButton(button: PaginationButtons, updated: Function): PaginationBuilder;
    send(): void;
}
