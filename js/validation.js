// 1. Validare Temperatură (Camere)
function valideazaTemperatura() {
    const input = document.getElementById('tempInput').value;
    const errorMsg = document.getElementById('tempError');
    const successMsg = document.getElementById('tempSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (input === "" || isNaN(input) || input < 15 || input > 30) {
        errorMsg.style.display = 'block';
    } else {
        successMsg.style.display = 'block';
    }
}

// 2. Validare PIN Securitate
function valideazaPIN() {
    const input = document.getElementById('pinInput').value;
    const errorMsg = document.getElementById('pinError');
    const successMsg = document.getElementById('pinSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Regex: Permite strict 4 cifre (de la 0 la 9)
    const pinRegex = /^[0-9]{4}$/;

    if (!pinRegex.test(input)) {
        errorMsg.style.display = 'block';
    } else {
        successMsg.style.display = 'block';
    }
}

// 3. Validare Redenumire Dispozitiv (Setări)
function valideazaNume() {
    const input = document.getElementById('numeInput').value;
    const errorMsg = document.getElementById('numeError');
    const successMsg = document.getElementById('numeSuccess');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Regex: Permite doar litere mari, mici și spații
    const numeRegex = /^[A-Za-z\s]+$/;

    if (input.trim() === "" || !numeRegex.test(input)) {
        errorMsg.style.display = 'block';
    } else {
        successMsg.style.display = 'block';
        document.getElementById('numeInput').value = ""; // Curățăm câmpul
    }
}