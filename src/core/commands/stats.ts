import { MessageCommmandFunction } from "../../command";
import { client, STARTDATE, VERSION } from "../../globals";
import commands from "../filters";
import presets from "../presets";
import { renders } from "./run";

const executeStats: MessageCommmandFunction = (msg) => {
    msg.channel.send(`\`\`\`scala
Servers: ${client.guilds.cache.size}
Filters: ${commands.size}
Presets: ${presets.size}
Renders since uptime: ${renders}
Uptime: ${((Date.now() - STARTDATE) / 1000 / 60 / 60).toFixed(3)} hour(s)
-- zfmpe1 version ${VERSION} --
\`\`\``)
}

export default executeStats;