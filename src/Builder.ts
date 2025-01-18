import { 
    type Interaction,
    type MessageReplyOptions,
    type RepliableInteraction,
    Message,
    ChatInputCommandInteraction,
    ButtonInteraction,
    BaseInteraction,
    MessageContextMenuCommandInteraction,
} from "discord.js";

import { SpudJSError } from "./errors/SpudJSError";

interface InteractionOptions {
    type: "reply" | "send";
}

//type ReplyableInteraction = ChatInputCommandInteraction | ButtonInteraction | MessageContextMenuCommandInteraction;
type SafeMessageOptions = Omit<MessageReplyOptions, "embeds" | "components">;
type FilterFunction<F> = (...args: F[]) => boolean;

export class Builder {
    // Default Properties of a Builder;
    interaction: RepliableInteraction | Message;
    mention: boolean;
    idle: boolean;
    time: number;
    filter: FilterFunction<any>;
    interactionOptions: any; // FIXME
    messageOptions?: SafeMessageOptions;
    maxInteractions?: number;

    constructor(interaction: RepliableInteraction | Message) {
        this.interaction = interaction;
        this.mention = true;
        this.idle = false;

        // Default to Interaction, change to message if detected.
        this.filter = (collectorInteraction: Interaction) => collectorInteraction.user.id === (this.interaction as RepliableInteraction).user.id;

        if (this.interaction instanceof Message) {
            this.filter = (collectorInteraction: Interaction) => collectorInteraction.user.id === (this.interaction as Message).author.id;
        }

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

    setCustomFilter(customFilter: FilterFunction<any>): this {
        this.filter = customFilter;
        return this;
    }

    setTime(time: number): this {
        this.time = time;
        return this;
    }

    setMesage(messageOptions: SafeMessageOptions): this {
        this.messageOptions = messageOptions;
        return this;
    }

    setMaxInteractions(maxInteractions: number): this {
        this.maxInteractions = maxInteractions;
        return this;
    }

    setInteractionOptions(options: InteractionOptions): this {
        this.interactionOptions = options;
        return this;
    }

    // Type Guards (because fuck ts)
    isMessage(): boolean {
        return this.interaction instanceof Message;
    }

    isInteraction(): boolean {
        return this.interaction instanceof BaseInteraction;
    }
}
