// js/components.js

// 1. Componenta pentru Meniul de Navigație
class SmartNav extends HTMLElement {
    connectedCallback() {
        // Aflăm pe ce pagină suntem pentru a evidenția butonul corect
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '' || currentPage === '/') currentPage = 'index.html';

        // Helper pentru a pune clasa 'active' doar pe link-ul paginii curente
        const isActive = (page) => currentPage === page ? 'active' : '';

        this.innerHTML = `
            <nav>
                <h2>SmartHome</h2>
                <a href="index.html" class="${isActive('index.html')}">🏠 Home</a>
                <a href="scene.html" class="${isActive('scene.html')}">🎭 Scene</a>
                <a href="accesorii.html" class="${isActive('accesorii.html')}">🛋️ Accesorii</a>
                <a href="automatizari.html" class="${isActive('automatizari.html')}">🤖 Automatizări</a>
                <a href="statistici.html" class="${isActive('statistici.html')}">📈 Statistici</a>
                <a href="camere.html" class="${isActive('camere.html')}">🌡️ Climă Camere</a>
                <a href="harta.html" class="${isActive('harta.html')}">🗺️ Hartă Casă</a>
                <a href="securitate.html" class="${isActive('securitate.html')}">🛡️ Securitate</a>
                <a href="pericole.html" class="${isActive('pericole.html')}">🚨 Pericole</a>
                <a href="setari.html" class="${isActive('setari.html')}">⚙️ Setări</a>
            </nav>
        `;
    }
}
customElements.define('smart-nav', SmartNav);

// 2. Componenta pentru Fereastra Modală (Popup)
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
        `;
    }
}
customElements.define('smart-modal', SmartModal);