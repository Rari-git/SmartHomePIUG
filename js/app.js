import { defaultScenes, recommendedTemplates, defaultDevices } from './data.js';
import {
    reloadInterface, updateCardInDOM, syncDOMWithMemory,
    displayHomeNotifications, buildSceneHTML, buildCardHTML,
    openDeviceMenu, openActiveLightsPopup, openActiveAudioPopup,
    openAllNotificationsPopup, applyFadeOutAndClose, closePopup,
    openCreateScenePopup, openAutomationModal, openAddAccessoryModal, closeAddAccessoryModal
} from './ui.js';
import { getTempUnit, convertTemp, showToast } from './utils.js';
import { hardwareService } from './services/hardwareService.js';

export let vacationInterval = null;
export let customScenesList = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
export let scenesDB = [...defaultScenes, ...customScenesList];
export let subDevices = {};
export let currentPinEntered = "";
export let alarmActionMode = "";
export let stateSaveTimeout = null;

const DB_NAME = 'SmartHomeDB';
const STORE_NAME = 'stateStore';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            event.target.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function setItemDB(key, value) {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

async function getItemDB(key) {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : null;
    }
}

initIntro();

document.addEventListener('DOMContentLoaded', async () => {
    await initFavorites();
    loadHomeName();
    reloadInterface();
    fetchWeather();
    if (typeof updateClimateAverages === 'function') updateClimateAverages();

    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');

        if (action === 'toggle-device') {
            toggleDeviceState(target.dataset.cat, parseInt(target.dataset.idx), e);
        } else if (action === 'toggle-favorite') {
            e.stopPropagation(); toggleFavorite(target.dataset.favid, target.dataset.favtype, e);
        } else if (action === 'open-device-menu') {
            e.stopPropagation(); openDeviceMenu('none', target.dataset.cat, parseInt(target.dataset.idx));
        } else if (action === 'execute-scene') {
            executeScene(target.dataset.sceneid);
        } else if (action === 'delete-scene') {
            e.stopPropagation(); deleteCustomScene(target.dataset.sceneid, e);
        } else if (action === 'toggle-device-popup') {
            toggleDeviceState(target.dataset.cat, parseInt(target.dataset.idx), e);
            openDeviceMenu('none', target.dataset.cat, parseInt(target.dataset.idx));
        } else if (action === 'delete-automation') {
            deleteAutomation(parseInt(target.dataset.autoid));
        } else if (action === 'add-suggestion') {
            addSuggestion(target.dataset.sugid);
        } else if (action === 'adjust-temp-popup') {
            adjustFromPopup(target.dataset.room, target.dataset.dir);
        } else if (action === 'open-popup-lights') {
            openActiveLightsPopup();
        } else if (action === 'open-popup-audio') {
            openActiveAudioPopup();
        } else if (action === 'open-popup-all-notifs') {
            openAllNotificationsPopup();
        } else if (action === 'clear-motion-history') {
            localStorage.setItem('motionLogs', '[]'); displayHomeNotifications(); closePopup();
        } else if (action === 'toggle-and-refresh-lights') {
            e.stopPropagation(); toggleDeviceState(target.dataset.cat, parseInt(target.dataset.idx), e); openActiveLightsPopup();
        } else if (action === 'toggle-and-refresh-audio') {
            e.stopPropagation(); toggleDeviceState(target.dataset.cat, parseInt(target.dataset.idx), e); openActiveAudioPopup();
        } else if (action === 'delete-device-popup') {
            e.stopPropagation(); deleteAccessory(target.dataset.cat, parseInt(target.dataset.idx));
        } else if (action === 'close-popup') {
            closePopup();
        } else if (action === 'close-pin-popup') {
            closePinPopup();
        } else if (action === 'press-pin') {
            pressPinKey(target.dataset.val);
        } else if (action === 'save-scene') {
            saveNewCustomScene();
        } else if (action === 'open-automation-modal') {
            openAutomationModal();
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
            if (subDevices[e.target.dataset.cat] && subDevices[e.target.dataset.cat][e.target.dataset.idx]) {
                subDevices[e.target.dataset.cat][e.target.dataset.idx].value = e.target.value;
                saveState();
            }
        } else if (e.target.matches('[data-action="toggle-automation"]')) {
            toggleAutomation(parseInt(e.target.dataset.autoid));
        }
    });
});

setInterval(checkTimeAutomations, 60000);

function stopVacationInterval() {
    if (vacationInterval) {
        clearInterval(vacationInterval);
        vacationInterval = null;
    }
}

window.addEventListener('beforeunload', () => {
    stopVacationInterval();
    if (stateSaveTimeout) {
        clearTimeout(stateSaveTimeout);
        localStorage.setItem('smartHomeData_fallback', JSON.stringify(subDevices));
    }
});

function initIntro() {
    if (sessionStorage.getItem('introShown')) {
        document.body.classList.add('app-loaded');
        return;
    }

    const isHtmlFolder = window.location.pathname.includes('/html/');
    const basePath = isHtmlFolder ? '../assets' : 'assets';

    const introDiv = document.createElement('div');
    introDiv.id = 'app-intro';
    introDiv.style.opacity = '1';
    introDiv.innerHTML = `
        <img src="${basePath}/logo.svg" alt="Lumen Logo" class="intro-logo">
        <div class="intro-text">Lumen</div>
    `;

    document.documentElement.classList.add('hide-scrollbar');
    (document.body || document.documentElement).appendChild(introDiv);

    const playIntro = () => {
        introDiv.classList.add('start-anim');

        setTimeout(() => {
            introDiv.classList.add('hidden');
            document.body.classList.add('app-loaded');
            setTimeout(() => {
                introDiv.remove();
                document.documentElement.classList.remove('hide-scrollbar');
            }, 600);
        }, 2500);
    };

    if (document.readyState === 'complete') {
        playIntro();
    } else {
        window.addEventListener('load', playIntro);
    }

    sessionStorage.setItem('introShown', 'true');
}

async function initFavorites() {
    try {
        const fallback = localStorage.getItem('smartHomeData_fallback');
        let saved = null;

        if (fallback) {
            saved = JSON.parse(fallback);
            localStorage.removeItem('smartHomeData_fallback');
            await setItemDB('smartHomeData', saved);
        } else {
            saved = await getItemDB('smartHomeData');
            if (!saved && localStorage.getItem('smartHomeData')) {
                saved = JSON.parse(localStorage.getItem('smartHomeData'));
                await setItemDB('smartHomeData', saved);
            }
        }

        subDevices = saved ? saved : null;

        if (!subDevices || !subDevices.bulbs || !localStorage.getItem('design_svg_assets_v6')) {
            subDevices = JSON.parse(JSON.stringify(defaultDevices));
            await setItemDB('smartHomeData', subDevices);
            localStorage.setItem('design_svg_assets_v6', 'true');
        }
    } catch (e) {
        subDevices = JSON.parse(JSON.stringify(defaultDevices));
        await setItemDB('smartHomeData', subDevices);
        localStorage.setItem('design_svg_assets_v6', 'true');
    }
    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['bulbs_1', 'tv_1', 'locks_0', 'videoCameras_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
    if (!localStorage.getItem('userAutomations')) localStorage.setItem('userAutomations', JSON.stringify([]));
}

function saveState() {
    if (stateSaveTimeout) clearTimeout(stateSaveTimeout);
    stateSaveTimeout = setTimeout(async () => {
        try {
            await setItemDB('smartHomeData', subDevices);
        } catch (e) {
            console.error("Async storage error:", e);
        }
        stateSaveTimeout = null;
    }, 500);
}

function loadHomeName() {
    const homeTitle = document.getElementById('home-name-global');
    if (homeTitle) homeTitle.innerText = localStorage.getItem('savedHomeName') || "My Home";
}

function openPinPopup(mode) {
    alarmActionMode = mode;
    currentPinEntered = "";
    const modal = document.getElementById('popup-pin-alarm');
    const display = document.getElementById('pin-display');
    const error = document.getElementById('pin-error-msg');
    if (display) display.innerText = "";
    if (error) error.style.display = "none";
    if (modal) modal.classList.add('active');
}

function closePinPopup() {
    const modal = document.getElementById('popup-pin-alarm');
    if (typeof applyFadeOutAndClose === 'function') {
        applyFadeOutAndClose(modal);
    } else {
        if (modal) modal.classList.remove('active');
    }
}

function pressPinKey(key) {
    const display = document.getElementById('pin-display');
    const error = document.getElementById('pin-error-msg');
    if (error) error.style.display = "none";

    if (key === 'C') {
        currentPinEntered = "";
    } else if (key === '⌫') {
        currentPinEntered = currentPinEntered.slice(0, -1);
    } else {
        if (currentPinEntered.length < 4) {
            currentPinEntered += key;
        }
    }

    if (display) display.innerText = "•".repeat(currentPinEntered.length);

    if (currentPinEntered.length === 4) {
        setTimeout(verifyEnteredPin, 200);
    }
}

function verifyEnteredPin() {
    const savedPin = localStorage.getItem('alarmPinCode') || "1234";
    if (currentPinEntered === savedPin) {
        closePinPopup();
        if (alarmActionMode === 'armed') {
            executeTotalSecurity();
        } else if (alarmActionMode === 'disarmed') {
            localStorage.setItem('alarmDeactivated', 'true');
            if (subDevices.locks) subDevices.locks.forEach(u => u.state = "Unlocked");
            if (subDevices.motionSensors) subDevices.motionSensors.forEach(s => s.state = "Inactive");
            saveState();
            if (typeof addToLog === 'function') addToLog("🛡️ Security: System disarmed via PIN code.");
            if (typeof showToast === 'function') showToast("Security system disarmed.");
        } else if (alarmActionMode === 'scene_home') {
            localStorage.setItem('alarmDeactivated', 'true');
            localStorage.setItem('activeScene', 's_home');
            const scene = scenesDB.find(s => s.id === 's_home');
            if (scene && scene.action) typeof scene.action === 'function' ? scene.action() : applyMode(scene.action);
            if (typeof addToLog === 'function') addToLog("🎭 Scene: I'm Home scene activated after PIN confirmation.");
            if (typeof showToast === 'function') showToast("I'm Home scene activated.");
        }
        if (typeof syncDOMWithMemory === 'function') syncDOMWithMemory(); else reloadInterface();
    } else {
        currentPinEntered = "";
        const display = document.getElementById('pin-display');
        const error = document.getElementById('pin-error-msg');
        if (display) display.innerText = "";
        if (error) error.style.display = "block";
    }
}

function saveNewPinCode() {
    const oldPinInput = document.getElementById('input-old-pin');
    const newPinInput = document.getElementById('input-new-pin');
    if (!oldPinInput || !newPinInput) return;

    const oldPin = oldPinInput.value;
    const newPin = newPinInput.value;
    const savedPin = localStorage.getItem('alarmPinCode') || "1234";

    if (oldPin !== savedPin) {
        if (typeof showToast === 'function') showToast("❌ Current PIN code is incorrect!");
        return;
    }
    if (newPin.length !== 4 || isNaN(newPin)) {
        if (typeof showToast === 'function') showToast("❌ New code must be 4 digits!");
        return;
    }

    localStorage.setItem('alarmPinCode', newPin);
    oldPinInput.value = "";
    newPinInput.value = "";
    if (typeof showToast === 'function') showToast("✅ PIN code updated successfully.");
}

function toggleFavorite(id, type, event) {
    if (event) event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(type === 'scene' ? 'favScenes' : 'favAcc')) || [];

    const isFav = favs.includes(id);
    if (isFav) {
        favs = favs.filter(item => item !== id);
    } else {
        favs.push(id);
    }

    localStorage.setItem(type === 'scene' ? 'favScenes' : 'favAcc', JSON.stringify(favs));

    const starBtns = document.querySelectorAll(`[data-favid="${id}"]`);
    starBtns.forEach(btn => {
        if (isFav) btn.classList.remove('is-fav');
        else btn.classList.add('is-fav');
    });

    const containerId = type === 'scene' ? 'fav-scenes-container' : 'fav-accessories-container';
    const container = document.getElementById(containerId);

    if (container) {
        if (isFav) {
            const card = container.querySelector(`.hk-card[data-id="${id}"]`);
            if (card) card.remove();
            if (container.children.length === 0) container.innerHTML = `<div class="popup-empty-text">${type === 'scene' ? 'No favorite scenes.' : 'No favorite accessories.'}</div>`;
        } else {
            const emptyText = container.querySelector('.popup-empty-text');
            if (emptyText) emptyText.remove();

            let html = '';
            if (type === 'scene') {
                const scene = scenesDB.find(s => s.id === id);
                if (scene) html = buildSceneHTML(scene, true);
            } else {
                const [cat, idx] = id.split('_');
                if (subDevices[cat] && subDevices[cat][idx]) html = buildCardHTML(subDevices[cat][idx], cat, idx, true);
            }
            container.insertAdjacentHTML('beforeend', html);
        }
    }
}

function toggleDeviceState(cat, index, event) {
    if (event) event.stopPropagation();
    localStorage.removeItem('activeScene');
    stopVacationInterval();

    const disp = subDevices[cat][index];
    const stateDictionary = {
        'locks': { 'Locked': 'Unlocked', 'Unlocked': 'Locked' },
        'contactSensors': { 'Closed': 'Open', 'Open': 'Closed' },
        'blinds': { 'Closed': 'Open', 'Open': 'Closed' },
        'videoCameras': { 'Standby': 'LIVE', 'LIVE': 'Standby' },
        'motionSensors': { 'Inactive': 'Active', 'Active': 'Inactive' },
        'vacuum': { 'Docked': 'Cleaning', 'Cleaning': 'Docked' }
    };

    let newState = disp.state === "On" ? "Off" : "On";

    if (stateDictionary[cat]) {
        let defaultState = 'Closed';
        if (cat === 'locks') defaultState = 'Locked';
        else if (cat === 'videoCameras') defaultState = 'Standby';
        else if (cat === 'motionSensors') defaultState = 'Inactive';
        else if (cat === 'vacuum') defaultState = 'Docked';
        newState = stateDictionary[cat][disp.state] || defaultState;
    } else if (cat === 'purifier') {
        newState = disp.state === "Off" ? "Auto" : (disp.state === "Auto" ? "Boost" : "Off");
    }

    hardwareService.setDeviceState(cat, index, newState).then((res) => {
        if (!res.success) return;

        if (cat === 'motionSensors' && newState === "Active") {
            let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
            logs.unshift({ room: disp.room, time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) });
            localStorage.setItem('motionLogs', JSON.stringify(logs.slice(0, 15)));
        }

        if (typeof addToLog === 'function') {
            addToLog(`${disp.name || 'Device'} switched to state [${newState}]`);
        }

        const deviceId = `${cat}_${index}`;
        let usage = JSON.parse(localStorage.getItem('deviceUsage')) || {};
        usage[deviceId] = (usage[deviceId] || 0) + 1;
        localStorage.setItem('deviceUsage', JSON.stringify(usage));

        checkAutomationRules(cat, index, newState);
        saveState();
    });
}

function checkTimeAutomations() {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    let changed = false;
    rules.forEach(rule => {
        if (rule.active && rule.triggerType === 'time' && rule.tTime === currentTime) {
            const actionDisp = subDevices[rule.aCat] && subDevices[rule.aCat][rule.aIdx];
            if (actionDisp && actionDisp.state !== rule.aState) {
                actionDisp.state = rule.aState;
                rule.lastRun = `Today at ${currentTime}`;
                changed = true;
            }
        }
    });
    if (changed) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        saveState();
        if (typeof syncDOMWithMemory === 'function') syncDOMWithMemory(); else reloadInterface();
    }
}

function checkAutomationRules(triggerCat, triggerIdx, newState) {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let changed = false;
    rules.forEach(rule => {
        if (rule.active && rule.triggerType === 'dev' && rule.tCat === triggerCat && rule.tIdx === triggerIdx.toString() && rule.tState === newState) {
            const actionDisp = subDevices[rule.aCat] && subDevices[rule.aCat][rule.aIdx];
            if (actionDisp) {
                actionDisp.state = rule.aState;
                rule.lastRun = `Today at ${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}`;
                changed = true;
            }
        }
    });
    if (changed) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        saveState();
    }
}

function saveAutomation() {
    const isTime = typeof currentTriggerMode !== 'undefined' && currentTriggerMode === 'time';
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;
    const actionName = subDevices[aVal[0]][aVal[1]].name;
    let rule = { id: Date.now(), active: true, lastRun: "Never", aCat: aVal[0], aIdx: aVal[1], aState: aState };

    if (isTime) {
        const timeVal = document.getElementById('auto-trigger-time').value;
        if (!timeVal) return;
        rule.triggerType = 'time';
        rule.tTime = timeVal;
        rule.desc = `⏰ Daily at ${timeVal} ➔ ${actionName} becomes ${aState}`;
    } else {
        const tVal = document.getElementById('auto-trigger-dev').value.split('_');
        const tState = document.getElementById('auto-trigger-state').value;
        rule.triggerType = 'dev';
        rule.tCat = tVal[0];
        rule.tIdx = tVal[1];
        rule.tState = tState;
        rule.desc = `IF ${subDevices[tVal[0]][tVal[1]].name} is ${tState} ➔ ${actionName} becomes ${aState}`;
    }

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.unshift(rule);
    localStorage.setItem('userAutomations', JSON.stringify(rules));

    if (typeof closeAutomationPopup === 'function') {
        closeAutomationPopup();
    } else {
        const modal = document.getElementById('popup-automation');
        if (modal) modal.classList.remove('active');
    }
    renderTemplates();
    renderAutomations();
}

function addSuggestion(idSuggestion) {
    const sug = recommendedTemplates.find(s => s.idSuggestion === idSuggestion);
    if (!sug) return;
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let newRule = {
        id: Date.now(),
        active: true,
        lastRun: "Never",
        idSuggestion: sug.idSuggestion,
        triggerType: sug.triggerType,
        desc: sug.desc,
        aCat: sug.aCat,
        aIdx: sug.aIdx,
        aState: sug.aState
    };
    if (sug.triggerType === 'time') {
        newRule.tTime = sug.tTime;
    } else {
        newRule.tCat = sug.tCat;
        newRule.tIdx = sug.tIdx;
        newRule.tState = sug.tState;
    }
    rules.unshift(newRule);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    renderTemplates();
    renderAutomations();
}

function deleteAutomation(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    localStorage.setItem('userAutomations', JSON.stringify(rules.filter(r => r.id !== id)));
    renderTemplates();
    renderAutomations();
}

function toggleAutomation(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const rule = rules.find(r => r.id === id);
    if (rule) {
        rule.active = !rule.active;
        localStorage.setItem('userAutomations', JSON.stringify(rules));

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

function adjustFromPopup(room, direction) {
    let valC = parseFloat(localStorage.getItem(`temp-${room}`)) || 22;
    let unit = getTempUnit();
    let valDisp = unit === 'F' ? Math.round(valC * 9 / 5 + 32) : Math.round(valC);

    valDisp = direction === 'plus' ? valDisp + 1 : valDisp - 1;

    if (unit === 'F') {
        if (valDisp < 59) valDisp = 59;
        if (valDisp > 86) valDisp = 86;
        valC = (valDisp - 32) * 5 / 9;
    } else {
        if (valDisp < 15) valDisp = 15;
        if (valDisp > 30) valDisp = 30;
        valC = valDisp;
    }
    localStorage.setItem(`temp-${room}`, valC);
    const popupTemp = document.getElementById(`popup-temp-${room}`);
    if (popupTemp) popupTemp.innerText = valDisp;
    if (typeof updateClimateAverages === 'function') updateClimateAverages();
}

function turnOffAllGlobal() {
    Object.keys(subDevices).forEach(cat => (subDevices[cat] || []).forEach(d => {
        if (cat === 'locks') d.state = "Locked";
        else if (cat === 'blinds' || cat === 'contactSensors') d.state = "Closed";
        else if (cat === 'motionSensors') d.state = "Inactive";
        else if (cat === 'videoCameras') d.state = "Standby";
        else d.state = "Off";
    }));
    saveState();
}

function applyMode(mode) {
    stopVacationInterval();
    turnOffAllGlobal();
    if (mode === 'morning') {
        (subDevices.blinds || []).forEach(d => d.state = "Open");
        if (subDevices.appliances && subDevices.appliances[2]) subDevices.appliances[2].state = "On";
        (subDevices.audio || []).forEach(d => { d.state = "On"; d.value = 30; });
        if (subDevices.purifier && subDevices.purifier[0]) subDevices.purifier[0].state = "Auto";
    } else if (mode === 'away') {
        if (subDevices.vacuum && subDevices.vacuum[0]) subDevices.vacuum[0].state = "Cleaning";
        (subDevices.videoCameras || []).forEach(d => d.state = "LIVE");
        localStorage.setItem('alarmDeactivated', 'false');
    } else if (mode === 'home') {
        localStorage.setItem('alarmDeactivated', 'true');
        if (subDevices.locks && subDevices.locks[0]) subDevices.locks[0].state = "Unlocked";
        if (subDevices.blinds && subDevices.blinds[1]) subDevices.blinds[1].state = "Open";
        if (subDevices.bulbs && subDevices.bulbs[1]) subDevices.bulbs[1].state = "On";
    } else if (mode === 'movie') {
        (subDevices.blinds || []).forEach(d => d.state = "Closed");
        if (subDevices.tv && subDevices.tv[1]) subDevices.tv[1].state = "On";
        if (subDevices.audio && subDevices.audio[2]) { subDevices.audio[2].state = "On"; subDevices.audio[2].value = 50; }
        if (subDevices.rgbLights && subDevices.rgbLights[0]) { subDevices.rgbLights[0].state = "On"; subDevices.rgbLights[0].color = "#0a3d62"; }
        (subDevices.bulbs || []).forEach(d => d.state = "Off");
    } else if (mode === 'vacation') {
        localStorage.setItem('alarmDeactivated', 'false');
        vacationInterval = setInterval(() => {
            if (localStorage.getItem('activeScene') !== 's_vacation') { stopVacationInterval(); return; }
            const cats = ['bulbs', 'rgbLights', 'blinds'];
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            const elements = subDevices[randomCat] || [];
            if (elements.length > 0) {
                const rIdx = Math.floor(Math.random() * elements.length);
                const disp = elements[rIdx];
                disp.state = (randomCat === 'blinds') ? (disp.state === "Closed" ? "Open" : "Closed") : (disp.state === "On" ? "Off" : "On");
                hardwareService.setDeviceState(randomCat, rIdx, disp.state).then(() => saveState());
            }
        }, 4000);
    }
    saveState();
    if (typeof syncDOMWithMemory === 'function') syncDOMWithMemory(); else reloadInterface();
}

function calculateDeviceConsumption(disp, cat) {
    const activeStates = ['On', 'Cleaning', 'Auto', 'Boost', 'Open'];
    if (!activeStates.includes(disp.state)) return 0;

    if (disp.consumption && typeof disp.consumption === 'number' && cat !== 'plugs') return disp.consumption;

    switch (cat) {
        case 'bulbs': return 10;
        case 'rgbLights': return 15;
        case 'tv': return 100;
        case 'audio': return 50;
        case 'vacuum': return 60;
        case 'purifier': return 35;
        case 'appliances':
            if (disp.name.toLowerCase().includes('wash')) return 2000;
            if (disp.name.toLowerCase().includes('dryer')) return 2400;
            if (disp.name.toLowerCase().includes('espresso') || disp.name.toLowerCase().includes('coffee')) return 1200;
            return 500;
        case 'plugs': return 0;
        case 'blinds': return 0;
        default: return 0;
    }
}

function calculatePlugConsumption(disp) {
    if (disp.state !== 'On') return 0;
    let roomConsumption = 0;
    Object.keys(subDevices).forEach(cat => {
        if (cat === 'plugs') return;
        (subDevices[cat] || []).forEach(otherDisp => {
            if (otherDisp.room === disp.room) {
                roomConsumption += calculateDeviceConsumption(otherDisp, cat);
            }
        });
    });
    return roomConsumption;
}

function executeScene(sceneId) {
    if (sceneId === 's_home' && localStorage.getItem('alarmDeactivated') !== 'true') {
        openPinPopup('scene_home');
        return;
    }

    stopVacationInterval();

    localStorage.setItem('activeScene', sceneId);
    const scene = scenesDB.find(s => s.id === sceneId);
    if (scene && scene.action) typeof scene.action === 'function' ? scene.action() : applyMode(scene.action);

    if (typeof syncDOMWithMemory === 'function') syncDOMWithMemory(); else reloadInterface();
}

function saveNewCustomScene() {
    const name = document.getElementById('custom-scene-name').value.trim();
    const emoji = document.getElementById('custom-scene-emoji').value;
    const desc = document.getElementById('custom-scene-desc').value.trim();
    const actionTemplate = document.getElementById('custom-scene-template').value;
    if (!name || !desc) { alert("Please complete the scene name and description!"); return; }

    let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
    list.push({ id: 'cust_' + Date.now(), name: `${emoji} ${name}`, desc: desc, action: actionTemplate });
    localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list));

    customScenesList = list;
    scenesDB = [...defaultScenes, ...customScenesList];
    closePopup();
    reloadInterface();
}

function deleteCustomScene(sceneId, event) {
    if (event) event.stopPropagation();
    if (confirm("Are you sure you want to delete this custom scene?")) {
        let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
        localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list.filter(s => s.id !== sceneId)));
        let favs = JSON.parse(localStorage.getItem('favScenes')) || [];
        localStorage.setItem('favScenes', JSON.stringify(favs.filter(id => id !== sceneId)));
        if (localStorage.getItem('activeScene') === sceneId) localStorage.removeItem('activeScene');
        customScenesList = list.filter(s => s.id !== sceneId);
        scenesDB = [...defaultScenes, ...customScenesList];
        reloadInterface();
    }
}

function deleteAccessory(cat, idx) {
    const disp = subDevices[cat][idx];
    if (!disp) return;

    if (confirm(`Are you sure you want to remove the object ${disp.name} from the system?`)) {
        let favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
        let newFavAcc = [];
        favAcc.forEach(id => {
            const [fCat, fIdxStr] = id.split('_');
            const fIdx = parseInt(fIdxStr);
            if (fCat === cat) {
                if (fIdx === idx) return;
                if (fIdx > idx) { newFavAcc.push(`${fCat}_${fIdx - 1}`); return; }
            }
            newFavAcc.push(id);
        });
        localStorage.setItem('favAcc', JSON.stringify(newFavAcc));

        let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
        let newRules = [];
        rules.forEach(rule => {
            let keep = true;
            if (rule.triggerType === 'dev' && rule.tCat === cat) {
                const tIdx = parseInt(rule.tIdx);
                if (tIdx === idx) keep = false;
                else if (tIdx > idx) rule.tIdx = (tIdx - 1).toString();
            }
            if (rule.aCat === cat) {
                const aIdx = parseInt(rule.aIdx);
                if (aIdx === idx) keep = false;
                else if (aIdx > idx) rule.aIdx = (aIdx - 1).toString();
            }
            if (keep) newRules.push(rule);
        });
        localStorage.setItem('userAutomations', JSON.stringify(newRules));

        let usage = JSON.parse(localStorage.getItem('deviceUsage')) || {};
        let newUsage = {};
        Object.keys(usage).forEach(id => {
            const [uCat, uIdxStr] = id.split('_');
            const uIdx = parseInt(uIdxStr);
            if (uCat === cat) {
                if (uIdx === idx) return;
                if (uIdx > idx) { newUsage[`${uCat}_${uIdx - 1}`] = usage[id]; return; }
            }
            newUsage[id] = usage[id];
        });
        localStorage.setItem('deviceUsage', JSON.stringify(newUsage));

        subDevices[cat].splice(idx, 1);
        saveState();

        if (typeof addToLog === 'function') addToLog(`Accessory deleted: ${disp.name} (${disp.room})`);
        if (typeof showToast === 'function') showToast("Object was deleted from the system.");

        closePopup();
        reloadInterface();
    }
}

function executeTotalSecurity() {
    if (subDevices.contactSensors) subDevices.contactSensors.forEach(g => g.state = "Closed");
    if (subDevices.locks) subDevices.locks.forEach(u => u.state = "Locked");
    if (subDevices.motionSensors) subDevices.motionSensors.forEach(s => s.state = "Active");
    if (subDevices.videoCameras) subDevices.videoCameras.forEach(c => c.state = "LIVE");
    localStorage.setItem('alarmDeactivated', 'false');
    saveState();
    if (typeof syncDOMWithMemory === 'function') syncDOMWithMemory(); else reloadInterface();
    if (typeof addToLog === 'function') addToLog("🛡️ Security: Instant total lockdown executed.");
    if (typeof showToast === 'function') showToast("Quick total security activated.");
}

function addToLog(message) {
    let logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    logs.unshift({ text: message, time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    localStorage.setItem('smartHomeLogs', JSON.stringify(logs.slice(0, 30)));
    if (document.getElementById('logs-container')) renderStatisticsLogs();
}

function updateClimateAverages() {
    const rooms = ['living', 'bedroom', 'kitchen', 'bathroom'];

    let sumTemp = 0;
    let countTemp = 0;
    rooms.forEach(room => {
        let val = parseFloat(localStorage.getItem(`temp-${room}`));
        if (isNaN(val)) {
            val = 22;
        }

        sumTemp += val;
        countTemp++;

        const displayElem = document.getElementById(`temp-${room}`);
        if (displayElem) {
            displayElem.innerText = convertTemp(val);
        }
    });

    const avgTemp = countTemp > 0 ? (sumTemp / countTemp) : 22;
    const displayVal = convertTemp(avgTemp);
    const unit = getTempUnit();

    const currentTemp = document.getElementById('tempCurrent');
    const widgetTemp = document.getElementById('widget-temp');
    const widgetAvgTemp = document.getElementById('avg-temp');
    if (currentTemp) currentTemp.innerText = displayVal;
    if (widgetTemp) widgetTemp.innerText = displayVal;
    if (widgetAvgTemp) widgetAvgTemp.innerText = displayVal;

    document.querySelectorAll('.climate-unit').forEach(el => {
        const prev = el.previousElementSibling;
        if (prev && prev.id && (prev.id.includes('humid') || prev.id.includes('dehumid'))) {
            el.innerText = '%';
        } else {
            el.innerText = `°${unit}`;
        }
    });

    let sumHumid = 0;
    let countHumid = 0;
    rooms.forEach(room => {
        const val = parseFloat(localStorage.getItem(`humid-${room}`));
        if (!isNaN(val)) {
            sumHumid += val;
            countHumid++;
        }

        const humidElem = document.getElementById(`humid-${room}`);
        if (humidElem && !isNaN(val)) {
            humidElem.innerText = val;
        }
    });

    const avgHumid = countHumid > 0 ? Math.round(sumHumid / countHumid) : 50;
    const widgetHumidity = document.getElementById('widget-humidity');
    const currentHumidity = document.getElementById('humidityCurrent');
    const widgetAvgHumidity = document.getElementById('avg-humidity');

    if (widgetHumidity) widgetHumidity.innerText = avgHumid;
    if (currentHumidity) currentHumidity.innerText = avgHumid;
    if (widgetAvgHumidity) widgetAvgHumidity.innerText = avgHumid;
}

async function fetchWeather() {
    const tempEl = document.getElementById('weather-temp');
    const detailsEl = document.getElementById('weather-details');
    const iconEl = document.getElementById('weather-icon');
    if (!tempEl || !detailsEl || !iconEl) return;

    const cacheKey = 'weatherCacheData';
    const cacheTimeKey = 'weatherCacheTime';
    const cacheDuration = 30 * 60 * 1000;

    try {
        const now = Date.now();
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const cachedData = localStorage.getItem(cacheKey);
        let data;

        if (cachedTime && cachedData && (now - parseInt(cachedTime)) < cacheDuration) {
            data = JSON.parse(cachedData);
        } else {
            const lat = 45.7537;
            const lon = 21.2257;
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`);

            if (!response.ok) throw new Error("Error fetching weather data");
            data = await response.json();

            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, now.toString());
        }

        const current = data.current;
        const tempC = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const precip = current.precipitation;
        const code = current.weather_code;

        let icon = "☀️";
        if (code === 0) icon = "☀️";
        else if (code >= 1 && code <= 3) icon = "⛅";
        else if (code >= 45 && code <= 48) icon = "🌫️";
        else if (code >= 51 && code <= 67) icon = "🌧️";
        else if (code >= 71 && code <= 77) icon = "❄️";
        else if (code >= 80 && code <= 82) icon = "🌧️";
        else if (code >= 85 && code <= 86) icon = "❄️";
        else if (code >= 95) icon = "⛈️";

        tempEl.innerText = `${convertTemp(tempC)}°${getTempUnit()}`;
        detailsEl.innerText = `Precip: ${precip}mm | Hum: ${humidity}%`;
        iconEl.innerText = icon;
    } catch (error) {
        console.error("Weather API Error:", error);

        const cachedFallback = localStorage.getItem('weatherCacheData');
        if (cachedFallback) {
            const fallbackData = JSON.parse(cachedFallback).current;
            tempEl.innerText = `${convertTemp(fallbackData.temperature_2m)}°${getTempUnit()}`;
            detailsEl.innerText = `Precip: ${fallbackData.precipitation}mm | Hum: ${fallbackData.relative_humidity_2m}% (Offline)`;
        } else {
            detailsEl.innerText = "Loading error";
        }
    }
}

export {
    initIntro, initFavorites, saveState, loadHomeName, openPinPopup,
    closePinPopup, pressPinKey, verifyEnteredPin, saveNewPinCode,
    toggleFavorite, toggleDeviceState, checkTimeAutomations,
    checkAutomationRules, saveAutomation, addSuggestion,
    deleteAutomation, toggleAutomation, adjustFromPopup, turnOffAllGlobal, stopVacationInterval,
    applyMode, calculatePlugConsumption, calculateDeviceConsumption, executeScene, saveNewCustomScene,
    deleteCustomScene, deleteAccessory, executeTotalSecurity, addToLog, updateClimateAverages,
    fetchWeather
};

// Keep global bindings ONLY for functions triggered by raw HTML files that cannot be dynamically bound
window.saveNewPinCode = saveNewPinCode;
window.adjustFromPopup = adjustFromPopup;
window.executeTotalSecurity = executeTotalSecurity;
window.addSuggestion = addSuggestion;
window.deleteAutomation = deleteAutomation;
window.updateClimateAverages = updateClimateAverages;
window.addToLog = addToLog;
window.openPinPopup = openPinPopup;
window.executeScene = executeScene;
window.deleteAccessory = deleteAccessory;
window.fetchWeather = fetchWeather;