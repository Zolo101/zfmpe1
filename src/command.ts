import { Message } from "discord.js"
import { PREFIX } from "./globals";

export type MessageCommmandFunction = (msg: Message, arg?: string) => void;
export default class MessageCommmand {
    codeword: string
    run: MessageCommmandFunction

    constructor(codeword: string, code: MessageCommmandFunction) {
        this.codeword = codeword;
        this.run = code;
    }

    equals(message: string): boolean {
        return (message.includes(PREFIX + this.codeword))
    }
}