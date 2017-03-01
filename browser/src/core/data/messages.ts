import Folder = require('../folder');

export const folders: Folder.FolderData[] = [{
        id: 'inbox',
        type: Folder.Types.INBOX,
        displayName: 'Inbox',
        messages: [],
}, {
        id: 'sent',
        type: Folder.Types.SENT,
        displayName: 'Sent',
        messages: [],
}];
