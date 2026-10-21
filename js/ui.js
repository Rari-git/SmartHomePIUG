import { curtainIcon, windowIcon, recommendedTemplates } from './data.js';
import { subDevices, scenesDB, calculatePlugConsumption, calculateDeviceConsumption, saveState, addToLog, updateClimateAverages, closePinPopup, getTempUnit, convertTemp } from './app.js';

export let currentDashType = 'energy';
export let currentDashPeriod = '7d';
export let sortableInstances = { acc: null, scene: null };

function formatTemperature(celsiusValue) {
    const unit = localStorage.getItem('tempUnit') || 'C';
    if (unit === 'F') {
        const fahrenheit = Math.round((celsiusValue * 9 / 5) + 32);
        return `${fahrenheit}°F`;
    }
    return `${celsiusValue}°C`;
}

function applyFadeOutAndClose(modal) {
    if (!modal || !modal.classList.contains('active')) {
        return;
    }

    const transitionDuration = 350;

    modal.style.transition = `opacity ${transitionDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    modal.style.opacity = '0';

    let isCleanedUp = false;
    const cleanup = () => {
        if (isCleanedUp) return;
        isCleanedUp = true;

        modal.classList.remove('active');
        modal.style.transition = '';
        modal.style.opacity = '';
        modal.removeEventListener('transitionend', cleanup);
    };

    modal.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, transitionDuration + 50);
}

function reloadInterface() {
    updateGlobalStatus();
    if (document.getElementById('fav-scenes-container')) { renderHome(); displayHomeNotifications(); }
    if (document.getElementById('all-scenes-container')) renderScenes();
    if (document.getElementById('all-accessories-container')) renderAccessories();
    if (document.getElementById('security-devices-container')) renderSecurity();
    if (document.getElementById('automations-list')) { renderAutomations(); renderTemplates(); }
    if (document.getElementById('dashboard-chart-content')) renderDashboardChart();
    if (document.getElementById('logs-container')) renderStatisticsLogs();
}

function switchDashboardChartType(type) {
    currentDashType = type;
    document.getElementById('btn-type-energy').classList.toggle('active', type === 'energy');
    document.getElementById('btn-type-climate').classList.toggle('active', type === 'climate');
    renderDashboardChart();
}

function switchDashboardPeriod(period) {
    currentDashPeriod = period;
    ['1d', '7d', '30d', '6m', '1y'].forEach(p => {
        const btn = document.getElementById(`btn-dash-${p}`);
        if (btn) btn.classList.toggle('active', p === period);
    });
    renderDashboardChart();
}

function renderDashboardChart() {
    const container = document.getElementById('dashboard-chart-content');
    if (!container) return;

    let chartData = [];
    if (currentDashType === 'energy') {
        if (currentDashPeriod === '1d') {
            chartData = [{ label: '00:00 - 06:00', val: 1.2 }, { label: '06:00 - 12:00', val: 4.5 }, { label: '12:00 - 18:00', val: 3.8 }, { label: '18:00 - 00:00', val: 6.2 }];
        } else if (currentDashPeriod === '7d') {
            chartData = [{ label: 'Mon', val: 14 }, { label: 'Tue', val: 15 }, { label: 'Wed', val: 13 }, { label: 'Thu', val: 17 }, { label: 'Fri', val: 16 }, { label: 'Sat', val: 22 }, { label: 'Sun', val: 20 }];
        } else if (currentDashPeriod === '30d') {
            chartData = [{ label: 'Week 1', val: 110 }, { label: 'Week 2', val: 125 }, { label: 'Week 3', val: 105 }, { label: 'Week 4', val: 140 }];
        } else if (currentDashPeriod === '6m') {
            chartData = [{ label: 'December', val: 480 }, { label: 'January', val: 520 }, { label: 'February', val: 460 }, { label: 'March', val: 390 }, { label: 'April', val: 310 }, { label: 'May', val: 240 }];
        } else if (currentDashPeriod === '1y') {
            chartData = [{ label: 'Q1', val: 1460 }, { label: 'Q2', val: 980 }, { label: 'Q3', val: 820 }, { label: 'Q4', val: 1240 }];
        }

        const fragment = document.createDocumentFragment();
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';

        const maxVal = Math.max(...chartData.map(d => d.val), 1);

        chartData.forEach(p => {
            const percent = (p.val / maxVal) * 100;
            const row = document.createElement('div');
            row.className = 'chart-row';
            row.innerHTML = `<div class="chart-label">${p.label}</div><div class="chart-track"><div class="anim-bar chart-bar energy" data-width="${percent}%" style="width: 0%;"></div></div><div class="chart-val energy">${p.val} kWh</div>`;
            chartContainer.appendChild(row);
        });

        fragment.appendChild(chartContainer);
        container.innerHTML = '';
        container.appendChild(fragment);

        setTimeout(() => {
            container.querySelectorAll('.anim-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 50);
    } else {
        if (currentDashPeriod === '1d') {
            chartData = [{ label: '00:00 - 06:00', t: 19, u: 50 }, { label: '06:00 - 12:00', t: 22, u: 45 }, { label: '12:00 - 18:00', t: 24, u: 40 }, { label: '18:00 - 00:00', t: 21, u: 48 }];
        } else if (currentDashPeriod === '7d') {
            chartData = [{ label: 'Mon', t: 21.5, u: 44 }, { label: 'Tue', t: 22, u: 46 }, { label: 'Wed', t: 20.8, u: 50 }, { label: 'Thu', t: 23.4, u: 42 }, { label: 'Fri', t: 22, u: 45 }, { label: 'Sat', t: 24.1, u: 40 }, { label: 'Sun', t: 22.6, u: 47 }];
        } else if (currentDashPeriod === '30d') {
            chartData = [{ label: 'Week 1', t: 21.2, u: 45 }, { label: 'Week 2', t: 22.1, u: 44 }, { label: 'Week 3', t: 21.8, u: 48 }, { label: 'Week 4', t: 22.5, u: 42 }];
        } else if (currentDashPeriod === '6m') {
            chartData = [{ label: 'December', t: 18.5, u: 55 }, { label: 'January', t: 19, u: 53 }, { label: 'February', t: 19.5, u: 50 }, { label: 'March', t: 21.2, u: 46 }, { label: 'April', t: 22.8, u: 44 }, { label: 'May', t: 24.1, u: 42 }];
        } else if (currentDashPeriod === '1y') {
            chartData = [{ label: 'Q1', t: 19.1, u: 51 }, { label: 'Q2', t: 22.4, u: 44 }, { label: 'Q3', t: 25.2, u: 41 }, { label: 'Q4', t: 20.5, u: 49 }];
        }

        const fragment = document.createDocumentFragment();
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container-climate';

        const maxT = Math.max(...chartData.map(d => d.t), 1);
        const maxU = Math.max(...chartData.map(d => d.u), 1);

        chartData.forEach(p => {
            const prT = (p.t / maxT) * 100;
            const prU = (p.u / maxU) * 100;
            const group = document.createElement('div');
            group.className = 'chart-climate-group';
            group.innerHTML = `
                <div class="chart-climate-group">
                    <div class="chart-climate-title">${p.label}</div>
                    <div class="chart-row small-gap">
                        <span class="chart-sub-label">Temp:</span>
                        <div class="chart-track small-track">
                            <div class="anim-bar chart-bar temp" data-width="${prT}%" style="width: 0%;"></div>
                        </div>
                        <span class="chart-val temp">${convertTemp(p.t)}°${getTempUnit()}</span>
                    </div>
                    <div class="chart-row small-gap">
                        <span class="chart-sub-label">Hum:</span>
                        <div class="chart-track small-track">
                            <div class="anim-bar chart-bar humid" data-width="${prU}%" style="width: 0%;"></div>
                        </div>
                        <span class="chart-val humid">${p.u}%</span>
                    </div>
                </div>
            `;
            chartContainer.appendChild(group);
        });

        fragment.appendChild(chartContainer);
        container.innerHTML = '';
        container.appendChild(fragment);

        setTimeout(() => {
            container.querySelectorAll('.anim-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 50);
    }
}

function renderMostUsed() {
    const mostUsedContainer = document.getElementById('most-used-accessories-container');
    if (!mostUsedContainer) return;

    const usage = JSON.parse(localStorage.getItem('deviceUsage')) || {};
    const sortedDevices = Object.keys(usage).sort((a, b) => usage[b] - usage[a]).slice(0, 4);

    mostUsedContainer.innerHTML = '';

    if (sortedDevices.length > 0) {
        const fragment = document.createDocumentFragment();
        sortedDevices.forEach(deviceId => {
            const [cat, idx] = deviceId.split('_');
            if (subDevices[cat] && subDevices[cat][idx]) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = buildCardHTML(subDevices[cat][idx], cat, idx, true);
                fragment.appendChild(tempDiv.firstChild);
            }
        });
        mostUsedContainer.appendChild(fragment);
    } else {
        mostUsedContainer.innerHTML = '<div style="width: 100%; grid-column: 1 / -1;"><div style="background: var(--card-bg); padding: 20px; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); box-shadow: var(--shadow-soft); opacity: 0.9;"><span style="font-size: 0.95em; font-weight: 500; color: var(--text-color);">No usage data yet. Operate devices to see them here.</span></div></div>';
    }
}

function renderHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];

    renderMostUsed();

    const accContainer = document.getElementById('fav-accessories-container');
    if (accContainer) {
        accContainer.innerHTML = '';
        if (favAcc.length > 0) {
            const fragment = document.createDocumentFragment();
            favAcc.forEach(savedId => {
                const [cat, idx] = savedId.split('_');
                if (subDevices[cat] && subDevices[cat][idx]) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = buildCardHTML(subDevices[cat][idx], cat, idx, true);
                    fragment.appendChild(tempDiv.firstChild);
                }
            });
            accContainer.appendChild(fragment);
        } else {
            accContainer.innerHTML = '<p style="opacity:0.5;">No favorite accessories.</p>';
        }
    }

    const sceneContainer = document.getElementById('fav-scenes-container');
    if (sceneContainer) {
        sceneContainer.innerHTML = '';
        if (favScenes.length > 0) {
            const fragment = document.createDocumentFragment();
            favScenes.forEach(sceneId => {
                const scene = scenesDB.find(s => s.id === sceneId);
                if (scene) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = buildSceneHTML(scene, true);
                    fragment.appendChild(tempDiv.firstChild);
                }
            });
            sceneContainer.appendChild(fragment);
        } else {
            sceneContainer.innerHTML = '<p style="opacity:0.5;">No favorite scenes.</p>';
        }
    }

    setTimeout(() => {
        if (typeof Sortable !== 'undefined') {
            if (accContainer && accContainer.children.length > 0) {
                if (sortableInstances.acc) sortableInstances.acc.destroy();
                sortableInstances.acc = new Sortable(accContainer, {
                    animation: 200,
                    delay: 150,
                    delayOnTouchOnly: true,
                    ghostClass: 'is-active',
                    onEnd: function () {
                        const newOrder = Array.from(accContainer.children).map(card => card.getAttribute('data-id'));
                        localStorage.setItem('favAcc', JSON.stringify(newOrder));
                    }
                });
            }
            if (sceneContainer && sceneContainer.children.length > 0) {
                if (sortableInstances.scene) sortableInstances.scene.destroy();
                sortableInstances.scene = new Sortable(sceneContainer, {
                    animation: 200,
                    delay: 150,
                    delayOnTouchOnly: true,
                    ghostClass: 'is-active',
                    onEnd: function () {
                        const newOrder = Array.from(sceneContainer.children).map(card => card.getAttribute('data-id'));
                        localStorage.setItem('favScenes', JSON.stringify(newOrder));
                    }
                });
            }
        }
    }, 100);
}

function renderAccessories() {
    const container = document.getElementById('all-accessories-container');
    if (!container) return;

    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const roomsMap = {};
    Object.keys(subDevices).forEach(cat => {
        (subDevices[cat] || []).forEach((disp, idx) => {
            if (!roomsMap[disp.room]) roomsMap[disp.room] = [];
            roomsMap[disp.room].push({ disp, cat, idx });
        });
    });

    const fragment = document.createDocumentFragment();
    Object.keys(roomsMap).sort().forEach(room => {
        const title = document.createElement('h2');
        title.className = 'hk-section-title';
        title.textContent = room;
        fragment.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'hk-grid';

        const gridFragment = document.createDocumentFragment();
        roomsMap[room].forEach(item => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = buildCardHTML(item.disp, item.cat, item.idx, favAcc.includes(`${item.cat}_${item.idx}`));
            gridFragment.appendChild(tempDiv.firstChild);
        });
        grid.appendChild(gridFragment);
        fragment.appendChild(grid);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

function renderScenes() {
    const container = document.getElementById('all-scenes-container');
    if (!container) return;

    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    const fragment = document.createDocumentFragment();

    scenesDB.forEach(scene => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = buildSceneHTML(scene, favScenes.includes(scene.id));
        fragment.appendChild(tempDiv.firstChild);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

function renderSecurity() {
    const container = document.getElementById('security-devices-container');
    if (!container) return;

    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const fragment = document.createDocumentFragment();

    ['videoCameras', 'motionSensors', 'contactSensors', 'locks'].forEach(cat => {
        if (subDevices[cat]) {
            subDevices[cat].forEach((disp, idx) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = buildCardHTML(disp, cat, idx, favAcc.includes(`${cat}_${idx}`));
                fragment.appendChild(tempDiv.firstChild);
            });
        }
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}

function renderTemplates() {
    const container = document.getElementById('templates-carousel');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const activeIds = rules.map(r => r.idSuggestion).filter(id => id);

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    let counter = 0;

    recommendedTemplates.forEach(sug => {
        if (!activeIds.includes(sug.idSuggestion)) {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            card.style.borderTop = `5px solid ${sug.color}`;
            card.innerHTML = `<div class="sug-icon">${sug.icon}</div><strong class="sug-name">${sug.name}</strong><p class="sug-desc">${sug.shortDesc}</p><button class="sug-btn" data-action="add-suggestion" data-sugid="${sug.idSuggestion}">+ Add Rule</button>`;
            fragment.appendChild(card);
            counter++;
        }
    });

    if (counter === 0) {
        container.innerHTML = `<div class="popup-empty-text">You have activated all recommended templates!</div>`;
    } else {
        container.appendChild(fragment);
    }
}

function renderAutomations() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    rules.forEach(rule => {
        const card = document.createElement('div');
        card.className = `hk-card auto-card`;
        card.style.borderLeft = `5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}`;
        card.style.opacity = rule.active ? '1' : '0.5';
        card.innerHTML = `<div class="auto-header"><div class="auto-title" style="color: ${rule.active ? 'var(--text-color)' : '#95a5a6'};">${rule.triggerType === 'time' ? '<i class="ph-bold ph-clock"></i>' : '<i class="ph-bold ph-gear"></i>'} Active Rule</div><div class="auto-controls"><label class="toggle-switch"><input type="checkbox" data-action="toggle-automation" data-autoid="${rule.id}" ${rule.active ? 'checked' : ''}><span class="slider"></span></label><button data-action="delete-automation" data-autoid="${rule.id}" class="auto-delete-btn"><i class="ph-bold ph-trash"></i></button></div></div><div class="auto-desc">${rule.desc}</div>`;
        fragment.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'hk-card card-add-new';
    addCard.setAttribute('onclick', 'openAutomationModal()');
    addCard.innerHTML = `<div class="plus-icon"><i class="ph-bold ph-plus"></i></div><div class="add-title">New Rule</div><div class="add-desc">Complete manual configuration</div>`;
    fragment.appendChild(addCard);

    container.appendChild(fragment);
}

function renderStatisticsLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    const logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];

    container.innerHTML = '';

    if (logs.length === 0) {
        container.innerHTML = `<div class="popup-empty-text">No recorded events yet.</div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerHTML = `<span class="log-text">${log.text}</span><span class="log-time"><i class="ph-bold ph-clock"></i> ${log.time}</span>`;
        fragment.appendChild(item);
    });
    container.appendChild(fragment);
}

function buildCardHTML(disp, cat, idx, isFav) {
    const isActive = ['On', 'Cleaning', 'Unlocked', 'Active', 'Open', 'LIVE', 'Auto', 'Boost', 'Danger', 'SMOKE DETECTED!', 'WATER DETECTED!'].includes(disp.state);
    const uniqueId = `${cat}_${idx}`;
    const animDelay = Math.min(idx * 0.04, 0.6);

    let alarmClass = '';
    if (disp.state === 'Danger' || disp.state === 'SMOKE DETECTED!') {
        alarmClass = 'alarm-fire';
    } else if (disp.state === 'WATER DETECTED!') {
        alarmClass = 'alarm-water';
    }

    let displayState = disp.state;
    if (cat && (cat.toLowerCase().includes('climate') || cat.toLowerCase().includes('thermostat') || cat.toLowerCase().includes('sensor') || cat.toLowerCase().includes('dehumid')) && !isNaN(parseFloat(disp.state))) {
        const lowerName = (disp.name || "").toLowerCase();
        const lowerCat = cat.toLowerCase();
        if (lowerName.includes('dehumid') || lowerName.includes('humid') || lowerCat.includes('dehumid') || lowerCat.includes('humid')) {
            displayState = `${disp.state}%`;
        } else {
            displayState = formatTemperature(parseFloat(disp.state));
        }
    }

    return `<div class="hk-card ${isActive ? 'is-active' : ''} ${alarmClass}" data-id="${uniqueId}" style="animation-delay: ${animDelay}s;" data-action="toggle-device" data-cat="${cat}" data-idx="${idx}"><div class="hk-controls"><button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" data-action="toggle-favorite" data-favid="${uniqueId}" data-favtype="acc"><i class="ph-fill ph-star"></i></button><button class="hk-btn" data-action="open-device-menu" data-cat="${cat}" data-idx="${idx}"><i class="ph-bold ph-gear"></i></button></div><div class="hk-icon">${disp.icon}</div><div><div class="hk-name">${disp.name}</div><div class="hk-state">${displayState} ${disp.room ? `• ${disp.room}` : ''}</div></div></div>`;
}

function buildSceneHTML(scene, isFav) {
    const isActive = localStorage.getItem('activeScene') === scene.id;
    const isCustom = !scene.id.startsWith('s_');
    const animDelay = (scene.id.charCodeAt(scene.id.length - 1) % 10) * 0.04;
    return `<div class="hk-card ${isActive ? 'is-active' : ''}" data-id="${scene.id}" style="height: 90px; animation-delay: ${animDelay}s;" data-action="execute-scene" data-sceneid="${scene.id}"><div class="hk-controls">${isCustom ? `<button class="hk-btn" data-action="delete-scene" data-sceneid="${scene.id}" style="color: var(--error-color); margin-right: 2px;"><i class="ph-bold ph-trash"></i></button>` : ''}<button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" data-action="toggle-favorite" data-favid="${scene.id}" data-favtype="scene"><i class="ph-fill ph-star"></i></button></div><div class="hk-name scene-name-title">${scene.name}</div><div class="hk-state scene-desc-text">${scene.desc}</div></div>`;
}

function displayHomeNotifications() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    const allNotifications = generateNotificationsList();

    container.innerHTML = '';

    if (allNotifications.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">All systems are on standby.</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    const limit = Math.min(allNotifications.length, 3);

    for (let i = 0; i < limit; i++) {
        const notif = allNotifications[i];
        const item = document.createElement('div');
        item.className = 'notification-item';
        if (notif.id === "notif_lights") {
            item.dataset.action = "open-popup-lights";
            item.classList.add('hover-accent');
            item.innerHTML = `<span>${notif.text} <span class="notif-hint">(Click for details)</span></span>`;
        } else if (notif.id === "notif_audio") {
            item.dataset.action = "open-popup-audio";
            item.classList.add('hover-accent');
            item.innerHTML = `<span>${notif.text} <span class="notif-hint">(Click for details)</span></span>`;
        } else if (notif.action) {
            item.classList.add('hover-accent');
            item.setAttribute('onclick', notif.action);
            item.innerHTML = `<span>${notif.text}</span>`;
        } else {
            item.innerHTML = `<span>${notif.text}</span>`;
        }
        fragment.appendChild(item);
    }

    if (allNotifications.length > 3) {
        const button = document.createElement('button');
        button.className = 'see-more-btn';
        button.dataset.action = 'open-popup-all-notifs';
        button.innerHTML = 'See more &gt;';
        fragment.appendChild(button);
    }

    container.appendChild(fragment);
}

function generateNotificationsList() {
    let notifications = [];

    const bulbsOn = (subDevices.bulbs || []).filter(d => d.state === "On");
    const rgbOn = (subDevices.rgbLights || []).filter(d => d.state === "On");
    const totalLights = bulbsOn.length + rgbOn.length;
    if (totalLights > 0) notifications.push({ id: "notif_lights", text: `<i class="ph-fill ph-lightbulb"></i> ${totalLights} ${totalLights === 1 ? 'light on' : 'lights on'}` });

    const audioOn = (subDevices.audio || []).filter(d => d.state === "On");
    if (audioOn.length > 0) notifications.push({ id: "notif_audio", text: `<i class="ph-fill ph-speaker-high"></i> ${audioOn.length} active systems` });

    const tvOn = (subDevices.tv || []).filter(d => d.state === "On");
    if (tvOn.length > 0) {
        const idx = subDevices.tv.findIndex(d => d === tvOn[0]);
        notifications.push({ id: "notif_tv", text: `<i class="ph-fill ph-television"></i> TV on in ${tvOn[0].room}`, action: `openDeviceMenu('none', 'tv', ${idx})` });
    }

    if (subDevices.vacuum && subDevices.vacuum[0] && subDevices.vacuum[0].state === "Cleaning") {
        notifications.push({ id: "notif_vacuum", text: `<i class="ph-fill ph-robot"></i> Robot cleaning in ${subDevices.vacuum[0].room}`, action: `openDeviceMenu('none', 'vacuum', 0)` });
    }

    if (subDevices.purifier && subDevices.purifier[0] && subDevices.purifier[0].state !== "Off") {
        notifications.push({ id: "notif_purifier", text: `<i class="ph-fill ph-wind"></i> Purifier active in ${subDevices.purifier[0].room}`, action: `openDeviceMenu('none', 'purifier', 0)` });
    }

    (subDevices.blinds || []).forEach((d, idx) => {
        if (d.state === "Open") notifications.push({ id: `notif_blinds_${idx}`, text: `<i class="ph-fill ph-blinds"></i> ${d.name} in ${d.room} is open`, action: `openDeviceMenu('none', 'blinds', ${idx})` });
    });

    (subDevices.appliances || []).forEach((d, idx) => {
        if (d.state === "On") notifications.push({ id: `notif_appliance_${idx}`, text: `<i class="ph-fill ph-coffee"></i> ${d.name} is on`, action: `openDeviceMenu('none', 'appliances', ${idx})` });
    });

    (subDevices.plugs || []).forEach((d, idx) => {
        if (d.state === "On") notifications.push({ id: `notif_plug_${idx}`, text: `<i class="ph-fill ph-plug"></i> ${d.name} is powered`, action: `openDeviceMenu('none', 'plugs', ${idx})` });
    });

    if (subDevices.locks && subDevices.locks[0] && subDevices.locks[0].state === "Unlocked") {
        notifications.push({ id: "notif_door", text: `<i class="ph-fill ph-lock-key"></i> Front door is unlocked!`, action: `openDeviceMenu('none', 'locks', 0)` });
    }

    if (subDevices.contactSensors) {
        subDevices.contactSensors.forEach((d, idx) => {
            if (d.state === "Open") notifications.push({ id: `notif_window_${idx}`, text: `🚪 Window open in ${d.room}`, action: `openDeviceMenu('none', 'contactSensors', ${idx})` });
        });
    }

    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => {
        notifications.push({ id: `notif_motion_${idx}`, text: `<i class="ph-fill ph-person-simple-walk"></i> Motion in ${log.room} [${log.time}]` });
    });

    return notifications;
}

function updateGlobalStatus() {
    const sec = document.getElementById('global-security');
    const con = document.getElementById('global-consumption');

    if (con) {
        let totalConsumption = 150;
        Object.keys(subDevices).forEach(cat => {
            if (cat === 'plugs') return;
            (subDevices[cat] || []).forEach(disp => {
                totalConsumption += calculateDeviceConsumption(disp, cat);
            });
        });
        con.innerText = (totalConsumption / 1000).toFixed(2) + " kW";
    }

    if (sec) {
        const isDisarmed = localStorage.getItem('alarmDeactivated') === 'true';
        sec.innerText = isDisarmed ? "Disarmed" : "Armed";

        const txtAlarmStatus = document.getElementById('txt-alarm-status');
        if (txtAlarmStatus) {
            txtAlarmStatus.innerText = isDisarmed ? "System Disarmed" : "System Armed";
            txtAlarmStatus.style.color = isDisarmed ? "var(--error-color)" : "var(--success-color)";
        }
    }
}

function openDeviceMenu(cardId, category, elementIndex) {
    const modal = document.getElementById('popup-device');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    if (!modal || !title || !content) return;
    content.innerHTML = "";

    if (category.startsWith('climate-')) {
        const room = category.split('-')[1];
        title.innerHTML = `🌡️ Thermostat ${room.charAt(0).toUpperCase() + room.slice(1)}`;
        let temp = localStorage.getItem(`temp-${room}`) || "22";

        content.innerHTML = `<div class="popup-content-box"><h3 class="popup-subtitle">Temperature Setting</h3><div class="popup-val-display"><span id="popup-temp-${room}">${formatTemperature(parseFloat(temp))}</span></div><div class="popup-ctrl-row"><button data-action="adjust-temp-popup" data-room="${room}" data-dir="minus" class="popup-ctrl-btn">−</button><button data-action="adjust-temp-popup" data-room="${room}" data-dir="plus" class="popup-ctrl-btn">+</button></div></div>`;
        modal.classList.add('active');
        return;
    }
    const disp = subDevices[category][elementIndex];
    title.innerHTML = `${disp.icon} ${disp.name}`;
    let contentHtml = '';
    if (category === 'plugs') {
        contentHtml = `<div class="popup-content-box"><div class="popup-subtitle">Current Power in ${disp.room}</div><div class="popup-val-display">${calculatePlugConsumption(disp)} W</div><div class="popup-details">Devices: <strong>${disp.details}</strong></div><button class="sensor-action-btn" data-action="toggle-device-popup" data-cat="${category}" data-idx="${elementIndex}" style="background-color: ${disp.state === 'On' ? 'var(--success-color)' : '#95a5a6'};">Plug Power: ${disp.state}</button></div>`;
    } else {
        contentHtml = `<div class="popup-action-row"><button class="sensor-action-btn" data-action="toggle-device-popup" data-cat="${category}" data-idx="${elementIndex}" style="background-color: ${['On', 'Cleaning', 'Unlocked', 'Active', 'Open', 'LIVE', 'Auto', 'Boost'].includes(disp.state) ? 'var(--success-color)' : '#95a5a6'};">Change State (Current: ${disp.state})</button></div>`;
        const path = window.location.pathname;
        const basePath = (path.includes('/html/') || path.includes('/dist/') || path.includes('\\dist\\')) ? '../assets' : 'assets';
        if (category === 'videoCameras') {
            contentHtml += `<div class="camera-feed-box">${disp.state === 'LIVE' ? `<span class="camera-live-badge">🔴 LIVE REC</span><img src="${basePath}/camera-feed.jpg" class="camera-feed-img">` : '<span class="camera-offline">[ Camera Feed Offline ]</span>'}</div>`;
        }
        if (['bulbs', 'audio', 'blinds', 'rgbLights'].includes(category)) {
            const isOff = disp.state === 'Off' || disp.state === 'Closed';
            contentHtml += `
                <div class="slider-container ${isOff ? 'disabled-controls' : ''}">
                    <div class="slider-header">
                        <label>Intensity / Volume:</label>
                        <label class="slider-val"><span id="val-${category}-${elementIndex}">${disp.value}</span>%</label>
                    </div>
                    <input type="range" min="0" max="100" value="${disp.value}" ${isOff ? 'disabled' : ''} class="device-slider" data-action="device-slider-input" data-cat="${category}" data-idx="${elementIndex}">
                </div>`;
        }
    }

    contentHtml += `<div class="popup-action-row" style="margin-top: 15px;"><button class="sensor-action-btn" data-action="delete-device-popup" data-cat="${category}" data-idx="${elementIndex}" style="background-color: var(--error-color);"><i class="ph-bold ph-trash"></i> Delete Accessory</button></div>`;

    content.innerHTML = contentHtml;
    modal.classList.add('active');
}

function openActiveLightsPopup() {
    const modal = document.getElementById('popup-device');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    if (!modal || !title || !content) return;

    title.innerHTML = "<i class='ph-fill ph-lightbulb'></i> Active Lights in Home";
    content.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.className = 'popup-list-container';

    const fragment = document.createDocumentFragment();
    let hasLights = false;

    (subDevices.bulbs || []).forEach((bulb, idx) => {
        if (bulb.state === "On") {
            hasLights = true;
            const item = document.createElement('div');
            item.className = 'popup-list-item';
            item.dataset.action = 'open-device-menu';
            item.dataset.cat = 'bulbs';
            item.dataset.idx = idx;
            item.innerHTML = `<div class="popup-list-left"><span class="popup-item-icon warning"><i class="ph-fill ph-lightbulb"></i></span><div><strong class="popup-item-title">${bulb.name}</strong><span class="popup-item-desc">${bulb.room} • ${bulb.value}%</span></div></div><button data-action="toggle-and-refresh-lights" data-cat="bulbs" data-idx="${idx}" class="popup-item-btn error">Turn Off</button>`;
            fragment.appendChild(item);
        }
    });
    (subDevices.rgbLights || []).forEach((lamp, idx) => {
        if (lamp.state === "On") {
            hasLights = true;
            const item = document.createElement('div');
            item.className = 'popup-list-item';
            item.dataset.action = 'open-device-menu';
            item.dataset.cat = 'rgbLights';
            item.dataset.idx = idx;
            item.innerHTML = `<div class="popup-list-left"><span class="popup-item-icon accent"><i class="ph-fill ph-lamp"></i></span><div><strong class="popup-item-title">${lamp.name}</strong><span class="popup-item-desc">${lamp.room} • ${lamp.value}%</span></div></div><button data-action="toggle-and-refresh-lights" data-cat="rgbLights" data-idx="${idx}" class="popup-item-btn error">Turn Off</button>`;
            fragment.appendChild(item);
        }
    });

    if (!hasLights) {
        content.innerHTML = `<div class="popup-empty-text">All lights are turned off!</div>`;
    } else {
        listContainer.appendChild(fragment);
        content.appendChild(listContainer);
    }

    modal.classList.add('active');
}

function openActiveAudioPopup() {
    const modal = document.getElementById('popup-device');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    if (!modal || !title || !content) return;

    title.innerHTML = "<i class='ph-fill ph-speaker-high'></i> Active Audio Systems";
    content.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.className = 'popup-list-container';
    const fragment = document.createDocumentFragment();
    let hasAudio = false;

    (subDevices.audio || []).forEach((speaker, idx) => {
        if (speaker.state === "On") {
            hasAudio = true;
            const item = document.createElement('div');
            item.className = 'popup-list-item';
            item.dataset.action = 'open-device-menu';
            item.dataset.cat = 'audio';
            item.dataset.idx = idx;
            item.innerHTML = `<div class="popup-list-left"><span class="popup-item-icon accent"><i class="ph-fill ph-speaker-high"></i></span><div><strong class="popup-item-title">${speaker.name}</strong><span class="popup-item-desc">${speaker.room} • Volume: ${speaker.value}%</span></div></div><button data-action="toggle-and-refresh-audio" data-cat="audio" data-idx="${idx}" class="popup-item-btn error">Turn Off</button>`;
            fragment.appendChild(item);
        }
    });

    if (!hasAudio) {
        content.innerHTML = `<div class="popup-empty-text">All audio systems are turned off!</div>`;
    } else {
        listContainer.appendChild(fragment);
        content.appendChild(listContainer);
    }

    modal.classList.add('active');
}

function openCreateScenePopup() {
    const modal = document.getElementById('popup-device');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;
    title.innerHTML = "🎭 Create New Scene";
    content.innerHTML = `<div class="form-row"><label>Scene Name:</label><input type="text" id="custom-scene-name" class="form-input" placeholder="e.g.: Party Mode, Relaxing..."></div><div class="form-row"><label>Suggestive Emoji:</label><select id="custom-scene-emoji" class="form-input"><option value="🎉">🎉 Party / Fun</option><option value="🍃">🍃 Relax / Fresh</option><option value="💻">💻 Office / Work</option></select></div><div class="form-row"><label>Short Description:</label><input type="text" id="custom-scene-desc" class="form-input" placeholder="e.g.: Turn off all electronics in the house."></div><div class="form-row"><label>Behavior Template:</label><select id="custom-scene-template" class="form-input"><option value="away">Away Mode (Turn off all + Active alarms)</option><option value="night">Night Mode (Dark ambient + Locked doors)</option><option value="morning">Morning Mode (Open windows/blinds)</option></select></div><button onclick="saveNewCustomScene()" class="btn-full-success">💾 Create Scene</button>`;
    modal.classList.add('active');
}

function openAutomationModal() {
    const modal = document.getElementById('popup-automation');
    if (!modal) return;
    const selectTrigger = document.getElementById('auto-trigger-dev');
    const selectAction = document.getElementById('auto-action-dev');
    let optionsHTML = '';
    Object.keys(subDevices).forEach(cat => {
        (subDevices[cat] || []).forEach((disp, idx) => {
            optionsHTML += `<option value="${cat}_${idx}">${disp.name} (${disp.room})</option>`;
        });
    });
    selectTrigger.innerHTML = optionsHTML;
    selectAction.innerHTML = optionsHTML;
    modal.classList.add('active');
}

function openAllNotificationsPopup() {
    const modal = document.getElementById('popup-device');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    if (!modal || !title || !content) return;

    title.innerHTML = "🔔 All Home Notifications";
    const allNotifications = generateNotificationsList();

    content.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const listContainer = document.createElement('div');
    listContainer.className = 'popup-list-container';
    listContainer.style.cssText = "max-height: 250px; padding-right: 5px; margin-bottom: 15px; text-align: left; gap: 8px;";

    allNotifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = 'notification-item card-style';
        if (notif.id === "notif_lights") {
            item.dataset.action = "open-popup-lights";
            item.classList.add('hover-accent');
            item.innerHTML = `<span>${notif.text} <span class="notif-hint">(Click for details)</span></span>`;
        } else if (notif.id === "notif_audio") {
            item.dataset.action = "open-popup-audio";
            item.classList.add('hover-accent');
            item.innerHTML = `<span>${notif.text} <span class="notif-hint">(Click for details)</span></span>`;
        } else if (notif.action) {
            item.classList.add('hover-accent');
            item.setAttribute('onclick', notif.action);
            item.innerHTML = `<span>${notif.text}</span>`;
        } else {
            item.innerHTML = `<span>${notif.text}</span>`;
        }
        listContainer.appendChild(item);
    });

    if (allNotifications.length === 0) listContainer.innerHTML = `<div class="popup-empty-text">No active notifications.</div>`;

    fragment.appendChild(listContainer);
    const actionRow = document.createElement('div');
    actionRow.className = 'popup-action-row';
    actionRow.innerHTML = `<button data-action="clear-motion-history" class="btn-clear-history"><i class="ph-bold ph-trash"></i> Clear Motion History</button>`;
    fragment.appendChild(actionRow);

    content.appendChild(fragment);
    modal.classList.add('active');
}

function closePopup() {
    const modal = document.getElementById('popup-device');
    applyFadeOutAndClose(modal);
}

function closeHistoryPopup() {
    const modal = document.getElementById('popup-history');
    applyFadeOutAndClose(modal);
}

function closeAutomationPopup() {
    const modal = document.getElementById('popup-automation');
    applyFadeOutAndClose(modal);
}

window.onclick = function (event) {
    const m1 = document.getElementById('popup-device');
    const m2 = document.getElementById('popup-automation');
    const m3 = document.getElementById('popup-history');
    const m4 = document.getElementById('popup-pin-alarm');

    if (event.target === m1) {
        closePopup();
    }
    if (event.target === m2) {
        closeAutomationPopup();
    }
    if (event.target === m3) {
        closeHistoryPopup();
    }
    if (event.target === m4) {
        if (typeof closePinPopup === 'function') {
            closePinPopup();
        } else {
            applyFadeOutAndClose(m4);
        }
    }
};

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closePopup();
        closeAutomationPopup();
        closeHistoryPopup();
        if (typeof closePinPopup === 'function') closePinPopup();
    }
});

function syncDOMWithMemory() {
    Object.keys(subDevices).forEach(cat => {
        (subDevices[cat] || []).forEach((disp, idx) => {
            updateCardInDOM(cat, idx, true);
        });
    });

    const activeSceneId = localStorage.getItem('activeScene');
    document.querySelectorAll('.hk-card[data-action="execute-scene"]').forEach(card => {
        if (card.dataset.sceneid === activeSceneId) card.classList.add('is-active');
        else card.classList.remove('is-active');
    });

    updateGlobalStatus();
    if (document.getElementById('notifications-container')) displayHomeNotifications();
}

function updateCardInDOM(cat, index, skipGlobal = false) {
    const uniqueId = `${cat}_${index}`;
    const disp = subDevices[cat][index];
    if (!disp) return;

    const isActive = ['On', 'Cleaning', 'Unlocked', 'Active', 'Open', 'LIVE', 'Auto', 'Boost', 'Danger', 'SMOKE DETECTED!', 'WATER DETECTED!'].includes(disp.state);

    const cards = document.querySelectorAll(`.hk-card[data-id="${uniqueId}"]`);
    cards.forEach(card => {
        if (isActive) card.classList.add('is-active');
        else card.classList.remove('is-active');

        card.classList.remove('alarm-fire', 'alarm-water');

        if (disp.state === 'Danger' || disp.state === 'SMOKE DETECTED!') {
            card.classList.add('alarm-fire');
        } else if (disp.state === 'WATER DETECTED!') {
            card.classList.add('alarm-water');
        }

        const stateEl = card.querySelector('.hk-state');
        if (stateEl) {
            let displayState = disp.state;
            if (cat && (cat.toLowerCase().includes('climate') || cat.toLowerCase().includes('thermostat') || cat.toLowerCase().includes('sensor') || cat.toLowerCase().includes('dehumid')) && !isNaN(parseFloat(disp.state))) {
                const lowerName = (disp.name || "").toLowerCase();
                const lowerCat = cat.toLowerCase();
                if (lowerName.includes('dehumid') || lowerName.includes('humid') || lowerCat.includes('dehumid') || lowerCat.includes('humid')) {
                    displayState = `${disp.state}%`;
                } else {
                    displayState = formatTemperature(parseFloat(disp.state));
                }
            }
            stateEl.innerText = `${displayState} ${disp.room ? `• ${disp.room}` : ''}`;
        }
    });

    if (!skipGlobal) {
        updateGlobalStatus();
        if (document.getElementById('notifications-container')) {
            displayHomeNotifications();
            renderMostUsed();
        }
    }

    const popup = document.getElementById('popup-device');
    if (popup && popup.classList.contains('active')) {
        const btn = popup.querySelector('.sensor-action-btn');
        if (btn && btn.dataset.cat === cat && parseInt(btn.dataset.idx) === index) {
            btn.style.backgroundColor = isActive ? 'var(--success-color)' : '#95a5a6';
            btn.innerText = `Change State (Current: ${disp.state})`;
        }
    }
}

function showToast(message, opts = {}) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const existingToasts = container.querySelectorAll('.toast-notification');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.borderLeft = `4px solid ${opts.isError ? 'var(--error-color)' : 'var(--success-color)'}`;

    const icon = opts.isError ? '<i class="ph-bold ph-warning-circle" style="color: var(--error-color); font-size: 1.2em;"></i>' : '<i class="ph-bold ph-check-circle" style="color: var(--success-color); font-size: 1.2em;"></i>';

    let htmlContent = `${icon} <span>${message}</span>`;

    if (opts.withUndo) {
        htmlContent += `<button class="undo-btn" style="background: rgba(255,255,255,0.2); color: inherit; border: none; padding: 4px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Undo</button>`;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    if (opts.withUndo && opts.undoAction) {
        toast.querySelector('.undo-btn').addEventListener('click', () => {
            opts.undoAction();
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
            showToast('Action was canceled.', { isError: false });
        });
    }

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (opts.callback) opts.callback();
        });
    }, 3500);
}

const originalShowToast = showToast;
showToast = function (message, arg2, arg3) {
    if (typeof arg2 === 'object' && arg2 !== null) {
        return originalShowToast(message, arg2);
    }
    let opts = {};
    if (typeof arg2 === 'boolean') {
        opts.isError = arg2;
    }
    if (typeof arg3 === 'function') {
        opts.callback = arg3;
    }
    return originalShowToast(message, opts);
};

function openAddAccessoryModal() {
    const modal = document.getElementById('popup-add-accessory');
    if (modal) modal.classList.add('active');
}

function closeAddAccessoryModal() {
    const modal = document.getElementById('popup-add-accessory');
    if (modal) applyFadeOutAndClose(modal);
}

function saveNewAccessory() {
    const name = document.getElementById('new-acc-name').value.trim();
    const category = document.getElementById('new-acc-category').value;
    const room = document.getElementById('new-acc-room').value;

    if (!name) {
        showToast("Please enter a name for the accessory!", true);
        return;
    }

    if (!subDevices[category]) {
        subDevices[category] = [];
    }

    let defaultIcon = '<i class="ph-fill ph-check-circle"></i>';
    let defaultState = 'Off';
    let defaultValue = 0;

    switch (category) {
        case 'bulbs': defaultIcon = '<i class="ph-fill ph-lightbulb"></i>'; defaultValue = 100; break;
        case 'rgbLights': defaultIcon = '<i class="ph-fill ph-lamp"></i>'; defaultValue = 100; break;
        case 'plugs': defaultIcon = '<i class="ph-fill ph-plug"></i>'; defaultState = 'On'; break;
        case 'appliances': defaultIcon = '<i class="ph-fill ph-coffee"></i>'; break;
        case 'audio': defaultIcon = '<i class="ph-fill ph-speaker-high"></i>'; defaultValue = 30; break;
        case 'tv': defaultIcon = '<i class="ph-fill ph-television"></i>'; break;
        case 'contactSensors': defaultIcon = '<i class="ph-fill ph-door"></i>'; defaultState = 'Closed'; break;
        case 'motionSensors': defaultIcon = '<i class="ph-fill ph-person-simple-walk"></i>'; defaultState = 'Inactive'; break;
        case 'blinds': defaultIcon = '<i class="ph-fill ph-blinds"></i>'; defaultState = 'Closed'; defaultValue = 0; break;
    }

    const newAccessory = {
        name: name,
        state: defaultState,
        room: room,
        icon: defaultIcon
    };

    if (['bulbs', 'rgbLights', 'audio', 'blinds'].includes(category)) {
        newAccessory.value = defaultValue;
    }
    if (category === 'rgbLights') {
        newAccessory.color = '#ffffff';
    }
    if (category === 'plugs') {
        newAccessory.consumption = 0;
        newAccessory.details = "Standard Plug";
    }

    subDevices[category].push(newAccessory);
    saveState();
    addToLog(`New accessory added: ${name} (${room})`);

    closeAddAccessoryModal();
    document.getElementById('new-acc-name').value = '';

    showToast("Accessory added successfully!");
    reloadInterface();
}

export {
    applyFadeOutAndClose, reloadInterface, switchDashboardChartType, switchDashboardPeriod,
    renderDashboardChart, renderHome, renderAccessories, renderScenes, renderSecurity,
    renderTemplates, renderAutomations, renderStatisticsLogs, buildCardHTML,
    buildSceneHTML, displayHomeNotifications, generateNotificationsList, updateGlobalStatus,
    openDeviceMenu, openActiveLightsPopup, openActiveAudioPopup,
    openCreateScenePopup, openAutomationModal, openAllNotificationsPopup,
    closePopup, closeHistoryPopup, closeAutomationPopup, syncDOMWithMemory,
    updateCardInDOM, showToast, openAddAccessoryModal, closeAddAccessoryModal, saveNewAccessory
};

window.switchDashboardChartType = switchDashboardChartType;
window.switchDashboardPeriod = switchDashboardPeriod;
window.closePopup = closePopup;
window.closeHistoryPopup = closeHistoryPopup;
window.closeAutomationPopup = closeAutomationPopup;
window.openCreateScenePopup = openCreateScenePopup;
window.openAutomationModal = openAutomationModal;
window.showToast = showToast;
window.reloadInterface = reloadInterface;
window.openDeviceMenu = openDeviceMenu;
window.openActiveLightsPopup = openActiveLightsPopup;
window.openActiveAudioPopup = openActiveAudioPopup;
window.openAllNotificationsPopup = openAllNotificationsPopup;
window.syncDOMWithMemory = syncDOMWithMemory;
window.updateCardInDOM = updateCardInDOM;
window.renderHome = renderHome;
window.renderAccessories = renderAccessories;
window.renderScenes = renderScenes;
window.renderSecurity = renderSecurity;
window.renderTemplates = renderTemplates;
window.renderAutomations = renderAutomations;
window.applyFadeOutAndClose = applyFadeOutAndClose;
window.openAddAccessoryModal = openAddAccessoryModal;
window.closeAddAccessoryModal = closeAddAccessoryModal;
window.saveNewAccessory = saveNewAccessory;