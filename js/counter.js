document.addEventListener('DOMContentLoaded', rearrangeDashboard);

const subDispozitive = {
    becuri: [
        { nume: "Bec Living", stare: "Oprit" },
        { nume: "Bec Dormitor", stare: "Pornit" },
        { nume: "Bec Bucătărie", stare: "Oprit" },
        { nume: "Bec Baie", stare: "Oprit" }
    ],
    tv: [
        { nume: "Televizor Living", stare: "Pornit" },
        { nume: "Televizor Dormitor", stare: "Oprit" }
    ],
    audio: [
        { nume: "Soundbar Sistem Living", stare: "Oprit" },
        { nume: "Boxă Inteligentă Baie", stare: "Oprit" }
    ]
};

function deschideMeniuDispozitive(cardId, categorie) {
    trackAccess(cardId);

    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continut = document.getElementById('modal-continut');

    continut.innerHTML = "";

    if (categorie === 'scene') {
        titlu.innerText = "🎭 Scene & Moduri Casă";

        const scene = [
            { nume: "🌙 Mod Noapte", action: () => aplicaMod('noapte'), color: "#2c3e50" },
            { nume: "🎉 Mod Party", action: () => aplicaMod('party'), color: "#9b59b6" },
            { nume: "🎬 Mod Cinema", action: () => aplicaMod('cinema'), color: "#e67e22" },
            { nume: "🛑 Stinge Tot Global", action: () => stingeTotGlobal(), color: "var(--error-color)" }
        ];

        scene.forEach(scena => {
            const btn = document.createElement('button');
            btn.style.cssText = `width: 100%; background-color: ${scena.color}; color: white; border: none; padding: 15px; margin-bottom: 12px; font-size: 1.1em; border-radius: 8px; cursor: pointer; font-weight: bold; transition: opacity 0.2s;`;
            btn.innerText = scena.nume;
            
            btn.onmouseover = () => btn.style.opacity = "0.9";
            btn.onmouseout = () => btn.style.opacity = "1";
            
            btn.onclick = () => {
                scena.action();
                inchidePopup();
            };
            continut.appendChild(btn);
        });

    } else {
        titlu.innerText = categorie === 'becuri' ? "💡 Gestionare Becuri" : 
                         categorie === 'tv' ? "📺 Control Televizoare" : "🎵 Control Sistem Audio";

        const masterOffLocal = document.createElement('button');
        masterOffLocal.style.cssText = "width: 100%; background-color: transparent; border: 2px solid var(--error-color); color: var(--text-color); margin-bottom: 15px; font-size: 0.9em; padding: 10px; border-radius: 5px; cursor: pointer;";
        masterOffLocal.innerText = `🛑 Oprește toate dispozitivele din această listă`;
        masterOffLocal.onclick = () => stingeTotDinCategorie(categorie);
        continut.appendChild(masterOffLocal);

        subDispozitive[categorie].forEach((disp, index) => {
            const item = document.createElement('div');
            item.className = 'modal-list-item';
            const btnColor = disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6';

            item.innerHTML = `
                <span style="font-weight: 500;">${disp.nume}</span>
                <button onclick="comutaStareSubDispozitiv('${categorie}', ${index}, this)" 
                        style="background-color: ${btnColor}; color: white; cursor: pointer; padding: 6px 14px; border: none; border-radius: 4px;">
                    ${disp.stare}
                </button>
            `;
            continut.appendChild(item);
        });
    }

    modal.classList.add('active');
}

function comutaStareSubDispozitiv(categorie, index, buton) {
    const disp = subDispozitive[categorie][index];
    disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    
    buton.innerText = disp.stare;
    buton.style.backgroundColor = disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6';
    
    if (typeof showToast === "function") {
        showToast(`${disp.nume} a fost ${disp.stare.toLowerCase()}.`);
    }
}

function stingeTotDinCategorie(categorie) {
    subDispozitive[categorie].forEach(disp => disp.stare = "Oprit");
    
    const modalId = categorie === 'becuri' ? 'cat_becuri' : categorie === 'tv' ? 'cat_tv' : 'cat_audio';
    deschideMeniuDispozitive(modalId, categorie);
    
    if (typeof showToast === "function") {
        showToast(`Toate elementele din categoria ${categorie} au fost oprite.`);
    }
}

function stingeTotGlobal() {
    Object.keys(subDispozitive).forEach(categorie => {
        subDispozitive[categorie].forEach(disp => disp.stare = "Oprit");
    });
    if (typeof showToast === "function") {
        showToast("🛑 Comandă Master Off executată. Toate dispozitivele au fost oprite!");
    }
}

function aplicaMod(mod) {
    if (mod === 'noapte') {
        Object.keys(subDispozitive).forEach(cat => {
            subDispozitive[cat].forEach(d => d.stare = "Oprit");
        });
        if (typeof showToast === "function") {
            showToast("🌙 Modul Noapte activat. Totul a fost stins în casă.");
        }
    } 
    else if (mod === 'party') {
        subDispozitive.becuri.forEach(d => d.stare = "Pornit");
        subDispozitive.audio.forEach(d => d.stare = "Pornit");
        subDispozitive.tv.forEach(d => d.stare = "Oprit");
        if (typeof showToast === "function") {
            showToast("🎉 Modul Party activat! Lumini și muzică la maxim.");
        }
    } 
    else if (mod === 'cinema') {
        subDispozitive.becuri.forEach(d => d.stare = "Oprit");
        subDispozitive.tv.forEach(d => d.stare = "Pornit");
        subDispozitive.audio.forEach(d => d.stare = "Pornit");
        if (typeof showToast === "function") {
            showToast("🎬 Modul Cinema activat. Luminile s-au stins, TV și Audio pornite.");
        }
    }
}

function trackAccess(deviceId) {
    if(!deviceId || deviceId === 'dashboard-grid') return;
    
    let counts = JSON.parse(localStorage.getItem('deviceCounts')) || {};
    counts[deviceId] = (parseInt(counts[deviceId]) || 0) + 1;
    localStorage.setItem('deviceCounts', JSON.stringify(counts));
    
    const card = document.getElementById(deviceId);
    if (card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.transform = 'scale(1)'; }, 150);
    }
    
    rearrangeDashboard();
}

function rearrangeDashboard() {
    const container = document.getElementById('dashboard-grid');
    if (!container) return;

    const cards = Array.from(container.children);
    let counts = JSON.parse(localStorage.getItem('deviceCounts')) || {};

    cards.sort((a, b) => {
        let countA = parseInt(counts[a.id]) || 0;
        let countB = parseInt(counts[b.id]) || 0;
        return countB - countA; 
    });

    cards.forEach((card, index) => {
        card.style.order = index;
    });
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if(modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('popup-dispozitive');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
}