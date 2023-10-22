const { EmbedBuilder } = require('discord.js');

module.exports = class MenuOption {
    constructor() {
        this.default = false;
    }

    /**
     * Set the label for this option
     * @param {String} label - Parameter of the text used for the label
     * @returns {MenuOption}
     */
    setLabel(label) {
        this.value = label.toLowerCase().replace(/ +/g, '_');
        this.label = label;
        return this;
    }

    /**
     * Set the description of this option.
     * @param {String} description - Parameter of the text used for the description
     * @returns {MenuOption}
     */
    setDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * Set the Embed for this option.
     * @param {EmbedBuilder} embed - Parameter of the embed used for this option
     * @returns {MenuOption}
     */
    setEmbed(embed) {
        this.embed = embed;
        return this;
    }

    /**
     * Set the value of this option
     * @param {void} value - Parameter of the value used by collectors
     * @returns {MenuOption}
     */
    setValue(value) {
        this.value = value;
        return this;
    }

    /**
     * Set if this is the default option
     * @param {Boolean} def - Parameter of whether this is the default option
     * @returns {MenuOption}
     */
    setDefault(def) {
        this.default = def;
        return this;
    }

    /**
     * Set the emoji used by this option
     * @param {String} emoji - Parameter of the emoji used by this option
     * @returns {MenuOption}
     */
    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }
};
