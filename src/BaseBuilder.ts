import { Message } from "discord.js";

import { correctType } from './Utils';
import SpudJSError from './errors/SpudJSError';

class BaseBuilder {
	public message: any;
	public shouldMention: any;
	public time: any;
	public filter: any;
	public max: any;
	public idle: any;
	public content: any;

    constructor(message: Message) {
        this.message = message;
        this.shouldMention = true;
    }
    /**
     * @param {Number} duration - How long this interaction lasts
     */
    setTime(duration: number) {
        if (!correctType('number', duration)) {
            throw new SpudJSError(`Expected "number", got ${typeof duration}`);
        }
        this.time = duration;
        return this;
    }

    setFilter(filter: Function) {
        if (!correctType('function', filter)) {
            throw new SpudJSError(`Expected "function", got ${typeof filter}`);
        }
        this.filter = filter;
        return this;
    }

    setMax(max: number) {
        if (!correctType('number', max)) {
            throw new SpudJSError(`Expected "number", got ${typeof max}`);
        }
        this.max = max;
        return this;
    }

    setIdle(idle: boolean) {
        if (!correctType('boolean', idle)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof idle}`);
        }
        this.idle = idle;
        return this;
    }

    setContent(content: string) {
        if (!correctType('string', content)) {
            throw new SpudJSError(`Expected "string", got ${typeof this.idle}`);
        }
        this.content = content;
        return this;
    }

    disableMention(mention: boolean) {
        if (!correctType('boolean', mention)) {
            throw new SpudJSError(`Expected "boolean", got ${typeof mention}`);
        }
        this.shouldMention = !mention;
        return this;
    }
}

export default BaseBuilder;