import { Message } from "discord.js";
import { Command, Preset } from "./class";

export default function parseString(
    cmds: string,
    msg: Message,
    cmdlib: Map<string, Command>,
    prelib: Map<string, Preset>,
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
    for (const cc of c1) { // Parse each command
        if (cc !== null) str += parseCommand(cc, msg, cmdlib, prelib);
    }

    console.log("Final string:", str)
    return str;
}

function parseCommand(
    cc: string,
    msg: Message,
    cmdlib: Map<string, Command>,
    prelib: Map<string, Preset>,
): string {
    const command = cc.match(/[\w.!-]+|"(.*)"/g)
    // Does command exist?
    if (command === null) return "";

    const func = (cmdlib.has(command[0])) ? cmdlib.get(command[0]) : false
    const pre = (prelib.has(command[0])) ? prelib.get(command[0]) : false

    // Preset check
    if (pre) {
        return parseString(pre.command, msg, cmdlib, prelib)
    }

    // Manual check
    if ((command[0] === "manual" || command[0] === "truemanual") && msg.author.id === "262343010916892673") {
        return command[1].substring(1, command[1].length - 1)
    }

    const params = command
        .slice(1) // get rid of the command
        .map((param) => param.toLowerCase().match(/[a-z0-9.]+/g)?.toString()) // make sure the params is lowercase

    for (const param of params) {
        if (param === undefined) {
            msg.reply(`Illegal params: Characters allowed: a-z, 0-9. \`${command}\``)
            return "";
        }
    }

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
