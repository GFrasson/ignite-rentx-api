import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
    const { id } = request.user;

    const usersRepository = container.resolve(UsersRepository);
    const user = await usersRepository.findById(id);

    if (!user.isAdmin) {
        throw new AppError("User isn't admin!");
    }

    return next();
}
