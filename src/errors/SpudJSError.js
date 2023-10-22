class SpudJSError extends Error {
    /**
     * @param {String} message - Error message
     */
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = SpudJSError;