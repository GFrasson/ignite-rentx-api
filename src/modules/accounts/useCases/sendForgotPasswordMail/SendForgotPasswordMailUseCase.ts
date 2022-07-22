import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayJsDateProvider")
        private dateProvider: IDateProvider,
        @inject("EtherealMailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("User does not exist");
        }

        const token = uuidV4();

        const tokenExpiresInHours = 3;
        const expiresDate = this.dateProvider.addHours(tokenExpiresInHours);

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date: expiresDate,
        });

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            `O link para o reset é ${token}`
        );
    }
}

export { SendForgotPasswordMailUseCase };
