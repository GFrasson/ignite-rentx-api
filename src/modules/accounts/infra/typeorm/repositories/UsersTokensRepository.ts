import { Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import AppDataSource from "@shared/infra/typeorm";

import { UserToken } from "../entities/UserToken";

class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserToken>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserToken);
    }

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = this.repository.create({
            user_id,
            refresh_token,
            expires_date,
        });

        await this.repository.save(userToken);

        return userToken;
    }

    async findByUserAndRefreshToken(userId: string, refreshToken: string): Promise<UserToken> {
        const userToken = await this.repository.findOneBy({
            user_id: userId,
            refresh_token: refreshToken,
        });

        return userToken;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export { UsersTokensRepository };
