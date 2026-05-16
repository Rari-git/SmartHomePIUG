function valideazaTemperatura() {
    const input = document.getElementById('tempInput').value;
    const errorMsg = document.getElementById('tempError');
    const successMsg = document.getElementById('tempSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (input === "" || isNaN(input) || input < 15 || input > 30) {
        errorMsg.innerText = "❌ Alege o valoare între 15 și 30.";
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = `✅ Temperatura a fost setată la ${input}°C.`;
        successMsg.style.display = 'block';
        
        document.getElementById('tempCurenta').innerText = input;
        
        const widgetTemp = document.getElementById('widget-temp');
        if (widgetTemp) widgetTemp.innerText = input;

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
        document.getElementById(inputId).value = "";

        if (typeof showToast === "function") {
            showToast(`Temperatura în ${camera} a fost setată la ${temp}°C.`, true, () => {
                displayElem.innerText = tempVeche;
                localStorage.setItem(`temp-${camera}`, tempVeche);
            });
        }
    }
}

function actualizeazaSenzori() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    
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

function simuleazaInundatie() {
    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    
    stareElem.innerText = "INUNDAȚIE!";
    stareElem.style.color = "white";
    cardElem.style.backgroundColor = "var(--error-color)";
    cardElem.style.color = "white";
    cardElem.style.borderTop = "none";
    btnReset.style.display = "block";
    
    document.body.classList.add('alarm-flash'); 
    localStorage.setItem('pericolInundatie', 'true');

    if (typeof showToast === "function") {
        showToast("⚠️ ALARMĂ: Scurgere de apă detectată! Sistemul necesită intervenție.");
    }
}

function reseteazaInundatie() {
    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    
    stareElem.innerText = "USCAT";
    stareElem.style.color = "var(--success-color)";
    cardElem.style.backgroundColor = "var(--card-bg)";
    cardElem.style.color = "var(--text-color)";
    cardElem.style.borderTop = "5px solid var(--accent-color)";
    btnReset.style.display = "none";
    
    document.body.classList.remove('alarm-flash');
    localStorage.setItem('pericolInundatie', 'false');

    if (typeof showToast === "function") {
        showToast("✅ Problema a fost rezolvată. Valva de apă a fost repornită.");
    }
}

function simuleazaIncendiu() {
    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    stareElem.innerText = "PERICOL FUM!";
    stareElem.style.color = "white";
    detaliiElem.innerText = "CRITIC: Nivel ridicat de monoxid de carbon detectat!";
    detaliiElem.style.fontWeight = "bold";
    cardElem.style.backgroundColor = "var(--error-color)";
    cardElem.style.color = "white";
    cardElem.style.borderTop = "none";
    btnReset.style.display = "block";
    
    document.body.classList.add('alarm-flash');
    localStorage.setItem('pericolIncendiu', 'true');

    if (typeof showToast === "function") {
        showToast("🔥 ALARMĂ GENERALĂ: Fum detectat! Evacuați zona sau verificați bucătăria.");
    }
}

function reseteazaIncendiu() {
    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    stareElem.innerText = "SIGUR";
    stareElem.style.color = "var(--success-color)";
    detaliiElem.innerText = "Nivel de particule și gaz în parametri normali.";
    detaliiElem.style.fontWeight = "normal";
    cardElem.style.backgroundColor = "var(--card-bg)";
    cardElem.style.color = "var(--text-color)";
    cardElem.style.borderTop = "5px solid var(--accent-color)";
    btnReset.style.display = "none";
    
    document.body.classList.remove('alarm-flash');
    localStorage.setItem('pericolIncendiu', 'false');

    if (typeof showToast === "function") {
        showToast("✅ Aer curat. Sistemul de alarmă a fost dezactivat.");
    }
}

function pornesteDezumidificator() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    
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

function valideazaPIN() {
    const input = document.getElementById('pinInput').value;
    const errorMsg = document.getElementById('pinError');
    const successMsg = document.getElementById('pinSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const pinRegex = /^[0-9]{4}$/;

    if (!pinRegex.test(input)) {
        errorMsg.innerText = "❌ PIN-ul introdus trebuie să conțină exact 4 cifre.";
        errorMsg.style.display = 'block';
    } else {
        if(confirm("Ești sigur că vrei să DEZACTIVEZI sistemul de alarmă?")) {
            successMsg.style.display = 'block';
            showToast('Alarma a fost dezactivată.');
            localStorage.setItem('alarmaDezactivata', 'true');
            document.getElementById('pinInput').value = "";
        } else {
            showToast('Dezactivarea alarmei a fost anulată.');
        }
    }
}

function valideazaNume() {
    const input = document.getElementById('numeInput').value;
    const errorMsg = document.getElementById('numeError');
    const successMsg = document.getElementById('numeSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const numeRegex = /^[A-Za-z\s]+$/;

    if (input.trim() === "" || !numeRegex.test(input)) {
        errorMsg.style.display = 'block';
    } else {
        successMsg.style.display = 'block';
        showToast(`Dispozitivul a fost redenumit în "${input}".`);
        document.getElementById('numeInput').value = "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const camere = ['living', 'dormitor', 'bucatarie', 'baie'];
    camere.forEach(camera => {
        const salvata = localStorage.getItem(`temp-${camera}`);
        const displayElem = document.getElementById(`temp-${camera}`);
        if (salvata && displayElem) {
            displayElem.innerText = salvata;
        }
    });
});