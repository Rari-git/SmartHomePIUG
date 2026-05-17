let intervalVacanta = null;
let customScenesList = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
let scenesDB = [...defaultScenes, ...customScenesList];
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
        if (!subDispozitive || !subDispozitive.becuri || !localStorage.getItem('design_svg_assets_v6')) {
            subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
            localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
            localStorage.setItem('design_svg_assets_v6', 'true');
        }
    } catch (e) {
        subDispozitive = JSON.parse(JSON.stringify(defaultDispozitive));
        localStorage.setItem('smartHomeData', JSON.stringify(subDispozitive));
        localStorage.setItem('design_svg_assets_v6', 'true');
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
        disp.stare = dictionarStari[cat][disp.stare] || (cat === 'incuietori' ? 'Blocat' : 'Închis');
    } else if (cat === 'purificator') {
        disp.stare = disp.stare === "Oprit" ? "Auto" : (disp.stare === "Auto" ? "Boost" : "Oprit");
    } else {
        disp.stare = disp.stare === "Pornit" ? "Oprit" : "Pornit";
    }
    
    if (cat === 'senzoriMiscare' && disp.stare === "Activ") {
        let logs = JSON.parse(localStorage.getItem('motionLogs')) || [];
        logs.unshift({ camera: disp.camera, ora: new Date().toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'}) });
        localStorage.setItem('motionLogs', JSON.stringify(logs.slice(0, 15)));
    }
    
    if (typeof adaugaInLog === 'function') {
        adaugaInLog(`${disp.nume || 'Dispozitiv'} a fost comutat în starea [${disp.stare}]`);
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
    if (schimbare) { localStorage.setItem('userAutomations', JSON.stringify(rules)); salveazaStarea(); reincarcaInterfata(); }
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
    if (schimbare) { localStorage.setItem('userAutomations', JSON.stringify(rules)); salveazaStarea(); }
}

function salveazaAutomatizare() {
    const esteTimp = typeof modTriggerCurent !== 'undefined' && modTriggerCurent === 'timp';
    const aVal = document.getElementById('auto-action-dev').value.split('_');
    const aState = document.getElementById('auto-action-state').value;
    const actionNume = subDispozitive[aVal[0]][aVal[1]].nume;
    let rule = { id: Date.now(), active: true, lastRun: "Niciodată", aCat: aVal[0], aIdx: aVal[1], aState: aState };

    if (esteTimp) {
        const ora = document.getElementById('auto-trigger-timp').value;
        if (!ora) return;
        rule.tipTrigger = 'timp'; rule.tOra = ora; rule.descriere = `⏰ Zilnic la ora ${ora} ➔ ${actionNume} devine ${aState}`;
    } else {
        const tVal = document.getElementById('auto-trigger-dev').value.split('_');
        const tState = document.getElementById('auto-trigger-state').value;
        rule.tipTrigger = 'disp'; rule.tCat = tVal[0]; rule.tIdx = tVal[1]; rule.tState = tState;
        rule.descriere = `DACĂ ${subDispozitive[tVal[0]][tVal[1]].nume} este ${tState} ➔ ${actionNume} devine ${aState}`;
    }

    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    rules.unshift(rule); localStorage.setItem('userAutomations', JSON.stringify(rules));
    inchidePopup(); randareSabloane(); randareAutomatizari();
}

function adaugaSugestie(idSugestie) {
    const sug = sabloaneRecomandate.find(s => s.idSugestie === idSugestie);
    if(!sug) return;
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    let nouaRegula = { id: Date.now(), active: true, lastRun: "Niciodată", idSugestie: sug.idSugestie, tipTrigger: sug.tipTrigger, descriere: sug.descriere, aCat: sug.aCat, aIdx: sug.aIdx, aState: sug.aState };
    if (sug.tipTrigger === 'timp') nouaRegula.tOra = sug.tOra; else { nouaRegula.tCat = sug.tCat; nouaRegula.tIdx = sug.tIdx; nouaRegula.tState = sug.tState; }
    rules.unshift(nouaRegula); localStorage.setItem('userAutomations', JSON.stringify(rules));
    randareSabloane(); randareAutomatizari();
}

function stergeAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    localStorage.setItem('userAutomations', JSON.stringify(rules.filter(r => r.id !== id)));
    randareSabloane(); randareAutomatizari();
}

function comutaAutomatizare(id) {
    let rules = JSON.parse(localStorage.getItem('userAutomations')) || [];
    const rule = rules.find(r => r.id === id);
    if (rule) { rule.active = !rule.active; localStorage.setItem('userAutomations', JSON.stringify(rules)); randareAutomatizari(); }
}

function ajusteazaDinPopup(camera, directie) {
    let val = parseFloat(localStorage.getItem(`temp-${camera}`)) || 22;
    val = directie === 'plus' ? val + 1 : val - 1;
    if(val < 15) val = 15; if(val > 30) val = 30;
    localStorage.setItem(`temp-${camera}`, val);
    document.getElementById(`popup-temp-${camera}`).innerText = val;
}

function stingeTotGlobal() { 
    Object.keys(subDispozitive).forEach(cat => (subDispozitive[cat] || []).forEach(d => { 
        if (cat === 'incuietori') d.stare = "Blocat"; else if(cat === 'jaluzele') d.stare = "Închis"; else d.stare = "Oprit"; 
    })); 
    salveazaStarea();
}

function aplicaMod(mod) {
    if (intervalVacanta) { clearInterval(intervalVacanta); intervalVacanta = null; }
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
    } else if (mod === 'vacation') {
        localStorage.setItem('alarmaDezactivata', 'false'); 
        intervalVacanta = setInterval(() => {
            if (localStorage.getItem('activeScene') !== 's_vacation') { clearInterval(intervalVacanta); intervalVacanta = null; return; }
            const cats = ['becuri', 'luminiRGB', 'jaluzele'];
            const randomCat = cats[Math.floor(Math.random() * cats.length)];
            const disp = subDispozitive[randomCat] ? subDispozitive[randomCat][Math.floor(Math.random() * (subDispozitive[randomCat] || []).length)] : null;
            if (disp) { disp.stare = (randomCat === 'jaluzele') ? (disp.stare === "Închis" ? "Deschis" : "Închis") : (disp.stare === "Pornit" ? "Oprit" : "Pornit"); salveazaStarea(); reincarcaInterfata(); }
        }, 4000);
    }
    salveazaStarea(); reincarcaInterfata();
}

function calculeazaConsumPriza(disp) {
    if (disp.stare !== 'Pornit') return 0;
    let consumReal = 0;
    if (disp.camera === 'Baie') {
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[0] && subDispozitive.electrocasnice[0].stare === 'Pornit') consumReal += 2000;
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[1] && subDispozitive.electrocasnice[1].stare === 'Pornit') consumReal += 2400;
    } else if (disp.camera === 'Dormitor') {
        if (subDispozitive.tv && subDispozitive.tv[0] && subDispozitive.tv[0].stare === 'Pornit') consumReal += 90;
        if (subDispozitive.purificator && subDispozitive.purificator[0] && subDispozitive.purificator[0].stare !== 'Oprit') consumReal += 30;
    } else if (disp.camera === 'Bucătărie') {
        consumReal += 150; 
        if (subDispozitive.electrocasnice && subDispozitive.electrocasnice[2] && subDispozitive.electrocasnice[2].stare === 'Pornit') consumReal += 1200;
    } else if (disp.camera === 'Living') {
        if (subDispozitive.tv && subDispozitive.tv[1] && subDispozitive.tv[1].stare === 'Pornit') consumReal += 150;
        if (subDispozitive.audio && subDispozitive.audio[1] && subDispozitive.audio[1].stare === 'Pornit') consumReal += 40;
        if (subDispozitive.audio && subDispozitive.audio[2] && subDispozitive.audio[2].stare === 'Pornit') consumReal += 200;
        if (subDispozitive.aspirator && subDispozitive.aspirator[0] && subDispozitive.aspirator[0].stare === 'Curăță') consumReal += 60;
    }
    return consumReal;
}

function executaScena(idScena) {
    localStorage.setItem('activeScene', idScena);
    const scena = scenesDB.find(s => s.id === idScena);
    if (scena && scena.action) typeof scena.action === 'function' ? scena.action() : aplicaMod(scena.action);
}

function salveazaScenaCustomNoua() {
    const nume = document.getElementById('custom-scene-name').value.trim();
    const emoji = document.getElementById('custom-scene-emoji').value;
    const desc = document.getElementById('custom-scene-desc').value.trim();
    const actiuneMod = document.getElementById('custom-scene-template').value;
    if (!nume || !desc) { alert("Te rog completează numele și descrierea scenei!"); return; }
    
    let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
    list.push({ id: 'cust_' + Date.now(), nume: `${emoji} ${nume}`, descriere: desc, action: actiuneMod });
    localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list));
    
    customScenesList = list; scenesDB = [...defaultScenes, ...customScenesList];
    inchidePopup(); reincarcaInterfata();
}

function stergeScenaCustom(idScena, event) {
    if(event) event.stopPropagation(); 
    if(confirm("Sigur vrei să ștergi această scenă personalizată?")) {
        let list = JSON.parse(localStorage.getItem('smartHomeCustomScenes')) || [];
        localStorage.setItem('smartHomeCustomScenes', JSON.stringify(list.filter(s => s.id !== idScena)));
        let favs = JSON.parse(localStorage.getItem('favScenes')) || [];
        localStorage.setItem('favScenes', JSON.stringify(favs.filter(id => id !== idScena)));
        if (localStorage.getItem('activeScene') === idScena) localStorage.removeItem('activeScene');
        customScenesList = list.filter(s => s.id !== idScena);
        scenesDB = [...defaultScenes, ...customScenesList];
        reincarcaInterfata();
    }
}

function executaSecurizareTotala() {
    if (subDispozitive.senzoriContact) subDispozitive.senzoriContact.forEach(g => g.stare = "Închis");
    if (subDispozitive.incuietori) subDispozitive.incuietori.forEach(u => u.stare = "Blocat");
    if (subDispozitive.senzoriMiscare) subDispozitive.senzoriMiscare.forEach(s => s.stare = "Activ");
    if (subDispozitive.camereVideo) subDispozitive.camereVideo.forEach(c => c.stare = "LIVE");
    localStorage.setItem('alarmaDezactivata', 'false');
    salveazaStarea(); reincarcaInterfata();
    if (typeof adaugaInLog === 'function') adaugaInLog("🛡️ Securitate: S-a efectuat o securizare totală.");
}

function adaugaInLog(mesaj) {
    let logs = JSON.parse(localStorage.getItem('smartHomeLogs')) || [];
    logs.unshift({ text: mesaj, ora: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    localStorage.setItem('smartHomeLogs', JSON.stringify(logs.slice(0, 30)));
    if (document.getElementById('logs-container')) randareStatisticiLogs();
}