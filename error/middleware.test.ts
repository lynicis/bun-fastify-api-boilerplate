import { expect, test } from "bun:test";
import { constants } from "http2";
import fastify from "fastify";

import { ErrorHandlerMiddleware } from "./middleware";
import { CustomError } from "./error";

test("when error pass to middleware should resolve it", async () => {
    const app = fastify();

    app.setErrorHandler(ErrorHandlerMiddleware());
    app.get("/cerror", () => {
        throw new CustomError(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, "something went wrong");
    });
    await app.ready();

    const response = await app.inject({ method: "GET", url: "/cerror" });

    await app.close();

    expect(response.statusCode).toEqual(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
});
