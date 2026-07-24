const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');

let mainWindow;
let arduinoPort;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();
    arduinoPort = new SerialPort({ path: 'COM5', baudRate: 9600 });
});

ipcMain.on('send-serial', (event, comanda) => {
    if (arduinoPort && arduinoPort.isOpen) {
        arduinoPort.write(comanda.trim() + '\n');
    }
});