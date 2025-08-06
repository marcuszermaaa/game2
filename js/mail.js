// js/mail.js - VERSÃO COM CARREGAMENTO DE ESTADO ROBUSTO E CORRIGIDO

import { MAILS } from './data/mailData.js';
import { LORE_PAGES } from './data/loreData.js';
import { SIGILS } from './data/sigilData.js';
import { SPECIAL_ITEMS } from './data/specialItemData.js';
import { UPGRADES } from './data/upgradeData.js';
import { getPlayerVeilStatus } from './data/veilStatusData.js';

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
        this.init();
    }

    init() {
        this.loadGameState();
        this.bindEvents();
        this.renderAll();
        this.switchListView('mail-list-container');
    }

    // =================================================================
    // ✨✨✨ FUNÇÃO CRÍTICA ATUALIZADA AQUI ✨✨✨
    loadGameState() {
        const savedState = JSON.parse(localStorage.getItem('gameState')) || {};
        
        // Função auxiliar para carregar um Set de forma segura
        const loadSafeSet = (key) => {
            const data = savedState[key];
            // Garante que os dados sejam um array antes de criar o Set
            return new Set(Array.isArray(data) ? data : []);
        };

        this.gameState = {
            day: savedState.day || 1,
            sanity: savedState.sanity ?? 100,
            readMailIds: loadSafeSet('readMailIds'),
            unlockedLoreIds: loadSafeSet('unlockedLoreIds'),
            discoveredSigils: loadSafeSet('discoveredSigils'),
            specialItems: loadSafeSet('specialItems'),
            purchasedUpgrades: loadSafeSet('purchasedUpgrades'),
            veilContactPoints: savedState.veilContactPoints || 0,
        };
    }
    // =================================================================

    saveGameState() {
        // Pega o estado completo do localStorage para não sobrescrever dados de outros managers
        const fullGameState = JSON.parse(localStorage.getItem('gameState')) || {};
        
        const stateToSave = {
            ...fullGameState, // Mantém os dados existentes
            ...this.gameState, // Adiciona/atualiza os dados deste manager
            readMailIds: Array.from(this.gameState.readMailIds),
            unlockedLoreIds: Array.from(this.gameState.unlockedLoreIds),
            discoveredSigils: Array.from(this.gameState.discoveredSigils),
            specialItems: Array.from(this.gameState.specialItems),
            purchasedUpgrades: Array.from(this.gameState.purchasedUpgrades),
        };
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
    }

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

    renderAll() {
        this.renderMailList();
        this.renderLoreList();
        this.updateStats();
    }
    
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

    switchListView(targetId) {
        this.dom.dossierNav.querySelectorAll('.dossier-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === targetId);
        });
        document.querySelectorAll('.dossier-list-panel').forEach(panel => {
            panel.classList.toggle('hidden', panel.id !== targetId);
        });
    }

    renderMailList() {
        this.dom.mailList.innerHTML = '';
        const availableMails = MAILS.filter(mail => mail.receivedDay <= this.gameState.day).sort((a, b) => b.receivedDay - a.receivedDay);
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

    handleMailClick(mailId) {
        const mail = MAILS.find(m => m.id === mailId);
        if (!mail) return;
        let notifications = [];
        if (!this.gameState.readMailIds.has(mail.id)) {
            this.gameState.readMailIds.add(mail.id);
            if (mail.action) notifications = this.processAction(mail.action);
            this.renderMailList();
        }
        this.showContentView({ type: 'mail', id: mail.id, title: mail.subject, sender: `De: ${mail.sender} | Dia: ${mail.receivedDay}`, body: mail.content, notifications });
    }

    handleLoreClick(loreId) {
        const lore = LORE_PAGES[loreId];
        if (!lore) return;
        this.showContentView({ type: 'lore', id: loreId, title: lore.title, sender: 'Anotação do Diário de Abner', body: lore.content });
    }

    processAction(action) {
        let notifications = [];
        const processSingle = (singleAction) => {
            let notificationText = '';
            switch(singleAction.type) {
                case 'add_multiple': singleAction.payload.forEach(act => notifications.push(...this.processAction(act))); return;
                case 'add_sigil': if (!this.gameState.discoveredSigils.has(singleAction.payload)) { this.gameState.discoveredSigils.add(singleAction.payload); notificationText = `Novo Sigilo Descoberto: ${SIGILS[singleAction.payload]?.name}`; } break;
                case 'unlock_lore': if (!this.gameState.unlockedLoreIds.has(singleAction.payload)) { this.gameState.unlockedLoreIds.add(singleAction.payload); notificationText = `Nova Anotação Adicionada: ${LORE_PAGES[singleAction.payload]?.title}`; } break;
                case 'add_special_item': if (!this.gameState.specialItems.has(singleAction.payload)) { this.gameState.specialItems.add(singleAction.payload); notificationText = `Item Importante Adquirido: ${SPECIAL_ITEMS[singleAction.payload]?.name}`; } break;
                case 'add_upgrade': if (!this.gameState.purchasedUpgrades.has(singleAction.payload)) { this.gameState.purchasedUpgrades.add(singleAction.payload); notificationText = `Novo Equipamento Adquirido: ${UPGRADES[singleAction.payload]?.name}`; } break;
                case 'change_sanity': this.gameState.sanity = Math.max(0, Math.min(100, this.gameState.sanity + singleAction.payload)); notificationText = `Sua sanidade mudou.`; break;
            }
            if(notificationText) notifications.push(notificationText);
        };
        processSingle(action);
        if (notifications.length > 0) { this.renderLoreList(); this.updateStats(); }
        return notifications;
    }

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

    showDefaultView() {
        this.dom.contentView.classList.add('hidden');
        this.dom.defaultView.classList.remove('hidden');
        document.querySelectorAll('.mail-card.active, .lore-item.active').forEach(el => el.classList.remove('active'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DossierManager();
});