const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');

let mainWindow;
let portBecuri;
let portBoxe;

// Folosim Map() pentru a păstra doar ULTIMA comandă validă pentru un anumit dispozitiv
const stadiuBecuri = new Map();
const stadiuBoxe = new Map();

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

    portBecuri = new SerialPort({ path: 'COM4', baudRate: 9600 }, function (err) {
        if (err) { return console.log('❌ Eroare Port Becuri (COM4): ', err.message); }
        console.log('✅ Port Becuri conectat pe COM4');
    });
    
    portBoxe = new SerialPort({ path: 'COM6', baudRate: 9600 }, function (err) {
        if (err) { return console.log('❌ Eroare Port Boxe (COM6): ', err.message); }
        console.log('✅ Port Boxe conectat pe COM6');
    });

    // MOTOR DE TRIMITERE INTELIGENT
    // Rulează la fiecare 75ms (foarte prietenos cu SimulIDE, dar invizibil pentru ochiul uman)
    setInterval(() => {
        if (portBecuri && portBecuri.isOpen && stadiuBecuri.size > 0) {
            for (let [cheie, comanda] of stadiuBecuri) {
                portBecuri.write(comanda.trim() + '\n');
            }
            stadiuBecuri.clear(); // După ce le trimitem, golim memoria
        }
        
        if (portBoxe && portBoxe.isOpen && stadiuBoxe.size > 0) {
            for (let [cheie, comanda] of stadiuBoxe) {
                portBoxe.write(comanda.trim() + '\n');
            }
            stadiuBoxe.clear(); // După ce le trimitem, golim memoria
        }
    }, 75);
});

// Parsăm comanda. Ex: "DIM_2_255" devine cheia "DIM_2". 
// Dacă vine imediat "DIM_2_0", vechea valoare e ștearsă instant și înlocuită de cea nouă.
ipcMain.on('send-serial-becuri', (event, comanda) => {
    const parti = comanda.trim().split('_');
    if (parti.length >= 2) {
        stadiuBecuri.set(`${parti[0]}_${parti[1]}`, comanda);
    }
});

ipcMain.on('send-serial-boxe', (event, comanda) => {
    const parti = comanda.trim().split('_');
    if (parti.length >= 2) {
        stadiuBoxe.set(`${parti[0]}_${parti[1]}`, comanda);
    }
});