import { beforeEach, afterAll, describe, expect, test } from "bun:test";

import type { ServerConfigModel } from "./model";

import { ServerConfig } from "./config";

describe("when call ReadConfig should return ServerConfigModel", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test("when SERVER_PORT environment variable set should return with it", () => {
        process.env.SERVER_PORT = "3000";

        const config: ServerConfigModel = new ServerConfig().ReadConfig();

        const expectedConfig: ServerConfigModel = {
            port: "3000",
        };
        expect(expectedConfig).toEqual(config);
    });

    test("when SERVER_PORT environment variable not set should return it with by default port", () => {
        delete process.env.SERVER_PORT;
        const config: ServerConfigModel = new ServerConfig().ReadConfig();

        const expectedConfig: ServerConfigModel = {
            port: "8080",
        };
        expect(expectedConfig).toEqual(config);
    });
});
