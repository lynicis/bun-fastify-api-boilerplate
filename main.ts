import * as winston from "winston";
import { MainConfig } from "./config/mainConfig";
import type { MainConfigModel } from "./config/model";
import { Server, type IServer } from "./server/server";

const logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console()],
});

const config: MainConfigModel = new MainConfig().ReadConfig();

const server: IServer = new Server(config, logger);
server.Start().catch((err) => {
    logger.error({
        message: "error occurred while starting server",
        error: JSON.stringify(err),
    });
    process.exit(1);
});
