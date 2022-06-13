export class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;

    public constructor(message: string, statusCode = 400) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
