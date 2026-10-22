import { subDevices } from '../app.js';
import { updateCardInDOM, reloadInterface } from '../ui.js';

class HardwareService {
    constructor() {
        this.useRemoteServer = false; // Toggle to true when Raspberry Pi is connected
        this.serverUrl = 'http://192.168.4.1:8080';
    }

    async setDeviceState(cat, idx, state, value = null) {
        if (this.useRemoteServer) {
            try {
                const response = await fetch(`${this.serverUrl}/api/devices`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category: cat, index: idx, state, value })
                });
                return await response.json();
            } catch (error) {
                console.error("Hardware Service Error:", error);
                return { success: false, error };
            }
        } else {
            const disp = subDevices[cat][idx];
            if (!disp) return { success: false };

            disp.state = state;
            if (value !== null) disp.value = value;

            if (typeof updateCardInDOM === 'function') {
                updateCardInDOM(cat, idx);
            } else {
                reloadInterface();
            }

            return { success: true, disp };
        }
    }
}

export const hardwareService = new HardwareService();