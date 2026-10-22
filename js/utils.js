export function getTempUnit() {
    return localStorage.getItem('tempUnit') || 'C';
}

export function convertTemp(celsius) {
    if (getTempUnit() === 'F') {
        return Math.round(celsius * 9 / 5 + 32);
    }
    return Math.round(celsius);
}

export function formatTemperature(celsiusValue) {
    const unit = getTempUnit();
    if (unit === 'F') {
        return `${Math.round((celsiusValue * 9 / 5) + 32)}°F`;
    }
    return `${celsiusValue}°C`;
}

export function showToast(message, options = {}) {
    const { isError = false, callback = null, withUndo = false, undoAction = null } = options;
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    container.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.borderLeft = `4px solid ${isError ? 'var(--error-color)' : 'var(--success-color)'}`;

    const icon = isError
        ? '<i class="ph-bold ph-warning-circle" style="color: var(--error-color); font-size: 1.2em;"></i>'
        : '<i class="ph-bold ph-check-circle" style="color: var(--success-color); font-size: 1.2em;"></i>';

    let htmlContent = `${icon} <span>${message}</span>`;

    if (withUndo) {
        htmlContent += `<button class="undo-btn" style="background: rgba(255,255,255,0.2); color: inherit; border: none; padding: 4px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Undo</button>`;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    if (withUndo && undoAction) {
        toast.querySelector('.undo-btn').addEventListener('click', () => {
            undoAction();
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
            showToast('Action was canceled.', { isError: false });
        });
    }

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (callback) callback();
        }, { once: true });
    }, 3500);
}