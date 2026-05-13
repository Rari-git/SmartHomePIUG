// 1. Validare Temperatură (Camere)
function valideazaTemperatura() {
    const input = document.getElementById('tempInput').value;
    const errorMsg = document.getElementById('tempError');
    const successMsg = document.getElementById('tempSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Euristica 9: Ajută utilizatorul să diagnosticheze eroarea (mesaje specifice)
    if (input === "" || isNaN(input)) {
        errorMsg.innerText = "❌ Eroare: Nu ai introdus o valoare. Te rugăm să introduci un număr.";
        errorMsg.style.display = 'block';
    } else if (input < 15 || input > 30) {
        errorMsg.innerText = `❌ Eroare: ${input}°C depășește limita permisă. Alege o valoare între 15 și 30.`;
        errorMsg.style.display = 'block';
    } else {
        successMsg.innerText = `✅ Temperatura a fost setată la ${input}°C.`;
        successMsg.style.display = 'block';
        
        // Euristica 6: Recunoaștere mai degrabă decât memorare (Actualizăm valoarea curentă afișată pe ecran)
        const elementTempCurenta = document.getElementById('tempCurenta');
        const tempVeche = elementTempCurenta ? elementTempCurenta.innerText : "";
        if (elementTempCurenta) elementTempCurenta.innerText = input;

        // Euristica 1 & 3: Afișăm confirmare și permitem "Undo"
        showToast(`Temperatura a fost modificată la ${input}°C.`, true, () => {
            if (elementTempCurenta) elementTempCurenta.innerText = tempVeche;
            document.getElementById('tempInput').value = "";
        });
    }
}

// 2. Validare PIN Securitate
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

// 3. Validare Redenumire Dispozitiv (Setări)
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