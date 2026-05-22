import { showToast } from './ui.js';

const BACKGROUNDS = [
    { url: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2560&q=80')", dominantColor: "#007aff" },
    { url: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=2560&q=80')", dominantColor: "#ff9500" },
    { url: "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2560&q=80')", dominantColor: "#2ecc71" },
    { url: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2560&q=80')", dominantColor: "#9b59b6" }
];

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    initBackgroundAndAccent();

    if (!document.querySelector('meta[name="view-transition"]')) {
        const metaVT = document.createElement('meta');
        metaVT.name = 'view-transition';
        metaVT.content = 'same-origin';
        document.head.appendChild(metaVT);
    }
});

function initBackgroundAndAccent() {
    const bgIndex = getCurentBgIndex();
    const bgConfig = BACKGROUNDS[bgIndex];
    document.documentElement.style.setProperty('--app-bg', bgConfig.url);

    if (isAutoAccentOn()) {
        document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
    } else {
        const savedColor = localStorage.getItem('accentColor');
        if (savedColor) {
            document.documentElement.style.setProperty('--accent-color', savedColor);
        }
    }
}

function getCurentBgIndex() {
    return parseInt(localStorage.getItem('appBgIndex')) || 0;
}

function isAutoAccentOn() {
    return localStorage.getItem('autoAccent') !== 'false'; // Implicit true
}

function schimbaFundal(index) {
    if (index < 0 || index >= BACKGROUNDS.length) return;
    localStorage.setItem('appBgIndex', index);
    
    const bgConfig = BACKGROUNDS[index];
    document.documentElement.style.setProperty('--app-bg', bgConfig.url);
    
    if (isAutoAccentOn()) {
        document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
    }

    if (window.actualizeazaUiSetariBackground) {
        window.actualizeazaUiSetariBackground();
    }
    showToast("Fundalul a fost actualizat.");
}

function toggleAutoAccent() {
    const isNowAuto = !isAutoAccentOn();
    localStorage.setItem('autoAccent', isNowAuto);
    
    if (isNowAuto) {
        const bgIndex = getCurentBgIndex();
        document.documentElement.style.setProperty('--accent-color', BACKGROUNDS[bgIndex].dominantColor);
        showToast("Culoare accent: Automată.");
    } else {
        const savedColor = localStorage.getItem('accentColor') || '#007aff';
        document.documentElement.style.setProperty('--accent-color', savedColor);
        showToast("Culoare accent: Manuală.");
    }
    
    if (window.actualizeazaUiSetariBackground) {
        window.actualizeazaUiSetariBackground();
    }
}

export { 
    toggleDarkMode, 
    schimbaCuloareAccent, 
    toggleHelp, 
    toggleNav, 
    schimbaFundal, 
    toggleAutoAccent, 
    getCurentBgIndex, 
    isAutoAccentOn 
};

window.toggleDarkMode = toggleDarkMode;
window.schimbaCuloareAccent = schimbaCuloareAccent;
window.toggleHelp = toggleHelp;
window.toggleNav = toggleNav;
window.schimbaFundal = schimbaFundal;
window.toggleAutoAccent = toggleAutoAccent;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function schimbaCuloareAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
    
    // Dezactivează automat auto-accent dacă utilizatorul alege manual o culoare
    if (isAutoAccentOn()) {
        localStorage.setItem('autoAccent', 'false');
        if (window.actualizeazaUiSetariBackground) {
            window.actualizeazaUiSetariBackground();
        }
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const butoaneValidare = document.querySelectorAll('button[onclick^="valideaza"]');
        if (butoaneValidare.length > 0) {
            butoaneValidare[0].click();
        }
    }
});

function toggleHelp() {
    const helpBox = document.getElementById('help-box');
    if (helpBox.style.display === 'none' || helpBox.style.display === '') {
        helpBox.style.display = 'block';
    } else {
        helpBox.style.display = 'none';
    }
}

function toggleNav() {
    const nav = document.querySelector('nav');
    let backdrop = document.getElementById('nav-backdrop');

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
        
        backdrop.onclick = () => {
            nav.classList.remove('active');
            backdrop.classList.remove('active');
        };
    }

    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        backdrop.classList.add('active');
    } else {
        backdrop.classList.remove('active');
    }
}