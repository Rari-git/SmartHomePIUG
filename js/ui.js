let tipIstoricCurent = 'energie';
let perioadaIstoricaCurenta = '7z';

function reincarcaInterfata() {
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
    if(document.getElementById('automations-list')) { randareAutomatizari(); randareSabloane(); }
    if(document.getElementById('logs-container')) randareStatisticiLogs();
}

function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    
    // 1. Randare Accesorii exact în ordinea din localStorage
    let accHtml = '';
    favAcc.forEach(idSalvat => {
        const [cat, idx] = idSalvat.split('_');
        if (subDispozitive[cat] && subDispozitive[cat][idx]) {
            accHtml += construiesteCardHTML(subDispozitive[cat][idx], cat, idx, true);
        }
    });
    const accContainer = document.getElementById('fav-accessories-container');
    if (accContainer) accContainer.innerHTML = accHtml || '<p style="opacity:0.5;">Niciun accesoriu favorit.</p>';

    // 2. Randare Scene
    let sceneHtml = '';
    favScenes.forEach(idScena => {
        const scena = scenesDB.find(s => s.id === idScena);
        if (scena) sceneHtml += construiesteScenaHTML(scena, true);
    });
    const sceneContainer = document.getElementById('fav-scenes-container');
    if (sceneContainer) sceneContainer.innerHTML = sceneHtml || '<p style="opacity:0.5;">Nicio scenă favorită.</p>';

    // 3. Inițializare sistem Drag & Drop
    setTimeout(() => {
        if (typeof Sortable !== 'undefined') {
            if (accContainer && accContainer.children.length > 0) {
                new Sortable(accContainer, {
                    animation: 200,
                    delay: 150,
                    delayOnTouchOnly: true,
                    ghostClass: 'is-active', 
                    onEnd: function () {
                        const nouaOrdine = Array.from(accContainer.children).map(card => card.getAttribute('data-id'));
                        localStorage.setItem('favAcc', JSON.stringify(nouaOrdine));
                    }
                });
            }
            if (sceneContainer && sceneContainer.children.length > 0) {
                new Sortable(sceneContainer, {
                    animation: 200,
                    delay: 150,
                    delayOnTouchOnly: true,
                    ghostClass: 'is-active',
                    onEnd: function () {
                        const nouaOrdine = Array.from(sceneContainer.children).map(card => card.getAttribute('data-id'));
                        localStorage.setItem('favScenes', JSON.stringify(nouaOrdine));
                    }
                });
            }
        }
    }, 100);
}

function randareAccesorii() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const camereMap = {};
    Object.keys(subDispozitive).forEach(cat => {
        (subDispozitive[cat] || []).forEach((disp, idx) => {
            if(!camereMap[disp.camera]) camereMap[disp.camera] = [];
            camereMap[disp.camera].push({disp, cat, idx});
        });
    });
    let html = '';
    Object.keys(camereMap).sort().forEach(camera => {
        html += `<h2 class="hk-section-title">${camera}</h2><div class="hk-grid">`;
        camereMap[camera].forEach(item => { html += construiesteCardHTML(item.disp, item.cat, item.idx, favAcc.includes(`${item.cat}_${item.idx}`)); });
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
            subDispozitive[cat].forEach((disp, idx) => { html += construiesteCardHTML(disp, cat, idx, favAcc.includes(`${cat}_${idx}`)); });
        }
    });
    container.innerHTML = html;
}

function randareSabloane() {
    const container = document.getElementById('sabloane-carousel');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const activeIds = rules.map(r => r.idSugestie).filter(id => id);
    let html = '';
    let counter = 0;
    
    sabloaneRecomandate.forEach(sug => {
        if (!activeIds.includes(sug.idSugestie)) {
            html += `<div class="suggestion-card" style="border-top: 5px solid ${sug.culoare};"><div style="font-size: 2em; margin-bottom: 10px; line-height: 1;">${sug.icon}</div><strong style="font-size: 1.1em; color: ${sug.culoare};">${sug.nume}</strong><p style="font-size: 0.85em; opacity: 0.8; margin: 10px 0; flex: 1; line-height: 1.4;">${sug.descriereScurta}</p><button class="add-sug-btn" onclick="adaugaSugestie('${sug.idSugestie}')">+ Adaugă Regula</button></div>`;
            counter++;
        }
    });
    container.innerHTML = counter === 0 ? `<p style="opacity:0.5; padding: 20px; font-style: italic;">Ai activat toate șabloanele recomandate!</p>` : html;
}

function randareAutomatizari() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let html = '';
    rules.forEach(rule => {
        html += `<div class="hk-card" style="height: auto; padding: 20px; border-left: 5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}; opacity: ${rule.active ? '1' : '0.5'}; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;"><div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; margin-bottom: 10px;"><div style="font-weight: bold; font-size: 1.1em; color: ${rule.active ? 'var(--text-color)' : '#95a5a6'};">${rule.tipTrigger === 'timp' ? '<i class="ph-bold ph-clock"></i>' : '<i class="ph-bold ph-gear"></i>'} Regula Activă</div><div style="display: flex; align-items: center; gap: 15px;"><label class="toggle-switch"><input type="checkbox" onchange="comutaAutomatizare(${rule.id})" ${rule.active ? 'checked' : ''}><span class="slider"></span></label><button onclick="stergeAutomatizare(${rule.id})" style="background: transparent; color: var(--error-color); font-size: 1.3em; border: none; cursor: pointer; padding: 0;"><i class="ph-bold ph-trash"></i></button></div></div><div style="font-size: 1em; line-height: 1.5; font-weight: 500; flex: 1;">${rule.descriere}</div><div style="margin-top: 15px; font-size: 0.8em; color: gray; font-weight: bold;"><i class="ph-bold ph-clock-counter-clockwise"></i> Ultima rulare: ${rule.lastRun || 'Niciodată'}</div></div>`;
    });
    html += `<div class="hk-card card-add-new" onclick="deschideModalAutomatizare()"><div class="plus-icon"><i class="ph-bold ph-plus"></i></div><div style="font-size: 1.1em; font-weight: bold;">Regulă Nouă</div><div style="font-size: 0.85em; margin-top: 5px;">Configurare complet manuală</div></div>`;
    container.innerHTML = html;
}

function randareStatisticiLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    const logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    if (logs.length === 0) {
        container.innerHTML = `<p style="opacity: 0.5; font-style: italic; text-align: center; padding: 20px;">Niciun eveniment înregistrat încă.</p>`;
        return;
    }
    container.innerHTML = logs.map(log => `<div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border-left: 4px solid var(--accent-color);"><span style="font-weight: 500; font-size: 0.95em;">${log.text}</span><span style="font-size: 0.8em; opacity: 0.6; font-weight: bold; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; margin-left: 10px;"><i class="ph-bold ph-clock"></i> ${log.ora}</span></div>`).join('');
}

function construiesteCardHTML(disp, cat, idx, isFav) {
    const isActive = ['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare);
    const idUnic = `${cat}_${idx}`;
    return `<div class="hk-card ${isActive ? 'is-active' : ''}" data-id="${idUnic}" onclick="toggleStareDispozitiv('${cat}', ${idx}, event)"><div class="hk-controls"><button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${idUnic}', 'acc', event)"><i class="ph-fill ph-star"></i></button><button class="hk-btn" onclick="deschideMeniuDispozitive('none', '${cat}', ${idx}); event.stopPropagation();"><i class="ph-bold ph-gear"></i></button></div><div class="hk-icon">${disp.icon}</div><div><div class="hk-name">${disp.nume}</div><div class="hk-state">${disp.stare} ${disp.camera ? `• ${disp.camera}` : ''}</div></div></div>`;
}

function construiesteScenaHTML(scena, isFav) {
    const isActive = localStorage.getItem('activeScene') === scena.id;
    const esteCustom = !scena.id.startsWith('s_'); 
    return `<div class="hk-card ${isActive ? 'is-active' : ''}" data-id="${scena.id}" style="height: 90px;" onclick="executaScena('${scena.id}')"><div class="hk-controls">${esteCustom ? `<button class="hk-btn" onclick="stergeScenaCustom('${scena.id}', event)" style="color: var(--error-color); margin-right: 2px;"><i class="ph-bold ph-trash"></i></button>` : ''}<button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${scena.id}', 'scene', event)"><i class="ph-fill ph-star"></i></button></div><div class="hk-name" style="font-size: 1.1em; margin-bottom: 5px;">${scena.nume}</div><div class="hk-state" style="margin-top: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${scena.descriere}</div></div>`;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    const toateNotificarile = genereazaListaNotificari();
    container.innerHTML = "";
    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">Toate sistemele sunt în standby.</p>`;
        return;
    }
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        const notif = toateNotificarile[i];
        if (notif.id === "notif_lumini") container.innerHTML += `<div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer;"><span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pt detalii)</span></span></div>`;
        else if (notif.id === "notif_audio") container.innerHTML += `<div class="notification-item" onclick="deschidePopupAudioPornit()" style="cursor: pointer;"><span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pt detalii)</span></span></div>`;
        else if (notif.actiune) container.innerHTML += `<div class="notification-item" onclick="${notif.actiune}" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color=''"><span>${notif.text}</span></div>`;
        else container.innerHTML += `<div class="notification-item"><span>${notif.text}</span></div>`;
    }
    if (toateNotificarile.length > 3) container.innerHTML += `<button class="see-more-btn" onclick="deschidePopupToateNotificarile()">Vezi mai multe &gt;</button>`;
}

function genereazaListaNotificari() {
    let notificari = [];
    const becuriAprinse = (subDispozitive.becuri || []).filter(d => d.stare === "Pornit");
    const rgbAprinse = (subDispozitive.luminiRGB || []).filter(d => d.stare === "Pornit");
    const totalLumini = becuriAprinse.length + rgbAprinse.length;
    if (totalLumini > 0) notificari.push({ id: "notif_lumini", text: `<i class="ph-fill ph-lightbulb"></i> ${totalLumini} ${totalLumini === 1 ? 'lumină aprinsă' : 'lumini aprinse'}` });
    const audioPornit = (subDispozitive.audio || []).filter(d => d.stare === "Pornit");
    if (audioPornit.length > 0) notificari.push({ id: "notif_audio", text: `<i class="ph-fill ph-speaker-high"></i> ${audioPornit.length} sisteme active` });
    const tvPornit = (subDispozitive.tv || []).filter(d => d.stare === "Pornit");
    if (tvPornit.length > 0) { const idx = subDispozitive.tv.findIndex(d => d === tvPornit[0]); notificari.push({ id: "notif_tv", text: `<i class="ph-fill ph-television"></i> TV pornit în ${tvPornit[0].camera}`, actiune: `deschideMeniuDispozitive('none', 'tv', ${idx})` }); }
    if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === "Curăță") notificari.push({ id: "notif_aspirator", text: `<i class="ph-fill ph-robot"></i> Robotul curăță în ${subDispozitive.aspirator[0].camera}`, actiune: `deschideMeniuDispozitive('none', 'aspirator', 0)` });
    if (subDispozitive.incuietori && subDispozitive.incuietori[0] && subDispozitive.incuietori[0].stare === "Deblocat") notificari.push({ id: "notif_usa", text: `<i class="ph-fill ph-lock-key"></i> Ușa de intrare este deblocată!`, actiune: `deschideMeniuDispozitive('none', 'incuietori', 0)` });
    if (subDispozitive.senzoriContact) subDispozitive.senzoriContact.forEach((d, idx) => { if(d.stare === "Deschis") notificari.push({ id: `notif_fereastra_${idx}`, text: `${iconFereastra} Fereastră deschisă în ${d.camera}`, actiune: `deschideMeniuDispozitive('none', 'senzoriContact', ${idx})` }); });
    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => { notificari.push({ id: `notif_motion_${idx}`, text: `<i class="ph-fill ph-person-simple-walk"></i> Mișcare în ${log.camera} [${log.ora}]` }); });
    return notificari;
}

function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');
    if(!sec) return;
    let consumTotal = 150; 
    if (subDispozitive.prize) subDispozitive.prize.forEach(priză => { consumTotal += calculeazaConsumPriza(priză); });
    con.innerText = (consumTotal/1000).toFixed(2) + " kW";
    sec.innerText = localStorage.getItem('alarmaDezactivata') === 'true' ? "Dezactivată" : "Armată";
}

function deschideMeniuDispozitive(cardId, categorie, elementIndex) {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    continental.innerHTML = "";

    if (categorie.startsWith('climatizare-')) {
        const camera = categorie.split('-')[1];
        titlu.innerHTML = `🌡️ Termostat ${camera.charAt(0).toUpperCase() + camera.slice(1)}`;
        let temp = localStorage.getItem(`temp-${camera}`) || "22";
        continental.innerHTML = `<div style="text-align: center; background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);"><h3 style="margin-top: 0; opacity: 0.8;">Setare Temperatură</h3><div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;"><span id="popup-temp-${camera}">${temp}</span>°C</div><div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;"><button onclick="ajusteazaDinPopup('${camera}', 'minus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; cursor: pointer;">−</button><button onclick="ajusteazaDinPopup('${camera}', 'plus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; cursor: pointer;">+</button></div></div>`;
        modal.classList.add('active'); return;
    }
    const disp = subDispozitive[categorie][elementIndex];
    titlu.innerHTML = `${disp.icon} ${disp.nume}`;
    let contentHtml = '';
    if (categorie === 'prize') {
        contentHtml = `<div style="background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;"><div style="font-size: 1.1em; font-weight: bold; opacity: 0.8; margin-bottom: 5px;">Consum Curent în ${disp.camera}</div><div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;">${calculeazaConsumPriza(disp)} W</div><div style="font-size: 0.9em; opacity: 0.7; margin-bottom: 20px;">Dispozitive: <strong>${disp.detalii}</strong></div><button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); deschideMeniuDispozitive('none', '${categorie}', ${elementIndex});" style="background-color: ${disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6'}; color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Alimentare Priză: ${disp.stare}</button></div>`;
    } else {
        contentHtml = `<div style="margin-bottom: 20px; text-align:center;"><button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); deschideMeniuDispozitive('none', '${categorie}', ${elementIndex});" style="background-color: ${['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare) ? 'var(--success-color)' : '#95a5a6'}; color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Schimbă Stare (Curent: ${disp.stare})</button></div>`;
        if (categorie === 'camereVideo') contentHtml += `<div style="background: #111; border-radius: 8px; height: 200px; display:flex; align-items:center; justify-content:center; color:white; position:relative; margin-bottom: 15px; overflow: hidden;">${disp.stare === 'LIVE' ? '<span style="position:absolute; top:10px; left:10px; color:red; font-weight:bold; font-size:0.9em;">🔴 LIVE REC</span><img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80" style="opacity: 0.6; width: 100%; height: 100%; object-fit: cover;">' : '<span style="opacity:0.5;">[ Camera Feed Offline ]</span>'}</div>`;
        if (['becuri', 'audio', 'jaluzele', 'luminiRGB'].includes(categorie)) {
            const isOff = disp.stare === 'Oprit' || disp.stare === 'Închis';
            contentHtml += `<div class="slider-container ${isOff ? 'disabled-controls' : ''}" style="margin-top: 20px;"><label>Intensitate / Volum: <span id="val-${categorie}-${elementIndex}">${disp.valoare}</span>%</label><input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} oninput="subDispozitive['${categorie}'][${elementIndex}].valoare = this.value; document.getElementById('val-${categorie}-${elementIndex}').innerText = this.value;"></div>`;
        }
    }
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function deschidePopupLuminiAprinse() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "<i class='ph-fill ph-lightbulb'></i> Lumini Active în Casă";
    let html = `<div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 5px 0;">`;
    let areLumini = false;
    (subDispozitive.becuri || []).forEach((bec, idx) => {
        if (bec.stare === "Pornit") {
            areLumini = true;
            html += `<div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px; border-radius: 8px; cursor: pointer;" onclick="deschideMeniuDispozitive('none', 'becuri', ${idx});"><div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5em; color: var(--warning-color);"><i class="ph-fill ph-lightbulb"></i></span><div><strong style="display:block;">${bec.nume}</strong><span style="font-size: 0.85em; opacity: 0.6;">${bec.camera} • ${bec.valoare}%</span></div></div><button onclick="toggleStareDispozitiv('becuri', ${idx}, event); deschidePopupLuminiAprinse();" style="background: var(--error-color); color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85em;">Stinge</button></div>`;
        }
    });
    html += `</div>`;
    if (!areLumini) html = `<div style="text-align:center; padding: 20px; opacity:0.6;">Toate luminile au fost stinse!</div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function deschidePopupAudioPornit() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "<i class='ph-fill ph-speaker-high'></i> Sisteme Audio Active";
    let html = `<div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 5px 0;">`;
    let areAudio = false;
    (subDispozitive.audio || []).forEach((boxa, idx) => {
        if (boxa.stare === "Pornit") {
            areAudio = true;
            html += `<div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px; border-radius: 8px; cursor: pointer;" onclick="deschideMeniuDispozitive('none', 'audio', ${idx});"><div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5em; color: var(--accent-color);"><i class="ph-fill ph-speaker-high"></i></span><div><strong style="display:block;">${boxa.nume}</strong><span style="font-size: 0.85em; opacity: 0.6;">${boxa.camera} • Volum: ${boxa.valoare}%</span></div></div><button onclick="toggleStareDispozitiv('audio', ${idx}, event); deschidePopupAudioPornit(); event.stopPropagation();" style="background: var(--error-color); color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85em;">Oprește</button></div>`;
        }
    });
    html += `</div>`;
    if (!areAudio) html = `<div style="text-align:center; padding: 20px; opacity:0.6;">Toate sistemele audio au fost oprite!</div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function deschidePopupCreareScena() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continut = document.getElementById('modal-continut');
    if(!modal || !continut) return;
    titlu.innerHTML = "🎭 Creare Scenă Nouă";
    continut.innerHTML = `<div class="form-row"><label>Numele Scenei:</label><input type="text" id="custom-scene-name" class="form-input" placeholder="ex: Party Mode, Relaxare..."></div><div class="form-row"><label>Emoji sugestiv:</label><select id="custom-scene-emoji" class="form-input"><option value="🎉">🎉 Party / Distracție</option><option value="🍃">🍃 Relaxare / Fresh</option><option value="💻">💻 Birou / Work</option></select></div><div class="form-row"><label>Descriere scurtă:</label><input type="text" id="custom-scene-desc" class="form-input" placeholder="ex: Oprește toate electronicele din casă."></div><div class="form-row"><label>Șablon comportament:</label><select id="custom-scene-template" class="form-input"><option value="away">Mod Plecat (Închide tot + Alarme active)</option><option value="night">Mod Noapte (Ambient întunecat + uși încuiate)</option><option value="morning">Mod Dimineață (Deschide ferestre/jaluzele)</option></select></div><button onclick="salveazaScenaCustomNoua()" style="background: var(--success-color); color: white; width: 100%; border: none; padding: 12px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 10px; font-size: 1em;">💾 Creează Scena</button>`;
    modal.classList.add('active');
}

function deschideModalAutomatizare() {
    const modal = document.getElementById('popup-automatizare');
    if(!modal) return;
    const selectTrigger = document.getElementById('auto-trigger-dev');
    const selectAction = document.getElementById('auto-action-dev');
    let optionsHTML = '';
    Object.keys(subDispozitive).forEach(cat => { (subDispozitive[cat] || []).forEach((disp, idx) => { optionsHTML += `<option value="${cat}_${idx}">${disp.nume} (${disp.camera})</option>`; }); });
    selectTrigger.innerHTML = optionsHTML;
    selectAction.innerHTML = optionsHTML;
    modal.classList.add('active');
}

function deschidePopupToateNotificarile() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "🔔 Toate Notificările Casei";
    const toateNotificarile = genereazaListaNotificari();
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left;">`;
    toateNotificarile.forEach(notif => { html += `<div class="notification-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);"><span>${notif.text}</span></div>`; });
    html += `</div><div style="margin-top: 10px;"><button onclick="localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); inchidePopup();" style="background-color: transparent; border: 2px solid var(--error-color); color: var(--error-color); width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;"><i class="ph-bold ph-trash"></i> Șterge Istoric Mișcare</button></div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function deschidePopupIstoric(tip) {
    tipIstoricCurent = tip;
    perioadaIstoricaCurenta = '7z'; 
    const modal = document.getElementById('popup-istoric');
    const titlu = document.getElementById('istoric-titlu');
    if (titlu) titlu.innerHTML = tip === 'energie' ? '<i class="ph-bold ph-lightning"></i> Istoric Consum Energie' : '<i class="ph-bold ph-thermometer"></i> Istoric Climă Medie';
    modal.classList.add('active');
    genereazaTabelIstoric();
}

function schimbaPerioadaIstoric(perioada) {
    perioadaIstoricaCurenta = perioada;
    document.querySelectorAll('.time-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-period-${perioada}`).classList.add('active');
    genereazaTabelIstoric();
}

function genereazaTabelIstoric() {
    const container = document.getElementById('istoric-grafic-content');
    if (!container) return;
    let intervale = perioadaIstoricaCurenta === '7z' ? ['Ieri', 'Acum 2 zile', 'Acum 3 zile'] : ['Interval lung 1', 'Interval lung 2'];
    let html = `<table style="width: 100%; border-collapse: collapse; font-size: 0.95em; text-align: left;"><thead><tr style="border-bottom: 2px solid rgba(0,0,0,0.1); font-weight: bold;"><th style="padding: 10px 5px;">Interval Timp</th><th style="padding: 10px 5px; text-align: right;">Total</th></tr></thead><tbody>`;
    intervale.forEach((perioada) => { html += `<tr style="border-bottom: 1px solid rgba(0,0,0,0.05);"><td style="padding: 10px 5px;">${perioada}</td><td style="padding: 10px 5px; text-align: right; color: var(--accent-color); font-weight: bold;">Generat automat</td></tr>`; });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if (modal) modal.classList.remove('active');
}

function inchidePopupIstoric() {
    const modal = document.getElementById('popup-istoric');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const m1 = document.getElementById('popup-dispozitive');
    const m2 = document.getElementById('popup-automatizare');
    const m3 = document.getElementById('popup-istoric');
    if (event.target === m1) m1.classList.remove('active');
    if (event.target === m2) m2.classList.remove('active');
    if (event.target === m3) m3.classList.remove('active');
}