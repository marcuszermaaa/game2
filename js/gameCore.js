/**
 * js/gameCore.js
 * -----------------
 * VERSÃO CANÔNICA DEFINITIVA - O Cérebro do Jogo
 * Este arquivo contém a classe GameManager, responsável por todo o fluxo principal do jogo,
 * gerenciamento de estado, e orquestração dos demais gerenciadores.
 * Inclui todas as lógicas e ações necessárias para a experiência de jogo completa.
 */

// Importa todos os gerenciadores e bancos de dados necessários.
import { EventManager } from './managers/EventManager.js';
import { DialogueManager } from './managers/DialogueManager.js';
import { UIManager } from './managers/UIManager.js';
import { AchievementManager } from './managers/AchievementManager.js';
import { FXManager } from './managers/FXManager.js';
import { MAILS } from './data/mailData.js';
import { SIGILS } from './data/sigilData.js';
import { ITENS_CRIADOS, ELEMENTOS } from './data/workbenchData.js';
import { MAX_INK } from './constants.js';
import { LORE_PAGES } from './data/loreData.js';
import { SPECIAL_ITEMS } from './data/specialItemData.js';
import { ALL_EVENTS } from './events.js';
import { UPGRADES } from './data/upgradeData.js';
import { CHARACTERS } from './data/characterData.js';

class GameManager {
    static instance = null;

    constructor() {
        if (GameManager.instance) { return GameManager.instance; }
        GameManager.instance = this;

        this.dom = {
            characterPanel: document.getElementById('character-panel'),
            actionPanel: document.getElementById('action-panel'),
            infoPanel: document.getElementById('info-panel'),
            eventClientName: document.getElementById('event-client-name'),
            eventDialogue: document.getElementById('event-dialogue'),
            dialogueInteractionPanel: document.getElementById('dialogue-interaction-panel'),
            dayStat: document.getElementById('day-stat'),
            clientStat: document.getElementById('client-stat'),
            moneyValue: document.getElementById('money-value'),
            sanityProgressBar: document.querySelector('.brain-progress .progress-bar'),
            inkValue: document.getElementById('ink-value'),
            itemMail: document.getElementById('item-mail'),
            itemBook: document.getElementById('item-book'),
            itemWorkbench: document.getElementById('item-workbench'),
        };

        this.init();
    }

    _log(message, ...data) {
        if (this.state && this.state.debugModeEnabled) {
            console.log(`[GAME CORE DEBUG] ${message}`, ...data);
        }
    }

    init() {
        this.loadGameState();
        this._log('GameManager Initialized. State loaded:', this.state);
        this.instantiateManagers();
        this.bindGlobalEvents();
        this.processPendingState();
    }

    loadGameState() {
        const savedStateJSON = localStorage.getItem('gameState');
        const debugEnabled = localStorage.getItem('debugModeEnabled') === 'true';

        if (savedStateJSON) {
            try { this.state = JSON.parse(savedStateJSON); } 
            catch (e) { this.setupInitialState(); }
        } else { this.setupInitialState(); }

        this.state.debugModeEnabled = debugEnabled;
        this.state.purchasedUpgrades = new Set(this.state.purchasedUpgrades || []);
        this.state.readMailIds = new Set(this.state.readMailIds || []);
        this.state.discoveredSigils = new Set(this.state.discoveredSigils || []);
        this.state.unlockedLoreIds = new Set(this.state.unlockedLoreIds || []);
        this.state.unlockedBestiary = new Set(this.state.unlockedBestiary || []);
        this.state.unlockedAchievements = new Set(this.state.unlockedAchievements || []);
        this.state.unlockedRecipes = new Set(this.state.unlockedRecipes || []);
        this.state.clientHistory = this.state.clientHistory || [];
        this.state.flags = this.state.flags || {};
        this.state.todaysAgenda = this.state.todaysAgenda || [];
        this.state.craftingIngredients = this.state.craftingIngredients || {};
    }

    setupInitialState() {
        this.state = {
            day: 1, clientInDay: 1, sanity: 100, money: 50,
            inHubState: true, isNewDay: true,
            playerSigilChoice: null, analysisChoice: null,
            inkCharges: MAX_INK, lastOutcomeData: null,
            purchasedUpgrades: new Set(), readMailIds: new Set(),
            discoveredSigils: new Set(['s01', 's04']),
            unlockedLoreIds: new Set(), unlockedBestiary: new Set(),
            unlockedAchievements: new Set(), unlockedRecipes: new Set(),
            clientHistory: [], flags: {}, todaysAgenda: [],
            craftingIngredients: {}
        };
        this.saveGameState();
    }

    saveGameState() {
        const stateToSave = {
            ...this.state,
            purchasedUpgrades: Array.from(this.state.purchasedUpgrades),
            readMailIds: Array.from(this.state.readMailIds),
            discoveredSigils: Array.from(this.state.discoveredSigils),
            unlockedLoreIds: Array.from(this.state.unlockedLoreIds),
            unlockedBestiary: Array.from(this.state.unlockedBestiary),
            unlockedAchievements: Array.from(this.state.unlockedAchievements),
            unlockedRecipes: Array.from(this.state.unlockedRecipes),
        };
        delete stateToSave.debugModeEnabled;
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
        this._log('GameState saved.');
    }

    instantiateManagers() {
        this.eventManager = new EventManager(this.state);
        this.dialogueManager = new DialogueManager(this.state, this);
        this.uiManager = new UIManager(this.dom, this.state, this);
        this.achievementManager = new AchievementManager();
        this.fxManager = new FXManager();
    }

    bindGlobalEvents() {
        this.dom.itemMail?.addEventListener('click', () => this.openMail());
        this.dom.itemBook?.addEventListener('click', () => this.openJournal());
        this.dom.itemWorkbench?.addEventListener('click', () => this.openWorkbench());
    }

    processPendingState() {
        this._log('Processing pending state...');

        const onCraftActionsJSON = localStorage.getItem('onCraftActions');
        if (onCraftActionsJSON) {
            localStorage.removeItem('onCraftActions');
            try {
                const actions = JSON.parse(onCraftActionsJSON);
                this.processAndCollectUnlocks(actions);
                this.saveGameState();
            } catch(e) { console.error("Error processing onCraft actions:", e); }
        }

        const birthingOutcomeJSON = localStorage.getItem('birthingChamberOutcome');
        if (birthingOutcomeJSON) {
            localStorage.removeItem('birthingChamberOutcome');
            this.processBirthingOutcome(JSON.parse(birthingOutcomeJSON));
            return;
        }
        
        if (this.state.isNewDay) {
            this.startNewDay();
            return;
        }
        if (this.state.inHubState) {
            this.handleHubState();
            return;
        }
        this._log('State is active day. Processing day events...');
        this.uiManager.updateCoreUIElements(this.checkForUnreadMail());
        this.processDayEvents();
    }

    startNewDay() {
        this.state.isNewDay = false;
        this.state.clientInDay = 1;
        this.state.inHubState = true;
        this.eventManager.prepareAgendaForDay(this.state.day);
        this.state.todaysAgenda = this.eventManager.todaysAgenda;
        this.saveGameState();
        this.processPendingState();
    }

    handleHubState() {
        const unreadMailCount = MAILS.filter(mail => mail.receivedDay <= this.state.day && !this.state.readMailIds.has(mail.id)).length;
        const canProceed = unreadMailCount === 0;
        this.uiManager.showStartDayView(() => {
            this.state.inHubState = false;
            this.processDayEvents();
        }, { unreadMailCount }, canProceed);
    }

    getCurrentClient() {
        const clientIndex = this.state.clientInDay - 1;
        if (this.state.todaysAgenda && clientIndex >= 0 && clientIndex < this.state.todaysAgenda.length) {
            return this.state.todaysAgenda[clientIndex];
        }
        return null;
    }

    processDayEvents() {
        const client = this.getCurrentClient();
        if (!client) { this.startEndDaySequence(); return; }
        if (this.state.lastOutcomeData) { this.processMinigameOutcome(); return; }
        if (this.state.analysisChoice) { this.processAnalysisChoice(); return; }
        const hasBeenEncountered = this.state.clientHistory.some(e => e.clientId === client.id);
        if (client.isNarrativeEvent || (client.narrativeFlow && !hasBeenEncountered)) {
            this.runNarrativeEvent(client);
        } else {
            this.uiManager.resetClientInterface();
            this.uiManager.updateActionButtonBasedOnState();
        }
        this.checkAmbientScares();
    }
    
    checkAmbientScares() {
        if (this.state.sanity < 40 && Math.random() < 0.01) {
            this.fxManager.glitchText(this.dom.eventDialogue);
        }
    }

    advanceToNextClient() {
        if (this.state.clientInDay >= this.state.todaysAgenda.length) {
            this.startEndDaySequence();
            return;
        }
        this.state.clientInDay++;
        this.state.playerSigilChoice = null;
        this.state.analysisChoice = null;
        this.saveGameState();
        this.uiManager.showNextClientTransition("Você respira fundo...", "Próximo Cliente", () => this.processDayEvents());
    }

    processAndCollectUnlocks(actions) {
        if (!actions) return [];
        const unlocks = [];
        const actionsToProcess = Array.isArray(actions) ? actions : [actions];
        actionsToProcess.forEach(action => {
            if (!action || !action.type) return;
            switch (action.type) {
                case 'unlock_lore':
                    if (!this.state.unlockedLoreIds.has(action.payload)) { this.state.unlockedLoreIds.add(action.payload); unlocks.push({ type: 'Tomo', name: LORE_PAGES[action.payload]?.title }); }
                    break;
                case 'add_sigil':
                    if (!this.state.discoveredSigils.has(action.payload)) { this.state.discoveredSigils.add(action.payload); unlocks.push({ type: 'Sigilo', name: SIGILS[action.payload]?.name }); }
                    break;
                case 'add_special_item':
                    if (!this.state.specialItems.includes(action.payload)) { this.state.specialItems.push(action.payload); unlocks.push({ type: 'Item', name: SPECIAL_ITEMS[action.payload]?.name }); }
                    break;
                case 'remove_item':
                    this.state.specialItems = (this.state.specialItems || []).filter(item => item !== action.payload);
                    break;
                case 'add_ingredient':
                    this.state.craftingIngredients[action.payload] = (this.state.craftingIngredients[action.payload] || 0) + 1;
                    unlocks.push({ type: 'Ingrediente', name: this._formatName(action.payload) });
                    break;
                case 'unlock_bestiary':
                    if (!this.state.unlockedBestiary.has(action.payload)) { this.state.unlockedBestiary.add(action.payload); }
                    break;
                case 'unlock_achievement':
                    this.updateAchievements();
                    break;
                case 'unlock_recipe':
                    if (!this.state.unlockedRecipes.has(action.payload)) { this.state.unlockedRecipes.add(action.payload); }
                    break;
                case 'remove_crafted_item':
                    if (this.state.craftedInks && this.state.craftedInks[action.payload] > 0) { this.state.craftedInks[action.payload]--; }
                    break;
                case 'add_consumable_item':
                    const consumable = UPGRADES[action.item];
                    if (consumable?.effect) { for (let i = 0; i < (action.amount || 1); i++) consumable.effect(this.state); }
                    break;
                case 'trigger_menu_pulse':
                    this.uiManager.highlightMenuItem(action.payload);
                    break;
                case 'set_flag':
                    this.state.flags[action.payload] = true;
                    break;
                case 'check_inventory':
                    const hasItem = this.state.craftedInks?.[action.item] > 0;
                    this.processAndCollectUnlocks([hasItem ? action.ifPresent : action.ifNotPresent]);
                    break;
                case 'goto_page':
                    this.saveGameState();
                    window.location.href = action.payload;
                    break;
                case 'start_point_and_click':
                    this.saveGameState();
                    window.location.href = "/point.html";
                    break;
            }
        });
        return unlocks;
    }

    runNarrativeEvent(client) {
        this.markEventAsStarted(client.id);
        const onComplete = () => {
            const unlocks = this.processAndCollectUnlocks(client.action);
            this.markEventAsCompleted(client.id, 'narrative_completed');
            if (unlocks.length > 0) {
                this.uiManager.showOutcomeView("Evento Concluído", `Sua interação com ${client.name} chegou ao fim.`, () => this.advanceToNextClient(), unlocks);
            } else { this.advanceToNextClient(); }
        };
        if (client.narrativeFlow) { this.runNarrativeNode(client.narrativeFlow.startNode); }
        else if (client.narrativeSequence) { this.uiManager.displayNarrativeSequence(client, onComplete); }
    }

    runNarrativeNode(nodeId) {
        const client = this.getCurrentClient();
        if (nodeId === 'END_EVENT') {
            if (client && !client.isNarrativeEvent) { this.processDayEvents(); }
            else { this.markEventAsCompleted(client.id, 'narrative_completed'); this.advanceToNextClient(); }
            return;
        }
        const node = client?.narrativeFlow?.nodes[nodeId];
        if (!node) { this.advanceToNextClient(); return; }
        switch (node.type) {
            case "dialogue": this.uiManager.displayNarrativeSequence({ name: client.name, portraitUrls: client.portraitUrls, narrativeSequence: [{ text: node.text, portraitIndex: node.portraitIndex }] }, () => this.runNarrativeNode(node.nextNode)); break;
            case "choice":
                const characterData = client ? CHARACTERS[client.characterId] : null;
                const choiceOption = node.options.find(opt => opt.isTransgressiveChoice);
                if (choiceOption && characterData?.glitchPortraitUrl && Math.random() < 0.33) {
                    this.fxManager.glitchPortrait(this.uiManager.activeSprite, characterData.glitchPortraitUrl);
                }
                this.uiManager.showMultiOptionPanel({ title: node.title, text: node.text, options: node.options.map(t => ({ ...t, callback: () => this.runNarrativeNode(t.nextNode) })) });
                break;
            case "action":
                const unlocks = this.processAndCollectUnlocks(node.actions);
                this.state.pendingUnlocks = unlocks;
                if (!node.actions.some(a => a.type === 'start_point_and_click' || a.type === 'goto_page')) {
                    this.runNarrativeNode(node.nextNode);
                }
                break;
            case "outcome":
                const pendingUnlocks = this.state.pendingUnlocks || [];
                delete this.state.pendingUnlocks;
                this.uiManager.showOutcomeView(node.title, node.text, () => this.runNarrativeNode(node.nextNode), pendingUnlocks);
                break;
            case "conditional":
                let conditionMet = false;
                if (node.condition.hasCraftedItem) conditionMet = this.state.craftedInks?.[node.condition.hasCraftedItem] > 0;
                else if (node.condition.flag) conditionMet = this.state.flags?.[node.condition.flag];
                this.runNarrativeNode(conditionMet ? node.nextNodeIfTrue : node.nextNodeIfFalse);
                break;
        }
    }

    processAnalysisChoice() {
        const { analysisChoice: choice } = this.state;
        const client = this.getCurrentClient();
        if (!choice || !client) { this.state.analysisChoice = null; this.processPendingState(); return; }
        const sigil = SIGILS[client.request];
        if (!sigil) { this.state.analysisChoice = null; this.processPendingState(); return; }
        let title = "Análise Concluída", msg = "", sanity = 0, willTattoo = false;
        switch (choice) {
            case 'correct': sanity = 5; msg = "Você corrigiu o sigilo com maestria."; this.state.playerSigilChoice = sigil.correctVersion; willTattoo = true; break;
            case 'accept_corrupted': sanity = -20; msg = "Você decidiu seguir o pedido corrompido."; this.state.playerSigilChoice = client.request; willTattoo = true; this.markEventAsCompleted(client.id, 'accept_corrupted'); break;
            case 'refuse': sanity = 10; msg = "Você se recusou a tatuar o símbolo perigoso."; willTattoo = false; this.markEventAsCompleted(client.id, 'refuse'); break;
            case 'accept_prohibited': sanity = -50; msg = "Você cedeu à tentação e aceitou o sigilo proibido."; this.state.playerSigilChoice = client.request; willTattoo = true; this.markEventAsCompleted(client.id, 'accept_prohibited'); break;
        }
        this.changeSanity(sanity); this.state.analysisChoice = null; this.saveGameState();
        this.uiManager.showOutcomeView(title, msg, () => { willTattoo ? this.processDayEvents() : this.advanceToNextClient(); });
    }

    processMinigameOutcome() {
        const { lastOutcomeData: outcome } = this.state;
        const client = this.getCurrentClient();
        if (!outcome || !client) { this.state.lastOutcomeData = null; this.advanceToNextClient(); return; }
        const methodUsed = this.state.minigameMethod || { method: 'normal' };
        let details = { tattooMethod: methodUsed.method };
        if (methodUsed.method === 'normal') { this.state.inkCharges--; }
        else if (methodUsed.method === 'blood') { if (!this.state.flags.hasUsedBloodMagic) { this.state.flags.hasUsedBloodMagic = true; this.processAndCollectUnlocks([{ type: 'unlock_lore', payload: 'lore_blood_echo' }]); } }
        else if (methodUsed.method === 'special' && this.state.craftedInks) { this.state.craftedInks[methodUsed.inkId]--; }
        delete this.state.minigameMethod;
        let money = 0, sanity = 0, title = "", msg = "", outcomeKey = '', unlocks = [];
        const isCorrect = this.state.playerSigilChoice === client.correctSigil;
        if (outcome.success) {
            outcomeKey = isCorrect ? 'success' : 'wrong_sigil';
            title = isCorrect ? "Trabalho Impecável" : "Erro de Julgamento";
            money = isCorrect ? (client.successPay || 0) : (client.wrongPay || 0);
            sanity = isCorrect ? 5 : -15;
            msg = isCorrect ? `O sigilo correto foi desenhado. Você recebeu $${money}.` : `Sua mão foi firme, mas o sigilo era o errado...`;
            if (isCorrect && client.rewards?.success) { msg += "\n\nO cliente, agradecido, deixou algo para você."; unlocks = this.processAndCollectUnlocks(client.rewards.success); }
        } else {
            outcomeKey = 'fail_minigame'; title = "Mão Trêmula";
            money = client.failPay || 0; sanity = -10;
            msg = `Você falhou em completar o desenho.`;
        }
        this.changeSanity(sanity); this.state.money += money;
        details.payment = money; details.sanityChange = sanity;
        this.markEventAsCompleted(client.id, outcomeKey, details);
        this.state.lastOutcomeData = null; this.state.playerSigilChoice = null;
        this.saveGameState();
        this.uiManager.showOutcomeView(title, msg, () => this.advanceToNextClient(), unlocks);
    }

    processBirthingOutcome(outcome) {
        let title = "Fuga da Mansão";
        let message = "Você escapou, mas o som do nascimento profano ecoará em sua mente para sempre. A cidade não é mais a mesma.";
        let unlocks = this.processAndCollectUnlocks([ { type: 'unlock_bestiary', payload: 'pickman_brood_queen' }, { type: 'unlock_achievement' } ]);
        this.markEventAsCompleted('pickman_transformation_final', 'survived');
        this.changeSanity(-20);
        this.saveGameState();
        this.uiManager.showOutcomeView(title, message, () => {
            if (this.state.clientInDay >= this.state.todaysAgenda.length) { this.startEndDaySequence(); }
            else { this.advanceToNextClient(); }
        }, unlocks);
    }

    startMinigame() {
        if (!this.state.playerSigilChoice) return;
        const options = [];
        const availableCraftedInks = Object.keys(this.state.craftedInks || {}).filter(id => this.state.craftedInks[id] > 0);
        if (this.state.inkCharges > 0) options.push({ text: `Usar Tinta Espectral (${this.state.inkCharges})`, callback: () => this.launchMinigame('normal') });
        availableCraftedInks.forEach(inkId => { options.push({ text: `Usar ${ITENS_CRIADOS[inkId]?.name} (x${this.state.craftedInks[inkId]})`, callback: () => this.launchMinigame('special', inkId) }); });
        if (options.length === 0) options.push({ text: "Usar meu próprio sangue (-25 Sanidade)", style: 'danger', callback: () => this.launchMinigame('blood') });
        options.push({ text: "Cancelar", style: 'cancel', callback: () => this.uiManager.updateActionButtonBasedOnState() });
        this.uiManager.showMultiOptionPanel({ title: "Escolha sua Tinta", options });
    }

    launchMinigame(method, inkId = null) {
        this.state.minigameMethod = { method, inkId };
        if (method === 'blood') { this.changeSanity(-25); }
        const client = this.getCurrentClient();
        const minigameConfig = { difficultyModifier: 1.0 };
        if (client.id === 'apostador_azarado' && method === 'normal') minigameConfig.difficultyModifier = 1.8;
        if (client.id === 'herdeira_doente' && method === 'normal') { this.state.inkCharges = 0; }
        localStorage.setItem('minigameConfig', JSON.stringify(minigameConfig));
        this.saveGameState();
        window.location.href = `/minigame.html`;
    }

    startAnalysisProcess() {
        const client = this.getCurrentClient();
        if (!client?.request) return;
        localStorage.setItem('currentAnalysisEvent', JSON.stringify(client));
        this.saveGameState();
        window.location.href = `/analysis.html`;
    }

    updateAchievements() {
        const newlyUnlocked = this.achievementManager.checkAchievements(this.state);
        if (newlyUnlocked.length > 0) {
            if (!this.state.newlyUnlockedAchievements) this.state.newlyUnlockedAchievements = [];
            this.state.newlyUnlockedAchievements.push(...newlyUnlocked);
        }
    }

    markEventAsStarted(eventId) { if (!this.state.clientHistory.some(e => e.clientId === eventId)) { this.state.clientHistory.push({ clientId: eventId, day: this.state.day, outcome: 'started' }); this.saveGameState(); } }

    markEventAsCompleted(eventId, outcome, details = {}) {
        const entry = this.state.clientHistory.find(e => e.clientId === eventId);
        const eventData = ALL_EVENTS.find(e => e.id === eventId);
        if (eventData?.request) {
            const sigilData = SIGILS[eventData.request];
            if(sigilData) details.requestType = sigilData.type;
        }
        if (entry) { entry.outcome = outcome; Object.assign(entry, details); }
        else { this.state.clientHistory.push({ clientId: eventId, day: this.state.day, outcome, ...details }); }
        this.updateAchievements();
        this.saveGameState();
    }

    startEndDaySequence() {
        if (this.state.day === 10 && this.state.flags.armitageUltimatumActive) {
            this.runNarrativeEvent(ALL_EVENTS.find(e => e.id === 'armitage_final_ritual'));
        } else {
            this.state.isNewDay = true;
            this.state.day++;
            this.state.clientInDay = 1;
            this.saveGameState();
            window.location.href = '/night.html';
        }
    }

    changeSanity(amount) { if (amount) { this.state.sanity = Math.max(0, Math.min(100, this.state.sanity + amount)); this.uiManager.updateStats(); if (this.state.sanity <= 0) this.endGame("Sua mente se despedaçou sob o peso do que viu."); } }

    checkForUnreadMail() { return MAILS.some(mail => mail.receivedDay <= this.state.day && !this.state.readMailIds.has(mail.id)); }
    
    processEventAction(action) { this.processAndCollectUnlocks(action); }
    
    openJournal() { this.saveGameState(); window.location.href = "/journal.html"; }
    openMail() { this.saveGameState(); window.location.href = "/mail.html"; }
    openWorkbench() { this.saveGameState(); window.location.href = "/workbench.html"; }

    endGame(reason) { this.uiManager.showEndGameView(reason, () => { localStorage.removeItem('gameState'); window.location.href = '/index.html'; }); }
    
     _formatName(name) {
        if (!name) return '';
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.game === 'undefined') {
        window.game = new GameManager();
    }
});