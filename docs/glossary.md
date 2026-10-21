# English → Romanian Glossary (Lumen smart-home app)

This document maps the Romanian identifiers, strings, values, and keys used in the original codebase to their English equivalents for the Lumen (English-only) migration.

## 1. Category keys (subDispozitive / devices)

| Romanian | English | Notes |
|----------|---------|-------|
| becuri | lights | |
| luminiRGB | rgbLights | |
| jaluzele | blinds | |
| audio | audio | |
| tv | tv | |
| aspirator | vacuum | |
| purificator | airPurifier | |
| electrocasnice | appliances | |
| prize | outlets | |
| senzoriContact | contactSensors | |
| senzoriMiscare | motionSensors | |
| camereVideo | cameras | |
| incuietori | locks | |
| subDispozitive | devices | top-level state object |

## 2. Device states (logic values stored and compared)

| Romanian | English | Notes |
|----------|---------|-------|
| Pornit | On | |
| Oprit | Off | |
| Închis | Closed | |
| Deschis | Open | |
| Blocat | Locked | |
| Deblocat | Unlocked | |
| Activ | Active | |
| Inactiv | Inactive | |
| La Bază | Docked | vacuum |
| Curăță | Cleaning | vacuum |
| Standby | Standby | cameras |
| LIVE | Live | kept as-is |
| Boost | Boost | kept as-is |
| "APĂ DETECTATĂ!" | "WATER DETECTED!" | flood hazard |
| "FUM DETECTAT!" | "SMOKE DETECTED!" | fire hazard |
| Pericol | Hazard | generic danger label |

## 3. Room names

| Romanian | English |
|----------|---------|
| Living | Living |
| Dormitor | Bedroom |
| Bucătărie | Kitchen |
| Baie | Bathroom |
| Hol | Hall |
| Exterior | Exterior |
| Ușă Principală | Front Door |

## 4. Function / variable names

| Romanian | English |
|----------|---------|
| toggleStareDispozitiv | toggleDeviceState |
| salveazaStarea | saveState |
| adaugaInLog | addLog |
| randareHome | renderHome |
| randareAccesorii | renderAccessories |
| randareScene | renderScenes |
| randareSecuritate | renderSecurity |
| randareSabloane | renderTemplates |
| randareAutomatizari | renderAutomations |
| randareStatisticiLogs | renderStatsLogs |
| randareGraficDashboard | renderDashboardChart |
| actualizeazaStatusGlobal | updateGlobalStatus |
| actualizeazaCardInDOM | updateCardInDOM |
| sincronizeazaDOMcuMemoria | syncDOMWithMemory |
| afiseazaNotificariHome | showHomeNotifications |
| genereazaListaNotificari | generateNotificationsList |
| construiesteCardHTML | buildCardHTML |
| construiesteScenaHTML | buildSceneHTML |
| deschideMeniuDispozitive | openDeviceMenu |
| deschidePopupLuminiAprinse | openLightsOnPopup |
| deschidePopupAudioPornit | openAudioOnPopup |
| deschidePopupToateNotificarile | openAllNotificationsPopup |
| deschidePopupCreareScena | openCreateScenePopup |
| deschideModalAutomatizare | openAutomationModal |
| inchidePopup | closePopup |
| inchidePopupIstoric | closeHistoryPopup |
| inchidePopupAutomatizare | closeAutomationPopup |
| deschideModalAdaugareAccesoriu | openAddAccessoryModal |
| inchideModalAdaugareAccesoriu | closeAddAccessoryModal |
| salveazaAccesoriuNou | saveNewAccessory |
| initIntro | initIntro |
| initFavorites | initFavorites |
| incarcaNumeCasa | loadHouseName |
| deschidePopupPin | openPinPopup |
| inchidePopupPin | closePinPopup |
| apasatTastaPin | pinKeyPressed |
| verificaCodPinIntrodus | verifyEnteredPin |
| salveazaCodPinNou | saveNewPin |
| toggleFavorite | toggleFavorite |
| verificaAutomatizariTimp | checkTimeAutomations |
| verificaReguliAutomatizare | checkAutomationRules |
| salveazaAutomatizare | saveAutomation |
| adaugaSugestie | addSuggestion |
| stergeAutomatizare | deleteAutomation |
| comutaAutomatizare | toggleAutomation |
| ajusteazaDinPopup | adjustFromPopup |
| stingeTotGlobal | turnOffAllGlobal |
| opresteIntervalVacanta | stopVacationInterval |
| aplicaMod | applyMode |
| calculeazaConsumPriza | calculateOutletConsumption |
| calculeazaConsumDispozitiv | calculateDeviceConsumption |
| executaScena | executeScene |
| salveazaScenaCustomNoua | saveNewCustomScene |
| stergeScenaCustom | deleteCustomScene |
| stergeAccesoriu | deleteAccessory |
| executaSecurizareTotala | executeTotalSecurity |
| actualizeazaMediiClimat | updateClimateAverages |
| fetchWeather | fetchWeather |
| getTempUnit | getTempUnit |
| convertTemp | convertTemp |
| valideazaNume | validateName |
| valideazaTemperatura | validateTemperature |
| valideazaTemperaturaCameră | validateRoomTemperature |
| actualizeazaSenzori | updateSensors |
| actualizeazaSenzorCO2 | updateCO2Sensor |
| pornesteDezumidificator | startDehumidifier |
| deschideGeamurile | openWindows |
| simuleazaInundatie | simulateFlood |
| reseteazaInundatie | resetFlood |
| simuleazaIncendiu | simulateFire |
| reseteazaIncendiu | resetFire |
| schimbaTipGraficDashboard | switchDashboardChartType |
| schimbaPerioadaDashboard | switchDashboardPeriod |
| schimbaCuloareAccent | changeAccentColor |
| schimbaTabTrigger | switchTriggerTab |
| schimbaUnitateTemp | changeTempUnit |
| actualizeazaCuloriTermostat | updateThermostatColors |
| actualizeazaCuloriUmiditate | updateHumidityColors |
| ajusteazaValoareCameră | adjustRoomValue |
| calculeazaMedii | calculateAverages |
| salveazaNumeCasa | saveHouseName |
| scrollCarousel | scrollCarousel |

## 5. Non-ASCII identifiers (must be renamed)

| Romanian (non-ASCII) | English |
|----------------------|---------|
| apasăTastăNumpad | pinKeyPressed |
| proceseazăAcțiuneAlarmă | processAlarmAction |
| actualizeazăEcranSecuritate | updateSecurityScreen |
| valideazaTemperaturaCameră | validateRoomTemperature |
| ajusteazaValoareCameră | adjustRoomValue |
| acțiune (parameter) | action |

## 6. Page file names

| Romanian | English |
|----------|---------|
| scene.html | scenes.html |
| accesorii.html | accessories.html |
| automatizari.html | automations.html |
| statistici.html | statistics.html |
| camere.html | rooms.html |
| harta.html | map.html |
| securitate.html | security.html |
| pericole.html | hazards.html |
| setari.html | settings.html |

## 7. Stored keys (localStorage / IndexedDB — migrations required)

| Romanian / current | English | Migration needed? |
|--------------------|---------|-------------------|
| smartHomeCustomScenes | customScenes | Yes |
| smartHomeData | smartHomeData | Yes (key rename) |
| smartHomeData_fallback | smartHomeData_fallback | Yes |
| design_svg_assets_v6 | design_svg_assets_v6 | No (internal version flag) |
| alarmaDezactivata | alarmDisarmed | Yes |
| numeCasaSalvat | houseName | Yes |
| tempUnit | tempUnit | No (already English) |
| darkMode | darkMode | No (already English) |
| accentColor | accentColor | No (already English) |
| activeScene | activeScene | No (already English) |
| weatherCacheData | weatherCacheData | No (already English) |
| weatherCacheTime | weatherCacheTime | No (already English) |
| temp-{camera} | temp-{room} | Yes |
| umid-{camera} | humidity-{room} | Yes |
| pericolInundatie | floodHazard | Yes |
| pericolIncendiu | fireHazard | Yes |

IndexedDB:
- DB name: `SmartHomeDB` → `LumenDB` (recommended, migration via new version)
- Store name: `stateStore` → `stateStore` (can keep or rename)
- Key: `smartHomeData` → `smartHomeData` (migrate to `appState`)

## 8. Locale-specific code

- `html lang="ro"` → `html lang="en"` on all pages
- Regex in `valideazaNume()`: `/^[A-Za-z0-9\săâîșțĂÂÎȘȚ]+$/` → `/^[A-Za-z0-9 ]+$/`
- Romanian period labels in dashboard: "1 Zi", "7 Zile", "30 Zile", "6 Luni", "1 An" → "1 Day", "7 Days", "30 Days", "6 Months", "1 Year"
- `.toLowerCase().includes('spălat')`, `.includes('uscător')`, `.includes('espressor')`, `.includes('cafea')` → English appliance name matching
- All comments throughout JS and CSS are in Romanian → translate to English

## 9. App name

- Current: SmartHomeApp / OmniHome / SmartHome
- New: **Lumen**

