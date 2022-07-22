import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUsersTokensRepository {
    create(data: ICreateUserTokenDTO): Promise<UserToken>;
    findByUserAndRefreshToken(userId: string, refreshToken: string): Promise<UserToken>;
    findByRefreshToken(refreshToken: string): Promise<UserToken>;
    delete(id: string): Promise<void>;
}

export { IUsersTokensRepository };
