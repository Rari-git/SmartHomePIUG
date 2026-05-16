document.addEventListener('DOMContentLoaded', () => {
    rearrangeDashboard();
    randareCercuriPinned(); 
    actualizeazaStatusGlobal();
});

// --- Baza de date cu toate sistemele din casă ---
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
        { nume: "Boxă Dormitor", stare: "Oprit", valoare: 40 },
        { nume: "Boxă Baie", stare: "Oprit", valoare: 30 }
    ],
    aspirator: [
        { nume: "Robot Aspirator Etaj", stare: "La Bază", baterie: 100 }
    ],
    jaluzele: [
        { nume: "Draperii Living", stare: "Oprit", valoare: 0 },
        { nume: "Jaluzele Dormitor", stare: "Oprit", valoare: 100 }
    ],
    prize: [
        { nume: "Priză Cafetieră", stare: "Oprit", consum: 800 },
        { nume: "Priză TV", stare: "Pornit", consum: 120 },
        { nume: "Priză Mașină Spălat", stare: "Oprit", consum: 2100 }
    ],
    incuietori: [
        { nume: "Ușă Intrare", stare: "Blocat" },
        { nume: "Ușă Terasă", stare: "Blocat" }
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

    // -- 1. GENERARE PENTRU SCENE --
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

    // -- 2. GENERARE PENTRU DISPOZITIVE --
    } else {
        if(categorie === 'becuri') { titluText = "💡 Gestionare Becuri"; logoStr = "💡"; }
        else if(categorie === 'tv') { titluText = "📺 Control Televizoare"; logoStr = "📺"; }
        else if(categorie === 'audio') { titluText = "🎵 Sistem Audio"; logoStr = "🎵"; }
        else if(categorie === 'aspirator') { titluText = "🤖 Control Aspirator"; logoStr = "🤖"; }
        else if(categorie === 'jaluzele') { titluText = "🪟 Draperii & Jaluzele"; logoStr = "🪟"; }
        else if(categorie === 'prize') { titluText = "🔌 Prize Inteligente"; logoStr = "🔌"; }
        else if(categorie === 'incuietori') { titluText = "🚪 Încuietori Smart"; logoStr = "🚪"; }

        // Butonul Global de pe categorie (Text adaptiv)
        let masterBtnText = "🛑 Oprește toate dispozitivele";
        if (categorie === 'incuietori') masterBtnText = "🔒 Blochează toate ușile";
        if (categorie === 'aspirator') masterBtnText = "🏠 Trimite la Bază";

        const masterOffLocal = document.createElement('button');
        masterOffLocal.style.cssText = "width: 100%; background-color: transparent; border: 2px solid var(--error-color); color: var(--text-color); margin-bottom: 15px; font-size: 0.9em; padding: 10px; border-radius: 5px; cursor: pointer;";
        masterOffLocal.innerText = masterBtnText;
        masterOffLocal.onclick = () => stingeTotDinCategorie(categorie);
        continut.appendChild(masterOffLocal);

        subDispozitive[categorie].forEach((disp, index) => {
            const containerBlock = document.createElement('div');
            containerBlock.style.cssText = "margin-bottom: 20px; padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);";

            // --- RENDERING SPECIAL PENTRU ASPIRATOR (Stări Multiple) ---
            if (categorie === 'aspirator') {
                let statusColor = disp.stare === 'Curăță' ? 'var(--accent-color)' : (disp.stare === 'Pauză' ? 'orange' : '#95a5a6');
                containerBlock.innerHTML = `
                    <div style="display:flex; justify-content:space-between; font-weight:500;">
                        <span>${disp.nume}</span>
                        <span style="color:${statusColor}; font-weight:bold;">${disp.stare} (🔋${disp.baterie}%)</span>
                    </div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button onclick="comutaAspirator(${index}, 'Curăță')" style="flex:1; background-color:var(--accent-color); color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">▶️ Curăță</button>
                        <button onclick="comutaAspirator(${index}, 'Pauză')" style="flex:1; background-color:orange; color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">⏸️ Pauză</button>
                        <button onclick="comutaAspirator(${index}, 'La Bază')" style="flex:1; background-color:#95a5a6; color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">🏠 Bază</button>
                    </div>
                `;
            } 
            // --- RENDERING CLASIC PENTRU RESTUL ---
            else {
                const itemHeader = document.createElement('div');
                itemHeader.className = 'modal-list-item';
                itemHeader.style.border = "none";
                itemHeader.style.padding = "0";

                let btnColor = disp.stare === 'Pornit' || disp.stare === 'Blocat' ? 'var(--success-color)' : '#95a5a6';
                if (disp.stare === 'Deblocat') btnColor = 'var(--error-color)'; // Ușă deblocată e roșie!
                
                let extraText = categorie === 'prize' ? ` <span style="font-size:0.8em; color:var(--accent-color);">(⚡ ${disp.consum}W)</span>` : '';

                itemHeader.innerHTML = `
                    <span style="font-weight: 500;">${disp.nume}${extraText}</span>
                    <button onclick="comutaStareSubDispozitiv('${categorie}', ${index}, this)" 
                            style="background-color: ${btnColor}; color: white; cursor: pointer; padding: 6px 14px; border: none; border-radius: 4px;">
                        ${disp.stare}
                    </button>
                `;
                containerBlock.appendChild(itemHeader);

                // SLIDERE PENTRU BECURI, AUDIO ȘI JALUZELE
                if (categorie === 'becuri' || categorie === 'audio' || categorie === 'jaluzele') {
                    const isOff = disp.stare === 'Oprit';
                    const sliderWrapper = document.createElement('div');
                    sliderWrapper.className = `slider-container ${isOff ? 'disabled-controls' : ''}`;
                    
                    let labelText = '';
                    if(categorie === 'becuri') labelText = `Intensitate: <span id="val-${categorie}-${index}">${disp.valoare}</span>%`;
                    if(categorie === 'audio') labelText = `Volum: <span id="val-${categorie}-${index}">${disp.valoare}</span>%`;
                    if(categorie === 'jaluzele') labelText = `Nivel Deschidere: <span id="val-${categorie}-${index}">${disp.valoare}</span>%`;
                    
                    let presetsHtml = '';
                    if (categorie === 'becuri') {
                        presetsHtml = `<div style="display:flex; gap:5px; margin-top:2px;">
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 10)">10%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 25)">25%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 50)">50%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 75)">75%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 100)">100%</button>
                        </div>`;
                    } else if (categorie === 'jaluzele') {
                        presetsHtml = `<div style="display:flex; gap:5px; margin-top:2px;">
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 0)">Închis</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 50)">Jumătate</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${index}, 100)">Deschis complet</button>
                        </div>`;
                    }

                    sliderWrapper.innerHTML = `
                        <label style="font-size:0.85em; opacity:0.8;">${labelText}</label>
                        <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} id="slider-${categorie}-${index}" oninput="actualizeazaValoareSlider('${categorie}', ${index}, this.value)">
                        ${presetsHtml}
                    `;
                    containerBlock.appendChild(sliderWrapper);
                }
            }
            continut.appendChild(containerBlock);
        });
    }

    // Setare Titlu și Steluță
    titlu.innerText = titluText;
    const pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];
    const isPinned = pinnedItems.some(item => item.id === cardId);
    
    if (isPinned) { star.classList.add('pinned'); star.innerText = "★"; } 
    else { star.classList.remove('pinned'); star.innerText = "☆"; }
    
    star.onclick = () => togglePinModal(cardId, logoStr, star);
    modal.classList.add('active');
}

// --- FUNCȚII PENTRU STELUȚE ȘI PINNED ---
function togglePinModal(cardId, logo, starElement) {
    let pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];
    if (starElement.classList.contains('pinned')) {
        starElement.classList.remove('pinned');
        starElement.innerText = "☆";
        pinnedItems = pinnedItems.filter(item => item.id !== cardId);
        if (typeof showToast === "function") showToast("Categorie eliminată din Acces Rapid.");
    } else {
        starElement.classList.add('pinned');
        starElement.innerText = "★";
        pinnedItems.push({ id: cardId, logo: logo });
        if (typeof showToast === "function") showToast("📌 Adăugat! Închide fereastra pentru a vedea cercul de acces rapid.");
    }
    localStorage.setItem('pinnedItems', JSON.stringify(pinnedItems));
    randareCercuriPinned();
}

function randareCercuriPinned() {
    const container = document.getElementById('pinned-container');
    if (!container) return;
    container.innerHTML = "";
    const pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];

    if (pinnedItems.length > 0) {
        const label = document.createElement('span');
        label.style.cssText = "font-size: 0.9em; font-weight: bold; opacity: 0.7; margin-right: 5px;";
        label.innerText = "Acces Rapid:";
        container.appendChild(label);
    }

    pinnedItems.forEach(item => {
        const circle = document.createElement('div');
        circle.className = "pinned-circle";
        circle.innerText = item.logo;
        circle.title = `Deschide panoul`;
        
        let catTarget = item.id.replace('cat_', ''); // Transformă cat_prize în prize automat!
        circle.onclick = () => deschideMeniuDispozitive(item.id, catTarget);
        container.appendChild(circle);
    });
}

// --- LOGICA DE SCHIMBARE A STĂRII DISPOZITIVELOR ---
function comutaAspirator(index, nouaStare) {
    subDispozitive.aspirator[index].stare = nouaStare;
    deschideMeniuDispozitive('cat_aspirator', 'aspirator'); // Reîncărcăm pop-up-ul
    actualizeazaStatusGlobal();
    if (typeof showToast === "function") showToast(`Aspiratorul a primit comanda: ${nouaStare}`);
}

function comutaStareSubDispozitiv(categorie, index, buton) {
    const disp = subDispozitive[categorie][index];
    
    // Euristica 5: Prevenirea erorilor critice la Securitate
    if (categorie === 'incuietori') {
        if (disp.stare === 'Blocat') {
            if(!confirm(`⚠️ SECURITATE: Ești sigur că vrei să DEBLOCHEZI: ${disp.nume}?`)) return;
            disp.stare = "Deblocat";
        } else {
            disp.stare = "Blocat";
        }
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    buton.innerText = disp.stare;
    let btnColor = disp.stare === 'Pornit' || disp.stare === 'Blocat' ? 'var(--success-color)' : '#95a5a6';
    if (disp.stare === 'Deblocat') btnColor = 'var(--error-color)';
    buton.style.backgroundColor = btnColor;
    
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
    if (typeof showToast === "function") showToast(`${disp.nume} este acum ${disp.stare}.`);
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
}

// --- FUNCȚII GLOBALE ȘI SCENE ---
function stingeTotDinCategorie(categorie) {
    subDispozitive[categorie].forEach(disp => {
        if (categorie === 'incuietori') disp.stare = 'Blocat';
        else if (categorie === 'aspirator') disp.stare = 'La Bază';
        else disp.stare = 'Oprit';
    });
    deschideMeniuDispozitive(`cat_${categorie}`, categorie);
    actualizeazaStatusGlobal();
    if (typeof showToast === "function") showToast(`Acțiune executată pentru categoria: ${categorie}`);
}

function stingeTotGlobal() {
    Object.keys(subDispozitive).forEach(cat => {
        subDispozitive[cat].forEach(d => {
            if (cat === 'incuietori') d.stare = "Blocat";
            else if (cat === 'aspirator') d.stare = "La Bază";
            else d.stare = "Oprit";
        });
    });
    actualizeazaStatusGlobal();
    if (typeof showToast === "function") showToast("🛑 Comandă Master Off! Totul a fost închis și securizat.");
}

function aplicaMod(mod) {
    stingeTotGlobal(); // Închidem tot ca bază curată
    if (mod === 'noapte') {
        if (typeof showToast === "function") showToast("🌙 Mod Noapte: Totul închis, uși blocate.");
    } 
    else if (mod === 'party') {
        subDispozitive.becuri.forEach(d => { d.stare = "Pornit"; d.valoare = 100; });
        subDispozitive.audio.forEach(d => { d.stare = "Pornit"; d.valoare = 80; });
        if (typeof showToast === "function") showToast("🎉 Mod Party: Lumini la 100% și Muzică pornită.");
    } 
    else if (mod === 'cinema') {
        subDispozitive.jaluzele.forEach(d => { d.stare = "Pornit"; d.valoare = 0; }); // Tragem jaluzelele
        subDispozitive.tv.forEach(d => d.stare = "Pornit");
        subDispozitive.audio.forEach(d => { d.stare = "Pornit"; d.valoare = 40; });
        if (typeof showToast === "function") showToast("🎬 Mod Cinema: Jaluzele trase, TV pornit.");
    }
    actualizeazaStatusGlobal();
}

// --- LOGICA STATUSULUI CASEI ---
function actualizeazaStatusGlobal() {
    const securitateElem = document.getElementById('global-securitate');
    const pericoleElem = document.getElementById('global-pericole');
    const consumElem = document.getElementById('global-consum');
    const bannerElem = document.getElementById('status-banner');
    if (!consumElem) return;

    // Calculăm Consumul Electric
    let consumWați = 200; // Consumul de bază al routerului/sistemului
    subDispozitive.becuri.forEach(d => { if (d.stare === "Pornit") consumWați += (d.valoare * 0.5); }); // becurile variază în funcție de intensitate
    subDispozitive.tv.forEach(d => { if (d.stare === "Pornit") consumWați += 150; });
    subDispozitive.audio.forEach(d => { if (d.stare === "Pornit") consumWați += 80; });
    subDispozitive.prize.forEach(d => { if (d.stare === "Pornit") consumWați += d.consum; });
    
    consumElem.innerText = (consumWați / 1000).toFixed(2) + " kW";

    // Verificăm Securitatea
    const alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';
    const usaDeblocata = subDispozitive.incuietori.some(d => d.stare === "Deblocat");

    if (alDezactivata) {
        securitateElem.innerText = "Dezactivată";
        securitateElem.style.color = "var(--error-color)";
    } else if (usaDeblocata) {
        securitateElem.innerText = "Vulnerabilă (Ușă deschisă)";
        securitateElem.style.color = "orange";
    } else {
        securitateElem.innerText = "Armată & Sigură";
        securitateElem.style.color = "var(--success-color)";
    }

    // Verificăm Pericolele
    const inundatieActive = localStorage.getItem('pericolInundatie') === 'true';
    const incendiuActive = localStorage.getItem('pericolIncendiu') === 'true';

    if (inundatieActive || incendiuActive) {
        pericoleElem.innerText = "🚨 PERICOL!";
        pericoleElem.style.color = "white";
        bannerElem.style.backgroundColor = "var(--error-color)";
        bannerElem.style.borderLeft = "5px solid white";
        document.querySelectorAll('#status-banner h4, #status-banner p').forEach(el => el.style.color = "white");
    } else {
        pericoleElem.innerText = "Normal";
        pericoleElem.style.color = "var(--success-color)";
        bannerElem.style.backgroundColor = "var(--card-bg)";
        bannerElem.style.borderLeft = "5px solid var(--success-color)";
        document.querySelectorAll('#status-banner h4').forEach(el => el.style.color = "var(--text-color)");
        document.getElementById('global-securitate').style.color = alDezactivata ? "var(--error-color)" : (usaDeblocata ? "orange" : "var(--success-color)");
        document.getElementById('global-pericole').style.color = "var(--success-color)";
        document.getElementById('global-consum').style.color = "var(--accent-color)";
    }
}

// --- UTILITIES ---
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

    cards.forEach((card, index) => { card.style.order = index; });
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('popup-dispozitive');
    if (event.target === modal) modal.classList.remove('active');
}