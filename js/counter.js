document.addEventListener('DOMContentLoaded', () => {
    rearrangeDashboard();
    randareCercuriPinned(); 
    actualizeazaStatusGlobal();
});

const subDispozitive = {
    becuri: [
        { nume: "Bec Living", stare: "Oprit", valoare: 50 },
        { nume: "Bec Dormitor", stare: "Pornit", valoare: 75 },
        { nume: "Bec Bucătărie", stare: "Oprit", valoare: 100 },
        { nume: "Bec Baie", stare: "Oprit", valoare: 50 }
    ],
    tv: [
        { nume: "Televizor Living", stare: "Pornit" },
        { nume: "Televizor Dormitor", stare: "Oprit" }
    ],
    audio: [
        { nume: "Sistem Audio Living", stare: "Oprit", valoare: 30 },
        { nume: "Boxă Inteligentă Dormitor", stare: "Oprit", valoare: 40 },
        { nume: "Boxă Inteligentă Bucătărie", stare: "Oprit", valoare: 20 },
        { nume: "Boxă Inteligentă Baie", stare: "Oprit", valoare: 30 }
    ]
};

function deschideMeniuDispozitive(cardId, categorie) {
    trackAccess(cardId);

    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const star = document.getElementById('modal-star');
    const continut = document.getElementById('modal-continut');

    continut.innerHTML = "";
    
    let titluText = "";
    let logoStr = "";

    // -- GENERARE PENTRU SCENE --
    if (categorie === 'scene') {
        titluText = "🎭 Scene & Moduri Casă";
        logoStr = "🎭";
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
            btn.onclick = () => { scena.action(); inchidePopup(); };
            continut.appendChild(btn);
        });

    // -- GENERARE PENTRU DISPOZITIVE (Becuri, TV, Audio) --
    } else {
        if(categorie === 'becuri') { titluText = "💡 Gestionare Becuri"; logoStr = "💡"; }
        else if(categorie === 'tv') { titluText = "📺 Control Televizoare"; logoStr = "📺"; }
        else if(categorie === 'audio') { titluText = "🎵 Control Sistem Audio"; logoStr = "🎵"; }

        const masterOffLocal = document.createElement('button');
        masterOffLocal.style.cssText = "width: 100%; background-color: transparent; border: 2px solid var(--error-color); color: var(--text-color); margin-bottom: 15px; font-size: 0.9em; padding: 10px; border-radius: 5px; cursor: pointer;";
        masterOffLocal.innerText = `🛑 Oprește toate dispozitivele din această listă`;
        masterOffLocal.onclick = () => stingeTotDinCategorie(categorie);
        continut.appendChild(masterOffLocal);

        subDispozitive[categorie].forEach((disp, index) => {
            const containerBlock = document.createElement('div');
            containerBlock.style.cssText = "margin-bottom: 20px; padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);";

            const itemHeader = document.createElement('div');
            itemHeader.className = 'modal-list-item';
            itemHeader.style.border = "none";
            itemHeader.style.padding = "0";

            const btnColor = disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6';
            itemHeader.innerHTML = `
                <span style="font-weight: 500;">${disp.nume}</span>
                <button onclick="comutaStareSubDispozitiv('${categorie}', ${index}, this)" 
                        style="background-color: ${btnColor}; color: white; cursor: pointer; padding: 6px 14px; border: none; border-radius: 4px;">
                    ${disp.stare}
                </button>
            `;
            containerBlock.appendChild(itemHeader);

            // SLIDERE DOAR PENTRU BECURI SI AUDIO
            if (categorie === 'becuri' || categorie === 'audio') {
                const isOff = disp.stare === 'Oprit';
                const sliderWrapper = document.createElement('div');
                sliderWrapper.className = `slider-container ${isOff ? 'disabled-controls' : ''}`;
                
                const labelText = categorie === 'becuri' ? `Intensitate: <span id="val-${categorie}-${index}">${disp.valoare}</span>%` : `Volum: <span id="val-${categorie}-${index}">${disp.valoare}</span>%`;
                
                let presetsHtml = '';
                if (categorie === 'becuri') {
                    presetsHtml = `<div style="display:flex; gap:5px; margin-top:2px;">
                        <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 10)">10%</button>
                        <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 25)">25%</button>
                        <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 50)">50%</button>
                        <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 75)">75%</button>
                        <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 100)">100%</button>
                    </div>`;
                }

                sliderWrapper.innerHTML = `
                    <label style="font-size:0.85em; opacity:0.8;">${labelText}</label>
                    <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} id="slider-${categorie}-${index}" oninput="actualizeazaValoareSlider('${categorie}', ${index}, this.value)">
                    ${presetsHtml}
                `;
                containerBlock.appendChild(sliderWrapper);
            }
            continut.appendChild(containerBlock);
        });
    }

    // Setare Titlu și Steluță
    titlu.innerText = titluText;
    
    const pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];
    const isPinned = pinnedItems.some(item => item.id === cardId);
    
    if (isPinned) {
        star.classList.add('pinned');
        star.innerText = "★";
    } else {
        star.classList.remove('pinned');
        star.innerText = "☆";
    }
    
    star.onclick = () => togglePinModal(cardId, logoStr, star);

    modal.classList.add('active');
}

// --- FUNCȚIA CARE GESTIONEAZĂ STELUȚA ---
function togglePinModal(cardId, logo, starElement) {
    let pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];

    if (starElement.classList.contains('pinned')) {
        starElement.classList.remove('pinned');
        starElement.innerText = "☆";
        pinnedItems = pinnedItems.filter(item => item.id !== cardId);
        if (typeof showToast === "function") showToast("Categori eliminată din Acces Rapid.");
    } else {
        starElement.classList.add('pinned');
        starElement.innerText = "★";
        pinnedItems.push({ id: cardId, logo: logo });
        // Notificare de UX care explică utilizatorului UNDE apare cercul
        if (typeof showToast === "function") showToast("📌 Adăugat! Închide fereastra pop-up pentru a vedea cercul de acces rapid.");
    }

    localStorage.setItem('pinnedItems', JSON.stringify(pinnedItems));
    randareCercuriPinned(); // Actualizează fundalul imediat
}

function randareCercuriPinned() {
    const container = document.getElementById('pinned-container');
    if (!container) return;

    container.innerHTML = "";
    const pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];

    if (pinnedItems.length > 0) {
        const label = document.createElement('span');
        label.style.cssText = "font-size: 0.9em; font-weight: bold; opacity: 0.7; margin-right: 5px;";
        label.innerText = "Pinned:";
        container.appendChild(label);
    }

    pinnedItems.forEach(item => {
        const circle = document.createElement('div');
        circle.className = "pinned-circle";
        circle.innerText = item.logo;
        circle.title = `Acces rapid`;
        
        const catTarget = item.id === 'cat_scene' ? 'scene' : item.id === 'cat_becuri' ? 'becuri' : item.id === 'cat_tv' ? 'tv' : 'audio';
        circle.onclick = () => deschideMeniuDispozitive(item.id, catTarget);
        
        container.appendChild(circle);
    });
}

function comutaStareSubDispozitiv(categorie, index, buton) {
    const disp = subDispozitive[categorie][index];
    disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    
    buton.innerText = disp.stare;
    buton.style.backgroundColor = disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6';
    
    const wrapper = buton.closest('div').nextElementSibling;
    if (wrapper && wrapper.classList.contains('slider-container')) {
        const slider = wrapper.querySelector('input[type="range"]');
        const presetBtns = wrapper.querySelectorAll('.preset-btn');
        if (disp.stare === 'Oprit') {
            wrapper.classList.add('disabled-controls');
            if(slider) slider.disabled = true;
            presetBtns.forEach(btn => btn.disabled = true);
        } else {
            wrapper.classList.remove('disabled-controls');
            if(slider) slider.disabled = false;
            presetBtns.forEach(btn => btn.disabled = false);
        }
    }

    actualizeazaStatusGlobal();

    if (typeof showToast === "function") {
        showToast(`${disp.nume} a fost ${disp.stare.toLowerCase()}.`);
    }
}

function actualizeazaValoareSlider(categorie, index, val) {
    subDispozitive[categorie][index].valoare = parseInt(val);
    const labelVal = document.getElementById(`val-${categorie}-${index}`);
    if (labelVal) labelVal.innerText = val;
}

function seteazaPresetSlider(categorie, index, val) {
    subDispozitive[categorie][index].valoare = val;
    const slider = document.getElementById(`slider-${categorie}-${index}`);
    const labelVal = document.getElementById(`val-${categorie}-${index}`);
    if (slider) slider.value = val;
    if (labelVal) labelVal.innerText = val;
    
    if (typeof showToast === "function") {
        showToast(`Intensitatea pentru ${subDispozitive[categorie][index].nume} a fost setată la ${val}%.`);
    }
}

function stingeTotDinCategorie(categorie) {
    subDispozitive[categorie].forEach(disp => disp.stare = "Oprit");
    const modalId = categorie === 'becuri' ? 'cat_becuri' : categorie === 'tv' ? 'cat_tv' : 'cat_audio';
    deschideMeniuDispozitive(modalId, categorie);
    actualizeazaStatusGlobal();
    if (typeof showToast === "function") {
        showToast(`Toate elementele din categoria ${categorie} au fost oprite.`);
    }
}

function stingeTotGlobal() {
    Object.keys(subDispozitive).forEach(categorie => {
        subDispozitive[categorie].forEach(disp => disp.stare = "Oprit");
    });
    actualizeazaStatusGlobal();
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
    actualizeazaStatusGlobal();
}

function actualizeazaStatusGlobal() {
    const securitateElem = document.getElementById('global-securitate');
    const pericoleElem = document.getElementById('global-pericole');
    const consumElem = document.getElementById('global-consum');
    const bannerElem = document.getElementById('status-banner');

    if (!consumElem) return;

    let consum = 0.2;
    subDispozitive.becuri.forEach(d => { if (d.stare === "Pornit") consum += 0.1; });
    subDispozitive.tv.forEach(d => { if (d.stare === "Pornit") consum += 0.3; });
    subDispozitive.audio.forEach(d => { if (d.stare === "Pornit") consum += 0.2; });
    consumElem.innerText = consum.toFixed(1) + " kWh";

    const alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';
    if (alDezactivata) {
        securitateElem.innerText = "Dezactivată";
        securitateElem.style.color = "var(--error-color)";
    } else {
        securitateElem.innerText = "Armată";
        securitateElem.style.color = "var(--success-color)";
    }

    const inundatieActive = localStorage.getItem('pericolInundatie') === 'true';
    const incendiuActive = localStorage.getItem('pericolIncendiu') === 'true';

    if (inundatieActive || incendiuActive) {
        pericoleElem.innerText = "🚨 PERICOL!";
        pericoleElem.style.color = "white";
        bannerElem.style.backgroundColor = "var(--error-color)";
        bannerElem.style.borderLeft = "5px solid white";
        document.querySelectorAll('#status-banner h4, #status-banner p').forEach(el => el.style.color = "white");
    } else {
        pericoleElem.innerText = "Sigur";
        pericoleElem.style.color = "var(--success-color)";
        bannerElem.style.backgroundColor = "var(--card-bg)";
        bannerElem.style.borderLeft = "5px solid var(--success-color)";
        document.querySelectorAll('#status-banner h4').forEach(el => el.style.color = "var(--text-color)");
        document.getElementById('global-securitate').style.color = alDezactivata ? "var(--error-color)" : "var(--success-color)";
        document.getElementById('global-pericole').style.color = "var(--success-color)";
        document.getElementById('global-consum').style.color = "var(--accent-color)";
    }
}

function trackAccess(deviceId) {
    if (!deviceId || deviceId === 'dashboard-grid') return;
    
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
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('popup-dispozitive');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
}