import { showToast, getTempUnit } from './utils.js';
import { updateClimateAverages, fetchWeather } from './app.js';

const BACKGROUNDS = [
    { filename: "bg-blue.jpg", dominantColor: "#007aff" },
    { filename: "bg-orange.jpg", dominantColor: "#ff9500" },
    { filename: "bg-green.jpg", dominantColor: "#34c759" },
    { filename: "bg-purple.jpg", dominantColor: "#af52de" }
];

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
}
initBackgroundAndAccent();

document.addEventListener('DOMContentLoaded', () => {
    updateUnitButtons();

    if (!document.querySelector('meta[name="view-transition"]')) {
        const metaVT = document.createElement('meta');
        metaVT.name = 'view-transition';
        metaVT.content = 'same-origin';
        document.head.appendChild(metaVT);
    }
    updateUiBackgroundSettings();

    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.getAttribute('data-action');

        if (action === 'toggle-dark-mode') toggleDarkMode();
        else if (action === 'toggle-auto-accent') toggleAutoAccent();
        else if (action === 'toggle-help') toggleHelp();
        else if (action === 'toggle-nav') toggleNav();
        else if (action === 'change-bg') changeBackground(parseInt(target.dataset.idx));
        else if (action === 'set-temp-unit') setTempUnit(target.dataset.unit);
        else if (action === 'set-manual-accent') setManualAccentColor(target.dataset.color);
    });
});

function getAbsoluteAssetUrl(filename) {
    const path = window.location.pathname;
    const isSubfolder = path.includes('/html/') || path.includes('\\html\\');
    const isDist = path.includes('/dist/') || path.includes('\\dist\\');
    const relativePath = (isSubfolder || isDist) ? `../assets/${filename}` : `assets/${filename}`;

    return new URL(relativePath, window.location.href).href;
}

function initBackgroundAndAccent() {
    const bgIndex = getCurrentBgIndex();
    const bgConfig = BACKGROUNDS[bgIndex];

    const absoluteUrl = getAbsoluteAssetUrl(bgConfig.filename);

    const bgUrl = `url('${absoluteUrl}')`;
    document.documentElement.style.setProperty('--app-bg', bgUrl);

    if (isAutoAccentOn()) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = absoluteUrl;

        img.onload = function () {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1;
                canvas.height = 1;

                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

                let hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

                const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
                if (hsp < 60) {
                    hexColor = `rgb(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)})`;
                }

                document.documentElement.style.setProperty('--accent-color', hexColor);
            } catch (e) {
                document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
            }
        };

        img.onerror = function () {
            document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
        };
    } else {
        const savedColor = localStorage.getItem('accentColor');
        if (savedColor) {
            document.documentElement.style.setProperty('--accent-color', savedColor);
        }
    }
}

function getCurrentBgIndex() {
    return parseInt(localStorage.getItem('appBgIndex')) || 0;
}

function isAutoAccentOn() {
    const val = localStorage.getItem('autoAccentColor');
    if (val === null) return true;
    return val === 'true';
}

function setManualAccentColor(color) {
    if (isAutoAccentOn()) {
        showToast("Disable 'Auto Detection' to choose a color manually.", { isError: true });
        return;
    }
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
    showToast("Accent color saved.");
}

function changeBackground(index) {
    if (index < 0 || index >= BACKGROUNDS.length) return;
    localStorage.setItem('appBgIndex', index);

    const bgConfig = BACKGROUNDS[index];
    const absoluteUrl = getAbsoluteAssetUrl(bgConfig.filename);

    const bgUrl = `url('${absoluteUrl}')`;
    document.documentElement.style.setProperty('--app-bg', bgUrl);

    if (isAutoAccentOn()) {
        initBackgroundAndAccent();
    }

    if (typeof updateUiBackgroundSettings === 'function') {
        updateUiBackgroundSettings();
    }
    showToast("Background updated.");
}

function setTempUnit(unit) {
    localStorage.setItem('tempUnit', unit);
    updateClimateAverages();
    fetchWeather();
    updateUnitButtons();

    if (typeof window.syncDOMWithMemory === 'function') {
        window.syncDOMWithMemory();
    }

    showToast(`Unit changed to °${unit}.`);
}

function updateUnitButtons() {
    const unit = getTempUnit();
    const btnC = document.getElementById('btn-unit-c');
    const btnF = document.getElementById('btn-unit-f');
    if (btnC) btnC.classList.toggle('active', unit === 'C');
    if (btnF) btnF.classList.toggle('active', unit === 'F');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function toggleAutoAccent() {
    const current = isAutoAccentOn();
    const newState = !current;

    localStorage.setItem('autoAccentColor', newState ? 'true' : 'false');

    if (newState === true) {
        initBackgroundAndAccent();
        showToast("Auto color detection enabled.");
    } else {
        const savedColor = localStorage.getItem('accentColor') || '#007aff';
        document.documentElement.style.setProperty('--accent-color', savedColor);
        showToast("Auto detection disabled. You can now choose a color manually.");
    }

    updateUiBackgroundSettings();
}

function updateUiBackgroundSettings() {
    const isAuto = isAutoAccentOn();

    const switchEl = document.getElementById('auto-accent-toggle');
    if (switchEl) switchEl.checked = isAuto;

    const manualZone = document.getElementById('manual-accent-container');
    if (manualZone) {
        manualZone.classList.toggle('disabled-zone', isAuto);
    }

    const currentBgIndex = getCurrentBgIndex();
    document.querySelectorAll('.bg-option').forEach((el, index) => {
        if (index === currentBgIndex) {
            el.style.borderColor = 'var(--accent-color)';
            el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        } else {
            el.style.borderColor = 'transparent';
            el.style.boxShadow = 'none';
        }
    });
}

function changeAccentColor(color) {
    if (isAutoAccentOn()) {
        showToast("Disable 'Auto Detection' to choose a color manually.", { isError: true });
        return;
    }
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const validationButtons = document.querySelectorAll('button[onclick^="validate"]');
        if (validationButtons.length > 0) {
            validationButtons[0].click();
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

    if (nav) {
        const navTitle = nav.querySelector('h2');
        if (navTitle) navTitle.innerText = "Lumen";
    }

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

export {
    toggleDarkMode,
    changeAccentColor,
    setManualAccentColor,
    toggleHelp,
    toggleNav,
    changeBackground,
    toggleAutoAccent,
    setTempUnit,
    getCurrentBgIndex,
    isAutoAccentOn,
    updateUiBackgroundSettings
};

// Keep global bindings ONLY for raw static HTML files that need inline event access
window.toggleDarkMode = toggleDarkMode;
window.changeAccentColor = changeAccentColor;
window.toggleHelp = toggleHelp;
window.toggleNav = toggleNav;
window.changeBackground = changeBackground;
window.toggleAutoAccent = toggleAutoAccent;
window.setTempUnit = setTempUnit;
window.updateUiBackgroundSettings = updateUiBackgroundSettings;