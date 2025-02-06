import { type MessageReplyOptions, type RepliableInteraction, Message, MessageComponentInteraction, CollectorFilter } from "discord.js";
interface InteractionOptions {
    type: "reply" | "send";
    filterMessage?: string;
}
type SafeMessageOptions = Omit<MessageReplyOptions, "embeds" | "components">;
/**
 * Class representing the core. Implements standard methods.
 * @class
 * @abstract
 */
export declare class Builder<T extends RepliableInteraction | Message> {
    interaction: T;
    mention: boolean;
    idle: boolean;
    time: number;
    filter: CollectorFilter<[MessageComponentInteraction]>;
    interactionOptions: any;
    messageOptions?: SafeMessageOptions;
    maxInteractions?: number;
    /** Intialize the interaction to use
     * @param interaction - Interaction used to attach the collector.
     */
    constructor(interaction: T);
    /**
     * Allows the response to mention the user
     * @param allowMention
     */
    setMention(allowMention?: boolean): this;
    /**
     * Determines whether this pagination instance can idle.
     * @param allowIdling
     */
    setIdle(allowIdling?: boolean): this;
    /**
     * A validation function that runs everytime a buttons is clicked. Defaults to Author Filtering.
     * @param customFilter
     */
    setCustomFilter(customFilter: CollectorFilter<MessageComponentInteraction[]>): this;
    /**
     * Sets the amount of time the collector can last. If idle is set, this will be passed as idle time instead.
     * @param time
     */
    setTime(time: number): this;
    /**
     * Options for extra content to send in the accompanying message.
     * @param messageOptions -
     */
    setMesage(messageOptions: SafeMessageOptions): this;
    /**
     * Determines the amount of times this collector can be used.
     * @param maxInteractions
     */
    setMaxInteractions(maxInteractions: number): this;
    /**
     * Options used to configure how the pagination will be handled if you are using slash command interactions.
     * @param interactionOptions
     */
    setInteractionOptions(interactionOptions: InteractionOptions): this;
    protected isMessage(): this is this & {
        interaction: Message;
    };
    protected isInteraction(): this is this & {
        interaction: RepliableInteraction;
    };
}
export {};
