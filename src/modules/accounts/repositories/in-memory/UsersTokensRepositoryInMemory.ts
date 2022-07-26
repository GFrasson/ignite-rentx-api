import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    private usersTokens: UserToken[] = [];

    async create({
        expires_date,
        refresh_token,
        user_id,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            expires_date,
            refresh_token,
            user_id,
        });

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByUserAndRefreshToken(userId: string, refreshToken: string): Promise<UserToken> {
        return this.usersTokens.find(
            (userToken) => userToken.user_id === userId && userToken.refresh_token === refreshToken
        );
    }

    async findByRefreshToken(refreshToken: string): Promise<UserToken> {
        return this.usersTokens.find((userToken) => userToken.refresh_token === refreshToken);
    }

    async delete(id: string): Promise<void> {
        const userTokenIndex = this.usersTokens.findIndex((userToken) => userToken.id === id);
        this.usersTokens.splice(userTokenIndex);
    }
}

export { UsersTokensRepositoryInMemory };
