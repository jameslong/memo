import Arr = require('./utils/array');
import DBTypes = require('./dbtypes');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');
import Profile = require('./profile');
import Prom = require('./utils/promise');
import Promises = require('./promises');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./gamestate');
import Str = require('./utils/string');

export function handleReplyMessage (
        reply: Message.MailgunReply,
        timestampMs: number,
        data: Map.Map<State.NarrativeState>,
        promises: DBTypes.PromiseFactories)
{
        const email = reply.from;
        const inReplyToId = reply.inReplyToId;

        return promises.getMessage(inReplyToId).then(message =>
                message && !message.reply ?
                        promises.getPlayer(email).then(player =>
                                handleTimelyReply(
                                        reply,
                                        timestampMs,
                                        player,
                                        message,
                                        data,
                                        promises)) :
                        null
        );
}

export function handleTimelyReply (
        reply: Message.MailgunReply,
        timestampMs: number,
        player: Player.PlayerState,
        message: Message.MessageState,
        data: Map.Map<State.NarrativeState>,
        promises: DBTypes.PromiseFactories)
{
        const groupName = player.version;
        const groupData = data[groupName];
        const body = reply.body;
        const strippedBody = reply.strippedBody;
        const profiles = groupData.profiles;
        const profile = Profile.getProfileByEmail(reply.to, profiles);

        const messageName = message.name;
        const messageState = groupData.messages[messageName];
        const hasReplyOptions = messageState.replyOptions.length > 0;

        if (hasReplyOptions) {
                return handleDecryptedReplyMessage(
                        body,
                        strippedBody,
                        timestampMs,
                        player,
                        message,
                        groupData,
                        promises);
        } else {
                return null;
        }
}

export function handleDecryptedReplyMessage (
        body: string,
        strippedBody: string,
        timestampMs: number,
        player: Player.PlayerState,
        messageState: Message.MessageState,
        groupData: State.NarrativeState,
        promises: DBTypes.PromiseFactories)
{
        const threadMessage = groupData.messages[messageState.name];
        const replyOptions = groupData.replyOptions;
        const messageReplyOptions = replyOptions[threadMessage.replyOptions];
        const indices = messageReplyOptions.map((option, index) => index);
        const conditions = indices.filter(index => {
                const option = messageReplyOptions[index];
                const condition = <string>((<any>option.parameters)['condition']);
                return !condition ||
                        <boolean><any>Script.executeScript(condition, player, timestampMs);
        });

        const validChecks = conditions.map(index =>
                () => isValidReply(strippedBody, messageReplyOptions[index]));

        return Prom.find(validChecks).then(matched => {
                if (matched !== -1) {
                        const index = conditions[matched];
                        const option = messageReplyOptions[index];
                        messageState.reply = { index, body, timestampMs, sent: [] };
                        return promises.addMessage(messageState);
                } else {
                        return null;
                }
        });
}

export function isValidReply(
        body: string, replyOption: ReplyOption.ReplyOption): Promise<boolean>
{
        if (replyOption.type === ReplyOption.ReplyOptionType.Keyword) {
                const keywordOption = <ReplyOption.ReplyOptionKeyword>replyOption;
                return Promise.resolve(isKeywordReply(keywordOption, body));
        } else {
                return Promise.resolve(true);
        }
}

export function isKeywordReply (
        replyOption: ReplyOption.ReplyOptionKeyword, text: string): boolean
{
        const matches = replyOption.parameters.matches;
        return matches.some(match => {
                const trimmedMatch = match.trim();
                return Str.contains(text, trimmedMatch);
        });
}
