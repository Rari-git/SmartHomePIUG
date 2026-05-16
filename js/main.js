document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-color', savedColor);
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function schimbaCuloareAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

function showToast(mesaj, cuUndo = false, actiuneUndo = null) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let htmlContent = `<span>${mesaj}</span>`;
    if (cuUndo) {
        htmlContent += `<button class="undo-btn">Anulează (Undo)</button>`;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    if (cuUndo && actiuneUndo) {
        toast.querySelector('.undo-btn').addEventListener('click', () => {
            actiuneUndo();
            toast.remove();
            showToast('Acțiunea a fost anulată.', false);
        });
    }

    setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
    }, 4000);
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const butoaneValidare = document.querySelectorAll('button[onclick^="valideaza"]');
        if (butoaneValidare.length > 0) {
            butoaneValidare[0].click();
        }
    }
});

function toggleHelp() {
    const helpBox = document.getElementById('help-box');
    if (helpBox.style.display === 'none' || helpBox.style.display === '') {
        helpBox.style.display = 'block';
    } else {
        helpBox.style.display = 'none';
    }
}

// --- Logica pentru Meniul Lateral (Sidebar) ---
function toggleNav() {
    const nav = document.querySelector('nav');
    let backdrop = document.getElementById('nav-backdrop');

    // Dacă fundalul protector nu există încă, îl creăm dinamic (Euristica 5 - Prevenirea erorilor)
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
        
        // Dacă utilizatorul dă click în afara meniului (pe zona întunecată), se închide meniul!
        backdrop.onclick = () => {
            nav.classList.remove('active');
            backdrop.classList.remove('active');
        };
    }

    // Comutăm clasele de activare
    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        backdrop.classList.add('active');
    } else {
        backdrop.classList.remove('active');
    }
}