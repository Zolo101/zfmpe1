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
    description: string

    constructor(
        container: string,
        make: (...params: any) => string,
        description: string,
        attachments = 1
    ) {
        this.container = container;
        this.make = make;

        this.description = description;
        this.attachments = attachments;
    }

    createCommand(...params: inputTypes[]): string {
        return this.make(...params);
    }
}

export class Xfmpe1Preset {
    command: string
    description: string

    constructor(command: string, description: string) {
        this.command = command;
        this.description = description;
    }
}

export function parseXfmpe1String(
    cmds: string,
    msg: Message,
    cmdlib: Map<string, Xfmpe1Command>,
    prelib: Map<string, Xfmpe1Preset>,
): string {
    // console.log(cmds, lib)
    const splitregex = /\S+\((.*?)\)|\S+/g
    let c1 = cmds.trim().match(splitregex) as RegExpMatchArray
    let str = "";
    const preset = prelib.get(cmds.trim());
    if (preset !== undefined) {
        // str = prelib.get(cmds.trim())?.command;
        c1 = preset.command.match(splitregex) as RegExpMatchArray
    }
    console.log(c1);
    c1.forEach((cc) => { // Parse each command
        if (cc !== null) str += parseXfmpe1Command(cc, msg, cmdlib, prelib);
    })

    console.log("Final string:", str)
    return str;
}

function parseXfmpe1Command(
    cc: string,
    msg: Message,
    cmdlib: Map<string, Xfmpe1Command>,
    prelib: Map<string, Xfmpe1Preset>,
): string {
    const command = cc.match(/[\w.!-]+|"(.*)"/g)
    // Does command exist?
    if (command === null) return "";

    const func = (cmdlib.has(command[0])) ? cmdlib.get(command[0]) : false
    const pre = (prelib.has(command[0])) ? prelib.get(command[0]) : false

    // Preset check
    if (pre) {
        return parseXfmpe1String(pre.command, msg, cmdlib, prelib)
    }

    // Manual check
    if (command[0] === "manual" && msg.author.id === "262343010916892673") {
        return command[1].substring(1, command[1].length - 1)
    }

    const params = command
        .slice(1) // get rid of the command
        .map((param) => param.toLowerCase().match(/[a-z0-9]+/g)?.toString()) // make sure the params is lowercase

    params.forEach((param) => {
        if (param === undefined) {
            msg.reply(`Illegal params: Characters allowed: a-z, 0-9. \`${command}\``)
            return "";
        }
    })

    // Does function exist?
    if (!func) {
        msg.reply(`Unknown command: \`${command[0]}\``)
        return "";
    }

    // Does function take params?
    if (params.length > 0) {
        console.log("Func:", func.make(...params as string[]))
        return func.make(...params as string[]) + " ";
    } else {
        return func.make() + " ";
    }
}

export default Xfmpe1Container;