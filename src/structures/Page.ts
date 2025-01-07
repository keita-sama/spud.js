import { EmbedBuilder, ActionRowBuilder } from "discord.js";

export interface PageItem {
    embed: EmbedBuilder,
    components?: ActionRowBuilder;
}

export class Page {
    embed: EmbedBuilder;
    components?: ActionRowBuilder;

    constructor({ embed, components }: PageItem) {
        this.embed = embed;
        if (components) this.components = components;
    }
}