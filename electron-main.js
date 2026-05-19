const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Configurația ferestrei native de Windows
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: 'rgba(0,0,0,0)', // Transparent, pentru a lăsa fundalul CSS vizibil
            symbolColor: '#8e8e93', // Culoare neutră pentru butoane
            height: 40 // Înălțimea zonei pentru controale
        },
        icon: path.join(__dirname, 'assets/icon.ico'), // Opțional: adaugă o pictogramă .ico aici
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Ascunde meniul implicit de browser (File, Edit, View etc.)
    // mainWindow.setMenuBarVisibility(false); // Nu mai este necesar cu frame: false

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