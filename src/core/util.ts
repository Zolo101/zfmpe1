export function searchArray(text: string, arr: IterableIterator<string>, limit = 10): string[] | null {
    const results: string[] = []
    let c = 0;
    for (const str of arr) {
        if (str.includes(text)) {
            results.push(str);
            c += 1;
        }
        if (c > limit) return results;
    }
    return (results.length > 0 ? results : null);
}