// js/lore.js - Lógica para a visualização de páginas de lore (VERSÃO COM CORREÇÃO DE ESCOPO)

import { LORE_PAGES } from '../data/loreData.js'; 

const LORE_READ_ACTIONS = {
    'abner_on_spirals': { type: 'add_sigil', payload: 's03' }
};

document.addEventListener('DOMContentLoaded', () => {
    const loreListElement = document.getElementById('lore-list');
    const modalOverlay = document.getElementById('letter-modal-overlay');
    const closeModalButton = document.getElementById('close-modal-btn');
    const modalContentArea = document.getElementById('modal-content-area');

    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    gameState.discoveredSigils = new Set(gameState.discoveredSigils || []);
    // ✨ CORREÇÃO 1: A propriedade unlockedLoreIds é garantida aqui
    gameState.unlockedLoreIds = gameState.unlockedLoreIds || [];

    if (!loreListElement || !modalOverlay || !closeModalButton || !modalContentArea) {
        console.error("LoreManager: Não foi possível encontrar todos os elementos necessários.");
        return;
    }

    const saveGameStateChanges = () => {
        const gameStateToSave = {
            ...gameState,
            discoveredSigils: Array.from(gameState.discoveredSigils),
        };
        localStorage.setItem('gameState', JSON.stringify(gameStateToSave));
        console.log("LoreManager: Mudanças no gameState salvas no localStorage.", gameStateToSave);
    };

    function openMessageModal(loreId, title, content) {
        modalContentArea.innerHTML = `<h2>${title}</h2><hr>${content}`;
        modalOverlay.classList.remove('hidden');
        modalContentArea.scrollTop = 0;

        const action = LORE_READ_ACTIONS[loreId];
        
        if (action && action.type === 'add_sigil' && !gameState.discoveredSigils.has(action.payload)) {
            gameState.discoveredSigils.add(action.payload);
            console.log(`[LoreManager] Sigilo '${action.payload}' desbloqueado ao ler a lore '${loreId}'!`);
            
            saveGameStateChanges();
            
            const notification = document.createElement('div');
            notification.className = 'lore-unlock-notification';
            notification.textContent = `NOVO SIGILO DESCOBERTO: ESPIRAL DA PERCEPÇÃO`;
            modalContentArea.appendChild(notification);
        }
    }

    function closeMessageModal() {
        modalOverlay.classList.add('hidden');
    }

    function populateLoreList() {
        loreListElement.innerHTML = ''; 

        // ✨ CORREÇÃO 2: Acessamos a propriedade diretamente do objeto gameState, que está no escopo correto.
        if (gameState.unlockedLoreIds.length === 0) {
             loreListElement.innerHTML = '<p style="color: #c0b090; font-style: italic;">Nenhum tomo ou anotação foi encontrado ainda...</p>';
             return;
        }

        // A iteração agora usa a propriedade correta do objeto gameState
        gameState.unlockedLoreIds.forEach(loreId => {
            const pageData = LORE_PAGES[loreId]; 
            
            if (pageData) {
                const listItem = document.createElement('li');
                listItem.classList.add('lore-item');
                listItem.dataset.loreId = loreId; 
                listItem.innerHTML = `<h4>${pageData.title}</h4>`;

                listItem.addEventListener('click', () => {
                    document.querySelectorAll('.panel-list li').forEach(li => li.classList.remove('active'));
                    listItem.classList.add('active');
                    openMessageModal(loreId, pageData.title, pageData.content); 
                });
                loreListElement.appendChild(listItem);
            } else {
                console.warn(`LoreManager: O jogador desbloqueou um lore com ID '${loreId}', mas ele não foi encontrado em loreData.js.`);
            }
        });
    }

    closeModalButton.addEventListener('click', closeMessageModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeMessageModal();
        }
    });

    populateLoreList();
});