import { MessageAttachment } from "discord.js";
import { MessageCommmandFunction } from "../../command";
import fs from "fs";
import fetch from "node-fetch";
import axios from "axios";
import aws from "aws-sdk";
import commands from "../filters";
import parseString from "../parse";
import presets from "../presets";
export let renders = 0;
const cred = fs.readFileSync("awscred.txt").toString("utf8").split("\n").map((str) => str.trim())
const S3 = new aws.S3({
    credentials: {
        accessKeyId: cred[0],
        secretAccessKey: cred[1]
    }
})
const lambdaLink = cred[2]

const uploadToS3 = async (video: Buffer, extension: string, args: string[]) => {
    // const packedData = Buffer.from(JSON.stringify({video, extension, args}))
    // const packedData = new Blob({video: u8Video.buffer, extension, args}, {type: "applications/json"})
    const name = `${Date.now()}_${renders}.zfmpe1`

    await S3.upload({
        Bucket: "zfmpe1-input",
        Key: name,
        Body: JSON.stringify({ video: video.toString("base64"), extension, args })
    }).promise()

    // body: brotliCompressSync(packedData, {[constants.BROTLI_PARAM_QUALITY]: 8})

    return name;
}

const callLambda = async (videoname: string) => {
    return axios.post(lambdaLink, videoname, {
        headers: {
            "x-api-key": cred[3]
        }
    })
}

const downloadFile = async (url: string) => {
    return await fetch(url)
};

const sizeFormat = (size: number) => {
    let newsize = size;
    const prefixes = ["B", "KB", "MB", "GB"]
    for (const prefix of prefixes) {
        if (newsize < 1024) {
            return `${newsize.toFixed(2)}${prefix}`
        } else {
            newsize = (newsize / 1024)
        }
    }
    newsize = (newsize / 1024)
    return `${newsize.toFixed(2)}TB`
}

const executeRun: MessageCommmandFunction = async (msg, args) => {
    if (args === undefined || args === "") {
        msg.channel.send("you need arguments! #debate");
        return;
    }

    if (msg.attachments.first() !== undefined) {
        const attachment = msg.attachments.first() as MessageAttachment
        // let parseExact = false;

        if (attachment.size > 8_388_608) {
            msg.reply("video files can only be 8mb and below")
            return;
        }

        // if (args.substring(0, 10) === "truemanual") parseExact = true;

        let parsedcmds = parseString(args, msg, commands, presets).trim()
        if (!parsedcmds.length) {
            msg.reply("you need arguments! #debate")
            return;
        }

        console.log(parsedcmds)
        if (parsedcmds.length) msg.channel.send(`Using commands: \`${parsedcmds}\``)

        // start the process!
        msg.channel.startTyping();
        const startTime = Date.now();

        const mediaFile = await downloadFile(attachment.url)
        const extension = attachment.name?.split(".").reverse()[0];
        const extraparams = "";
        const preparams = "";
        parsedcmds = `${preparams}-y -i /tmp/temp.${extension} ${parsedcmds} ${extraparams}/tmp/finish.${extension}`;

        if (mediaFile.status !== 200) {
            return msg.channel.send("sorry, im unable to download your media file")
        }

        try {
            const uploadVid = await uploadToS3(await mediaFile.buffer(), extension ?? "mp4", parsedcmds.split(" "))
            const reqLambda = await callLambda(uploadVid)
            if (reqLambda.status !== 200) {
                msg.channel.send(`sorry, there has been an error on our side: \`STATUS ${reqLambda.status}, ${reqLambda.statusText}\``)
                throw reqLambda.statusText;
            }

            // console.log(await reqLambda.data)
            const output = await reqLambda.data
            const outputVideo = output.isLink ? output.data : Buffer.from(await output.data, "base64")
            // console.log(outputVideo)
            const endTime = new Date(Date.now() - startTime).getTime();
            const videoFile = new MessageAttachment(outputVideo, `video.${extension}`)
            if (output.isLink) {
                msg.channel.send(`${msg.author}, completed! (${endTime}ms) (${sizeFormat(output.size)}): ${outputVideo}
Warning: Linked media will be deleted within 2 days.`)
            } else {
                msg.channel.send(`${msg.author}, completed! (${endTime}ms):`, videoFile)
            }
            renders += 1;
        } catch (error) {
            msg.channel.send(`sorry, there has been an error on our side: \`STATUS ${error}\``)
            console.log(error)
        }

        msg.channel.stopTyping();
    } else {
        msg.reply("please include a media file with your command");
    }
}
export default executeRun;