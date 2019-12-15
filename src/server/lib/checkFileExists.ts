
import { stat } from "fs";
import { promisify } from "util";

const statAsync = promisify(stat);

export async function checkFileExists(path: string) {
    try {
        await statAsync(path);
        return true;
    } catch (_) {
        return false;
    }
}
