
export interface MailAnalyticsInputDto {
    content: string;
    subject: string;
    to: string;
    from: string;
    date?: string;
    messageId?: string;
    inReplyTo?: string;
    references?: string;
    html?: string;
    text?: string;
    attachments?: string;
    headers?: string;
    priority?: string;
    read?: boolean;
    starred?: boolean;
    deleted?: boolean;
    sent?: boolean;
    draft?: boolean;
    label?: string;
    folder?: string;
    threadId?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
    }

    export interface AnalyticsInputDto {
        url: string;
        prompt: string;
        max_tokens?: number;
        apiKey: string;
    }