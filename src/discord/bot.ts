import fs from "fs";
import MessageCommmand from "../command";
import { Container } from "../core/class";
import { client, MODE, PREFIX, PRODUCTION } from "../globals";
import executeRun from "../core/commands/run";
import executeStats, { refreshbutton, statsCommandText } from "../core/commands/stats";
import executeAbout from "../core/commands/about";
import executeSearch from "../core/commands/search";
import executeCreate from "../core/commands/create";
import executeInv from "../core/commands/inv";
import executeGuide from "../core/commands/guide";
import executeHelp from "../core/commands/help";
import executeAllList from "../core/commands/all";
import executePing, { pingButton } from "../core/commands/ping";
import chalk from "chalk";
import { updateCache } from "../database/database";
import executeSudo from "../core/commands/sudo";
import discordButton from "discord-buttons/typings/Classes/INTERACTION_CREATE";

const botcommands: MessageCommmand[] = []
const list: Map<string, Container> = new Map();

list.set("any", new Container("any"));
list.set("vf", new Container("vf"));
list.set("filter:v", new Container("filter:v"));

botcommands.push(
    new MessageCommmand("run", async (msg, arg) => executeRun(msg, arg)),
    new MessageCommmand("search", async (msg, arg) => executeSearch(msg, arg)),
    new MessageCommmand("create", async (msg, arg) => executeCreate(msg, arg)),
    new MessageCommmand("inv", async (msg) => executeInv(msg)),
    new MessageCommmand("guide", async (msg) => executeGuide(msg)),
    new MessageCommmand("help", async (msg, arg) => executeHelp(msg, arg)),
    new MessageCommmand("all", async (msg) => executeAllList(msg)),
    new MessageCommmand("about", async (msg) => executeAbout(msg)),
    new MessageCommmand("stats", async (msg) => executeStats(msg)),
    new MessageCommmand("ping", async (msg) => executePing(msg)),
    new MessageCommmand("sudo", async (msg, arg) => executeSudo(msg, arg)),
)

export default function readyBot(): void {
    client.on("ready", () => {
        console.log(chalk.greenBright(`Logged in as ${client.user?.tag}`))
        console.log(chalk.yellow(`>> ${MODE} MODE <<`))
        updateCache();
        client.user?.setPresence({
            status: "online",
            activities: [{
                name: PRODUCTION ? "with ffmpeg | z help" : "when the code is sus!!"
            }]
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

    client.on("clickButton", async (button: discordButton) => {
        switch (button.id) {
            case "ping":
                //@ts-expect-error
                await button.reply.send(`${button.clicker.user} pong`, { buttons: [pingButton] })
                break;

            case "refreshStats":
                await button.defer(true);
                await button.reply.edit(statsCommandText(), refreshbutton)
                break;

            default:
                break;
        }
    })

    client.login(fs.readFileSync("token.txt").toString())
}