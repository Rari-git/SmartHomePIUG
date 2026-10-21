const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: 'rgba(0,0,0,0)',
            symbolColor: '#8e8e93',
            height: 40
        },
        icon: path.join(__dirname, 'assets/icon.ico'),
        backgroundColor: '#000000',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            v8CacheOptions: 'bypassHeatCheckAndEagerCompile',
            spellcheck: false
        }
    });

    mainWindow.on('minimize', () => {
        if (process.platform === 'win32') {
            mainWindow.setThumbarButtons([]);
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        mainWindow.loadFile('index.html');
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});