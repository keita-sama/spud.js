const { correctType } = require('./Utils');
const SpudJSError = require('./errors/SpudJSError');

// @ts-check

class BaseBuilder {
    constructor(message) {
        this.message = message;
        this.shouldMention = true;
    }
    /**
     * @param {Number} duration - How long this interaction lasts
     */
    setTime(duration) {
        if (!correctType('number', duration)) {
            throw new SpudJSError(`Expected "number", got ${typeof duration}`);
        }
        this.time = duration;
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
     * @param {Number} max - How many times this interaction can be used
     */
    setMax(max) {
        if (!correctType('number', max)) {
            throw new SpudJSError(`Expected "number", got ${typeof max}`);
        }
        this.max = max;
        return this;
    }
    /**
     * @param {Boolean} idle - Determines if this interaction can idle
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
     * @param {Boolean} duration - How long this interaction lasts
     */
    disableMention(mention) {
        if (!correctType('boolean', mention)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof mention}`);
        }
        this.shouldMention = !mention;
        return this;
    }
}

module.exports = BaseBuilder;