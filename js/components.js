class SmartNav extends HTMLElement {
    connectedCallback() {
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '' || currentPage === '/') currentPage = 'index.html';
        const isActive = (page) => currentPage === page ? 'active' : '';

        const intrUnSubfolder = window.location.pathname.includes('/pages/') || 
                                window.location.pathname.includes('/html/') ||
                                (!window.location.pathname.endsWith('index.html') && currentPage !== 'index.html');
        
        const caleHome = intrUnSubfolder ? '../index.html' : 'index.html';
        const prefixPagini = intrUnSubfolder ? '' : 'html/'; // Înlocuiește 'pages/' cu numele folderului tău dacă e diferit (ex: 'html/')

        this.innerHTML = `
            <nav>
                <h2>SmartHome</h2>
                <a href="${caleHome}" class="${isActive('index.html')}">🏠 Home</a>
                <a href="${prefixPagini}scene.html" class="${isActive('scene.html')}">🎭 Scene</a>
                <a href="${prefixPagini}accesorii.html" class="${isActive('accesorii.html')}">🛋️ Accesorii</a>
                <a href="${prefixPagini}automatizari.html" class="${isActive('automatizari.html')}">🤖 Automatizări</a>
                <a href="${prefixPagini}statistici.html" class="${isActive('statistici.html')}">📈 Statistici</a>
                <a href="${prefixPagini}camere.html" class="${isActive('camere.html')}">🌡️ Climă Camere</a>
                <a href="${prefixPagini}harta.html" class="${isActive('harta.html')}">🗺️ Hartă Casă</a>
                <a href="${prefixPagini}securitate.html" class="${isActive('securitate.html')}">🛡️ Securitate</a>
                <a href="${prefixPagini}pericole.html" class="${isActive('pericole.html')}">🚨 Pericole</a>
                <a href="${prefixPagini}setari.html" class="${isActive('setari.html')}">⚙️ Setări</a>
            </nav>
        `;
    }
}
customElements.define('smart-nav', SmartNav);
class SmartModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="popup-dispozitive" class="modal">
                <div class="modal-content">
                    <span class="close-btn" onclick="inchidePopup()">&times;</span>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 0; margin-bottom: 20px;">
                        <h2 id="modal-titlu" style="margin: 0; color: var(--accent-color);"></h2>
                        <span id="modal-star" class="modal-star-icon" title="Adaugă la Acces Rapid"></span>
                    </div>
                    <div id="modal-continut"></div>
                </div>
            </div>

            <div id="popup-pin-alarma" class="modal">
                <div class="modal-content" style="max-width: 320px; text-align: center;">
                    <span class="close-btn" onclick="inchidePopupPin()">&times;</span>
                    <h3 id="pin-modal-titlu" style="margin-top: 0;">Introduceți Cod PIN</h3>
                    <div id="pin-display" style="font-size: 2.2em; letter-spacing: 12px; margin: 20px 0; min-height: 1.2em; font-weight: bold; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 12px;"></div>
                    <div id="pin-error-msg" style="color: var(--error-color); font-size: 0.9em; margin-bottom: 15px; display: none; font-weight: bold;">❌ PIN Incorect!</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('1')">1</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('2')">2</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('3')">3</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('4')">4</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('5')">5</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('6')">6</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('7')">7</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('8')">8</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('9')">9</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.1em; border-radius:50%; background: rgba(231, 76, 60, 0.15); color: var(--error-color);" onclick="apasatTastaPin('C')">C</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" onclick="apasatTastaPin('0')">0</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.1em; border-radius:50%; background: rgba(0, 122, 255, 0.15); color: var(--accent-color);" onclick="apasatTastaPin('⌫')">⌫</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('smart-modal', SmartModal);