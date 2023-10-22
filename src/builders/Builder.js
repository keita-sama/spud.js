const { Message, ChatInputCommandInteraction, CommandInteraction } = require('discord.js');
const SpudJSError = require('../errors/SpudJSError');

/**
 * @param {String} type 
 * @param {*} given 
 * @returns {Boolean}
 */
function correctType(type, given) {
    return (typeof given === type);
}

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
        } else if (commandType instanceof Message) this.interaction = false;

        this.shouldMention = true;
        this.idle = true;

        /**
         * @todo Make filter work hybridly with interactions and messages
         * @param {CommandInteraction} interaction 
         * @returns {void}
         */
        this.filter = (interaction) => interaction.user.id === commandType.author.id;
    }

    /**
     * Set the interaction duration
     * @param {Number} durationSeconds - Parameter of how long the interaction lasts
     * @throws {SpudJSError} If the duractionSeconds parameter isn't a number
     * @returns {Builder}
     */
    setTime(durationSeconds) {
        if (!correctType('number', durationSeconds)) throw new SpudJSError('ParameterType', `Expected "number", got ${typeof durationSeconds}`);

        this.time = durationSeconds;
        return this;
    }

    /**
     * Set the interaction filter
     * @param {Function} filter - Parameter to handle interaction filtering
     * @throws {SpudJSError} If the filter parameter isn't a function
     * @returns {Builder}
     */
    setFilter(filter) {
        if (!correctType('function', filter)) throw new SpudJSError('ParameterType', `Expected "function", got ${typeof filter}`);

        this.filter = filter;
        return this;
    }

    /**
     * Set the max interaction limit
     * @param {Number} maxInteractions - Parameter of how many times the interaction can be used
     * @throws {SpudJSError} If the maxInteractions parameter isn't a number
     * @returns {Builder}
     */
    setMax(maxInteractions) {
        if (!correctType('number', maxInteractions)) throw new SpudJSError('ParameterType', `Expected "number", got ${typeof maxInteractions}`);

        this.max = maxInteractions;
        return this;
    }

    /**
     * Set if the interaction can idle
     * @param {Boolean} [idle] - Parameter to determine if this interaction can idle
     * @throws {SpudJSError} If the idle parameter isn't a boolean
     * @returns {Builder}
     */
    setIdle(idle = false) {
        if (!correctType('boolean', idle)) throw new SpudJSError('ParameterType', `Expected "boolean", got ${typeof idle}`);

        this.idle = idle;
        return this;
    }

    /**
     * Set the content used in the reply
     * @param {String} content - Parameter of the reply content.
     * @throws {SpudJSError} If the content parameter isn't a string
     * @returns {Builder}
     */
    setContent(content) {
        if (!correctType('string', content)) throw new SpudJSError('ParameterType', `Expected "string", got ${typeof idle}`);

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
     * @throws {SpudJSError} If the options parameter isn't an object
     * @returns {Builder}
     */
    setInteraction(options) {
        if (!correctType('object', options)) throw new SpudJSError('ParameterType', `Expected "object", got ${typeof placeholder}`);

        this.interactionOptions = options;
        return this;
    }
};
