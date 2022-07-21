import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUsersTokensRepository {
    create(data: ICreateUserTokenDTO): Promise<UserToken>;
}

export { IUsersTokensRepository };
