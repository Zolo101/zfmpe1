import { Database } from "no-mysql";
import { SqlResult } from "no-mysql/dist/database";
import { REAL_DB_STRUCT } from "../globals";
import { zfmpe1Entry } from "./database";

// Only use this sparingly, for access to the cache use the DATABASE variable.
export async function fetchRealDatabase(db: Database<{zfmpe1: REAL_DB_STRUCT}>) {
    return await db.zfmpe1.getAll("approved", false);
}

// It's recommended to insert multiple items at once to lower calls.
export async function insertRealItem(db: Database<{zfmpe1: REAL_DB_STRUCT}>, item: zfmpe1Entry) {
    return await db.zfmpe1.insert(item as unknown as any)
}

export async function insertRealItems(db: Database<{zfmpe1: REAL_DB_STRUCT}>, items: zfmpe1Entry[]) {
    // no-mysql doesn't have batch inserts yet
    for (const item of items) {
        insertRealItem(db, item);
    }
}