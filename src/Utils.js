const { ButtonBuilder } = require('discord.js');
const SpudJSError = require('./errors/SpudJSError');

function correctType (type, given) {
    return (typeof given === type);
}

module.exports = {
    correctType,
};