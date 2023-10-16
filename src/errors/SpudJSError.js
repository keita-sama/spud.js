module.exports = class SpudJSError extends Error {
    /**
     * @param {String | number} code - Parameter of the error code
     * @param {String} message - Parameter of the error message
     */
    constructor(code, message) {
        super(message);

        this.name = `SpudJSError [${code}]`;
        this.code = code;

        Error.captureStackTrace(this, SpudJSError);
    }
};
