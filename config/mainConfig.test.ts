import { beforeEach, afterEach, describe, expect, jest, test } from "bun:test";

import type { ServerConfigModel } from "../server/model";
import type { MainConfigModel } from "./model";

import { MainConfig } from "./mainConfig";

describe("when call ReadConfig should return MainConfigModel", () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetAllMocks();
        process.env = { ...env };
    });

    afterEach(() => {
        process.env = env;
    });

    test("from environment variable", () => {
        process.env.SERVER_PORT = "3000";

        const config: MainConfigModel = new MainConfig().ReadConfig();

        const expectedConfig: MainConfigModel = {
            server: {
                port: "3000",
            },
        };

        expect(expectedConfig).toEqual(config);
    });

    test("from dotenv file", () => {
        process.env.IS_AT_REMOTE = "YES";

        const config: MainConfigModel = new MainConfig().ReadConfig();

        const serverCfg: ServerConfigModel = {
            port: "8080",
        };
        const expectedConfig: MainConfigModel = {
            server: serverCfg,
        };

        expect(expectedConfig).toEqual(config);
    });
});
