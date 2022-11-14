import { EmbedBuilder } from "@discordjs/builders";

export default class MenuOption {
	public default: any;
	public value: any;
	public label: any;
	public description: any;
	public embed: any;
	public emoji: any;

    constructor() {
        this.default = false;
    }

    setLabel(label: string) {
        this.value = label.toLowerCase().replace(/ +/g, '_');
        this.label = label;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setEmbed(embed: EmbedBuilder) {
        this.embed = embed;
        return this;
    }

    setValue(value: void) {
        this.value = value;
        return this;
    }

    setDefault(def: Boolean) {
        this.default = def;
        return this;
    }

    setEmoji(emoji: string) {
        this.emoji = emoji;
        return this;
    }
}