import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { container } from "tsyringe";

import auth from "@config/auth";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppError } from "@shared/errors/AppError";

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
        throw new AppError("Token missing", 401);
    }

    // Split Bearer Token
    const [_, token] = authHeader.split(" ");

    try {
        // Verify token and get user id
        const { sub: userId } = verify(token, auth.secretRefreshToken) as IPayload;

        // Verify user
        const usersRepository = container.resolve(UsersRepository);
        const user = await usersRepository.findById(userId);

        if (!user) {
            throw new AppError("User does not exists", 401);
        }

        const usersTokensRepository = container.resolve(UsersTokensRepository);
        const userToken = await usersTokensRepository.findByUserAndRefreshToken(userId, token);

        if (!userToken) {
            throw new AppError("User token does not exist", 401);
        }

        request.user = {
            id: userId,
        };

        next();
    } catch (error) {
        throw new AppError("Invalid token!", 401);
    }
}
