import { MessageCommmandFunction } from "../../command";
import { VERSION } from "../../globals";

const executeAbout: MessageCommmandFunction = (msg) => {
    msg.channel.send(`\`\`\`
zfmpe1 is a small but incredibly powerful discord bot that gives you amazing tools to filter and change your videos to whatever you want. 
zfmpe1 uses ffmpeg and makes it easy to use on discord. 
to render a new video, do z run, following the presets/commands you want to use. 
have fun!

if you want zfmpe1 on your server, contact Zelo101 with the member count and a discord invite 
(i dont want zfmpe1's server to become too busy)

made by zelo101, version ${VERSION}\`\`\``)
}

export default executeAbout;