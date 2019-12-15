import { Express } from "express";
import { resolve } from "path";
import sharp from "sharp";

import { checkFileExists } from "../lib/checkFileExists";

const welcomeBackgroundPath = "dist/res/img/sections/welcome/background.jpg";
const croppedWelcomeBackgroundPath = "dist/res/img/sections/welcome";

const getCroppedWelcomeBackgroundPath =
    (width: number, height: number) =>
        `${croppedWelcomeBackgroundPath}/background.${width}x${height}.jpg`;

async function getWelcomeImageSize(): Promise<{ width: number, height: number }> {
    if ((getWelcomeImageSize as any).cached === undefined) {
        const { width, height } = await sharp(welcomeBackgroundPath).metadata();
        (getWelcomeImageSize as any).cached = { width, height };
    }

    return (getWelcomeImageSize as any).cached;
}

async function cropWelcomeTo(width: number, height: number) {
    await sharp(welcomeBackgroundPath)
        .resize(width, height)
        .toFile(getCroppedWelcomeBackgroundPath(width, height));
}

export default function init(app: Express) {
    app.get("/welcome/:width/:height", async (req, res) => {
        let width: number = null;
        let height: number = null;

        try {
            width = parseInt(req.params.width, 10);
            height = parseInt(req.params.height, 10);

            if (width < 100 || height < 100) {
                throw new Error("Size is too small");
            }
        } catch (err) {
            res.sendStatus(400);
            return;
        }

        const maxSize = await getWelcomeImageSize();

        width = maxSize.width >= width ? width : maxSize.width;
        height = maxSize.height >= height ? height : maxSize.height;

        if (!await checkFileExists(getCroppedWelcomeBackgroundPath(width, height))) {
            await cropWelcomeTo(width, height);
        }

        return res.sendFile(resolve(process.cwd(), getCroppedWelcomeBackgroundPath(width, height)));
    });
}
