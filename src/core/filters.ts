import { Command } from "./class";

const commands: Map < string, Command > = new Map();
export default commands;
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