import disbtn from "discord-buttons";
import { Client, Intents } from "discord.js";

export const MODE = process.env.NODE_ENV || "DEVELOPMENT";
export const PRODUCTION = (MODE === "production");
export const PREFIX = PRODUCTION ? "z " : "y ";
export const VERSION = "1.0";
export const STARTDATE = Date.now();
export const DATABASE_FLAG = false;

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});
export const buttonClient = disbtn(client);

export const CACHEINTERVAL = 300_000; // 5 Minutes

export type DB_TYPE = {
    version: number
    items: DB_ITEM[]
}

export type DB_ITEM = {
    ID: number,
    name: string,
    type: string,
    creator: string,
    description: string,
    data: string,
    approved: boolean
}

export type REAL_DB_STRUCT = {
    ID: "primary int",
    name: "text",
    type: "text",
    creator: "text",
    description: "text",
    data: "text",
    approved: "boolean",
}