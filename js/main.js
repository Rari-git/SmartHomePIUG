import { showToast } from './ui.js';
import { actualizeazaMediiClimat, fetchWeather, getTempUnit } from './app.js';

const BACKGROUNDS = [
    { filename: "bg-blue.jpg", dominantColor: "#007aff" }, // Albastru Ocean / Sky
    { filename: "bg-orange.jpg", dominantColor: "#ff9500" }, // Portocaliu / Gradient Warm
    { filename: "bg-green.jpg", dominantColor: "#34c759" }, // Verde Natural (Calibrat la nuanța iOS/HomeKit)
    { filename: "bg-purple.jpg", dominantColor: "#af52de" }  // Mov / Purple Vibrant (Corectat din #9b59b6 în nuanța exactă)
];

// Inițializare imediată a temei și fundalului pentru a preveni flash-ul negru (înainte de DOMContentLoaded)
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
}
initBackgroundAndAccent();

document.addEventListener('DOMContentLoaded', () => {
    actualizeazaButoaneUnitate();

    if (!document.querySelector('meta[name="view-transition"]')) {
        const metaVT = document.createElement('meta');
        metaVT.name = 'view-transition';
        metaVT.content = 'same-origin';
        document.head.appendChild(metaVT);
    }
    actualizeazaUiSetariBackground();
});

function getBasePath() {
    // Detectăm dacă suntem într-un subfolder (cum e /html/) sau la rădăcină
    const isSubfolder = window.location.pathname.includes('/html/') || window.location.pathname.includes('\\html\\');
    return isSubfolder ? '../assets' : 'assets';
}

function initBackgroundAndAccent() {
    const bgIndex = getCurentBgIndex();
    const basePath = getBasePath();
    const bgConfig = BACKGROUNDS[bgIndex];

    // Construim calea relativă corectă pentru CSS injectat în HTML
    const relativePath = `${basePath}/${bgConfig.filename}`;

    const bgUrl = `url('${relativePath}')`;
    document.documentElement.style.setProperty('--app-bg', bgUrl);

    if (isAutoAccentOn()) {
        const cleanUrl = `${basePath}/${bgConfig.filename}`;
        
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Previne erorile de securitate CORS în Electron
        img.src = cleanUrl;
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1;
                canvas.height = 1;
                
                // Desenarea imaginii la scară 1x1 calculează automat media culorilor
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                
                // Convertim în format HEX
                let hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                
                // OPTIMIZARE PENTRU LIZIBILITATE (Evităm culorile prea șterse sau prea închise)
                // Dacă fundalul este prea întunecat sau spălat, aplicăm un factor de saturație/luminanță
                const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
                if (hsp < 60) {
                    // Dacă e prea închis (ex: fundal de noapte), forțăm o nuanță mai deschisă din același spectru
                    hexColor = `rgb(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)})`;
                }
                
                document.documentElement.style.setProperty('--accent-color', hexColor);
            } catch (e) {
                // Fallback în caz de eroare la canvas
                document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
            }
        };
        
        img.onerror = function() {
            document.documentElement.style.setProperty('--accent-color', bgConfig.dominantColor);
        };
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
    const val = localStorage.getItem('autoAccentColor');
    // Dacă nu e setat deloc, implicit punem true (sau false, depinde cum doriți)
    if (val === null) return true; 
    return val === 'true'; // Returnează true DOAR dacă este stringul 'true'
}

function seteazaCuloareAccentManual(color) {
    if (isAutoAccentOn()) {
        // Dacă isAutoAccentOn() este pe bune activ (true), blocăm schimbarea
        showToast("Dezactivează 'Detecție Automată' pentru a alege o culoare manual.", { isError: true });
        return;
    }
    // Dacă este OFF (false), aplicăm culoarea fără probleme
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
    showToast("Culoarea de accent a fost salvată.");
}

function schimbaFundal(index) {
    if (index < 0 || index >= BACKGROUNDS.length) return;
    localStorage.setItem('appBgIndex', index);

    const basePath = getBasePath();
    const bgConfig = BACKGROUNDS[index];
    const relativePath = `${basePath}/${bgConfig.filename}`;
    
    const bgUrl = `url('${relativePath}')`;
    document.documentElement.style.setProperty('--app-bg', bgUrl);

    if (isAutoAccentOn()) {
        // Apelăm re-inițializarea pentru a declanșa recalcularea dinamică a culorii
        initBackgroundAndAccent();
    }

    if (window.actualizeazaUiSetariBackground) {
        window.actualizeazaUiSetariBackground();
    }
    showToast("Fundalul a fost actualizat.");
}

function setTempUnit(unit) {
    localStorage.setItem('tempUnit', unit);
    // Recalculează mediile și actualizează toate elementele DOM de temperatură
    actualizeazaMediiClimat();
    // Actualizează widget-ul meteo
    fetchWeather();
    // Actualizează starea vizuală a butoanelor în Setări
    actualizeazaButoaneUnitate();
    
    // -- NOU: Forțează cardurile din pagină să preia noua conversie --
    if (typeof window.sincronizeazaDOMcuMemoria === 'function') {
        window.sincronizeazaDOMcuMemoria();
    }
    
    showToast(`Unitatea a fost schimbată în °${unit}.`);
}

function actualizeazaButoaneUnitate() {
    const unit = getTempUnit();
    const btnC = document.getElementById('btn-unit-c');
    const btnF = document.getElementById('btn-unit-f');
    if (btnC) btnC.classList.toggle('active', unit === 'C');
    if (btnF) btnF.classList.toggle('active', unit === 'F');
}

export {
    showToast,
    toggleDarkMode,
    schimbaCuloareAccent,
    seteazaCuloareAccentManual,
    toggleHelp,
    toggleNav,
    schimbaFundal,
    toggleAutoAccent,
    setTempUnit,
    getCurentBgIndex,
    isAutoAccentOn,
    actualizeazaUiSetariBackground
};

window.toggleDarkMode = toggleDarkMode;
window.schimbaCuloareAccent = schimbaCuloareAccent;
window.toggleHelp = toggleHelp;
window.toggleNav = toggleNav;
window.schimbaFundal = schimbaFundal;
window.toggleAutoAccent = toggleAutoAccent;
window.setTempUnit = setTempUnit;
window.actualizeazaUiSetariBackground = actualizeazaUiSetariBackground;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function toggleAutoAccent() {
    const curent = isAutoAccentOn();
    const nouaStare = !curent;
    
    // Salvăm explicit ca text 'true' sau 'false'
    localStorage.setItem('autoAccentColor', nouaStare ? 'true' : 'false');

    // CORECTURĂ: Verificăm direct nouaStare în care a trecut aplicația
    if (nouaStare === true) {
        // Dacă s-a activat (nouaStare este true)
        initBackgroundAndAccent();
        showToast("Detecția automată a culorii a fost activată.");
    } else {
        // Dacă s-a dezactivat (nouaStare este false)
        const savedColor = localStorage.getItem('accentColor') || '#007aff';
        document.documentElement.style.setProperty('--accent-color', savedColor);
        showToast("Detecția automată dezactivată. Acum poți alege o culoare manual.");
    }

    // Actualizăm și starea vizuală a switch-ului și a zonelor blocate din setări
    actualizeazaUiSetariBackground();
}

function actualizeazaUiSetariBackground() {
    const isAuto = isAutoAccentOn();
    
    // Sincronizăm switch-ul din interfață
    const switchEl = document.getElementById('auto-accent-toggle');
    if (switchEl) switchEl.checked = isAuto;

    // Blocăm/Deblocăm vizual zona de culori manuale
    const manualZone = document.getElementById('manual-accent-container');
    if (manualZone) {
        manualZone.classList.toggle('disabled-zone', isAuto);
    }

    // Actualizăm highlight-ul fundalului selectat (vizibil în pagina de setări)
    const curentBgIndex = getCurentBgIndex();
    document.querySelectorAll('.bg-option').forEach((el, index) => {
        if (index === curentBgIndex) {
            el.style.borderColor = 'var(--accent-color)';
            el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        } else {
            el.style.borderColor = 'transparent';
            el.style.boxShadow = 'none';
        }
    });
}

function schimbaCuloareAccent(color) {
    if (isAutoAccentOn()) {
        showToast("Dezactivează 'Detecție Automată' pentru a alege o culoare manual.", { isError: true });
        return;
    }
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

document.addEventListener('keypress', function (e) {
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