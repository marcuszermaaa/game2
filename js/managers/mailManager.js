// js/managers/mailManager.js - O "Cérebro" da Tela de Dossiê
// Lida com o estado, a lógica e a manipulação de dados. Não toca na UI.

import { MAILS } from '../data/mailData.js';
import { LORE_PAGES } from '../data/loreData.js';

export class MailManager {
    constructor() {
        console.log("[MailManager] 🧠 Instância criada.");
        this.gameState = {};
        this._loadGameState();
    }

    /**
     * Carrega o estado do jogo do localStorage e o prepara para uso.
     * @private
     */
    _loadGameState() {
        const savedState = JSON.parse(localStorage.getItem('gameState')) || {};
        
        // Inicialização robusta para garantir que todas as propriedades existam.
        this.gameState.day = savedState.day || 1;
        this.gameState.readMailIds = new Set(savedState.readMailIds || []);
        this.gameState.unlockedLoreIds = Array.isArray(savedState.unlockedLoreIds) ? savedState.unlockedLoreIds : [];
        this.gameState.discoveredSigils = new Set(savedState.discoveredSigils || []);
        this.gameState.specialItems = Array.isArray(savedState.specialItems) ? savedState.specialItems : [];
        this.gameState.purchasedUpgrades = new Set(savedState.purchasedUpgrades || []);
        this.gameState.craftingIngredients = typeof savedState.craftingIngredients === 'object' && savedState.craftingIngredients !== null ? savedState.craftingIngredients : {};
        this.gameState.sanity = savedState.sanity ?? 100;
        this.gameState.veilContactPoints = savedState.veilContactPoints ?? 0;
        this.gameState.playerSigilChoice = savedState.playerSigilChoice ?? null;
        this.gameState.showingTutorial = savedState.showingTutorial ?? false;
        this.gameState.tutorialStep = savedState.tutorialStep;
    }

    /**
     * Salva o estado atual do jogo no localStorage.
     */
    saveGameState() {
        const gameStateToSave = {
            ...this.gameState,
            readMailIds: Array.from(this.gameState.readMailIds),
            discoveredSigils: Array.from(this.gameState.discoveredSigils),
            purchasedUpgrades: Array.from(this.gameState.purchasedUpgrades),
            // Arrays já são serializáveis, não precisam de conversão.
            unlockedLoreIds: this.gameState.unlockedLoreIds,
            specialItems: this.gameState.specialItems,
            craftingIngredients: this.gameState.craftingIngredients,
        };
        localStorage.setItem('gameState', JSON.stringify(gameStateToSave));
        console.log("[MailManager] 💾 Estado do jogo salvo.");
    }

    /**
     * Processa uma ação de desbloqueio e retorna um array de objetos de notificação.
     * @param {object} action - O objeto de ação a ser processado.
     * @returns {object[]} - Array de objetos, cada um podendo conter { message, itemId, itemType }.
     */
    processUnlockAction(action) {
        if (!action) return [];
        let notifications = [];

        const processSingleAction = (singleAction) => {
            switch (singleAction.type) {
                case 'add_multiple':
                    if (Array.isArray(singleAction.payload)) singleAction.payload.forEach(processSingleAction);
                    break;
                case 'add_sigil':
                    if (!this.gameState.discoveredSigils.has(singleAction.payload)) {
                        this.gameState.discoveredSigils.add(singleAction.payload);
                        notifications.push({ message: "Novo Sigilo Descoberto!", itemId: singleAction.payload, itemType: 'sigil' });
                    }
                    break;
                case 'unlock_lore':
                    if (!this.gameState.unlockedLoreIds.includes(singleAction.payload)) {
                        this.gameState.unlockedLoreIds.push(singleAction.payload);
                        notifications.push({ message: "Nova Anotação Adicionada!" });
                    }
                    break;
                case 'add_special_item':
                    if (!this.gameState.specialItems.includes(singleAction.payload)) {
                        this.gameState.specialItems.push(singleAction.payload);
                        notifications.push({ message: "Item Importante Adquirido!", itemId: singleAction.payload, itemType: 'item' });
                    }
                    break;
                case 'add_ingredient':
                    const ingredientId = singleAction.payload;
                    this.gameState.craftingIngredients[ingredientId] = (this.gameState.craftingIngredients[ingredientId] || 0) + 1;
                    notifications.push({ message: "Novo Ingrediente Adquirido!", itemId: ingredientId, itemType: 'item' });
                    break;
                case 'add_upgrade':
                    if (!this.gameState.purchasedUpgrades.has(singleAction.payload)) {
                        this.gameState.purchasedUpgrades.add(singleAction.payload);
                        notifications.push({ message: "Novo Equipamento Adquirido!", itemId: singleAction.payload, itemType: 'item' });
                    }
                    break;
                case 'change_sanity':
                    this.gameState.sanity = Math.max(0, Math.min(100, this.gameState.sanity + singleAction.payload));
                    notifications.push({ message: `Sua sanidade mudou em ${Math.abs(singleAction.payload)}.` });
                    break;
            }
        };
        processSingleAction(action);
        return notifications;
    }

    /**
     * Marca um e-mail como lido e avança o tutorial se necessário.
     * @param {string} mailId - O ID do e-mail a ser marcado como lido.
     * @returns {boolean} - True se o e-mail era não lido, false caso contrário.
     */
    markMailAsRead(mailId) {
        if (!this.gameState.readMailIds.has(mailId)) {
            this.gameState.readMailIds.add(mailId);
            // Lógica específica do tutorial
            if (this.gameState.showingTutorial && mailId === 'letter1') {
                this.gameState.tutorialStep = 'read_mail_then_diary';
            }
            return true; 
        }
        return false;
    }

    /**
     * Retorna a lista de e-mails filtrada e ordenada para exibição na UI.
     * @returns {object[]}
     */
    getMailsForDisplay() {
        return MAILS
            .filter(mail => mail.receivedDay <= this.gameState.day)
            .sort((a, b) => b.receivedDay - a.receivedDay);
    }

    /**
     * Retorna a lista de páginas de lore desbloqueadas para exibição na UI.
     * @returns {object[]}
     */
    getLoreForDisplay() {
        return this.gameState.unlockedLoreIds.map(loreId => ({
            id: loreId,
            ...LORE_PAGES[loreId]
        })).filter(lore => lore.title); // Filtra caso um ID seja inválido no gameState
    }
}