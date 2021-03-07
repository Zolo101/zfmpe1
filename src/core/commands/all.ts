import { MessageCommmandFunction } from "../../command";
import commands from "../filters";
import presets from "../presets";

const getCommandList = () => {
    let str = "";
    for (const command of commands.keys()) {
        str += command + "\n";
    }
    return str;
}

const getPresetList = () => {
    let str = "";
    for (const preset of presets.entries()) {
        str += `${preset[0]} (${preset[1].command})\n`;
    }
    return str;
}

const executeAllList: MessageCommmandFunction = (msg) => {
    msg.channel.send(`\`\`\`
do "z help [filter]" for more infomation on a filter.

all commands avaliable:
${getCommandList()}
all presets avaliable:
${getPresetList()}\`\`\``)
}

export default executeAllList;