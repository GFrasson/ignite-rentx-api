import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refreshToken: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayJsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(refreshToken: string): Promise<ITokenResponse> {
        let decode: IPayload;

        try {
            decode = verify(refreshToken, auth.secretRefreshToken) as IPayload;
        } catch (err) {
            throw new AppError("Invalid Token!", 401);
        }

        const { sub: userId, email } = decode;

        const userToken = await this.usersTokensRepository.findByUserAndRefreshToken(
            userId,
            refreshToken
        );

        if (!userToken) {
            throw new AppError("Refresh Token does not exist!");
        }

        // Delete old refresh token
        await this.usersTokensRepository.delete(userToken.id);

        // Generate new refresh token
        const newRefreshToken = sign({ email }, auth.secretRefreshToken, {
            subject: userId,
            expiresIn: auth.expiresInRefreshToken,
        });

        const refreshTokenExpiresDate = this.dateProvider.addDays(auth.expiresRefreshTokenDays);

        await this.usersTokensRepository.create({
            user_id: userId,
            expires_date: refreshTokenExpiresDate,
            refresh_token: newRefreshToken,
        });

        const newToken = sign({ email }, auth.secretToken, {
            subject: userId,
            expiresIn: auth.expiresInToken,
        });

        return {
            token: newToken,
            refreshToken: newRefreshToken,
        };
    }
}

export { RefreshTokenUseCase };
