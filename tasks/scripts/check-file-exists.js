import { statSync } from "fs";

export function checkFileExists(path) {
    try {
        return statSync(path).isFile();
    } catch (_) {
        return false;
    }
}
