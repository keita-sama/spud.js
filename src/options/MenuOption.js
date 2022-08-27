const { EmbedBuilder } = require('discord.js');

class MenuOption {
    constructor() {
        this.default = false;
    }
    /**
     * Sets the label for this option
     * @param {String} label - Text used for the label
     *
     */
    setLabel(label) {
        this.value = label.toLowerCase().replace(/ +/g, '_');
        this.label = label;
        return this;
    }
    /**
     * Sets the description for this option.
     * @param {String} description - Text used for the description
     *
     */
    setDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * Sets the Embed for this option.
     * @param {EmbedBuilder} embed - Embed used for this Option
     *
     */
    setEmbed(embed) {
        this.embed = embed;
        return this;
    }
    /**
     * Sets the value of this option
     * @param {Void} value - Value used by collectors
     *
     */
    setValue(value) {
        this.value = value;
        return this;
    }
    /**
     * Sets whether this is the default option
     * @param {Boolean} def - Whether this is the default option
     *
     */
    setDefault(def) {
        this.default = def;
        return this;
    }
    /**
     * Sets the emoji used by this option
     * @param {String} emoji - Emoji used by this option
     * @returns
     */
    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }
}

module.exports = MenuOption;