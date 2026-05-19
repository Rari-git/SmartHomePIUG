let dashTipCurent = 'energie';
let dashPerioadaCurenta = '7z';

function reincarcaInterfata() {
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
    if(document.getElementById('automations-list')) { randareAutomatizari(); randareSabloane(); }
    if(document.getElementById('dashboard-grafic-content')) randareGraficDashboard();
    if(document.getElementById('logs-container')) randareStatisticiLogs();
}

function schimbaTipGraficDashboard(tip) {
    dashTipCurent = tip;
    document.getElementById('btn-tip-energie').classList.toggle('active', tip === 'energie');
    document.getElementById('btn-tip-clima').classList.toggle('active', tip === 'clima');
    randareGraficDashboard();
}

function schimbaPerioadaDashboard(perioada) {
    dashPerioadaCurenta = perioada;
    ['1z', '7z', '30z', '6l', '1an'].forEach(p => {
        const btn = document.getElementById(`btn-dash-${p}`);
        if(btn) btn.classList.toggle('active', p === perioada);
    });
    randareGraficDashboard();
}

function randareGraficDashboard() {
    const container = document.getElementById('dashboard-grafic-content');
    if (!container) return;
    
    let date = [];
    if (dashTipCurent === 'energie') {
        if (dashPerioadaCurenta === '1z') {
            date = [{e: '00:00 - 06:00', v: 1.2}, {e: '06:00 - 12:00', v: 4.5}, {e: '12:00 - 18:00', v: 3.8}, {e: '18:00 - 00:00', v: 6.2}];
        } else if (dashPerioadaCurenta === '7z') {
            date = [{e: 'Luni', v: 14}, {e: 'Marți', v: 15}, {e: 'Miercuri', v: 13}, {e: 'Joi', v: 17}, {e: 'Vineri', v: 16}, {e: 'Sâmbătă', v: 22}, {e: 'Duminică', v: 20}];
        } else if (dashPerioadaCurenta === '30z') {
            date = [{e: 'Săpt. 1', v: 110}, {e: 'Săpt. 2', v: 125}, {e: 'Săpt. 3', v: 105}, {e: 'Săpt. 4', v: 140}];
        } else if (dashPerioadaCurenta === '6l') {
            date = [{e: 'Decembrie', v: 480}, {e: 'Ianuarie', v: 520}, {e: 'Februarie', v: 460}, {e: 'Martie', v: 390}, {e: 'Aprilie', v: 310}, {e: 'Mai', v: 240}];
        } else if (dashPerioadaCurenta === '1an') {
            date = [{e: 'Trim. 1', v: 1460}, {e: 'Trim. 2', v: 980}, {e: 'Trim. 3', v: 820}, {e: 'Trim. 4', v: 1240}];
        }
        
        let maxVal = Math.max(...date.map(d => d.v), 1);
        let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';
        date.forEach(p => {
            let procent = (p.v / maxVal) * 100;
            html += `<div style="display: flex; align-items: center; gap: 15px;"><div style="width: 110px; font-weight: 600; font-size: 0.9em; opacity: 0.8;">${p.e}</div><div style="flex: 1; background: rgba(0,0,0,0.05); height: 16px; border-radius: 8px; overflow: hidden;"><div style="background: var(--accent-color); width: ${procent}%; height: 100%; border-radius: 8px; transition: width 0.3s;"></div></div><div style="width: 80px; text-align: right; font-weight: 700; color: var(--accent-color);">${p.v} kWh</div></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        
    } else {
        if (dashPerioadaCurenta === '1z') {
            date = [{e: '00:00 - 06:00', t: 19, u: 50}, {e: '06:00 - 12:00', t: 22, u: 45}, {e: '12:00 - 18:00', t: 24, u: 40}, {e: '18:00 - 00:00', t: 21, u: 48}];
        } else if (dashPerioadaCurenta === '7z') {
            date = [{e: 'Luni', t: 21.5, u: 44}, {e: 'Marți', t: 22, u: 46}, {e: 'Miercuri', t: 20.8, u: 50}, {e: 'Joi', t: 23.4, u: 42}, {e: 'Vineri', t: 22, u: 45}, {e: 'Sâmbătă', t: 24.1, u: 40}, {e: 'Duminică', t: 22.6, u: 47}];
        } else if (dashPerioadaCurenta === '30z') {
            date = [{e: 'Săpt. 1', t: 21.2, u: 45}, {e: 'Săpt. 2', t: 22.1, u: 44}, {e: 'Săpt. 3', t: 21.8, u: 48}, {e: 'Săpt. 4', t: 22.5, u: 42}];
        } else if (dashPerioadaCurenta === '6l') {
            date = [{e: 'Decembrie', t: 18.5, u: 55}, {e: 'Ianuarie', t: 19, u: 53}, {e: 'Februarie', t: 19.5, u: 50}, {e: 'Martie', t: 21.2, u: 46}, {e: 'Aprilie', t: 22.8, u: 44}, {e: 'Mai', t: 24.1, u: 42}];
        } else if (dashPerioadaCurenta === '1an') {
            date = [{e: 'Trim. 1', t: 19.1, u: 51}, {e: 'Trim. 2', t: 22.4, u: 44}, {e: 'Trim. 3', t: 25.2, u: 41}, {e: 'Trim. 4', t: 20.5, u: 49}];
        }
        
        let maxT = Math.max(...date.map(d => d.t), 1);
        let maxU = Math.max(...date.map(d => d.u), 1);
        let html = '<div style="display: flex; flex-direction: column; gap: 16px;">';
        date.forEach(p => {
            let prT = (p.t / maxT) * 100;
            let prU = (p.u / maxU) * 100;
            html += `
                <div style="display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid rgba(0,0,0,0.03); padding-bottom: 8px;">
                    <div style="font-weight: 700; font-size: 0.9em; opacity: 0.9; margin-bottom: 2px;">${p.e}</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 0.8em; font-weight: bold; width: 45px; opacity: 0.7;">Temp:</span>
                        <div style="flex: 1; background: rgba(0,0,0,0.04); height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="background: var(--warning-color); width: ${prT}%; height: 100%; border-radius: 5px;"></div>
                        </div>
                        <span style="font-size: 0.85em; font-weight: bold; width: 55px; color: var(--warning-color); text-align: right;">${p.t}°C</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 0.8em; font-weight: bold; width: 45px; opacity: 0.7;">Umid:</span>
                        <div style="flex: 1; background: rgba(0,0,0,0.04); height: 10px; border-radius: 5px; overflow: hidden;">
                            <div style="background: #3498db; width: ${prU}%; height: 100%; border-radius: 5px;"></div>
                        </div>
                        <span style="font-size: 0.85em; font-weight: bold; width: 55px; color: #3498db; text-align: right;">${p.u}%</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }
}

function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    
    let accHtml = '';
    favAcc.forEach(idSalvat => {
        const [cat, idx] = idSalvat.split('_');
        if (subDispozitive[cat] && subDispozitive[cat][idx]) {
            accHtml += construiesteCardHTML(subDispozitive[cat][idx], cat, idx, true);
        }
    });
    const accContainer = document.getElementById('fav-accessories-container');
    if (accContainer) accContainer.innerHTML = accHtml || '<p style="opacity:0.5;">Niciun accesoriu favorit.</p>';

    let sceneHtml = '';
    favScenes.forEach(idScena => {
        const scena = scenesDB.find(s => s.id === idScena);
        if (scena) sceneHtml += construiesteScenaHTML(scena, true);
    });
    const sceneContainer = document.getElementById('fav-scenes-container');
    if (sceneContainer) sceneContainer.innerHTML = sceneHtml || '<p style="opacity:0.5;">Nicio scenă favorită.</p>';

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
            html += `<div class="suggestion-card" style="border-top: 5px solid ${sug.culoare}; min-width: 250px; flex-shrink: 0; box-sizing: border-box; background: var(--card-bg); padding: 15px; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between;"><div style="font-size: 2em; margin-bottom: 10px; line-height: 1;">${sug.icon}</div><strong style="font-size: 1.1em; color: var(--text-color);">${sug.nume}</strong><p style="font-size: 0.85em; opacity: 0.8; margin: 10px 0; flex: 1; line-height: 1.4;">${sug.descriereScurta}</p><button class="add-sug-btn" onclick="adaugaSugestie('${sug.idSugestie}')" style="width:100%; background: var(--accent-color); color:white; border:none; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer;">+ Adaugă Regula</button></div>`;
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
    html += `<div class="hk-card card-add-new" onclick="deschideModalAutomatizare()" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:160px; border: 2px dashed var(--accent-color); background:transparent;"><div class="plus-icon" style="font-size:2em; color:var(--accent-color);"><i class="ph-bold ph-plus"></i></div><div style="font-size: 1.1em; font-weight: bold; color:var(--accent-color); margin-top:5px;">Regulă Nouă</div><div style="font-size: 0.85em; opacity:0.7; margin-top: 5px;">Configurare complet manuală</div></div>`;
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
    container.innerHTML = logs.map(log => `<div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border-left: 4px solid var(--accent-color); margin-bottom:8px;"><span style="font-weight: 500; font-size: 0.95em;">${log.text}</span><span style="font-size: 0.8em; opacity: 0.6; font-weight: bold; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; margin-left: 10px;"><i class="ph-bold ph-clock"></i> ${log.ora}</span></div>`).join('');
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
    
    if (subDispozitive.senzoriContact) subDispozitive.senzoriContact.forEach((d, idx) => { if(d.stare === "Deschis") notificari.push({ id: `notif_fereastra_${idx}`, text: `🚪 Fereastră deschisă în ${d.camera}`, actiune: `deschideMeniuDispozitive('none', 'senzoriContact', ${idx})` }); });
    
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
    
    const esteDezarmat = localStorage.getItem('alarmaDezactivata') === 'true';
    sec.innerText = esteDezarmat ? "Dezactivată" : "Armată";

    const txtSecuritateAlarma = document.getElementById('txt-status-alarma');
    if(txtSecuritateAlarma) {
        txtSecuritateAlarma.innerText = esteDezarmat ? "Sistem Dezarmat" : "Sistem Armat";
        txtSecuritateAlarma.style.color = esteDezarmat ? "var(--error-color)" : "var(--success-color)";
    }
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
    const continental = document.getElementById('modal-continut');
    if(!modal || !continental) return;
    titlu.innerHTML = "🎭 Creare Scenă Nouă";
    continental.innerHTML = `<div class="form-row"><label>Numele Scenei:</label><input type="text" id="custom-scene-name" class="form-input" placeholder="ex: Party Mode, Relaxare..."></div><div class="form-row"><label>Emoji sugestiv:</label><select id="custom-scene-emoji" class="form-input"><option value="🎉">🎉 Party / Distracție</option><option value="🍃">🍃 Relaxare / Fresh</option><option value="💻">💻 Birou / Work</option></select></div><div class="form-row"><label>Descriere scurtă:</label><input type="text" id="custom-scene-desc" class="form-input" placeholder="ex: Oprește toate electronicele din casă."></div><div class="form-row"><label>Șablon comportament:</label><select id="custom-scene-template" class="form-input"><option value="away">Mod Plecat (Închide tot + Alarme active)</option><option value="night">Mod Noapte (Ambient întunecat + uși încuiate)</option><option value="morning">Mod Dimineață (Deschide ferestre/jaluzele)</option></select></div><button onclick="salveazaScenaCustomNoua()" style="background: var(--success-color); color: white; width: 100%; border: none; padding: 12px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 10px; font-size: 1em;">💾 Creează Scena</button>`;
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
    
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left; display: flex; flex-direction: column; gap: 8px;">`;
    
    toateNotificarile.forEach(notif => { 
        if (notif.id === "notif_lumini") {
            html += `<div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer; padding: 12px; background: var(--bg-primary); border-radius: 8px;"><span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pt detalii)</span></span></div>`;
        } else if (notif.id === "notif_audio") {
            html += `<div class="notification-item" onclick="deschidePopupAudioPornit()" style="cursor: pointer; padding: 12px; background: var(--bg-primary); border-radius: 8px;"><span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pt detalii)</span></span></div>`;
        } else if (notif.actiune) {
            html += `<div class="notification-item" onclick="${notif.actiune}" style="cursor: pointer; transition: color 0.2s; padding: 12px; background: var(--bg-primary); border-radius: 8px;" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color=''"><span>${notif.text}</span></div>`;
        } else {
            html += `<div class="notification-item" style="padding: 12px; background: var(--bg-primary); border-radius: 8px;"><span>${notif.text}</span></div>`;
        }
    });
    
    if (toateNotificarile.length === 0) {
        html += `<p style="opacity: 0.5; text-align: center; margin: 20px 0;">Nicio notificare activă.</p>`;
    }
    
    html += `</div><div style="margin-top: 10px;"><button onclick="localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); inchidePopup();" style="background-color: transparent; border: 2px solid var(--error-color); color: var(--error-color); width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;"><i class="ph-bold ph-trash"></i> Șterge Istoric Mișcare</button></div>`;
    
    continental.innerHTML = html;
    modal.classList.add('active');
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
    const m4 = document.getElementById('popup-pin-alarma');
    if (event.target === m1) m1.classList.remove('active');
    if (event.target === m2) m2.classList.remove('active');
    if (event.target === m3) m3.classList.remove('active');
    if (event.target === m4) m4.classList.remove('active');
}

function actualizeazaCardInDOM(cat, index) {
    const idUnic = `${cat}_${index}`;
    const disp = subDispozitive[cat][index];
    if (!disp) return;

    // Verificăm dacă e considerat "activ" pentru a colora fundalul
    const isActive = ['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare);
    
    // 1. Caută TOATE cardurile cu acest ID pe ecran și modifică doar atributele lor
    const carduri = document.querySelectorAll(`.hk-card[data-id="${idUnic}"]`);
    carduri.forEach(card => {
        if (isActive) card.classList.add('is-active');
        else card.classList.remove('is-active');
        
        // Modificăm strict textul stării (fără a recrea iconițele SVG)
        const stateEl = card.querySelector('.hk-state');
        if (stateEl) {
            stateEl.innerText = `${disp.stare} ${disp.camera ? `• ${disp.camera}` : ''}`;
        }
    });

    // 2. Actualizează widget-urile globale silențios (Consumul de Energie de sus etc.)
    actualizeazaStatusGlobal();

    // 3. Actualizează alertele doar dacă ne aflăm pe pagina Home
    if (document.getElementById('notifications-container')) {
        afiseazaNotificariHome();
    }

    // 4. Actualizare vizuală "live" în interiorul Meniului Popup (fără a-l închide)
    const popup = document.getElementById('popup-dispozitive');
    if (popup && popup.classList.contains('active')) {
        const btn = popup.querySelector('.sensor-action-btn');
        if (btn && btn.getAttribute('onclick').includes(`'${cat}', ${index}`)) {
            btn.style.backgroundColor = isActive ? 'var(--success-color)' : '#95a5a6';
            if (cat === 'prize') {
                btn.innerText = `Alimentare Priză: ${disp.stare}`;
                const wDisplay = popup.querySelector('div[style*="font-size: 3.5em"]');
                if(wDisplay) wDisplay.innerText = `${calculeazaConsumPriza(disp)} W`;
            } else {
                btn.innerText = `Schimbă Stare (Curent: ${disp.stare})`;
            }
        }
    }
}