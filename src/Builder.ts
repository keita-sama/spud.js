import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    Message,
    BaseInteraction,
    type Interaction
} from "discord.js";
import { InteractionBuilder } from "./InteractionBuilder";
import { MessageBuilder } from "./MessageBuilder";

// generics are kinda cool wtf
export class Builder<T extends Interaction | Message> {
    constructor(commandType: T) {
        if (commandType instanceof Message) {
            return new MessageBuilder(commandType);
        }
        if (commandType instanceof BaseInteraction) {
            return new InteractionBuilder(commandType);
        }
    }
}

// supposed to be a class? idk;

// Taking a break, having a brain aneurysm. will figure out what to do soon.
