import { iconDraperie, iconFereastra, sabloaneRecomandate } from './data.js';
import { subDispozitive, scenesDB, calculeazaConsumPriza, calculeazaConsumDispozitiv, salveazaStarea, adaugaInLog, actualizeazaMediiClimat, inchidePopupPin, getTempUnit, convertTemp } from './app.js';

export let dashTipCurent = 'energie';
export let dashPerioadaCurenta = '7z';
export let sortableInstante = { acc: null, scene: null };

// Funcție pentru formatarea dinamică a temperaturii în funcție de setarea utilizatorului
function formateazaTemperatura(valoareCelsius) {
    const unitate = localStorage.getItem('tempUnit') || 'C'; // presupunând că folosești 'C' și 'F'
    if (unitate === 'F') {
        const fahrenheit = Math.round((valoareCelsius * 9/5) + 32);
        return `${fahrenheit}°F`;
    }
    return `${valoareCelsius}°C`;
}

// Helper function for smooth modal fade-out
function applyFadeOutAndClose(modal) {
    if (!modal || !modal.classList.contains('active')) {
        return;
    }

    const transitionDuration = 350; // ms, pentru a corespunde cu 0.35s din animația de fade-in

    // Forțăm proprietățile de tranziție prin stiluri inline pentru a garanta efectul de fade-out
    modal.style.transition = `opacity ${transitionDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    modal.style.opacity = '0';

    let isCleanedUp = false;
    const cleanup = () => {
        if (isCleanedUp) return;
        isCleanedUp = true;

        modal.classList.remove('active');
        // Resetăm stilurile inline pentru a nu interfera cu animațiile de deschidere sau alte reguli CSS
        modal.style.transition = '';
        modal.style.opacity = '';
        modal.removeEventListener('transitionend', cleanup);
    };

    // Ascultăm evenimentul de finalizare a tranziției pentru a închide modalul precis
    modal.addEventListener('transitionend', cleanup, { once: true });

    // Folosim un fallback (timeout) pentru a ne asigura că modalul se închide întotdeauna
    setTimeout(cleanup, transitionDuration + 50);
}

function reincarcaInterfata() {
    actualizeazaStatusGlobal();
    if (document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if (document.getElementById('all-scenes-container')) randareScene();
    if (document.getElementById('all-accessories-container')) randareAccesorii();
    if (document.getElementById('security-devices-container')) randareSecuritate();
    if (document.getElementById('automations-list')) { randareAutomatizari(); randareSabloane(); }
    if (document.getElementById('dashboard-grafic-content')) randareGraficDashboard();
    if (document.getElementById('logs-container')) randareStatisticiLogs();
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
        if (btn) btn.classList.toggle('active', p === perioada);
    });
    randareGraficDashboard();
}

function randareGraficDashboard() {
    const container = document.getElementById('dashboard-grafic-content');
    if (!container) return;

    let date = [];
    if (dashTipCurent === 'energie') {
        if (dashPerioadaCurenta === '1z') {
            date = [{ e: '00:00 - 06:00', v: 1.2 }, { e: '06:00 - 12:00', v: 4.5 }, { e: '12:00 - 18:00', v: 3.8 }, { e: '18:00 - 00:00', v: 6.2 }];
        } else if (dashPerioadaCurenta === '7z') {
            date = [{ e: 'Luni', v: 14 }, { e: 'Marți', v: 15 }, { e: 'Miercuri', v: 13 }, { e: 'Joi', v: 17 }, { e: 'Vineri', v: 16 }, { e: 'Sâmbătă', v: 22 }, { e: 'Duminică', v: 20 }];
        } else if (dashPerioadaCurenta === '30z') {
            date = [{ e: 'Săpt. 1', v: 110 }, { e: 'Săpt. 2', v: 125 }, { e: 'Săpt. 3', v: 105 }, { e: 'Săpt. 4', v: 140 }];
        } else if (dashPerioadaCurenta === '6l') {
            date = [{ e: 'Decembrie', v: 480 }, { e: 'Ianuarie', v: 520 }, { e: 'Februarie', v: 460 }, { e: 'Martie', v: 390 }, { e: 'Aprilie', v: 310 }, { e: 'Mai', v: 240 }];
        } else if (dashPerioadaCurenta === '1an') {
            date = [{ e: 'Trim. 1', v: 1460 }, { e: 'Trim. 2', v: 980 }, { e: 'Trim. 3', v: 820 }, { e: 'Trim. 4', v: 1240 }];
        }

        let maxVal = Math.max(...date.map(d => d.v), 1);
        let html = '<div class="chart-container">';
        date.forEach(p => {
            let procent = (p.v / maxVal) * 100;
            html += `<div class="chart-row"><div class="chart-label">${p.e}</div><div class="chart-track"><div class="anim-bar chart-bar energy" data-width="${procent}%" style="width: 0%;"></div></div><div class="chart-val energy">${p.v} kWh</div></div>`;
        });
        html += '</div>';
        container.innerHTML = html;

        setTimeout(() => {
            container.querySelectorAll('.anim-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 50);

    } else {
        if (dashPerioadaCurenta === '1z') {
            date = [{ e: '00:00 - 06:00', t: 19, u: 50 }, { e: '06:00 - 12:00', t: 22, u: 45 }, { e: '12:00 - 18:00', t: 24, u: 40 }, { e: '18:00 - 00:00', t: 21, u: 48 }];
        } else if (dashPerioadaCurenta === '7z') {
            date = [{ e: 'Luni', t: 21.5, u: 44 }, { e: 'Marți', t: 22, u: 46 }, { e: 'Miercuri', t: 20.8, u: 50 }, { e: 'Joi', t: 23.4, u: 42 }, { e: 'Vineri', t: 22, u: 45 }, { e: 'Sâmbătă', t: 24.1, u: 40 }, { e: 'Duminică', t: 22.6, u: 47 }];
        } else if (dashPerioadaCurenta === '30z') {
            date = [{ e: 'Săpt. 1', t: 21.2, u: 45 }, { e: 'Săpt. 2', t: 22.1, u: 44 }, { e: 'Săpt. 3', t: 21.8, u: 48 }, { e: 'Săpt. 4', t: 22.5, u: 42 }];
        } else if (dashPerioadaCurenta === '6l') {
            date = [{ e: 'Decembrie', t: 18.5, u: 55 }, { e: 'Ianuarie', t: 19, u: 53 }, { e: 'Februarie', t: 19.5, u: 50 }, { e: 'Martie', t: 21.2, u: 46 }, { e: 'Aprilie', t: 22.8, u: 44 }, { e: 'Mai', t: 24.1, u: 42 }];
        } else if (dashPerioadaCurenta === '1an') {
            date = [{ e: 'Trim. 1', t: 19.1, u: 51 }, { e: 'Trim. 2', t: 22.4, u: 44 }, { e: 'Trim. 3', t: 25.2, u: 41 }, { e: 'Trim. 4', t: 20.5, u: 49 }];
        }

        let maxT = Math.max(...date.map(d => d.t), 1);
        let maxU = Math.max(...date.map(d => d.u), 1);
        let html = '<div class="chart-container-climate">';
        date.forEach(p => {
            let prT = (p.t / maxT) * 100;
            let prU = (p.u / maxU) * 100;
            html += `
                <div class="chart-climate-group">
                    <div class="chart-climate-title">${p.e}</div>
                    <div class="chart-row small-gap">
                        <span class="chart-sub-label">Temp:</span>
                        <div class="chart-track small-track">
                            <div class="anim-bar chart-bar temp" data-width="${prT}%" style="width: 0%;"></div>
                        </div>
                        <span class="chart-val temp">${convertTemp(p.t)}°${getTempUnit()}</span>
                    </div>
                    <div class="chart-row small-gap">
                        <span class="chart-sub-label">Umid:</span>
                        <div class="chart-track small-track">
                            <div class="anim-bar chart-bar umid" data-width="${prU}%" style="width: 0%;"></div>
                        </div>
                        <span class="chart-val umid">${p.u}%</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        setTimeout(() => {
            container.querySelectorAll('.anim-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 50);
    }
}

function randareCeleMaiFolosite() {
    const mostUsedContainer = document.getElementById('most-used-accessories-container');
    if (!mostUsedContainer) return;

    const usage = JSON.parse(localStorage.getItem('deviceUsage')) || {};
    let mostUsedHtml = '';
    const sortedDevices = Object.keys(usage).sort((a, b) => usage[b] - usage[a]).slice(0, 4);

    if (sortedDevices.length > 0) {
        sortedDevices.forEach(deviceId => {
            const [cat, idx] = deviceId.split('_');
            if (subDispozitive[cat] && subDispozitive[cat][idx]) {
                mostUsedHtml += construiesteCardHTML(subDispozitive[cat][idx], cat, idx, true);
            }
        });
    }

    mostUsedContainer.innerHTML = mostUsedHtml || '<div style="width: 100%; grid-column: 1 / -1;"><div style="background: var(--card-bg); padding: 20px; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); box-shadow: var(--shadow-soft); opacity: 0.9;"><span style="font-size: 0.95em; font-weight: 500; color: var(--text-color);">Fără date de utilizare încă. Acționează dispozitive pentru a le vedea aici.</span></div></div>';
}
function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];

    randareCeleMaiFolosite();

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
                if (sortableInstante.acc) sortableInstante.acc.destroy();
                sortableInstante.acc = new Sortable(accContainer, {
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
                if (sortableInstante.scene) sortableInstante.scene.destroy();
                sortableInstante.scene = new Sortable(sceneContainer, {
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
            if (!camereMap[disp.camera]) camereMap[disp.camera] = [];
            camereMap[disp.camera].push({ disp, cat, idx });
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
            html += `<div class="suggestion-card" style="border-top: 5px solid ${sug.culoare};"><div class="sug-icon">${sug.icon}</div><strong class="sug-name">${sug.nume}</strong><p class="sug-desc">${sug.descriereScurta}</p><button class="sug-btn" data-action="add-suggestion" data-sugid="${sug.idSugestie}">+ Adaugă Regula</button></div>`;
            counter++;
        }
    });
    container.innerHTML = counter === 0 ? `<div class="popup-empty-text">Ai activat toate șabloanele recomandate!</div>` : html;
}

function randareAutomatizari() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let html = '';
    rules.forEach(rule => {
        html += `<div class="hk-card auto-card" style="border-left: 5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}; opacity: ${rule.active ? '1' : '0.5'};"><div class="auto-header"><div class="auto-title" style="color: ${rule.active ? 'var(--text-color)' : '#95a5a6'};">${rule.tipTrigger === 'timp' ? '<i class="ph-bold ph-clock"></i>' : '<i class="ph-bold ph-gear"></i>'} Regula Activă</div><div class="auto-controls"><label class="toggle-switch"><input type="checkbox" data-action="toggle-automation" data-autoid="${rule.id}" ${rule.active ? 'checked' : ''}><span class="slider"></span></label><button data-action="delete-automation" data-autoid="${rule.id}" class="auto-delete-btn"><i class="ph-bold ph-trash"></i></button></div></div><div class="auto-desc">${rule.descriere}</div></div>`;
    });
    html += `<div class="hk-card card-add-new" onclick="deschideModalAutomatizare()"><div class="plus-icon"><i class="ph-bold ph-plus"></i></div><div class="add-title">Regulă Nouă</div><div class="add-desc">Configurare complet manuală</div></div>`;
    container.innerHTML = html;
}

function randareStatisticiLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    const logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    if (logs.length === 0) {
        container.innerHTML = `<div class="popup-empty-text">Niciun eveniment înregistrat încă.</div>`;
        return;
    }
    container.innerHTML = logs.map(log => `<div class="log-item"><span class="log-text">${log.text}</span><span class="log-time"><i class="ph-bold ph-clock"></i> ${log.ora}</span></div>`).join('');
}

function construiesteCardHTML(disp, cat, idx, isFav) {
    const isActive = ['Pornit', 'Curăță', 'Deblocat', 'Activ', 'Deschis', 'LIVE', 'Auto', 'Boost', 'Pericol', 'FUM DETECTAT!', 'APĂ DETECTATĂ!'].includes(disp.stare);
    const idUnic = `${cat}_${idx}`;
    const animDelay = Math.min(idx * 0.04, 0.6);
    
    // DETECTARE DINAMICĂ CLASĂ DE ALARMĂ PENTRU SENZORII DE RISC
    let clasaAlarma = '';
    if (disp.stare === 'Pericol' || disp.stare === 'FUM DETECTAT!') {
        clasaAlarma = 'alarm-fire';
    } else if (disp.stare === 'APĂ DETECTATĂ!') {
        clasaAlarma = 'alarm-water';
    }

    // --- AICI ESTE NOUA LOGICĂ DE TEMPERATURĂ ---
    let afisareStare = disp.stare;
    // Verificăm dacă dispozitivul ține de climă și dacă starea conține un număr
    if (cat && (cat.toLowerCase().includes('clima') || cat.toLowerCase().includes('termostat') || cat.toLowerCase().includes('senzor')) && !isNaN(parseFloat(disp.stare))) {
        afisareStare = formateazaTemperatura(parseFloat(disp.stare));
    }

    return `<div class="hk-card ${isActive ? 'is-active' : ''} ${clasaAlarma}" data-id="${idUnic}" style="animation-delay: ${animDelay}s;" data-action="toggle-device" data-cat="${cat}" data-idx="${idx}"><div class="hk-controls"><button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" data-action="toggle-favorite" data-favid="${idUnic}" data-favtype="acc"><i class="ph-fill ph-star"></i></button><button class="hk-btn" data-action="open-device-menu" data-cat="${cat}" data-idx="${idx}"><i class="ph-bold ph-gear"></i></button></div><div class="hk-icon">${disp.icon}</div><div><div class="hk-name">${disp.nume}</div><div class="hk-state">${afisareStare} ${disp.camera ? `• ${disp.camera}` : ''}</div></div></div>`;
}

function construiesteScenaHTML(scena, isFav) {
    const isActive = localStorage.getItem('activeScene') === scena.id;
    const esteCustom = !scena.id.startsWith('s_');

    // Extragem un index din string-ul scenei pentru a genera progresia animației
    const animDelay = (scena.id.charCodeAt(scena.id.length - 1) % 10) * 0.04;
    return `<div class="hk-card ${isActive ? 'is-active' : ''}" data-id="${scena.id}" style="height: 90px; animation-delay: ${animDelay}s;" data-action="execute-scene" data-sceneid="${scena.id}"><div class="hk-controls">${esteCustom ? `<button class="hk-btn" data-action="delete-scene" data-sceneid="${scena.id}" style="color: var(--error-color); margin-right: 2px;"><i class="ph-bold ph-trash"></i></button>` : ''}<button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" data-action="toggle-favorite" data-favid="${scena.id}" data-favtype="scene"><i class="ph-fill ph-star"></i></button></div><div class="hk-name scene-name-title">${scena.nume}</div><div class="hk-state scene-desc-text">${scena.descriere}</div></div>`;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    const toateNotificarile = genereazaListaNotificari();
    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">Toate sistemele sunt în standby.</p>`;
        return;
    }

    let html = "";
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        const notif = toateNotificarile[i];
        if (notif.id === "notif_lumini") html += `<div class="notification-item" data-action="open-popup-lumini"><span>${notif.text} <span class="notif-hint">(Apasă pt detalii)</span></span></div>`;
        else if (notif.id === "notif_audio") html += `<div class="notification-item" data-action="open-popup-audio"><span>${notif.text} <span class="notif-hint">(Apasă pt detalii)</span></span></div>`;
        else if (notif.actiune) html += `<div class="notification-item hover-accent" onclick="${notif.actiune}"><span>${notif.text}</span></div>`;
        else html += `<div class="notification-item"><span>${notif.text}</span></div>`;
    }
    if (toateNotificarile.length > 3) html += `<button class="see-more-btn" data-action="open-popup-all-notifs">Vezi mai multe &gt;</button>`;

    container.innerHTML = html;
}

function genereazaListaNotificari() {
    let notificari = [];

    // Luminile
    const becuriAprinse = (subDispozitive.becuri || []).filter(d => d.stare === "Pornit");
    const rgbAprinse = (subDispozitive.luminiRGB || []).filter(d => d.stare === "Pornit");
    const totalLumini = becuriAprinse.length + rgbAprinse.length;
    if (totalLumini > 0) notificari.push({ id: "notif_lumini", text: `<i class="ph-fill ph-lightbulb"></i> ${totalLumini} ${totalLumini === 1 ? 'lumină aprinsă' : 'lumini aprinse'}` });

    // Audio
    const audioPornit = (subDispozitive.audio || []).filter(d => d.stare === "Pornit");
    if (audioPornit.length > 0) notificari.push({ id: "notif_audio", text: `<i class="ph-fill ph-speaker-high"></i> ${audioPornit.length} sisteme active` });

    // Diverse dispozitive specifice (TV, Aspirator)
    const tvPornit = (subDispozitive.tv || []).filter(d => d.stare === "Pornit");
    if (tvPornit.length > 0) { const idx = subDispozitive.tv.findIndex(d => d === tvPornit[0]); notificari.push({ id: "notif_tv", text: `<i class="ph-fill ph-television"></i> TV pornit în ${tvPornit[0].camera}`, actiune: `deschideMeniuDispozitive('none', 'tv', ${idx})` }); }

    if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === "Curăță") notificari.push({ id: "notif_aspirator", text: `<i class="ph-fill ph-robot"></i> Robotul curăță în ${subDispozitive.aspirator[0].camera}`, actiune: `deschideMeniuDispozitive('none', 'aspirator', 0)` });

    if (subDispozitive.purificator && subDispozitive.purificator[0] && subDispozitive.purificator[0].stare !== "Oprit") notificari.push({ id: "notif_purificator", text: `<i class="ph-fill ph-wind"></i> Purificator activ în ${subDispozitive.purificator[0].camera}`, actiune: `deschideMeniuDispozitive('none', 'purificator', 0)` });

    // Draperii/Jaluzele deschise
    (subDispozitive.jaluzele || []).forEach((d, idx) => {
        if (d.stare === "Deschis") notificari.push({ id: `notif_jaluzele_${idx}`, text: `<i class="ph-fill ph-blinds"></i> ${d.nume} din ${d.camera} e deschisă`, actiune: `deschideMeniuDispozitive('none', 'jaluzele', ${idx})` });
    });

    // Electrocasnice
    (subDispozitive.electrocasnice || []).forEach((d, idx) => {
        if (d.stare === "Pornit") notificari.push({ id: `notif_electrocasnic_${idx}`, text: `<i class="ph-fill ph-coffee"></i> ${d.nume} este pornit`, actiune: `deschideMeniuDispozitive('none', 'electrocasnice', ${idx})` });
    });

    // Prize
    (subDispozitive.prize || []).forEach((d, idx) => {
        if (d.stare === "Pornit") notificari.push({ id: `notif_priza_${idx}`, text: `<i class="ph-fill ph-plug"></i> ${d.nume} este sub tensiune`, actiune: `deschideMeniuDispozitive('none', 'prize', ${idx})` });
    });

    // Securitate și uși/ferestre
    if (subDispozitive.incuietori && subDispozitive.incuietori[0] && subDispozitive.incuietori[0].stare === "Deblocat") notificari.push({ id: "notif_usa", text: `<i class="ph-fill ph-lock-key"></i> Ușa de intrare este deblocată!`, actiune: `deschideMeniuDispozitive('none', 'incuietori', 0)` });

    if (subDispozitive.senzoriContact) subDispozitive.senzoriContact.forEach((d, idx) => { if (d.stare === "Deschis") notificari.push({ id: `notif_fereastra_${idx}`, text: `🚪 Fereastră deschisă în ${d.camera}`, actiune: `deschideMeniuDispozitive('none', 'senzoriContact', ${idx})` }); });

    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => { notificari.push({ id: `notif_motion_${idx}`, text: `<i class="ph-fill ph-person-simple-walk"></i> Mișcare în ${log.camera} [${log.ora}]` }); });

    return notificari;
}

function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');

    if (con) {
        let consumTotal = 150;
        Object.keys(subDispozitive).forEach(cat => {
            if (cat === 'prize') return;
            (subDispozitive[cat] || []).forEach(disp => {
                consumTotal += calculeazaConsumDispozitiv(disp, cat);
            });
        });
        con.innerText = (consumTotal / 1000).toFixed(2) + " kW";
    }

    if (sec) {
        const esteDezarmat = localStorage.getItem('alarmaDezactivata') === 'true';
        sec.innerText = esteDezarmat ? "Dezactivată" : "Armată";

        const txtSecuritateAlarma = document.getElementById('txt-status-alarma');
        if (txtSecuritateAlarma) {
            txtSecuritateAlarma.innerText = esteDezarmat ? "Sistem Dezarmat" : "Sistem Armat";
            txtSecuritateAlarma.style.color = esteDezarmat ? "var(--error-color)" : "var(--success-color)";
        }
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
        
        // Folosim direct formateazaTemperatura care returnează și valoarea și simbolul 
        continental.innerHTML = `<div class="popup-content-box"><h3 class="popup-subtitle">Setare Temperatură</h3><div class="popup-val-display"><span id="popup-temp-${camera}">${formateazaTemperatura(parseFloat(temp))}</span></div><div class="popup-ctrl-row"><button data-action="adjust-temp-popup" data-camera="${camera}" data-dir="minus" class="popup-ctrl-btn">−</button><button data-action="adjust-temp-popup" data-camera="${camera}" data-dir="plus" class="popup-ctrl-btn">+</button></div></div>`;
        modal.classList.add('active'); return;
    }
    const disp = subDispozitive[categorie][elementIndex];
    titlu.innerHTML = `${disp.icon} ${disp.nume}`;
    let contentHtml = '';
    if (categorie === 'prize') {
        contentHtml = `<div class="popup-content-box"><div class="popup-subtitle">Consum Curent în ${disp.camera}</div><div class="popup-val-display">${calculeazaConsumPriza(disp)} W</div><div class="popup-details">Dispozitive: <strong>${disp.detalii}</strong></div><button class="sensor-action-btn" data-action="toggle-device-popup" data-cat="${categorie}" data-idx="${elementIndex}" style="background-color: ${disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6'};">Alimentare Priză: ${disp.stare}</button></div>`;
    } else {
        contentHtml = `<div class="popup-action-row"><button class="sensor-action-btn" data-action="toggle-device-popup" data-cat="${categorie}" data-idx="${elementIndex}" style="background-color: ${['Pornit', 'Curăță', 'Deblocat', 'Activ', 'Deschis', 'LIVE', 'Auto', 'Boost'].includes(disp.stare) ? 'var(--success-color)' : '#95a5a6'};">Schimbă Stare (Curent: ${disp.stare})</button></div>`;
        if (categorie === 'camereVideo') contentHtml += `<div class="camera-feed-box">${disp.stare === 'LIVE' ? '<span class="camera-live-badge">🔴 LIVE REC</span><img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80" class="camera-feed-img">' : '<span class="camera-offline">[ Camera Feed Offline ]</span>'}</div>`;
        if (['becuri', 'audio', 'jaluzele', 'luminiRGB'].includes(categorie)) {
            const isOff = disp.stare === 'Oprit' || disp.stare === 'Închis';
            contentHtml += `
                <div class="slider-container ${isOff ? 'disabled-controls' : ''}">
                    <div class="slider-header">
                        <label>Intensitate / Volum:</label>
                        <label class="slider-val"><span id="val-${categorie}-${elementIndex}">${disp.valoare}</span>%</label>
                    </div>
                    <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} class="device-slider" data-action="device-slider-input" data-cat="${categorie}" data-idx="${elementIndex}">
                </div>`;
        }
    }
    
    contentHtml += `<div class="popup-action-row" style="margin-top: 15px;"><button class="sensor-action-btn" data-action="delete-device-popup" data-cat="${categorie}" data-idx="${elementIndex}" style="background-color: var(--error-color);"><i class="ph-bold ph-trash"></i> Șterge Accesoriu</button></div>`;
    
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function deschidePopupLuminiAprinse() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "<i class='ph-fill ph-lightbulb'></i> Lumini Active în Casă";
    let html = `<div class="popup-list-container">`;
    let areLumini = false;
    (subDispozitive.becuri || []).forEach((bec, idx) => {
        if (bec.stare === "Pornit") {
            areLumini = true;
            html += `<div class="popup-list-item" data-action="open-device-menu" data-cat="becuri" data-idx="${idx}"><div class="popup-list-left"><span class="popup-item-icon warning"><i class="ph-fill ph-lightbulb"></i></span><div><strong class="popup-item-title">${bec.nume}</strong><span class="popup-item-desc">${bec.camera} • ${bec.valoare}%</span></div></div><button data-action="toggle-and-refresh-lights" data-cat="becuri" data-idx="${idx}" class="popup-item-btn error">Stinge</button></div>`;
        }
    });
    (subDispozitive.luminiRGB || []).forEach((lampa, idx) => {
        if (lampa.stare === "Pornit") {
            areLumini = true;
            html += `<div class="popup-list-item" data-action="open-device-menu" data-cat="luminiRGB" data-idx="${idx}"><div class="popup-list-left"><span class="popup-item-icon accent"><i class="ph-fill ph-lamp"></i></span><div><strong class="popup-item-title">${lampa.nume}</strong><span class="popup-item-desc">${lampa.camera} • ${lampa.valoare}%</span></div></div><button data-action="toggle-and-refresh-lights" data-cat="luminiRGB" data-idx="${idx}" class="popup-item-btn error">Stinge</button></div>`;
        }
    });
    html += `</div>`;
    if (!areLumini) html = `<div class="popup-empty-text">Toate luminile au fost stinse!</div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function deschidePopupAudioPornit() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "<i class='ph-fill ph-speaker-high'></i> Sisteme Audio Active";
    let html = `<div class="popup-list-container">`;
    let areAudio = false;
    (subDispozitive.audio || []).forEach((boxa, idx) => {
        if (boxa.stare === "Pornit") {
            areAudio = true;
            html += `<div class="popup-list-item" data-action="open-device-menu" data-cat="audio" data-idx="${idx}"><div class="popup-list-left"><span class="popup-item-icon accent"><i class="ph-fill ph-speaker-high"></i></span><div><strong class="popup-item-title">${boxa.nume}</strong><span class="popup-item-desc">${boxa.camera} • Volum: ${boxa.valoare}%</span></div></div><button data-action="toggle-and-refresh-audio" data-cat="audio" data-idx="${idx}" class="popup-item-btn error">Oprește</button></div>`;
        }
    });
    html += `</div>`;
    if (!areAudio) html = `<div class="popup-empty-text">Toate sistemele audio au fost oprite!</div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function deschidePopupCreareScena() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !continental) return;
    titlu.innerHTML = "🎭 Creare Scenă Nouă";
    continental.innerHTML = `<div class="form-row"><label>Numele Scenei:</label><input type="text" id="custom-scene-name" class="form-input" placeholder="ex: Party Mode, Relaxare..."></div><div class="form-row"><label>Emoji sugestiv:</label><select id="custom-scene-emoji" class="form-input"><option value="🎉">🎉 Party / Distracție</option><option value="🍃">🍃 Relaxare / Fresh</option><option value="💻">💻 Birou / Work</option></select></div><div class="form-row"><label>Descriere scurtă:</label><input type="text" id="custom-scene-desc" class="form-input" placeholder="ex: Oprește toate electronicele din casă."></div><div class="form-row"><label>Șablon comportament:</label><select id="custom-scene-template" class="form-input"><option value="away">Mod Plecat (Închide tot + Alarme active)</option><option value="night">Mod Noapte (Ambient întunecat + uși încuiate)</option><option value="morning">Mod Dimineață (Deschide ferestre/jaluzele)</option></select></div><button onclick="salveazaScenaCustomNoua()" class="btn-full-success">💾 Creează Scena</button>`;
    modal.classList.add('active');
}

function deschideModalAutomatizare() {
    const modal = document.getElementById('popup-automatizare');
    if (!modal) return;
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

    let html = `<div class="popup-list-container" style="max-height: 250px; padding-right: 5px; margin-bottom: 15px; text-align: left; gap: 8px;">`;

    toateNotificarile.forEach(notif => {
        if (notif.id === "notif_lumini") {
            html += `<div class="notification-item card-style" data-action="open-popup-lumini"><span>${notif.text} <span class="notif-hint">(Apasă pt detalii)</span></span></div>`;
        } else if (notif.id === "notif_audio") {
            html += `<div class="notification-item card-style" data-action="open-popup-audio"><span>${notif.text} <span class="notif-hint">(Apasă pt detalii)</span></span></div>`;
        } else if (notif.actiune) {
            html += `<div class="notification-item card-style hover-accent" onclick="${notif.actiune}"><span>${notif.text}</span></div>`;
        } else {
            html += `<div class="notification-item card-style"><span>${notif.text}</span></div>`;
        }
    });

    if (toateNotificarile.length === 0) {
        html += `<div class="popup-empty-text">Nicio notificare activă.</div>`;
    }

    html += `</div><div class="popup-action-row"><button data-action="clear-motion-history" class="btn-clear-history"><i class="ph-bold ph-trash"></i> Șterge Istoric Mișcare</button></div>`;

    continental.innerHTML = html;
    modal.classList.add('active');
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    applyFadeOutAndClose(modal);
}

function inchidePopupIstoric() {
    const modal = document.getElementById('popup-istoric');
    applyFadeOutAndClose(modal);
}

// New function for closing the automatizare modal
function inchidePopupAutomatizare() {
    const modal = document.getElementById('popup-automatizare');
    applyFadeOutAndClose(modal);
}

window.onclick = function (event) {
    const m1 = document.getElementById('popup-dispozitive');
    const m2 = document.getElementById('popup-automatizare');
    const m3 = document.getElementById('popup-istoric');
    const m4 = document.getElementById('popup-pin-alarma'); // This one has its primary close function in app.js

    if (event.target === m1) {
        inchidePopup();
    }
    if (event.target === m2) {
        inchidePopupAutomatizare();
    }
    if (event.target === m3) {
        inchidePopupIstoric();
    }
    if (event.target === m4) {
        // Call the function from app.js if available, otherwise use fallback
        if (typeof inchidePopupPin === 'function') {
            inchidePopupPin();
        } else {
            applyFadeOutAndClose(m4);
        }
    }
}

// Închidere rapidă a tuturor modalelor la apăsarea tastei Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        inchidePopup();
        inchidePopupAutomatizare();
        inchidePopupIstoric();
        if (typeof inchidePopupPin === 'function') inchidePopupPin();
    }
});

function sincronizeazaDOMcuMemoria() {
    // 1. Actualizează discret toate cardurile individuale direct în DOM (evită innerHTML masiv)
    Object.keys(subDispozitive).forEach(cat => {
        (subDispozitive[cat] || []).forEach((disp, idx) => {
            actualizeazaCardInDOM(cat, idx, true); // Folosim 'true' pentru a sări temporar peste update-ul global
        });
    });

    // 2. Actualizează vizual scenele selectate/active (dacă sunt vizibile pe ecran)
    const activeSceneId = localStorage.getItem('activeScene');
    document.querySelectorAll('.hk-card[data-action="execute-scene"]').forEach(card => {
        if (card.dataset.sceneid === activeSceneId) card.classList.add('is-active');
        else card.classList.remove('is-active');
    });

    // 3. Info global minim de sistem
    actualizeazaStatusGlobal();
    if (document.getElementById('notifications-container')) afiseazaNotificariHome();
}

function actualizeazaCardInDOM(cat, index, skipGlobal = false) {
    const idUnic = `${cat}_${index}`;
    const disp = subDispozitive[cat][index];
    if (!disp) return;

    const isActive = ['Pornit', 'Curăță', 'Deblocat', 'Activ', 'Deschis', 'LIVE', 'Auto', 'Boost', 'Pericol', 'FUM DETECTAT!', 'APĂ DETECTATĂ!'].includes(disp.stare);

    const carduri = document.querySelectorAll(`.hk-card[data-id="${idUnic}"]`);
    carduri.forEach(card => {
        if (isActive) card.classList.add('is-active');
        else card.classList.remove('is-active');

        // Resetăm stările anterioare de alarmă
        card.classList.remove('alarm-fire', 'alarm-water');
        
        // Aplicăm noul efect vizual în interiorul cardului
        if (disp.stare === 'Pericol' || disp.stare === 'FUM DETECTAT!') {
            card.classList.add('alarm-fire');
        } else if (disp.stare === 'APĂ DETECTATĂ!') {
            card.classList.add('alarm-water');
        }

        const stateEl = card.querySelector('.hk-state');
        if (stateEl) {
            let afisareStare = disp.stare;
            // APLICĂM CONVERSIA LA UPDATE-UL DOM-ULUI
            if (cat && (cat.toLowerCase().includes('clima') || cat.toLowerCase().includes('termostat') || cat.toLowerCase().includes('senzor')) && !isNaN(parseFloat(disp.stare))) {
                afisareStare = formateazaTemperatura(parseFloat(disp.stare));
            }
            stateEl.innerText = `${afisareStare} ${disp.camera ? `• ${disp.camera}` : ''}`;
        }
    });

    if (!skipGlobal) {
        actualizeazaStatusGlobal();
        if (document.getElementById('notifications-container')) {
            afiseazaNotificariHome();
            randareCeleMaiFolosite();
        }
    }

    // Suport meniu popup deschis
    const popup = document.getElementById('popup-dispozitive');
    if (popup && popup.classList.contains('active')) {
        const btn = popup.querySelector('.sensor-action-btn');
        if (btn && btn.dataset.cat === cat && parseInt(btn.dataset.idx) === index) {
            btn.style.backgroundColor = isActive ? 'var(--success-color)' : '#95a5a6';
            btn.innerText = `Schimbă Stare (Curent: ${disp.stare})`;
        }
    }
}

// --- Sistem Global de Notificari (Toasts) ---
function showToast(mesaj, opts = {}) {
    // opts: { isError: false, cuUndo: false, actiuneUndo: null, callback: null }
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Eliminăm orice notificare existentă înainte de a afișa una nouă.
    // Acest lucru previne suprapunerea mesajelor de succes peste cele de alarmă.
    const existingToasts = container.querySelectorAll('.toast-notification');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.borderLeft = `4px solid ${opts.isError ? 'var(--error-color)' : 'var(--success-color)'}`;

    const icon = opts.isError ? '<i class="ph-bold ph-warning-circle" style="color: var(--error-color); font-size: 1.2em;"></i>' : '<i class="ph-bold ph-check-circle" style="color: var(--success-color); font-size: 1.2em;"></i>';

    let htmlContent = `${icon} <span>${mesaj}</span>`;

    if (opts.cuUndo) {
        htmlContent += `<button class="undo-btn" style="background: rgba(255,255,255,0.2); color: inherit; border: none; padding: 4px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Undo</button>`;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    if (opts.cuUndo && opts.actiuneUndo) {
        toast.querySelector('.undo-btn').addEventListener('click', () => {
            opts.actiuneUndo();
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
            showToast('Acțiunea a fost anulată.', { isError: false });
        });
    }

    // Declanșăm animația de slide-in
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (opts.callback) opts.callback();
        });
    }, 3500);
}

// Suport pentru compatibilitate cu apelurile vechi `showToast("mesaj", true)` sau `showToast("mesaj", isError, callback)`
const originalShowToast = showToast;
showToast = function (mesaj, arg2, arg3) {
    if (typeof arg2 === 'object' && arg2 !== null) {
        return originalShowToast(mesaj, arg2);
    }
    // Suport backwards compatibility
    let opts = {};
    if (typeof arg2 === 'boolean') {
        // În vechiul ui.js arg2 era isError. În vechiul main.js arg2 era cuUndo.
        // Pentru că ui.js e mai folosit, presupunem isError default dacă nu e clar. 
        // Dar cel mai bine mapăm pe formatul vechi din ui.js dacă e boolean.
        opts.isError = arg2;
    }
    if (typeof arg3 === 'function') {
        opts.callback = arg3;
    }
    return originalShowToast(mesaj, opts);
};

function deschideModalAdaugareAccesoriu() {
    const modal = document.getElementById('popup-adaugare-accesoriu');
    if (modal) modal.classList.add('active');
}

function inchideModalAdaugareAccesoriu() {
    const modal = document.getElementById('popup-adaugare-accesoriu');
    if (modal) applyFadeOutAndClose(modal);
}

function salveazaAccesoriuNou() {
    const nume = document.getElementById('new-acc-name').value.trim();
    const categorie = document.getElementById('new-acc-category').value;
    const camera = document.getElementById('new-acc-room').value;

    if (!nume) {
        showToast("Te rugăm să introduci un nume pentru accesoriu!", true);
        return;
    }

    if (!subDispozitive[categorie]) {
        subDispozitive[categorie] = [];
    }

    // Stabilire proprietăți implicite în funcție de categorie
    let iconDefault = '<i class="ph-fill ph-check-circle"></i>';
    let stareDefault = 'Oprit';
    let valoareDefault = 0;

    switch (categorie) {
        case 'becuri': iconDefault = '<i class="ph-fill ph-lightbulb"></i>'; valoareDefault = 100; break;
        case 'luminiRGB': iconDefault = '<i class="ph-fill ph-lamp"></i>'; valoareDefault = 100; break;
        case 'prize': iconDefault = '<i class="ph-fill ph-plug"></i>'; stareDefault = 'Pornit'; break;
        case 'electrocasnice': iconDefault = '<i class="ph-fill ph-coffee"></i>'; break;
        case 'audio': iconDefault = '<i class="ph-fill ph-speaker-high"></i>'; valoareDefault = 30; break;
        case 'tv': iconDefault = '<i class="ph-fill ph-television"></i>'; break;
        case 'senzoriContact': iconDefault = '<i class="ph-fill ph-door"></i>'; stareDefault = 'Închis'; break;
        case 'senzoriMiscare': iconDefault = '<i class="ph-fill ph-person-simple-walk"></i>'; stareDefault = 'Inactiv'; break;
        case 'jaluzele': iconDefault = '<i class="ph-fill ph-blinds"></i>'; stareDefault = 'Închis'; valoareDefault = 0; break;
    }

    const noulAccesoriu = {
        nume: nume,
        stare: stareDefault,
        camera: camera,
        icon: iconDefault
    };

    if (['becuri', 'luminiRGB', 'audio', 'jaluzele'].includes(categorie)) {
        noulAccesoriu.valoare = valoareDefault;
    }
    if (categorie === 'luminiRGB') {
        noulAccesoriu.culoare = '#ffffff';
    }
    if (categorie === 'prize') {
        noulAccesoriu.consum = 0;
    }

    subDispozitive[categorie].push(noulAccesoriu);
    salveazaStarea();
    adaugaInLog(`Accesoriu nou adăugat: ${nume} (${camera})`);

    inchideModalAdaugareAccesoriu();
    document.getElementById('new-acc-name').value = '';

    showToast("Accesoriul a fost adăugat cu succes!");
    reincarcaInterfata();
}

// === ES6 MODULE EXPORTS ===
export {
    applyFadeOutAndClose, reincarcaInterfata, schimbaTipGraficDashboard, schimbaPerioadaDashboard,
    randareGraficDashboard, randareHome, randareAccesorii, randareScene, randareSecuritate,
    randareSabloane, randareAutomatizari, randareStatisticiLogs, construiesteCardHTML,
    construiesteScenaHTML, afiseazaNotificariHome, genereazaListaNotificari, actualizeazaStatusGlobal,
    deschideMeniuDispozitive, deschidePopupLuminiAprinse, deschidePopupAudioPornit,
    deschidePopupCreareScena, deschideModalAutomatizare, deschidePopupToateNotificarile,
    inchidePopup, inchidePopupIstoric, inchidePopupAutomatizare, sincronizeazaDOMcuMemoria,
    actualizeazaCardInDOM, showToast, deschideModalAdaugareAccesoriu, inchideModalAdaugareAccesoriu, salveazaAccesoriuNou
};

// === EXPUNERI GLOBALE PENTRU INLINE HTML (ONCLICK) ===
window.schimbaTipGraficDashboard = schimbaTipGraficDashboard;
window.schimbaPerioadaDashboard = schimbaPerioadaDashboard;
window.inchidePopup = inchidePopup;
window.inchidePopupIstoric = inchidePopupIstoric;
window.inchidePopupAutomatizare = inchidePopupAutomatizare;
window.deschidePopupCreareScena = deschidePopupCreareScena;
window.deschideModalAutomatizare = deschideModalAutomatizare;
window.showToast = showToast;
window.reincarcaInterfata = reincarcaInterfata;
window.deschideMeniuDispozitive = deschideMeniuDispozitive;
window.deschidePopupLuminiAprinse = deschidePopupLuminiAprinse;
window.deschidePopupAudioPornit = deschidePopupAudioPornit;
window.deschidePopupToateNotificarile = deschidePopupToateNotificarile;
window.sincronizeazaDOMcuMemoria = sincronizeazaDOMcuMemoria;
window.actualizeazaCardInDOM = actualizeazaCardInDOM;
window.randareHome = randareHome;
window.randareAccesorii = randareAccesorii;
window.randareScene = randareScene;
window.randareSecuritate = randareSecuritate;
window.randareSabloane = randareSabloane;
window.randareAutomatizari = randareAutomatizari;
window.applyFadeOutAndClose = applyFadeOutAndClose;
window.deschideModalAdaugareAccesoriu = deschideModalAdaugareAccesoriu;
window.inchideModalAdaugareAccesoriu = inchideModalAdaugareAccesoriu;
window.salveazaAccesoriuNou = salveazaAccesoriuNou;