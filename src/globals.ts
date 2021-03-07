import { Client } from "discord.js";

export const PRODUCTION = process.env.PRODUCTION;
export const PREFIX = PRODUCTION ? "z " : "y ";
export const VERSION = "1.0";
export const STARTDATE = Date.now();
export const client = new Client();