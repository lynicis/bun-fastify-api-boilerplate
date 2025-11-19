import dotenv from "dotenv";

import type { MainConfigModel } from "./model";

import { ServerConfig } from "../server/config";

interface IConfig {
    ReadConfig(): object;
}

class MainConfig implements IConfig {
    ReadConfig(): MainConfigModel {
        const isAtRemote: string = process.env.IS_AT_REMOTE || "";
        if (isAtRemote == null) {
            dotenv.config();
        }

        const serverConfig = new ServerConfig().ReadConfig();

        return {
            server: serverConfig,
        };
    }
}

export { type IConfig, MainConfig };
