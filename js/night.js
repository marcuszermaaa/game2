/**
 * js/night.js
 * -----------------
 * VERSÃO CANÔNICA DEFINITIVA - Gerenciador da Tela Noturna
 * Este arquivo gerencia toda a lógica e interface da tela de fim de dia (night.html).
 * Suas responsabilidades incluem exibir o resumo do dia, a loja, as notificações
 * de conquistas e preparar o estado do jogo para o dia seguinte, garantindo a
 * consistência dos tipos de dados (Set/Array) ao salvar.
 */

// Importa todos os dados e constantes necessários para a funcionalidade da tela.
import { UPGRADES } from './data/upgradeData.js';
import { ALL_EVENTS } from './events.js';
import { MAX_INK, STARTING_INK_PER_DAY } from './constants.js';
import { ACHIEVEMENTS } from './data/achievementData.js';

// Variável global para controlar o timeout da mensagem de feedback de compra.
let feedbackTimeout;

/**
 * Exibe uma mensagem de feedback temporária na parte inferior da loja.
 * @param {string} message - A mensagem a ser exibida.
 */
function showPurchaseFeedback(message) {
    const feedbackEl = document.getElementById('purchase-feedback');
    if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.classList.add('visible');
        clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => { feedbackEl.classList.remove('visible'); }, 2500);
    }
}

/**
 * Preenche a tela de resumo do dia com estatísticas e encontros.
 * @param {object} gameState - O estado atual do jogo.
 */
function populateSummary(gameState) {
    const history = gameState.clientHistory || [];
    const day = gameState.day - 1; // O dia que acabou de terminar
    const dayHistory = history.filter(entry => entry.day === day);
    let moneyGained = 0;
    let sanityChange = 0;

    dayHistory.forEach(entry => {
        moneyGained += (entry.payment || 0);
        sanityChange += (entry.sanityChange || 0);
    });

    const summaryTitleEl = document.querySelector('#end-of-day-summary h3');
    const summaryMoneySpanEl = document.querySelector('#summary-money span');
    const sanityBalanceSpanEl = document.querySelector('#summary-sanity span');
    const relationsList = document.getElementById('summary-relations-list');

    if (summaryTitleEl) summaryTitleEl.textContent = `Reflexões ao Fim do Dia ${day}`;
    if (summaryMoneySpanEl) summaryMoneySpanEl.textContent = `$${moneyGained}`;
    if (sanityBalanceSpanEl) {
        sanityBalanceSpanEl.textContent = `${sanityChange >= 0 ? '+' : ''}${sanityChange}`;
        sanityBalanceSpanEl.className = sanityChange > 0 ? 'positive' : (sanityChange < 0 ? 'negative' : 'neutral');
    }

    if (relationsList) {
        relationsList.innerHTML = '';
        if (dayHistory.length > 0) {
            dayHistory.forEach(entry => {
                const eventData = ALL_EVENTS.find(e => e.id === entry.clientId);
                const clientName = eventData ? eventData.name : 'Um estranho';
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${clientName}:</strong> ${entry.outcome || 'Interação registrada.'}`;
                relationsList.appendChild(listItem);
            });
        } else {
            relationsList.innerHTML = '<li>Nenhum encontro marcante hoje.</li>';
        }
    }
}

/**
 * Atualiza os status do jogador visíveis na tela da loja.
 * @param {object} gameState - O estado atual do jogo.
 */
function updatePlayerStats(gameState) {
    const moneyDisplayEl = document.getElementById('player-money-display');
    const nightTitleEl = document.getElementById('night-title');
    if (moneyDisplayEl) moneyDisplayEl.textContent = `Dinheiro: $${gameState.money}`;
    if (nightTitleEl) nightTitleEl.textContent = `Loja - Noite do Dia ${gameState.day - 1}`;
}

/**
 * Função centralizada para ler o estado do localStorage e prepará-lo para uso,
 * garantindo que os tipos de dados (como Sets) estejam corretos.
 */
function getSanitizedGameState() {
    let gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    // Garante que todas as propriedades que devem ser Sets sejam convertidas.
    gameState.purchasedUpgrades = new Set(gameState.purchasedUpgrades || []);
    gameState.unlockedRecipes = new Set(gameState.unlockedRecipes || []);
    // Adicione outras conversões se forem manipuladas aqui.
    return gameState;
}

/**
 * Função centralizada para salvar o estado no localStorage,
 * garantindo que os Sets sejam convertidos de volta para Arrays.
 */
function saveSanitizedGameState(gameState) {
    const stateToSave = {
        ...gameState,
        purchasedUpgrades: Array.from(gameState.purchasedUpgrades),
        unlockedRecipes: Array.from(gameState.unlockedRecipes),
    };
    localStorage.setItem('gameState', JSON.stringify(stateToSave));
}

/**
 * Lida com a lógica de compra de um item da loja.
 * @param {string} upgradeId - O ID do item a ser comprado.
 */
function buyItem(upgradeId) {
    let gameState = getSanitizedGameState();
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) {
        console.error(`Tentativa de comprar item inválido: ${upgradeId}`);
        return;
    }
    if (gameState.money < upgrade.cost) {
        showPurchaseFeedback("Dinheiro insuficiente.");
        return;
    }
    
    gameState.money -= upgrade.cost;

    if (upgrade.type === 'consumable') {
        if (upgradeId === 'refill_ink') gameState.inkCharges = Math.min(MAX_INK, (gameState.inkCharges || 0) + 1);
        else if (upgradeId === 'coffee') gameState.sanity = Math.min(100, gameState.sanity + 5);
    } else if (upgrade.type === 'ingredient') {
        gameState.craftingIngredients = gameState.craftingIngredients || {};
        gameState.craftingIngredients[upgrade.id] = (gameState.craftingIngredients[upgrade.id] || 0) + 1;
    } else if (upgrade.type === 'permanent') {
        gameState.purchasedUpgrades.add(upgradeId);
    }

    showPurchaseFeedback(`"${upgrade.name}" comprado!`);
    saveSanitizedGameState(gameState);
    updatePlayerStats(gameState);
    renderShop(gameState);
}

/**
 * Renderiza todos os itens da loja com base nos dados e no progresso do jogador.
 * @param {object} gameState - O estado atual do jogo.
 */
function renderShop(gameState) {
    const permanentGrid = document.querySelector('#permanent-upgrades .card-grid');
    const consumableGrid = document.querySelector('#consumable-items .card-grid');
    if (!permanentGrid || !consumableGrid) return;

    permanentGrid.innerHTML = '';
    consumableGrid.innerHTML = '';
    const purchasedUpgrades = new Set(gameState.purchasedUpgrades || []);

    for (const key in UPGRADES) {
        const upgrade = UPGRADES[key];
        let isButtonDisabled = gameState.money < upgrade.cost;
        let buttonText = "Comprar";

        if (upgrade.type === 'permanent' && purchasedUpgrades.has(key)) {
            isButtonDisabled = true;
            buttonText = 'Adquirido';
        } else if (key === 'refill_ink' && gameState.inkCharges >= MAX_INK) {
            isButtonDisabled = true;
            buttonText = 'Tinteiro Cheio';
        }

        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `<h4>${upgrade.name}</h4><p>${upgrade.description}</p><div class="card-footer"><span class="card-price">$${upgrade.cost}</span><button class="upgrade-btn" data-upgrade-id="${key}" ${isButtonDisabled ? 'disabled' : ''}>${buttonText}</button></div>`;
        
        if (upgrade.type === 'permanent') {
            permanentGrid.appendChild(card);
        } else {
            consumableGrid.appendChild(card);
        }
    }

    document.querySelectorAll('.upgrade-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => buyItem(e.target.dataset.upgradeId));
    });
}

/**
 * Cria e exibe as notificações visuais para as conquistas desbloqueadas.
 * @param {Array<string>} achievementIds - Uma lista de IDs de conquistas.
 */
function displayAchievements(achievementIds) {
    const container = document.getElementById('summary-achievement-container');
    if (!container || !achievementIds || achievementIds.length === 0) return;

    container.innerHTML = '';
    const proceedButton = document.getElementById('proceed-to-shop-btn');
    if(proceedButton) proceedButton.style.display = 'none';

    achievementIds.forEach((id, index) => {
        const achievementData = ACHIEVEMENTS[id];
        if (!achievementData) return;
        
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'summary-achievement-notification';
            notification.innerHTML = `<img src="${achievementData.icon}" alt="Ícone"><div class="achievement-text"><h4>Conquista Desbloqueada!</h4><p>${achievementData.name}</p></div>`;
            container.appendChild(notification);
            setTimeout(() => notification.classList.add('visible'), 50);

            if (index === achievementIds.length - 1) {
                setTimeout(() => {
                    if(proceedButton) proceedButton.style.display = 'block';
                }, 2000);
            }
        }, index * 1800);
    });
}

// --- Ponto de Entrada do Script ---
document.addEventListener('DOMContentLoaded', () => {
    let gameState = getSanitizedGameState();
    if (!gameState) {
        console.error("Nenhum gameState encontrado, redirecionando para o menu.");
        window.location.href = '/index.html';
        return;
    }
    
    const summaryView = document.getElementById('summary-view');
    const shopView = document.getElementById('shop-view');
    
    populateSummary(gameState);
    updatePlayerStats(gameState);
    renderShop(gameState);

    if (gameState.newlyUnlockedAchievements && gameState.newlyUnlockedAchievements.length > 0) {
        displayAchievements(gameState.newlyUnlockedAchievements);
        gameState.newlyUnlockedAchievements = [];
        saveSanitizedGameState(gameState);
    }
    
    const mordecaiButtonContainer = document.getElementById('mordecai-visit-container');
    if (gameState.flags && gameState.flags.mordecaiShopUnlocked && mordecaiButtonContainer) {
        mordecaiButtonContainer.innerHTML = `<button id="visit-mordecai-btn" class="btn-mordecai">Visitar Mordecai</button>`;
        document.getElementById('visit-mordecai-btn').addEventListener('click', () => {
            saveSanitizedGameState(gameState);
            window.location.href = '/mordecai.html';
        });
    }

    document.getElementById('proceed-to-shop-btn').addEventListener('click', () => {
        if(summaryView && shopView){
            summaryView.classList.add('hidden');
            shopView.classList.remove('hidden');
        }
    });

    document.getElementById('start-new-day-btn').addEventListener('click', () => {
        let finalGameState = getSanitizedGameState();
        finalGameState.isNewDay = true;
        finalGameState.day++;
        finalGameState.clientInDay = 1;
        finalGameState.inkCharges = Math.min(MAX_INK, (finalGameState.inkCharges || 0) + STARTING_INK_PER_DAY);
        finalGameState.playerSigilChoice = null;
        finalGameState.analysisChoice = null;
        finalGameState.lastOutcomeData = null;
        saveSanitizedGameState(finalGameState);
        window.location.href = '/game.html';
    });
});