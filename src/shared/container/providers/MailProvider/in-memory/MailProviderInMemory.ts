import { IMailProvider, ITemplateVariables } from "../IMailProvider";

interface IMessage {
    to: string;
    subject: string;
    variables: ITemplateVariables;
    path: string;
}

class MailProviderInMemory implements IMailProvider {
    private messages: IMessage[] = [];

    async sendMail(
        to: string,
        subject: string,
        variables: ITemplateVariables,
        path: string
    ): Promise<void> {
        const message: IMessage = {
            to,
            subject,
            variables,
            path,
        };

        this.messages.push(message);
    }
}

export { MailProviderInMemory };
