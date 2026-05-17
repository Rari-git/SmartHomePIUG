let intervalVacanta = null;

const scenesDB = [
    { id: 's_morning', nume: "🌅 Good Morning", descriere: "Deschide jaluzelele, pornește cafeaua.", action: () => aplicaMod('morning') },
    { id: 's_night', nume: "🌙 Good Night", descriere: "Oprește luminile, armează ușile.", action: () => aplicaMod('night') },
    { id: 's_away', nume: "👋 Leaving Home", descriere: "Oprește tot, robotul începe curățenia.", action: () => aplicaMod('away') },
    { id: 's_home', nume: "🏠 I'm Home", descriere: "Dezactivează alarma, deschide jaluzelele.", action: () => aplicaMod('home') },
    { id: 's_movie', nume: "🎬 Movie Time", descriere: "Draperii închise, TV pornit, ambient albastru.", action: () => aplicaMod('movie') },
    { id: 's_focus', nume: "📖 Focus / Citit", descriere: "Lumină birou, purificator pornit.", action: () => aplicaMod('focus') },
    { id: 's_dinner', nume: "🍽️ Dinner Time", descriere: "Lumini calde în living și bucătărie.", action: () => aplicaMod('dinner') },
    { id: 's_vacation', nume: "🧳 Vacation Mode", descriere: "Simulare prezență și securitate.", action: () => aplicaMod('vacation') }
];

// NOU: Cele 9 Șabloane Inteligente (Bază de date separată)
const sabloaneRecomandate = [
    { idSugestie: 'sug_1', icon: '⏰', nume: 'Rutina de Dimineață', descriereScurta: 'Deschide jaluzelele în living zilnic la ora 07:00.', culoare: '#f1c40f',
      tipTrigger: 'timp', tOra: '07:00', aCat: 'jaluzele', aIdx: '1', aState: 'Deschis', descriere: '⏰ Zilnic la 07:00 ➔ Draperie Living se Deschide' },
    
    { idSugestie: 'sug_2', icon: '🌬️', nume: 'Eco-Baie', descriereScurta: 'Oprește uscătorul dacă se deschide fereastra la baie.', culoare: '#e74c3c',
      tipTrigger: 'disp', tCat: 'senzoriContact', tIdx: '4', tState: 'Deschis', aCat: 'electrocasnice', aIdx: '1', aState: 'Oprit', descriere: 'DACĂ Fereastră Baie este Deschisă ➔ Uscătorul se Oprește' },
    
    { idSugestie: 'sug_3', icon: '🏃', nume: 'Securitate Hol', descriereScurta: 'Aprinde becul din living la detectarea mișcării pe hol.', culoare: '#2ecc71',
      tipTrigger: 'disp', tCat: 'senzoriMiscare', tIdx: '1', tState: 'Activ', aCat: 'becuri', aIdx: '1', aState: 'Pornit', descriere: 'DACĂ Senzor Mișcare Hol este Activ ➔ Bec Living devine Pornit' },
    
    { idSugestie: 'sug_4', icon: '🌙', nume: 'Stingere Noaptea', descriereScurta: 'Stinge becul din living zilnic la ora 23:30.', culoare: '#34495e',
      tipTrigger: 'timp', tOra: '23:30', aCat: 'becuri', aIdx: '1', aState: 'Oprit', descriere: '⏰ Zilnic la 23:30 ➔ Bec Living devine Oprit' },
    
    { idSugestie: 'sug_5', icon: '🚪', nume: 'Încuiere Automată', descriereScurta: 'Blochează ușa principală la ora 22:00 în fiecare seară.', culoare: '#e67e22',
      tipTrigger: 'timp', tOra: '22:00', aCat: 'incuietori', aIdx: '0', aState: 'Blocat', descriere: '⏰ Zilnic la 22:00 ➔ Încuietoare Ușă devine Blocat' },
    
    { idSugestie: 'sug_6', icon: '📺', nume: 'Cinema Rapid', descriereScurta: 'Aprinde banda LED ambientală când Smart TV-ul este pornit.', culoare: '#9b59b6',
      tipTrigger: 'disp', tCat: 'tv', tIdx: '1', tState: 'Pornit', aCat: 'luminiRGB', aIdx: '0', aState: 'Pornit', descriere: 'DACĂ Smart TV OLED 8K este Pornit ➔ Bandă LED TV devine Pornit' },
    
    { idSugestie: 'sug_7', icon: '💨', nume: 'Oprire Aer Fereastră', descriereScurta: 'Oprește purificatorul dacă fereastra din dormitor este deschisă.', culoare: '#1abc9c',
      tipTrigger: 'disp', tCat: 'senzoriContact', tIdx: '0', tState: 'Deschis', aCat: 'purificator', aIdx: '0', aState: 'Oprit', descriere: 'DACĂ Fereastră Dormitor este Deschisă ➔ Purificatorul se Oprește' },
    
    { idSugestie: 'sug_8', icon: '☕', nume: 'Cafea Dimineața', descriereScurta: 'Pornește espressorul din bucătărie în fiecare zi la 07:15.', culoare: '#d35400',
      tipTrigger: 'timp', tOra: '07:15', aCat: 'electrocasnice', aIdx: '2', aState: 'Pornit', descriere: '⏰ Zilnic la 07:15 ➔ Espressor Cafea devine Pornit' },
    
    { idSugestie: 'sug_9', icon: '🪟', nume: 'Intimitate Seara', descriereScurta: 'Închide automat draperiile din dormitor la ora 20:00.', culoare: '#3498db',
      tipTrigger: 'timp', tOra: '20:00', aCat: 'jaluzele', aIdx: '0', aState: 'Închis', descriere: '⏰ Zilnic la 20:00 ➔ Draperie Dormitor se Închide' }
];

const defaultDispozitive = {
    becuri: [{ nume: "Bec Dormitor", stare: "Pornit", valoare: 75, camera: "Dormitor", icon: "💡" }, { nume: "Bec Living", stare: "Oprit", valoare: 50, camera: "Living", icon: "💡" }, { nume: "Bec Baie", stare: "Oprit", valoare: 50, camera: "Baie", icon: "💡" }, { nume: "Bec Bucătărie", stare: "Oprit", valoare: 100, camera: "Bucătărie", icon: "💡" }],
    luminiRGB: [{ nume: "Bandă LED TV", stare: "Oprit", valoare: 100, culoare: "#3498db", camera: "Living", icon: "🌈" }, { nume: "Lampă Birou", stare: "Oprit", valoare: 80, culoare: "#f1c40f", camera: "Dormitor", icon: "🌈" }],
    jaluzele: [{ nume: "Draperie", stare: "Închis", valoare: 0, camera: "Dormitor", icon: "🪟" }, { nume: "Draperie 1 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" }, { nume: "Draperie 2 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" }, { nume: "Draperie Baie", stare: "Închis", valoare: 0, camera: "Baie", icon: "🪟" }, { nume: "Draperie Bucătărie", stare: "Închis", valoare: 0, camera: "Bucătărie", icon: "🪟" }],
    audio: [{ nume: "Boxă Dormitor", stare: "Oprit", valoare: 40, camera: "Dormitor", icon: "🎵" }, { nume: "Boxă Living", stare: "Oprit", valoare: 30, camera: "Living", icon: "🎵" }, { nume: "Sistem Audio Dolby Atmos 7.1", stare: "Oprit", valoare: 50, camera: "Living", icon: "🔊" }, { nume: "Boxă Baie", stare: "Oprit", valoare: 30, camera: "Baie", icon: "🎵" }, { nume: "Boxă Bucătărie", stare: "Oprit", valoare: 20, camera: "Bucătărie", icon: "🎵" }],
    tv: [{ nume: "TV Dormitor", stare: "Oprit", camera: "Dormitor", icon: "📺" }, { nume: "Smart TV OLED 8K", stare: "Oprit", camera: "Living", icon: "📺" }],
    aspirator: [{ nume: "Robot Curățenie", stare: "La Bază", baterie: 100, camera: "Living", icon: "🤖" }],
    purificator: [{ nume: "Purificator Aer", stare: "Auto", camera: "Dormitor", icon: "🌬️" }, { nume: "Purificator Aer", stare: "Oprit", camera: "Living", icon: "🌬️" }],
    electrocasnice: [{ nume: "Mașină de Spălat", stare: "Oprit", camera: "Baie", icon: "🧺" }, { nume: "Uscător", stare: "Oprit", camera: "Baie", icon: "💨" }, { nume: "Espressor Cafea", stare: "Oprit", camera: "Bucătărie", icon: "☕" }],
    prize: [{ nume: "Priză Dormitor", stare: "Pornit", consum: 120, detalii: "TV, Laptop, Purificator", camera: "Dormitor", icon: "🔌" }, { nume: "Priză Living", stare: "Pornit", consum: 480, detalii: "Sistem Audio, TV, Robot Curățenie, Purificator", camera: "Living", icon: "🔌" }, { nume: "Priză Baie", stare: "Pornit", consum: 0, detalii: "Mașină de Spălat, Uscător", camera: "Baie", icon: "🔌" }, { nume: "Priză Bucătărie", stare: "Pornit", consum: 150, detalii: "Espressor, Frigider", camera: "Bucătărie", icon: "🔌" }],
    senzoriContact: [{ nume: "Fereastră Dormitor", stare: "Închis", camera: "Dormitor", icon: "🟩" }, { nume: "Fereastră 1 Living", stare: "Închis", camera: "Living", icon: "🟩" }, { nume: "Fereastră 2 Living", stare: "Închis", camera: "Living", icon: "🟩" }, { nume: "Fereastră Bucătărie", stare: "Închis", camera: "Bucătărie", icon: "🟩" }, { nume: "Fereastră Baie", stare: "Închis", camera: "Baie", icon: "🟩" }],
    senzoriMiscare: [{ nume: "Senzor Mișcare Living", stare: "Inactiv", camera: "Living", icon: "🏃" }, { nume: "Senzor Mișcare Hol", stare: "Inactiv", camera: "Hol", icon: "🏃" }],
    camereVideo: [{ nume: "Interfon Video", stare: "Standby", camera: "Ușă Principală", icon: "📹" }, { nume: "Cameră Curte", stare: "Standby", camera: "Exterior", icon: "📹" }],
    incuietori: [{ nume: "Încuietoare Ușă", stare: "Blocat", camera: "Hol", icon: "🚪" }]
};

let subDispozitive = {};

document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    incarcaNumeCasa();
    reincarcaInterfata();
});

setInterval(verificaAutomatizariTimp, 60000);

function initFavorites() {
    const saved = localStorage.getItem('smartHomeData');
    subDispozitive = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultDispozitive));

    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_1', 'incuietori_0', 'camereVideo_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
    if (!localStorage.getItem('userAutomations')) localStorage.setItem('userAutomations', JSON.stringify([]));
}

function salveazaStarea() {
    localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
}

function incarcaNumeCasa() {
    const titluCasa = document.getElementById('nume-casa-global');
    if (titluCasa) titluCasa.innerText = localStorage.getItem('numeCasaSalvat') || "My Home";
}

function toggleFavorite(id, type, event) {
    if(event) event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(type === 'scene' ? 'favScenes' : 'favAcc'));
    if (favs.includes(id)) favs = favs.filter(item => item !== id);
    else favs.push(id);
    localStorage.setItem(type === 'scene' ? 'favScenes' : 'favAcc', JSON.stringify(favs));
    reincarcaInterfata();
}

function toggleStareDispozitiv(cat, index, event) {
    if(event) event.stopPropagation();
    localStorage.removeItem('activeScene');
    
    if (typeof intervalVacanta !== 'undefined' && intervalVacanta) {
        clearInterval(intervalVacanta);
        intervalVacanta = null;
    }
    
    const disp = subDispozitive[cat][index];
    
    if (cat === 'incuietori') disp.stare = disp.stare === "Blocat" ? "Deblocat" : "Blocat";
    else if (cat === 'aspirator') disp.stare = disp.stare === "La Bază" ? "Curăță" : "La Bază";
    else if (cat === 'jaluzele') disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
    else if (cat === 'senzoriContact') disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
    else if (cat === 'camereVideo') disp.stare = disp.stare === "Standby" ? "LIVE" : "Standby";
    else if (cat === 'purificator') {
        if(disp.stare === "Oprit") disp.stare = "Auto";
        else if(disp.stare === "Auto") disp.stare = "Boost";
        else disp.stare = "Oprit";
    } else if (cat === 'senzoriMiscare') {
        disp.stare = disp.stare === "Inactiv" ? "Activ" : "Inactiv";
        if (disp.stare === "Activ") {
            let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
            const timpAcum = new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'});
            logs.unshift({ camera: disp.camera, ora: timpAcum });
            localStorage.setItem('motionLogs', JSON.stringify(logs.slice(0, 15)));
        }
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    verificaReguliAutomatizare(cat, index, disp.stare);
    adaugaInLog(`Dispozitiv: ${disp.nume} (${disp.camera}) a fost schimbat în starea [${disp.stare}]`);
    salveazaStarea();
    reincarcaInterfata();
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
                if (typeof showToast === "function") showToast(`⏰ Rutină: ${actionDisp.nume} a devenit ${rule.aState}!`);
            }
        }
    });

    if (schimbare) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        salveazaStarea();
        reincarcaInterfata();
    }
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
                if (typeof showToast === "function") showToast(`🤖 Auto Executat: ${actionDisp.nume} a devenit ${rule.aState}!`);
            }
        }
    });

    if (schimbare) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        salveazaStarea();
    }
}

function deschideModalAutomatizare() {
    const modal = document.getElementById('popup-automatizare');
    if(!modal) return;
    const selectTrigger = document.getElementById('auto-trigger-dev');
    const selectAction = document.getElementById('auto-action-dev');
    
    let optionsHTML = '';
    Object.keys(subDispozitive).forEach(cat => {
        subDispozitive[cat].forEach((disp, idx) => {
            optionsHTML += `<option value="${cat}_${idx}">${disp.icon} ${disp.nume} (${disp.camera})</option>`;
        });
    });
    
    selectTrigger.innerHTML = optionsHTML;
    selectAction.innerHTML = optionsHTML;
    modal.classList.add('active');
}

function salveazaAutomatizare() {
    const esteTimp = typeof modTriggerCurent !== 'undefined' && modTriggerCurent === 'timp';
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;
    const actionNume = subDispozitive[aVal[0]][aVal[1]].nume;

    let rule = {
        id: Date.now(),
        active: true,
        lastRun: "Niciodată",
        aCat: aVal[0], aIdx: aVal[1], aState: aState,
    };

    if (esteTimp) {
        const ora = document.getElementById('auto-trigger-timp').value;
        if (!ora) { if (typeof showToast === "function") showToast("Te rog selectează o oră!"); return; }
        
        rule.tipTrigger = 'timp';
        rule.tOra = ora;
        rule.descriere = `⏰ Zilnic la ora ${ora} ➔ ${actionNume} devine ${aState}`;
    } else {
        const tVal = document.getElementById('auto-trigger-dev').value.split('_');
        const tState = document.getElementById('auto-trigger-state').value;
        const triggerNume = subDispozitive[tVal[0]][tVal[1]].nume;
        
        rule.tipTrigger = 'disp';
        rule.tCat = tVal[0]; rule.tIdx = tVal[1]; rule.tState = tState;
        rule.descriere = `DACĂ ${triggerNume} este ${tState} ➔ ${actionNume} devine ${aState}`;
    }

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.unshift(rule);
    localStorage.setItem('userAutomations', JSON.stringify(rules));

    inchidePopup();
    randareSabloane();
    randareAutomatizari();
    if (typeof showToast === "function") showToast("Regulă salvată și activată!");
}

function adaugaSugestie(idSugestie) {
    const sug = sabloaneRecomandate.find(s => s.idSugestie === idSugestie);
    if(!sug) return;
    
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let nouaRegula = { 
        id: Date.now(), 
        active: true, 
        lastRun: "Niciodată",
        idSugestie: sug.idSugestie, 
        tipTrigger: sug.tipTrigger,
        descriere: sug.descriere,
        aCat: sug.aCat, aIdx: sug.aIdx, aState: sug.aState
    };

    if (sug.tipTrigger === 'timp') {
        nouaRegula.tOra = sug.tOra;
    } else {
        nouaRegula.tCat = sug.tCat; nouaRegula.tIdx = sug.tIdx; nouaRegula.tState = sug.tState;
    }

    rules.unshift(nouaRegula);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    
    randareSabloane(); 
    randareAutomatizari();
    if (typeof showToast === "function") showToast("Șablon activat cu succes!");
}

function stergeAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules = rules.filter(r => r.id !== id);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    
    randareSabloane(); // Reapare in carousel sus
    randareAutomatizari();
}

function comutaAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const rule = rules.find(r => r.id === id);
    if (rule) {
        rule.active = !rule.active;
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        randareAutomatizari();
    }
}

// === RANDARE DINAMICĂ SABLOANE ===
function randareSabloane() {
    const container = document.getElementById('sabloane-carousel');
    if (!container) return;

    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const activeIds = rules.map(r => r.idSugestie).filter(id => id); // Aflăm ce a fost instalat deja

    let html = '';
    let counter = 0;
    
    sabloaneRecomandate.forEach(sug => {
        if (!activeIds.includes(sug.idSugestie)) {
            html += `
            <div class="suggestion-card" style="border-top: 5px solid ${sug.culoare};">
                <div style="font-size: 2em; margin-bottom: 10px; line-height: 1;">${sug.icon}</div>
                <strong style="font-size: 1.1em; color: ${sug.culoare};">${sug.nume}</strong>
                <p style="font-size: 0.85em; opacity: 0.8; margin: 10px 0; flex: 1; line-height: 1.4;">${sug.descriereScurta}</p>
                <button class="add-sug-btn" onclick="adaugaSugestie('${sug.idSugestie}')">+ Adaugă Regula</button>
            </div>
            `;
            counter++;
        }
    });
    
    if (counter === 0) {
        container.innerHTML = `<p style="opacity:0.5; padding: 20px; font-style: italic;">Ai activat toate șabloanele recomandate! Creează mai multe manual, jos.</p>`;
    } else {
        container.innerHTML = html;
    }
}

// === RANDARE LISTA REGULI ACTIVE + BUTON PLUS ===
function randareAutomatizari() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    
    let html = '';
    rules.forEach(rule => {
        html += `
            <div class="hk-card" style="height: auto; padding: 20px; border-left: 5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}; opacity: ${rule.active ? '1' : '0.5'}; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; margin-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 1.1em; color: ${rule.active ? 'var(--text-color)' : '#95a5a6'};">
                        ${rule.tipTrigger === 'timp' ? '⏰' : '⚙️'} Regula Activă
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <label class="toggle-switch" title="${rule.active ? 'Dezactivează regula' : 'Activează regula'}">
                            <input type="checkbox" onchange="comutaAutomatizare(${rule.id})" ${rule.active ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <button onclick="stergeAutomatizare(${rule.id})" style="background: transparent; color: var(--error-color); font-size: 1.3em; border: none; cursor: pointer; padding: 0;" title="Șterge Regula">🗑️</button>
                    </div>
                </div>
                
                <div style="font-size: 1em; line-height: 1.5; font-weight: 500; flex: 1;">
                    ${rule.descriere}
                </div>
                
                <div style="margin-top: 15px; font-size: 0.8em; color: gray; font-weight: bold;">
                    🕒 Ultima rulare: ${rule.lastRun || 'Niciodată'}
                </div>
            </div>
        `;
    });

    // CARDUL CU "+" MARE SE ADAUGĂ AUTOMAT LA FINAL!
    html += `
        <div class="hk-card card-add-new" onclick="deschideModalAutomatizare()">
            <div class="plus-icon">+</div>
            <div style="font-size: 1.1em; font-weight: bold;">Regulă Nouă</div>
            <div style="font-size: 0.85em; margin-top: 5px;">Configurare complet manuală</div>
        </div>
    `;

    container.innerHTML = html;
}

function genereazaListaNotificari() {
    let notificari = [];
    
    // 1. Becuri și Lumini RGB
    const becuriAprinse = subDispozitive.becuri.filter(d => d.stare === "Pornit");
    const rgbAprinse = subDispozitive.luminiRGB ? subDispozitive.luminiRGB.filter(d => d.stare === "Pornit") : [];
    const totalLumini = becuriAprinse.length + rgbAprinse.length;
    if (totalLumini > 0) {
        notificari.push({
            id: "notif_lumini",
            text: `💡 ${totalLumini} ${totalLumini === 1 ? 'lumină aprinsă' : 'lumini aprinse'}`
        });
    }

    // 2. Sisteme Audio
    const audioPornit = subDispozitive.audio ? subDispozitive.audio.filter(d => d.stare === "Pornit") : [];
    if (audioPornit.length > 0) {
        notificari.push({ id: "notif_audio", text: `🎵 ${audioPornit.length} ${audioPornit.length === 1 ? 'sistem audio redă muzică' : 'sisteme audio active'}` });
    }

    // 3. Smart TV
    const tvPornit = subDispozitive.tv ? subDispozitive.tv.filter(d => d.stare === "Pornit") : [];
    if (tvPornit.length > 0) {
        notificari.push({ id: "notif_tv", text: `📺 TV-ul din ${tvPornit[0].camera} este pornit` });
    }

    // 4. Aspirator Robot
    if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === "Curăță") {
        notificari.push({ id: "notif_aspirator", text: `🤖 Robotul de curățenie aspiră în ${subDispozitive.aspirator[0].camera}` });
    }

    // 5. Purificatoare Aer
    const purificatorActiv = subDispozitive.purificator ? subDispozitive.purificator.filter(d => ["Auto", "Boost"].includes(d.stare)) : [];
    if (purificatorActiv.length > 0) {
        notificari.push({ id: "notif_purificator", text: `🌬️ Purificatorul din ${purificatorActiv[0].camera} rulează în mod ${purificatorActiv[0].stare}` });
    }

    // 6. Electrocasnice (Mașină de spălat, Uscător, Espressor)
    if (subDispozitive.electrocasnice) {
        if (subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === "Pornit") {
            notificari.push({ id: "notif_spalat", text: `🧺 Mașina de spălat din Baie funcționează` });
        }
        if (subDispozitive.electrocasnice[1] && subDispozitive.electrocasnice[1].stare === "Pornit") {
            notificari.push({ id: "notif_uscator", text: `💨 Uscătorul de haine este activ` });
        }
        if (subDispozitive.electrocasnice[2] && subDispozitive.electrocasnice[2].stare === "Pornit") {
            notificari.push({ id: "notif_cafea", text: `☕ Espressorul pregătește cafeaua` });
        }
    }

    // 7. Prize Inteligente
    const prizeActive = subDispozitive.prize ? subDispozitive.prize.filter(d => d.stare === "Pornit") : [];
    if (prizeActive.length > 0) {
        notificari.push({ id: "notif_prize", text: `🔌 ${prizeActive.length} prize alimentate cu energie` });
    }

    // 8. Încuietori și Securitate perimetrală
    if (subDispozitive.incuietori && subDispozitive.incuietori[0] && subDispozitive.incuietori[0].stare === "Deblocat") {
        notificari.push({ id: "notif_usa", text: `🚪 Avertisment: Ușa de la intrare este deblocată!` });
    }

    // 9. Senzori Contact (Ferestre)
    if (subDispozitive.senzoriContact) {
        subDispozitive.senzoriContact.forEach((d, idx) => {
            if(d.stare === "Deschis") {
                notificari.push({ id: `notif_fereastra_${idx}`, text: `🪟 Fereastra din ${d.camera} este deschisă` });
            }
        });
    }

    // 10. Camere Video Live
    const camereLive = subDispozitive.camereVideo ? subDispozitive.camereVideo.filter(d => d.stare === "LIVE") : [];
    if (camereLive.length > 0) {
        notificari.push({ id: "notif_camere", text: `📹 Monitorizare activă: Se transmite LIVE de la ${camereLive[0].camera}` });
    }
    
    // 11. Jurnal de mișcare recentă
    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => {
        notificari.push({ id: `notif_motion_${idx}`, text: `🏃 Senzor mișcare: Activitate în ${log.camera} [${log.ora}]` });
    });
    
    return notificari;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    
    const toateNotificarile = genereazaListaNotificari();
    container.innerHTML = "";
    
    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">🏠 Nicio notificare. Toate sistemele sunt în standby.</p>`;
        return;
    }
    
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        const notif = toateNotificarile[i];
        
        // Eliminat fundalul galben și accentul vechi. Acum arată exact ca restul notificărilor
        if (notif.id === "notif_lumini") {
            container.innerHTML += `
                <div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer;">
                    <span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pentru detalii)</span></span>
                </div>`;
        } else {
            container.innerHTML += `<div class="notification-item"><span>${notif.text}</span></div>`;
        }
    }
    
    if (toateNotificarile.length > 3) {
        container.innerHTML += `<button class="see-more-btn" onclick="deschidePopupToateNotificarile()">See more &gt;</button>`;
    }
}

function deschidePopupToateNotificarile() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');

    if (!modal || !titlu || !continental) return;
    titlu.innerText = "🔔 Toate Notificările Casei";
    
    const toateNotificarile = genereazaListaNotificari();
    
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left;">`;
    
    toateNotificarile.forEach(notif => {
        if (notif.id === "notif_lumini") {
            html += `
                <div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; font-weight: bold;">(Apasă pentru detalii)</span></span>
                </div>`;
        } else {
            html += `<div class="notification-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);"><span>${notif.text}</span></div>`;
        }
    });
    
    html += `</div>
        <div style="margin-top: 10px;">
            <button onclick="localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); inchidePopup();" 
                    style="background-color: transparent; border: 2px solid var(--error-color); color: var(--error-color); width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                🗑️ Șterge Istoric Mișcare
            </button>
        </div>`;
        
    continental.innerHTML = html;
    modal.classList.add('active');
}

function construiesteCardHTML(disp, cat, idx, isFav) {
    const isActive = ['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare);
    const idUnic = `${cat}_${idx}`;
    return `
        <div class="hk-card ${isActive ? 'is-active' : ''}" onclick="toggleStareDispozitiv('${cat}', ${idx}, event)">
            <div class="hk-controls">
                <button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${idUnic}', 'acc', event)">★</button>
                <button class="hk-btn" onclick="deschideMeniuDispozitive('none', '${cat}', ${idx}); event.stopPropagation();">⚙️</button>
            </div>
            <div class="hk-icon">${disp.icon}</div>
            <div>
                <div class="hk-name">${disp.nume}</div>
                <div class="hk-state">${disp.stare} ${disp.camera ? `• ${disp.camera}` : ''}</div>
            </div>
        </div>
    `;
}

function construiesteScenaHTML(scena, isFav) {
    const isActive = localStorage.getItem('activeScene') === scena.id;
    return `
        <div class="hk-card ${isActive ? 'is-active' : ''}" style="height: 90px;" onclick="executaScena('${scena.id}')">
            <div class="hk-controls">
                <button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${scena.id}', 'scene', event)">★</button>
            </div>
            <div class="hk-name" style="font-size: 1.1em; margin-bottom: 5px;">${scena.nume}</div>
            <div class="hk-state" style="margin-top: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${scena.descriere}</div>
        </div>
    `;
}

function reincarcaInterfata() {
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
    
    // Asigurăm-ne că rulăm automat și pe pagina de automatizări
    if(document.getElementById('automations-list')) {
        randareAutomatizari();
        randareSabloane();
    }
    if(document.getElementById('logs-container')) randareStatisticiLogs();
}

function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    
    let accHtml = '';
    Object.keys(subDispozitive).forEach(cat => {
        subDispozitive[cat].forEach((disp, idx) => {
            if(favAcc.includes(`${cat}_${idx}`)) accHtml += construiesteCardHTML(disp, cat, idx, true);
        });
    });
    document.getElementById('fav-accessories-container').innerHTML = accHtml || '<p style="opacity:0.5;">Niciun accesoriu favorit.</p>';

    let sceneHtml = '';
    scenesDB.forEach(scena => {
        if(favScenes.includes(scena.id)) sceneHtml += construiesteScenaHTML(scena, true);
    });
    document.getElementById('fav-scenes-container').innerHTML = sceneHtml || '<p style="opacity:0.5;">Nicio scenă favorită.</p>';
}

function randareAccesorii() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const camereMap = {};
    
    Object.keys(subDispozitive).forEach(cat => {
        subDispozitive[cat].forEach((disp, idx) => {
            if(!camereMap[disp.camera]) camereMap[disp.camera] = [];
            camereMap[disp.camera].push({disp, cat, idx});
        });
    });

    let html = '';
    Object.keys(camereMap).sort().forEach(camera => {
        html += `<h2 class="hk-section-title">${camera}</h2><div class="hk-grid">`;
        camereMap[camera].forEach(item => {
            html += construiesteCardHTML(item.disp, item.cat, item.idx, favAcc.includes(`${item.cat}_${item.idx}`));
        });
        html += `</div>`;
    });
    document.getElementById('all-accessories-container').innerHTML = html;
}

function randareScene() {
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    let html = '';
    scenesDB.forEach(scena => { html += construiesteScenaHTML(scena, favScenes.includes(scena.id)); });
    document.getElementById('all-scenes-container').innerHTML = html;
}

function randareSecuritate() {
    const container = document.getElementById('security-devices-container');
    if (!container) return;
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    let html = '';
    ['camereVideo', 'senzoriMiscare', 'senzoriContact', 'incuietori'].forEach(cat => {
        if (subDispozitive[cat]) {
            subDispozitive[cat].forEach((disp, idx) => {
                html += construiesteCardHTML(disp, cat, idx, favAcc.includes(`${cat}_${idx}`));
            });
        }
    });
    container.innerHTML = html;
}

function executaScena(id) {
    const scena = scenesDB.find(s => s.id === id);
    if(scena) {
        localStorage.setItem('activeScene', id);
        scena.action();
        adaugaInLog(`Scenă: "${scena.nume}" a fost activată manual`);
        if (typeof showToast === "function") showToast(`Scena "${scena.nume}" a fost activată!`);
        reincarcaInterfata();
    }
}

function calculeazaConsumPriza(disp) {
    if (disp.stare !== 'Pornit') return 0;
    let consumReal = 0;
    
    if (disp.camera === 'Baie') {
        if (subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === 'Pornit') consumReal += 2000;
        if (subDispozitive.electrocasnice[1] && subDispozitive.electrocasnice[1].stare === 'Pornit') consumReal += 2400;
    } 
    else if (disp.camera === 'Dormitor') {
        if (subDispozitive.tv[0] && subDispozitive.tv[0].stare === 'Pornit') consumReal += 90;
        if (subDispozitive.purificator[0] && subDispozitive.purificator[0].stare !== 'Oprit') consumReal += 30;
    } 
    else if (disp.camera === 'Bucătărie') {
        consumReal += 150; 
        if (subDispozitive.electrocasnice[2] && subDispozitive.electrocasnice[2].stare === 'Pornit') consumReal += 1200;
    } 
    else if (disp.camera === 'Living') {
        if (subDispozitive.tv[1] && subDispozitive.tv[1].stare === 'Pornit') consumReal += 150;
        if (subDispozitive.audio[1] && subDispozitive.audio[1].stare === 'Pornit') consumReal += 40;
        if (subDispozitive.audio[2] && subDispozitive.audio[2].stare === 'Pornit') consumReal += 200;
        if (subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === 'Curăță') consumReal += 60;
        if (subDispozitive.purificator[1] && subDispozitive.purificator[1].stare !== 'Oprit') consumReal += 30;
    }
    return consumReal;
}

function deschideMeniuDispozitive(cardId, categorie, elementIndex) {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    continental.innerHTML = "";

    if (categorie.startsWith('climatizare-')) {
        const camera = categorie.split('-')[1];
        titlu.innerText = `🌡️ Termostat ${camera.charAt(0).toUpperCase() + camera.slice(1)}`;
        
        let temp = localStorage.getItem(`temp-${camera}`) || "22";
        continental.innerHTML = `
            <div style="text-align: center; background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h3 style="margin-top: 0; opacity: 0.8;">Setare Temperatură</h3>
                <div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;">
                    <span id="popup-temp-${camera}">${temp}</span>°C
                </div>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                    <button onclick="ajusteazaDinPopup('${camera}', 'minus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; cursor: pointer;">−</button>
                    <button onclick="ajusteazaDinPopup('${camera}', 'plus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; pointer; cursor: pointer;">+</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    if (categorie.startsWith('senzori-')) {
        const camera = categorie.split('-')[1];
        titlu.innerText = camera === 'baie' ? `💧 Senzor Inundație Baie` : `🔥 Senzor Incendiu Bucătărie`;
        
        continental.innerHTML = `
            <div style="background: rgba(46, 204, 113, 0.1); border: 2px solid var(--success-color); color: var(--success-color); padding: 20px; border-radius: 12px; text-align: center; font-weight: bold;">
                <div style="font-size: 3em; margin-bottom: 10px;">✅</div>
                Senzorul din ${camera === 'baie' ? 'Baie' : 'Bucătărie'} este activ și monitorizează în timp real.<br>Stare: Parametri Normali (Sigur)
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    const disp = subDispozitive[categorie][elementIndex];
    titlu.innerText = `${disp.icon} ${disp.nume}`;
    let contentHtml = '';

    if (categorie === 'prize') {
        const consumCurent = calculeazaConsumPriza(disp);
        contentHtml = `
            <div style="background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                <div style="font-size: 1.1em; font-weight: bold; opacity: 0.8; margin-bottom: 5px;">Consum Curent în ${disp.camera}</div>
                <div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;">${consumCurent} W</div>
                <div style="font-size: 0.9em; opacity: 0.7; margin-bottom: 20px;">Dispozitive conectate: <br><strong>${disp.detalii}</strong></div>
                <button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); inchidePopup();" 
                        style="background-color: ${disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6'}; color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                    Alimentare Priză: ${disp.stare}
                </button>
            </div>
        `;
    } else {
        contentHtml = `
            <div style="margin-bottom: 20px; text-align:center;">
                <button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); inchidePopup();" 
                        style="background-color: ${['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare) ? 'var(--success-color)' : '#95a5a6'}; 
                               color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                    Schimbă Stare (Curent: ${disp.stare})
                </button>
            </div>
        `;

        if (categorie === 'camereVideo') {
            contentHtml += `
                <div style="background: #111; border-radius: 8px; height: 200px; display:flex; align-items:center; justify-content:center; color:white; position:relative; margin-bottom: 15px; overflow: hidden;">
                    ${disp.stare === 'LIVE' ? '<span style="position:absolute; top:10px; left:10px; color:red; font-weight:bold; font-size:0.9em; animation: pulse 1s infinite;">🔴 LIVE REC</span><img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80" style="opacity: 0.6; width: 100%; height: 100%; object-fit: cover;">' : '<span style="opacity:0.5;">[ Camera Feed Offline ]</span>'}
                </div>
            `;
        }

        if (['becuri', 'audio', 'jaluzele', 'luminiRGB'].includes(categorie)) {
            const isOff = disp.stare === 'Oprit' || disp.stare === 'Închis';
            contentHtml += `
                <div class="slider-container ${isOff ? 'disabled-controls' : ''}" style="margin-top: 20px;">
                    <label>Intensitate / Volum: <span id="val-${categorie}-${elementIndex}">${disp.valoare}</span>%</label>
                    <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} 
                           oninput="subDispozitive['${categorie}'][${elementIndex}].valoare = this.value; document.getElementById('val-${categorie}-${elementIndex}').innerText = this.value;">
                </div>
            `;
        }
    }
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function ajusteazaDinPopup(camera, directie) {
    let val = parseFloat(localStorage.getItem(`temp-${camera}`)) || 22;
    val = directie === 'plus' ? val + 1 : val - 1;
    if(val < 15) val = 15;
    if(val > 30) val = 30;
    localStorage.setItem(`temp-${camera}`, val);
    document.getElementById(`popup-temp-${camera}`).innerText = val;
}

function stingeTotGlobal() { 
    Object.keys(subDispozitive).forEach(cat => subDispozitive[cat].forEach(d => { 
        if (cat === 'incuietori') d.stare = "Blocat"; 
        else if(cat === 'jaluzele') d.stare = "Închis"; 
        else d.stare = "Oprit"; 
    })); 
    salveazaStarea();
}

function aplicaMod(mod) {
    if (typeof intervalVacanta !== 'undefined' && intervalVacanta) {
        clearInterval(intervalVacanta);
        intervalVacanta = null;
    }

    stingeTotGlobal(); 

    if (mod === 'morning') {
        subDispozitive.jaluzele.forEach(d => d.stare = "Deschis");
        if(subDispozitive.electrocasnice[2]) subDispozitive.electrocasnice[2].stare = "Pornit";
        if(subDispozitive.audio[0]) { subDispozitive.audio[0].stare = "Pornit"; subDispozitive.audio[0].valoare = 30; }
        if(subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Auto";
    } else if (mod === 'away') {
        if(subDispozitive.aspirator[0]) subDispozitive.aspirator[0].stare = "Curăță";
        if(subDispozitive.camereVideo) subDispozitive.camereVideo.forEach(d => d.stare = "LIVE");
        localStorage.setItem('alarmaDezactivata', 'false'); 
    } else if (mod === 'home') {
        localStorage.setItem('alarmaDezactivata', 'true'); 
        if(subDispozitive.incuietori[0]) subDispozitive.incuietori[0].stare = "Deblocat";
        if(subDispozitive.jaluzele[1]) subDispozitive.jaluzele[1].stare = "Deschis";
        if(subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit"; 
    } else if (mod === 'movie') {
        subDispozitive.jaluzele.forEach(d => d.stare = "Închis"); 
        if(subDispozitive.tv[1]) subDispozitive.tv[1].stare = "Pornit"; 
        if(subDispozitive.audio[2]) { subDispozitive.audio[2].stare = "Pornit"; subDispozitive.audio[2].valoare = 50; }
        if(subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#0a3d62"; }
        subDispozitive.becuri.forEach(d => d.stare = "Oprit"); 
    } else if (mod === 'focus') {
        if(subDispozitive.becuri[0]) subDispozitive.becuri[0].stare = "Pornit";
        if(subDispozitive.luminiRGB[1]) subDispozitive.luminiRGB[1].stare = "Pornit";
        if(subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Boost";
    } else if (mod === 'dinner') {
        if(subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit";
        if(subDispozitive.becuri[3]) subDispozitive.becuri[3].stare = "Pornit";
        if(subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#e67e22"; }
        if(subDispozitive.audio[1]) { subDispozitive.audio[1].stare = "Pornit"; subDispozitive.audio[1].valoare = 25; }
    } else if (mod === 'vacation') {
        localStorage.setItem('alarmaDezactivata', 'false'); 
        if (typeof showToast === "function") showToast("🧳 Mod Vacanță activat: simularea rulează.");
        
        intervalVacanta = setInterval(() => {
            if (localStorage.getItem('activeScene') !== 's_vacation') {
                clearInterval(intervalVacanta);
                intervalVacanta = null;
                return;
            }
            const cats = ['becuri', 'luminiRGB', 'jaluzele'];
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            const randomIdx = Math.floor(Math.random() * subDispozitive[randomCat].length);
            const disp = subDispozitive[randomCat][randomIdx];
            
            if (disp) {
                if (randomCat === 'jaluzele') disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
                else disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
                salveazaStarea();
                reincarcaInterfata();
            }
        }, 4000);
    }
    
    salveazaStarea();
    reincarcaInterfata();
}

function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');
    if(!sec) return;
    let consumTotal = 150; 
    if (subDispozitive.prize) {
        subDispozitive.prize.forEach(priză => {
            consumTotal += calculeazaConsumPriza(priză);
        });
    }
    con.innerText = (consumTotal/1000).toFixed(2) + " kW";
    sec.innerText = localStorage.getItem('alarmaDezactivata') === 'true' ? "Dezactivată" : "Armată";
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const m1 = document.getElementById('popup-dispozitive');
    const m2 = document.getElementById('popup-automatizare');
    if (event.target === m1) m1.classList.remove('active');
    if (event.target === m2) m2.classList.remove('active');
}

function deschidePopupLuminiAprinse() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');

    if (!modal || !titlu || !continental) return;
    
    titlu.innerText = "💡 Lumini Active în Casă";
    
    // Filtram din baza de date globală doar becurile care au starea "Pornit"
    let html = `<div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 5px 0;">`;
    
    let areLumini = false;
    subDispozitive.becuri.forEach((bec, idx) => {
        if (bec.stare === "Pornit") {
            areLumini = true;
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">💡</span>
                        <div>
                            <strong style="display:block;">${bec.nume}</strong>
                            <span style="font-size: 0.85em; opacity: 0.6;">${bec.camera} • Intensitate: ${bec.valoare}%</span>
                        </div>
                    </div>
                    <button onclick="toggleStareDispozitiv('becuri', ${idx}); deschidePopupLuminiAprinse();" 
                            style="background: var(--error-color); color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85em;">
                        Stinge
                    </button>
                </div>`;
        }
    });
    
    html += `</div>`;
    
    if (!areLumini) {
        html = `<div style="text-align:center; padding: 20px; opacity:0.6;">Toate luminile au fost stinse!</div>`;
        setTimeout(inchidePopup, 1000); // Închide pop-up-ul automat după 1 secundă dacă nu mai e nicio lumină aprinsă
    }
    
    continental.innerHTML = html;
    modal.classList.add('active');
}

function adaugaInLog(mesaj) {
    let logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    const oraAcum = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Adăugăm noul log la începutul listei
    logs.unshift({ text: mesaj, ora: oraAcum });
    
    // Limităm istoricul la ultimele 30 de evenimente ca să nu aglomerăm memoria
    localStorage.setItem('smartHomeLogs', JSON.stringify(logs.slice(0, 30)));
    
    // Dacă suntem pe pagina de statistici, reîncărcăm lista instant
    if (document.getElementById('logs-container')) {
        randareStatisticiLogs();
    }
}

function randareStatisticiLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    
    const logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    
    if (logs.length === 0) {
        container.innerHTML = `<p style="opacity: 0.5; font-style: italic; text-align: center; padding: 20px;">Niciun eveniment înregistrat încă.</p>`;
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border-left: 4px solid var(--accent-color);">
            <span style="font-weight: 500; font-size: 0.95em;">${log.text}</span>
            <span style="font-size: 0.8em; opacity: 0.6; font-weight: bold; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; margin-left: 10px;">${log.ora}</span>
        </div>
    `).join('');
}

// VARIABILE DE STARE PENTRU POP-UP-UL DE ISTORIC
let tipIstoricCurent = 'energie'; // poate fi 'energie' sau 'clima'
let perioadaIstoricaCurenta = '7z';

function deschidePopupIstoric(tip) {
    tipIstoricCurent = tip;
    perioadaIstoricaCurenta = '7z'; // Resetăm pe 7 zile la deschidere
    
    const modal = document.getElementById('popup-istoric');
    if (!modal) return;
    
    // Actualizăm titlul în funcție de context
    const titlu = document.getElementById('istoric-titlu');
    if (titlu) {
        titlu.innerText = tip === 'energie' ? '⚡ Istoric Consum Energie' : '🌡️ Istoric Climă Medie (Temp, Umiditate, CO2)';
    }
    
    modal.classList.add('active');
    genereazaTabelIstoric();
}

function inchidePopupIstoric() {
    const modal = document.getElementById('popup-istoric');
    if (modal) modal.classList.remove('active');
}

function schimbaPerioadaIstoric(perioada) {
    perioadaIstoricaCurenta = perioada;
    
    // Schimbăm clasa activă pe butoane
    const butoane = document.querySelectorAll('.time-filters .filter-btn');
    butoane.forEach(btn => btn.classList.remove('active'));
    
    const butonActiv = document.getElementById(`btn-period-${perioada}`);
    if (butonActiv) butonActiv.classList.add('active');
    
    genereazaTabelIstoric();
}

function genereazaTabelIstoric() {
    const container = document.getElementById('istoric-tabel-container');
    if (!container) return;
    
    // Generăm intervalele de timp etichetate frumos
    let intervale = [];
    if (perioadaIstoricaCurenta === '7z') {
        intervale = ['Ieri', 'Acum 2 zile', 'Acum 3 zile', 'Acum 4 zile', 'Acum 5 zile', 'Acum 6 zile', 'Acum 7 zile'];
    } else if (perioadaIstoricaCurenta === '30z') {
        intervale = ['Ultima săptămână', 'Săptămâna 2', 'Săptămâna 3', 'Săptămâna 4'];
    } else if (perioadaIstoricaCurenta === '6l') {
        intervale = ['Luna curentă', 'Luna trecută', 'Acum 3 luni', 'Acum 4 luni', 'Acum 5 luni', 'Acum 6 luni'];
    } else if (perioadaIstoricaCurenta === '1an') {
        intervale = ['Trimestrul 1', 'Trimestrul 2', 'Trimestrul 3', 'Trimestrul 4'];
    }

    let html = `<table style="width: 100%; border-collapse: collapse; font-size: 0.95em; text-align: left;">`;
    
    if (tipIstoricCurent === 'energie') {
        // TABEL ENERGIE
        html += `
            <thead>
                <tr style="border-bottom: 2px solid rgba(0,0,0,0.1); font-weight: bold;">
                    <th style="padding: 10px 5px;">Interval Timp</th>
                    <th style="padding: 10px 5px; text-align: right;">Aer Cond.</th>
                    <th style="padding: 10px 5px; text-align: right;">Mașină Spălat</th>
                    <th style="padding: 10px 5px; text-align: right;">Frigider</th>
                    <th style="padding: 10px 5px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>`;
            
        intervale.forEach((perioada, idx) => {
            // Generăm niște date mock care scad realist cu cât perioada e mai mică
            let multiplicator = perioadaIstoricaCurenta === '7z' ? 1 : perioadaIstoricaCurenta === '30z' ? 6 : perioadaIstoricaCurenta === '6l' ? 25 : 75;
            let ac = (10.2 * multiplicator - idx * 0.4).toFixed(1);
            let ms = (2.5 * multiplicator - idx * 0.1).toFixed(1);
            let fr = (1.5 * multiplicator).toFixed(1);
            let total = (parseFloat(ac) + parseFloat(ms) + parseFloat(fr)).toFixed(1);
            
            html += `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <td style="padding: 10px 5px; font-weight: 500;">${perioada}</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${ac} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${ms} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${fr} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; font-weight: bold; color: var(--accent-color);">${total} kWh</td>
                </tr>`;
        });
    } else {
        // TABEL CLIMĂ (Temperatură, Umiditate, CO2 conform cerințelor de proiect)
        html += `
            <thead>
                <tr style="border-bottom: 2px solid rgba(0,0,0,0.1); font-weight: bold;">
                    <th style="padding: 10px 5px;">Interval Timp</th>
                    <th style="padding: 10px 5px; text-align: right;">Temp. Medie</th>
                    <th style="padding: 10px 5px; text-align: right;">Umiditate</th>
                    <th style="padding: 10px 5px; text-align: right;">Nivel CO₂</th>
                </tr>
            </thead>
            <tbody>`;
            
        intervale.forEach((perioada, idx) => {
            // Generăm variații ușoare de temperatură și medii
            let t = (22.3 + (idx % 2 === 0 ? 0.4 : -0.3)).toFixed(1);
            let u = (45 + (idx % 3 === 0 ? 4 : -2));
            let co2 = (410 + idx * 12);
            
            html += `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <td style="padding: 10px 5px; font-weight: 500;">${perioada}</td>
                    <td style="padding: 10px 5px; text-align: right; font-weight: 600; color: #e67e22;">${t}°C</td>
                    <td style="padding: 10px 5px; text-align: right; color: #3498db;">${u}%</td>
                    <td style="padding: 10px 5px; text-align: right; color: #2ecc71;">${co2} ppm</td>
                </tr>`;
        });
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
}