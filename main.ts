import winston from "winston";

import { MainConfig } from "./config/mainConfig";
import {  Server } from "./server/server";

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console()],
});

const config = new MainConfig().ReadConfig();

const server = new Server(config, logger);
server.Start()
    .catch((err) => {
        logger.error({
            message: "error occurred while starting server",
            error: JSON.stringify(err),
        });
        process.exit(1);
    });
