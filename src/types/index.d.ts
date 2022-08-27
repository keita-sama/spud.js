import { EmbedBuilder } from "discord.js";
import BuilderBase from '../BaseBuilder';
import BuilderPagination from "../PaginationBuilder";
import BuilderMenu from '../MenuBuilder';

export interface MenuOption {
    label: string;
    value: string;
    embed: EmbedBuilder;
    description?: string;
    default?: boolean;
    emoji?: string
}

export class BaseBuilder extends BuilderBase {
    constructor(message: string);

    disableMention(mention: boolean): this;
    setTime(duration: number): this;
    setFilter(filter: Function): this;
    setMax(max: number): this;
    setIdle(idle: boolean): this;
    setContent(content: string): this;
}

export class MenuBuilder extends BuilderMenu implements BuilderBase {
    constructor(message: string);

    setPlaceholder(placeholder: string): this;
    setMenuOptions(options: MenuOption[] | object): this;
    addMenuOption(input: Function | MenuOption): this;
    getOptions(): MenuOption[];
    send(): void;
}

export class PaginationBuilder extends BuilderPagination implements BuilderBase {
    constructor(message: string);

    trashBin(bin: boolean): this;
    fastSkip(fastSkip: boolean): this;
    setEmbeds(embeds: EmbedBuilder[] | object): this;
    addEmbed(embed: EmbedBuilder | object): this;
    getEmbeds(): EmbedBuilder[];
    send(): void;
}