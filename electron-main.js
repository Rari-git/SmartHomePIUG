const { app, BrowserWindow } = require('electron');
const path = require('path');

// Optimizări performanță motor Electron
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
// app.commandLine.appendSwitch('disable-background-timer-throttling'); // Opțional: menține fluiditatea animațiilor în fundal (folosește mai multe resurse)

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
        backgroundColor: '#000000', // Previne 'white flash' la pornire, util pt teme întunecate
        show: false, // Fereastra va fi ascunsă până când este gata de afișare
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            v8CacheOptions: 'bypassHeatCheckAndEagerCompile', // Optimizare cache JS pentru pornire mai rapidă
            spellcheck: false // Dacă aplicația nu are nevoie de corectură gramaticală, salvează memorie
        }
    });

    // Curățare memorie RAM la minimizare
    mainWindow.on('minimize', () => {
        if (process.platform === 'win32') {
            mainWindow.setThumbarButtons([]); // Curăță potențiale referințe inutile
        }
    });

    // Afișare lină doar când DOM-ul este complet gata
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        //mainWindow.focus();
    });

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