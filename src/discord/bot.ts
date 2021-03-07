import fs from "fs";
import MessageCommmand from "../command";
import { Container } from "../core/class";
import { client, PREFIX, PRODUCTION } from "../globals";
import executeRun from "../core/commands/run";
import executeStats from "../core/commands/stats";
import executeAbout from "../core/commands/about";
import executeSearch from "../core/commands/search";
import executeCreate from "../core/commands/create";
import executeInv from "../core/commands/inv";
import executeGuide from "../core/commands/guide";
import executeHelp from "../core/commands/help";
import executeAllList from "../core/commands/all";
import executePing from "../core/commands/ping";

const botcommands: MessageCommmand[] = []
const list: Map<string, Container> = new Map();

list.set("any", new Container("any"));
list.set("vf", new Container("vf"));
list.set("filter:v", new Container("filter:v"));

botcommands.push(
    new MessageCommmand("run", (msg, arg) => executeRun(msg, arg)),
    new MessageCommmand("search", (msg, arg) => executeSearch(msg, arg)),
    new MessageCommmand("create", (msg) => executeCreate(msg)),
    new MessageCommmand("inv", (msg) => executeInv(msg)),
    new MessageCommmand("guide", (msg) => executeGuide(msg)),
    new MessageCommmand("help", (msg) => executeHelp(msg)),
    new MessageCommmand("all", (msg) => executeAllList(msg)),
    new MessageCommmand("about", (msg) => executeAbout(msg)),
    new MessageCommmand("stats", (msg) => executeStats(msg)),
    new MessageCommmand("ping", (msg) => executePing(msg)),
)

export default function readyBot(): void {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`)
        console.log(process.env.NODE_ENV);
        console.log(`>> ${PRODUCTION} MODE <<`)
        client.user?.setPresence({
            activity: {
                name: PRODUCTION ? "with ffmpeg | z help" : "when the code is sus!!"
            }
        })
    });

    client.on("message", (msg) => {
        // No bots allowed
        if (msg.author.bot) return;

        for (const command of botcommands) {
            const args = msg.content.slice(PREFIX.length + command.codeword.length).trim();
            if (command.equals(msg.content)) command.run(msg, args);
        }
    });

    client.login(fs.readFileSync("token.txt").toString())
}