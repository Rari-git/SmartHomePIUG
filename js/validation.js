function apasăTastăNumpad(valoare) {
    const input = document.getElementById('pinInput');
    if (!input) return;

    document.getElementById('pinError').style.display = 'none';
    document.getElementById('pinSuccess').style.display = 'none';

    if (valoare === 'C') {
        input.value = "";
    } else if (valoare === '⌫') {
        input.value = input.value.slice(0, -1);
    } else {
        if (input.value.length < 4) {
            input.value += valoare;
        }
    }
}

function proceseazăAcțiuneAlarmă(acțiune) {
    const input = document.getElementById('pinInput');
    const errorMsg = document.getElementById('pinError');
    const successMsg = document.getElementById('pinSuccess');
    
    if (!input) return;

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (input.value.length !== 4) {
        errorMsg.innerText = "❌ Codul PIN trebuie să aibă 4 cifre.";
        errorMsg.style.display = 'block';
        return;
    }

    const pinCorect = "1234";

    if (input.value !== pinCorect) {
        errorMsg.innerText = "❌ Cod PIN incorect! Încearcă din nou.";
        errorMsg.style.display = 'block';
        input.value = "";
        if (typeof showToast === "function") showToast("Eroare: Încercare eșuată de acces la sistemul de alarmă!");
        return;
    }

    if (acțiune === 'armează') {
        localStorage.setItem('alarmaDezactivata', 'false');
        successMsg.innerText = "🔒 Alarma a fost armată cu succes!";
        successMsg.style.display = 'block';
        if (typeof showToast === "function") showToast("Sistem de alarmă Armat.");
    } else if (acțiune === 'dezactivează') {
        if (confirm("Ești sigur că vrei să DEZACTIVEZI sistemul de alarmă general?")) {
            localStorage.setItem('alarmaDezactivata', 'true');
            successMsg.innerText = "🔓 Sistemul a fost dezactivat!";
            successMsg.style.display = 'block';
            if (typeof showToast === "function") showToast("Sistem de alarmă Dezactivat.");
        }
    }

    input.value = "";
    actualizeazăEcranSecuritate();
}

function actualizeazăEcranSecuritate() {
    const badge = document.getElementById('panel-badge');
    const statusText = document.getElementById('security-status-text');
    const iconText = document.getElementById('security-icon');
    const detailsText = document.getElementById('security-details');

    if (!statusText) return;

    const alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';

    if (alDezactivata) {
        statusText.innerText = "Dezactivată";
        statusText.style.color = "var(--error-color)";
        if(iconText) iconText.innerText = "🔓";
        if(detailsText) detailsText.innerText = "Atenție: Casa este vulnerabilă în acest moment.";
        if(badge) badge.style.borderTop = "5px solid var(--error-color)";
    } else {
        statusText.innerText = "Armată & Sigură";
        statusText.style.color = "var(--success-color)";
        if(iconText) iconText.innerText = "🛡️";
        if(detailsText) detailsText.innerText = "Toți senzorii perimetrali sunt activi.";
        if(badge) badge.style.borderTop = "5px solid var(--success-color)";
    }
}

// --- SIMULARE INUNDAȚIE EFICIENTĂ ȘI SIGURĂ (Fără crash-uri în pagini secundare) ---
function simuleazaInundatie() {
    localStorage.setItem('pericolInundatie', 'true');
    document.body.classList.add('alarm-flash'); 

    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    const btnSim = document.getElementById('btn-sim-inundatie');

    if (stareElem) {
        stareElem.innerText = "INUNDAȚIE!";
        stareElem.style.color = "white";
    }
    if (cardElem) {
        cardElem.style.backgroundColor = "var(--error-color)";
        cardElem.style.color = "white";
        cardElem.style.borderTop = "none";
    }
    if (btnReset) btnReset.style.display = "block";
    if (btnSim) btnSim.style.display = "none";

    if (typeof showToast === "function") {
        showToast("⚠️ ALARMĂ: Scurgere de apă detectată! Sistemul necesită intervenție.");
    }
}

function reseteazaInundatie() {
    localStorage.setItem('pericolInundatie', 'false');
    document.body.classList.remove('alarm-flash');

    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    const btnSim = document.getElementById('btn-sim-inundatie');
    
    if (stareElem) {
        stareElem.innerText = "USCAT";
        stareElem.style.color = "var(--success-color)";
    }
    if (cardElem) {
        cardElem.style.backgroundColor = "var(--card-bg)";
        cardElem.style.color = "var(--text-color)";
        cardElem.style.borderTop = "5px solid var(--accent-color)";
    }
    if (btnReset) btnReset.style.display = "none";
    if (btnSim) btnSim.style.display = "block";

    if (typeof showToast === "function") {
        showToast("✅ Problema a fost rezolvată. Valva de apă a fost repornită.");
    }
}

// --- SIMULARE INCENDIU SIGURĂ ---
function simuleazaIncendiu() {
    localStorage.setItem('pericolIncendiu', 'true');
    document.body.classList.add('alarm-flash');

    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const btnSim = document.getElementById('btn-sim-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    if (stareElem) {
        stareElem.innerText = "PERICOL FUM!";
        stareElem.style.color = "white";
    }
    if (detaliiElem) {
        detaliiElem.innerText = "CRITIC: Nivel ridicat de monoxid de carbon detectat!";
        detaliiElem.style.fontWeight = "bold";
    }
    if (cardElem) {
        cardElem.style.backgroundColor = "var(--error-color)";
        cardElem.style.color = "white";
        cardElem.style.borderTop = "none";
    }
    if (btnReset) btnReset.style.display = "block";
    if (btnSim) btnSim.style.display = "none";

    if (typeof showToast === "function") {
        showToast("🔥 ALARMĂ GENERALĂ: Fum detectat! Evacuați zona sau verificați bucătăria.");
    }
}

function reseteazaIncendiu() {
    localStorage.setItem('pericolIncendiu', 'false');
    document.body.classList.remove('alarm-flash');

    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const btnSim = document.getElementById('btn-sim-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    if (stareElem) {
        stareElem.innerText = "SIGUR";
        stareElem.style.color = "var(--success-color)";
    }
    if (detaliiElem) {
        detaliiElem.innerText = "Nivel de particule și gaz în parametri normali.";
        detaliiElem.style.fontWeight = "normal";
    }
    if (cardElem) {
        cardElem.style.backgroundColor = "var(--card-bg)";
        cardElem.style.color = "var(--text-color)";
        cardElem.style.borderTop = "5px solid var(--accent-color)";
    }
    if (btnReset) btnReset.style.display = "none";
    if (btnSim) btnSim.style.display = "block";

    if (typeof showToast === "function") {
        showToast("✅ Aer curat. Sistemul de alarmă a fost dezactivat.");
    }
}

function valideazaTemperatura() {
    const input = document.getElementById('tempInput').value;
    const errorMsg = document.getElementById('tempError');
    const successMsg = document.getElementById('tempSuccess');
    
    if (!errorMsg || !successMsg) return;
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (input === "" || isNaN(input) || input < 15 || input > 30) {
        errorMsg.innerText = "❌ Alege o valoare între 15 și 30.";
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = `✅ Temperatura a fost setată la ${input}°C.`;
        successMsg.style.display = 'block';
        
        const tempCur = document.getElementById('tempCurenta');
        if (tempCur) tempCur.innerText = input;
        
        const widgetTemp = document.getElementById('widget-temp');
        if (widgetTemp) widgetTemp.innerText = input;
        // Setăm temperatura pentru TOATE camerele ca media să devină egală cu valoarea setată
        const camere = ['living', 'dormitor', 'bucatarie', 'baie'];
        camere.forEach(camera => {
            localStorage.setItem(`temp-${camera}`, input);
            const displayElem = document.getElementById(`temp-${camera}`);
            if (displayElem) displayElem.innerText = input;
        });

        if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();
        document.getElementById('tempInput').value = "";

        if (typeof showToast === "function") {
            showToast(`Temperatura generală a fost setată la ${input}°C.`);
        }
    }
}

function valideazaTemperaturaCameră(camera) {
    const inputId = `input-${camera}`;
    const displayId = `temp-${camera}`;
    const errorId = `error-${camera}`;
    
    const inputVal = document.getElementById(inputId).value;
    const displayElem = document.getElementById(displayId);
    const errorElem = document.getElementById(errorId);
    
    if (!errorElem || !displayElem) return;
    errorElem.style.display = 'none';

    if (inputVal === "" || isNaN(inputVal)) {
        errorElem.innerText = "❌ Introdu un număr valid.";
        errorElem.style.display = 'block';
        return;
    }

    const temp = parseFloat(inputVal);
    if (temp < 15 || temp > 30) {
        errorElem.innerText = "❌ Alege o valoare între 15°C și 30°C.";
        errorElem.style.display = 'block';
    } else {
        const tempVeche = displayElem.innerText;
        displayElem.innerText = temp;
        
        localStorage.setItem(`temp-${camera}`, temp);
        if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();
        
        document.getElementById(inputId).value = "";

        if (typeof showToast === "function") {
            showToast(`Temperatura în ${camera} a fost setată la ${temp}°C.`, true, () => {
                displayElem.innerText = tempVeche;
                localStorage.setItem(`temp-${camera}`, tempVeche);
                if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();
            });
        }
    }
}

function actualizeazaSenzori() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    if (!displayElem || !stareElem) return;
    
    let valoareCurenta = parseInt(displayElem.innerText);
    let variatie = Math.floor(Math.random() * 5) - 2; 
    let nouaUmiditate = valoareCurenta + variatie;
    
    if(nouaUmiditate < 30) nouaUmiditate = 30;
    if(nouaUmiditate > 70) nouaUmiditate = 70;
    
    displayElem.innerText = nouaUmiditate + "%";
    
    if(nouaUmiditate >= 40 && nouaUmiditate <= 60) {
        stareElem.innerText = "Optimă";
        stareElem.style.color = "var(--success-color)";
    } else {
        stareElem.innerText = "Avertisment (Prea uscat / Prea umed)";
        stareElem.style.color = "var(--error-color)";
    }

    const widgetUmiditate = document.getElementById('widget-umiditate');
    if (widgetUmiditate) widgetUmiditate.innerText = nouaUmiditate;

    if (typeof showToast === "function") {
        showToast("Senzorul a fost citit. Datele sunt actualizate.");
    }
}

function actualizeazaSenzorCO2() {
    const displayElem = document.getElementById('co2Curent');
    const stareElem = document.getElementById('stareCO2');
    if (!displayElem || !stareElem) return;
    
    let valoareCurenta = parseInt(displayElem.innerText);
    let variatie = Math.floor(Math.random() * 200) - 50; 
    let nouaValoare = valoareCurenta + variatie;
    
    if(nouaValoare < 400) nouaValoare = 400; 
    
    displayElem.innerText = nouaValoare;
    
    if(nouaValoare < 800) {
        stareElem.innerText = "Excelentă";
        stareElem.style.color = "var(--success-color)";
    } else if (nouaValoare < 1200) {
        stareElem.innerText = "Acceptabilă (Recomandat să aerisești)";
        stareElem.style.color = "orange";
    } else {
        stareElem.innerText = "Avertisment: Aer închis!";
        stareElem.style.color = "var(--error-color)";
    }

    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = nouaValoare;

    if (typeof showToast === "function") {
        showToast("Senzor CO2 citit. Stare actualizată.");
    }
}

function pornesteDezumidificator() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    if (!displayElem || !stareElem) return;
    
    let valoareCurenta = parseInt(displayElem.innerText);
    let nouaUmiditate = valoareCurenta - 8;
    
    if(nouaUmiditate < 35) nouaUmiditate = 35; 
    
    displayElem.innerText = nouaUmiditate + "%";
    
    if(nouaUmiditate >= 40 && nouaUmiditate <= 60) {
        stareElem.innerText = "Optimă";
        stareElem.style.color = "var(--success-color)";
    } else if (nouaUmiditate < 40) {
        stareElem.innerText = "Avertisment (Prea uscat)";
        stareElem.style.color = "orange";
    } else {
        stareElem.innerText = "Avertisment (Prea umed)";
        stareElem.style.color = "var(--error-color)";
    }

    const widgetUmiditate = document.getElementById('widget-umiditate');
    if (widgetUmiditate) widgetUmiditate.innerText = nouaUmiditate;

    if (typeof showToast === "function") {
        showToast("💨 Ventilația a pornit. Umiditatea scade spre nivelul optim.");
    }
}

function deschideGeamurile() {
    const displayElem = document.getElementById('co2Curent');
    const stareElem = document.getElementById('stareCO2');
    if (!displayElem || !stareElem) return;
    
    let valoareCurenta = parseInt(displayElem.innerText);
    let nouaValoare = valoareCurenta - 150;
    
    if(nouaValoare < 400) nouaValoare = 400; 
    
    displayElem.innerText = nouaValoare;
    
    if(nouaValoare < 800) {
        stareElem.innerText = "Excelentă";
        stareElem.style.color = "var(--success-color)";
    } else if (nouaValoare < 1200) {
        stareElem.innerText = "Acceptabilă";
        stareElem.style.color = "orange";
    } else {
        stareElem.innerText = "Avertisment: Aer închis!";
        stareElem.style.color = "var(--error-color)";
    }

    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = nouaValoare;

    if (typeof showToast === "function") {
        showToast("🪟 Geamurile inteligente au fost deschise. Nivelul de CO2 revine la normal.");
    }
}

function valideazaNume() {
    const input = document.getElementById('numeInput').value;
    const errorMsg = document.getElementById('numeError');
    const successMsg = document.getElementById('numeSuccess');
    
    if (!errorMsg || !successMsg) return;
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const numeRegex = /^[A-Za-z0-9\săâîșțĂÂÎȘȚ]+$/;

    if (input.trim() === "" || !numeRegex.test(input)) {
        errorMsg.innerText = "❌ Numele conține caractere speciale nepermise!";
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = "✅ Numele locuinței a fost salvat!";
        successMsg.style.display = 'block';
        
        localStorage.setItem('numeCasaSalvat', input.trim());
        
        if (typeof showToast === "function") {
            showToast(`Locuința a fost redenumită în "${input.trim()}".`);
        }
        document.getElementById('numeInput').value = "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizeazăEcranSecuritate();
    const camere = ['living', 'dormitor', 'bucatarie', 'baie'];
    camere.forEach(camera => {
        const salvata = localStorage.getItem(`temp-${camera}`);
        const displayElem = document.getElementById(`temp-${camera}`);
        if (salvata && displayElem) {
            displayElem.innerText = salvata;
        }
        
        // Încărcare valori umiditate per cameră
        const umidSalvata = localStorage.getItem(`umid-${camera}`);
        const umidElem = document.getElementById(`umid-${camera}`);
        if (umidSalvata && umidElem) {
            umidElem.innerText = umidSalvata;
        }
    });
    if (typeof actualizeazaMediiClimat === 'function') actualizeazaMediiClimat();
});