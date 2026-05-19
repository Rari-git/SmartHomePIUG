document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-color', savedColor);
    }
});

export { toggleDarkMode, schimbaCuloareAccent, showToast, toggleHelp, toggleNav };
window.toggleDarkMode = toggleDarkMode;
window.schimbaCuloareAccent = schimbaCuloareAccent;
window.toggleHelp = toggleHelp;
window.toggleNav = toggleNav;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function schimbaCuloareAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
}

function showToast(mesaj, cuUndo = false, actiuneUndo = null) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    let htmlContent = `✨ <span>${mesaj}</span>`;
    if (cuUndo) {
        htmlContent += `<button class="undo-btn" style="background: rgba(255,255,255,0.2); color: inherit; border: none; padding: 4px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Undo</button>`;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    if (cuUndo && actiuneUndo) {
        toast.querySelector('.undo-btn').addEventListener('click', () => {
            actiuneUndo();
            toast.remove();
            showToast('Acțiunea a fost anulată.', false);
        });
    }

    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const butoaneValidare = document.querySelectorAll('button[onclick^="valideaza"]');
        if (butoaneValidare.length > 0) {
            butoaneValidare[0].click();
        }
    }
});

function toggleHelp() {
    const helpBox = document.getElementById('help-box');
    if (helpBox.style.display === 'none' || helpBox.style.display === '') {
        helpBox.style.display = 'block';
    } else {
        helpBox.style.display = 'none';
    }
}

function toggleNav() {
    const nav = document.querySelector('nav');
    let backdrop = document.getElementById('nav-backdrop');

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
        
        backdrop.onclick = () => {
            nav.classList.remove('active');
            backdrop.classList.remove('active');
        };
    }

    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        backdrop.classList.add('active');
    } else {
        backdrop.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('meta[name="view-transition"]')) {
        const metaVT = document.createElement('meta');
        metaVT.name = 'view-transition';
        metaVT.content = 'same-origin';
        document.head.appendChild(metaVT);
    }
});