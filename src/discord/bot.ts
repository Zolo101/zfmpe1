import * as discordjs from "discord.js";
import fs from "fs";
import { MessageAttachment } from "discord.js";
import MessageCommmand from "../command";
import { Container, Preset, Command } from "../core/class";
import parseString from "../core/parse";
import renderVideo, { downloadFile, bufferFile2 } from "../download";
import { PREFIX, PRODUCTION, VERSION } from "../globals";

const Discord = discordjs;
const client = new Discord.Client();
const botcommands: MessageCommmand[] = []
const list: Map<string, Container> = new Map();
const presets: Map<string, Preset> = new Map();
const commands: Map<string, Command> = new Map();

const multitasking = 4;

list.set("any", new Container("any"));
list.set("vf", new Container("vf"));
list.set("filter:v", new Container("filter:v"));
commands.set("scale", new Command("vf", (width: number, height: number, algorithm = "fast_bilinear") => {
    return `-vf scale=${width}:${height}:flags=${algorithm}`;
}, `
(width, height, (optional) algorithm)
Explictly sets the width and height of a video.
If you want to keep the aspect ratio, use "scale!".

List of Scaling algorithms: https://ffmpeg.org/ffmpeg-scaler.html#Scaler-Options
`))

commands.set("scale!", new Command("vf", (width: number) => {
    return `-vf scale=${width}:-2:flags=fast_bilinear`;
}, `
(width)
Shorthand for "scale", tries to keep the aspect ratio.

List of Scaling algorithms: https://ffmpeg.org/ffmpeg-scaler.html#Scaler-Options
`))

commands.set("crf", new Command("any", (value: number) => {
    return `-crf ${value}`;
}, `
(value)

CRF controls the quality of the video. 0 is completely lossless, while 51 is the worst.
I'd recommend 30 for a good balance of filesize and quality, and 40 if you dont mind saving a few more kilobytes.

See more: https://trac.ffmpeg.org/wiki/Encode/H.264
`))

commands.set("preset", new Command("any", (preset: string) => {
    return `-preset ${preset}`;
}, `
(preset)

The encoding speed. Balances encoding speed and quality.

See preset list: https://trac.ffmpeg.org/wiki/Encode/H.264
`))

commands.set("tune", new Command("any", (tune: string) => {
    return `-tune ${tune}`;
}, `
(tune)

Tunes the encoding to your specfic need.

See tune list: https://trac.ffmpeg.org/wiki/Encode/H.264
`))

commands.set("bv", new Command("any", (bitrate: number) => {
    return `-b:v ${bitrate}K`;
}, `
(bitrate)

Video bitrate in kilobytes.
`))

commands.set("ba", new Command("any", (bitrate: number) => {
    return `-b:a ${bitrate}K`;
}, `
(bitrate)

Audio bitrate in kilobytes.
`))

commands.set("crop", new Command("filter:v", (width: number, height: number, x: number, y: number) => {
    return `-filter:v "crop=${width}:${height}:${x}:${y}"`;
}, `
(width, height, x, y)

Crops video. 
`))

commands.set("cut:after", new Command("any", (hour: number, minutes: number, seconds: number) => {
    return `-ss ${hour}:${minutes}:${seconds}`;
}, `
(hour, minutes, seconds)

Cuts everything AFTER the timeframe specified.
`))

commands.set("cut:before", new Command("any", (seconds: number) => {
    return `-t ${seconds}`;
}, `
(seconds)

Cuts everything BEFORE the timeframe specified.
`))

commands.set("copy-v", new Command("any", () => {
    return "-c:v copy";
}, `
no args

Skips video encoding. 
It's not recommended to use this unless you know what your doing.
`))

commands.set("copy-a", new Command("any", () => {
    return "-c:a copy";
}, `
no args

Skips audio encoding. 
It's not recommended to use this unless you know what your doing.
`))

commands.set("manual", new Command("any", (manual: string) => {
    return manual;
}, `
(manual)
(ZELO ONLY)

Manual lets you set ffmpeg commands that zfmpe1 currently doesn't have.
`))

commands.set("truemanual", new Command("any", (truemanual: string) => {
    return truemanual;
}, `
(truemanual)
(ZELO ONLY)

Do anything in ffmpeg.
`))

commands.set("speed", new Command("filter_complex", (speed: number) => {
    return `-filter_complex "[0:v]setpts=${1 / speed}*PTS[v];[0:a]atempo=${speed}[a]" -map "[v]" -map "[a]"`;
}, `
(speed)

Changes the video&audio speed. 
0.1 would make the video 10 times slower.
5 would make the video 5 times faster.
`))

commands.set("invert", new Command("vf", () => {
    return "-vf negate";
}, `
no args

Inverts video colors.
`))

commands.set("mute-audio", new Command("any", () => {
    return "-an";
}, `
no args

Mutes audio. Use the mute preset unless you are also changing the video.
`))

presets.set("144p", new Preset("scale!(144)", `
Scale video width to 144, keeping the aspect ratio.
`))

presets.set("360p", new Preset("scale!(360)", `
Scale video width to 360, keeping the aspect ratio.
`))

presets.set("480p", new Preset("scale!(480)", `
Scale video width to 480, keeping the aspect ratio.
`))

presets.set("720p", new Preset("scale!(720)", `
Scale video width to 720, keeping the aspect ratio.
`))

presets.set("yeet", new Preset("crf(50)", `
YEETs the quality.
`))

presets.set("lite", new Preset("crf(35)", `
Lowers the video's quality. Lite(tm)
`))

presets.set("optimize", new Preset("copy-a 480p lite preset(veryfast)", `
Optimizes the video for discord.
`))

presets.set("s_optimize", new Preset("copy-a 360p yeet preset(slow)", `
REALLY optimizes the video for discord.
`))

presets.set("earrape", new Preset("copy-v -af acrusher=.1:1:64:0:log", `
Makes the aduio very loud.
`))

presets.set("mute", new Preset("copy-v mute-audio", `
Makes the aduio very loud.
`))

presets.set("covertest", new Preset("manual(\"-i res/L.png\") optimize manual(\"-map 0:0 -map 1:0\") copy", `
Music cover video test
`))

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
    new MessageCommmand("ping", (msg) => msg.channel.send("pong")),
    new MessageCommmand("help", (msg) => {
        const args = msg.content.slice(PREFIX.length + 4).trim();
        if (args) {
            if (commands.has(args)) msg.channel.send(`\`\`\`${commands.get(args)?.description}\`\`\``)
            if (presets.has(args)) msg.channel.send(`\`\`\`${presets.get(args)?.description}\`\`\``)
        } else {
            msg.channel.send(`\`\`\`scala
main commands:
    - run [filter]: Run a filter
    - search [filter]: Search for filter
    - create: Create a filter
    - inv: List of filters you've created
help commands:
    - guide: For zfmpe1 newcomers (not done yet)
    - help [filter]: Filter description
    - all: All filters
other commands:
    - about: About the bot
    - stats: Bot statistics
    - ping: Pings the bot

do "z help [filter]" to get help on a filter.\`\`\``)}
    }),
    new MessageCommmand("about", (msg) => msg.channel.send(`\`\`\`
zfmpe1 is a small but incredibly powerful discord bot that gives you amazing tools to filter and change your videos to whatever you want. 
zfmpe1 uses ffmpeg and makes it easy to use on discord. 
to render a new video, do z run, following the presets/commands you want to use. 
have fun!

if you want zfmpe1 on your server, contact Zelo101 with the member count and a discord invite 
(i dont want zfmpe1's server to become too busy)

made by zelo101, version ${VERSION}\`\`\``)),
    new MessageCommmand("all", (msg) => msg.reply(`\`\`\`
do "z help [filter]" for more infomation on a filter.

all commands avaliable:
${getCommandList()}
all presets avaliable:
${getPresetList()}\`\`\``)),
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
            if (command.equals(msg.content)) command.onRun(msg);
        }
    });

    client.login(fs.readFileSync("token.txt").toString())
}