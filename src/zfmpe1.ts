import * as discordjs from "discord.js";
import { MessageAttachment } from "discord.js";
import Command, { prefix } from "./command";
import { renderVideo, bufferFile2, downloadFile } from "./download";
import Xfmpe1Container, { parseXfmpe1Command, Xfmpe1Command, Xfmpe1Preset } from "./xfmpe1command";
const Discord = discordjs;
const client = new Discord.Client();
const botcommands: Command[] = []
const list: Map<string, Xfmpe1Container> = new Map();
const presets: Map<string, Xfmpe1Preset> = new Map();
const commands: Map<string, Xfmpe1Command> = new Map();

list.set("any", new Xfmpe1Container("any"));
list.set("vf", new Xfmpe1Container("vf"));
list.set("filter:v", new Xfmpe1Container("filter:v"));
commands.set("scale", new Xfmpe1Command("vf", (width: number, height: number) => {
    return `-vf scale=${width}:${height}`;
}))
commands.set("scale!", new Xfmpe1Command("vf", (width: number) => {
    return `-vf scale=${width}:-1`;
}))
commands.set("bv", new Xfmpe1Command("any", (bitrate: number) => {
    return `-b:v ${bitrate}K`;
}))
commands.set("ba", new Xfmpe1Command("any", (bitrate: number) => {
    return `-b:a ${bitrate}K`;
}))
commands.set("crop", new Xfmpe1Command("filter:v", (width: number, height: number, x: number, y: number) => {
    return `-filter:v "crop=${width}:${height}:${x}:${y}"`;
}))
commands.set("trim", new Xfmpe1Command("any", (hour: number, minutes: number, seconds: number) => {
    return `-ss ${hour}:${minutes}:${seconds}`;
}))
commands.set("trim!", new Xfmpe1Command("any", (seconds: number) => {
    return `-t ${seconds}`;
}))
commands.set("copy", new Xfmpe1Command("any", () => {
    return "-codec copy";
}))
commands.set("manual", new Xfmpe1Command("any", (manual: string) => {
    return manual;
}))
commands.set("s", new Xfmpe1Command("filter:v", (speed: number) => {
    return `-filter:v "setpts=PTS/${speed}"`;
}))
commands.set("invert", new Xfmpe1Command("vf", () => {
    return "-vf negate";
}))
commands.set("mute", new Xfmpe1Command("any", () => {
    return "-an";
}))

presets.set("144p", new Xfmpe1Preset("scale!(144)"))
presets.set("480p", new Xfmpe1Preset("scale!(480)"))
presets.set("720p", new Xfmpe1Preset("scale!(720)"))
presets.set("yeet", new Xfmpe1Preset("bv(40)"))
presets.set("lite", new Xfmpe1Preset("bv(75)"))
presets.set("optimize", new Xfmpe1Preset("scale!(480); bv(80) manual(-preset slow)"))

/*
xfmpe1list.push(
    new Xfmpe1Container("-vf").commands.push(
        new Xfmpe1Command("scale", )
    )
) */

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
    new Command("ping", (msg) => msg.channel.send("pong")),
    new Command("help", (msg) => msg.channel.send(`\`\`\`
zfmpe1 is a small but incredibly powerful discord bot that gives you amazing tools to filter and change your videos to whatever you want. 
zfmpe1 uses ffmpeg and makes it easy to use on discord. 
to render a new video, do z run, following the presets/commands you want to use. 
have fun!

if you want zfmpe1 on your server, contact Zelo101 with the member count and a discord invite 
(i dont want zfmpe1's server to become too busy)

made by zelo101, version 1.0\`\`\`
    `)),
    new Command("tutor", (msg) => msg.reply(`\`\`\`
every command avaliable:
${getCommandList()}
every preset avaliable:
${getPresetList()}\`\`\`
    `)),
    new Command("run", (msg) => {
        const args = msg.content.slice(prefix.length + 4).trim();
        // the 4 is for the run command (lazy way)
        if (msg.attachments.first() !== undefined) {
            const attachment = msg.attachments.first() as discordjs.MessageAttachment

            // console.log(attachment)

            if (attachment.size > 4_194_304) {
                msg.reply("video files can only be 4mb and below")
                return;
            }

            const parsedcmds = parseXfmpe1Command(args, msg, commands, presets).trim()

            if (!parsedcmds.length) {
                msg.reply("you need arguments! #debate")
                return;
            }

            console.log(parsedcmds)
            if (parsedcmds.length) msg.channel.send(`Using commands: \`${parsedcmds}\``)

            // start the process!
            msg.channel.startTyping();

            downloadFile(attachment.url).then(() => {
                renderVideo(parsedcmds).then(() => {
                    msg.channel.send(`${msg.author}, here is your video, served fresh from the buffer:`, new MessageAttachment(bufferFile2, "video.mp4"))
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
)

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`)
    client.user?.setPresence({
        activity: {
            name: "with ffmpeg"
        }
    })
});

client.on("message", (msg) => {
    if (msg.author.bot) return;
    botcommands.forEach((command) => {
        if (command.equals(msg.content)) command.onRun(msg);
    })
});

client.login("TOKEN HERE")