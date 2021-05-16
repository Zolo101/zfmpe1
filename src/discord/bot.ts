import fs from "fs";
import MessageCommmand from "../command";
import { Container } from "../core/class";
import { client, MODE, PREFIX, PRODUCTION } from "../globals";
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
import chalk from "chalk";
import { updateCache } from "../database/database";
import executeSudo from "../core/commands/sudo";

const botcommands: MessageCommmand[] = []
const list: Map<string, Container> = new Map();

list.set("any", new Container("any"));
list.set("vf", new Container("vf"));
list.set("filter:v", new Container("filter:v"));

botcommands.push(
    new MessageCommmand("run", (msg, arg) => executeRun(msg, arg)),
    new MessageCommmand("search", (msg, arg) => executeSearch(msg, arg)),
    new MessageCommmand("create", (msg, arg) => executeCreate(msg, arg)),
    new MessageCommmand("inv", (msg) => executeInv(msg)),
    new MessageCommmand("guide", (msg) => executeGuide(msg)),
    new MessageCommmand("help", (msg, arg) => executeHelp(msg, arg)),
    new MessageCommmand("all", (msg) => executeAllList(msg)),
    new MessageCommmand("about", (msg) => executeAbout(msg)),
    new MessageCommmand("stats", (msg) => executeStats(msg)),
    new MessageCommmand("ping", (msg) => executePing(msg)),
    new MessageCommmand("sudo", (msg, arg) => executeSudo(msg, arg)),
)

export default function readyBot(): void {
    client.on("ready", () => {
        console.log(chalk.greenBright(`Logged in as ${client.user?.tag}`))
        console.log(chalk.yellow(`>> ${MODE} MODE <<`))
        updateCache();
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