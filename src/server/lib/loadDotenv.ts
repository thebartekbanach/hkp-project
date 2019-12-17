import { config } from "dotenv";
import { checkFileExists } from "./checkFileExists";

export async function loadDotenv() {
    if (process.env.USE_DOTENV === "false") {
        return;
    }

    config({ path:
        await checkFileExists("../../.env")
            ? "../../.env"
            : "../../.env.dev"
    });
}
