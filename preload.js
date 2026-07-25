const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendBecuri: (comanda) => ipcRenderer.send('send-serial-becuri', comanda),
    sendBoxe: (comanda) => ipcRenderer.send('send-serial-boxe', comanda)
});