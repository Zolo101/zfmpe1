import chalk from "chalk";
import readyBot from "./discord/bot";

// true if you want a discord bot
// false if you want a CLI interface
const mode = true;
mode ? readyBot() : console.error(chalk.redBright("Not Implemented")) // CLI or not