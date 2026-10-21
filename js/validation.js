import { updateClimateAverages, subDevices, addToLog, getTempUnit, convertTemp } from './app.js';
import { showToast, updateCardInDOM } from './ui.js';

function pressNumpadKey(value) {
    const input = document.getElementById('pinInput');
    if (!input) return;

    document.getElementById('pinError').style.display = 'none';
    document.getElementById('pinSuccess').style.display = 'none';

    if (value === 'C') {
        input.value = "";
    } else if (value === '⌫') {
        input.value = input.value.slice(0, -1);
    } else {
        if (input.value.length < 4) {
            input.value += value;
        }
    }
}

function processAlarmAction(action) {
    const input = document.getElementById('pinInput');
    const errorMsg = document.getElementById('pinError');
    const successMsg = document.getElementById('pinSuccess');

    if (!input) return;

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (input.value.length !== 4) {
        errorMsg.innerText = "❌ PIN code must be 4 digits.";
        errorMsg.style.display = 'block';
        return;
    }

    const correctPin = "1234";

    if (input.value !== correctPin) {
        errorMsg.innerText = "❌ Incorrect PIN! Try again.";
        errorMsg.style.display = 'block';
        input.value = "";
        if (typeof showToast === "function") showToast("Error: Failed attempt to access the alarm system!");
        return;
    }

    if (action === 'arm') {
        localStorage.setItem('alarmDeactivated', 'false');
        successMsg.innerText = "🔒 Alarm armed successfully!";
        successMsg.style.display = 'block';
        if (typeof showToast === "function") showToast("Alarm system Armed.");
    } else if (action === 'disarm') {
        if (confirm("Are you sure you want to DISARM the main alarm system?")) {
            localStorage.setItem('alarmDeactivated', 'true');
            successMsg.innerText = "🔓 System disarmed!";
            successMsg.style.display = 'block';
            if (typeof showToast === "function") showToast("Alarm system Disarmed.");
        }
    }

    input.value = "";
    updateSecurityScreen();
}

function updateSecurityScreen() {
    const badge = document.getElementById('panel-badge');
    const statusText = document.getElementById('security-status-text');
    const iconText = document.getElementById('security-icon');
    const detailsText = document.getElementById('security-details');

    if (!statusText) return;

    const isDisarmed = localStorage.getItem('alarmDeactivated') === 'true';

    if (isDisarmed) {
        statusText.innerText = "Disarmed";
        statusText.style.color = "var(--error-color)";
        if (iconText) iconText.innerText = "🔓";
        if (detailsText) detailsText.innerText = "Warning: The house is currently vulnerable.";
        if (badge) badge.style.borderTop = "5px solid var(--error-color)";
    } else {
        statusText.innerText = "Armed & Secure";
        statusText.style.color = "var(--success-color)";
        if (iconText) iconText.innerText = "🛡️";
        if (detailsText) detailsText.innerText = "All perimeter sensors are active.";
        if (badge) badge.style.borderTop = "5px solid var(--success-color)";
    }
}

function simulateFlood(isManual = true) {
    localStorage.setItem('floodHazard', 'true');
    document.body.classList.add('alarm-flash');

    if (subDevices && subDevices.contactSensors && subDevices.contactSensors[0]) {
        subDevices.contactSensors[0].state = 'WATER DETECTED!';
        if (typeof updateCardInDOM === 'function') updateCardInDOM('contactSensors', 0);
    }

    const stateElem = document.getElementById('status-flood');
    const cardElem = document.getElementById('panel-flood');
    const btnReset = document.querySelector('#panel-flood .btn-stop');
    const btnSim = document.querySelector('#panel-flood .btn-simulate');

    if (stateElem) {
        stateElem.innerText = "ALERT: Water leakage detected!";
        stateElem.className = "text-error";
        stateElem.style.color = "var(--error-color)";
    }
    if (cardElem) {
        cardElem.classList.remove('status-safe');
        cardElem.classList.add('status-alert-water');
    }
    if (btnReset) btnReset.style.display = "block";
    if (btnSim) btnSim.style.display = "none";

    if (isManual) {
        if (typeof showToast === "function") showToast("⚠️ ALARM: Water leakage detected! Intervention required.", { isError: true });
        if (typeof addToLog === "function") addToLog("Flood Sensor: Water leakage detected in Bathroom.");
    }
}

function resetFlood() {
    localStorage.setItem('floodHazard', 'false');

    if (localStorage.getItem('fireHazard') !== 'true') {
        document.body.classList.remove('alarm-flash');
    }

    if (subDevices && subDevices.contactSensors && subDevices.contactSensors[0]) {
        subDevices.contactSensors[0].state = 'Closed';
        if (typeof updateCardInDOM === 'function') updateCardInDOM('contactSensors', 0);
    }

    const stateElem = document.getElementById('status-flood');
    const cardElem = document.getElementById('panel-flood');
    const btnReset = document.querySelector('#panel-flood .btn-stop');
    const btnSim = document.querySelector('#panel-flood .btn-simulate');

    if (stateElem) {
        stateElem.innerText = "Normal State";
        stateElem.className = "text-success";
        stateElem.style.color = "var(--success-color)";
    }
    if (cardElem) {
        cardElem.classList.remove('status-alert-water');
        cardElem.classList.add('status-safe');
    }
    if (btnReset) btnReset.style.display = "none";
    if (btnSim) btnSim.style.display = "block";

    if (typeof showToast === "function") {
        showToast("✅ Issue resolved. Water valve restored.");
    }
    if (typeof addToLog === "function") addToLog("Flood Sensor: Normal state restored by user.");
}

function simulateFire(isManual = true) {
    localStorage.setItem('fireHazard', 'true');
    document.body.classList.add('alarm-flash');

    if (subDevices && subDevices.contactSensors && subDevices.contactSensors[1]) {
        subDevices.contactSensors[1].state = 'SMOKE DETECTED!';
        if (typeof updateCardInDOM === 'function') updateCardInDOM('contactSensors', 1);
    }

    const stateElem = document.getElementById('status-fire');
    const cardElem = document.getElementById('panel-fire');
    const btnReset = document.querySelector('#panel-fire .btn-stop');
    const btnSim = document.querySelector('#panel-fire .btn-simulate');

    if (stateElem) {
        stateElem.innerText = "DANGER: Smoke and Gas Detected!";
        stateElem.className = "text-error";
        stateElem.style.color = "var(--error-color)";
    }
    if (cardElem) {
        cardElem.classList.remove('status-safe');
        cardElem.classList.add('status-alert-fire');
    }
    if (btnReset) btnReset.style.display = "block";
    if (btnSim) btnSim.style.display = "none";

    if (isManual) {
        if (typeof showToast === "function") showToast("🔥 GENERAL ALARM: Smoke detected! Check kitchen.", { isError: true });
        if (typeof addToLog === "function") addToLog("Smoke Detector: High concentration of smoke in Kitchen.");
    }
}

function resetFire() {
    localStorage.setItem('fireHazard', 'false');

    if (localStorage.getItem('floodHazard') !== 'true') {
        document.body.classList.remove('alarm-flash');
    }

    if (subDevices && subDevices.contactSensors && subDevices.contactSensors[1]) {
        subDevices.contactSensors[1].state = 'Closed';
        if (typeof updateCardInDOM === 'function') updateCardInDOM('contactSensors', 1);
    }

    const stateElem = document.getElementById('status-fire');
    const cardElem = document.getElementById('panel-fire');
    const btnReset = document.querySelector('#panel-fire .btn-stop');
    const btnSim = document.querySelector('#panel-fire .btn-simulate');

    if (stateElem) {
        stateElem.innerText = "Normal State";
        stateElem.className = "text-success";
        stateElem.style.color = "var(--success-color)";
    }
    if (cardElem) {
        cardElem.classList.remove('status-alert-fire');
        cardElem.classList.add('status-safe');
    }
    if (btnReset) btnReset.style.display = "none";
    if (btnSim) btnSim.style.display = "block";

    if (typeof showToast === "function") {
        showToast("✅ Fresh air restored. Alarm system deactivated.");
    }
    if (typeof addToLog === "function") addToLog("Smoke Detector: System reset to normal parameters.");
}

function validateTemperature() {
    const input = document.getElementById('tempInput').value;
    const errorMsg = document.getElementById('tempError');
    const successMsg = document.getElementById('tempSuccess');

    if (!errorMsg || !successMsg) return;

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const unit = getTempUnit();
    const minVal = unit === 'F' ? 59 : 15;
    const maxVal = unit === 'F' ? 86 : 30;

    if (input === "" || isNaN(input) || input < minVal || input > maxVal) {
        errorMsg.innerText = `❌ Choose a value between ${minVal} and ${maxVal}.`;
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = `✅ Temperature set to ${input}°${unit}.`;
        successMsg.style.display = 'block';

        const tempC = unit === 'F' ? (parseFloat(input) - 32) * 5 / 9 : parseFloat(input);

        const currentTemp = document.getElementById('tempCurrent');
        if (currentTemp) currentTemp.innerText = input;

        const widgetTemp = document.getElementById('widget-temp');
        if (widgetTemp) widgetTemp.innerText = input;

        const rooms = ['living', 'bedroom', 'kitchen', 'bathroom'];
        rooms.forEach(room => {
            localStorage.setItem(`temp-${room}`, tempC);
            const displayElem = document.getElementById(`temp-${room}`);
            if (displayElem) displayElem.innerText = input;
        });

        if (typeof updateClimateAverages === 'function') updateClimateAverages();
        document.getElementById('tempInput').value = "";

        if (typeof showToast === "function") {
            showToast(`Global temperature set to ${input}°${unit}.`);
        }
    }
}

function validateRoomTemperature(room) {
    const inputId = `input-${room}`;
    const displayId = `temp-${room}`;
    const errorId = `error-${room}`;

    const inputVal = document.getElementById(inputId).value;
    const displayElem = document.getElementById(displayId);
    const errorElem = document.getElementById(errorId);

    if (!errorElem || !displayElem) return;
    errorElem.style.display = 'none';

    if (inputVal === "" || isNaN(inputVal)) {
        errorElem.innerText = "❌ Please enter a valid number.";
        errorElem.style.display = 'block';
        return;
    }

    const unit = getTempUnit();
    const minVal = unit === 'F' ? 59 : 15;
    const maxVal = unit === 'F' ? 86 : 30;

    const tempInput = parseFloat(inputVal);
    if (tempInput < minVal || tempInput > maxVal) {
        errorElem.innerText = `❌ Choose a value between ${minVal}°${unit} and ${maxVal}°${unit}.`;
        errorElem.style.display = 'block';
    } else {
        const oldTemp = displayElem.innerText;
        displayElem.innerText = tempInput;

        const tempC = unit === 'F' ? (tempInput - 32) * 5 / 9 : tempInput;
        localStorage.setItem(`temp-${room}`, tempC);
        if (typeof updateClimateAverages === 'function') updateClimateAverages();

        document.getElementById(inputId).value = "";

        if (typeof showToast === "function") {
            showToast(`Temperature in ${room} set to ${tempInput}°${unit}.`, true, () => {
                displayElem.innerText = oldTemp;
                const oldC = unit === 'F' ? (parseFloat(oldTemp) - 32) * 5 / 9 : parseFloat(oldTemp);
                localStorage.setItem(`temp-${room}`, oldC);
                if (typeof updateClimateAverages === 'function') updateClimateAverages();
            });
        }
    }
}

function updateSensors() {
    const displayElem = document.getElementById('humidityCurrent');
    const stateElem = document.getElementById('humidityStatus');
    if (!displayElem || !stateElem) return;

    let currentValue = parseInt(displayElem.innerText);
    let variation = Math.floor(Math.random() * 5) - 2;
    let newHumidity = currentValue + variation;

    if (newHumidity < 30) newHumidity = 30;
    if (newHumidity > 70) newHumidity = 70;

    displayElem.innerText = newHumidity;

    if (newHumidity >= 40 && newHumidity <= 60) {
        stateElem.innerText = "Optimal";
        stateElem.style.color = "var(--success-color)";
    } else {
        stateElem.innerText = "Warning (Too dry / Too humid)";
        stateElem.style.color = "var(--error-color)";
    }

    const widgetHumidity = document.getElementById('widget-humidity');
    if (widgetHumidity) widgetHumidity.innerText = newHumidity;

    if (typeof showToast === "function") {
        showToast("Sensor read. Data updated.");
    }
}

function updateCO2Sensor() {
    const displayElem = document.getElementById('currentCO2');
    const stateElem = document.getElementById('co2Status');
    if (!displayElem || !stateElem) return;

    let currentValue = parseInt(displayElem.innerText);
    let variation = Math.floor(Math.random() * 200) - 50;
    let newValue = currentValue + variation;

    if (newValue < 400) newValue = 400;

    displayElem.innerText = newValue;

    if (newValue < 800) {
        stateElem.innerText = "Excellent";
        stateElem.style.color = "var(--success-color)";
    } else if (newValue < 1200) {
        stateElem.innerText = "Acceptable (Ventilation recommended)";
        stateElem.style.color = "orange";
    } else {
        stateElem.innerText = "Warning: Stale air!";
        stateElem.style.color = "var(--error-color)";
    }

    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = newValue;

    if (typeof showToast === "function") {
        showToast("CO2 sensor read. Status updated.");
    }
}

function startDehumidifier() {
    const displayElem = document.getElementById('humidityCurrent');
    const stateElem = document.getElementById('humidityStatus');
    if (!displayElem || !stateElem) return;

    let currentValue = parseInt(displayElem.innerText);
    let newHumidity = currentValue - 8;

    if (newHumidity < 35) newHumidity = 35;

    displayElem.innerText = newHumidity;

    if (newHumidity >= 40 && newHumidity <= 60) {
        stateElem.innerText = "Optimal";
        stateElem.style.color = "var(--success-color)";
    } else if (newHumidity < 40) {
        stateElem.innerText = "Warning (Too dry)";
        stateElem.style.color = "orange";
    } else {
        stateElem.innerText = "Warning (Too humid)";
        stateElem.style.color = "var(--error-color)";
    }

    const widgetHumidity = document.getElementById('widget-humidity');
    if (widgetHumidity) widgetHumidity.innerText = newHumidity;

    if (typeof showToast === "function") {
        showToast("💨 Ventilation started. Humidity decreasing towards optimal level.");
    }
}

function openWindows() {
    const displayElem = document.getElementById('currentCO2');
    const stateElem = document.getElementById('co2Status');
    if (!displayElem || !stateElem) return;

    let currentValue = parseInt(displayElem.innerText);
    let newValue = currentValue - 150;

    if (newValue < 400) newValue = 400;

    displayElem.innerText = newValue;

    if (newValue < 800) {
        stateElem.innerText = "Excellent";
        stateElem.style.color = "var(--success-color)";
    } else if (newValue < 1200) {
        stateElem.innerText = "Acceptable";
        stateElem.style.color = "orange";
    } else {
        stateElem.innerText = "Warning: Stale air!";
        stateElem.style.color = "var(--error-color)";
    }

    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = newValue;

    if (typeof showToast === "function") {
        showToast("🪟 Smart windows opened. CO2 levels returning to normal.");
    }
}

function validateName() {
    const input = document.getElementById('nameInput').value;
    const errorMsg = document.getElementById('nameError');
    const successMsg = document.getElementById('nameSuccess');

    if (!errorMsg || !successMsg) return;
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const nameRegex = /^[A-Za-z0-9\s]+$/;

    if (input.trim() === "" || !nameRegex.test(input)) {
        errorMsg.innerText = "❌ Name contains invalid characters!";
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = "✅ Home name saved!";
        successMsg.style.display = 'block';

        localStorage.setItem('savedHomeName', input.trim());

        if (typeof showToast === "function") {
            showToast(`Home renamed to "${input.trim()}".`);
        }
        document.getElementById('nameInput').value = "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSecurityScreen();
    const rooms = ['living', 'bedroom', 'kitchen', 'bathroom'];
    rooms.forEach(room => {
        let saved = localStorage.getItem(`temp-${room}`);
        let tempValue = saved ? parseFloat(saved) : 22;
        const displayElem = document.getElementById(`temp-${room}`);
        if (displayElem) {
            displayElem.innerText = convertTemp(tempValue);
        }

        const savedHumid = localStorage.getItem(`humid-${room}`);
        const humidElem = document.getElementById(`humid-${room}`);
        if (savedHumid && humidElem) {
            humidElem.innerText = savedHumid;
        }
    });
    if (typeof updateClimateAverages === 'function') updateClimateAverages();
});

export {
    pressNumpadKey, processAlarmAction, updateSecurityScreen,
    simulateFlood, resetFlood, simulateFire, resetFire,
    validateTemperature, validateRoomTemperature, updateSensors,
    updateCO2Sensor, startDehumidifier, openWindows, validateName
};

window.pressNumpadKey = pressNumpadKey;
window.processAlarmAction = processAlarmAction;
window.simulateFlood = simulateFlood;
window.resetFlood = resetFlood;
window.simulateFire = simulateFire;
window.resetFire = resetFire;
window.validateTemperature = validateTemperature;
window.validateRoomTemperature = validateRoomTemperature;
window.updateSensors = updateSensors;
window.updateCO2Sensor = updateCO2Sensor;
window.startDehumidifier = startDehumidifier;
window.openWindows = openWindows;
window.validateName = validateName;