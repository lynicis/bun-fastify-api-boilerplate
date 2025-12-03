class CustomError extends Error {
    constructor(
        readonly code: number,
        message: string,
    ) {
        super(message);
    }
}

export { CustomError };
