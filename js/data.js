export const curtainIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="currentColor" class="hk-svg-icon"><rect x="0" y="5" width="100" height="18" rx="4" /><rect x="4" y="38" width="92" height="12" rx="3" /><rect x="4" y="68" width="92" height="12" rx="3" /><rect x="4" y="98" width="92" height="12" rx="3" /></svg>`;
export const windowIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" class="hk-svg-icon"><rect x="12" y="12" width="76" height="96" rx="6" /><line x1="50" y1="12" x2="50" y2="108" /><line x1="12" y1="60" x2="88" y2="60" /></svg>`;

export const defaultScenes = [
    { id: 's_morning', name: "🌅 Good Morning", desc: "Open blinds, start coffee.", action: "morning" },
    { id: 's_night', name: "🌙 Good Night", desc: "Turn off lights, arm doors.", action: "night" },
    { id: 's_away', name: "👋 Leaving Home", desc: "Turn everything off, robot starts cleaning.", action: "away" },
    { id: 's_home', name: "🏠 I'm Home", desc: "Deactivate alarm, open blinds.", action: "home" },
    { id: 's_movie', name: "🎬 Movie Time", desc: "Blinds closed, TV on, blue ambient.", action: "movie" },
    { id: 's_focus', name: "📖 Focus / Reading", desc: "Desk light, purifier on.", action: "focus" },
    { id: 's_dinner', name: "🍽️ Dinner Time", desc: "Warm lights in living room and kitchen.", action: "dinner" },
    { id: 's_vacation', name: "🧳 Vacation Mode", desc: "Presence simulation and security.", action: "vacation" }
];

export const recommendedTemplates = [
    { idSuggestion: 'sug_1', icon: '<i class="ph-bold ph-clock"></i>', name: 'Morning Routine', shortDesc: 'Open living room blinds daily at 07:00.', color: '#f1c40f', triggerType: 'time', tTime: '07:00', aCat: 'blinds', aIdx: '1', aState: 'Open', desc: '⏰ Daily at 07:00 ➔ Living Room Blinds Open' },
    { idSuggestion: 'sug_2', icon: windowIcon, name: 'Eco-Bathroom', shortDesc: 'Stop dryer if bathroom window opens.', color: '#e74c3c', triggerType: 'dev', tCat: 'contactSensors', tIdx: '4', tState: 'Open', aCat: 'appliances', aIdx: '1', aState: 'Off', desc: 'IF Bathroom Window is Open ➔ Dryer stops' },
    { idSuggestion: 'sug_3', icon: '<i class="ph-bold ph-person-simple-walk"></i>', name: 'Hallway Security', shortDesc: 'Turn on living room bulb when motion is detected in hallway.', color: '#2ecc71', triggerType: 'dev', tCat: 'motionSensors', tIdx: '1', tState: 'Active', aCat: 'bulbs', aIdx: '1', aState: 'On', desc: 'IF Hallway Motion Sensor is Active ➔ Living Room Bulb becomes On' },
    { idSuggestion: 'sug_4', icon: '<i class="ph-bold ph-moon"></i>', name: 'Night Off', shortDesc: 'Turn off living room bulb daily at 23:30.', color: '#34495e', triggerType: 'time', tTime: '23:30', aCat: 'bulbs', aIdx: '1', aState: 'Off', desc: '⏰ Daily at 23:30 ➔ Living Room Bulb becomes Off' },
    { idSuggestion: 'sug_5', icon: '<i class="ph-bold ph-lock-key"></i>', name: 'Auto Lock', shortDesc: 'Lock main door at 22:00 every evening.', color: '#e67e22', triggerType: 'time', tTime: '22:00', aCat: 'locks', aIdx: '0', aState: 'Locked', desc: '⏰ Daily at 22:00 ➔ Door Lock becomes Locked' },
    { idSuggestion: 'sug_6', icon: '<i class="ph-bold ph-television"></i>', name: 'Quick Cinema', shortDesc: 'Turn on ambient LED strip when Smart TV is on.', color: '#9b59b6', triggerType: 'dev', tCat: 'tv', tIdx: '1', tState: 'On', aCat: 'rgbLights', aIdx: '0', aState: 'On', desc: 'IF Smart TV OLED 8K is On ➔ TV LED Strip becomes On' },
    { idSuggestion: 'sug_7', icon: windowIcon, name: 'Stop Air on Window', shortDesc: 'Stop purifier if bedroom window is open.', color: '#1abc9c', triggerType: 'dev', tCat: 'contactSensors', tIdx: '0', tState: 'Open', aCat: 'purifier', aIdx: '0', aState: 'Off', desc: 'IF Bedroom Window is Open ➔ Purifier stops' },
    { idSuggestion: 'sug_8', icon: '<i class="ph-bold ph-coffee"></i>', name: 'Morning Coffee', shortDesc: 'Turn on kitchen espresso maker daily at 07:15.', color: '#d35400', triggerType: 'time', tTime: '07:15', aCat: 'appliances', aIdx: '2', aState: 'On', desc: '⏰ Daily at 07:15 ➔ Espresso Maker becomes On' },
    { idSuggestion: 'sug_9', icon: curtainIcon, name: 'Evening Privacy', shortDesc: 'Auto close bedroom blinds at 20:00.', color: '#3498db', triggerType: 'time', tTime: '20:00', aCat: 'blinds', aIdx: '0', aState: 'Closed', desc: '⏰ Daily at 20:00 ➔ Bedroom Blinds Close' }
];

export const defaultDevices = {
    bulbs: [
        { name: "Bedroom Bulb", state: "On", value: 75, room: "Bedroom", icon: '<i class="ph-fill ph-lightbulb"></i>' },
        { name: "Living Room Bulb", state: "Off", value: 50, room: "Living", icon: '<i class="ph-fill ph-lightbulb"></i>' },
        { name: "Bathroom Bulb", state: "Off", value: 50, room: "Bathroom", icon: '<i class="ph-fill ph-lightbulb"></i>' },
        { name: "Kitchen Bulb", state: "Off", value: 100, room: "Kitchen", icon: '<i class="ph-fill ph-lightbulb"></i>' }
    ],
    rgbLights: [
        { name: "TV LED Strip", state: "Off", value: 100, color: "#3498db", room: "Living", icon: '<i class="ph-fill ph-lamp"></i>' },
        { name: "Desk Lamp", state: "Off", value: 80, color: "#f1c40f", room: "Bedroom", icon: '<i class="ph-fill ph-lamp"></i>' }
    ],
    blinds: [
        { name: "Bedroom Blinds", state: "Closed", value: 0, room: "Bedroom", icon: curtainIcon },
        { name: "Living Room Blinds 1", state: "Open", value: 100, room: "Living", icon: curtainIcon },
        { name: "Living Room Blinds 2", state: "Open", value: 100, room: "Living", icon: curtainIcon },
        { name: "Bathroom Blinds", state: "Closed", value: 0, room: "Bathroom", icon: curtainIcon },
        { name: "Kitchen Blinds", state: "Closed", value: 0, room: "Kitchen", icon: curtainIcon }
    ],
    audio: [
        { name: "Bedroom Speaker", state: "Off", value: 40, room: "Bedroom", icon: '<i class="ph-fill ph-speaker-high"></i>' },
        { name: "Living Room Speaker", state: "Off", value: 30, room: "Living", icon: '<i class="ph-fill ph-speaker-high"></i>' },
        { name: "Dolby Atmos 7.1 Audio System", state: "Off", value: 50, room: "Living", icon: '<i class="ph-fill ph-speaker-high"></i>' },
        { name: "Bathroom Speaker", state: "Off", value: 30, room: "Bathroom", icon: '<i class="ph-fill ph-speaker-high"></i>' },
        { name: "Kitchen Speaker", state: "Off", value: 20, room: "Kitchen", icon: '<i class="ph-fill ph-speaker-high"></i>' }
    ],
    tv: [
        { name: "Bedroom TV", state: "Off", room: "Bedroom", icon: '<i class="ph-fill ph-television"></i>' },
        { name: "Smart TV OLED 8K", state: "Off", room: "Living", icon: '<i class="ph-fill ph-television"></i>' }
    ],
    vacuum: [
        { name: "Cleaning Robot", state: "Docked", battery: 100, room: "Living", icon: '<i class="ph-fill ph-robot"></i>' }
    ],
    purifier: [
        { name: "Air Purifier", state: "Auto", room: "Bedroom", icon: '<i class="ph-fill ph-wind"></i>' },
        { name: "Air Purifier", state: "Off", room: "Living", icon: '<i class="ph-fill ph-wind"></i>' }
    ],
    appliances: [
        { name: "Washing Machine", state: "Off", room: "Bathroom", icon: '<i class="ph-fill ph-washing-machine"></i>' },
        { name: "Dryer", state: "Off", room: "Bathroom", icon: '<i class="ph-fill ph-wind"></i>' },
        { name: "Espresso Maker", state: "Off", room: "Kitchen", icon: '<i class="ph-fill ph-coffee"></i>' }
    ],
    plugs: [
        { name: "Bedroom Plug", state: "On", consumption: 120, details: "TV, Laptop, Purifier", room: "Bedroom", icon: '<i class="ph-fill ph-plug"></i>' },
        { name: "Living Room Plug", state: "On", consumption: 480, details: "Audio System, TV, Cleaning Robot, Purifier", room: "Living", icon: '<i class="ph-fill ph-plug"></i>' },
        { name: "Bathroom Plug", state: "On", consumption: 0, details: "Washing Machine, Dryer", room: "Bathroom", icon: '<i class="ph-fill ph-plug"></i>' },
        { name: "Kitchen Plug", state: "On", consumption: 150, details: "Espresso Maker, Fridge", room: "Kitchen", icon: '<i class="ph-fill ph-plug"></i>' }
    ],
    contactSensors: [
        { name: "Bedroom Window", state: "Closed", room: "Bedroom", icon: windowIcon },
        { name: "Living Room Window 1", state: "Closed", room: "Living", icon: windowIcon },
        { name: "Living Room Window 2", state: "Closed", room: "Living", icon: windowIcon },
        { name: "Kitchen Window", state: "Closed", room: "Kitchen", icon: windowIcon },
        { name: "Bathroom Window", state: "Closed", room: "Bathroom", icon: windowIcon }
    ],
    motionSensors: [
        { name: "Living Room Motion Sensor", state: "Inactive", room: "Living", icon: '<i class="ph-fill ph-person-simple-walk"></i>' },
        { name: "Hallway Motion Sensor", state: "Inactive", room: "Hallway", icon: '<i class="ph-fill ph-person-simple-walk"></i>' }
    ],
    videoCameras: [
        { name: "Video Intercom", state: "Standby", room: "Main Door", icon: '<i class="ph-fill ph-video-camera"></i>' },
        { name: "Yard Camera", state: "Standby", room: "Outdoor", icon: '<i class="ph-fill ph-video-camera"></i>' }
    ],
    locks: [
        { name: "Door Lock", state: "Locked", room: "Hallway", icon: '<i class="ph-fill ph-lock-key"></i>' }
    ]
};