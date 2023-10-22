
const { Message, ChatInputCommandInteraction } = require('discord.js');
const SpudJSError = require('./errors/SpudJSError');

class Builder {
    constructor(commandType) {
        this.commandType = commandType;
        if (commandType instanceof ChatInputCommandInteraction) {
            this.interaction = true;
            this.interactionOptions = { type: 'reply' };
        }
        else if (commandType instanceof Message) {
            this.interaction = false;
        }
        this.shouldMention = true;
        this.idle = true;
        // ! TODO: MAKE FILTER WORK WITH INTERACTIONS AND MESSAGES
        this.filter = (interaction) => interaction.user.id === commandType.author.id;
    }
    /**
     * @param {Number} durationSeconds - How long this interaction lasts
     */
    setTime(durationSeconds) {
        this.time = durationSeconds;
        return this;
    }
    /**
     * @param {Function} filter - How long this interaction lasts
     */
    setFilter(filter) {
        this.filter = filter;
        return this;
    }
    /**
     * @param {Number} maxInteractions - How many times this interaction can be used
     */
    setMax(maxInteractions) {
        this.max = maxInteractions;
        return this;
    }
    /**
     * @param {Boolean} idleSeconds - Determines if this interaction can idle
     */
    setIdle(idle) {
        this.idle = idle;
        return this;
    }
    /**
     * @param {String} content - Sets the content used in the reply.
     */
    setContent(content) {
        this.content = content;
        return this;
    }
    /**
     * @param {Boolean} mention - Determines if this interaction will mention the replied user
     */
    disableMention(mention = true) {
        this.shouldMention = mention;
        return this;
    }
    /**
     * Makes this menu use interactions instead of messages.
     * @param {*} options - options
     */
    setInteraction(options) {
        this.interactionOptions = options;
        return this;
    }
}

module.exports = Builder;