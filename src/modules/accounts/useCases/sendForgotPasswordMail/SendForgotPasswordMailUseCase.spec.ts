import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayJsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Password Mail", () => {
    const userEmail = "test@email.com";

    beforeEach(async () => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayJsDateProvider();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );

        await usersRepositoryInMemory.create({
            driver_license: "123456",
            email: userEmail,
            name: "Test user",
            password: "123546",
        });
    });

    it("should be able to send forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");

        await sendForgotPasswordMailUseCase.execute(userEmail);

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send email if user does not exist", async () => {
        const invalidEmail = "invalid@email.com";

        await expect(sendForgotPasswordMailUseCase.execute(invalidEmail)).rejects.toEqual(
            new AppError("User does not exist")
        );
    });

    it("should be able to create an user token", async () => {
        const createMailToken = jest.spyOn(usersTokensRepositoryInMemory, "create");

        await sendForgotPasswordMailUseCase.execute(userEmail);

        expect(createMailToken).toHaveBeenCalled();
    });
});
