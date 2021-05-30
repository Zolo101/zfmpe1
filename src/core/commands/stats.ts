import { MessageCommmandFunction } from "../../command";
import { buttonClient, client, STARTDATE, VERSION } from "../../globals";
import commands from "../filters";
import presets from "../presets";
import { renders } from "./run";

export const statsCommandText = () => `\`\`\`scala
Servers: ${client.guilds.cache.size}
Filters: ${commands.size}
Presets: ${presets.size}
Renders since uptime: ${renders}
Uptime: ${((Date.now() - STARTDATE) / 1000 / 60 / 60).toFixed(3)} hour(s)
-- zfmpe1 version ${VERSION} --
\`\`\``;

export const refreshbutton = {
    buttons: [
        new buttonClient.MessageButton({
            style: "green",
            label: "Refresh",
            id: "refreshStats"
        })
    ]
}

const executeStats: MessageCommmandFunction = (msg) => {
    // @ts-expect-error
    msg.channel.send(statsCommandText(), refreshbutton)
}

export default executeStats;