/// <reference path="../typings/es6-polyfill/es6-polyfill.d.ts" />

import Data = require('../core/src/data');
import DBTypes = require('../core/src/dbtypes');
import FileSystem = require('../core/src/filesystem');
import LocalDB = require('../core/src/localdb');
import Main = require('../core/src/main');
import Message = require('../core/src/message');
import Player = require('../core/src/player');
import State = require('../core/src/gamestate');

export function createPlayer0 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const firstName = 'John';
        const lastName = 'Smith';
        const version = 'test';
        const timezoneOffset = 0;
        return Player.createPlayerState(
                email, version, firstName, lastName, timezoneOffset);
}

export function createMessage0 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const id = '<0.john@smith.com>';
        const version = 'Test';
        const name = 'test';
        const threadStartName: string = null;
        const numberOfChildren = 3;
        const sentTimestampMs = 1465226704795;
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function createMessage1 ()
{
        const email = 'testemailaddress@playtopsecret.com';
        const id = '<1.john@smith.com>';
        const version = 'Test';
        const name = 'test';
        const threadStartName: string = null;
        const numberOfChildren = 2;
        const sentTimestampMs = 1465226704795;
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function createMessage (
        name: string, email: string, groupData: State.NarrativeState)
{
        const id = `<${name}.${email}>`;
        const threadStartName: string = null;
        const messageData = groupData.messages[name];
        const numberOfChildren = messageData.children.length;
        const sentTimestampMs = Date.now();
        return Message.createMessageState(
                email,
                id,
                name,
                sentTimestampMs,
                threadStartName,
                numberOfChildren);
}

export function createGameKey ()
{
        return { gameKey: 'test key' };
}

export function testGameData ()
{
        const contentPath = 'content';
        const groupName = 'test_data';
        return Data.loadGameData(contentPath, groupName);
}

const delayMs = 10;
export const createDB = () => LocalDB.createLocalDBCalls(
        LocalDB.createDB(), delayMs);

let idCounter = 0;
function generateMessageId (): string
{
        var id = idCounter.toString();
        idCounter += 1;
        return id;
}

function createSendFn ()
{
        return (messageData: Message.MessageData) =>
                Promise.resolve(generateMessageId());
}

export function createPromises ()
{
        const db = createDB();
        const send = createSendFn();
        return DBTypes.createPromiseFactories(db, send);
}
