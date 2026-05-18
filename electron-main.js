const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Configurația ferestrei native de Windows
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        icon: path.join(__dirname, 'assets/icon.ico'), // Opțional: adaugă o pictogramă .ico aici
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Ascunde meniul implicit de browser (File, Edit, View etc.)
    mainWindow.setMenuBarVisibility(false);

    // Încarcă pagina principală a aplicației tale SmartHome
    mainWindow.loadFile('index.html');
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