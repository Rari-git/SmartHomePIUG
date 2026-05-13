document.addEventListener('DOMContentLoaded', rearrangeDashboard);

function trackAccess(deviceId) {
    // Preluăm dicționarul de click-uri sau creăm unul nou
    let counts = JSON.parse(localStorage.getItem('deviceCounts')) || {};
    
    counts[deviceId] = (counts[deviceId] || 0) + 1;
    localStorage.setItem('deviceCounts', JSON.stringify(counts));
    
    // Efect vizual rapid pe buton pentru confirmare (Vizibilitatea stării)
    const card = document.getElementById(deviceId);
    card.style.transform = 'scale(0.95)';
    setTimeout(() => { card.style.transform = 'scale(1)'; }, 150);

    // Rearanjăm imediat după click
    rearrangeDashboard();
}

function rearrangeDashboard() {
    const container = document.getElementById('dashboard-grid');
    if (!container) return; // Ne asigurăm că suntem pe pagina corectă

    const cards = Array.from(container.children);
    let counts = JSON.parse(localStorage.getItem('deviceCounts')) || {};

    // Sortare descrescătoare bazată pe numărul de click-uri
    cards.sort((a, b) => {
        let countA = counts[a.id] || 0;
        let countB = counts[b.id] || 0;
        return countB - countA; 
    });

    // Reatașăm elementele în noua ordine
    cards.forEach(card => container.appendChild(card));
}