let intervalVacanta = null;
let customScenesList = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
let scenesDB = [...defaultScenes, ...customScenesList];
let subDispozitive = {};
let pinCurentIntrodus = "";
let modAlarmaActiune = "";
let timeoutSalvareStare = null; // Timeout pentru Debounce localStorage

// Executăm intro-ul direct, fără să mai așteptăm încărcarea completă a paginii.
// Astfel blocăm afișarea interfeței și scăpăm de acele frame-uri vizibile nedorite.
initIntro();

document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    incarcaNumeCasa();
    reincarcaInterfata();
    if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();

    // 🚀 SISTEM GLOBAL: EVENT DELEGATION
    // Preia toate interacțiunile UI dintr-un singur loc pentru performanță maximă
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');

        if (action === 'toggle-device') {
            toggleStareDispozitiv(target.dataset.cat, parseInt(target.dataset.idx), e);
        } else if (action === 'toggle-favorite') {
            e.stopPropagation(); toggleFavorite(target.dataset.favid, target.dataset.favtype, e);
        } else if (action === 'open-device-menu') {
            e.stopPropagation(); deschideMeniuDispozitive('none', target.dataset.cat, parseInt(target.dataset.idx));
        } else if (action === 'execute-scene') {
            executaScena(target.dataset.sceneid);
        } else if (action === 'delete-scene') {
            e.stopPropagation(); stergeScenaCustom(target.dataset.sceneid, e);
        } else if (action === 'toggle-device-popup') {
            toggleStareDispozitiv(target.dataset.cat, parseInt(target.dataset.idx), e);
            deschideMeniuDispozitive('none', target.dataset.cat, parseInt(target.dataset.idx));
        } else if (action === 'delete-automation') {
            stergeAutomatizare(parseInt(target.dataset.autoid));
        } else if (action === 'add-suggestion') {
            adaugaSugestie(target.dataset.sugid);
        } else if (action === 'adjust-temp-popup') {
            ajusteazaDinPopup(target.dataset.camera, target.dataset.dir);
        } else if (action === 'open-popup-lumini') {
            deschidePopupLuminiAprinse();
        } else if (action === 'open-popup-audio') {
            deschidePopupAudioPornit();
        } else if (action === 'open-popup-all-notifs') {
            deschidePopupToateNotificarile();
        } else if (action === 'clear-motion-history') {
            localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); inchidePopup();
        } else if (action === 'toggle-and-refresh-lights') {
            e.stopPropagation(); toggleStareDispozitiv(target.dataset.cat, parseInt(target.dataset.idx), e); deschidePopupLuminiAprinse();
        } else if (action === 'toggle-and-refresh-audio') {
            e.stopPropagation(); toggleStareDispozitiv(target.dataset.cat, parseInt(target.dataset.idx), e); deschidePopupAudioPornit();
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.matches('[data-action="device-slider-input"]')) {
            const valElem = document.getElementById(`val-${e.target.dataset.cat}-${e.target.dataset.idx}`);
            if (valElem) valElem.innerText = e.target.value;
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.matches('[data-action="device-slider-input"]')) {
            if (subDispozitive[e.target.dataset.cat] && subDispozitive[e.target.dataset.cat][e.target.dataset.idx]) {
                subDispozitive[e.target.dataset.cat][e.target.dataset.idx].valoare = e.target.value;
                salveazaStarea();
            }
        } else if (e.target.matches('[data-action="toggle-automation"]')) {
            comutaAutomatizare(parseInt(e.target.dataset.autoid));
        }
    });
});

setInterval(verificaAutomatizariTimp, 60000);

// 🛡️ Siguranță: Forțăm salvarea datelor dacă fereastra aplicației este închisă brusc
window.addEventListener('beforeunload', () => {
    if (timeoutSalvareStare) {
        clearTimeout(timeoutSalvareStare);
        localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
    }
});

function initIntro() {
    // Rulează intro-ul doar o dată pe sesiune (la deschiderea aplicației)
    if (!sessionStorage.getItem('introAfisat')) {
        const isHtmlFolder = window.location.pathname.includes('/html/');
        const basePath = isHtmlFolder ? '../assets' : 'assets';
        
        // Blochează scroll-ul și ascunde bara cât timp rulează intro-ul
        document.documentElement.classList.add('hide-scrollbar');

        const introDiv = document.createElement('div');
        introDiv.id = 'app-intro';
        introDiv.innerHTML = `
            <img src="${basePath}/logo.svg" alt="OmniHome Logo" class="intro-logo">
            <div class="intro-text">OmniHome</div>
        `;
        // În cazul în care 'body' nu e gata creat, îl atașăm de documentElement
        (document.body || document.documentElement).appendChild(introDiv);

        const playIntro = () => {
            introDiv.classList.add('start-anim');
            setTimeout(() => {
                introDiv.classList.add('hidden');
                setTimeout(() => {
                    introDiv.remove();
                    document.documentElement.classList.remove('hide-scrollbar'); // Restaurăm scroll-ul
                }, 600);
            }, 2500);
        };
        
        // Așteaptă ca elementele, imaginile și layout-ul să se încarce complet pentru a preveni lag/stutter-ul
        if (document.readyState === 'complete') { playIntro(); } 
        else { window.addEventListener('load', playIntro); }
        
        sessionStorage.setItem('introAfisat', 'true');
    }
}

function initFavorites() {
    try {
        const saved = localStorage.getItem('smartHomeData');
        subDispozitive = saved ? JSON.parse(saved) : null;
        if (!subDispozitive || !subDispozitive.becuri || !localStorage.getItem('design_svg_assets_v6')) {
            subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
            localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
            localStorage.setItem('design_svg_assets_v6', 'true');
        }
    } catch (e) {
        subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
        localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
        localStorage.setItem('design_svg_assets_v6', 'true');
    }
    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_1', 'incuietori_0', 'camereVideo_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
    if (!localStorage.getItem('userAutomations')) localStorage.setItem('userAutomations', JSON.stringify([]));
}

function salveazaStarea() {
    // 🚀 Optimizare Performanță: Debounce
    // Nu mai scriem pe disc la fiecare pixel de pe slider. Așteptăm 500ms de inactivitate.
    if (timeoutSalvareStare) clearTimeout(timeoutSalvareStare);
    timeoutSalvareStare = setTimeout(() => {
        localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
        timeoutSalvareStare = null;
    }, 500); 
}

function incarcaNumeCasa() {
    const titluCasa = document.getElementById('nume-casa-global');
    if (titluCasa) titluCasa.innerText = localStorage.getItem('numeCasaSalvat') || "My Home";
}

function deschidePopupPin(mod) {
    modAlarmaActiune = mod;
    pinCurentIntrodus = "";
    const modal = document.getElementById('popup-pin-alarma');
    const display = document.getElementById('pin-display');
    const error = document.getElementById('pin-error-msg');
    if (display) display.innerText = "";
    if (error) error.style.display = "none";
    if (modal) modal.classList.add('active');
}

function inchidePopupPin() {
    const modal = document.getElementById('popup-pin-alarma');
    // Use the fade-out logic if available, otherwise fallback to direct removal
    if (typeof applyFadeOutAndClose === 'function') {
        applyFadeOutAndClose(modal);
    } else {
        if (modal) modal.classList.remove('active');
    }
}

function apasatTastaPin(tasta) {
    const display = document.getElementById('pin-display');
    const error = document.getElementById('pin-error-msg');
    if (error) error.style.display = "none";

    if (tasta === 'C') {
        pinCurentIntrodus = "";
    } else if (tasta === '⌫') {
        pinCurentIntrodus = pinCurentIntrodus.slice(0, -1);
    } else {
        if (pinCurentIntrodus.length < 4) {
            pinCurentIntrodus += tasta;
        }
    }

    if (display) display.innerText = "•".repeat(pinCurentIntrodus.length);

    if (pinCurentIntrodus.length === 4) {
        setTimeout(verificaCodPinIntrodus, 200);
    }
}

function verificaCodPinIntrodus() {
    const pinSalvat = localStorage.getItem('codPinAlarma') || "1234";
    if (pinCurentIntrodus === pinSalvat) {
        inchidePopupPin();
        if (modAlarmaActiune === 'armat') {
            executaSecurizareTotala();
        } else if (modAlarmaActiune === 'dezarmat') {
            localStorage.setItem('alarmaDezactivata', 'true');
            if (subDispozitive.incuietori) subDispozitive.incuietori.forEach(u => u.stare = "Deblocat");
            if (subDispozitive.senzoriMiscare) subDispozitive.senzoriMiscare.forEach(s => s.stare = "Inactiv");
            salveazaStarea();
            if (typeof adaugaInLog === 'function') adaugaInLog("🛡️ Securitate: Sistem dezarmat prin cod PIN.");
            if (typeof showToast === 'function') showToast("Sistemul de securitate a fost dezarmat.");
        } else if (modAlarmaActiune === 'scena_home') {
            localStorage.setItem('alarmaDezactivata', 'true');
            localStorage.setItem('activeScene', 's_home');
            const scena = scenesDB.find(s => s.id === 's_home');
            if (scena && scena.action) typeof scena.action === 'function' ? scena.action() : aplicaMod(scena.action);
            if (typeof adaugaInLog === 'function') adaugaInLog("🎭 Scenă: S-a activat scena I'm Home după confirmare PIN.");
            if (typeof showToast === 'function') showToast("Scena I'm Home a fost activată.");
        }
        if (typeof sincronizeazaDOMcuMemoria === 'function') sincronizeazaDOMcuMemoria(); else reincarcaInterfata();
    } else {
        pinCurentIntrodus = "";
        const display = document.getElementById('pin-display');
        const error = document.getElementById('pin-error-msg');
        if (display) display.innerText = "";
        if (error) error.style.display = "block";
    }
}

function salveazaCodPinNou() {
    const pinVechiInput = document.getElementById('input-pin-vechi');
    const pinNouInput = document.getElementById('input-pin-nou');
    if (!pinVechiInput || !pinNouInput) return;

    const pinVechi = pinVechiInput.value;
    const pinNou = pinNouInput.value;
    const pinSalvat = localStorage.getItem('codPinAlarma') || "1234";

    if (pinVechi !== pinSalvat) {
        if (typeof showToast === 'function') showToast("❌ Codul PIN actual este incorect!");
        return;
    }
    if (pinNou.length !== 4 || isNaN(pinNou)) {
        if (typeof showToast === 'function') showToast("❌ Codul nou trebuie să aibă 4 cifre!");
        return;
    }

    localStorage.setItem('codPinAlarma', pinNou);
    pinVechiInput.value = "";
    pinNouInput.value = "";
    if (typeof showToast === 'function') showToast("✅ Codul PIN a fost actualizat cu succes.");
}

function toggleFavorite(id, type, event) {
    if(event) event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(type === 'scene' ? 'favScenes' : 'favAcc')) || [];
    
    const isFav = favs.includes(id);
    if (isFav) {
        favs = favs.filter(item => item !== id);
    } else {
        favs.push(id);
    }
    
    localStorage.setItem(type === 'scene' ? 'favScenes' : 'favAcc', JSON.stringify(favs));

        // 1. Actualizăm vizual toate steluțele de pe ecran cu acest ID instantaneu
        const starBtns = document.querySelectorAll(`[data-favid="${id}"]`);
        starBtns.forEach(btn => {
            if (isFav) btn.classList.remove('is-fav');
            else btn.classList.add('is-fav');
        });

        // 2. 🚀 OPTIMIZARE DOM: Evităm innerHTML masiv pe ecranul Home
        const containerId = type === 'scene' ? 'fav-scenes-container' : 'fav-accessories-container';
        const container = document.getElementById(containerId);
        
        if (container) {
            if (isFav) {
                const card = container.querySelector(`.hk-card[data-id="${id}"]`);
                if (card) card.remove();
                if (container.children.length === 0) container.innerHTML = `<div class="popup-empty-text">Niciun ${type === 'scene' ? 'scenariu' : 'accesoriu'} favorit.</div>`;
            } else {
                const emptyText = container.querySelector('.popup-empty-text');
                if (emptyText) emptyText.remove();

                let html = '';
                if (type === 'scene') {
                    const scena = scenesDB.find(s => s.id === id);
                    if (scena) html = construiesteScenaHTML(scena, true);
                } else {
                    const [cat, idx] = id.split('_');
                    if (subDispozitive[cat] && subDispozitive[cat][idx]) html = construiesteCardHTML(subDispozitive[cat][idx], cat, idx, true);
                }
                container.insertAdjacentHTML('beforeend', html);
            }
        }
}

function toggleStareDispozitiv(cat, index, event) {
    if(event) event.stopPropagation(); 
    localStorage.removeItem('activeScene');
    
    if (typeof intervalVacanta !== 'undefined' && intervalVacanta) {
        clearInterval(intervalVacanta);
        intervalVacanta = null;
    }
    
    const disp = subDispozitive[cat][index];
    const dictionarStari = {
        'incuietori': { 'Blocat': 'Deblocat', 'Deblocat': 'Blocat' },
        'senzoriContact': { 'Închis': 'Deschis', 'Deschis': 'Închis' },
        'jaluzele': { 'Închis': 'Deschis', 'Deschis': 'Închis' },
        'camereVideo': { 'Standby': 'LIVE', 'LIVE': 'Standby' },
        'senzoriMiscare': { 'Inactiv': 'Activ', 'Activ': 'Inactiv' },
        'aspirator': { 'La Bază': 'Curăță', 'Curăță': 'La Bază' }
    };

    if (dictionarStari[cat]) {
        let defaultState = 'Închis';
        if (cat === 'incuietori') defaultState = 'Blocat';
        else if (cat === 'camereVideo') defaultState = 'Standby';
        else if (cat === 'senzoriMiscare') defaultState = 'Inactiv';
        else if (cat === 'aspirator') defaultState = 'La Bază';
        
        disp.stare = dictionarStari[cat][disp.stare] || defaultState;
    } else if (cat === 'purificator') {
        disp.stare = disp.stare === "Oprit" ? "Auto" : (disp.stare === "Auto" ? "Boost" : "Oprit");
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    if (cat === 'senzoriMiscare' && disp.stare === "Activ") {
        let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
        logs.unshift({ camera: disp.camera, ora: new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'}) });
        localStorage.setItem('motionLogs', JSON.stringify(logs.slice(0, 15)));
    }
    
    if (typeof adaugaInLog === 'function') {
        adaugaInLog(`${disp.nume || 'Dispozitiv'} a fost comutat în starea [${disp.stare}]`);
    }
    
    verificaReguliAutomatizare(cat, index, disp.stare);
    salveazaStarea();
    
    // AICI INTERVINE MAGIA OPTIMIZĂRII
    if (typeof actualizeazaCardInDOM === 'function') {
        actualizeazaCardInDOM(cat, index);
    } else {
        reincarcaInterfata();
    }
}

function verificaAutomatizariTimp() {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const timpAcum = new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'});
    let schimbare = false;
    rules.forEach(rule => {
        if (rule.active && rule.tipTrigger === 'timp' && rule.tOra === timpAcum) {
            const actionDisp = subDispozitive[rule.aCat] && subDispozitive[rule.aCat][rule.aIdx];
            if (actionDisp && actionDisp.stare !== rule.aState) {
                actionDisp.stare = rule.aState;
                rule.lastRun = `Azi la ${timpAcum}`;
                schimbare = true;
            }
        }
    });
    if (schimbare) { localStorage.setItem('userAutomations', JSON.stringify(rules)); salveazaStarea(); if (typeof sincronizeazaDOMcuMemoria === 'function') sincronizeazaDOMcuMemoria(); else reincarcaInterfata(); }
}

function verificaReguliAutomatizare(triggerCat, triggerIdx, newState) {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let schimbare = false;
    rules.forEach(rule => {
        if (rule.active && rule.tipTrigger === 'disp' && rule.tCat === triggerCat && rule.tIdx === triggerIdx.toString() && rule.tState === newState) {
    const actionDisp = subDispozitive[rule.aCat] && subDispozitive[rule.aCat][rule.aIdx];
            if (actionDisp) {
        actionDisp.stare = rule.aState;
        rule.lastRun = `Azi la ${new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}`;
                schimbare = true;
            }
        }
    });
    if (schimbare) { localStorage.setItem('userAutomations', JSON.stringify(rules)); salveazaStarea(); }
}

function salveazaAutomatizare() {
    const esteTimp = typeof modTriggerCurent !== 'undefined' && modTriggerCurent === 'timp';
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;
    const actionNume = subDispozitive[aVal[0]][aVal[1]].nume;
    let rule = { id: Date.now(), active: true, lastRun: "Niciodată", aCat: aVal[0], aIdx: aVal[1], aState: aState };

    if (esteTimp) {
        const ora = document.getElementById('auto-trigger-timp').value;
        if (!ora) return;
        rule.tipTrigger = 'timp'; rule.tOra = ora; rule.descriere = `⏰ Zilnic la ora ${ora} ➔ ${actionNume} devine ${aState}`;
    } else {
        const tVal = document.getElementById('auto-trigger-dev').value.split('_');
        const tState = document.getElementById('auto-trigger-state').value;
        rule.tipTrigger = 'disp'; rule.tCat = tVal[0]; rule.tIdx = tVal[1]; rule.tState = tState;
        rule.descriere = `DACĂ ${subDispozitive[tVal[0]][tVal[1]].nume} este ${tState} ➔ ${actionNume} devine ${aState}`;
    }

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.unshift(rule); localStorage.setItem('userAutomations', JSON.stringify(rules));
    // Call the correct closing function for the automatizare modal
    if (typeof inchidePopupAutomatizare === 'function') {
        inchidePopupAutomatizare();
    } else {
        const modal = document.getElementById('popup-automatizare'); if (modal) modal.classList.remove('active');
    }
    randareSabloane(); randareAutomatizari();
}

function adaugaSugestie(idSugestie) {
    const sug = sabloaneRecomandate.find(s => s.idSugestie === idSugestie);
    if(!sug) return;
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let nouaRegula = { id: Date.now(), active: true, lastRun: "Niciodată", idSugestie: sug.idSugestie, tipTrigger: sug.tipTrigger, descriere: sug.descriere, aCat: sug.aCat, aIdx: sug.aIdx, aState: sug.aState };
    if (sug.tipTrigger === 'timp') nouaRegula.tOra = sug.tOra; else { nouaRegula.tCat = sug.tCat; nouaRegula.tIdx = sug.tIdx; nouaRegula.tState = sug.tState; }
    rules.unshift(nouaRegula); localStorage.setItem('userAutomations', JSON.stringify(rules));
    randareSabloane(); randareAutomatizari();
}

function stergeAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    localStorage.setItem('userAutomations', JSON.stringify(rules.filter(r => r.id !== id)));
    randareSabloane(); randareAutomatizari();
}

// FIX: Suport complet pentru activarea și dezactivarea din comutator
function comutaAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const rule = rules.find(r => r.id === id);
    if (rule) { 
        rule.active = !rule.active; 
        localStorage.setItem('userAutomations', JSON.stringify(rules)); 
        
        // Modificăm punctual stilurile DOM-ului fără a redesena lista completă (evităm lag-ul)
        const checkbox = document.querySelector(`input[data-autoid="${id}"]`);
        if (checkbox) {
            const card = checkbox.closest('.hk-card');
            if (card) {
                card.style.borderLeft = `5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}`;
                card.style.opacity = rule.active ? '1' : '0.5';
                const titleEl = card.querySelector('div[style*="font-weight: bold;"]');
                if (titleEl) {
                    titleEl.style.color = rule.active ? 'var(--text-color)' : '#95a5a6';
                }
            }
        }
    }
}

function ajusteazaDinPopup(camera, directie) {
    let val = parseFloat(localStorage.getItem(`temp-${camera}`)) || 22;
    val = directie === 'plus' ? val + 1 : val - 1;
    if(val < 15) val = 15; if(val > 30) val = 30;
    localStorage.setItem(`temp-${camera}`, val);
    document.getElementById(`popup-temp-${camera}`).innerText = val;
    if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();
}

function stingeTotGlobal() { 
    Object.keys(subDispozitive).forEach(cat => (subDispozitive[cat] || []).forEach(d => { 
        if (cat === 'incuietori') d.stare = "Blocat";
        else if (cat === 'jaluzele' || cat === 'senzoriContact') d.stare = "Închis";
        else if (cat === 'senzoriMiscare') d.stare = "Inactiv";
        else if (cat === 'camereVideo') d.stare = "Standby";
        else d.stare = "Oprit"; 
    })); 
    salveazaStarea();
}

function aplicaMod(mod) {
    if (intervalVacanta) { clearInterval(intervalVacanta); intervalVacanta = null; }
    stingeTotGlobal(); 
    if (mod === 'morning') {
        (subDispozitive.jaluzele || []).forEach(d => d.stare = "Deschis");
        if(subDispozitive.electrocasnice && subDispozitive.electrocasnice[2]) subDispozitive.electrocasnice[2].stare = "Pornit";
        (subDispozitive.audio || []).forEach(d => { d.stare = "Pornit"; d.valoare = 30; });
        if(subDispozitive.purificator && subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Auto";
    } else if (mod === 'away') {
        if(subDispozitive.aspirator && subDispozitive.aspirator[0]) subDispozitive.aspirator[0].stare = "Curăță";
        (subDispozitive.camereVideo || []).forEach(d => d.stare = "LIVE");
        localStorage.setItem('alarmaDezactivata', 'false'); 
    } else if (mod === 'home') {
        localStorage.setItem('alarmaDezactivata', 'true'); 
        if(subDispozitive.incuietori && subDispozitive.incuietori[0]) subDispozitive.incuietori[0].stare = "Deblocat";
        if(subDispozitive.jaluzele && subDispozitive.jaluzele[1]) subDispozitive.jaluzele[1].stare = "Deschis";
        if(subDispozitive.becuri && subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit"; 
    } else if (mod === 'movie') {
        (subDispozitive.jaluzele || []).forEach(d => d.stare = "Închis"); 
        if(subDispozitive.tv && subDispozitive.tv[1]) subDispozitive.tv[1].stare = "Pornit"; 
        if(subDispozitive.audio && subDispozitive.audio[2]) { subDispozitive.audio[2].stare = "Pornit"; subDispozitive.audio[2].valoare = 50; }
        if(subDispozitive.luminiRGB && subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#0a3d62"; }
        (subDispozitive.becuri || []).forEach(d => d.stare = "Oprit"); 
    } else if (mod === 'vacation') {
        localStorage.setItem('alarmaDezactivata', 'false'); 
        intervalVacanta = setInterval(() => {
            if (localStorage.getItem('activeScene') !== 's_vacation') { clearInterval(intervalVacanta); intervalVacanta = null; return; }
            const cats = ['becuri', 'luminiRGB', 'jaluzele'];
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            const elementeDisp = subDispozitive[randomCat] || [];
            if (elementeDisp.length > 0) { 
                const rIdx = Math.floor(Math.random() * elementeDisp.length);
                const disp = elementeDisp[rIdx];
                disp.stare = (randomCat === 'jaluzele') ? (disp.stare === "Închis" ? "Deschis" : "Închis") : (disp.stare === "Pornit" ? "Oprit" : "Pornit"); 
                salveazaStarea(); if (typeof actualizeazaCardInDOM === 'function') actualizeazaCardInDOM(randomCat, rIdx); else reincarcaInterfata();
            }
        }, 4000);
    }
    salveazaStarea(); if (typeof sincronizeazaDOMcuMemoria === 'function') sincronizeazaDOMcuMemoria(); else reincarcaInterfata();
}

function calculeazaConsumPriza(disp) {
    if (disp.stare !== 'Pornit') return 0;
    let consumReal = 0;
    if (disp.camera === 'Baie') {
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === 'Pornit') consumReal += 2000;
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[1] && subDispozitive.electrocasnice[1].stare === 'Pornit') consumReal += 2400;
    } else if (disp.camera === 'Dormitor') {
        if (subDispozitive.tv && subDispozitive.tv[0] && subDispozitive.tv[0].stare === 'Pornit') consumReal += 90;
        if (subDispozitive.purificator && subDispozitive.purificator[0] && subDispozitive.purificator[0].stare !== 'Oprit') consumReal += 30;
    } else if (disp.camera === 'Bucătărie') {
        consumReal += 150; 
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[2] && subDispozitive.electrocasnice[2].stare === 'Pornit') consumReal += 1200;
    } else if (disp.camera === 'Living') {
        if (subDispozitive.tv && subDispozitive.tv[1] && subDispozitive.tv[1].stare === 'Pornit') consumReal += 150;
        if (subDispozitive.audio && subDispozitive.audio[1] && subDispozitive.audio[1].stare === 'Pornit') consumReal += 40;
        if (subDispozitive.audio && subDispozitive.audio[2] && subDispozitive.audio[2].stare === 'Pornit') consumReal += 200;
        if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === 'Curăță') consumReal += 60;
    }
    return consumReal;
}

function executaScena(idScena) {
    if (idScena === 's_home' && localStorage.getItem('alarmaDezactivata') !== 'true') {
        deschidePopupPin('scena_home');
        return;
    }

    // 1. Adăugăm clasa pentru a bloca animațiile
    document.body.classList.add('ui-is-updating');

    localStorage.setItem('activeScene', idScena);
    const scena = scenesDB.find(s => s.id === idScena);
    if (scena && scena.action) typeof scena.action === 'function' ? scena.action() : aplicaMod(scena.action);

    // 2. Apelăm sincronizeazaDOMcuMemoria în loc de reincarcaInterfata (nu mai distruge DOM-ul)
    if (typeof sincronizeazaDOMcuMemoria === 'function') sincronizeazaDOMcuMemoria(); else reincarcaInterfata();

    // 3. Eliminăm clasa după un scurt delay, astfel încât, 
    // dacă utilizatorul mai dă un refresh ulterior, animațiile să fie active
    setTimeout(() => {
        document.body.classList.remove('ui-is-updating');
    }, 100); 
}

function salveazaScenaCustomNoua() {
    const nume = document.getElementById('custom-scene-name').value.trim();
    const emoji = document.getElementById('custom-scene-emoji').value;
    const desc = document.getElementById('custom-scene-desc').value.trim();
    const actiuneMod = document.getElementById('custom-scene-template').value;
    if (!nume || !desc) { alert("Te rog completează numele și descrierea scenei!"); return; }
    
    let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
    list.push({ id: 'cust_' + Date.now(), nume: `${emoji} ${nume}`, descriere: desc, action: actiuneMod });
    localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list));
    
    customScenesList = list; scenesDB = [...defaultScenes, ...customScenesList];
    inchidePopup(); reincarcaInterfata();
}

function stergeScenaCustom(idScena, event) {
    if(event) event.stopPropagation(); 
    if(confirm("Sigur vrei să ștergi această scenă personalizată?")) {
        let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
        localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list.filter(s => s.id !== idScena)));
        let favs = JSON.parse(localStorage.getItem('favScenes')) || [];
        localStorage.setItem('favScenes', JSON.stringify(favs.filter(id => id !== idScena)));
        if (localStorage.getItem('activeScene') === idScena) localStorage.removeItem('activeScene');
        customScenesList = list.filter(s => s.id !== idScena);
        scenesDB = [...defaultScenes, ...customScenesList];
        reincarcaInterfata();
    }
}

function executaSecurizareTotala() {
    if (subDispozitive.senzoriContact) subDispozitive.senzoriContact.forEach(g => g.stare = "Închis");
    if (subDispozitive.incuietori) subDispozitive.incuietori.forEach(u => u.stare = "Blocat");
    if (subDispozitive.senzoriMiscare) subDispozitive.senzoriMiscare.forEach(s => s.stare = "Activ");
    if (subDispozitive.camereVideo) subDispozitive.camereVideo.forEach(c => c.stare = "LIVE");
    localStorage.setItem('alarmaDezactivata', 'false');
    salveazaStarea(); if (typeof sincronizeazaDOMcuMemoria === 'function') sincronizeazaDOMcuMemoria(); else reincarcaInterfata();
    if (typeof adaugaInLog === 'function') adaugaInLog("🛡️ Securitate: S-a efectuat o securizare totală instantă.");
    if (typeof showToast === 'function') showToast("Securizarea totală rapidă a fost activată.");
}

function adaugaInLog(mesaj) {
    let logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    logs.unshift({ text: mesaj, ora: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    localStorage.setItem('smartHomeLogs', JSON.stringify(logs.slice(0, 30)));
    if (document.getElementById('logs-container')) randareStatisticiLogs();
}

// --- Calcul Medii pentru Climat (Temperatură & Umiditate) ---
function actualizeazaMediiClimat() {
    const camere = ['living', 'dormitor', 'bucatarie', 'baie'];
    
    // 1. Calcul Temperatură Medie
    let sumaTemp = 0;
    let countTemp = 0;
    camere.forEach(camera => {
        const val = parseFloat(localStorage.getItem(`temp-${camera}`));
        if (!isNaN(val)) {
            sumaTemp += val;
            countTemp++;
        }
    });
    
    // Dacă nu avem nimic salvat per cameră, lăsăm o valoare implicită sau media existentă
    const mediaTemp = countTemp > 0 ? Math.round(sumaTemp / countTemp) : 22;
    
    const tempCurenta = document.getElementById('tempCurenta');
    const widgetTemp = document.getElementById('widget-temp');
    const widgetMedieTemp = document.getElementById('medie-temp'); // ID pentru camere.html
    if (tempCurenta) tempCurenta.innerText = mediaTemp;
    if (widgetTemp) widgetTemp.innerText = mediaTemp;
    if (widgetMedieTemp) widgetMedieTemp.innerText = mediaTemp;

    // 2. Calcul Umiditate Medie (dacă se folosesc dezumidificatoare per cameră)
    let sumaUmid = 0;
    let countUmid = 0;
    camere.forEach(camera => {
        const val = parseFloat(localStorage.getItem(`umid-${camera}`));
        if (!isNaN(val)) {
            sumaUmid += val;
            countUmid++;
        }
    });

    // Setăm media, iar dacă nu există date, folosim 50% implicit
    const mediaUmid = countUmid > 0 ? Math.round(sumaUmid / countUmid) : 50;
    const widgetUmiditate = document.getElementById('widget-umiditate');
    const umidCurenta = document.getElementById('umiditateCurenta');
    const widgetMedieUmid = document.getElementById('medie-umid'); // ID pentru camere.html

    if (widgetUmiditate) widgetUmiditate.innerText = mediaUmid;
    if (umidCurenta) umidCurenta.innerText = mediaUmid + "%";
    if (widgetMedieUmid) widgetMedieUmid.innerText = mediaUmid;
}