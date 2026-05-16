document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    incarcaNumeCasa();
    if(document.getElementById('fav-scenes-container')) {
        randareHome();
        afiseazaNotificariHome();
    }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    actualizeazaStatusGlobal();
});

const scenesDB = [
    { id: 's_noapte', nume: "🌙 Mod Noapte", descriere: "Oprește luminile, armează ușile.", action: () => aplicaMod('noapte') },
    { id: 's_party', nume: "🎉 Mod Party", descriere: "Lumini 100% și muzică în living.", action: () => aplicaMod('party') },
    { id: 's_cinema', nume: "🎬 Mod Cinema", descriere: "Draperii trase, TV pornit.", action: () => aplicaMod('cinema') },
    { id: 's_off', nume: "🛑 Stinge Tot", descriere: "Oprește tot și părăsește casa.", action: () => stingeTotGlobal() }
];

const subDispozitive = {
    becuri: [
        { nume: "Bec", stare: "Pornit", valoare: 75, camera: "Dormitor", icon: "💡" },
        { nume: "Bec", stare: "Oprit", valoare: 50, camera: "Living", icon: "💡" },
        { nume: "Bec", stare: "Oprit", valoare: 50, camera: "Baie", icon: "💡" },
        { nume: "Bec", stare: "Oprit", valoare: 100, camera: "Bucătărie", icon: "💡" }
    ],
    jaluzele: [
        { nume: "Draperie", stare: "Oprit", valoare: 100, camera: "Dormitor", icon: "🪟" },
        { nume: "Draperie 1", stare: "Oprit", valoare: 0, camera: "Living", icon: "🪟" },
        { nume: "Draperie 2", stare: "Oprit", valoare: 0, camera: "Living", icon: "🪟" },
        { nume: "Draperie", stare: "Oprit", valoare: 100, camera: "Baie", icon: "🪟" }
    ],
    audio: [
        { nume: "Boxă", stare: "Oprit", valoare: 40, camera: "Dormitor", icon: "🎵" },
        { nume: "Boxă", stare: "Oprit", valoare: 30, camera: "Living", icon: "🎵" },
        { nume: "Sistem Audio", stare: "Oprit", valoare: 50, camera: "Living", icon: "🔊" },
        { nume: "Boxă", stare: "Oprit", valoare: 30, camera: "Baie", icon: "🎵" },
        { nume: "Boxă", stare: "Oprit", valoare: 20, camera: "Bucătărie", icon: "🎵" }
    ],
    tv: [
        { nume: "Televizor", stare: "Oprit", camera: "Dormitor", icon: "📺" },
        { nume: "Televizor", stare: "Pornit", camera: "Living", icon: "📺" }
    ],
    aspirator: [
        { nume: "Robot Curățenie", stare: "La Bază", baterie: 100, camera: "Living", icon: "🤖" }
    ],
    electrocasnice: [
        { nume: "Mașină de Spălat", stare: "Oprit", camera: "Baie", icon: "🧺" },
        { nume: "Uscător", stare: "Oprit", camera: "Baie", icon: "💨" }
    ],
    prize: [
        { nume: "Priză (TV, Laptop)", stare: "Pornit", consum: 45, camera: "Dormitor", icon: "🔌" },
        { nume: "Priză (Audio, Robot)", stare: "Pornit", consum: 180, camera: "Living", icon: "🔌" },
        { nume: "Priză (Mașină Spălat)", stare: "Oprit", consum: 2100, camera: "Baie", icon: "🔌" },
        { nume: "Priză (Aragaz)", stare: "Pornit", consum: 280, camera: "Bucătărie", icon: "🔌" }
    ],
    senzoriMiscare: [
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Living", icon: "🏃" },
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Dormitor", icon: "🏃" },
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Bucătărie", icon: "🏃" },
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Baie", icon: "🏃" }
    ],
    incuietori: [
        { nume: "Ușă Principală", stare: "Blocat", camera: "Hol", icon: "🚪" }
    ]
};

function initFavorites() {
    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_1', 'incuietori_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_noapte', 's_off']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
}

function incarcaNumeCasa() {
    const titluCasa = document.getElementById('nume-casa-global');
    if (titluCasa) {
        titluCasa.innerText = localStorage.getItem('numeCasaSalvat') || "My Home";
    }
}

function toggleFavorite(id, type, event) {
    if(event) event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(type === 'scene' ? 'favScenes' : 'favAcc'));
    if (favs.includes(id)) favs = favs.filter(item => item !== id);
    else favs.push(id);
    localStorage.setItem(type === 'scene' ? 'favScenes' : 'favAcc', JSON.stringify(favs));
    
    if(document.getElementById('fav-scenes-container')) randareHome();
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
}

function toggleStareDispozitiv(cat, index, event) {
    if(event) event.stopPropagation();
    localStorage.removeItem('activeScene');
    
    const disp = subDispozitive[cat][index];
    if (cat === 'incuietori') {
        disp.stare = disp.stare === "Blocat" ? "Deblocat" : "Blocat";
    } else if (cat === 'aspirator') {
        disp.stare = disp.stare === "La Bază" ? "Curăță" : "La Bază";
    } else if (cat === 'senzoriMiscare') {
        disp.stare = disp.stare === "Inactiv" ? "Activ" : "Inactiv";
        // REGULA AUTOMATĂ: Dacă senzorul devine ACTIV, aprinde becul din acea cameră!
        if (disp.stare === "Activ") {
            const becAsociat = subDispozitive.becuri.find(b => b.camera === disp.camera);
            if (becAsociat) becAsociat.stare = "Pornit";
            
            // Adăugăm alerta de mișcare în jurnalul de evenimente
            let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
            const timpAcum = new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'});
            logs.unshift({ camera: disp.camera, ora: timpAcum });
            localStorage.setItem('motionLogs', JSON.stringify(logs));
        }
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) {
        randareHome();
        afiseazaNotificariHome();
    }
    if(document.getElementById('all-accessories-container')) randareAccesorii();
}

// --- CENTRUL DE GENERARE A NOTIFICĂRILOR DINAMICE ȘI EVENIMENTE ---
function genereazaListaNotificari() {
    let notificari = [];

    // 1. Monitorizare Becuri
    const becuriAprinse = subDispozitive.becuri.filter(d => d.stare === "Pornit").length;
    if (becuriAprinse > 0) {
        notificari.push(`💡 ${becuriAprinse} ${becuriAprinse === 1 ? 'lumină este aprinsă' : 'lumini sunt aprinse'}`);
    }

    // 2. Monitorizare Mașină de Spălat
    if (subDispozitive.electrocasnice[0].stare === "Pornit") {
        notificari.push(`🧺 Mașina de spălat din Baie funcționează`);
    }

    // 3. Monitorizare Uscător
    if (subDispozitive.electrocasnice[1].stare === "Pornit") {
        notificari.push(`💨 Uscătorul de haine din Baie funcționează`);
    }

    // 4. Monitorizare Robot Aspirator
    if (subDispozitive.aspirator[0].stare === "Curăță") {
        notificari.push(`🤖 Robotul de curățenie aspiră locuința`);
    }

    // 5. Monitorizare Ușă Deblocată
    if (subDispozitive.incuietori[0].stare === "Deblocat") {
        notificari.push(`🚪 Avertisment: Ușa Principală este deblocată!`);
    }

    // 6. Logurile senzorilor de mișcare salvate în sistem
    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => {
        notificari.push(`🏃 Motion detected in ${log.camera} [${log.ora}]`);
    });

    return notificari;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const toateNotificarile = genereazaListaNotificari();
    container.innerHTML = "";

    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">🏠 Toate sistemele rulează în parametri normali. Nicio notificare.</p>`;
        return;
    }

    // Afișăm maximum 3 notificări (cerința de UX)
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        container.innerHTML += `
            <div class="notification-item">
                <span>${toateNotificarile[i]}</span>
            </div>
        `;
    }

    // Dacă sunt mai mult de 3 notificări, adăugăm butonul de extindere modulară
    if (toateNotificarile.length > 3) {
        container.innerHTML += `
            <button class="see-more-btn" onclick="deschidePopupToateNotificarile()">See more &gt;</button>
        `;
    }
}

function deschidePopupToateNotificarile() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');

    if (!modal || !titlu || !continental) return;

    // Setăm titlul ferestrei modale
    titlu.innerText = "🔔 Toate Notificările Casei";
    const toate = genereazaListaNotificari();

    // Generăm lista interioară cu scroll
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left;">`;
    toate.forEach(notif => {
        html += `
            <div class="notification-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <span>${notif}</span>
            </div>
        `;
    });
    html += `</div>`;
    
    // Lăsăm doar acțiunea de ștergere a istoricului în subsol, fără buton de închidere redundant
    html += `
        <div style="margin-top: 10px;">
            <button onclick="localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); document.getElementById('popup-dispozitive').classList.remove('active');" 
                    style="background-color: transparent; border: 2px solid var(--error-color); color: var(--error-color); width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                🗑️ Șterge Istoric Mișcare
            </button>
        </div>
    `;

    // Injectăm conținutul și activăm modalul pe ecran
    continental.innerHTML = html;
    modal.classList.add('active');
}

function construiesteCardHTML(disp, cat, idx, isFav) {
    const isActive = disp.stare === "Pornit" || disp.stare === "Curăță" || disp.stare === "Deblocat" || disp.stare === "Activ";
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

function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    
    let accHtml = '';
    Object.keys(subDispozitive).forEach(cat => {
        subDispozitive[cat].forEach((disp, idx) => {
            const idUnic = `${cat}_${idx}`;
            if(favAcc.includes(idUnic)) {
                accHtml += construiesteCardHTML(disp, cat, idx, true);
            }
        });
    });
    document.getElementById('fav-accessories-container').innerHTML = accHtml || '<p style="opacity:0.5;">Niciun accesoriu favorit.</p>';

    let sceneHtml = '';
    scenesDB.forEach(scena => {
        if(favScenes.includes(scena.id)) {
            sceneHtml += construiesteScenaHTML(scena, true);
        }
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
            const idUnic = `${item.cat}_${item.idx}`;
            const isFav = favAcc.includes(idUnic);
            html += construiesteCardHTML(item.disp, item.cat, item.idx, isFav);
        });
        html += `</div>`;
    });
    document.getElementById('all-accessories-container').innerHTML = html;
}

function randareScene() {
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    let html = '';
    scenesDB.forEach(scena => {
        const isFav = favScenes.includes(scena.id);
        html += construiesteScenaHTML(scena, isFav);
    });
    document.getElementById('all-scenes-container').innerHTML = html;
}

function executaScena(id) {
    const scena = scenesDB.find(s => s.id === id);
    if(scena) {
        localStorage.setItem('activeScene', id);
        scena.action();
        if (typeof showToast === "function") showToast(`Scena "${scena.nume}" a fost activată!`);
        if(document.getElementById('fav-scenes-container')) randareHome();
        if(document.getElementById('all-scenes-container')) randareScene();
    }
}

function deschideMeniuDispozitive(cardId, categorie, elementIndex) {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');

    continental.innerHTML = "";
    const disp = subDispozitive[categorie][elementIndex];
    titlu.innerText = `${disp.icon} ${disp.nume} (${disp.camera})`;

    let contentHtml = `
        <div style="margin-bottom: 20px; text-align:center;">
            <button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); inchidePopup();" 
                    style="background-color: ${disp.stare==='Pornit'||disp.stare==='Curăță'||disp.stare==='Deblocat'||disp.stare==='Activ' ? 'var(--success-color)' : '#95a5a6'}; 
                           color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                Stare Curentă: ${disp.stare}
            </button>
        </div>
    `;

    if (['becuri', 'audio', 'jaluzele'].includes(categorie)) {
        const isOff = disp.stare === 'Oprit';
        contentHtml += `
            <div class="slider-container ${isOff ? 'disabled-controls' : ''}">
                <label>Nivel Setat: <span id="val-${categorie}-${elementIndex}">${disp.valoare}</span>%</label>
                <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} 
                       oninput="subDispozitive['${categorie}'][${elementIndex}].valoare = this.value; document.getElementById('val-${categorie}-${elementIndex}').innerText = this.value;">
            </div>
        `;
    }
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function stingeTotGlobal() { Object.keys(subDispozitive).forEach(cat => subDispozitive[cat].forEach(d => { if (cat === 'incuietori') d.stare = "Blocat"; else d.stare = "Oprit"; })); actualizeazaStatusGlobal(); if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); } }
function aplicaMod(mod) { stingeTotGlobal(); actualizeazaStatusGlobal(); if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); } }
function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');
    if(!sec) return;
    let consum = 150; 
    subDispozitive.prize.forEach(d => { if(d.stare === "Pornit") consum += d.consum; });
    con.innerText = (consum/1000).toFixed(2) + " kW";
    sec.innerText = localStorage.getItem('alarmaDezactivata') === 'true' ? "Dezactivată" : "Armată";
}