import dotenv from "dotenv";
import { checkFileExists } from "./check-file-exists";

export function getEnvironmentVariables() {
    if (process.env.USE_DOTENV === "false") {
        return process.env;
    }
    
    const useDevDotenv = !checkFileExists("./.env");
    return dotenv.config({ path: useDevDotenv ? "./.env.dev" : "./.env" }).parsed;
}
