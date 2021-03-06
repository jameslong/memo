import Arr = require('./utils/array');
import Message = require('./message');

export type ReplyOption = ReplyOptionKeyword | ReplyOptionDefault;
export type ReplyOptions = ReplyOption[];

export const ReplyOptionType = {
        Default: 'default',
        Keyword: 'keyword',
}

export interface ReplyOptionBase<T> {
        type: string;
        parameters: T;
        messageDelays: Message.ReplyThreadDelay[];
}

interface KeywordParameters {
        condition: string;
        matches: string[];
}
export interface ReplyOptionKeyword extends ReplyOptionBase<KeywordParameters> {}
export interface ReplyOptionDefault extends ReplyOptionBase<{}>{}

export function createReplyOptionKeyword (): ReplyOptionKeyword
{
        return {
                type: ReplyOptionType.Keyword,
                parameters: {
                        condition: '',
                        matches: []
                },
                messageDelays: [Message.createReplyThreadDelay()]
        };
}

export function isReplyOptionType (type: string)
{
        return (type === ReplyOptionType.Default ||
                type === ReplyOptionType.Keyword);
}

export function getReplyOptionTypes ()
{
        return [ReplyOptionType.Default,
                ReplyOptionType.Keyword];
}
