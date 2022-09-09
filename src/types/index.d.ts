import { EmbedBuilder } from 'discord.js';

export interface MenuOption {
    label: string;
    value: string;
    embed: EmbedBuilder;
    description?: string;
    default?: boolean;
    emoji?: string
}

declare class BaseBuilder {
    constructor(message: string);

    disableMention(mention: boolean): this;
    setTime(duration: number): this;
    setFilter(filter: Function): this;
    setMax(max: number): this;
    setIdle(idle: boolean): this;
    setContent(content: string): this;
}

declare class MenuBuilder extends BaseBuilder {
    constructor(message: string);

    setPlaceholder(placeholder: string): MenuBuilder;
    setMenuOptions(options: MenuOption[] | object): MenuBuilder;
    addMenuOption(input: Function | MenuOption): MenuBuilder;
    getOptions(): MenuOption[];
    send(): void;
}

declare class PaginationBuilder extends BaseBuilder {
    constructor(message: string);

    trashBin(bin: boolean): PaginationBuilder;
    fastSkip(fastSkip: boolean): PaginationBuilder;
    setEmbeds(embeds: EmbedBuilder[] | object): PaginationBuilder;
    addEmbed(embed: EmbedBuilder | object): PaginationBuilder;
    getEmbeds(): EmbedBuilder[];
    send(): void;
}