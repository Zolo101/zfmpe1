import { Message } from "discord.js"
import { PREFIX } from "./globals";

export default class MessageCommmand {
    codeword: string
    run: (msg: Message, arg: string) => void

    constructor(codeword: string, code: (msg: Message, arg?: string) => void) {
        this.codeword = codeword;
        this.run = code;
    }

    equals(message: string): boolean {
        return (message.includes(PREFIX + this.codeword))
    }
}