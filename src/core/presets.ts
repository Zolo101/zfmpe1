import { Preset } from "./class";

const presets: Map<string, Preset> = new Map();
export default presets;
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