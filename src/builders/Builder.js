const { Message, ChatInputCommandInteraction, CommandInteraction } = require('discord.js');

module.exports = class Builder {
    /**
     * Add the command interaction or message to reply with
     * @param {CommandInteraction | Message} commandType - Command type to be specified
     */
    constructor(commandType) {
        this.commandType = commandType;

        if (commandType instanceof ChatInputCommandInteraction) {
            this.interaction = true;
            this.interactionOptions = { type: 'reply' };
        } else if (commandType instanceof Message) {
            this.interaction = false;
        }

        this.shouldMention = true;
        this.idle = true;

        /**
         * @todo Make filter work hybridly with interactions and messages
         * @param {CommandInteraction} i 
         * @returns {void}
         */
        this.filter = (i) => i.user.id === commandType.author.id;
    }

    /**
     * Set the interaction duration
     * @param {Number} durationSeconds - Parameter of how long the interaction lasts
     * @returns {Builder}
     */
    setTime(durationSeconds) {
        this.time = durationSeconds;
        return this;
    }

    /**
     * Set the interaction filter
     * @param {Function} filter - Parameter to handle interaction filtering
     * @returns {Builder}
     */
    setFilter(filter) {
        this.filter = filter;
        return this;
    }

    /**
     * Set the max interaction limit
     * @param {Number} maxInteractions - Parameter of how many times the interaction can be used
     * @returns {Builder}
     */
    setMax(maxInteractions) {
        this.max = maxInteractions;
        return this;
    }

    /**
     * Set if the interaction can idle
     * @param {Boolean} [idle] - Parameter to determine if this interaction can idle
     * @returns {Builder}
     */
    setIdle(idle = false) {
        this.idle = idle;
        return this;
    }

    /**
     * Set the content used in the reply
     * @param {String} content - Parameter of the reply content.
     * @returns {Builder}
     */
    setContent(content) {
        this.content = content;
        return this;
    }

    /**
     * Set if the bot should disable mentioning when replying to a user
     * @param {Boolean} [mention] - Parameter to determine if the interaction should mention
     * @returns {Builder}
     */
    disableMention(mention = true) {
        this.shouldMention = mention;
        return this;
    }

    /**
     * Set if this menu should use interactions instead of messages.
     * @param {*} options - Options for the interaction
     * @returns {Builder}
     */
    setInteraction(options) {
        this.interactionOptions = options;
        return this;
    }
};
