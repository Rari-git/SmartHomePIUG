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