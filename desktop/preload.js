const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // We can add IPC communication here later if needed
    // e.g., sendNotification: (msg) => ipcRenderer.send('notify', msg)
});
