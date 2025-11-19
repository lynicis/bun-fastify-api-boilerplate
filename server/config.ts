import { IConfig } from "../config/mainConfig";
import { ServerConfigModel } from "./model";

class ServerConfig implements IConfig {
    ReadConfig(): ServerConfigModel {
        let serverPort: string = process.env.SERVER_PORT;
        if (serverPort == null) {
            serverPort = "8080";
        }

        return {
            port: serverPort,
        };
    }
}

export { ServerConfig };
