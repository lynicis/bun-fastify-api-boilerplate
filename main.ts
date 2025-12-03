import winston from "winston";

import { Telemetry } from "./telemetry/telemetry";
import { MainConfig } from "./config/mainConfig";
import { Server } from "./server/server";

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console()],
});

const config = new MainConfig().ReadConfig();
const telemetry = new Telemetry(config.telemetry, logger);
const server = new Server(config, logger);

telemetry.Start();
server
    .Start()
    .then(() => {
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    })
    .catch((err) => {
        logger.error({
            message: "error occurred while starting server",
            error: JSON.stringify(err),
        });
        process.exit(1);
    });

async function gracefulShutdown(signal: NodeJS.Signals) {
    logger.info({ message: `received ${signal}, shutting down gracefully` });

    try {
        await telemetry.Stop();
        await server.Stop();
        logger.info({ message: "server stopped gracefully" });
        process.exit(0);
    } catch (err) {
        logger.error({
            message: "error occurred during graceful shutdown",
            error: JSON.stringify(err),
        });
        process.exit(1);
    }
};
