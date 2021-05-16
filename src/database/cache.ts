import chalk from "chalk";
import { DB_ITEM } from "../globals";
import { db } from "./database";
import { insertRealItems } from "./real";
export const DB_QUEUE: DB_ITEM[] = [];

export function getCacheItem(name: string): void {//DB_ITEM | undefined {
    // return DATABASE.items.find((item) => item.name === name)
}

export function insertQueue(item: DB_ITEM): void {
    DB_QUEUE.push(item);
    console.log(DB_QUEUE)
}

export async function pushQueue(): Promise<void> {
    try {
        await insertRealItems(db, DB_QUEUE)
        DB_QUEUE.length = 0; // Empty Queue
    } catch (error) {
        throw console.error(chalk.redBright(`CRITIAL: UNABLE TO PUSH QUEUE ${error}`));
    }
}