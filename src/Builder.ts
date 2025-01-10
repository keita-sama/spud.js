import {
    Message,
    type Interaction,
    type MessageCreateOptions
} from "discord.js";

import  { SpudJSError } from './Errors/SpudJSError';

interface InteractionOptions {
    type: 'reply' | 'send';
}

export class Builder {
    // Default Properties of a Builder;
    interaction: Interaction | Message;
    mention: boolean;
    idle: boolean;
    time: number;
    // FIXME: Correctly type this later on....Maybe
    filter: Function;
    interactionOptions: any;
    content?: string | MessageCreateOptions;
    maxInteractions?: number;

    constructor(interaction: Interaction | Message) {
        this.interaction = interaction;
        this.mention = true;
        this.idle = false;
        this.filter = (collectorInteraction: Interaction) =>
            collectorInteraction.user.id === interaction.user.id;
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

    setInteractionOptions(options: InteractionOptions): this {
        this.interactionOptions = options;
        return this;
    }
}
