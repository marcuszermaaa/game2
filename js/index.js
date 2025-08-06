/**
 * js/index.js
 * -----------------
 * VERSÃO CANÔNICA DEFINITIVA - O Painel de Controle e Depuração
 * Este arquivo gerencia o menu principal e o painel de ferramentas de desenvolvedor,
 * permitindo a manipulação e visualização completa do estado do jogo,
 * incluindo uma opção para o modo de Tela Cheia.
 */

import { ALL_EVENTS } from './events.js';
import { CHARACTERS } from './data/characterData.js';
import { LORE_PAGES } from './data/loreData.js';
import { ELEMENTOS } from './data/workbenchData.js';
import { SPECIAL_ITEMS } from './data/specialItemData.js';
import { CLIENTS_PER_DAY } from './constants.js';
import { ACHIEVEMENTS } from './data/achievementData.js';

document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento centralizado de todos os elementos do DOM para fácil acesso e manutenção.
    const elements = {
        startGameBtn: document.getElementById('start-game-btn'),
        continueGameBtn: document.getElementById('continue-game-btn'),
        clearSaveBtn: document.getElementById('clear-save-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        menuOptions: document.getElementById('menu-options'),
        settingsPanel: document.getElementById('settings-panel'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        zoomSelect: document.getElementById('zoom-level-select'),
        fullscreenToggle: document.getElementById('fullscreen-toggle'),
        debugToggle: document.getElementById('debug-mode-toggle'),
        debugToolsContainer: document.getElementById('debug-tools-container'),
        moneyInput: document.getElementById('money-input'),
        addMoneyBtn: document.getElementById('add-money-btn'),
        dayInput: document.getElementById('day-input'),
        setDayBtn: document.getElementById('set-day-btn'),
        forceMordecaiBtn: document.getElementById('force-mordecai-btn'),
        addIngredientSelect: document.getElementById('add-ingredient-select'),
        addIngredientBtn: document.getElementById('add-ingredient-btn'),
        addSpecialItemSelect: document.getElementById('add-special-item-select'),
        addSpecialItemBtn: document.getElementById('add-special-item-btn'),
        clearInventoryBtn: document.getElementById('clear-inventory-btn'),
        unlockLoreSelect: document.getElementById('unlock-lore-select'),
        unlockLoreBtn: document.getElementById('unlock-lore-btn'),
        refreshDebugBtn: document.getElementById('refresh-debug-btn'),
        loreUnlockedCount: document.getElementById('lore-unlocked-count'),
        loreTotalCount: document.getElementById('lore-total-count'),
        lorePercentage: document.getElementById('lore-percentage'),
        loreUnlockedList: document.getElementById('lore-unlocked-list'),
        arcCompletedList: document.getElementById('arc-completed-list'),
        characterUnlockedCount: document.getElementById('character-unlocked-count'),
        characterTotalCount: document.getElementById('character-total-count'),
        characterUnlockedList: document.getElementById('character-unlocked-list'),
        clientHistoryList: document.getElementById('debug-client-history-list'),
        achievementList: document.getElementById('debug-achievement-list'),
        narrativeDebugger: document.getElementById('narrative-debugger'),
        debugDayInput: document.getElementById('debug-day-input'),
        debugSimulateBtn: document.getElementById('debug-simulate-day-btn'),
        debugResultsContainer: document.getElementById('debug-results-container'),
        gotoPointClickBtn: document.getElementById('goto-pointclick-btn'),
        gotoBirthingBtn: document.getElementById('goto-birthing-btn'),
        gotoBanishmentBtn: document.getElementById('goto-banishment-btn'),
        gotoChaosBtn: document.getElementById('goto-chaos-btn'),
    };

    let feedbackMessageElement = null;

    /**
     * Função central e robusta para modificar o estado do jogo salvo.
     * Ela lê o estado, converte os arrays para Sets para manipulação segura,
     * executa o callback de modificação, e converte os Sets de volta para arrays antes de salvar.
     */
    const modifyGameState = (action) => {
        const savedStateJSON = localStorage.getItem('gameState');
        if (!savedStateJSON) {
            displayFeedbackMessage("Nenhum jogo salvo para modificar!", 3000);
            return false;
        }
        try {
            let gameState = JSON.parse(savedStateJSON);

            // Converte para formatos de trabalho (Sets) para consistência
            gameState.unlockedLoreIds = new Set(gameState.unlockedLoreIds || []);
            gameState.unlockedAchievements = new Set(gameState.unlockedAchievements || []);
            gameState.purchasedUpgrades = new Set(gameState.purchasedUpgrades || []);
            gameState.readMailIds = new Set(gameState.readMailIds || []);
            gameState.discoveredSigils = new Set(gameState.discoveredSigils || []);

            // Processa a ação com base em seu tipo
            switch (action.type) {
                case 'add_money': gameState.money = (gameState.money || 0) + action.payload; break;
                case 'set_day': gameState.day = action.payload; gameState.clientInDay = 1; gameState.isNewDay = true; break;
                case 'force_mordecai': gameState.flags = gameState.flags || {}; gameState.inkCharges = 0; gameState.flags.hasUsedBloodMagic = true; break;
                case 'add_ingredient': gameState.craftingIngredients = gameState.craftingIngredients || {}; gameState.craftingIngredients[action.payload] = (gameState.craftingIngredients[action.payload] || 0) + 1; break;
                case 'add_special_item': gameState.specialItems = gameState.specialItems || []; if (!gameState.specialItems.includes(action.payload)) gameState.specialItems.push(action.payload); break;
                case 'unlock_lore': gameState.unlockedLoreIds.add(action.payload); break;
                case 'clear_inventories': gameState.craftingIngredients = {}; gameState.specialItems = []; break;
            }

            // Converte de volta para formatos de salvamento (Arrays)
            const stateToSave = {
                ...gameState,
                unlockedLoreIds: Array.from(gameState.unlockedLoreIds),
                unlockedAchievements: Array.from(gameState.unlockedAchievements),
                purchasedUpgrades: Array.from(gameState.purchasedUpgrades),
                readMailIds: Array.from(gameState.readMailIds),
                discoveredSigils: Array.from(gameState.discoveredSigils),
            };
            
            localStorage.setItem('gameState', JSON.stringify(stateToSave));
            updateAllDebugPanels();
            return true;
        } catch (e) {
            displayFeedbackMessage("Erro ao modificar o jogo salvo.", 3000);
            console.error("Erro ao modificar gameState:", e);
            return false;
        }
    };
    
    // --- Funções de Tela Cheia ---
    const openFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) { elem.requestFullscreen().catch(err => console.error(err)); }
        else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); }
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
    };

    const closeFullscreen = () => {
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    };
    
    const syncFullscreenState = () => {
        const isFullscreen = (document.fullscreenElement || document.webkitFullscreenElement) !== null;
        if(elements.fullscreenToggle) elements.fullscreenToggle.checked = isFullscreen;
    };

    // --- Handlers de Eventos ---
    const onToggleFullscreen = () => {
        if (elements.fullscreenToggle.checked) openFullscreen();
        else closeFullscreen();
    };
    const onAddMoney = () => { const amount = parseInt(elements.moneyInput.value, 10); if (isNaN(amount)) { displayFeedbackMessage("Insira um número.", 3000); return; } if (modifyGameState({ type: 'add_money', payload: amount })) displayFeedbackMessage(`$${amount} adicionado.`); };
    const onSetDay = () => { const day = parseInt(elements.dayInput.value, 10); if (isNaN(day) || day < 1) { displayFeedbackMessage("Insira um dia válido.", 3000); return; } if (modifyGameState({ type: 'set_day', payload: day })) displayFeedbackMessage(`Jogo salvo para o Dia ${day}.`); };
    const onForceMordecai = () => { if (modifyGameState({ type: 'force_mordecai' })) displayFeedbackMessage("Condições para Mordecai forçadas."); };
    const onAddIngredient = () => { const id = elements.addIngredientSelect.value; if (id && modifyGameState({ type: 'add_ingredient', payload: id })) displayFeedbackMessage("Ingrediente adicionado."); };
    const onAddSpecialItem = () => { const id = elements.addSpecialItemSelect.value; if (id && modifyGameState({ type: 'add_special_item', payload: id })) displayFeedbackMessage("Item especial adicionado."); };
    const onUnlockLore = () => { const id = elements.unlockLoreSelect.value; if (id && modifyGameState({ type: 'unlock_lore', payload: id })) displayFeedbackMessage("Tomo desbloqueado."); };
    const onClearInventory = () => { if (modifyGameState({ type: 'clear_inventories' })) displayFeedbackMessage("Inventários limpos."); };
    const onGoToPointClick = () => { displayFeedbackMessage("Navegando para Investigação..."); setTimeout(() => window.location.href = "/point.html", 1000); };
    const onGoToBirthing = () => { displayFeedbackMessage("Navegando para 'O Nascimento'..."); setTimeout(() => window.location.href = "/birthing_chamber.html", 1000); };
    const onGoToBanishment = () => { displayFeedbackMessage("Navegando para 'Ritual de Banimento'..."); setTimeout(() => window.location.href = "/banishment_ritual.html", 1000); };
    const onGoToChaos = () => { displayFeedbackMessage("Navegando para 'Transformação'..."); setTimeout(() => window.location.href = "/armitage_transformation.html", 1000); };
    const onStartGame = () => { localStorage.removeItem("gameState"); displayFeedbackMessage("Iniciando nova aventura..."); setTimeout(() => window.location.href = "/intro.html", 1000); };
    const onContinueGame = () => { displayFeedbackMessage("Carregando jogo salvo..."); setTimeout(() => window.location.href = "/game.html", 1000); };
    const onClearSave = () => { if(confirm("Tem certeza?")) { localStorage.removeItem("gameState"); displayFeedbackMessage("Jogo salvo apagado."); updateButtonStates(); updateAllDebugPanels(); }};
    const onOpenSettings = () => { elements.menuOptions.style.display = "none"; elements.settingsPanel.style.display = "block"; toggleDebugger(); };
    const onSaveSettings = () => {
        localStorage.setItem("gameZoomLevel", elements.zoomSelect.value);
        if(elements.debugToggle) localStorage.setItem("debugModeEnabled", elements.debugToggle.checked);
        if(elements.fullscreenToggle) localStorage.setItem("fullscreenEnabled", elements.fullscreenToggle.checked);
        displayFeedbackMessage("Configurações salvas!");
        elements.settingsPanel.style.display = "none";
        elements.menuOptions.style.display = "block";
    };
    
    // --- Funções de UI e Inicialização ---
    const populateDropdown = (selectElement, dataObject, nameKey = 'name', icon = '') => {
        if (!selectElement) return;
        selectElement.innerHTML = '<option value="">-- Selecione --</option>';
        for (const id in dataObject) {
            const item = dataObject[id];
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${icon}${item[nameKey] || item.descricao || id}`;
            selectElement.appendChild(option);
        }
    };

    const updateAllDebugPanels = () => {
        const savedStateJSON = localStorage.getItem('gameState');
        if (!savedStateJSON) {
            const lists = [elements.loreUnlockedList, elements.arcCompletedList, elements.characterUnlockedList, elements.clientHistoryList, elements.achievementList];
            lists.forEach(list => { if(list) list.innerHTML = '<li>Nenhum jogo salvo.</li>'; });
            return;
        }
        const gameState = JSON.parse(savedStateJSON);
        const history = gameState.clientHistory || [];
        const unlockedLore = new Set(gameState.unlockedLoreIds || []);
        elements.loreUnlockedCount.textContent = unlockedLore.size;
        elements.loreTotalCount.textContent = Object.keys(LORE_PAGES).length;
        elements.lorePercentage.textContent = `${Object.keys(LORE_PAGES).length > 0 ? Math.round((unlockedLore.size / Object.keys(LORE_PAGES).length) * 100) : 0}%`;
        elements.loreUnlockedList.innerHTML = Array.from(unlockedLore).map(id => `<li>${LORE_PAGES[id]?.title || id}</li>`).join('') || '<li>Nenhum.</li>';
        const completedEventIds = new Set(history.map(e => e.clientId));
        const uniqueArcs = [...new Set(ALL_EVENTS.map(e => e.arc).filter(Boolean))];
        elements.arcCompletedList.innerHTML = uniqueArcs.map(arc => {
            const arcEvents = ALL_EVENTS.filter(e => e.arc === arc);
            const isCompleted = arcEvents.every(e => completedEventIds.has(e.id));
            return `<li>${isCompleted ? '✅' : '❌'} ${arc}</li>`;
        }).join('');
        const unlockedCharacterIds = new Set(history.map(entry => ALL_EVENTS.find(e => e.id === entry.clientId)?.characterId).filter(Boolean));
        elements.characterUnlockedCount.textContent = unlockedCharacterIds.size;
        elements.characterTotalCount.textContent = Object.keys(CHARACTERS).length;
        elements.characterUnlockedList.innerHTML = Array.from(unlockedCharacterIds).map(id => `<li>${CHARACTERS[id]?.name || id}</li>`).join('') || '<li>Nenhum.</li>';
        elements.clientHistoryList.innerHTML = history.map(h => `<li><b>${h.clientId}</b> (Dia ${h.day}): ${h.outcome}</li>`).join('') || '<li>Vazio.</li>';
        const unlockedAchievements = new Set(gameState.unlockedAchievements || []);
        elements.achievementList.innerHTML = Array.from(unlockedAchievements).map(id => `<li>${ACHIEVEMENTS[id]?.name || id}</li>`).join('') || '<li>Nenhuma.</li>';
    };

    const toggleDebugger = () => {
        const isEnabled = elements.debugToggle.checked;
        elements.debugToolsContainer.style.display = isEnabled ? 'block' : 'none';
        if (isEnabled) {
            const savedState = JSON.parse(localStorage.getItem('gameState'));
            if (savedState) elements.debugDayInput.value = savedState.day;
            updateAllDebugPanels();
        }
    };

    const runNarrativeSimulation = () => {
        const dayToSimulate = parseInt(elements.debugDayInput.value, 10);
        const savedStateJSON = localStorage.getItem('gameState');
        if (!savedStateJSON) {
            elements.debugResultsContainer.innerHTML = "<p>Nenhum jogo salvo para simular.</p>";
            return;
        }
        const gameState = JSON.parse(savedStateJSON);
        const history = (gameState.clientHistory || []).filter(h => h.day < dayToSimulate);
        const completedEventIds = new Set(history.map(e => e.clientId));
        const flags = gameState.flags || {};
        let passedEvents = [], rejectedEvents = [];
        ALL_EVENTS.forEach(event => {
            let rejectionReason = null;
            let conditionsMet = true;
            if (completedEventIds.has(event.id)) { conditionsMet = false; rejectionReason = "Evento já concluído."; }
            else {
                const cond = event.conditions;
                if (dayToSimulate < cond.minDay) { conditionsMet = false; rejectionReason = `Ainda não é o Dia ${cond.minDay}.`; }
                else if (cond.maxDay && dayToSimulate > cond.maxDay) { conditionsMet = false; rejectionReason = `O Dia ${cond.maxDay} já passou.`; }
                else if (cond.requiresFlag && !flags[cond.requiresFlag]) { conditionsMet = false; rejectionReason = `Requer a flag '${cond.requiresFlag}', que não está ativa.`; }
                else if (cond.requiresEvent && !completedEventIds.has(cond.requiresEvent)) { conditionsMet = false; rejectionReason = `Requer a conclusão do evento '${cond.requiresEvent}'.`; }
                else if (cond.requiresEventOutcome) {
                    const required = history.find(h => h.clientId === cond.requiresEventOutcome.id && h.outcome === cond.requiresEventOutcome.outcome);
                    if (!required) { conditionsMet = false; rejectionReason = `Requer o resultado '${cond.requiresEventOutcome.outcome}' do evento '${cond.requiresEventOutcome.id}'.`; }
                }
            }
            if (conditionsMet) passedEvents.push(event);
            else rejectedEvents.push({ ...event, rejectionReason });
        });
        passedEvents.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        const agenda = passedEvents.slice(0, CLIENTS_PER_DAY);
        renderDebugResults(agenda, rejectedEvents);
    };

    const renderDebugResults = (agenda, rejected) => {
        let html = '<h4>Agenda Simulada para o Dia:</h4>';
        if (agenda.length > 0) {
            agenda.forEach((event, index) => html += `<div class="debug-event"><strong>${index + 1}: ${event.id}</strong> (Prioridade: ${event.priority || 0})</div>`);
        } else { html += '<p>Nenhum evento agendado para este dia.</p>'; }
        html += '<hr><h4>Eventos Rejeitados:</h4>';
        if (rejected.length > 0) {
            rejected.forEach(event => {
                html += `<div class="debug-event"><strong>${event.id}</strong> (Prioridade: ${event.priority || 0})<ul class="debug-event-conditions"><li class="condition-failed">Motivo: ${event.rejectionReason}</li></ul></div>`;
            });
        } else { html += '<p>Nenhum evento rejeitado.</p>'; }
        elements.debugResultsContainer.innerHTML = html;
    };

    const updateButtonStates = () => {
        const hasSave = localStorage.getItem('gameState') !== null;
        elements.continueGameBtn.disabled = !hasSave;
        elements.clearSaveBtn.disabled = !hasSave;
        const debugButtons = [
            elements.addMoneyBtn, elements.moneyInput, elements.dayInput, elements.setDayBtn,
            elements.addIngredientBtn, elements.addIngredientSelect,
            elements.addSpecialItemBtn, elements.addSpecialItemSelect,
            elements.clearInventoryBtn, elements.unlockLoreBtn, elements.unlockLoreSelect,
            elements.forceMordecaiBtn, elements.gotoPointClickBtn, elements.gotoBirthingBtn,
            elements.gotoBanishmentBtn, elements.gotoChaosBtn,
        ];
        debugButtons.forEach(el => { if (el) el.disabled = !hasSave; });
    };

    const displayFeedbackMessage = (text, duration = 3000) => {
        if (feedbackMessageElement) feedbackMessageElement.remove();
        feedbackMessageElement = document.createElement('h2');
        feedbackMessageElement.className = 'feedback-message';
        feedbackMessageElement.textContent = text;
        const referenceNode = elements.settingsPanel.style.display === 'none' ? elements.menuOptions : elements.settingsPanel;
        referenceNode.insertAdjacentElement('afterend', feedbackMessageElement);
        setTimeout(() => { if (feedbackMessageElement) { feedbackMessageElement.remove(); feedbackMessageElement = null; } }, duration);
    };

    const loadSettings = () => {
        const savedZoom = localStorage.getItem('gameZoomLevel');
        if (savedZoom && elements.zoomSelect) { elements.zoomSelect.value = savedZoom; }
        const debugEnabled = localStorage.getItem('debugModeEnabled') === 'true';
        if (elements.debugToggle) { elements.debugToggle.checked = debugEnabled; }
        const fullscreenEnabled = localStorage.getItem('fullscreenEnabled') === 'true';
        if(elements.fullscreenToggle) { elements.fullscreenToggle.checked = fullscreenEnabled; }
    };
    
    const init = () => {
        elements.startGameBtn?.addEventListener("click", onStartGame);
        elements.continueGameBtn?.addEventListener("click", onContinueGame);
        elements.clearSaveBtn?.addEventListener("click", onClearSave);
        elements.settingsBtn?.addEventListener("click", onOpenSettings);
        elements.saveSettingsBtn?.addEventListener("click", onSaveSettings);
        elements.fullscreenToggle?.addEventListener('change', onToggleFullscreen);
        elements.addMoneyBtn?.addEventListener("click", onAddMoney);
        elements.setDayBtn?.addEventListener("click", onSetDay);
        elements.forceMordecaiBtn?.addEventListener("click", onForceMordecai);
        elements.addIngredientBtn?.addEventListener("click", onAddIngredient);
        elements.addSpecialItemBtn?.addEventListener("click", onAddSpecialItem);
        elements.clearInventoryBtn?.addEventListener("click", onClearInventory);
        elements.unlockLoreBtn?.addEventListener("click", onUnlockLore);
        elements.refreshDebugBtn?.addEventListener("click", updateAllDebugPanels);
        elements.debugToggle?.addEventListener("change", toggleDebugger);
        elements.debugSimulateBtn?.addEventListener("click", runNarrativeSimulation);
        elements.gotoPointClickBtn?.addEventListener("click", onGoToPointClick);
        elements.gotoBirthingBtn?.addEventListener("click", onGoToBirthing);
        elements.gotoBanishmentBtn?.addEventListener("click", onGoToBanishment);
        elements.gotoChaosBtn?.addEventListener("click", onGoToChaos);

        document.addEventListener('fullscreenchange', syncFullscreenState);
        document.addEventListener('webkitfullscreenchange', syncFullscreenState);
        
        populateDropdown(elements.addIngredientSelect, ELEMENTOS, "descricao", "⚛️ ");
        populateDropdown(elements.addSpecialItemSelect, SPECIAL_ITEMS, "name", "✨ ");
        populateDropdown(elements.unlockLoreSelect, LORE_PAGES, "title", "📖 ");
        
        updateButtonStates();
        loadSettings();
        syncFullscreenState();
        if(!localStorage.getItem("gameState")) displayFeedbackMessage("Nenhum jogo salvo.");
    };
    
    init();
});