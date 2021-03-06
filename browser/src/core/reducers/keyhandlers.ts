import Actions = require('../actions/actions');
import Arr = require('../../../../core/src/utils/array');
import Clock = require('../../../../core/src/clock');
import Data = require('../data');
import DateHelpers = require('../../../../core/src/utils/date');
import Draft = require('../draft');
import Folder = require('../folder');
import Func = require('../../../../core/src/utils/function');
import Helpers = require('../../../../core/src/utils/helpers');
import LocalStorage = require('../localstorage');
import MathUtils = require('../../../../core/src/utils/math');
import Map = require('../../../../core/src/utils/map');
import Menu = require('../menu');
import MessageCore = require('../../../../core/src/message');
import PromisesReply = require('../../../../core/src/promisesreply');
import Player = require('../../../../core/src/player');
import Redux = require('../redux/redux');
import Client = require('../client');
import UI = require('../ui');

// Key event action creators
export function exit (client: Client.Client)
{
        return Actions.setMode(UI.Modes.INDEX_INBOX);
}

export function openMainMenu (client: Client.Client)
{
        return Actions.setMode(UI.Modes.MAIN_MENU);
}

export function exitMainMenu (client: Client.Client)
{
        return Actions.setMode(UI.Modes.INDEX_INBOX);
}

export function nextMenuOption (client: Client.Client)
{
        const currentIndex = client.ui.activeMainMenuIndex;
        const items = Menu.getMainMenuItems(client.ui.hasSeenInbox);
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex + 1);
        return Actions.setActiveMenuIndex(index);
}

export function previousMenuOption (client: Client.Client)
{
        const currentIndex = client.ui.activeMainMenuIndex;
        const items = Menu.getMainMenuItems(client.ui.hasSeenInbox);
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex - 1);
        return Actions.setActiveMenuIndex(index);
}

export function selectMenuOption (client: Client.Client): Redux.Action<any>
{
        const index = client.ui.activeMainMenuIndex;
        const items = Menu.getMainMenuItems(client.ui.hasSeenInbox);
        const item = items[index];
        const type = item.type;

        switch (type) {
        case 'CONTINUE_GAME':
        case 'RESUME_GAME':
                return Actions.setMode(UI.Modes.INDEX_INBOX);

        case 'NEW_GAME':
                return Actions.setMode(UI.Modes.NEW_GAME);

        case 'HOW_TO_PLAY':
                return Actions.setMode(UI.Modes.HOW_TO_PLAY);

        case 'SAVE':
                return Actions.setMode(UI.Modes.SAVE_MENU);

        case 'LOAD':
                return Actions.setMode(UI.Modes.LOAD_MENU);

        case 'QUIT':
                return Actions.quit();

        default:
                return null;
        }
}

export function exitSave (client: Client.Client)
{
        return Actions.setMode(UI.Modes.MAIN_MENU);
}

export function save (client: Client.Client)
{
        const index = client.ui.activeSaveIndex;
        const items = Menu.getSaveMenuItems();
        const item = items[index];
        if (item) {
                let saveName = item.text;
                if (item.type === 'NEW_SAVE') {
                        const player = client.data.player;
                        const clock = client.data.clock;
                        const timeMs = Clock.gameTimeMs(clock);
                        const time = DateHelpers.getTime(timeMs);
                        const players = client.server.db.players;
                        const playerState = players[Object.keys(players)[0]];
                        const day = Player.gameDay(clock, playerState);
                        const { firstName, lastName } = player;
                        saveName = `${firstName} ${lastName} - Day ${day} - ${time}`;
                }
                const saveData = Client.getSaveData(client, saveName);
                console.log('Saving', saveData);
                return LocalStorage.save(saveData);
        }
}

export function nextSave (client: Client.Client)
{
        const currentIndex = client.ui.activeSaveIndex;
        const items = Menu.getSaveMenuItems();
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex + 1);
        return Actions.setActiveSaveIndex(index);
}

export function previousSave (client: Client.Client)
{
        const currentIndex = client.ui.activeSaveIndex;
        const items = Menu.getSaveMenuItems();
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex - 1);
        return Actions.setActiveSaveIndex(index);
}

export function exitLoad (client: Client.Client)
{
        return Actions.setMode(UI.Modes.MAIN_MENU);
}

export function load (client: Client.Client)
{
        const activeIndex = client.ui.activeLoadIndex;
        const items = Menu.getLoadMenuItems();
        const item = items[activeIndex];
        if (item) {
                const saveName = item.text;
                console.log('Loading', saveName);
                const saveData = LocalStorage.load<Client.SaveData>(saveName);
                return Actions.importSaveData(saveData);
        }
}

export function nextLoad (client: Client.Client)
{
        const currentIndex = client.ui.activeLoadIndex;
        const items = Menu.getLoadMenuItems();
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex + 1);
        return Actions.setActiveLoadIndex(index);
}

export function previousLoad (client: Client.Client)
{
        const currentIndex = client.ui.activeLoadIndex;
        const items = Menu.getLoadMenuItems();
        const max = items.length - 1;
        const index = MathUtils.inRange(0, max, currentIndex - 1);
        return Actions.setActiveLoadIndex(index);
}

export function deleteSave (client: Client.Client)
{
        const ui = client.ui;
        const index = ui.mode === UI.Modes.SAVE_MENU ?
                ui.activeSaveIndex : ui.activeLoadIndex;
        const saves = LocalStorage.getSaveNames();
        const saveName = saves[index];
        if (saveName) {
                LocalStorage.deleteSave(saveName);
        }
}

export function exitHowToPlay (client: Client.Client)
{
        return Actions.setMode(UI.Modes.MAIN_MENU);
}

export function help (client: Client.Client)
{
        return Actions.setMode(UI.Modes.HELP);
}

export function displayMessage (client: Client.Client)
{
        return Actions.displayMessage(client.ui.activeMessageId);
}

export function mail (client: Client.Client)
{
        const sender = client.data.player.email;
        return Actions.composeMessage({ sender });
}

export function reply (client: Client.Client)
{
        const sender = client.data.player.email;
        const message = Client.getActiveMessage(client);
        return Actions.composeReply({ sender, message });
}

export function nextMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return Actions.setActiveMessage(nextId);
}

export function previousMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return Actions.setActiveMessage(previousId);
}

export function exitHelp (client: Client.Client)
{
        const mode = client.ui.previousMode;
        return Actions.setMode(mode);
}

export function send (client: Client.Client): Redux.Action<any>
{
        const draft = client.draftMessage;
        const id = Client.nextMessageId(client, draft.content.from);
        const parent = client.data.messagesById[client.draftMessage.parentId];
        const inReplyToId = parent ? parent.id : null;

        const reply = Draft.createReplyFromDraft(draft, id, inReplyToId);
        const data = client.data;
        const timestampMs = Clock.gameTimeMs(client.data.clock);
        const app = client.server.app;

        PromisesReply.handleReplyMessage(
                reply,
                timestampMs,
                app.narratives,
                app.promises)
        .then(result => {
                const message = Draft.createMessageFromReply(reply, timestampMs);
                const action = Actions.sendMessage({
                        message, parentId: inReplyToId });
                Redux.handleAction(action);
        }).catch(err => console.log(err));

        return Actions.sendingMessage(true);
}

export function openAttachment (client: Client.Client): Redux.Action<any>
{
        const currentMessage = Client.getActiveMessage(client);
        const attachmentPath = currentMessage.attachment;
        if (attachmentPath) {
                client.openFile(attachmentPath);
        }

        return null;
}

export function folder (client: Client.Client)
{
        return Actions.setMode(UI.Modes.FOLDER);
}

export function displayFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const activeMessageId = messageIds.length ?
                messageIds[0] :
                null;
        const folder = client.data.foldersById[activeFolderId];
        const params = {
                folderId: activeFolderId,
                messageId: activeMessageId,
                folderType: folder.type,
        };
        return Actions.displayFolder(params);
}

export function nextFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const folders = client.data.folders;
        const nextId = Arr.nextValue(folders, activeFolderId);
        return Actions.setActiveFolder(nextId);
}

export function previousFolder (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const folders = client.data.folders;
        const previousId = Arr.previousValue(folders, activeFolderId);
        return Actions.setActiveFolder(previousId);
}

export function displayNextMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const nextId = Arr.nextValue(messageIds, id);
        return Actions.displayMessage(nextId);
}

export function displayPreviousMessage (client: Client.Client)
{
        const activeFolderId = client.ui.activeFolderId;
        const messageIds = client.data.messageIdsByFolderId[activeFolderId];
        const id = client.ui.activeMessageId;
        const previousId = Arr.previousValue(messageIds, id);
        return Actions.displayMessage(previousId);
}

export function editBody (client: Client.Client)
{
        return Actions.editBody();
}

export function endEditBody (client: Client.Client)
{
        return Actions.endEditBody();
}

export function editSubject (client: Client.Client)
{
        return Actions.editSubject(true);
}

export function editTo (client: Client.Client)
{
        return Actions.editTo(true);
}

export function nextKey (client: Client.Client)
{
        const index = client.ui.activeKeyIndex;
        const ids = client.data.profiles;
        const nextIndex = MathUtils.inRange(0, ids.length - 1, index + 1);
        return Actions.setActiveKeyIndex(nextIndex);
}

export function previousKey (client: Client.Client)
{
        const index = client.ui.activeKeyIndex;
        const ids = client.data.profiles;
        const nextIndex = MathUtils.inRange(0, ids.length - 1, index - 1);
        return Actions.setActiveKeyIndex(nextIndex);
}

export function tickFaster (client: Client.Client)
{
        return Actions.tickFaster();
}

export function tickSlower (client: Client.Client)
{
        return Actions.tickSlower();
}

export function addTimeOffset (client: Client.Client)
{
        const offsetMs = 6 * 3600 * 1000;
        return Actions.addTimeOffset(offsetMs);
}

export function toggleDebugInfo (client: Client.Client)
{
        return Actions.toggleDebugInfo();
}
