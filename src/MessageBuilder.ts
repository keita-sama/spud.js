import {
    Message,
    type Interaction,
    type MessageCreateOptions
} from "discord.js";

export class MessageBuilder {
    // Default Properties of a Builder;
    message: Message;
    mention: boolean;
    idle: boolean;
    time: number;
    // FIXME: Correctly type this later on.
    filter: Function;

    content?: string | MessageCreateOptions;
    maxInteractions?: number;

    constructor(message: Message) {
        this.message = message;
        this.mention = true;
        this.idle = false;
        this.filter = (interaction: Interaction) =>
            interaction.user.id === message.author.id;
        this.time = 15 * 1000; // 15 seconds default;
    }

    // TODO: Add old methods; new one for consistency;
    setMention(allowMention: boolean = true): this {
        this.mention = allowMention;
        return this;
    }

    setIdle(allowIdling: boolean = true): this {
        this.idle = allowIdling;
        return this;
    }

    setCustomFilter(customFilter: Function): this {
        this.filter = customFilter;
        return this;
    }

    setTime(time: number): this {
        this.time = time;
        return this;
    }

    setContent(messageContent: string | MessageCreateOptions): this {
        this.content = messageContent;
        return this;
    }

    setMaxInteractions(maxInteractions: number): this {
        this.maxInteractions = maxInteractions;
        return this;
    }
}
