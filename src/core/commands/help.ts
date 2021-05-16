import { MessageCommmandFunction } from "../../command";
import commands from "../filters";
import presets from "../presets";

const executeHelp: MessageCommmandFunction = (msg, arg) => {
    if (arg) {
        if (commands.has(arg)) msg.channel.send(`\`\`\`${commands.get(arg)?.description}\`\`\``)
        if (presets.has(arg)) msg.channel.send(`\`\`\`${presets.get(arg)?.description}\`\`\``)
    } else {
        msg.channel.send(`\`\`\`scala
main commands:
- run [filter]: Run a filter
- search [keywords]: Search for related filters
- create: Create a filter
- inv: List of filters you've created
help commands:
- guide: For zfmpe1 newcomers
- help [filter]: Filter description
- all: All filters
other commands:
- about: About the bot
- stats: Bot statistics
- ping: Pings the bot

do "z help [filter]" to get help on a filter.\`\`\``)}
}

export default executeHelp;