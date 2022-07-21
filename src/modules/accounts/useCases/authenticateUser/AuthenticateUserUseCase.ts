import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
    refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayJsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect!");
        }

        const {
            secretToken,
            expiresInToken,
            secretRefreshToken,
            expiresInRefreshToken,
            expiresRefreshTokenDays,
        } = auth;

        // Generate JsonWebToken (JWT)
        const token = sign({}, secretToken, {
            subject: user.id,
            expiresIn: expiresInToken,
        });

        const refreshToken = sign({ email }, secretRefreshToken, {
            subject: user.id,
            expiresIn: expiresInRefreshToken,
        });

        const refreshTokenExpiresDate = this.dateProvider.addDays(expiresRefreshTokenDays);

        await this.usersTokensRepository.create({
            user_id: user.id,
            expires_date: refreshTokenExpiresDate,
            refresh_token: refreshToken,
        });

        const tokenReturn: IResponse = {
            token,
            refreshToken,
            user: {
                name: user.name,
                email: user.email,
            },
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
