import { type MessageReplyOptions, type RepliableInteraction, Message } from "discord.js";
interface InteractionOptions {
    type: "reply" | "send";
    filterMessage?: string;
}
type SafeMessageOptions = Omit<MessageReplyOptions, "embeds" | "components">;
type FilterFunction<F> = (...args: F[]) => boolean;
/**
 * Class representing the core. Implements standard methods.
 * @class
 */
export declare class Builder {
    interaction: RepliableInteraction | Message;
    mention: boolean;
    idle: boolean;
    time: number;
    filter: FilterFunction<any>;
    interactionOptions: any;
    messageOptions?: SafeMessageOptions;
    maxInteractions?: number;
    /** Intialize the interaction to use
     * @param interaction - Interaction used to attach the collector.
     */
    constructor(interaction: RepliableInteraction | Message);
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
    setCustomFilter(customFilter: FilterFunction<any>): this;
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
    protected isMessage(): boolean;
    protected isInteraction(): boolean;
}
export {};
