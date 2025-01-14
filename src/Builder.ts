import { type Interaction, type MessageCreateOptions, Message, ChatInputCommandInteraction, ButtonInteraction, BaseInteraction } from "discord.js";

import { SpudJSError } from "./errors/SpudJSError";

interface InteractionOptions {
    type: "reply" | "send";
}

type ReplyableInteraction = ChatInputCommandInteraction | ButtonInteraction;
type SafeMessageOptions = Omit<MessageCreateOptions, 'embeds' | 'components'>
type FilterFunction<F> = (...args: F[]) => boolean;

export class Builder {
    // Default Properties of a Builder;
    interaction: ReplyableInteraction | Message;
    mention: boolean;
    idle: boolean;
    time: number;
    filter: FilterFunction<any>;
    interactionOptions: any; // FIXME
    messageOptions?: SafeMessageOptions;
    maxInteractions?: number;

    constructor(interaction: ReplyableInteraction | Message) {
        this.interaction = interaction;
        this.mention = true;
        this.idle = false;

        // Default to Interaction, change to message if detected.
        this.filter = (collectorInteraction: Interaction) => collectorInteraction.user.id === (this.interaction as ReplyableInteraction).user.id;

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
