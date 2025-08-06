/**
 * js/mail.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O Gerenciador do Dossiê
 * Este arquivo gerencia toda a lógica e a interface da tela de correio/dossiê (mail.html).
 * Ele utiliza o EventManager para filtrar e-mails condicionais, garantindo que a lógica
 * de pré-requisitos seja consistente com o resto do jogo.
 */

// Importa todos os dados e gerenciadores necessários
import { MAILS } from './data/mailData.js';
import { LORE_PAGES } from './data/loreData.js';
import { SIGILS } from './data/sigilData.js';
import { SPECIAL_ITEMS } from './data/specialItemData.js';
import { UPGRADES } from './data/upgradeData.js';
import { getPlayerVeilStatus } from './data/veilStatusData.js';
import { ELEMENTOS } from './data/workbenchData.js';
import { EventManager } from './managers/EventManager.js'; // Importação crucial

class DossierManager {
    constructor() {
        this.dom = {
            viewerPanel: document.getElementById('dossier-viewer'),
            defaultView: document.getElementById('viewer-default-view'),
            contentView: document.getElementById('viewer-content-view'),
            closeContentBtn: document.getElementById('viewer-close-btn'),
            contentTitle: document.getElementById('viewer-content-title'),
            contentSender: document.getElementById('viewer-content-sender'),
            contentBody: document.getElementById('viewer-content-body'),
            contentNotifications: document.getElementById('viewer-content-notifications'),
            mailList: document.getElementById('mail-list'),
            loreList: document.getElementById('lore-list'),
            dossierNav: document.getElementById('dossier-navigation'),
            backButton: document.getElementById('back-to-game-btn'),
            sanityBar: document.querySelector('.barra-sanidade-progresso'),
            veilStatusBar: document.getElementById('veil-status-name'),
            veilBarPositive: document.getElementById('veil-bar-positive'),
            veilBarNegative: document.getElementById('veil-bar-negative'),
        };
        this.gameState = {};
        this.eventManager = null; // Propriedade para o gerenciador de eventos
        this.init();
    }

    /**
     * Ponto de entrada: carrega o estado, instancia gerenciadores, vincula eventos e renderiza a UI.
     */
    init() {
        this.loadGameState();
        // Instancia o EventManager com o estado carregado para usar sua lógica de filtragem.
        this.eventManager = new EventManager(this.gameState);
        this.bindEvents();
        this.renderAll();
        this.switchListView('mail-list-container');
    }

    /**
     * Carrega o estado do jogo do localStorage de forma robusta, consistente com o gameCore.
     */
    loadGameState() {
        const savedStateJSON = localStorage.getItem('gameState');
        this.gameState = savedStateJSON ? JSON.parse(savedStateJSON) : {};
        
        // Garante que todas as propriedades existam e tenham o tipo de dado correto.
        this.gameState.day = this.gameState.day || 1;
        this.gameState.sanity = this.gameState.sanity ?? 100;
        this.gameState.veilContactPoints = this.gameState.veilContactPoints || 0;
        this.gameState.readMailIds = new Set(this.gameState.readMailIds || []);
        this.gameState.unlockedLoreIds = new Set(this.gameState.unlockedLoreIds || []);
        this.gameState.discoveredSigils = new Set(this.gameState.discoveredSigils || []);
        this.gameState.specialItems = this.gameState.specialItems || [];
        this.gameState.purchasedUpgrades = new Set(this.gameState.purchasedUpgrades || []);
        this.gameState.craftingIngredients = this.gameState.craftingIngredients || {};
        this.gameState.clientHistory = this.gameState.clientHistory || []; // Necessário para o EventManager
        this.gameState.flags = this.gameState.flags || {}; // Necessário para o EventManager
    }

    /**
     * Salva o estado atual do jogo no localStorage, garantindo a conversão de Sets para Arrays.
     */
    saveGameState() {
        const stateToSave = {
            ...this.gameState,
            readMailIds: Array.from(this.gameState.readMailIds),
            unlockedLoreIds: Array.from(this.gameState.unlockedLoreIds),
            discoveredSigils: Array.from(this.gameState.discoveredSigils),
            purchasedUpgrades: Array.from(this.gameState.purchasedUpgrades),
        };
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
    }

    /**
     * Vincula todos os event listeners da página.
     */
    bindEvents() {
        this.dom.backButton.addEventListener('click', () => {
            this.saveGameState();
            window.location.href = '/game.html';
        });
        this.dom.closeContentBtn.addEventListener('click', () => this.showDefaultView());
        this.dom.dossierNav.addEventListener('click', e => {
            const button = e.target.closest('.dossier-nav-btn');
            if (button && button.dataset.target) this.switchListView(button.dataset.target);
        });
        this.dom.mailList.addEventListener('click', e => {
            const card = e.target.closest('.mail-card');
            if (card) this.handleMailClick(card.dataset.mailId);
        });
        this.dom.loreList.addEventListener('click', e => {
            const item = e.target.closest('.lore-item');
            if (item) this.handleLoreClick(item.dataset.loreId);
        });
    }

    /**
     * Renderiza todos os componentes dinâmicos da UI.
     */
    renderAll() {
        this.renderMailList();
        this.renderLoreList();
        this.updateStats();
    }
    
    /**
     * Atualiza as barras de status (sanidade, véu).
     */
    updateStats() {
        if (this.dom.sanityBar) this.dom.sanityBar.style.width = `${this.gameState.sanity}%`;
        const veilStatus = getPlayerVeilStatus(this.gameState.veilContactPoints);
        const points = this.gameState.veilContactPoints;
        if (this.dom.veilStatusBar) this.dom.veilStatusBar.textContent = veilStatus.name;
        if (points > 0) {
            this.dom.veilBarPositive.style.width = `${Math.min(100, (points / 50) * 100)}%`;
            this.dom.veilBarNegative.style.width = '0%';
        } else {
            this.dom.veilBarNegative.style.width = `${Math.min(100, (Math.abs(points) / 50) * 100)}%`;
            this.dom.veilBarPositive.style.width = '0%';
        }
    }

    /**
     * Alterna a visualização entre as listas de "Cartas" e "Tomos".
     * @param {string} targetId - O ID do painel a ser exibido.
     */
    switchListView(targetId) {
        this.dom.dossierNav.querySelectorAll('.dossier-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === targetId);
        });
        document.querySelectorAll('.dossier-list-panel').forEach(panel => {
            panel.classList.toggle('hidden', panel.id !== targetId);
        });
    }

    /**
     * Renderiza a lista de e-mails usando o EventManager para obter a lista correta.
     */
    renderMailList() {
        this.dom.mailList.innerHTML = '';
        // Pede ao EventManager a lista filtrada de e-mails, garantindo que as condições sejam respeitadas.
        const availableMails = this.eventManager.getAvailableMails().sort((a, b) => b.receivedDay - a.receivedDay);
        
        if (availableMails.length === 0) {
            this.dom.mailList.innerHTML = '<p class="placeholder-text">Nenhuma correspondência.</p>';
            return;
        }

        availableMails.forEach(mail => {
            const isRead = this.gameState.readMailIds.has(mail.id);
            const card = document.createElement('li');
            card.className = `mail-card ${isRead ? 'read' : 'unread'}`;
            card.dataset.mailId = mail.id;
            card.innerHTML = `<h4>${mail.subject} ${!isRead ? '<span class="new-badge">Novo</span>' : ''}</h4><div class="mail-footer">De: ${mail.sender} | Dia ${mail.receivedDay}</div>`;
            this.dom.mailList.appendChild(card);
        });
    }

    /**
     * Renderiza a lista de tomos/lore desbloqueados pelo jogador.
     */
    renderLoreList() {
        this.dom.loreList.innerHTML = '';
        if (this.gameState.unlockedLoreIds.size === 0) {
            this.dom.loreList.innerHTML = '<p class="placeholder-text">Nenhuma anotação encontrada.</p>';
            return;
        }
        this.gameState.unlockedLoreIds.forEach(loreId => {
            const pageData = LORE_PAGES[loreId];
            if (pageData) {
                const item = document.createElement('li');
                item.className = 'lore-item';
                item.dataset.loreId = loreId;
                item.innerHTML = `<h4>${pageData.title}</h4>`;
                this.dom.loreList.appendChild(item);
            }
        });
    }

    /**
     * Lida com o clique em um e-mail, marcando-o como lido e processando suas ações.
     * @param {string} mailId - O ID do e-mail clicado.
     */
    handleMailClick(mailId) {
        const mail = MAILS.find(m => m.id === mailId);
        if (!mail) return;
        let notifications = [];
        if (!this.gameState.readMailIds.has(mail.id)) {
            this.gameState.readMailIds.add(mail.id);
            if (mail.action) notifications = this.processAction(mail.action);
            this.renderMailList();
            this.updateStats();
        }
        this.showContentView({ type: 'mail', id: mail.id, title: mail.subject, sender: `De: ${mail.sender} | Dia: ${mail.receivedDay}`, body: mail.content, notifications });
    }

    /**
     * Lida com o clique em um item de lore.
     * @param {string} loreId - O ID do tomo clicado.
     */
    handleLoreClick(loreId) {
        const lore = LORE_PAGES[loreId];
        if (!lore) return;
        this.showContentView({ type: 'lore', id: loreId, title: lore.title, sender: 'Anotação do Diário de Abner', body: lore.content });
    }

    /**
     * Processa uma ação vinda de um e-mail, modifica o gameState e retorna notificações para a UI.
     * @param {object} action - A ação a ser processada.
     * @returns {Array<string>} Uma lista de mensagens de notificação.
     */
    processAction(action) {
        let notifications = [];
        const processSingle = (singleAction) => {
            let notificationText = '';
            switch(singleAction.type) {
                case 'add_multiple': singleAction.payload.forEach(act => notifications.push(...this.processAction(act))); return;
                case 'add_sigil': if (!this.gameState.discoveredSigils.has(singleAction.payload)) { this.gameState.discoveredSigils.add(singleAction.payload); notificationText = `Novo Sigilo Descoberto: ${SIGILS[singleAction.payload]?.name}`; } break;
                case 'unlock_lore': if (!this.gameState.unlockedLoreIds.has(singleAction.payload)) { this.gameState.unlockedLoreIds.add(singleAction.payload); notificationText = `Nova Anotação Adicionada: ${LORE_PAGES[singleAction.payload]?.title}`; } break;
                case 'add_special_item': if (!this.gameState.specialItems.includes(singleAction.payload)) { this.gameState.specialItems.push(singleAction.payload); notificationText = `Item Importante Adquirido: ${SPECIAL_ITEMS[singleAction.payload]?.name}`; } break;
                case 'add_upgrade': if (!this.gameState.purchasedUpgrades.has(singleAction.payload)) { this.gameState.purchasedUpgrades.add(singleAction.payload); notificationText = `Novo Equipamento Adquirido: ${UPGRADES[singleAction.payload]?.name}`; } break;
                case 'add_ingredient':
                    this.gameState.craftingIngredients[singleAction.payload] = (this.gameState.craftingIngredients[singleAction.payload] || 0) + 1;
                    notificationText = `Ingrediente Adquirido: ${ELEMENTOS[singleAction.payload]?.descricao || singleAction.payload}`;
                    break;
                case 'change_sanity': this.gameState.sanity = Math.max(0, Math.min(100, this.gameState.sanity + singleAction.payload)); notificationText = `Sua sanidade mudou.`; break;
            }
            if(notificationText) notifications.push(notificationText);
        };

        if (action.type === 'add_multiple') {
            action.payload.forEach(processSingle);
        } else {
            processSingle(action);
        }

        if (notifications.length > 0) { this.renderLoreList(); this.updateStats(); }
        return notifications;
    }

    /**
     * Exibe o painel de conteúdo detalhado para um e-mail ou tomo.
     * @param {object} config - Configurações de exibição.
     */
    showContentView(config) {
        this.dom.defaultView.classList.add('hidden');
        this.dom.contentView.classList.remove('hidden');
        this.dom.viewerPanel.scrollTop = 0;
        this.dom.contentTitle.textContent = config.title;
        this.dom.contentSender.textContent = config.sender;
        this.dom.contentBody.innerHTML = config.body.replace(/\n/g, '<br>');
        this.dom.contentNotifications.innerHTML = '';
        if(config.notifications && config.notifications.length > 0) {
            config.notifications.forEach(note => { this.dom.contentNotifications.innerHTML += `<div class="lore-unlock-notification">${note}</div>`; });
        }
        document.querySelectorAll('.mail-card.active, .lore-item.active').forEach(el => el.classList.remove('active'));
        const activeElement = document.querySelector(`[data-${config.type}-id="${config.id}"]`);
        if (activeElement) activeElement.classList.add('active');
    }

    /**
     * Retorna a visualização para a tela padrão do dossiê.
     */
    showDefaultView() {
        this.dom.contentView.classList.add('hidden');
        this.dom.defaultView.classList.remove('hidden');
        document.querySelectorAll('.mail-card.active, .lore-item.active').forEach(el => el.classList.remove('active'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DossierManager();
});