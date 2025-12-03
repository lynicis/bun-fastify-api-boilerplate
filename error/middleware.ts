import type { FastifyRequest, FastifyReply } from "fastify";

import winston from "winston";

import { CustomError } from "./error";

function ErrorHandlerMiddleware(logger?: winston.Logger): (error: Error, request: FastifyRequest, reply: FastifyReply) => FastifyReply {
    return function (error, request, reply) {
        if (error) {
            if (error instanceof CustomError) {
                logger?.error(error.message);
                return reply.code(error.code).send({ message: error.message });
            }

            return reply.send(error);
        }

        return reply.send();
    };
}

export { ErrorHandlerMiddleware };
