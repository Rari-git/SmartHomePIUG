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

const subDispozitive = {
    becuri: [
        { nume: "Bec Principal", stare: "Pornit", valoare: 75, camera: "Dormitor", icon: "💡" },
        { nume: "Bec Tavan", stare: "Oprit", valoare: 50, camera: "Living", icon: "💡" },
        { nume: "Oglindă Baie", stare: "Oprit", valoare: 50, camera: "Baie", icon: "💡" },
        { nume: "Spoturi Bucătărie", stare: "Oprit", valoare: 100, camera: "Bucătărie", icon: "💡" }
    ],
    luminiRGB: [
        { nume: "Bandă LED TV", stare: "Oprit", valoare: 100, culoare: "#3498db", camera: "Living", icon: "🌈" },
        { nume: "Lampă Birou", stare: "Oprit", valoare: 80, culoare: "#f1c40f", camera: "Dormitor", icon: "🌈" }
    ],
    jaluzele: [
        { nume: "Draperie", stare: "Închis", valoare: 0, camera: "Dormitor", icon: "🪟" },
        { nume: "Draperie Principală", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" },
        { nume: "Draperie Secundară", stare: "Deschis", valoare: 100, camera: "Living", icon: "🪟" }
    ],
    audio: [
        { nume: "HomePod Mini", stare: "Oprit", valoare: 40, camera: "Dormitor", icon: "🎵" },
        { nume: "Soundbar", stare: "Oprit", valoare: 30, camera: "Living", icon: "🔊" }
    ],
    tv: [
        { nume: "Smart TV OLED", stare: "Oprit", camera: "Living", icon: "📺" }
    ],
    aspirator: [
        { nume: "Robot Curățenie", stare: "La Bază", baterie: 100, camera: "Living", icon: "🤖" }
    ],
    purificator: [
        { nume: "Purificator Aer", stare: "Auto", camera: "Dormitor", icon: "🌬️" },
        { nume: "Purificator Aer", stare: "Oprit", camera: "Living", icon: "🌬️" }
    ],
    electrocasnice: [
        { nume: "Mașină de Spălat", stare: "Oprit", camera: "Baie", icon: "🧺" },
        { nume: "Espressor Cafea", stare: "Oprit", camera: "Bucătărie", icon: "☕" }
    ],
    prize: [
        { nume: "Priză (TV, Laptop)", stare: "Pornit", consum: 45, camera: "Dormitor", icon: "🔌" },
        { nume: "Priză (Audio)", stare: "Pornit", consum: 180, camera: "Living", icon: "🔌" }
    ],
    senzoriContact: [
        { nume: "Fereastră", stare: "Închis", camera: "Dormitor", icon: "🟩" },
        { nume: "Fereastră", stare: "Închis", camera: "Living", icon: "🟩" },
        { nume: "Fereastră", stare: "Închis", camera: "Bucătărie", icon: "🟩" }
    ],
    senzoriMiscare: [
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Living", icon: "🏃" },
        { nume: "Senzor Mișcare", stare: "Inactiv", camera: "Hol", icon: "🏃" }
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
    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_0', 'incuietori_0', 'camereVideo_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
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
    
    if(document.getElementById('fav-scenes-container')) randareHome();
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
}

function toggleStareDispozitiv(cat, index, event) {
    if(event) event.stopPropagation();
    localStorage.removeItem('activeScene');
    
    const disp = subDispozitive[cat][index];
    
    if (cat === 'incuietori') {
        if(disp.stare === "Blocat") {
            if(!confirm("Ești sigur că vrei să deblochezi ușa principală?")) return;
            disp.stare = "Deblocat";
        } else {
            disp.stare = "Blocat";
        }
    } else if (cat === 'aspirator') {
        disp.stare = disp.stare === "La Bază" ? "Curăță" : "La Bază";
    } else if (cat === 'jaluzele') {
        disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
    } else if (cat === 'senzoriContact') {
        disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
    } else if (cat === 'camereVideo') {
        disp.stare = disp.stare === "Standby" ? "LIVE" : "Standby";
    } else if (cat === 'purificator') {
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
    
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
}

function genereazaListaNotificari() {
    let notificari = [];
    const becuriAprinse = subDispozitive.becuri.filter(d => d.stare === "Pornit").length;
    if (becuriAprinse > 0) notificari.push(`💡 ${becuriAprinse} ${becuriAprinse === 1 ? 'lumină aprinsă' : 'lumini aprinse'}`);

    if (subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === "Pornit") notificari.push(`🧺 Mașina de spălat funcționează`);
    if (subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === "Curăță") notificari.push(`🤖 Robotul aspiră locuința`);
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
    const isActive = disp.stare === "Pornit" || disp.stare === "Curăță" || disp.stare === "Deblocat" || disp.stare === "Activ" || disp.stare === "Deschis" || disp.stare === "LIVE" || disp.stare === "Auto" || disp.stare === "Boost";
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

// --- NOU: RANDARE SPECIFICĂ PENTRU TABUL DE SECURITATE ---
function randareSecuritate() {
    const container = document.getElementById('security-devices-container');
    if (!container) return;

    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    let html = '';

    // Filtrăm DOAR categoriile relevante pentru securitate perimetrală
    const categoriiSecuritate = ['camereVideo', 'senzoriMiscare', 'senzoriContact', 'incuietori'];

    categoriiSecuritate.forEach(cat => {
        if (subDispozitive[cat]) {
            subDispozitive[cat].forEach((disp, idx) => {
                const isFav = favAcc.includes(`${cat}_${idx}`);
                html += construiesteCardHTML(disp, cat, idx, isFav);
            });
        }
    });

    container.innerHTML = html || '<p style="opacity:0.5;">Niciun dispozitiv de securitate găsit.</p>';
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
    titlu.innerText = `${disp.icon} ${disp.nume}`;

    let contentHtml = `
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
            <button style="background: transparent; border: 2px solid var(--accent-color); color: var(--accent-color); padding: 10px; border-radius: 8px; width: 100%; font-weight: bold;">🎤 Apasă pentru a vorbi</button>
        `;
    }

    if (categorie === 'luminiRGB') {
        contentHtml += `
            <div style="margin: 15px 0;">
                <label>Alege Culoarea Benzii LED:</label>
                <input type="color" value="${disp.culoare || '#ffffff'}" onchange="subDispozitive['${categorie}'][${elementIndex}].culoare = this.value; if(document.getElementById('all-accessories-container')) randareAccesorii();" style="width: 100%; height: 45px; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px;">
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
    
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function stingeTotGlobal() { 
    Object.keys(subDispozitive).forEach(cat => subDispozitive[cat].forEach(d => { 
        if (cat === 'incuietori') d.stare = "Blocat"; 
        else if(cat === 'jaluzele') d.stare = "Închis"; 
        else d.stare = "Oprit"; 
    })); 
    actualizeazaStatusGlobal(); 
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); } 
}

function aplicaMod(mod) {
    stingeTotGlobal();

    if (mod === 'morning') {
        subDispozitive.jaluzele.forEach(d => d.stare = "Deschis");
        if(subDispozitive.electrocasnice[1]) subDispozitive.electrocasnice[1].stare = "Pornit";
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
        if(subDispozitive.tv[0]) subDispozitive.tv[0].stare = "Pornit"; 
        if(subDispozitive.luminiRGB[0]) { 
            subDispozitive.luminiRGB[0].stare = "Pornit"; 
            subDispozitive.luminiRGB[0].culoare = "#2980b9"; 
        }
        subDispozitive.becuri.forEach(d => d.stare = "Oprit"); 
    } else if (mod === 'focus') {
        subDispozitive.becuri[0].stare = "Pornit";
        if(subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Boost";
    } else if (mod === 'dinner') {
        subDispozitive.becuri.forEach(d => { if(d.camera === "Living" || d.camera === "Bucătărie") d.stare = "Pornit"; });
        if(subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#e67e22"; }
    }

    actualizeazaStatusGlobal(); 
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
}

function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');
    if(!sec) return;
    let consum = 150; 
    subDispozitive.prize.forEach(d => { if(d.stare === "Pornit") consum += d.consum; });
    con.innerText = (consum/1000).toFixed(2) + " kW";
    sec.innerText = localStorage.getItem('alarmaDezactivata') === 'true' ? "Dezactivată" : "Armată";
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('popup-dispozitive');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
}