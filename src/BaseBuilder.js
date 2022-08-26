const { correctType } = require('./Utils');
const SpudJSError = require('./errors/SpudJSError');

class BaseBuilder {
    constructor(message) {
        this.message = message;
        this.shouldMention = true;
    }

    setTime(duration) {
        if (!correctType('number', duration)) {
            throw new SpudJSError(`Expected "number", got ${typeof duration}`);
        }
        this.time = duration;
        return this;
    }
    setFilter(filter) {
        if (!correctType('function', filter)) {
            throw new SpudJSError(`Expected "function", got ${typeof filter}`);
        }
        this.filter = filter;
        return this;
    }
    setMax(max) {
        if (!correctType('number', max)) {
            throw new SpudJSError(`Expected "number", got ${typeof max}`);
        }
        this.max = max;
        return this;
    }
    setIdle(idle) {
        if (!correctType('boolean', idle)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof idle}`);
        }
        this.idle = idle;
        return this;
    }
    disableMention(bool) {
        if (!correctType('boolean', bool)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof bool}`);
        }
        this.shouldMention = bool;
        return this;
    }
}

module.exports = BaseBuilder;