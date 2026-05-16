// --- 1. Validare Temperatură Generală (Actualizează și Widget-ul) ---
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
        
        // Actualizăm valoarea pe coloana din stânga
        document.getElementById('tempCurenta').innerText = input;
        
        // --- Sincronizare cu WIDGET-ul de sus ---
        const widgetTemp = document.getElementById('widget-temp');
        if (widgetTemp) widgetTemp.innerText = input;

        document.getElementById('tempInput').value = ""; // curățăm input-ul

        if (typeof showToast === "function") {
            showToast(`Temperatura generală a fost setată la ${input}°C.`);
        }
    }
}

// --- 2. Funcție dinamică pentru validarea și setarea temperaturii pe camere ---
function valideazaTemperaturaCameră(camera) {
    const inputId = `input-${camera}`;
    const displayId = `temp-${camera}`;
    const errorId = `error-${camera}`;
    
    const inputVal = document.getElementById(inputId).value;
    const displayElem = document.getElementById(displayId);
    const errorElem = document.getElementById(errorId);
    
    // Resetăm erorile (Euritica 9: Diagnosticare erori)
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
        // Actualizăm interfața imediat (Euritica 1: Vizibilitatea stării)
        const tempVeche = displayElem.innerText;
        displayElem.innerText = temp;
        
        // Persistența datelor
        localStorage.setItem(`temp-${camera}`, temp);
        
        // Curățăm câmpul (Euritica 8: Design minimalist)
        document.getElementById(inputId).value = "";

        // Notificare cu Undo (Euritica 3: Controlul utilizatorului)
        if (typeof showToast === "function") {
            showToast(`Temperatura în ${camera} a fost setată la ${temp}°C.`, true, () => {
                displayElem.innerText = tempVeche;
                localStorage.setItem(`temp-${camera}`, tempVeche);
            });
        }
    }
}

// --- 3. Funcție pentru simularea monitorizării Umidității (Euritica 1) ---
function actualizeazaSenzori() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    
    // Extragem valoarea curentă (fără semnul %)
    let valoareCurenta = parseInt(displayElem.innerText);
    
    // Simulăm o citire de senzor: fluctuație mică între -2% și +2%
    let variatie = Math.floor(Math.random() * 5) - 2; 
    let nouaUmiditate = valoareCurenta + variatie;
    
    // Menținem valoarea într-un interval logic pentru o casă (30% - 70%)
    if(nouaUmiditate < 30) nouaUmiditate = 30;
    if(nouaUmiditate > 70) nouaUmiditate = 70;
    
    // Actualizăm ecranul instantaneu (Euritica 1)
    displayElem.innerText = nouaUmiditate + "%";
    
    // Evaluăm starea sistemului pentru a ajuta utilizatorul să înțeleagă informația
    if(nouaUmiditate >= 40 && nouaUmiditate <= 60) {
        stareElem.innerText = "Optimă";
        stareElem.style.color = "var(--success-color)";
    } else {
        stareElem.innerText = "Avertisment (Prea uscat / Prea umed)";
        stareElem.style.color = "var(--error-color)";
    }

    // --- Sincronizare cu WIDGET-ul de sus ---
    const widgetUmiditate = document.getElementById('widget-umiditate');
    if (widgetUmiditate) widgetUmiditate.innerText = nouaUmiditate;

    // Afișăm o notificare că senzorii au fost citiți
    if (typeof showToast === "function") {
        showToast("Senzorul a fost citit. Datele sunt actualizate.");
    }
}

// --- 4. Funcție pentru simularea senzorului de CO2 ---
function actualizeazaSenzorCO2() {
    const displayElem = document.getElementById('co2Curent');
    const stareElem = document.getElementById('stareCO2');
    
    let valoareCurenta = parseInt(displayElem.innerText);
    
    // Simulăm o fluctuație: CO2 crește de obicei mai repede într-o casă (dacă stau oameni în ea)
    // Va varia între -50 și +150
    let variatie = Math.floor(Math.random() * 200) - 50; 
    let nouaValoare = valoareCurenta + variatie;
    
    // Nivelul atmosferic minim este de aproximativ 400 ppm
    if(nouaValoare < 400) nouaValoare = 400; 
    
    // Actualizăm ecranul instant
    displayElem.innerText = nouaValoare;
    
    // Euristica 1 & 9: Oferim diagnostic clar bazat pe valori reale
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

    // --- Sincronizare cu WIDGET-ul de sus ---
    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = nouaValoare;

    if (typeof showToast === "function") {
        showToast("Senzor CO2 citit. Stare actualizată.");
    }
}

// --- 5. Senzor Inundație (Pagina Pericole) ---
function simuleazaInundatie() {
    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    
    // Schimbăm starea în alertă critică
    stareElem.innerText = "INUNDAȚIE!";
    stareElem.style.color = "white";
    
    // Schimbăm fundalul cardului
    cardElem.style.backgroundColor = "var(--error-color)";
    cardElem.style.color = "white";
    cardElem.style.borderTop = "none";
    
    // Afișăm butonul de remediere a problemei
    btnReset.style.display = "block";
    
    // --- Flash Roșu ---
    document.body.classList.add('alarm-flash'); 
    
    if (typeof showToast === "function") {
        showToast("⚠️ ALARMĂ: Scurgere de apă detectată! Sistemul necesită intervenție.");
    }
}

function reseteazaInundatie() {
    const stareElem = document.getElementById('stareInundatie');
    const cardElem = document.getElementById('card-inundatie');
    const btnReset = document.getElementById('btn-reset-inundatie');
    
    // Revenim la starea normală
    stareElem.innerText = "USCAT";
    stareElem.style.color = "var(--success-color)";
    
    // Resetăm culorile cardului
    cardElem.style.backgroundColor = "var(--card-bg)";
    cardElem.style.color = "var(--text-color)";
    cardElem.style.borderTop = "5px solid var(--accent-color)";
    
    // Ascundem butonul de reset
    btnReset.style.display = "none";
    
    // --- Oprim flash-ul ---
    document.body.classList.remove('alarm-flash');
    
    if (typeof showToast === "function") {
        showToast("✅ Problema a fost rezolvată. Valva de apă a fost repornită.");
    }
}

// --- 6. Senzor Fum și Monoxid de Carbon (Pagina Pericole) ---
function simuleazaIncendiu() {
    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    // Mesaj clar (Euritica 9)
    stareElem.innerText = "PERICOL FUM!";
    stareElem.style.color = "white";
    detaliiElem.innerText = "CRITIC: Nivel ridicat de monoxid de carbon detectat!";
    detaliiElem.style.fontWeight = "bold";
    
    // Schimbăm fundalul cardului
    cardElem.style.backgroundColor = "var(--error-color)";
    cardElem.style.color = "white";
    cardElem.style.borderTop = "none";
    
    btnReset.style.display = "block";
    
    // Declanșăm flash-ul roșu pe tot ecranul (Euritica 1)
    document.body.classList.add('alarm-flash');
    
    if (typeof showToast === "function") {
        showToast("🔥 ALARMĂ GENERALĂ: Fum detectat! Evacuați zona sau verificați bucătăria.");
    }
}

// --- Acțiune Corectivă: Pornește Ventilația pentru Umiditate (Euritica 3 & 9) ---
function pornesteDezumidificator() {
    const displayElem = document.getElementById('umiditateCurenta');
    const stareElem = document.getElementById('stareUmiditate');
    
    let valoareCurenta = parseInt(displayElem.innerText);
    
    // Scădem umiditatea considerabil pentru a simula ventilația
    let nouaUmiditate = valoareCurenta - 8;
    if(nouaUmiditate < 35) nouaUmiditate = 35; // Pragul minim sănătos
    
    // Actualizare interfață (Euritica 1)
    displayElem.innerText = nouaUmiditate + "%";
    
    // Evaluare vizuală a noii stări
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

    // Sincronizare widget sus
    const widgetUmiditate = document.getElementById('widget-umiditate');
    if (widgetUmiditate) widgetUmiditate.innerText = nouaUmiditate;

    if (typeof showToast === "function") {
        showToast("💨 Ventilația a pornit. Umiditatea scade spre nivelul optim.");
    }
}

// --- Acțiune Corectivă: Deschide Geamurile pentru CO2 (Euritica 3 & 9) ---
function deschideGeamurile() {
    const displayElem = document.getElementById('co2Curent');
    const stareElem = document.getElementById('stareCO2');
    
    let valoareCurenta = parseInt(displayElem.innerText);
    
    // Scădem CO2-ul dramatic pentru a simula aerisirea (aerul de afară intră)
    let nouaValoare = valoareCurenta - 150;
    if(nouaValoare < 400) nouaValoare = 400; // 400 ppm este media globală de bază a atmosferei
    
    // Actualizare interfață (Euritica 1)
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

    // Sincronizare widget sus
    const widgetCO2 = document.getElementById('widget-co2');
    if (widgetCO2) widgetCO2.innerText = nouaValoare;

    if (typeof showToast === "function") {
        showToast("🪟 Geamurile inteligente au fost deschise. Nivelul de CO2 revine la normal.");
    }
}

function reseteazaIncendiu() {
    const stareElem = document.getElementById('stareIncendiu');
    const cardElem = document.getElementById('card-incendiu');
    const btnReset = document.getElementById('btn-reset-incendiu');
    const detaliiElem = document.getElementById('detaliiIncendiu');
    
    // Revenim la normal
    stareElem.innerText = "SIGUR";
    stareElem.style.color = "var(--success-color)";
    detaliiElem.innerText = "Nivel de particule și gaz în parametri normali.";
    detaliiElem.style.fontWeight = "normal";
    
    cardElem.style.backgroundColor = "var(--card-bg)";
    cardElem.style.color = "var(--text-color)";
    cardElem.style.borderTop = "5px solid var(--accent-color)";
    
    btnReset.style.display = "none";
    
    // Oprim flash-ul roșu de pe fundal
    document.body.classList.remove('alarm-flash');
    
    if (typeof showToast === "function") {
        showToast("✅ Aer curat. Sistemul de alarmă a fost dezactivat.");
    }
}

// --- 7. Validare PIN Securitate ---
function valideazaPIN() {
    const input = document.getElementById('pinInput').value;
    const errorMsg = document.getElementById('pinError');
    const successMsg = document.getElementById('pinSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const pinRegex = /^[0-9]{4}$/;

    if (!pinRegex.test(input)) {
        // Euristica 9: Mesaj clar constructiv
        errorMsg.innerText = "❌ Eroare: PIN-ul introdus este greșit. Trebuie să conțină exact 4 cifre.";
        errorMsg.style.display = 'block';
    } else {
        // Euristica 5: Prevenirea erorilor - confirmare pentru acțiuni distructive
        if(confirm("Ești sigur că vrei să DEZACTIVEZI sistemul de alarmă?")) {
            successMsg.style.display = 'block';
            showToast('Alarma a fost dezactivată.');
            document.getElementById('pinInput').value = ""; // curățăm inputul
        } else {
            showToast('Dezactivarea alarmei a fost anulată.');
        }
    }
}

// --- 8. Validare Redenumire Dispozitiv (Setări) ---
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

// --- 9. Inițializare Setări la încărcare (Euritica 6: Recunoaștere) ---
document.addEventListener('DOMContentLoaded', () => {
    // Încărcăm temperaturile salvate pentru cele 4 camere
    const camere = ['living', 'dormitor', 'bucatarie', 'baie'];
    camere.forEach(camera => {
        const salvata = localStorage.getItem(`temp-${camera}`);
        const displayElem = document.getElementById(`temp-${camera}`);
        if (salvata && displayElem) {
            displayElem.innerText = salvata;
        }
    });
});