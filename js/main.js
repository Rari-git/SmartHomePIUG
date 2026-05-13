document.addEventListener('DOMContentLoaded', () => {
    // Verificăm dacă Dark Mode este activat în memorie
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Verificăm dacă există o culoare de accent personalizată
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-color', savedColor);
    }
});

// Funcție pentru a comuta între Dark Mode și Light Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Salvăm preferința utilizatorului
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Funcție pentru a schimba culoarea de accent (din Setări)
function schimbaCuloareAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

// --- Euristica 1 & 3: Sistem de notificări (Vizibilitatea stării) cu posibilitate de Undo ---
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

    // Ștergem notificarea după 4 secunde
    setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
    }, 4000);
}

// --- Euristica 7: Flexibilitate și eficiență (Scurtături Tastatură) ---
// Permite apăsarea tastei 'Enter' pentru a activa butonul principal de pe pagină
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const butoaneValidare = document.querySelectorAll('button[onclick^="valideaza"]');
        if (butoaneValidare.length > 0) {
            butoaneValidare[0].click();
        }
    }
});