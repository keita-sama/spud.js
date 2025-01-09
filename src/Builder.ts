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

// rip very cool
// export class Builder<T extends Interaction | Message> {
//     constructor(commandType: T) {
//         //Builder.prototype = (commandType instanceof Message ? MessageBuilder : InteractionBuilder)(commandType)

//         if (commandType instanceof Message) {
//             Builder.prototype = new MessageBuilder(commandType);
//         }
//         if (commandType instanceof BaseInteraction) {
//             Builder.prototype = new InteractionBuilder(commandType);
//         }
//     }
// }

export function getCorrectBuilder(commandType: Interaction | Message) {
        if (commandType instanceof Message) {
            return new MessageBuilder(commandType);
        }
        if (commandType instanceof BaseInteraction) {
            return new InteractionBuilder(commandType);
        }

        throw new Error()
}

// supposed to be a class? idk;

// Taking a break, having a brain aneurysm. will figure out what to do soon.
