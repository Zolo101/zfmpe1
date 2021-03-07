import * as discordjs from "discord.js";
import fs from "fs";
import { MessageAttachment } from "discord.js";
import MessageCommmand from "../command";
import { Container } from "../core/class";
import parseString from "../core/parse";
import renderVideo, { downloadFile, bufferFile2 } from "../download";
import { PREFIX, PRODUCTION, VERSION } from "../globals";
import commands from "../core/filters";
import presets from "../core/presets";
import { searchArray } from "../core/util";

const Discord = discordjs;
const client = new Discord.Client();
const botcommands: MessageCommmand[] = []
const list: Map<string, Container> = new Map();
const multitasking = 4;

list.set("any", new Container("any"));
list.set("vf", new Container("vf"));
list.set("filter:v", new Container("filter:v"));

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

botcommands.push(
    new MessageCommmand("run", (msg) => {
        const args = msg.content.slice(PREFIX.length + 4).trim();
        // the 4 is for the run command (lazy way)
        if (msg.attachments.first() !== undefined) {
            const attachment = msg.attachments.first() as discordjs.MessageAttachment
            let parseExact = false;

            // console.log(attachment)

            if (attachment.size > 8_388_608) {
                msg.reply("video files can only be 8mb and below")
                return;
            }

            if (args.substring(0, 10) === "truemanual") parseExact = true;

            const parsedcmds = parseString(args, msg, commands, presets).trim()
            if (!parsedcmds.length) {
                msg.reply("you need arguments! #debate")
                return;
            }

            console.log(parsedcmds)
            if (parsedcmds.length) msg.channel.send(`Using commands: \`${parsedcmds}\``)

            // start the process!
            const startTime = Date.now();
            msg.channel.startTyping();

            downloadFile(attachment.url).then(() => {
                renderVideo(parsedcmds, parseExact).then(() => {
                    const endTime = new Date(Date.now() - startTime).getTime();
                    msg.channel.send(`${msg.author}, here is your video, served fresh from the buffer (${endTime}ms):`, new MessageAttachment(bufferFile2, "video.mp4"))
                }).catch((error) => {
                    msg.channel.send("sorry, there has been an error at our side")
                    console.error("FFMPEG ERROR:", error)
                })
            }).catch(() => msg.channel.send("sorry, im unable to download your media file"))

            msg.channel.stopTyping();
        } else {
            msg.reply("please include a media file with your command");
        }
    }),
    new MessageCommmand("search", (msg, arg) => {
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
    }),
    new MessageCommmand("create", (msg) => msg.channel.send("Unfinished Command")),
    new MessageCommmand("inv", (msg) => msg.channel.send("Unfinished Command")),
    new MessageCommmand("guide", (msg) => msg.channel.send("Unfinished Command")),
    new MessageCommmand("help", (msg) => {
        const args = msg.content.slice(PREFIX.length + 4).trim();
        if (args) {
            if (commands.has(args)) msg.channel.send(`\`\`\`${commands.get(args)?.description}\`\`\``)
            if (presets.has(args)) msg.channel.send(`\`\`\`${presets.get(args)?.description}\`\`\``)
        } else {
            msg.channel.send(`\`\`\`scala
main commands:
    - run [filter]: Run a filter
    - search [keywords]: Search for related filters
    - create: Create a filter
    - inv: List of filters you've created
help commands:
    - guide: For zfmpe1 newcomers
    - help [filter]: Filter description
    - all: All filters
other commands:
    - about: About the bot
    - stats: Bot statistics
    - ping: Pings the bot

do "z help [filter]" to get help on a filter.\`\`\``)}
    }),
    new MessageCommmand("all", (msg) => msg.reply(`\`\`\`
do "z help [filter]" for more infomation on a filter.

all commands avaliable:
${getCommandList()}
all presets avaliable:
${getPresetList()}\`\`\``)),
    new MessageCommmand("about", (msg) => msg.channel.send(`\`\`\`
zfmpe1 is a small but incredibly powerful discord bot that gives you amazing tools to filter and change your videos to whatever you want. 
zfmpe1 uses ffmpeg and makes it easy to use on discord. 
to render a new video, do z run, following the presets/commands you want to use. 
have fun!

if you want zfmpe1 on your server, contact Zelo101 with the member count and a discord invite 
(i dont want zfmpe1's server to become too busy)

made by zelo101, version ${VERSION}\`\`\``)),
    new MessageCommmand("stats", (msg) => msg.channel.send("Unfinished Command")),
    new MessageCommmand("ping", (msg) => msg.channel.send("pong")),
)

export default function readyBot(): void {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`)
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