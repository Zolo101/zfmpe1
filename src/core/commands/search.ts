import { MessageCommmandFunction } from "../../command";
import commands from "../filters";
import { searchArray } from "../util";

const executeSearch: MessageCommmandFunction = (msg, arg) => {
    if (arg === undefined || arg === "") {
        msg.channel.send("You need to search for something!");
        return;
    }
    const results = searchArray(arg, commands.keys());
    if (results === null) {
        msg.channel.send("Found nothing :(");
        return;
    }

    if (results[0] === arg) {
        msg.channel.send(`\`\`\`${commands.get(arg)?.description as string}\`\`\``);
        return;
    }

    msg.channel.send(`Similar filters: \n\`\`\`${results.join("\n")}\`\`\``);
}

export default executeSearch;