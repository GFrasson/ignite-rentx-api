import { resolve } from "path";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { deleteFile } from "@utils/file";

interface IRequest {
    userId: string;
    avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ userId, avatarFile }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(userId);

        if (user.avatar) {
            await deleteFile(resolve("tmp", "avatar", user.avatar));
        }

        user.avatar = avatarFile;

        await this.usersRepository.create(user);
    }
}

export { UpdateUserAvatarUseCase };
