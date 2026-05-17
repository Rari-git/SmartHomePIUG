let intervalVacanta = null;

// Extrase perfecte din folderele tale "assets" cu adaptare la currentColor
const iconDraperie = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.3 122.88" fill="currentColor" class="hk-svg-icon"><path fill-rule="evenodd" d="M100.86,52.48H1.44a1.43,1.43,0,0,1-1.44-1.44V34.5a1.44,1.44,0,0,1,1.44-1.43H100.86a1.43,1.43,0,0,1,1.44,1.43V51a1.44,1.44,0,0,1-1.44,1.44Zm0,18.89H1.44a1.43,1.43,0,0,1-1.44-1.44V53.39A1.44,1.44,0,0,1,1.44,52H100.86a1.43,1.43,0,0,1,1.44,1.44V69.93a1.44,1.44,0,0,1-1.44,1.44Zm0,18.89H1.44a1.44,1.44,0,0,1-1.44-1.44V72.28A1.44,1.44,0,0,1,1.44,70.84H100.86a1.43,1.43,0,0,1,1.44,1.44v16.54a1.43,1.43,0,0,1-1.44,1.44Zm0,18.88H1.44a1.43,1.43,0,0,1-1.44-1.44V91.17a1.44,1.44,0,0,1,1.44-1.44H100.86a1.43,1.43,0,0,1,1.44,1.44V107.7a1.43,1.43,0,0,1-1.44,1.44Zm-1.87,13.74H3.31A3.31,3.31,0,0,1,0,119.57V110.1A1.44,1.44,0,0,1,1.44,108.6H100.86a1.43,1.43,0,0,1,1.44,1.44v9.47a3.32,3.32,0,0,1-3.31,3.37ZM99,32.14H3.31A3.31,3.31,0,0,1,0,28.83V3.31A3.31,3.31,0,0,1,3.31,0H99a3.31,3.31,0,0,1,3.31,3.31V28.83A3.31,3.31,0,0,1,99,32.14Z"/></svg>`;
const iconFereastra = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.3 122.88" fill="currentColor" class="hk-svg-icon">
  <path d="
    M10 10 H92 V112 H10 Z

    M10 10 H92 V28 H10 Z

    M51 10 V112

    M10 61 H92
  "/>
</svg>`;

const scenesDB = [
    { id: 's_morning', nume: "🌅 Good Morning", descriere: "Deschide jaluzelele, pornește cafeaua.", action: () => aplicaMod('morning') },
    { id: 's_night', nume: "🌙 Good Night", descriere: "Oprește luminile, armează ușile.", action: () => aplicaMod('night') },
    { id: 's_away', nume: "👋 Leaving Home", descriere: "Oprește tot, robotul începe curățenia.", action: () => aplicaMod('away') },
    { id: 's_home', nume: "🏠 I'm Home", descriere: "Dezactivează alarma, deschide jaluzelele.", action: () => aplicaMod('home') },
    { id: 's_movie', nume: "🎬 Movie Time", descriere: "Draperii închise, TV pornit, ambient albastru.", action: () => aplicaMod('movie') },
    { id: 's_focus', nume: "📖 Focus / Citit", descriere: "Lumină birou, purificator pornit.", action: () => aplicaMod('focus') },
    { id: 's_dinner', nume: "🍽️ Dinner Time", descriere: "Lumini calde în living și bucătărie.", action: () => aplicaMod('dinner') },
    { id: 's_vacation', nume: "🧳 Vacation Mode", descriere: "Simulare prezență și securitate.", action: () => aplicaMod('vacation') }
];

const sabloaneRecomandate = [
    { idSugestie: 'sug_1', icon: '<i class="ph-bold ph-clock"></i>', nume: 'Rutina de Dimineață', descriereScurta: 'Deschide jaluzelele în living zilnic la ora 07:00.', culoare: '#f1c40f',
      tipTrigger: 'timp', tOra: '07:00', aCat: 'jaluzele', aIdx: '1', aState: 'Deschis', descriere: '⏰ Zilnic la 07:00 ➔ Draperie Living se Deschide' },
    { idSugestie: 'sug_2', icon: iconFereastra, nume: 'Eco-Baie', descriereScurta: 'Oprește uscătorul dacă se deschide fereastra la baie.', culoare: '#e74c3c',
      tipTrigger: 'disp', tCat: 'senzoriContact', tIdx: '4', tState: 'Deschis', aCat: 'electrocasnice', aIdx: '1', aState: 'Oprit', descriere: 'DACĂ Fereastră Baie este Deschisă ➔ Uscătorul se Oprește' },
    { idSugestie: 'sug_3', icon: '<i class="ph-bold ph-person-simple-walk"></i>', nume: 'Securitate Hol', descriereScurta: 'Aprinde becul din living la detectarea mișcării pe hol.', culoare: '#2ecc71',
      tipTrigger: 'disp', tCat: 'senzoriMiscare', tIdx: '1', tState: 'Activ', aCat: 'becuri', aIdx: '1', aState: 'Pornit', descriere: 'DACĂ Senzor Mișcare Hol este Activ ➔ Bec Living devine Pornit' },
    { idSugestie: 'sug_4', icon: '<i class="ph-bold ph-moon"></i>', nume: 'Stingere Noaptea', descriereScurta: 'Stinge becul din living zilnic la ora 23:30.', culoare: '#34495e',
      tipTrigger: 'timp', tOra: '23:30', aCat: 'becuri', aIdx: '1', aState: 'Oprit', descriere: '⏰ Zilnic la 23:30 ➔ Bec Living devine Oprit' },
    { idSugestie: 'sug_5', icon: '<i class="ph-bold ph-lock-key"></i>', nume: 'Încuiere Automată', descriereScurta: 'Blochează ușa principală la ora 22:00 în fiecare seară.', culoare: '#e67e22',
      tipTrigger: 'timp', tOra: '22:00', aCat: 'incuietori', aIdx: '0', aState: 'Blocat', descriere: '⏰ Zilnic la 22:00 ➔ Încuietoare Ușă devine Blocat' },
    { idSugestie: 'sug_6', icon: '<i class="ph-bold ph-television"></i>', nume: 'Cinema Rapid', descriereScurta: 'Aprinde banda LED ambientală când Smart TV-ul este pornit.', culoare: '#9b59b6',
      tipTrigger: 'disp', tCat: 'tv', tIdx: '1', tState: 'Pornit', aCat: 'luminiRGB', aIdx: '0', aState: 'Pornit', descriere: 'DACĂ Smart TV OLED 8K este Pornit ➔ Bandă LED TV devine Pornit' },
    { idSugestie: 'sug_7', icon: iconFereastra, nume: 'Oprire Aer Fereastră', descriereScurta: 'Oprește purificatorul dacă fereastra din dormitor este deschisă.', culoare: '#1abc9c',
      tipTrigger: 'disp', tCat: 'senzoriContact', tIdx: '0', tState: 'Deschis', aCat: 'purificator', aIdx: '0', aState: 'Oprit', descriere: 'DACĂ Fereastră Dormitor este Deschisă ➔ Purificatorul se Oprește' },
    { idSugestie: 'sug_8', icon: '<i class="ph-bold ph-coffee"></i>', nume: 'Cafea Dimineața', descriereScurta: 'Pornește espressorul din bucătărie în fiecare zi la 07:15.', culoare: '#d35400',
      tipTrigger: 'timp', tOra: '07:15', aCat: 'electrocasnice', aIdx: '2', aState: 'Pornit', descriere: '⏰ Zilnic la 07:15 ➔ Espressor Cafea devine Pornit' },
    { idSugestie: 'sug_9', icon: iconDraperie, nume: 'Intimitate Seara', descriereScurta: 'Închide automat draperiile din dormitor la ora 20:00.', culoare: '#3498db',
      tipTrigger: 'timp', tOra: '20:00', aCat: 'jaluzele', aIdx: '0', aState: 'Închis', descriere: '⏰ Zilnic la 20:00 ➔ Draperie Dormitor se Închide' }
];

const defaultDispozitive = {
    becuri: [{ nume: "Bec Dormitor", stare: "Pornit", valoare: 75, camera: "Dormitor", icon: '<i class="ph-fill ph-lightbulb"></i>' }, { nume: "Bec Living", stare: "Oprit", valoare: 50, camera: "Living", icon: '<i class="ph-fill ph-lightbulb"></i>' }, { nume: "Bec Baie", stare: "Oprit", valoare: 50, camera: "Baie", icon: '<i class="ph-fill ph-lightbulb"></i>' }, { nume: "Bec Bucătărie", stare: "Oprit", valoare: 100, camera: "Bucătărie", icon: '<i class="ph-fill ph-lightbulb"></i>' }],
    luminiRGB: [{ nume: "Bandă LED TV", stare: "Oprit", valoare: 100, culoare: "#3498db", camera: "Living", icon: '<i class="ph-fill ph-lamp"></i>' }, { nume: "Lampă Birou", stare: "Oprit", valoare: 80, culoare: "#f1c40f", camera: "Dormitor", icon: '<i class="ph-fill ph-lamp"></i>' }],
    jaluzele: [{ nume: "Draperie", stare: "Închis", valoare: 0, camera: "Dormitor", icon: iconDraperie }, { nume: "Draperie 1 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: iconDraperie }, { nume: "Draperie 2 Living", stare: "Deschis", valoare: 100, camera: "Living", icon: iconDraperie }, { nume: "Draperie Baie", stare: "Închis", valoare: 0, camera: "Baie", icon: iconDraperie }, { nume: "Draperie Bucătărie", stare: "Închis", valoare: 0, camera: "Bucătărie", icon: iconDraperie }],
    audio: [{ nume: "Boxă Dormitor", stare: "Oprit", valoare: 40, camera: "Dormitor", icon: '<i class="ph-fill ph-speaker-high"></i>' }, { nume: "Boxă Living", stare: "Oprit", valoare: 30, camera: "Living", icon: '<i class="ph-fill ph-speaker-high"></i>' }, { nume: "Sistem Audio Dolby Atmos 7.1", stare: "Oprit", valoare: 50, camera: "Living", icon: '<i class="ph-fill ph-speaker-high"></i>' }, { nume: "Boxă Baie", stare: "Oprit", valoare: 30, camera: "Baie", icon: '<i class="ph-fill ph-speaker-high"></i>' }, { nume: "Boxă Bucătărie", stare: "Oprit", valoare: 20, camera: "Bucătărie", icon: '<i class="ph-fill ph-speaker-high"></i>' }],
    tv: [{ nume: "TV Dormitor", stare: "Oprit", camera: "Dormitor", icon: '<i class="ph-fill ph-television"></i>' }, { nume: "Smart TV OLED 8K", stare: "Oprit", camera: "Living", icon: '<i class="ph-fill ph-television"></i>' }],
    aspirator: [{ nume: "Robot Curățenie", stare: "La Bază", baterie: 100, camera: "Living", icon: '<i class="ph-fill ph-robot"></i>' }],
    purificator: [{ nume: "Purificator Aer", stare: "Auto", camera: "Dormitor", icon: '<i class="ph-fill ph-wind"></i>' }, { nume: "Purificator Aer", stare: "Oprit", camera: "Living", icon: '<i class="ph-fill ph-wind"></i>' }],
    electrocasnice: [{ nume: "Mașină de Spălat", stare: "Oprit", camera: "Baie", icon: '<i class="ph-fill ph-washing-machine"></i>' }, { nume: "Uscător", stare: "Oprit", camera: "Baie", icon: '<i class="ph-fill ph-wind"></i>' }, { nume: "Espressor Cafea", stare: "Oprit", camera: "Bucătărie", icon: '<i class="ph-fill ph-coffee"></i>' }],
    prize: [{ nume: "Priză Dormitor", stare: "Pornit", consum: 120, detalii: "TV, Laptop, Purificator", camera: "Dormitor", icon: '<i class="ph-fill ph-plug"></i>' }, { nume: "Priză Living", stare: "Pornit", consum: 480, detalii: "Sistem Audio, TV, Robot Curățenie, Purificator", camera: "Living", icon: '<i class="ph-fill ph-plug"></i>' }, { nume: "Priză Baie", stare: "Pornit", consum: 0, detalii: "Mașină de Spălat, Uscător", camera: "Baie", icon: '<i class="ph-fill ph-plug"></i>' }, { nume: "Priză Bucătărie", stare: "Pornit", consum: 150, detalii: "Espressor, Frigider", camera: "Bucătărie", icon: '<i class="ph-fill ph-plug"></i>' }],
    senzoriContact: [{ nume: "Fereastră Dormitor", stare: "Închis", camera: "Dormitor", icon: iconFereastra }, { nume: "Fereastră 1 Living", stare: "Închis", camera: "Living", icon: iconFereastra }, { nume: "Fereastră 2 Living", stare: "Închis", camera: "Living", icon: iconFereastra }, { nume: "Fereastră Bucătărie", stare: "Închis", camera: "Bucătărie", icon: iconFereastra }, { nume: "Fereastră Baie", stare: "Închis", camera: "Baie", icon: iconFereastra }],
    senzoriMiscare: [{ nume: "Senzor Mișcare Living", stare: "Inactiv", camera: "Living", icon: '<i class="ph-fill ph-person-simple-walk"></i>' }, { nume: "Senzor Mișcare Hol", stare: "Inactiv", camera: "Hol", icon: '<i class="ph-fill ph-person-simple-walk"></i>' }],
    camereVideo: [{ nume: "Interfon Video", stare: "Standby", camera: "Ușă Principală", icon: '<i class="ph-fill ph-video-camera"></i>' }, { nume: "Cameră Curte", stare: "Standby", camera: "Exterior", icon: '<i class="ph-fill ph-video-camera"></i>' }],
    incuietori: [{ nume: "Încuietoare Ușă", stare: "Blocat", camera: "Hol", icon: '<i class="ph-fill ph-lock-key"></i>' }]
};

let subDispozitive = {};

document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    incarcaNumeCasa();
    reincarcaInterfata();
});

setInterval(verificaAutomatizariTimp, 60000);

function initFavorites() {
    try {
        const saved = localStorage.getItem('smartHomeData');
        subDispozitive = saved ? JSON.parse(saved) : null;

        // Auto-heal logic forcing a reset to properly render custom SVGs
        if (!subDispozitive || !subDispozitive.becuri || !localStorage.getItem('design_svg_assets_v5')) {
            subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
            localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
            localStorage.setItem('design_svg_assets_v5', 'true');
        }
    } catch (e) {
        subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
        localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
        localStorage.setItem('design_svg_assets_v5', 'true');
    }

    if (!localStorage.getItem('favAcc')) localStorage.setItem('favAcc', JSON.stringify(['becuri_1', 'tv_1', 'incuietori_0', 'camereVideo_0']));
    if (!localStorage.getItem('favScenes')) localStorage.setItem('favScenes', JSON.stringify(['s_morning', 's_night']));
    if (!localStorage.getItem('motionLogs')) localStorage.setItem('motionLogs', JSON.stringify([]));
    if (!localStorage.getItem('userAutomations')) localStorage.setItem('userAutomations', JSON.stringify([]));
}

function salveazaStarea() {
    localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
}

function incarcaNumeCasa() {
    const titluCasa = document.getElementById('nume-casa-global');
    if (titluCasa) titluCasa.innerText = localStorage.getItem('numeCasaSalvat') || "My Home";
}

function toggleFavorite(id, type, event) {
    if(event) event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(type === 'scene' ? 'favScenes' : 'favAcc')) || [];
    if (favs.includes(id)) favs = favs.filter(item => item !== id);
    else favs.push(id);
    localStorage.setItem(type === 'scene' ? 'favScenes' : 'favAcc', JSON.stringify(favs));
    reincarcaInterfata();
}

function toggleStareDispozitiv(cat, index, event) {
    if(event) event.stopPropagation();
    localStorage.removeItem('activeScene');
    
    if (typeof intervalVacanta !== 'undefined' && intervalVacanta) {
        clearInterval(intervalVacanta);
        intervalVacanta = null;
    }
    
    const disp = subDispozitive[cat][index];
    
    const dictionarStari = {
        'incuietori': { 'Blocat': 'Deblocat', 'Deblocat': 'Blocat' },
        'senzoriContact': { 'Închis': 'Deschis', 'Deschis': 'Închis' },
        'jaluzele': { 'Închis': 'Deschis', 'Deschis': 'Închis' },
        'camereVideo': { 'Standby': 'LIVE', 'LIVE': 'Standby' },
        'senzoriMiscare': { 'Inactiv': 'Activ', 'Activ': 'Inactiv' },
        'aspirator': { 'La Bază': 'Curăță', 'Curăță': 'La Bază' }
    };

    if (dictionarStari[cat]) {
        const stareaCurenta = disp.stare;
        const stareaUrmatoare = dictionarStari[cat][stareaCurenta];
        if (stareaUrmatoare) {
            disp.stare = stareaUrmatoare;
        } else {
            if (cat === 'incuietori') disp.stare = 'Blocat';
            else if (cat === 'senzoriMiscare') disp.stare = 'Inactiv';
            else if (cat === 'camereVideo') disp.stare = 'Standby';
            else disp.stare = 'Închis';
        }
    } else if (cat === 'purificator') {
        if(disp.stare === "Oprit") disp.stare = "Auto";
        else if(disp.stare === "Auto") disp.stare = "Boost";
        else disp.stare = "Oprit";
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    if (cat === 'senzoriMiscare' && disp.stare === "Activ") {
        let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
        const timpAcum = new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'});
        logs.unshift({ camera: disp.camera, ora: timpAcum });
        localStorage.setItem('motionLogs', JSON.stringify(logs.slice(0, 15)));
    }
    
    if (typeof adaugaInLog === 'function') {
        let entitateNume = disp.nume ? `${disp.nume} (${disp.camera})` : `Dispozitiv ${cat}`;
        adaugaInLog(`${entitateNume} a fost comutat în starea [${disp.stare}]`);
    }
    
    verificaReguliAutomatizare(cat, index, disp.stare);
    salveazaStarea();
    reincarcaInterfata();
}

function verificaAutomatizariTimp() {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const timpAcum = new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'});
    let schimbare = false;
    
    rules.forEach(rule => {
        if (rule.active && rule.tipTrigger === 'timp' && rule.tOra === timpAcum) {
            const actionDisp = subDispozitive[rule.aCat] && subDispozitive[rule.aCat][rule.aIdx];
            if (actionDisp && actionDisp.stare !== rule.aState) {
                actionDisp.stare = rule.aState;
                rule.lastRun = `Azi la ${timpAcum}`;
                schimbare = true;
            }
        }
    });

    if (schimbare) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        salveazaStarea();
        reincarcaInterfata();
    }
}

function verificaReguliAutomatizare(triggerCat, triggerIdx, newState) {
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let schimbare = false;
    
    rules.forEach(rule => {
        if (rule.active && rule.tipTrigger === 'disp' && rule.tCat === triggerCat && rule.tIdx === triggerIdx.toString() && rule.tState === newState) {
            const actionDisp = subDispozitive[rule.aCat] && subDispozitive[rule.aCat][rule.aIdx];
            if (actionDisp) {
                actionDisp.stare = rule.aState;
                rule.lastRun = `Azi la ${new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}`;
                schimbare = true;
            }
        }
    });

    if (schimbare) {
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        salveazaStarea();
    }
}

function deschideModalAutomatizare() {
    const modal = document.getElementById('popup-automatizare');
    if(!modal) return;
    const selectTrigger = document.getElementById('auto-trigger-dev');
    const selectAction = document.getElementById('auto-action-dev');
    
    let optionsHTML = '';
    Object.keys(subDispozitive).forEach(cat => {
        (subDispozitive[cat] || []).forEach((disp, idx) => {
            optionsHTML += `<option value="${cat}_${idx}">${disp.nume} (${disp.camera})</option>`;
        });
    });
    
    selectTrigger.innerHTML = optionsHTML;
    selectAction.innerHTML = optionsHTML;
    modal.classList.add('active');
}

function salveazaAutomatizare() {
    const esteTimp = typeof modTriggerCurent !== 'undefined' && modTriggerCurent === 'timp';
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;
    const actionNume = subDispozitive[aVal[0]][aVal[1]].nume;

    let rule = {
        id: Date.now(),
        active: true,
        lastRun: "Niciodată",
        aCat: aVal[0], aIdx: aVal[1], aState: aState,
    };

    if (esteTimp) {
        const ora = document.getElementById('auto-trigger-timp').value;
        if (!ora) return;
        rule.tipTrigger = 'timp';
        rule.tOra = ora;
        rule.descriere = `⏰ Zilnic la ora ${ora} ➔ ${actionNume} devine ${aState}`;
    } else {
        const tVal = document.getElementById('auto-trigger-dev').value.split('_');
        const tState = document.getElementById('auto-trigger-state').value;
        const triggerNume = subDispozitive[tVal[0]][tVal[1]].nume;
        rule.tipTrigger = 'disp';
        rule.tCat = tVal[0]; rule.tIdx = tVal[1]; rule.tState = tState;
        rule.descriere = `DACĂ ${triggerNume} este ${tState} ➔ ${actionNume} devine ${aState}`;
    }

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.unshift(rule);
    localStorage.setItem('userAutomations', JSON.stringify(rules));

    inchidePopup();
    randareSabloane();
    randareAutomatizari();
}

function adaugaSugestie(idSugestie) {
    const sug = sabloaneRecomandate.find(s => s.idSugestie === idSugestie);
    if(!sug) return;
    
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let nouaRegula = { 
        id: Date.now(), 
        active: true, 
        lastRun: "Niciodată",
        idSugestie: sug.idSugestie, 
        tipTrigger: sug.tipTrigger,
        descriere: sug.descriere,
        aCat: sug.aCat, aIdx: sug.aIdx, aState: sug.aState
    };

    if (sug.tipTrigger === 'timp') {
        nouaRegula.tOra = sug.tOra;
    } else {
        nouaRegula.tCat = sug.tCat; nouaRegula.tIdx = sug.tIdx; nouaRegula.tState = sug.tState;
    }

    rules.unshift(nouaRegula);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    
    randareSabloane(); 
    randareAutomatizari();
}

function stergeAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules = rules.filter(r => r.id !== id);
    localStorage.setItem('userAutomations', JSON.stringify(rules));
    randareSabloane();
    randareAutomatizari();
}

function comutaAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const rule = rules.find(r => r.id === id);
    if (rule) {
        rule.active = !rule.active;
        localStorage.setItem('userAutomations', JSON.stringify(rules));
        randareAutomatizari();
    }
}

function randareSabloane() {
    const container = document.getElementById('sabloane-carousel');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const activeIds = rules.map(r => r.idSugestie).filter(id => id);
    let html = '';
    let counter = 0;
    
    sabloaneRecomandate.forEach(sug => {
        if (!activeIds.includes(sug.idSugestie)) {
            html += `
            <div class="suggestion-card" style="border-top: 5px solid ${sug.culoare};">
                <div style="font-size: 2em; margin-bottom: 10px; line-height: 1;">${sug.icon}</div>
                <strong style="font-size: 1.1em; color: ${sug.culoare};">${sug.nume}</strong>
                <p style="font-size: 0.85em; opacity: 0.8; margin: 10px 0; flex: 1; line-height: 1.4;">${sug.descriereScurta}</p>
                <button class="add-sug-btn" onclick="adaugaSugestie('${sug.idSugestie}')">+ Adaugă Regula</button>
            </div>`;
            counter++;
        }
    });
    container.innerHTML = counter === 0 ? `<p style="opacity:0.5; padding: 20px; font-style: italic;">Ai activat toate șabloanele recomandate!</p>` : html;
}

function randareAutomatizari() {
    const container = document.getElementById('automations-list');
    if (!container) return;
    const rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let html = '';
    rules.forEach(rule => {
        html += `
            <div class="hk-card" style="height: auto; padding: 20px; border-left: 5px solid ${rule.active ? 'var(--accent-color)' : '#95a5a6'}; opacity: ${rule.active ? '1' : '0.5'}; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 10px; margin-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 1.1em; color: ${rule.active ? 'var(--text-color)' : '#95a5a6'};">
                        ${rule.tipTrigger === 'timp' ? '<i class="ph-bold ph-clock"></i>' : '<i class="ph-bold ph-gear"></i>'} Regula Activă
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <label class="toggle-switch">
                            <input type="checkbox" onchange="comutaAutomatizare(${rule.id})" ${rule.active ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <button onclick="stergeAutomatizare(${rule.id})" style="background: transparent; color: var(--error-color); font-size: 1.3em; border: none; cursor: pointer; padding: 0;"><i class="ph-bold ph-trash"></i></button>
                    </div>
                </div>
                <div style="font-size: 1em; line-height: 1.5; font-weight: 500; flex: 1;">${rule.descriere}</div>
                <div style="margin-top: 15px; font-size: 0.8em; color: gray; font-weight: bold;">
                    <i class="ph-bold ph-clock-counter-clockwise"></i> Ultima rulare: ${rule.lastRun || 'Niciodată'}
                </div>
            </div>`;
    });
    html += `
        <div class="hk-card card-add-new" onclick="deschideModalAutomatizare()">
            <div class="plus-icon"><i class="ph-bold ph-plus"></i></div>
            <div style="font-size: 1.1em; font-weight: bold;">Regulă Nouă</div>
            <div style="font-size: 0.85em; margin-top: 5px;">Configurare complet manuală</div>
        </div>`;
    container.innerHTML = html;
}

function genereazaListaNotificari() {
    let notificari = [];
    const becuriAprinse = (subDispozitive.becuri || []).filter(d => d.stare === "Pornit");
    const rgbAprinse = (subDispozitive.luminiRGB || []).filter(d => d.stare === "Pornit");
    const totalLumini = becuriAprinse.length + rgbAprinse.length;
    if (totalLumini > 0) {
        notificari.push({ id: "notif_lumini", text: `<i class="ph-fill ph-lightbulb"></i> ${totalLumini} ${totalLumini === 1 ? 'lumină aprinsă' : 'lumini aprinse'}` });
    }
    const audioPornit = (subDispozitive.audio || []).filter(d => d.stare === "Pornit");
    if (audioPornit.length > 0) {
        notificari.push({ id: "notif_audio", text: `<i class="ph-fill ph-speaker-high"></i> ${audioPornit.length} sisteme active` });
    }
    const tvPornit = (subDispozitive.tv || []).filter(d => d.stare === "Pornit");
    if (tvPornit.length > 0) {
        notificari.push({ id: "notif_tv", text: `<i class="ph-fill ph-television"></i> TV pornit în ${tvPornit[0].camera}` });
    }
    if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === "Curăță") {
        notificari.push({ id: "notif_aspirator", text: `<i class="ph-fill ph-robot"></i> Robotul curăță în ${subDispozitive.aspirator[0].camera}` });
    }
    if (subDispozitive.incuietori && subDispozitive.incuietori[0] && subDispozitive.incuietori[0].stare === "Deblocat") {
        notificari.push({ id: "notif_usa", text: `<i class="ph-fill ph-lock-key"></i> Ușa de la intrare este deblocată!` });
    }
    if (subDispozitive.senzoriContact) {
        subDispozitive.senzoriContact.forEach((d, idx) => {
            if(d.stare === "Deschis") notificari.push({ id: `notif_fereastra_${idx}`, text: `${iconFereastra} Fereastră deschisă în ${d.camera}` });
        });
    }
    let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
    logs.forEach((log, idx) => {
        notificari.push({ id: `notif_motion_${idx}`, text: `<i class="ph-fill ph-person-simple-walk"></i> Mișcare în ${log.camera} [${log.ora}]` });
    });
    return notificari;
}

function afiseazaNotificariHome() {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    const toateNotificarile = genereazaListaNotificari();
    container.innerHTML = "";
    if (toateNotificarile.length === 0) {
        container.innerHTML = `<p style="margin:0; opacity:0.5; font-size:0.95em;">Toate sistemele sunt în standby.</p>`;
        return;
    }
    const limita = Math.min(toateNotificarile.length, 3);
    for (let i = 0; i < limita; i++) {
        const notif = toateNotificarile[i];
        if (notif.id === "notif_lumini") {
            container.innerHTML += `
                <div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer;">
                    <span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; margin-left: 5px; font-weight: bold;">(Apasă pentru detalii)</span></span>
                </div>`;
        } else {
            container.innerHTML += `<div class="notification-item"><span>${notif.text}</span></div>`;
        }
    }
    if (toateNotificarile.length > 3) {
        container.innerHTML += `<button class="see-more-btn" onclick="deschidePopupToateNotificarile()">Vezi mai multe &gt;</button>`;
    }
}

function deschidePopupToateNotificarile() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    titlu.innerHTML = "🔔 Toate Notificările Casei";
    
    const toateNotificarile = genereazaListaNotificari();
    let html = `<div style="max-height: 250px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; text-align: left;">`;
    toateNotificarile.forEach(notif => {
        if (notif.id === "notif_lumini") {
            html += `
                <div class="notification-item" onclick="deschidePopupLuminiAprinse()" style="cursor: pointer; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <span>${notif.text} <span style="font-size: 0.85em; opacity: 0.5; font-weight: bold;">(Apasă pentru detalii)</span></span>
                </div>`;
        } else {
            html += `<div class="notification-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);"><span>${notif.text}</span></div>`;
        }
    });
    html += `</div>
        <div style="margin-top: 10px;">
            <button onclick="localStorage.setItem('motionLogs', '[]'); afiseazaNotificariHome(); inchidePopup();" style="background-color: transparent; border: 2px solid var(--error-color); color: var(--error-color); width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                <i class="ph-bold ph-trash"></i> Șterge Istoric Mișcare
            </button>
        </div>`;
    continental.innerHTML = html;
    modal.classList.add('active');
}

function construiesteCardHTML(disp, cat, idx, isFav) {
    const isActive = ['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare);
    const idUnic = `${cat}_${idx}`;
    return `
        <div class="hk-card ${isActive ? 'is-active' : ''}" onclick="toggleStareDispozitiv('${cat}', ${idx}, event)">
            <div class="hk-controls">
                <button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${idUnic}', 'acc', event)"><i class="ph-fill ph-star"></i></button>
                <button class="hk-btn" onclick="deschideMeniuDispozitive('none', '${cat}', ${idx}); event.stopPropagation();"><i class="ph-bold ph-gear"></i></button>
            </div>
            <div class="hk-icon">${disp.icon}</div>
            <div>
                <div class="hk-name">${disp.nume}</div>
                <div class="hk-state">${disp.stare} ${disp.camera ? `• ${disp.camera}` : ''}</div>
            </div>
        </div>
    `;
}

function construiesteScenaHTML(scena, isFav) {
    const isActive = localStorage.getItem('activeScene') === scena.id;
    return `
        <div class="hk-card ${isActive ? 'is-active' : ''}" style="height: 90px;" onclick="executaScena('${scena.id}')">
            <div class="hk-controls">
                <button class="hk-btn hk-star ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${scena.id}', 'scene', event)"><i class="ph-fill ph-star"></i></button>
            </div>
            <div class="hk-name" style="font-size: 1.1em; margin-bottom: 5px;">${scena.nume}</div>
            <div class="hk-state" style="margin-top: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${scena.descriere}</div>
        </div>
    `;
}

function reincarcaInterfata() {
    actualizeazaStatusGlobal();
    if(document.getElementById('fav-scenes-container')) { randareHome(); afiseazaNotificariHome(); }
    if(document.getElementById('all-scenes-container')) randareScene();
    if(document.getElementById('all-accessories-container')) randareAccesorii();
    if(document.getElementById('security-devices-container')) randareSecuritate();
    if(document.getElementById('automations-list')) { randareAutomatizari(); randareSabloane(); }
    if(document.getElementById('logs-container')) randareStatisticiLogs();
}

function randareHome() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    let accHtml = '';
    Object.keys(subDispozitive).forEach(cat => {
        (subDispozitive[cat] || []).forEach((disp, idx) => {
            if(favAcc.includes(`${cat}_${idx}`)) accHtml += construiesteCardHTML(disp, cat, idx, true);
        });
    });
    document.getElementById('fav-accessories-container').innerHTML = accHtml || '<p style="opacity:0.5;">Niciun accesoriu favorit.</p>';
    let sceneHtml = '';
    scenesDB.forEach(scena => { if(favScenes.includes(scena.id)) sceneHtml += construiesteScenaHTML(scena, true); });
    document.getElementById('fav-scenes-container').innerHTML = sceneHtml || '<p style="opacity:0.5;">Nicio scenă favorită.</p>';
}

function randareAccesorii() {
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    const camereMap = {};
    Object.keys(subDispozitive).forEach(cat => {
        (subDispozitive[cat] || []).forEach((disp, idx) => {
            if(!camereMap[disp.camera]) camereMap[disp.camera] = [];
            camereMap[disp.camera].push({disp, cat, idx});
        });
    });
    let html = '';
    Object.keys(camereMap).sort().forEach(camera => {
        html += `<h2 class="hk-section-title">${camera}</h2><div class="hk-grid">`;
        camereMap[camera].forEach(item => { html += construiesteCardHTML(item.disp, item.cat, item.idx, favAcc.includes(`${item.cat}_${item.idx}`)); });
        html += `</div>`;
    });
    document.getElementById('all-accessories-container').innerHTML = html;
}

function randareScene() {
    const favScenes = JSON.parse(localStorage.getItem('favScenes')) || [];
    let html = '';
    scenesDB.forEach(scena => { html += construiesteScenaHTML(scena, favScenes.includes(scena.id)); });
    document.getElementById('all-scenes-container').innerHTML = html;
}

function randareSecuritate() {
    const container = document.getElementById('security-devices-container');
    if (!container) return;
    const favAcc = JSON.parse(localStorage.getItem('favAcc')) || [];
    let html = '';
    ['camereVideo', 'senzoriMiscare', 'senzoriContact', 'incuietori'].forEach(cat => {
        if (subDispozitive[cat]) {
            subDispozitive[cat].forEach((disp, idx) => { html += construiesteCardHTML(disp, cat, idx, favAcc.includes(`${cat}_${idx}`)); });
        }
    });
    container.innerHTML = html;
}

function deschideMeniuDispozitive(cardId, categorie, elementIndex) {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');
    if (!modal || !titlu || !continental) return;
    continental.innerHTML = "";

    if (categorie.startsWith('climatizare-')) {
        const camera = categorie.split('-')[1];
        titlu.innerHTML = `🌡️ Termostat ${camera.charAt(0).toUpperCase() + camera.slice(1)}`;
        let temp = localStorage.getItem(`temp-${camera}`) || "22";
        continental.innerHTML = `
            <div style="text-align: center; background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h3 style="margin-top: 0; opacity: 0.8;">Setare Temperatură</h3>
                <div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;"><span id="popup-temp-${camera}">${temp}</span>°C</div>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                    <button onclick="ajusteazaDinPopup('${camera}', 'minus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; cursor: pointer;">−</button>
                    <button onclick="ajusteazaDinPopup('${camera}', 'plus')" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: var(--bg-primary); font-size: 1.8em; font-weight: bold; cursor: pointer;">+</button>
                </div>
            </div>`;
        modal.classList.add('active');
        return;
    }

    if (categorie.startsWith('senzori-')) {
        const camera = categorie.split('-')[1];
        titlu.innerHTML = `<i class="ph-bold ph-warning-circle"></i> Senzor Pericol ${camera}`;
        continental.innerHTML = `
            <div style="background: rgba(46, 204, 113, 0.1); border: 2px solid var(--success-color); color: var(--success-color); padding: 20px; border-radius: 12px; text-align: center; font-weight: bold;">
                <div style="font-size: 3em; margin-bottom: 10px;"><i class="ph-fill ph-check-circle"></i></div>
                Senzorul din ${camera === 'baie' ? 'Baie' : 'Bucătărie'} este activ și monitorizează în timp real.<br>Stare: Parametri Normali (Sigur)
            </div>`;
        modal.classList.add('active');
        return;
    }

    const disp = subDispozitive[categorie][elementIndex];
    titlu.innerHTML = `${disp.icon} ${disp.nume}`;
    let contentHtml = '';

    if (categorie === 'prize') {
        const consumCurent = calculeazaConsumPriza(disp);
        contentHtml = `
            <div style="background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                <div style="font-size: 1.1em; font-weight: bold; opacity: 0.8; margin-bottom: 5px;">Consum Curent în ${disp.camera}</div>
                <div style="font-size: 3.5em; font-weight: bold; color: var(--accent-color); margin: 10px 0;">${consumCurent} W</div>
                <div style="font-size: 0.9em; opacity: 0.7; margin-bottom: 20px;">Dispozitive conectate: <br><strong>${disp.detalii}</strong></div>
                <button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); inchidePopup();" style="background-color: ${disp.stare === 'Pornit' ? 'var(--success-color)' : '#95a5a6'}; color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Alimentare Priză: ${disp.stare}</button>
            </div>`;
    } else {
        contentHtml = `
            <div style="margin-bottom: 20px; text-align:center;">
                <button class="sensor-action-btn" onclick="toggleStareDispozitiv('${categorie}', ${elementIndex}); inchidePopup();" style="background-color: ${['Pornit','Curăță','Deblocat','Activ','Deschis','LIVE','Auto','Boost'].includes(disp.stare) ? 'var(--success-color)' : '#95a5a6'}; color: white; padding: 12px; width:100%; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Schimbă Stare (Curent: ${disp.stare})</button>
            </div>`;
        if (categorie === 'camereVideo') {
            contentHtml += `
                <div style="background: #111; border-radius: 8px; height: 200px; display:flex; align-items:center; justify-content:center; color:white; position:relative; margin-bottom: 15px; overflow: hidden;">
                    ${disp.stare === 'LIVE' ? '<span style="position:absolute; top:10px; left:10px; color:red; font-weight:bold; font-size:0.9em; animation: pulse 1s infinite;">🔴 LIVE REC</span><img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80" style="opacity: 0.6; width: 100%; height: 100%; object-fit: cover;">' : '<span style="opacity:0.5;">[ Camera Feed Offline ]</span>'}
                </div>`;
        }
        if (['becuri', 'audio', 'jaluzele', 'luminiRGB'].includes(categorie)) {
            const isOff = disp.stare === 'Oprit' || disp.stare === 'Închis';
            contentHtml += `
                <div class="slider-container ${isOff ? 'disabled-controls' : ''}" style="margin-top: 20px;">
                    <label>Intensitate / Volum: <span id="val-${categorie}-${elementIndex}">${disp.valoare}</span>%</label>
                    <input type="range" min="0" max="100" value="${disp.valoare}" ${isOff ? 'disabled' : ''} oninput="subDispozitive['${categorie}'][${elementIndex}].valoare = this.value; document.getElementById('val-${categorie}-${elementIndex}').innerText = this.value;">
                </div>`;
        }
    }
    continental.innerHTML = contentHtml;
    modal.classList.add('active');
}

function ajusteazaDinPopup(camera, directie) {
    let val = parseFloat(localStorage.getItem(`temp-${camera}`)) || 22;
    val = directie === 'plus' ? val + 1 : val - 1;
    if(val < 15) val = 15;
    if(val > 30) val = 30;
    localStorage.setItem(`temp-${camera}`, val);
    document.getElementById(`popup-temp-${camera}`).innerText = val;
}

function stingeTotGlobal() { 
    Object.keys(subDispozitive).forEach(cat => (subDispozitive[cat] || []).forEach(d => { 
        if (cat === 'incuietori') d.stare = "Blocat"; 
        else if(cat === 'jaluzele') d.stare = "Închis"; 
        else d.stare = "Oprit"; 
    })); 
    salveazaStarea();
}

function aplicaMod(mod) {
    if (typeof intervalVacanta !== 'undefined' && intervalVacanta) {
        clearInterval(intervalVacanta);
        intervalVacanta = null;
    }

    stingeTotGlobal(); 

    if (mod === 'morning') {
        (subDispozitive.jaluzele || []).forEach(d => d.stare = "Deschis");
        if(subDispozitive.electrocasnice && subDispozitive.electrocasnice[2]) subDispozitive.electrocasnice[2].stare = "Pornit";
        (subDispozitive.audio || []).forEach(d => { d.stare = "Pornit"; d.valoare = 30; });
        if(subDispozitive.purificator && subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Auto";
    } else if (mod === 'away') {
        if(subDispozitive.aspirator && subDispozitive.aspirator[0]) subDispozitive.aspirator[0].stare = "Curăță";
        (subDispozitive.camereVideo || []).forEach(d => d.stare = "LIVE");
        localStorage.setItem('alarmaDezactivata', 'false'); 
    } else if (mod === 'home') {
        localStorage.setItem('alarmaDezactivata', 'true'); 
        if(subDispozitive.incuietori && subDispozitive.incuietori[0]) subDispozitive.incuietori[0].stare = "Deblocat";
        if(subDispozitive.jaluzele && subDispozitive.jaluzele[1]) subDispozitive.jaluzele[1].stare = "Deschis";
        if(subDispozitive.becuri && subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit"; 
    } else if (mod === 'movie') {
        (subDispozitive.jaluzele || []).forEach(d => d.stare = "Închis"); 
        if(subDispozitive.tv && subDispozitive.tv[1]) subDispozitive.tv[1].stare = "Pornit"; 
        if(subDispozitive.audio && subDispozitive.audio[2]) { subDispozitive.audio[2].stare = "Pornit"; subDispozitive.audio[2].valoare = 50; }
        if(subDispozitive.luminiRGB && subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#0a3d62"; }
        (subDispozitive.becuri || []).forEach(d => d.stare = "Oprit"); 
    } else if (mod === 'focus') {
        if(subDispozitive.becuri && subDispozitive.becuri[0]) subDispozitive.becuri[0].stare = "Pornit";
        if(subDispozitive.luminiRGB && subDispozitive.luminiRGB[1]) subDispozitive.luminiRGB[1].stare = "Pornit";
        if(subDispozitive.purificator && subDispozitive.purificator[0]) subDispozitive.purificator[0].stare = "Boost";
    } else if (mod === 'dinner') {
        if(subDispozitive.becuri && subDispozitive.becuri[1]) subDispozitive.becuri[1].stare = "Pornit";
        if(subDispozitive.becuri && subDispozitive.becuri[3]) subDispozitive.becuri[3].stare = "Pornit";
        if(subDispozitive.luminiRGB && subDispozitive.luminiRGB[0]) { subDispozitive.luminiRGB[0].stare = "Pornit"; subDispozitive.luminiRGB[0].culoare = "#e67e22"; }
        if(subDispozitive.audio && subDispozitive.audio[1]) { subDispozitive.audio[1].stare = "Pornit"; subDispozitive.audio[1].valoare = 25; }
    } else if (mod === 'vacation') {
        localStorage.setItem('alarmaDezactivata', 'false'); 
        
        intervalVacanta = setInterval(() => {
            if (localStorage.getItem('activeScene') !== 's_vacation') {
                clearInterval(intervalVacanta);
                intervalVacanta = null;
                return;
            }
            const cats = ['becuri', 'luminiRGB', 'jaluzele'];
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            const randomIdx = Math.floor(Math.random() * (subDispozitive[randomCat] || []).length);
            const disp = subDispozitive[randomCat] ? subDispozitive[randomCat][randomIdx] : null;
            
            if (disp) {
                if (randomCat === 'jaluzele') disp.stare = disp.stare === "Închis" ? "Deschis" : "Închis";
                else disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
                salveazaStarea();
                reincarcaInterfata();
            }
        }, 4000);
    }
    
    salveazaStarea();
    reincarcaInterfata();
}

function actualizeazaStatusGlobal() {
    const sec = document.getElementById('global-securitate'); const con = document.getElementById('global-consum');
    if(!sec) return;
    let consumTotal = 150; 
    if (subDispozitive.prize) {
        subDispozitive.prize.forEach(priză => {
            consumTotal += calculeazaConsumPriza(priză);
        });
    }
    con.innerText = (consumTotal/1000).toFixed(2) + " kW";
    sec.innerText = localStorage.getItem('alarmaDezactivata') === 'true' ? "Dezactivată" : "Armată";
}

function inchidePopup() {
    const modal = document.getElementById('popup-dispozitive');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const m1 = document.getElementById('popup-dispozitive');
    const m2 = document.getElementById('popup-automatizare');
    const m3 = document.getElementById('popup-istoric');
    if (event.target === m1) m1.classList.remove('active');
    if (event.target === m2) m2.classList.remove('active');
    if (event.target === m3) m3.classList.remove('active');
}

function deschidePopupLuminiAprinse() {
    const modal = document.getElementById('popup-dispozitive');
    const titlu = document.getElementById('modal-titlu');
    const continental = document.getElementById('modal-continut');

    if (!modal || !titlu || !continental) return;
    
    titlu.innerHTML = "<i class='ph-fill ph-lightbulb'></i> Lumini Active în Casă";
    
    let html = `<div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 5px 0;">`;
    
    let areLumini = false;
    (subDispozitive.becuri || []).forEach((bec, idx) => {
        if (bec.stare === "Pornit") {
            areLumini = true;
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;"><i class="ph-fill ph-lightbulb"></i></span>
                        <div>
                            <strong style="display:block;">${bec.nume}</strong>
                            <span style="font-size: 0.85em; opacity: 0.6;">${bec.camera} • Intensitate: ${bec.valoare}%</span>
                        </div>
                    </div>
                    <button onclick="toggleStareDispozitiv('becuri', ${idx}); deschidePopupLuminiAprinse();" 
                            style="background: var(--error-color); color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85em;">
                        Stinge
                    </button>
                </div>`;
        }
    });
    
    html += `</div>`;
    
    if (!areLumini) {
        html = `<div style="text-align:center; padding: 20px; opacity:0.6;">Toate luminile au fost stinse!</div>`;
        setTimeout(inchidePopup, 1000); 
    }
    
    continental.innerHTML = html;
    modal.classList.add('active');
}

function adaugaInLog(mesaj) {
    let logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    const oraAcum = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    logs.unshift({ text: mesaj, ora: oraAcum });
    localStorage.setItem('smartHomeLogs', JSON.stringify(logs.slice(0, 30)));
    
    if (document.getElementById('logs-container')) {
        randareStatisticiLogs();
    }
}

function randareStatisticiLogs() {
    const container = document.getElementById('logs-container');
    if (!container) return;
    
    const logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    
    if (logs.length === 0) {
        container.innerHTML = `<p style="opacity: 0.5; font-style: italic; text-align: center; padding: 20px;">Niciun eveniment înregistrat încă.</p>`;
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border-left: 4px solid var(--accent-color);">
            <span style="font-weight: 500; font-size: 0.95em;">${log.text}</span>
            <span style="font-size: 0.8em; opacity: 0.6; font-weight: bold; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px; white-space: nowrap; margin-left: 10px;"><i class="ph-bold ph-clock"></i> ${log.ora}</span>
        </div>
    `).join('');
}

let tipIstoricCurent = 'energie';
let perioadaIstoricaCurenta = '7z';

function deschidePopupIstoric(tip) {
    tipIstoricCurent = tip;
    perioadaIstoricaCurenta = '7z'; 
    
    const modal = document.getElementById('popup-istoric');
    if (!modal) return;
    
    const titlu = document.getElementById('istoric-titlu');
    if (titlu) {
        titlu.innerHTML = tip === 'energie' ? '<i class="ph-bold ph-lightning"></i> Istoric Consum Energie' : '<i class="ph-bold ph-thermometer"></i> Istoric Climă Medie (Temp, Umiditate, CO2)';
    }
    
    modal.classList.add('active');
    genereazaTabelIstoric();
}

function inchidePopupIstoric() {
    const modal = document.getElementById('popup-istoric');
    if (modal) modal.classList.remove('active');
}

function schimbaPerioadaIstoric(perioada) {
    perioadaIstoricaCurenta = perioada;
    
    const butoane = document.querySelectorAll('.time-filters .filter-btn');
    butoane.forEach(btn => btn.classList.remove('active'));
    
    const butonActiv = document.getElementById(`btn-period-${perioada}`);
    if (butonActiv) butonActiv.classList.add('active');
    
    genereazaTabelIstoric();
}

function genereazaTabelIstoric() {
    const container = document.getElementById('istoric-tabel-container');
    if (!container) return;
    
    let intervale = [];
    if (perioadaIstoricaCurenta === '7z') {
        intervale = ['Ieri', 'Acum 2 zile', 'Acum 3 zile', 'Acum 4 zile', 'Acum 5 zile', 'Acum 6 zile', 'Acum 7 zile'];
    } else if (perioadaIstoricaCurenta === '30z') {
        intervale = ['Ultima săptămână', 'Săptămâna 2', 'Săptămâna 3', 'Săptămâna 4'];
    } else if (perioadaIstoricaCurenta === '6l') {
        intervale = ['Luna curentă', 'Luna trecută', 'Acum 3 luni', 'Acum 4 luni', 'Acum 5 luni', 'Acum 6 luni'];
    } else if (perioadaIstoricaCurenta === '1an') {
        intervale = ['Trimestrul 1', 'Trimestrul 2', 'Trimestrul 3', 'Trimestrul 4'];
    }

    let html = `<table style="width: 100%; border-collapse: collapse; font-size: 0.95em; text-align: left;">`;
    
    if (tipIstoricCurent === 'energie') {
        html += `
            <thead>
                <tr style="border-bottom: 2px solid rgba(0,0,0,0.1); font-weight: bold;">
                    <th style="padding: 10px 5px;">Interval Timp</th>
                    <th style="padding: 10px 5px; text-align: right;">Aer Cond.</th>
                    <th style="padding: 10px 5px; text-align: right;">Mașină Spălat</th>
                    <th style="padding: 10px 5px; text-align: right;">Frigider</th>
                    <th style="padding: 10px 5px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>`;
            
        intervale.forEach((perioada, idx) => {
            let multiplicator = perioadaIstoricaCurenta === '7z' ? 1 : perioadaIstoricaCurenta === '30z' ? 6 : perioadaIstoricaCurenta === '6l' ? 25 : 75;
            let ac = (10.2 * multiplicator - idx * 0.4).toFixed(1);
            let ms = (2.5 * multiplicator - idx * 0.1).toFixed(1);
            let fr = (1.5 * multiplicator).toFixed(1);
            let total = (parseFloat(ac) + parseFloat(ms) + parseFloat(fr)).toFixed(1);
            
            html += `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <td style="padding: 10px 5px; font-weight: 500;">${perioada}</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${ac} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${ms} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; opacity: 0.8;">${fr} kWh</td>
                    <td style="padding: 10px 5px; text-align: right; font-weight: bold; color: var(--accent-color);">${total} kWh</td>
                </tr>`;
        });
    } else {
        html += `
            <thead>
                <tr style="border-bottom: 2px solid rgba(0,0,0,0.1); font-weight: bold;">
                    <th style="padding: 10px 5px;">Interval Timp</th>
                    <th style="padding: 10px 5px; text-align: right;">Temp. Medie</th>
                    <th style="padding: 10px 5px; text-align: right;">Umiditate</th>
                    <th style="padding: 10px 5px; text-align: right;">Nivel CO₂</th>
                </tr>
            </thead>
            <tbody>`;
            
        intervale.forEach((perioada, idx) => {
            let t = (22.3 + (idx % 2 === 0 ? 0.4 : -0.3)).toFixed(1);
            let u = (45 + (idx % 3 === 0 ? 4 : -2));
            let co2 = (410 + idx * 12);
            
            html += `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <td style="padding: 10px 5px; font-weight: 500;">${perioada}</td>
                    <td style="padding: 10px 5px; text-align: right; font-weight: 600; color: #e67e22;">${t}°C</td>
                    <td style="padding: 10px 5px; text-align: right; color: #3498db;">${u}%</td>
                    <td style="padding: 10px 5px; text-align: right; color: #2ecc71;">${co2} ppm</td>
                </tr>`;
        });
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
}