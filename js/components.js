class SmartNav extends HTMLElement {
    connectedCallback() {
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '' || currentPage === '/') currentPage = 'index.html';
        const isActive = (page) => currentPage === page ? 'active' : '';

        const inSubfolder = window.location.pathname.includes('/pages/') ||
            window.location.pathname.includes('/html/') ||
            (!window.location.pathname.endsWith('index.html') && currentPage !== 'index.html');

        const homePath = inSubfolder ? '../index.html' : 'index.html';
        const pagePrefix = inSubfolder ? '' : 'html/';

        this.innerHTML = `
            <nav>
                <h2>Lumen</h2>
                <a href="${homePath}" class="${isActive('index.html')}">🏠 Home</a>
                <a href="${pagePrefix}scenes.html" class="${isActive('scenes.html')}">🎭 Scenes</a>
                <a href="${pagePrefix}accessories.html" class="${isActive('accessories.html')}">🛋️ Accessories</a>
                <a href="${pagePrefix}automations.html" class="${isActive('automations.html')}">🤖 Automations</a>
                <a href="${pagePrefix}statistics.html" class="${isActive('statistics.html')}">📈 Statistics</a>
                <a href="${pagePrefix}rooms.html" class="${isActive('rooms.html')}">🌡️ Rooms</a>
                <a href="${pagePrefix}map.html" class="${isActive('map.html')}">🗺️ Map</a>
                <a href="${pagePrefix}security.html" class="${isActive('security.html')}">🛡️ Security</a>
                <a href="${pagePrefix}hazards.html" class="${isActive('hazards.html')}">🚨 Hazards</a>
                <a href="${pagePrefix}settings.html" class="${isActive('settings.html')}">⚙️ Settings</a>
            </nav>
        `;
    }
}
customElements.define('smart-nav', SmartNav);

class SmartModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="popup-device" class="modal">
                <div class="modal-content">
                    <span class="close-btn" data-action="close-popup">&times;</span>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 0; margin-bottom: 20px;">
                        <h2 id="modal-title" style="margin: 0; color: var(--accent-color);"></h2>
                        <span id="modal-star" class="modal-star-icon" title="Add to Quick Access"></span>
                    </div>
                    <div id="modal-content"></div>
                </div>
            </div>

            <div id="popup-pin-alarm" class="modal">
                <div class="modal-content" style="max-width: 320px; text-align: center;">
                    <span class="close-btn" data-action="close-pin-popup">&times;</span>
                    <h3 id="pin-modal-title" style="margin-top: 0;">Enter PIN Code</h3>
                    <div id="pin-display" style="font-size: 2.2em; letter-spacing: 12px; margin: 20px 0; min-height: 1.2em; font-weight: bold; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 12px;"></div>
                    <div id="pin-error-msg" style="color: var(--error-color); font-size: 0.9em; margin-bottom: 15px; display: none; font-weight: bold;">❌ Incorrect PIN!</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="1">1</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="2">2</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="3">3</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="4">4</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="5">5</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="6">6</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="7">7</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="8">8</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="9">9</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.1em; border-radius:50%; background: rgba(231, 76, 60, 0.15); color: var(--error-color);" data-action="press-pin" data-val="C">C</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.4em; border-radius:50%;" data-action="press-pin" data-val="0">0</button>
                        <button class="ctrl-btn" style="width:100%; height:55px; font-size:1.1em; border-radius:50%; background: rgba(0, 122, 255, 0.15); color: var(--accent-color);" data-action="press-pin" data-val="⌫">⌫</button>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('smart-modal', SmartModal);