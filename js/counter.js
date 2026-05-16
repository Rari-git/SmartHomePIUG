document.addEventListener('DOMContentLoaded', () => {
    rearrangeDashboard();
    randareCercuriPinned(); 
    actualizeazaStatusGlobal();
});

const subDispozitive = {
    becuri: [
        { nume: "Bec Dormitor", stare: "Pornit", valoare: 75 },
        { nume: "Bec Living", stare: "Oprit", valoare: 50 },
        { nume: "Bec Baie", stare: "Oprit", valoare: 50 },
        { nume: "Bec Bucătărie", stare: "Oprit", valoare: 100 }
    ],
    jaluzele: [
        { nume: "Draperie Dormitor", stare: "Oprit", valoare: 100 },
        { nume: "Draperie 1 Living", stare: "Oprit", valoare: 0 },
        { nume: "Draperie 2 Living", stare: "Oprit", valoare: 0 },
        { nume: "Draperie Baie", stare: "Oprit", valoare: 100 }
    ],
    audio: [
        { nume: "Boxă Dormitor", stare: "Oprit", valoare: 40 },
        { nume: "Boxă Living", stare: "Oprit", valoare: 30 },
        { nume: "Sistem Audio Living", stare: "Oprit", valoare: 50 },
        { nume: "Boxă Baie", stare: "Oprit", valoare: 30 },
        { nume: "Boxă Bucătărie", stare: "Oprit", valoare: 20 }
    ],
    tv: [
        { nume: "Televizor Dormitor", stare: "Oprit" },
        { nume: "Televizor Living", stare: "Pornit" }
    ],
    aspirator: [
        { nume: "Robot Curățenie Living", stare: "La Bază", baterie: 100 }
    ],
    electrocasnice: [
        { nume: "Mașină de Spălat Baie", stare: "Oprit" },
        { nume: "Uscător Baie", stare: "Oprit" }
    ],
    prize: [
        { nume: "Priză Dormitor (Laptop, TV, Telefon)", stare: "Pornit", consum: 45, camera: "Dormitor" },
        { nume: "Priză Living (Sistem Audio, TV, Statie Robot)", stare: "Pornit", consum: 180, camera: "Living" },
        { nume: "Priză Baie (Uscător, Mașină Spălat)", stare: "Oprit", consum: 2100, camera: "Baie" },
        { nume: "Priză Bucătărie (Aragaz, Frigider)", stare: "Pornit", consum: 280, camera: "Bucătărie" }
    ],
    incuietori: [
        { nume: "Ușă Principală Intrare", stare: "Blocat" }
    ]
};

function deschideMeniuDispozitive(cardId, categorie, elementIndex = null) {
    trackAccess(cardId);

    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const star = document.getElementById('modal-star');
    const continental = document.getElementById('modal-continut');

    continental.innerHTML = "";
    let titluText = "";
    let logoStr = "";

    if (categorie.startsWith('climatizare-')) {
        const cam = categorie.replace('climatizare-', '');
        const camNume = cam.charAt(0).toUpperCase() + cam.slice(1);
        titlu.innerText = `🌡️ Ambient & Calitate Aer - ${camNume}`;
        star.style.display = "none";
        
        let tempVal = "22";
        let co2Val = "450";
        const tempElem = document.getElementById(`temp-${cam}`);
        if (tempElem) tempVal = tempElem.innerText;
        
        if (cam === 'dormitor') co2Val = "415";
        if (cam === 'living') co2Val = "450";
        if (cam === 'baie') co2Val = "390";
        if (cam === 'bucatarie') co2Val = "485";

        continental.innerHTML = `
            <div style="padding: 15px; background: rgba(52,152,219,0.1); border-radius: 10px; margin-bottom: 15px;">
                <h3 style="margin: 5px 0; font-size: 1.3em; color: var(--accent-color);">🌡️ Temperatură: ${tempVal}°C</h3>
                <h3 style="margin: 12px 0 5px 0; font-size: 1.3em; color: var(--success-color);">🍃 Calitate Aer: ${co2Val} ppm</h3>
                <p style="margin: 5px 0 0 0; font-size: 0.85em; opacity: 0.7;">Stare: Parametri Optimi</p>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    if (categorie === 'senzori-bucatarie' || categorie === 'senzori-baie') {
        const isFum = categorie === 'senzori-bucatarie';
        titlu.innerText = isFum ? "🔥 Senzor Fum Bucătărie" : "💧 Senzor Inundație Baie";
        star.style.display = "none";
        
        let stareAlerta = isFum ? localStorage.getItem('pericolIncendiu') === 'true' : localStorage.getItem('pericolInundatie') === 'true';
        let stareText = isFum ? (stareAlerta ? "PERICOL FUM!" : "SIGUR") : (stareAlerta ? "INUNDAȚIE!" : "USCAT");
        let stareColor = stareAlerta ? "var(--error-color)" : "var(--success-color)";
        
        continental.innerHTML = `
            <div style="text-align: center; padding: 15px;">
                <h2 style="color: ${stareColor}; font-size: 2em; margin: 10px 0;">${stareText}</h2>
                <p style="font-size: 0.9em; opacity: 0.8; margin-bottom: 20px;">Senzorul monitorizează permanent siguranța locuinței.</p>
                <button onclick="comutaSenzorHarta('${isFum ? 'incendiu' : 'inundatie'}')" style="background-color: var(--accent-color); width: 100%;">
                    🔄 Simulează / Resetează Stare Alertă
                </button>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    star.style.display = "inline-block";

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
            continental.appendChild(btn);
        });

    } else {
        let listToRender = [];
        
        if (elementIndex !== null) {
            const targetObj = subDispozitive[categorie][elementIndex];
            listToRender = [{ disp: targetObj, realIndex: elementIndex }];
            
            if(categorie === 'becuri') logoStr = "💡";
            else if(categorie === 'jaluzele') logoStr = "🪟";
            else if(categorie === 'audio') logoStr = "🎵";
            else if(categorie === 'tv') logoStr = "📺";
            else if(categorie === 'aspirator') logoStr = "🤖";
            else if(categorie === 'electrocasnice') logoStr = "🧺";
            else if(categorie === 'prize') logoStr = "🔌";
            else if(categorie === 'incuietori') logoStr = "🚪";
            
            titluText = `${logoStr} ${targetObj.nume}`;
        } else {
            if(categorie === 'becuri') { titluText = "💡 Gestionare Becuri"; logoStr = "💡"; }
            else if(categorie === 'jaluzele') { titluText = "🪟 Draperii & Jaluzele"; logoStr = "🪟"; }
            else if(categorie === 'audio') { titluText = "🎵 Sistem Audio"; logoStr = "🎵"; }
            else if(categorie === 'tv') { titluText = "📺 Control Televizoare"; logoStr = "📺"; }
            else if(categorie === 'aspirator') { titluText = "🤖 Control Aspirator"; logoStr = "🤖"; }
            else if(categorie === 'electrocasnice') { titluText = "🧺 Electrocasnice Baie"; logoStr = "🧺"; }
            else if(categorie === 'prize') { titluText = "🔌 Prize & Consum Camere"; logoStr = "🔌"; }
            else if(categorie === 'incuietori') { titluText = "🚪 Încuietori Smart"; logoStr = "🚪"; }

            listToRender = subDispozitive[categorie].map((disp, i) => ({ disp: disp, realIndex: i }));
        }

        if (categorie === 'incuietori') {
            let alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';
            let alarmStateText = alDezactivata ? "Dezactivată" : "Armată";
            let alarmBtnColor = alDezactivata ? 'var(--error-color)' : 'var(--success-color)';
            
            const alarmBlock = document.createElement('div');
            alarmBlock.style.cssText = "margin-bottom: 20px; padding: 12px; background: rgba(52,152,219,0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--accent-color);";
            alarmBlock.innerHTML = `
                <span style="font-weight: bold;">🛡️ Sistem Alarmă Casă</span>
                <button onclick="toggleAlarmaUsa(this)" style="background-color: ${alarmBtnColor}; color: white; cursor: pointer; padding: 6px 14px; border: none; border-radius: 4px;">
                    ${alarmStateText}
                </button>
            `;
            continental.appendChild(alarmBlock);
        }

        if (elementIndex === null) {
            const masterOffLocal = document.createElement('button');
            masterOffLocal.style.cssText = "width: 100%; background-color: transparent; border: 2px solid var(--error-color); color: var(--text-color); margin-bottom: 15px; font-size: 0.9em; padding: 10px; border-radius: 5px; cursor: pointer;";
            masterOffLocal.innerText = categorie === 'incuietori' ? "🔒 Blochează toate ușile" : "🛑 Oprește toate dispozitivele din listă";
            masterOffLocal.onclick = () => stingeTotDinCategorie(categorie);
            continental.appendChild(masterOffLocal);
        }

        listToRender.forEach(({ disp, realIndex }) => {
            const containerBlock = document.createElement('div');
            containerBlock.style.cssText = "margin-bottom: 20px; padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);";

            if (categorie === 'aspirator') {
                let statusColor = disp.stare === 'Curăță' ? 'var(--accent-color)' : (disp.stare === 'Pauză' ? 'orange' : '#95a5a6');
                containerBlock.innerHTML = `
                    <div style="display:flex; justify-content:space-between; font-weight:500;">
                        <span>${disp.nume}</span>
                        <span style="color:${statusColor}; font-weight:bold;">${disp.stare} (🔋${disp.baterie}%)</span>
                    </div>
                    <div style="display:flex; gap:5px; margin-top:10px;">
                        <button onclick="comutaAspirator(${realIndex}, 'Curăță')" style="flex:1; background-color:var(--accent-color); color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">▶️ Curăță</button>
                        <button onclick="comutaAspirator(${realIndex}, 'Pauză')" style="flex:1; background-color:orange; color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">⏸️ Pauză</button>
                        <button onclick="comutaAspirator(${realIndex}, 'La Bază')" style="flex:1; background-color:#95a5a6; color:white; border:none; border-radius:4px; padding:8px; cursor:pointer;">🏠 Bază</button>
                    </div>
                `;
            } else {
                const itemHeader = document.createElement('div');
                itemHeader.className = 'modal-list-item';
                itemHeader.style.border = "none";
                itemHeader.style.padding = "0";

                let btnColor = disp.stare === 'Pornit' || disp.stare === 'Blocat' ? 'var(--success-color)' : '#95a5a6';
                if (disp.stare === 'Deblocat') btnColor = 'var(--error-color)';

                let extraText = '';
                if (categorie === 'prize') {
                    let socketConsum = disp.stare === 'Pornit' ? disp.consum : 0;
                    extraText = ` <span style="font-size:0.85em; color:var(--accent-color); font-weight:bold;">(⚡ Consum Curent: ${socketConsum}W)</span>`;
                }

                itemHeader.innerHTML = `
                    <span style="font-weight: 500;">${disp.nume}${extraText}</span>
                    <button onclick="comutaStareSubDispozitiv('${categorie}', ${realIndex}, this)" 
                            style="background-color: ${btnColor}; color: white; cursor: pointer; padding: 6px 14px; border: none; border-radius: 4px;">
                        ${disp.stare}
                    </button>
                `;
                containerBlock.appendChild(itemHeader);

                if (categorie === 'becuri' || categorie === 'audio' || categorie === 'jaluzele') {
                    const isOff = disp.stare === 'Oprit';
                    const sliderWrapper = document.createElement('div');
                    sliderWrapper.className = `slider-container ${isOff ? 'disabled-controls' : ''}`;
                    
                    let labelText = '';
                    if(categorie === 'becuri') labelText = `Intensitate: <span id="val-${categorie}-${realIndex}">${disp.valoare}</span>%`;
                    if(categorie === 'audio') labelText = `Volum: <span id="val-${categorie}-${realIndex}">${disp.valoare}</span>%`;
                    if(categorie === 'jaluzele') labelText = `Deschidere draperie: <span id="val-${categorie}-${realIndex}">${disp.valoare}</span>%`;
                    
                    let presetsHtml = '';
                    if (categorie === 'becuri') {
                        presetsHtml = `<div style="display:flex; gap:5px; margin-top:2px;">
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 10)">10%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 25)">25%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 50)">50%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 75)">75%</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 100)">100%</button>
                        </div>`;
                    } else if (categorie === 'jaluzele') {
                        presetsHtml = `<div style="display:flex; gap:5px; margin-top:2px;">
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 0)">Închis</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 50)">Jumătate</button>
                            <button class="preset-btn" ${isOff ? 'disabled' : ''} onclick="seteazaPresetSlider('${categorie}', ${realIndex}, 100)">Deschis</button>
                        </div>`;
                    }

                    sliderWrapper.innerHTML = `
                        <label style="font-size:0.85em; opacity:0.8;">${labelText}</label>
                        <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} id="slider-${categorie}-${realIndex}" oninput="actualizeazaValoareSlider('${categorie}', ${realIndex}, this.value)">
                        ${presetsHtml}
                    `;
                    containerBlock.appendChild(sliderWrapper);
                }
            }
            continental.appendChild(containerBlock);
        });
    }

    titlu.innerText = titluText;
    const pinnedItems = JSON.parse(localStorage.getItem('pinnedItems')) || [];
    const isPinned = pinnedItems.some(item => item.id === cardId);
    
    if (isPinned) { star.classList.add('pinned'); star.innerText = "★"; } 
    else { star.classList.remove('pinned'); star.innerText = "☆"; }
    
    star.onclick = () => togglePinModal(cardId, logoStr, star);
    modal.classList.add('active');
}

function comutaSenzorHarta(tip) {
    if (tip === 'incendiu') {
        let active = localStorage.getItem('pericolIncendiu') === 'true';
        if (active) {
            localStorage.setItem('pericolIncendiu', 'false');
            if (typeof showToast === "function") showToast("Senzor fum resetat. Stare: SIGUR.");
        } else {
            localStorage.setItem('pericolIncendiu', 'true');
            if (typeof showToast === "function") showToast("⚠️ Alertă fum detectată din schița hărții!");
        }
    } else {
        let active = localStorage.getItem('pericolInundatie') === 'true';
        if (active) {
            localStorage.setItem('pericolInundatie', 'false');
            if (typeof showToast === "function") showToast("Senzor inundație resetat. Stare: USCAT.");
        } else {
            localStorage.setItem('pericolInundatie', 'true');
            if (typeof showToast === "function") showToast("⚠️ Alertă inundație detectată din schița hărții!");
        }
    }
    document.dispatchEvent(new Event('DOMContentLoaded'));
    inchidePopup();
}

function toggleAlarmaUsa(btn) {
    let alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';
    if (alDezactivata) {
        localStorage.setItem('alarmaDezactivata', 'false');
        btn.innerText = "Armată";
        btn.style.backgroundColor = "var(--success-color)";
        if (typeof showToast === "function") showToast("Sistemul de alarmă general a fost Armat!");
    } else {
        localStorage.setItem('alarmaDezactivata', 'true');
        btn.innerText = "Dezactivată";
        btn.style.backgroundColor = "var(--error-color)";
        if (typeof showToast === "function") showToast("Sistemul de alarmă general a fost Dezactivat!");
    }
    actualizeazaStatusGlobal();
}

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
        
        let catTarget = item.id.replace('cat_', '');
        circle.onclick = () => deschideMeniuDispozitive(item.id, catTarget);
        container.appendChild(circle);
    });
}

function comutaStareSubDispozitiv(categorie, index, buton) {
    const disp = subDispozitive[categorie][index];
    
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
    if (typeof showToast === "function") showToast(`${disp.nume} este acum ${disp.stare.toLowerCase()}.`);
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

function stingeTotDinCategorie(categorie) {
    subDispozitive[categorie].forEach(disp => {
        if (categorie === 'incuietori') disp.stare = 'Blocat';
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
            else d.stare = "Oprit";
        });
    });
    actualizeazaStatusGlobal();
    if (typeof showToast === "function") showToast("🛑 Comandă Master Off! Totul a fost închis și securizat.");
}

function aplicaMod(mod) {
    stingeTotGlobal();
    if (mod === 'noapte') {
        if (typeof showToast === "function") showToast("🌙 Mod Noapte: Totul închis, uși blocate.");
    } 
    else if (mod === 'party') {
        subDispozitive.becuri.forEach(d => { if(d.nume.includes("Living") || d.nume.includes("Dormitor")) { d.stare = "Pornit"; d.valoare = 100; } });
        subDispozitive.audio.forEach(d => { if(d.nume.includes("Living")) { d.stare = "Pornit"; d.valoare = 80; } });
        if (typeof showToast === "function") showToast("🎉 Mod Party: Lumini la 100% și Muzică pornită.");
    } 
    else if (mod === 'cinema') {
        subDispozitive.jaluzele.forEach(d => { if(d.nume.includes("Living")) { d.stare = "Pornit"; d.valoare = 0; } });
        subDispozitive.tv.forEach(d => { if(d.nume.includes("Living")) d.stare = "Pornit"; });
        subDispozitive.audio.forEach(d => { if(d.nume.includes("Living")) { d.stare = "Pornit"; d.valoare = 45; } });
        if (typeof showToast === "function") showToast("🎬 Mod Cinema: Draperii trase, TV pornit.");
    }
    actualizeazaStatusGlobal();
}

function actualizeazaStatusGlobal() {
    const securitateElem = document.getElementById('global-securitate');
    const pericoleElem = document.getElementById('global-pericole');
    const consumElem = document.getElementById('global-consum');
    const bannerElem = document.getElementById('status-banner');
    if (!consumElem) return;

    let consumWați = 150; 
    subDispozitive.becuri.forEach(d => { if (d.stare === "Pornit") consumWați += (d.valoare * 0.4); });
    subDispozitive.tv.forEach(d => { if (d.stare === "Pornit") consumWați += 120; });
    subDispozitive.audio.forEach(d => { if (d.stare === "Pornit") consumWați += 60; });
    subDispozitive.prize.forEach(d => { if (d.stare === "Pornit") consumWați += d.consum; });
    subDispozitive.electrocasnice.forEach(d => { if (d.stare === "Pornit") consumWați += 1200; });
    
    consumElem.innerText = (consumWați / 1000).toFixed(2) + " kW";

    const alDezactivata = localStorage.getItem('alarmaDezactivata') === 'true';
    const usaDeblocata = subDispozitive.incuietori.some(d => d.stare === "Deblocat");

    if (alDezactivata) {
        securitateElem.innerText = "Dezactivată";
        securitateElem.style.color = "var(--error-color)";
    } else if (usaDeblocata) {
        securitateElem.innerText = "Ușă deblocată!";
        securitateElem.style.color = "orange";
    } else {
        securitateElem.innerText = "Armată & Sigură";
        securitateElem.style.color = "var(--success-color)";
    }

    const inundatieActive = localStorage.getItem('pericolInundatie') === 'true';
    const incendiuActive = localStorage.getItem('pericolIncendiu') === 'true';

    if (inundatieActive || incendiuActive) {
        pericoleElem.innerText = "🚨 ALERTĂ!";
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