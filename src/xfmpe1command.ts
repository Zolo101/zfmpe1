import { Message } from "discord.js";

export type inputTypes = Xfmpe1Preset | number | string | boolean
export class Xfmpe1Container {
    prefix: string
    commands: Xfmpe1Command[]

    constructor(prefix: string) {
        this.prefix = prefix;
        this.commands = [];
    }
}

export class Xfmpe1Command {
    container: string
    make: (...params: inputTypes[]) => string
    attachments: number

    constructor(container: string, make: (...params: any) => string, attachments = 1) {
        this.container = container;
        this.make = make;
        this.attachments = attachments;
    }

    createCommand(...params: inputTypes[]): string {
        return this.make(...params);
    }
}

export class Xfmpe1Preset {
    command: string

    constructor(command: string) {
        this.command = command;
    }
}

export function parseXfmpe1Command(
    cmds: string,
    msg: Message,
    cmdlib: Map<string, Xfmpe1Command>,
    prelib: Map<string, Xfmpe1Preset>,
): string {
    // console.log(cmds, lib)
    let c1 = cmds.trim().split(";");
    let str = "";
    const preset = prelib.get(cmds.trim());
    if (preset !== undefined) {
        // str = prelib.get(cmds.trim())?.command;
        c1 = preset.command.split(";");
    }
    console.log(c1);
    c1.forEach((cc) => { // Parse each command
        const command = cc.match(/[\w.!]+/g)
        console.log(command)
        if (command !== null) { // Does command exist?
            const params = command
                .slice(1) // get rid of the command
                .map((param) => param.toLowerCase()); // make sure the params is lowercase

            const func = cmdlib.get(command[0]);
            if (func === undefined) { // Does function exist?
                msg.reply(`Unknown command: \`${command[1]}\``)
                return;
            }
            if (params.length > 0) { // Does function take params?
                str += func.make(...params) + " ";
                console.log("Func:", func.make(...params))
            } else {
                str += func.make() + " ";
            }
        } else {
            msg.reply(`Invalid Command: \`${cc}\``)
            return;
        }
    })

    console.log("Final string:", str)

    return str;
}

export default Xfmpe1Container;