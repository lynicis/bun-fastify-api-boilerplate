import Fastify, { type  FastifyListenOptions, type FastifyInstance } from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import * as winston from "winston";

import type { MainConfigModel } from "../config/model";
import type { IHandler } from "./model";

import { ErrorHandlerMiddleware } from "../error/middleware";

interface IServer {
    Start(): Promise<FastifyInstance>;
    Stop(): Promise<void>;
    get Fastify(): FastifyInstance;
}

class Server implements IServer {
    private readonly config: MainConfigModel;
    private readonly logger?: winston.Logger;
    private readonly handlers?: Array<IHandler>;
    private readonly app: FastifyInstance;

    constructor(config: MainConfigModel, logger?: winston.Logger, handlers?: Array<IHandler>) {
        this.config = config;
        this.logger = logger;
        this.app = Fastify({
            disableRequestLogging: true,
            return503OnClosing: true,
            forceCloseConnections: true,
        });
        this.handlers = handlers;

        if (this.logger != null) {
            this.app.register(fastifyRequestContext, {
                defaultStoreValues: {
                    logger: this.logger,
                },
            });
        }
        this.app.setErrorHandler(ErrorHandlerMiddleware(this.logger));
        this.app.get("/health", () => "OK");
        this.handlers?.forEach((handler) => {
            handler.RegisterRoutes();
        });
    }

    async Start(): Promise<FastifyInstance> {
        const serverOptions: FastifyListenOptions = {
            port: Number(this.config.server.port),
        };
        await this.app.listen(serverOptions);
        return this.app.ready((err) => {
            if (err) {
                this.logger?.error(err);
                process.exit(1);
            }

            this.logger?.info(`server running at: ${this.config.server.port}`);
        });
    }

    async Stop(): Promise<void> {
        await this.app.close();
    }

    get Fastify(): FastifyInstance {
        return this.app;
    }
}

export { type IServer, Server };
