import { config } from "dotenv";
import { checkFileExists } from "./checkFileExists";

export async function loadDotenv() {
    config({ path:
        await checkFileExists("../../.env")
            ? "../../.env"
            : "../../.env.dev"
    });
}
