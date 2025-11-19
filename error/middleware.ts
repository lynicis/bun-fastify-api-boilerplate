import type { FastifyRequest, FastifyReply } from "fastify";

import winston from "winston";

import { CustomError } from "./error";

function ErrorHandlerMiddleware(logger?: winston.Logger): (error: Error, request: FastifyRequest, reply: FastifyReply) => FastifyReply {
    return function (error, request, reply) {
        if (error) {
            if (error instanceof CustomError) {
                logger?.error(error.Message);
                return reply.code(error.Code).send({ message: error.Message });
            }

            return reply.send(error);
        }

        return reply.send();
    };
}

export { ErrorHandlerMiddleware };
