import { Message } from "discord.js"
import { PREFIX } from "./globals";

export class Command {
    codeword: string
    run: (msg: Message) => void

    constructor(codeword: string, code: (msg: Message) => void) {
        this.codeword = codeword;
        this.run = code;
    }

    equals(message: string): boolean {
        return (message.includes(PREFIX + this.codeword))
    }

    onRun(msg: Message): void {
        this.run(msg);
    }
}

export default Command;