import { expect, test } from "bun:test";
import { constants } from "http2";

import { CustomError } from "./error";

test("when create new error should return class", () => {
    const cerr = new CustomError(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, "something went wrong");

    expect(cerr).not.toBeNull();
});

test("when call message method should return error message", () => {
    const errMsg = "something went wrong";
    const cerr = new CustomError(0, errMsg);

    expect(cerr.message).toEqual(errMsg);
});

test("when call code method should return error code", () => {
    const cerr = new CustomError(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, "");

    expect(cerr.code).toEqual(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
});
