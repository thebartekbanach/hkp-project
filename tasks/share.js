import gulp from "gulp";
import localtunnel from "localtunnel";
import chalk from "chalk";
import open from "open";

function createLocaltunnelConnection(port, approachNumber = 0) {
    if (approachNumber > 10) {
        console.error(chalk.red("Maximum number of localtunnel tunnel creation approaches exceeded!"));
        process.exit();
    }

    localtunnel({ port }).then(function (tunnel) {
        tunnel.url = tunnel.url.replace("https", "http");

        console.log(approachNumber == 0
            ? (chalk.greenBright("Shared under: ") + chalk.bgGreen(chalk.black(" " + tunnel.url + " ")))
            : (chalk.yellowBright("Reshared under: ") + chalk.bgYellowBright(chalk.black(" " + tunnel.url + " "))));

        open(tunnel.url);

        tunnel.on("error", function () {
            console.error(chalk.red("Localtunnel connection " + (approachNumber + 1) + " lost"));
            createLocaltunnelConnection(port, approachNumber + 1)
        });
    });
}

gulp.task("run:sharing", function () {
    createLocaltunnelConnection(8080);
});
