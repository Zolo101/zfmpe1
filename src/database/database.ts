import chalk from "chalk";
import fs from "fs";
import { Database } from "no-mysql";
import { DbTableValue } from "no-mysql/dist/database";
import { CACHEINTERVAL } from "../globals";
import { DB_QUEUE, pushQueue } from "./cache";
import { fetchRealDatabase } from "./real";
const cred = fs.readFileSync("dbcred.txt").toString("utf8").split("\n").map((str) => str.trim())
export const db = new Database(
    {
        host: cred[0],
        port: Number(cred[1]),
        user: cred[2],
        password: cred[3],
        database: cred[4]
    },
    {
        zfmpe1: {
            ID: "primary int",
            name: "text",
            type: "text",
            creator: "text",
            description: "text",
            data: "text",
            approved: "boolean",
        }
    }
)

export type zfmpe1Entry = DbTableValue<typeof db, "zfmpe1">

console.log(chalk.greenBright("Connected to MYSQL Database!"))
export const DATABASE = {
    version: 1,
    items: new Map<string, zfmpe1Entry>(),
};
fetchRealDatabase(db);//.then((res) => console.log(res));

export async function updateCache(): Promise<void> {
    try {
        if (DB_QUEUE.length > 0) { // Empty?
            await pushQueue();
            const items = await fetchRealDatabase(db);
            for (const item of items) {
                DATABASE.items.set(item.name, item)
            }
            console.log(chalk.greenBright(`Updated database cache! ${Date.now()}`));
        } else {
            console.log(chalk.greenBright(`Queue empty, update skipped! ${Date.now()}`));
        }
        console.log(DATABASE);
    } catch (error) {
        console.error(chalk.redBright(`CRITIAL: UNABLE TO UPDATE DATABASE CACHE: ${error}`));
    }
}

// not yet
// setInterval(updateCache, CACHEINTERVAL)