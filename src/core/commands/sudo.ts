import chalk from "chalk";
import { MessageCommmandFunction } from "../../command";
import { updateCache } from "../../database/database";

const helpMsg = `\`\`\`goin on you with the pick and roll
young laflame he in sudo mode\`\`\``;

const deathEmotions = ["☹️", "🥺", "💔", "☠️", "💢"]

const executeSudo: MessageCommmandFunction = async (msg, arg) => {
    // only zelo allowed
    if (msg.author.id !== "262343010916892673") {
        msg.channel.send("username is not in the sudoers file. this incident will be reported");
        return;
    }

    if (arg === undefined || arg === "") {
        msg.channel.send(helpMsg);
        return;
    }

    switch (arg) {
        case "exit":
        case "crash":
            console.log(chalk.redBright("Crash ordered, Exiting..."));
            await msg.react(deathEmotions[Math.floor(Math.random() * deathEmotions.length - 1)])
            throw process.exit(1);

        case "pushcache":
            updateCache();
            break;

        default:
            msg.channel.send(helpMsg);
            break;
    }

    await msg.react("✅")
}

export default executeSudo;