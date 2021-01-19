import cmd from "node-cmd";
import Downloader from "nodejs-file-downloader";
import path from "path";
import BPromise from "bluebird";
const asyncCMD = BPromise.promisify(cmd.get, { multiArgs: true, context: cmd }) as any;
export const bufferFolder = path.resolve(__dirname, "../videos")
export const bufferFile = path.resolve(__dirname, "../videos", "buffer.mp4")
export const bufferFile2 = path.resolve(__dirname, "../videos", "buffer2.mp4")

export async function downloadFile(url: string): Promise<void> {
    const downloader = new Downloader({
        url: url,
        directory: bufferFolder,
        filename: "buffer.mp4",
        cloneFiles: false
    })
    try {
        await downloader.download();
        // console.log("Downloaded")
    } catch (error) {
        console.log("Download Failed:", error)
    }
}

export async function renderVideo(cmds: string): Promise<void> {
    await asyncCMD(`ffmpeg -hide_banner -loglevel warning -y -i ${bufferFile} ${cmds} ${bufferFile2}`)
}

export default renderVideo;