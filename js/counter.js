document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    incarcaNumeCasa();
    if(document.getElementById('fav-scenes-container')) {
        randareHome();
        afiseazaNotificariHome();
    }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
    if(document.getElementById('automations-list')) randareAutomatizari();
    actualizeazaStatusGlobal();
});

const scenesDB = [
    { id: 's_morning', nume: "🌅 Good Morning", descriere: "Deschide jaluzelele, pornește cafeaua.", action: () => aplicaMod('morning') },
    { id: 's_night', nume: "🌙 Good Night", descriere: "Oprește luminile, armează ușile.", action: () => aplicaMod('night') },
    { id: 's_away', nume: "👋 Leaving Home", descriere: "Oprește tot, robotul începe curățenia.", action: () => aplicaMod('away') },
    { id: 's_home', nume: "🏠 I'm Home", descriere: "Dezactivează alarma, deschide jaluzelele.", action: () => aplicaMod('home') },
    { id: 's_movie', nume: "🎬 movieTime", descriere: "Draperii închise, TV pornit, ambient albastru.", action: () => aplicaMod('movie') },
    { id: 's_focus', nume: "📖 Focus / Citit", descriere: "Lumină birou, purificator pornit.", action: () => aplicaMod('focus') },
    { id: 's_dinner', nume: "🍽️ Dinner Time", descriere: "Lumini calde în living și bucătărie.", action: () => aplicaMod('dinner') }
];

// --- BAZA DE DATE INTEGRALĂ ALINIATĂ PERFECT CU INDEXURILE DIN HARTA.HTML ---
const subDispozitive = {
    becuri: [
        { nume: "Bec Dormitor", stare: "Pornit", valoare: 75, camera: "Dormitor", icon: "💡" }, // 0
        { nume: "Bec Living", stare: "Oprit", valoare: 50, camera: "Living", icon: "💡" },    // 1
        { nume: "Bec Baie", stare: "Oprit", valoare: 50, camera: "Baie", icon: "💡" },        // 2
        { nume: "Bec Bucătărie", stare: "Oprit", valoare: 100, camera: "Bucătărie", icon: "💡" } // 3
    ],
    luminiRGB: [
        { nume: "Bandă LED TV", stare: "Oprit", valoare: 100, culoare: "#3498db", camera: "Living", icon: "🌈" },
        { nume: "Lampă Birou", stare: "Oprit", valoare: 80, culoare: "#f1c40f", camera: "Dormitor", icon: "🌈" }
    ],
    jaluzele: [
        { nume: "Draperie", stare: "Închis", valoare: 0, camera: "Dormitor", icon: "🪟" },          // 0
        { nume: "Draperie 1 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" },  // 1
        { nume: "Draperie 2 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" },  // 2
        { nume: "Draperie Baie", stare: "Închis", valoare: 0, camera: "Baie", icon: "🪟" },          // 3
        { nume: "Draperie Bucătărie", stare: "Închis", valoare: 0, camera: "Bucătărie", icon: "🪟" } // 4
    ],
    audio: [
        { nume: "Boxă Dormitor", stare: "Oprit", valoare: 40, camera: "Dormitor", icon: "🎵" },      // 0
        { nume: "Boxă Living", stare: "Oprit", valoare: 30, camera: "Living", icon: "🎵" },          // 1
        { nume: "Sistem Audio Dolby Atmos 7.1", stare: "Oprit", valoare: 50, camera: "Living", icon: "🔊" }, // 2
        { nume: "Boxă Baie", stare: "Oprit", valoare: 30, camera: "Baie", icon: "🎵" },              // 3
        { nume: "Boxă Bucătărie", stare: "Oprit", valoare: 20, camera: "Bucătărie", icon: "🎵" }     // 4
    ],
    tv: [
        { nume: "TV Dormitor", stare: "Oprit", camera: "Dormitor", icon: "📺" }, // 0
        { nume: "Smart TV OLED 8K", stare: "Oprit", camera: "Living", icon: "📺" } // 1
    ],
    aspirator: [
        { nume: "Robot Curățenie", stare: "La Bază", baterie: 100, camera: "Living", icon: "🤖" }
    ],
    purificator: [
        { nume: "Purificator Aer", stare: "Auto", camera: "Dormitor", icon: "🌬️" },
        { nume: "Purificator Aer", stare: "Oprit", camera: "Living", icon: "🌬️" }
    ],
    electrocasnice: [
        { nume: "Mașină de Spălat", stare: "Oprit", camera: "Baie", icon: "🧺" }, // 0
        { nume: "Uscător", stare: "Oprit", camera: "Baie", icon: "💨" },          // 1
        { nume: "Espressor Cafea", stare: "Oprit", camera: "Bucătărie", icon: "☕" } // 2
    ],
    prize: [
        { nume: "Priză Dormitor", stare: "Pornit", consum: 120, detalii: "TV, Laptop, Purificator", camera: "Dormitor", icon: "🔌" }, // 0
        { nume: "Priză Living", stare: "Pornit", consum: 480, detalii: "Sistem Audio, TV, Robot Curățenie, Purificator", camera: "Living", icon: "🔌" }, // 1
        { nume: "Priză Baie", stare: "Pornit", consum: 0, detalii: "Mașină de Spălat, Uscător", camera: "Baie", icon: "🔌" }, // 2
        { nume: "Priză Bucătărie", stare: "Pornit", consum: 150, detalii: "Espressor, Frigider", camera: "Bucătărie", icon: "🔌" } // 3
    ],
    senzoriContact: [
        { nume: "Fereastră Dormitor", stare: "Închis", camera: "Dormitor", icon: "🟩" },  // 0
        { nume: "Fereastră 1 Living", stare: "Închis", camera: "Living", icon: "🟩" },     // 1
        { nume: "Fereastră 2 Living", stare: "Închis", camera: "Living", icon: "🟩" },     // 2
        { nume: "Fereastră Bucătărie", stare: "Închis", camera: "Bucătărie", icon: "🟩" }, // 3
        { nume: "Fereastră Baie", stare: "Închis", camera: "Baie", icon: "🟩" }            // 4
    ],
    senzoriMiscare: [
        { nume: "Senzor Mișcare Living", stare: "Inactiv", camera: "Living", icon: "🏃" },
        { nume: "Senzor Mișcare Hol", stare: "Inactiv", camera: "Hol", icon: "🏃" }
    ],
    camereVideo: [
        { nume: "Interfon Video", stare: "Standby", camera: "Ușă Principală", icon: "📹" },
        { nume: "Cameră Curte", stare: "Standby", camera: "Exterior", icon: "📹" }
    ],
    incuietori: [
        { nume: "Încuietoare Ușă", stare: "Blocat", camera: "Hol", icon: "🚪" }
    ]
};

function initFavorites() {
    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_1', 'incuietori_0', 'camereVideo_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
    if (!localStorage.getItem('userAutomations')) localStorage.setItem('userAutomations', JSON.stringify([]));
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
            localStorage.setItem('motionLogs', JSON.stringify(logs));
        }
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    verificaReguliAutomatizare(cat, index, disp.stare);
    reincarcaInterfata();
}

function verificaReguliAutomatizare(triggerCat, triggerIdx, newState) {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.forEach(rule => {
        if (rule.tCat === triggerCat && rule.tIdx === triggerIdx.toString() && rule.tState === newState) {
            const actionDisp = subDispozitive[rule.aCat][rule.aIdx];
            if (actionDisp) {
                actionDisp.stare = rule.aState;
                if (typeof showToast === "function") showToast(`🤖 Automatizare executată: ${actionDisp.nume} a fost modificat!`);
            }
        }
    });
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
    const tVal = document.getElementById('auto-trigger-dev').value.split('_');
    const tState = document.getElementById('auto-trigger-state').value;
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;

    const rule = {
        id: Date.now(),
        tCat: tVal[0], tIdx: tVal[1], tState: tState,
        aCat: aVal[0], aIdx: aVal[1], aState: aState,
        descriere: `DACĂ ${subDispozitive[tVal[0]][tVal[1]].nume} este ${tState} ➔ ${subDispozitive[aVal[0]][aVal[1]].nume} devine ${aState}`
    };

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.push(rule);
    localStorage.setItem('userAutomations', JSON.stringify(rules));

    document.getElementById('popup-automatizare').classList.remove('active');
    randareAutomatizari();
    if (typeof showToast === "function") showToast("Regulă de automatizare salvată!");
}

function stergeAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules = rules.filter(r => r.id !== id);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    randareAutomatizari();
}

function randareAutomatizari() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    if (rules.length === 0) {
        container.innerHTML = `<p style="opacity: 0.6;">Nu ai creat nicio automatizare încă.</p>`;
        return;
    }
    let html = '';
    rules.forEach(rule => {
        html += `
            <div class="hk-card" style="height: auto; padding: 20px; border-left: 5px solid var(--accent-color);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: bold; font-size: 1.1em;">⚙️ Regulă Activă</div>
                    <button onclick="stergeAutomatizare(${rule.id})" style="background: var(--error-color); color: white; border: none; border-radius: 5px; cursor: pointer; padding: 5px 10px;">Șterge</button>
                </div>
                <div style="margin-top: 15px; opacity: 0.9; line-height: 1.5;">${rule.descriere}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function genereazaListaNotificari() {
    let notificari = [];
    const becuriAprinse = subDispozitive.becuri.filter(d => d.stare === "Pornit").length;
    if (becuriAprinse > 0) notificari.push(`💡 ${becuriAprinse} ${becuriAprinse === 1 ? 'lumină aprinsă' : 'lumini aprinse'}`);

    if (subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === "Pornit") notificari.push(`🧺 Mașina de spălat funcționează`);
    if (subDispozitive.incuietori[0] && subDispozitive.incuietori[0].stare === "Deblocat") notificari.push(`🚪 Avertisment: Ușa este deblocată!`);

    if (subDispozitive.senzoriContact) {
        subDispozitive.senzoriContact.forEach(d => {
            if(d.stare === "Deschis") notificari.push(`🪟 Atenție: Fereastra din ${d.camera} este deschisă!`);
        });
    }
    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log) => notificari.push(`🏃 Motion detected in ${log.camera} [${log.ora}]`));
    return notificari;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    const toateNotificarile = genereazaListaNotificari();
    container.innerHTML = "";
    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">🏠 Nicio notificare. Sistemele rulează perfect.</p>`;
        return;
    }
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        container.innerHTML += `<div class="notification-item"><span>${toateNotificarile[i]}</span></div>`;
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
    
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left;">`;
    genereazaListaNotificari().forEach(notif => {
        html += `<div class="notification-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);"><span>${notif}</span></div>`;
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
        if (typeof showToast === "function") showToast(`Scena "${scena.nume}" a fost activată!`);
        reincarcaInterfata();
    }
}

// --- LOGICA PENTRU CONSUM DINAMIC REAL ---
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
        consumReal += 150; // Frigiderul consumă constant
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

// --- LOGICA DE POP-UP PENTRU HARTA CASEI (Termostate, Prize, Ferestre) ---
function deschideMeniuDispozitive(cardId, categorie, elementIndex) {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    continental.innerHTML = "";

    // 1. POP-UP PENTRU TERMOSTATE
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

    // 2. POP-UP PENTRU SENZORI PERICOLE
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

    // 3. POP-UP STANDARD PENTRU COLECȚIILE DE DISPOZITIVE (becuri, jaluzele, prize, etc.)
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
    reincarcaInterfata();
}

function aplicaMod(mod) {
    stingeTotGlobal();
    if (mod === 'morning') {
        subDispozitive.jaluzele.forEach(d => d.stare = "Deschis");
        if(subDispozitive.electrocasnice[2]) subDispozitive.electrocasnice[2].stare = "Pornit";
        subDispozitive.audio.forEach(d => { d.stare = "Pornit"; d.valoare = 20; });
    } else if (mod === 'away') {
        if(subDispozitive.aspirator[0]) subDispozitive.aspirator[0].stare = "Curăță";
        if(subDispozitive.camereVideo) subDispozitive.camereVideo.forEach(d => d.stare = "LIVE");
        localStorage.setItem('alarmaDezactivata', 'false'); 
    } else if (mod === 'home') {
        localStorage.setItem('alarmaDezactivata', 'true'); 
        if(subDispozitive.incuietori[0]) subDispozitive.incuietori[0].stare = "Deblocat";
        subDispozitive.jaluzele.forEach(d => d.stare = "Deschis");
        if(subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit"; 
    } else if (mod === 'movie') {
        subDispozitive.jaluzele.forEach(d => d.stare = "Închis"); 
        if(subDispozitive.tv[1]) subDispozitive.tv[1].stare = "Pornit"; 
        if(subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#2980b9"; }
        subDispozitive.becuri.forEach(d => d.stare = "Oprit"); 
    } else if (mod === 'focus') {
        subDispozitive.becuri[0].stare = "Pornit";
        if(subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Boost";
    } else if (mod === 'dinner') {
        subDispozitive.becuri.forEach(d => { if(d.camera === "Living" || d.camera === "Bucătărie") d.stare = "Pornit"; });
        if(subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#e67e22"; }
    }
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