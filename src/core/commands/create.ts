import { MessageCommmandFunction } from "../../command";

const helpMsg = `\`\`\`types:
- filter: A basic option that does a specfic thing
- preset: A group of filters/presets that can do more advanced things\`\`\``;

const executeCreate: MessageCommmandFunction = (msg, arg) => {
    if (arg === undefined || arg === "") {
        msg.channel.send(helpMsg);
        return;
    }

    const args = arg.split(" ");

    if (args.length < 2) {
        msg.channel.send(`Error: Expected 2 (name, data) arguments, got ${args.length}`)
        return;
    }

    /*
    switch (args[0]) {
        case "filter":
            insertQueue({
                ID: 0,
                name: args[1],
                type: args[0],
                creator: msg.author.id,
                description: "When the filters are sus!",
                data: args[2],
                approved: false
            })
            updateCache(); // temp
            msg.channel.send("Filter created! It will take up to 5 minutes to sync with the server.")
            break;

        case "preset":
            insertQueue({
                ID: 0,
                name: args[1],
                type: args[0],
                creator: msg.author.id,
                description: "When the presets are sus!",
                data: args[2],
                approved: false
            })
            updateCache(); // temp
            msg.channel.send("Preset created! It will take up to 5 minutes to sync with the server.")
            break;

        default:
            msg.channel.send(helpMsg);
            break;
    } */

    switch (args[0]) {
        case "filter":
        case "preset":
        default:
            msg.channel.send("`create` is unavaliable at the moment.")
    }
}

export default executeCreate;