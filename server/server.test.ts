import { expect, test } from "bun:test";

import type { MainConfigModel } from "../config/model";
import type { IServer } from "./server";

import { MainConfig } from "../config/mainConfig";
import { Server } from "./server";

const createConfig = (port = "0"): MainConfigModel => ({
    server: {
        port,
    },
});

test("when call server class should return server", () => {
    const server = new Server(createConfig(), undefined, undefined);

    expect(typeof server).toBe("object");
});

test("start and stop server without any error", async () => {
    const config = new MainConfig().ReadConfig();
    const server: IServer = new Server(config);
    const app = server.Fastify as typeof server.Fastify & { listen: typeof server.Fastify.listen };
    const originalListen = app.listen;
    app.listen = async () => "0";
    try {
        await server.Start();
        await server.Stop();
    } finally {
        app.listen = originalListen;
    }
});

test("when call fastify getter should return fastify instance", () => {
    const server = new Server(createConfig(), undefined);

    expect(server.Fastify).not.toBeNull();
});
