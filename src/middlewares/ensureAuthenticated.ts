import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { container } from "tsyringe";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new Error("Token missing");
    }

    // Split Bearer Token
    const [_, token] = authHeader.split(" ");

    try {
        // Verify token and get user id
        const { sub: userId } = verify(token, "70d7a0127c3dd60638e6261401924426") as IPayload;

        // Verify user
        const usersRepository = container.resolve(UsersRepository);
        const user = await usersRepository.findById(userId);

        if (!user) {
            throw new Error("User does not exists");
        }

        next();
    } catch (error) {
        throw new Error("Invalid token!");
    }
}
