import { MORDECAI_INVENTORY } from '../data/mordecaiData.js';

document.addEventListener('DOMContentLoaded', () => {
    let gameState = JSON.parse(localStorage.getItem('gameState'));
    if (!gameState) { window.location.href = '/index.html'; return; }

    const dom = {
        sanityDisplay: document.getElementById('player-sanity-display'),
        moneyDisplay: document.getElementById('player-money-display'),
        shopGrid: document.getElementById('shop-grid'),
        sellSanityBtn: document.getElementById('sell-sanity-btn'),
        returnBtn: document.getElementById('return-to-night-btn'),
    };

    const updateStats = () => {
        dom.sanityDisplay.textContent = `Sanidade: ${gameState.sanity}`;
        dom.moneyDisplay.textContent = `Dinheiro: $${gameState.money}`;
        // Desabilita o botão se o jogador não tiver sanidade suficiente para vender
        dom.sellSanityBtn.disabled = gameState.sanity <= 10;
    };

    const renderShop = () => {
        dom.shopGrid.innerHTML = '';
        for (const key in MORDECAI_INVENTORY) {
            const item = MORDECAI_INVENTORY[key];
            const isMoney = item.currency === 'money';
            const currencySymbol = isMoney ? '$' : '🧠';
            const playerResource = isMoney ? gameState.money : gameState.sanity;
            
            const isPurchased = (gameState.unlockedRecipes && gameState.unlockedRecipes.has(item.payload)) ||
                                (gameState.purchasedUpgrades && gameState.purchasedUpgrades.has(item.payload));
            
            let canAfford = playerResource >= item.cost;
            let buttonText = `Comprar (${item.cost} ${currencySymbol})`;
            letisDisabled = isPurchased || !canAfford;

            if (isPurchased) buttonText = "Adquirido";
            if (!canAfford) buttonText = "Recursos Insuficientes";

            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="card-footer">
                    <button class="buy-btn" data-item-id="${item.id}" ${isDisabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
            dom.shopGrid.appendChild(card);
        }
    };
    
    const buyItem = (itemId) => {
        const item = MORDECAI_INVENTORY[itemId];
        if (!item) return;

        const isMoney = item.currency === 'money';
        if (isMoney) {
            gameState.money -= item.cost;
        } else {
            gameState.sanity -= item.cost;
        }

        switch(item.type) {
            case 'recipe':
                if (!gameState.unlockedRecipes) gameState.unlockedRecipes = new Set();
                gameState.unlockedRecipes.add(item.payload);
                break;
            case 'sigil':
                if (!gameState.discoveredSigils) gameState.discoveredSigils = new Set();
                gameState.discoveredSigils.add(item.payload);
                break;
            case 'ingredient':
                 if (!gameState.craftingIngredients) gameState.craftingIngredients = {};
                gameState.craftingIngredients[item.payload] = (gameState.craftingIngredients[item.payload] || 0) + 1;
                break;
            case 'upgrade':
                if (!gameState.purchasedUpgrades) gameState.purchasedUpgrades = new Set();
                gameState.purchasedUpgrades.add(item.payload);
                break;
        }
        
        // Converte Sets para Arrays para salvar
        gameState.unlockedRecipes = Array.from(gameState.unlockedRecipes || []);
        gameState.purchasedUpgrades = Array.from(gameState.purchasedUpgrades || []);
        gameState.discoveredSigils = Array.from(gameState.discoveredSigils || []);

        localStorage.setItem('gameState', JSON.stringify(gameState));
        
        // Recarrega o estado para garantir que os Sets sejam recriados
        gameState = JSON.parse(localStorage.getItem('gameState'));
        gameState.unlockedRecipes = new Set(gameState.unlockedRecipes);
        gameState.purchasedUpgrades = new Set(gameState.purchasedUpgrades);
        gameState.discoveredSigils = new Set(gameState.discoveredSigils);

        updateStats();
        renderShop();
    };

    dom.shopGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            buyItem(e.target.dataset.itemId);
        }
    });

    dom.sellSanityBtn.addEventListener('click', () => {
        gameState.sanity -= 10;
        gameState.money += 50;
        updateStats();
    });

    dom.returnBtn.addEventListener('click', () => {
        // Converte Sets para Arrays antes de salvar e sair
        gameState.unlockedRecipes = Array.from(gameState.unlockedRecipes || []);
        gameState.purchasedUpgrades = Array.from(gameState.purchasedUpgrades || []);
        gameState.discoveredSigils = Array.from(gameState.discoveredSigils || []);
        localStorage.setItem('gameState', JSON.stringify(gameState));
        window.location.href = '/night.html';
    });

    // Inicialização
    gameState.unlockedRecipes = new Set(gameState.unlockedRecipes || []);
    gameState.purchasedUpgrades = new Set(gameState.purchasedUpgrades || []);
    gameState.discoveredSigils = new Set(gameState.discoveredSigils || []);
    updateStats();
    renderShop();
});