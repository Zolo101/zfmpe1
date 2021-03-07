import { MessageAttachment } from "discord.js";
import { MessageCommmandFunction } from "../../command"
import renderVideo, { downloadFile, bufferFile2 } from "../../download";
import commands from "../filters";
import parseString from "../parse";
import presets from "../presets";
export let renders = 0;

const executeRun: MessageCommmandFunction = (msg, args) => {
    if (args === undefined || args === "") {
        msg.channel.send("you need arguments! #debate");
        return;
    }

    if (msg.attachments.first() !== undefined) {
        const attachment = msg.attachments.first() as MessageAttachment
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
                renders += 1;
            }).catch((error) => {
                msg.channel.send("sorry, there has been an error at our side")
                console.error("FFMPEG ERROR:", error)
            })
        }).catch(() => msg.channel.send("sorry, im unable to download your media file"))

        msg.channel.stopTyping();
    } else {
        msg.reply("please include a media file with your command");
    }
}

export default executeRun;