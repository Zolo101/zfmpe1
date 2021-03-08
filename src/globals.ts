import { Client } from "discord.js";

export const MODE = process.env.NODE_ENV ? "PRODUCTION" : "DEVELOPMENT";
export const PRODUCTION = (MODE === "PRODUCTION");
export const PREFIX = PRODUCTION ? "z " : "y ";
export const VERSION = "1.0";
export const STARTDATE = Date.now();
export const client = new Client();