interface ITemplateVariables {
    name: string;
    link: string;
}

interface IMailProvider {
    sendMail(
        to: string,
        subject: string,
        variables: ITemplateVariables,
        path: string
    ): Promise<void>;
}

export { IMailProvider, ITemplateVariables };
