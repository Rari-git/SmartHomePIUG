const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendSerial: (comanda) => ipcRenderer.send('send-serial', comanda)
});