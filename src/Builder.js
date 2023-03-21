const { correctType } = require('./Utils');
const { Message, ChatInputCommandInteraction } = require('discord.js');
const SpudJSError = require('./errors/SpudJSError');

class Builder {
    constructor(commandType) {
        this.commandType = commandType;
        if (commandType instanceof ChatInputCommandInteraction) {
            this.interaction = true;
        }
        else if (commandType instanceof Message) {
            this.interaction = false;
        }
        this.shouldMention = true;
        this.idle = true;
    }
    /**
     * @param {Number} durationSeconds - How long this interaction lasts
     */
    setTime(durationSeconds) {
        if (!correctType('number', durationSeconds)) {
            throw new SpudJSError(`Expected "number", got ${typeof durationSeconds}`);
        }
        this.time = durationSeconds;
        return this;
    }
    /**
     * @param {Function} filter - How long this interaction lasts
     */
    setFilter(filter) {
        if (!correctType('function', filter)) {
            throw new SpudJSError(`Expected "function", got ${typeof filter}`);
        }
        this.filter = filter;
        return this;
    }
    /**
     * @param {Number} maxInteractions - How many times this interaction can be used
     */
    setMax(maxInteractions) {
        if (!correctType('number', maxInteractions)) {
            throw new SpudJSError(`Expected "number", got ${typeof maxInteractions}`);
        }
        this.max = maxInteractions;
        return this;
    }
    /**
     * @param {Boolean} idleSeconds - Determines if this interaction can idle
     */
    setIdle(idle) {
        if (!correctType('boolean', idle)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof idle}`);
        }
        this.idle = idle;
        return this;
    }
    /**
     * @param {String} content - Sets the content used in the reply.
     */
    setContent(content) {
        if (!correctType('string', content)) {
            throw new SpudJSError(`Expected "string", got ${typeof idle}`);
        }
        this.content = content;
        return this;
    }
    /**
     * @param {Boolean} mention - Determines if this interaction will mention the replied user
     */
    disableMention(mention) {
        if (!correctType('boolean', mention)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof mention}`);
        }
        this.shouldMention = !mention;
        return this;
    }
    /**
     * Makes this menu use interactions instead of messages.
     * @param {*} interaction - Interaction used (if you want that)
     * @param {*} options - Options for the interaction
     */
    setInteraction(options) {
        if (!correctType('object', options)) throw new SpudJSError(`Expected "object", got ${typeof placeholder}`);
        this.interactionOptions = options;
        return this;
    }
}

module.exports = Builder;