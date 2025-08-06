/**
 * js/workbench.js
 * -----------------
 * VERSÃO CANÔNICA CORRIGIDA - O Gerenciador da Bancada de Trabalho
 * ✨ CORREÇÃO: A função loadGameState foi tornada mais robusta para verificar
 * o tipo de dado de 'unlockedRecipes' antes de criar um Set, corrigindo o erro
 * 'object is not iterable'.
 */

import { ELEMENTOS, ITENS_CRIADOS, RECEITAS } from './data/workbenchData.js';
import { SPECIAL_ITEMS } from './data/specialItemData.js';

class WorkbenchManager {
    constructor() {
        this.dom = {
            tabs: document.querySelectorAll('.station-tab'),
            stations: document.querySelectorAll('.station'),
            inventoryList: document.getElementById('inventory-list'),
            recipeList: document.getElementById('recipe-list'),
            reagentSlots: document.querySelectorAll('.reagent-slot'),
            craftButton: document.getElementById('craft-button'),
            craftResult: document.getElementById('craft-result'),
            assemblyBoard: document.getElementById('assembly-board'),
            assemblyFeedback: document.getElementById('assembly-feedback'),
            cipherInput: document.getElementById('cipher-input'),
            cipherShiftSlider: document.getElementById('cipher-shift'),
            shiftValueDisplay: document.getElementById('shift-value'),
            cipherOutput: document.getElementById('cipher-output'),
        };
        this.gameState = {};
        this.currentAlchemySlots = [null, null, null];
        this.init();
    }

    init() {
        this.loadGameState();
        this.renderInventory();
        this.renderRecipes();
        this.bindEvents();
        this.setupAssemblyStation();
        this.setupResearchStation();
    }

    /**
     * ✨ FUNÇÃO ATUALIZADA E ROBUSTA ✨
     * Carrega o estado e verifica ativamente o tipo de dados para prevenir erros.
     */
    loadGameState() {
        this.gameState = JSON.parse(localStorage.getItem('gameState')) || {};
        
        this.gameState.craftingIngredients = this.gameState.craftingIngredients || {};
        this.gameState.specialItems = this.gameState.specialItems || [];
        
        // CORREÇÃO: Verifica se a propriedade 'unlockedRecipes' é um Array.
        // Se for um objeto antigo ou outro tipo, trata como vazio para evitar o crash.
        const recipes = this.gameState.unlockedRecipes;
        if (Array.isArray(recipes)) {
            this.gameState.unlockedRecipes = new Set(recipes);
        } else {
            // Se os dados estiverem corrompidos (ex: é um objeto), começa com um Set vazio.
            this.gameState.unlockedRecipes = new Set();
        }
    }
    
    saveGameState() {
        const stateToSave = {
            ...this.gameState,
            // Garante que unlockedRecipes seja salvo como Array.
            unlockedRecipes: Array.from(this.gameState.unlockedRecipes),
        };
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
    }

    renderInventory() {
        this.dom.inventoryList.innerHTML = '';
        let hasItems = false;
        const allItemData = { ...ELEMENTOS, ...ITENS_CRIADOS, ...SPECIAL_ITEMS };

        const renderItem = (id, qty) => {
            const itemData = allItemData[id];
            if (itemData) {
                hasItems = true;
                const li = document.createElement('li');
                li.className = 'inventory-item';
                li.draggable = true;
                li.dataset.itemId = id;
                li.innerHTML = `<span>${itemData.name || itemData.descricao}</span><span class="quantity">x${qty}</span>`;
                this.dom.inventoryList.appendChild(li);
            }
        };

        Object.entries(this.gameState.craftingIngredients).forEach(([id, qty]) => {
            if (qty > 0) renderItem(id, qty);
        });

        this.gameState.specialItems.forEach(id => renderItem(id, 1));
        
        if (!hasItems) this.dom.inventoryList.innerHTML = '<li class="placeholder">Nenhum item.</li>';
    }

    renderRecipes() {
        this.dom.recipeList.innerHTML = '';
        const recipesToDisplay = RECEITAS.filter(r => !r.id || this.gameState.unlockedRecipes.has(r.id));
        if (recipesToDisplay.length === 0) { this.dom.recipeList.innerHTML = '<li class="placeholder">Nenhuma receita.</li>'; return; }
        
        recipesToDisplay.forEach(recipe => {
            const resultData = ITENS_CRIADOS[recipe.resultado] || SPECIAL_ITEMS[recipe.resultado];
            const resultName = resultData?.name || recipe.resultado;
            const li = document.createElement('li');
            li.className = 'recipe-item';
            li.innerHTML = `<strong>${resultName}</strong>`;
            this.dom.recipeList.appendChild(li);
        });
    }

    bindEvents() {
        this.dom.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchStation(tab.dataset.station));
        });
        this.dom.inventoryList.addEventListener('dragstart', e => {
            if (e.target.classList.contains('inventory-item')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
            }
        });
        this.dom.reagentSlots.forEach(slot => {
            slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('highlight'); });
            slot.addEventListener('dragleave', () => slot.classList.remove('highlight'));
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('highlight');
                const itemId = e.dataTransfer.getData('text/plain');
                const slotIndex = parseInt(slot.dataset.slotIndex);
                this.addIngredientToSlot(itemId, slotIndex);
            });
            slot.addEventListener('click', () => this.clearSlot(parseInt(slot.dataset.slotIndex)));
        });
        this.dom.craftButton.addEventListener('click', () => this.handleCraftClick());
    }

    switchStation(stationId) {
        this.dom.tabs.forEach(t => t.classList.toggle('active', t.dataset.station === stationId));
        this.dom.stations.forEach(s => s.classList.toggle('active', s.id === stationId));
    }

    addIngredientToSlot(itemId, slotIndex) {
        if (this.currentAlchemySlots.includes(itemId)) {
             this.showFeedback("Ingrediente já está na mesa.");
             return;
        }
        this.currentAlchemySlots[slotIndex] = itemId;
        this.renderAlchemySlots();
    }
    
    clearSlot(slotIndex) {
        this.currentAlchemySlots[slotIndex] = null;
        this.renderAlchemySlots();
    }

    renderAlchemySlots() {
        const allItems = { ...ELEMENTOS, ...ITENS_CRIADOS, ...SPECIAL_ITEMS };
        this.dom.reagentSlots.forEach((slot, index) => {
            const itemId = this.currentAlchemySlots[index];
            if (itemId) {
                const itemData = allItems[itemId];
                slot.innerHTML = `<span class="item-name">${itemData.name || itemData.descricao}</span>`;
            } else {
                slot.innerHTML = ``;
            }
        });
        this.dom.craftButton.disabled = this.currentAlchemySlots.filter(Boolean).length === 0;
    }
    
    handleCraftClick() {
        const ingredients = this.currentAlchemySlots.filter(Boolean).sort();
        const matchedRecipe = RECEITAS.find(r => {
            const recipeIngredients = [...r.combinacao].sort();
            return JSON.stringify(ingredients) === JSON.stringify(recipeIngredients);
        });

        if (matchedRecipe) {
            const resultData = ITENS_CRIADOS[matchedRecipe.resultado] || SPECIAL_ITEMS[matchedRecipe.resultado];
            this.showFeedback(`Você criou: ${resultData.name}!`);
            this.processCrafting(matchedRecipe);
        } else {
            this.showFeedback("A combinação falhou, os ingredientes foram perdidos.", true);
            this.processCrafting(null, ingredients);
        }
        
        this.currentAlchemySlots.fill(null);
        this.renderAlchemySlots();
    }
    
    processCrafting(recipe, failedIngredients = []) {
        let onCraftActions = [];
        if (recipe) {
            if (recipe.type === 'assembly') {
                this.gameState.specialItems.push(recipe.resultado);
            } else {
                this.gameState.craftedInks = this.gameState.craftedInks || {};
                this.gameState.craftedInks[recipe.resultado] = (this.gameState.craftedInks[recipe.resultado] || 0) + 1;
            }
            if (recipe.onCraft) onCraftActions = recipe.onCraft;
        }
        
        const ingredientsToRemove = recipe ? recipe.combinacao : failedIngredients;
        ingredientsToRemove.forEach(id => {
            if (this.gameState.craftingIngredients[id] > 0) {
                this.gameState.craftingIngredients[id]--;
            } else {
                const index = this.gameState.specialItems.indexOf(id);
                if (index > -1) {
                    this.gameState.specialItems.splice(index, 1);
                }
            }
        });
        
        this.saveGameState();
        if (onCraftActions.length > 0) {
            localStorage.setItem('onCraftActions', JSON.stringify(onCraftActions));
        }
        this.renderInventory();
    }

    setupAssemblyStation() {
        const playerItems = this.gameState.specialItems;
        const hasFrag1 = playerItems.includes('sigil_fragment_1');
        const hasFrag2 = playerItems.includes('sigil_fragment_2');
        const hasFrag3 = playerItems.includes('sigil_fragment_3');

        if (hasFrag1 && hasFrag2 && hasFrag3) {
            this.dom.assemblyFeedback.textContent = "Você possui todos os fragmentos do sigilo. Combine-os na estação de Alquimia para montá-lo.";
            const assemblyTab = document.querySelector('.station-tab[data-station="station-assembly"]');
            if(assemblyTab) assemblyTab.classList.add('notify');
        } else if (hasFrag1 || hasFrag2 || hasFrag3) {
            this.dom.assemblyFeedback.textContent = "Você possui fragmentos de um sigilo. Continue procurando para encontrar o resto.";
        } else {
            this.dom.assemblyFeedback.textContent = "Colete fragmentos de história para montá-los aqui.";
        }
    }

    setupResearchStation() {
        const updateCipher = () => {
            if (this.dom.cipherInput && this.dom.cipherShiftSlider) {
                const text = this.dom.cipherInput.value;
                const shift = parseInt(this.dom.cipherShiftSlider.value, 10);
                this.dom.shiftValueDisplay.textContent = shift;
                this.dom.cipherOutput.textContent = this._decodeCaesar(text, shift);
            }
        };
        this.dom.cipherInput?.addEventListener('input', updateCipher);
        this.dom.cipherShiftSlider?.addEventListener('input', updateCipher);
        updateCipher();
    }

    showFeedback(message, isError = false) {
        this.dom.craftResult.textContent = message;
        this.dom.craftResult.style.color = isError ? '#ff4d4d' : '#9f8';
        setTimeout(() => this.dom.craftResult.textContent = "", 3000);
    }
    
    _decodeCaesar(text, shift) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (char.match(/[a-z]/i)) {
                let code = text.charCodeAt(i);
                if ((code >= 65) && (code <= 90)) char = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                else if ((code >= 97) && (code <= 122)) char = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
            }
            result += char;
        }
        return result;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorkbenchManager();
});