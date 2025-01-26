import {
    type Interaction,
    type MessageReplyOptions,
    type RepliableInteraction,
    Message,
    BaseInteraction
} from "discord.js";

interface InteractionOptions {
    type: "reply" | "send",
    filterMessage?: string;
}

type SafeMessageOptions = Omit<MessageReplyOptions, "embeds" | "components">;
type FilterFunction<F> = (...args: F[]) => boolean;

/**
 * Class representing the core. Implements standard methods.
 * @class
 */
export class Builder {
    interaction: RepliableInteraction | Message;
    mention: boolean;
    idle: boolean;
    time: number;
    filter: FilterFunction<any>;
    interactionOptions: any; // FIXME
    messageOptions?: SafeMessageOptions;
    maxInteractions?: number;

    /** Intialize the interaction to use
     * @param interaction - Interaction used to attach the collector.
     */
    constructor(interaction: RepliableInteraction | Message) {
        this.interaction = interaction;
        this.mention = true;
        this.idle = false;

        // Default to Interaction, change to message if detected.
        this.filter = (collectorInteraction: Interaction) =>
            collectorInteraction.user.id === (this.interaction as RepliableInteraction).user.id;

        if (this.interaction instanceof Message) {
            this.filter = (collectorInteraction: Interaction) =>
                collectorInteraction.user.id === (this.interaction as Message).author.id;
        }

        // TODO: ADD A FILTER MESSAGE THING, there's indication,
        this.time = 15 * 1000; // 15 seconds default;
    }

    /**
     * Allows the response to mention the user
     * @param allowMention

     */
    setMention(allowMention: boolean = true): this {
        this.mention = allowMention;
        return this;
    }
    /**
     * Determines whether this pagination instance can idle.
     * @param allowIdling

     */
    setIdle(allowIdling: boolean = true): this {
        this.idle = allowIdling;
        return this;
    }
    /**
     * A validation function that runs everytime a buttons is clicked. Defaults to Author Filtering.
     * @param customFilter

     */
    setCustomFilter(customFilter: FilterFunction<any>): this {
        this.filter = customFilter;
        return this;
    }
    /**
     * Sets the amount of time the collector can last. If idle is set, this will be passed as idle time instead.
     * @param time 
 
     */
    setTime(time: number): this {
        this.time = time;
        return this;
    }

    /**
     * Options for extra content to send in the accompanying message.
     * @param messageOptions - 
 
     */
    setMesage(messageOptions: SafeMessageOptions): this {
        this.messageOptions = messageOptions;
        return this;
    }

    /**
     * Determines the amount of times this collector can be used.
     * @param maxInteractions
 
     */
    setMaxInteractions(maxInteractions: number): this {
        this.maxInteractions = maxInteractions;
        return this;
    }

    /**
     * Options used to configure how the pagination will be handled if you are using slash command interactions.
     * @param interactionOptions
 
     */
    setInteractionOptions(interactionOptions: InteractionOptions): this {
        this.interactionOptions = interactionOptions;
        return this;
    }

    // Type Guards (because fuck ts)
    protected isMessage(): boolean {
        return this.interaction instanceof Message;
    }

    protected isInteraction(): boolean {
        return this.interaction instanceof BaseInteraction;
    }
}
