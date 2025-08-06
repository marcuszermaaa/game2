/**
 * js/managers/journalManager.js
 * -----------------
 * VERSÃO FINAL COMPLETA E ROBUSTA - Contém todas as correções de bugs,
 * incluindo o carregamento seguro do estado e a renderização inteligente do inventário.
 * Este arquivo gerencia toda a lógica e a interface da tela do diário (journal.html).
 */

import { BESTIARY } from '../data/bestiaryData.js';
import { SIGILS } from '../data/sigilData.js';
import { ALL_EVENTS } from '../events.js';
import { UPGRADES } from '../data/upgradeData.js';
import { ELEMENTOS, ITENS_CRIADOS } from '../data/workbenchData.js';
import { SPECIAL_ITEMS } from '../data/specialItemData.js';
import { SigilAnimator } from './journalUIManager.js';
import { getPlayerVeilStatus } from '../data/veilStatusData.js';
import { CHARACTERS } from '../data/characterData.js';

export class JournalManager {
    constructor() {
        // Mapeia todos os elementos do DOM necessários para fácil acesso.
        this.dom = {
            todasAsCenas: document.querySelectorAll('.cena'),
            cenaSelecaoSigilos: document.getElementById('cena-selecao-sigilos'),
            btnSigilos: document.getElementById('btn-sigilos'),
            btnInventario: document.getElementById('btn-inventario'),
            btnVinculos: document.getElementById('btn-vinculos'),
            sigiloAtivoImg: document.getElementById('sigilo-ativo-img'),
            sigiloAtivoNome: document.getElementById('sigilo-ativo-nome'),
            barraSanidadeProgresso: document.querySelector('.barra-sanidade-progresso'),
            listaInventario: document.getElementById('lista-inventario'),
            sigilSelectionGrid: document.getElementById('sigil-selection-grid'),
            menuVinculos: document.querySelector('.menu-vinculos'),
            abasVinculos: document.querySelectorAll('.conteudo-vinculos-secao'),
            cronicasContainer: document.getElementById('vinculos-cronicas'),
            bestiarioLista: document.getElementById('bestiario-lista'),
            bestiarioDisplayImg: document.getElementById('bestiario-display-img'),
            bestiarioDisplayNome: document.getElementById('bestiario-display-nome'),
            bestiarioDisplayDesc: document.getElementById('bestiario-display-desc'),
            popupItemDetalhes: document.getElementById('popup-item-detalhes'),
            popupNomeItem: document.getElementById('popup-nome-item'),
            popupDescricaoItem: document.getElementById('popup-descricao-item'),
            popupSigilDetalhes: document.getElementById('popup-sigil-detalhes'),
            popupNomeSigil: document.getElementById('popup-nome-sigil'),
            popupDescricaoSigil: document.getElementById('popup-descricao-sigil'),
            btnVoltar: document.getElementById('back-to-game-btn'),
            veilStatusName: document.getElementById('veil-status-name'),
            cipherInput: document.getElementById('cipher-input'),
            cipherShiftSlider: document.getElementById('cipher-shift'),
            shiftValueDisplay: document.getElementById('shift-value'),
            cipherOutput: document.getElementById('cipher-output'),
        };
        // Estado local do gerenciador
        this.gameState = {};
        this.cenaAtivaId = null;
        this.tempSigilChoice = null;
        this.activeSigilAnimator = null;
        // Inicia o gerenciador
        this.init();
    }

    /**
     * Ponto de entrada: carrega os dados, renderiza a UI e vincula os eventos.
     */
    init() {
        this.loadGameState();
        this.renderAll();
        this.bindEvents();
        // Abre a última aba que o jogador estava usando para uma melhor experiência.
        const ultimaAbaAberta = this.gameState.lastJournalTab || 'cena-vinculos';
        this.mudarCena(ultimaAbaAberta);
    }

    /**
     * Carrega o estado do jogo do localStorage de forma segura.
     * Garante que todas as propriedades necessárias existam e tenham o tipo de dado correto
     * (ex: Set, Array, Object) para evitar erros de 'undefined' em outras funções.
     */
    loadGameState() {
        const savedData = localStorage.getItem('gameState');
        this.gameState = savedData ? JSON.parse(savedData) : {};

        // Garante que as propriedades existam e tenham um valor padrão, convertendo-as para os tipos corretos.
        this.gameState.sanity = this.gameState.sanity ?? 100;
        this.gameState.discoveredSigils = new Set(this.gameState.discoveredSigils || ['s01', 's04']);
        this.gameState.discoveredBeasts = new Set(this.gameState.discoveredBeasts || []);
        this.gameState.purchasedUpgrades = new Set(this.gameState.purchasedUpgrades || []);
        this.gameState.specialItems = this.gameState.specialItems || [];
        this.gameState.clientHistory = this.gameState.clientHistory || [];
        this.gameState.veilContactPoints = this.gameState.veilContactPoints || 0;
        // CORREÇÃO CRÍTICA: Garante que craftingIngredients seja sempre um objeto, nunca undefined.
        this.gameState.craftingIngredients = this.gameState.craftingIngredients || {}; 
        
        // Armazena a escolha de sigilo atual em uma variável temporária.
        this.tempSigilChoice = this.gameState.playerSigilChoice;
    }

    /**
     * Renderiza o inventário do jogador de forma inteligente.
     * Processa cada categoria de item (upgrades, ingredientes, itens especiais) separadamente
     * para evitar erros lógicos e de tipo.
     */
    renderInventory() {
        if (!this.dom.listaInventario) return;
        this.dom.listaInventario.innerHTML = '';

        // Função auxiliar para criar o elemento HTML de um item, evitando repetição de código.
        const createItemElement = (itemData, quantity = null) => {
            const li = document.createElement('li');
            li.className = 'item-inventario';
            li.dataset.nome = itemData.name || "Item Desconhecido";
            li.dataset.descricao = itemData.description || itemData.descricao || "Sem descrição.";
            
            let quantityText = quantity ? `<span class="item-quantity">(x${quantity})</span>` : '';
            const iconSrc = itemData.iconUrl || '/media/img/icons/placeholder.png'; // Ícone padrão
            
            li.innerHTML = `<img src="${iconSrc}" alt="${itemData.name}"><div class="item-info"><strong>${itemData.name}</strong></div>${quantityText}`;
            this.dom.listaInventario.appendChild(li);
        };

        let hasItems = false;

        // 1. Renderiza os Upgrades Permanentes
        this.gameState.purchasedUpgrades.forEach(upgradeId => {
            const itemData = UPGRADES[upgradeId];
            if (itemData) {
                createItemElement(itemData);
                hasItems = true;
            }
        });

        // 2. Renderiza os Ingredientes de Criação (com quantidade)
        Object.entries(this.gameState.craftingIngredients).forEach(([ingredientId, quantity]) => {
            if (quantity > 0) {
                // Busca o ingrediente nos dados de Elementos ou Itens Criados
                const itemData = ELEMENTOS[ingredientId] || ITENS_CRIADOS[ingredientId];
                if (itemData) {
                    // Passa o nome formatado e os dados do item, junto com a quantidade.
                    createItemElement({ name: itemData.name || this._formatName(ingredientId), ...itemData }, quantity);
                    hasItems = true;
                }
            }
        });

        // 3. Renderiza os Itens Especiais/de História
        this.gameState.specialItems.forEach(itemId => {
            const itemData = SPECIAL_ITEMS[itemId];
            if (itemData) {
                createItemElement(itemData);
                hasItems = true;
            }
        });

        // Se, após verificar todas as categorias, nenhum item foi adicionado, exibe a mensagem de vazio.
        if (!hasItems) {
            this.dom.listaInventario.innerHTML = '<li>Inventário vazio.</li>';
        }
    }
    
    /**
     * Salva o estado atual (incluindo a escolha de sigilo) e retorna para a tela do jogo.
     */
    saveAndExit() {
        // Atualiza a escolha principal do jogador com a escolha temporária feita nesta tela.
        this.gameState.playerSigilChoice = this.tempSigilChoice;
        // Prepara o estado para ser salvo, convertendo Sets para Arrays para compatibilidade com JSON.
        const stateToSave = { 
            ...this.gameState, 
            lastJournalTab: this.cenaAtivaId, 
            discoveredSigils: Array.from(this.gameState.discoveredSigils), 
            discoveredBeasts: Array.from(this.gameState.discoveredBeasts), 
            purchasedUpgrades: Array.from(this.gameState.purchasedUpgrades) 
        };
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
        window.location.href = '/game.html';
    }

    // --- Funções de Renderização da UI ---

    renderAll() {
        this.renderSanityBar();
        this.renderActiveSigil();
        this.renderInventory();
        this.renderBestiary();
        this.renderCronicas();
        this.renderVeilStatus();
    }

    mudarCena(idDaCenaParaMostrar) {
        if (idDaCenaParaMostrar === this.cenaAtivaId) idDaCenaParaMostrar = null;
        this.dom.todasAsCenas.forEach(cena => cena.classList.toggle('hidden', cena.id !== idDaCenaParaMostrar));
        const botoesNav = [this.dom.btnInventario, this.dom.btnSigilos, this.dom.btnVinculos];
        botoesNav.forEach(btn => {
            const cenaCorrespondente = `cena-${btn.id.split('-')[1]}`;
            btn.classList.toggle('active', cenaCorrespondente === idDaCenaParaMostrar);
        });
        this.cenaAtivaId = idDaCenaParaMostrar;
        this.gameState.lastJournalTab = this.cenaAtivaId;
        if (idDaCenaParaMostrar === 'cena-selecao-sigilos') this.renderSigilSelection();
    }

    renderSanityBar() {
        const sanidadePercentual = Math.max(0, Math.min(100, this.gameState.sanity));
        if(this.dom.barraSanidadeProgresso) this.dom.barraSanidadeProgresso.style.width = `${sanidadePercentual}%`;
    }

    renderActiveSigil() { this.updateSigilDisplay(this.gameState.playerSigilChoice); }
    renderTempActiveSigil() { this.updateSigilDisplay(this.tempSigilChoice); }
    
    updateSigilDisplay(sigilId) {
        if (this.activeSigilAnimator) this.activeSigilAnimator.destroy();
        const sigilData = SIGILS[sigilId];
        const displayDiv = this.dom.sigiloAtivoImg;
        if (!this.dom.sigiloAtivoNome || !displayDiv) return;
        displayDiv.innerHTML = '';
        if (sigilData) {
            this.dom.sigiloAtivoNome.textContent = sigilData.name;
            const canvas = document.createElement('canvas');
            displayDiv.appendChild(canvas);
            this.activeSigilAnimator = new SigilAnimator(canvas, sigilData, { padding: 10 });
        } else {
            this.dom.sigiloAtivoNome.textContent = "Nenhum Sigilo";
        }
    }
    
    renderSigilSelection() {
        if(!this.dom.sigilSelectionGrid) return;
        this.dom.sigilSelectionGrid.innerHTML = '';
        const discoveredSigils = Array.from(this.gameState.discoveredSigils);
        discoveredSigils.forEach(sigilId => {
            const sigilData = SIGILS[sigilId];
            if (sigilData) {
                const sigilBox = document.createElement('div');
                sigilBox.className = 'box-selecao-sigilo';
                sigilBox.dataset.sigilId = sigilData.id;
                sigilBox.classList.toggle('selected', sigilData.id === this.tempSigilChoice);
                const canvas = document.createElement('canvas');
                const title = document.createElement('h3');
                title.textContent = sigilData.name;
                sigilBox.innerHTML = `<div class="sigil-drawing-area"></div><h3>${sigilData.name}</h3>`;
                sigilBox.querySelector('.sigil-drawing-area').appendChild(canvas);
                this.dom.sigilSelectionGrid.appendChild(sigilBox);
                new SigilAnimator(canvas, sigilData);
            }
        });
    }

    renderBestiary() {
        if(!this.dom.bestiarioLista) return;
        this.dom.bestiarioLista.innerHTML = '';
        const discoveredBeasts = Array.from(this.gameState.discoveredBeasts);
        if (discoveredBeasts.length === 0) { this.dom.bestiarioLista.innerHTML = '<p>Nenhuma criatura catalogada.</p>'; return; }
        discoveredBeasts.forEach(beastId => {
            const beastData = BESTIARY[beastId];
            if (beastData) {
                const div = document.createElement('div');
                div.className = 'bestiario-menu-item';
                div.dataset.nome = beastData.name;
                div.dataset.descricao = beastData.description;
                div.dataset.imagemGrande = beastData.imageUrl;
                div.innerHTML = `<img src="${beastData.imageUrl}" alt="${beastData.name}"> <div><strong>${beastData.name}</strong></div>`;
                this.dom.bestiarioLista.appendChild(div);
            }
        });
    }

    renderCronicas() {
        if(!this.dom.cronicasContainer) return;
        this.dom.cronicasContainer.innerHTML = '';
        const history = this.gameState.clientHistory;
        if (history.length === 0) { this.dom.cronicasContainer.innerHTML = '<p>Nenhum registro de encontros importantes.</p>'; return; }
        const characterProfiles = {};
        history.forEach(entry => {
            const eventData = ALL_EVENTS.find(e => e.id === entry.clientId);
            if (eventData && eventData.characterId) {
                const charId = eventData.characterId;
                const characterData = CHARACTERS[charId];
                if (!characterData) return;
                if (!characterProfiles[charId]) characterProfiles[charId] = { name: characterData.name, description: characterData.chronicleDescription, entries: [] };
                characterProfiles[charId].entries.push(entry);
            }
        });
        Object.values(characterProfiles).forEach(profile => {
            const profileDiv = document.createElement('div');
            profileDiv.className = 'chronicle-character-profile';
            const status = this._calculateRelationshipStatus(profile);
            let entriesHTML = profile.entries.length > 0 ? `<details><summary>Ver encontros (${profile.entries.length})</summary><ul>${profile.entries.map(e => `<li><strong>Dia ${e.day}:</strong> <em>"${e.outcome || 'Interação'}"</em></li>`).join('')}</ul></details>` : '';
            profileDiv.innerHTML = `<div class="profile-header"><h3>${profile.name}</h3><span class="relationship-status ${status.class}">${status.text}</span></div><p class="profile-description"><em>${profile.description}</em></p>${entriesHTML}`;
            this.dom.cronicasContainer.appendChild(profileDiv);
        });
    }

    renderVeilStatus() {
        if (!this.dom.veilStatusName) return;
        const status = getPlayerVeilStatus(this.gameState.veilContactPoints);
        if (status) this.dom.veilStatusName.textContent = status.name;
    }
    
    // --- Vinculação de Eventos e Funções Utilitárias ---

    bindEvents() {
        this.dom.btnInventario.addEventListener('click', () => this.mudarCena('cena-inventario'));
        this.dom.btnVinculos.addEventListener('click', () => this.mudarCena('cena-vinculos'));
        this.dom.btnSigilos.addEventListener('click', () => this.mudarCena('cena-selecao-sigilos'));
        this.dom.btnVoltar.addEventListener('click', () => this.saveAndExit());

        if (this.dom.listaInventario) {
            this.dom.listaInventario.addEventListener('mouseover', e => {
                const item = e.target.closest('.item-inventario');
                if (item) {
                    this.dom.popupNomeItem.textContent = item.dataset.nome;
                    this.dom.popupDescricaoItem.textContent = item.dataset.descricao;
                    this.dom.popupItemDetalhes.classList.remove('hidden');
                }
            });
            this.dom.listaInventario.addEventListener('mouseout', () => this.dom.popupItemDetalhes.classList.add('hidden'));
        }

        if (this.dom.sigilSelectionGrid) {
            this.dom.sigilSelectionGrid.addEventListener('mouseover', e => {
                const sigilBox = e.target.closest('.box-selecao-sigilo');
                if (sigilBox) {
                    const sigilData = SIGILS[sigilBox.dataset.sigilId];
                    if (sigilData) {
                        this.dom.popupNomeSigil.textContent = sigilData.name;
                        this.dom.popupDescricaoSigil.textContent = sigilData.lore;
                        this.dom.popupSigilDetalhes.classList.remove('hidden');
                    }
                }
            });
            this.dom.sigilSelectionGrid.addEventListener('mouseout', () => this.dom.popupSigilDetalhes.classList.add('hidden'));
            this.dom.sigilSelectionGrid.addEventListener('click', e => {
                const sigilBox = e.target.closest('.box-selecao-sigilo');
                if(sigilBox) {
                    this.tempSigilChoice = sigilBox.dataset.sigilId;
                    this.renderTempActiveSigil();
                    this.renderSigilSelection();
                }
            });
        }

        if (this.dom.menuVinculos) {
            this.dom.menuVinculos.addEventListener('click', e => {
                if (e.target.tagName === 'P' && e.target.dataset.alvo) {
                    const alvoId = e.target.dataset.alvo;
                    this.dom.menuVinculos.querySelectorAll('p').forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    this.dom.abasVinculos.forEach(secao => secao.classList.toggle('hidden', secao.id !== alvoId));
                }
            });
        }
        
        if (this.dom.bestiarioLista) {
            this.dom.bestiarioLista.addEventListener('click', e => {
                const menuItem = e.target.closest('.bestiario-menu-item');
                if(menuItem) {
                    this.dom.bestiarioDisplayNome.textContent = menuItem.dataset.nome;
                    this.dom.bestiarioDisplayDesc.textContent = menuItem.dataset.descricao;
                    this.dom.bestiarioDisplayImg.src = menuItem.dataset.imagemGrande;
                    this.dom.bestiarioLista.querySelectorAll('.active').forEach(i => i.classList.remove('active'));
                    menuItem.classList.add('active');
                }
            });
        }
        
        if (this.dom.cipherInput && this.dom.cipherShiftSlider) {
            const updateCipher = () => {
                const text = this.dom.cipherInput.value;
                const shift = parseInt(this.dom.cipherShiftSlider.value, 10);
                this.dom.shiftValueDisplay.textContent = shift;
                this.dom.cipherOutput.textContent = this._decodeCaesar(text, shift);
            };
            this.dom.cipherInput.addEventListener('input', updateCipher);
            this.dom.cipherShiftSlider.addEventListener('input', updateCipher);
            updateCipher();
        }
    }
    
    _calculateRelationshipStatus(profile) {
        let score = 0;
        profile.entries.forEach(entry => {
            switch(entry.outcome) {
                case 'success': score += 5; break;
                case 'fail_minigame': score -= 5; break;
                case 'wrong_sigil': score -= 10; break;
                case 'accept_corrupted': score -= 15; break;
            }
        });
        score += Math.floor((this.gameState.veilContactPoints || 0) / 10);
        if (score > 15) return { text: 'Grato', class: 'status-good' };
        if (score > 5) return { text: 'Confiante', class: 'status-good' };
        if (score > -5) return { text: 'Neutro', class: 'status-neutral' };
        if (score > -15) return { text: 'Desconfiado', class: 'status-bad' };
        return { text: 'Assustado', class: 'status-terrible' };
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

    _formatName(name) {
        if (!name) return '';
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
}