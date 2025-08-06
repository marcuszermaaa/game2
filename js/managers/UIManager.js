/**
 * js/managers/UIManager.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O Rosto e as Mãos do Jogo
 * Este arquivo gerencia toda a interface do usuário na tela principal (game.html).
 * Ele lê o estado do jogo (gameState) para exibir informações e envia as interações
 * do jogador de volta para o GameManager. Ele NUNCA modifica o estado do jogo diretamente.
 */

import { CLIENTS_PER_DAY } from '../constants.js';

export class UIManager {
    constructor(domRefs, gameState, gameInstance) {
        // Armazena referências para os elementos do DOM, o estado do jogo e a instância principal do GameManager.
        this.dom = domRefs;
        this.gameState = gameState;
        this.game = gameInstance;
        
        // Referências específicas para os sprites dos personagens, para permitir o cross-fade.
        this.dom.characterPanel = document.getElementById('character-panel');
        this.dom.spriteA = document.getElementById('character-sprite-a');
        this.dom.spriteB = document.getElementById('character-sprite-b');
        this.dom.infoPanelWrapper = document.querySelector('.info-panel-visual-wrapper');
        
        this.activeSprite = null;
        this.typewriterInterval = null;
    }
    
    /**
     * Função de utilidade interna para criar um efeito de máquina de escrever.
     * @param {HTMLElement} element - O elemento onde o texto será escrito.
     * @param {string} text - O texto a ser exibido.
     * @param {number} speed - A velocidade da digitação em milissegundos.
     */
    _typewriteText(element, text, speed = 35) {
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        if (!element) return;
        element.textContent = '';
        let i = 0;
        this.typewriterInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typewriterInterval);
            }
        }, speed);
    }

    /**
     * Função de utilidade interna para trocar o sprite do personagem com um efeito de fade.
     * @param {string} imageUrl - A URL da imagem do novo personagem.
     */
    _setSpriteWithCrossFade(imageUrl) {
        const newSprite = (this.activeSprite === this.dom.spriteA) ? this.dom.spriteB : this.dom.spriteA;
        if (newSprite) {
            newSprite.style.backgroundImage = `url('${imageUrl}')`;
            newSprite.style.display = 'block';
            newSprite.style.opacity = '1';
        }
        if (this.activeSprite) {
            this.activeSprite.style.opacity = '0';
        }
        this.activeSprite = newSprite;
    }

    /**
     * Exibe uma sequência de diálogos narrativos, um de cada vez.
     * @param {object} characterData - Dados do personagem e da sequência de diálogo.
     * @param {function} onSequenceComplete - Callback a ser executado quando a sequência terminar.
     */
    displayNarrativeSequence(characterData, onSequenceComplete) {
        this.hideInfoPanel();
        if (!characterData || !characterData.narrativeSequence) {
            onSequenceComplete?.();
            return;
        }
        let currentStageIndex = 0;
        const sequence = characterData.narrativeSequence;
        const showStage = (index) => {
            if (index >= sequence.length) {
                onSequenceComplete?.();
                return;
            }
            const stage = sequence[index];
            const portraitUrl = characterData.portraitUrls?.[stage.portraitIndex] || characterData.portraitUrls?.[0];
            if(portraitUrl) this.updateCharacterSprite({ portraitUrls: [portraitUrl] });
            else this.hideCharacterSprite();
            this._typewriteText(this.dom.eventDialogue, `'${stage.text}'`);
            if (this.dom.actionPanel) {
                this.dom.actionPanel.innerHTML = `<button id="narrative-continue-btn">Continuar</button>`;
                document.getElementById('narrative-continue-btn').addEventListener('click', () => showStage(index + 1), { once: true });
            }
        };
        this.clearActionPanel();
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = characterData.name;
        showStage(0);
    }

    /**
     * Atualiza elementos centrais da UI, como o indicador de e-mail não lido.
     * @param {boolean} hasUnreadMail - Se há ou não e-mails não lidos.
     */
    updateCoreUIElements(hasUnreadMail) {
        if(hasUnreadMail) this.dom.itemMail?.classList.add('highlight-pulse');
        else this.dom.itemMail?.classList.remove('highlight-pulse');
        this.updateStats();
    }
    
    /**
     * Define o retrato do personagem atual na tela.
     * @param {object} client - O objeto do cliente/evento atual.
     */
    updateCharacterSprite(client) {
        const shouldShow = client?.portraitUrls?.length > 0;
        if (shouldShow) {
            if (this.dom.characterPanel) this.dom.characterPanel.style.visibility = 'visible';
            this._setSpriteWithCrossFade(client.portraitUrls[0]);
        } else {
            this.hideCharacterSprite();
        }
    }

    /**
     * Esconde o painel do personagem.
     */
    hideCharacterSprite() {
        if (this.dom.characterPanel) this.dom.characterPanel.style.visibility = 'hidden';
        if (this.activeSprite) this.activeSprite.style.opacity = '0';
        this.activeSprite = null;
    }

    /**
     * Exibe o painel de informações da direita com conteúdo dinâmico.
     * @param {object} config - Configuração para o painel (título, botão, callback).
     */
    showInfoPanel(config) {
        const panel = this.dom.infoPanel;
        if (!panel || !this.dom.infoPanelWrapper) return;
        let contentHTML = '';
        if (config.title) contentHTML += `<h4 class="info-panel-title">${config.title}</h4>`;
        if (config.button) {
             const isDisabled = config.button.disabled ? 'disabled' : '';
             contentHTML += `<button id="${config.button.id}" ${isDisabled}>${config.button.text}</button>`;
        }
        panel.innerHTML = contentHTML;
        const buttonElement = panel.querySelector('button');
        if (buttonElement && config.button.callback && !buttonElement.disabled) {
            buttonElement.addEventListener('click', () => { this.hideInfoPanel(); config.button.callback(); }, { once: true });
        }
        this.dom.infoPanelWrapper.classList.add('visible');
    }

    /**
     * Esconde o painel de informações da direita.
     */
    hideInfoPanel() {
        this.dom.infoPanelWrapper?.classList.remove('visible'); 
    }
    
    /**
     * Ativa o efeito de pulsação em um ícone específico da barra de menu,
     * desativando qualquer outro que estivesse piscando. Essencial para guiar o jogador.
     * @param {string} elementId - O ID do elemento a ser destacado (ex: 'item-book', 'item-workbench').
     */
    highlightMenuItem(elementId) {
        // Primeiro, remove o destaque de todos os itens do menu para evitar múltiplos pulsos.
        this.dom.itemMail?.classList.remove('highlight-pulse');
        this.dom.itemBook?.classList.remove('highlight-pulse');
        this.dom.itemWorkbench?.classList.remove('highlight-pulse');

        // Em seguida, encontra o elemento alvo pelo ID que foi passado.
        const targetElement = document.getElementById(elementId);
        
        // Se o elemento existir, adiciona a classe que ativa a animação CSS.
        if (targetElement) {
            targetElement.classList.add('highlight-pulse');
        }
    }

    /**
     * Prepara a interface para a chegada de um novo cliente.
     */
    resetClientInterface() {
        const client = this.game.getCurrentClient();
        if (!client) {
            this.hideCharacterSprite();
            if (this.dom.eventClientName) this.dom.eventClientName.textContent = "";
            if (this.dom.eventDialogue) this.dom.eventDialogue.textContent = "Aguardando...";
            return;
        }
        this.hideInfoPanel(); 
        if (this.dom.dialogueInteractionPanel) this.dom.dialogueInteractionPanel.style.display = 'none';
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = client.name;
        let initialText = client.problem || "O cliente o encara, esperando.";
        this._typewriteText(this.dom.eventDialogue, `'${initialText}'`);
        this.updateCharacterSprite(client);
    }
    
    /**
     * Exibe a tela de início de dia (estado de "hub").
     * @param {function} startCallback - Função a ser chamada quando o jogador decide iniciar o atendimento.
     * @param {object} pendingTasks - Informações sobre tarefas pendentes (ex: e-mails).
     * @param {boolean} canProceed - Se o jogador pode ou não prosseguir.
     */
    showStartDayView(startCallback, pendingTasks, canProceed) {
        this.clearActionPanel();
        if (this.dom.dialogueInteractionPanel) this.dom.dialogueInteractionPanel.style.display = 'none';
        this.hideCharacterSprite();
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = "Um Novo Dia";
        let summaryText = "As brumas da manhã se dissipam. ";
        if (pendingTasks.unreadMailCount > 0) {
            summaryText += `Você nota ${pendingTasks.unreadMailCount} nova(s) correspondência(s).`;
            this.highlightMenuItem('item-mail');
        }
        if (!canProceed) summaryText += "\n\nVocê deve verificar suas pendências antes de iniciar o atendimento.";
        else if(pendingTasks.unreadMailCount === 0) summaryText = "Um silêncio tranquilo paira sobre o estúdio. O sino da porta está prestes a tocar...";
        this._typewriteText(this.dom.eventDialogue, summaryText);
        this.showInfoPanel({ title: 'Aguardando Cliente', button: { id: 'attend-client-btn', text: 'Iniciar Atendimento', callback: startCallback, disabled: !canProceed } });
    }

    /**
     * Exibe uma tela de resultado/resumo, incluindo uma lista de itens desbloqueados.
     * @param {string} title - O título principal da tela.
     * @param {string} text - O texto descritivo do resultado.
     * @param {function} nextActionCallback - A função a ser chamada quando o botão "Próximo" for clicado.
     * @param {Array<object>} unlocks - (Opcional) Uma lista de objetos representando novidades.
     */
    showOutcomeView(title, text, nextActionCallback, unlocks = []) {
        this.hideCharacterSprite();
        this.clearActionPanel();
        if (this.dom.dialogueInteractionPanel) this.dom.dialogueInteractionPanel.style.display = 'none';
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = title;

        let contentHTML = `<p>${text}</p>`;

        if (unlocks.length > 0) {
            contentHTML += `<div class="outcome-unlocks-container"><h4>Novidades Descobertas:</h4><ul class="unlocks-list">`;
            unlocks.forEach(unlock => {
                const icon = unlock.type === 'Tomo' ? '📖' : (unlock.type === 'Sigilo' ? '🌀' : (unlock.type === 'Ingrediente' ? '🌿' : '✨'));
                contentHTML += `<li>${icon} ${unlock.type}: ${unlock.name}</li>`;
            });
            contentHTML += `</ul></div>`;
        }

        this._typewriteText(this.dom.eventDialogue, '');
        this.dom.eventDialogue.innerHTML = contentHTML;

        this.showInfoPanel({ title: 'Resultado', button: { id: 'next-action-btn', text: 'Próximo', callback: nextActionCallback } });
    }

    /**
     * Exibe um painel com múltiplas opções de escolha para o jogador.
     * @param {object} config - Configuração das opções (título, texto, botões, callbacks).
     */
    showMultiOptionPanel({ title, text, options }) {
        const panel = this.dom.infoPanel;
        if (!panel || !this.dom.infoPanelWrapper) return;
        this.clearActionPanel();
        let contentHTML = `<h4 class="info-panel-title">${title}</h4>`;
        if(text) contentHTML += `<p>${text}</p>`;
        if (options?.length > 0) {
            options.forEach((option, index) => {
                const styleClass = option.style === 'danger' ? 'btn-danger' : (option.style === 'cancel' ? 'btn-cancel' : '');
                contentHTML += `<button id="multi-option-btn-${index}" class="${styleClass}">${option.text}</button>`;
            });
        }
        panel.innerHTML = contentHTML;
        options.forEach((option, index) => {
            const buttonElement = panel.querySelector(`#multi-option-btn-${index}`);
            if (buttonElement && option.callback) {
                buttonElement.addEventListener('click', () => { this.hideInfoPanel(); option.callback(); }, { once: true });
            }
        });
        this.dom.infoPanelWrapper.classList.add('visible');
    }

    /**
     * Exibe uma tela de transição entre clientes.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} buttonText - O texto do botão para prosseguir.
     * @param {function} callback - Função a ser chamada ao clicar no botão.
     */
    showNextClientTransition(message, buttonText, callback) {
        this.hideCharacterSprite();
        this.clearActionPanel();
        if (this.dom.dialogueInteractionPanel) this.dom.dialogueInteractionPanel.style.display = 'none';
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = "Um Momento de Calma";
        this._typewriteText(this.dom.eventDialogue, message);
        this.showInfoPanel({ title: 'Aguardando...', button: { id: 'next-client-btn', text: buttonText, callback: callback } });
    }
    
    /**
     * A função mais inteligente da UI. Lê o estado do jogo e decide qual
     * botão de ação principal deve ser exibido.
     */
    updateActionButtonBasedOnState() {
        if (!this.dom.actionPanel) return;

        const client = this.game.getCurrentClient();
        let buttonConfig = null;
        
        // Remove qualquer destaque residual antes de decidir a nova ação.
        this.highlightMenuItem(null);

        if (!client || client.isNarrativeEvent) {
            buttonConfig = null;
        } else if (this.gameState.playerSigilChoice) {
            buttonConfig = { id: 'start-tattoo-btn', text: 'Iniciar Tatuagem', onClick: () => this.game.startMinigame() };
        } else if (client.request) {
            buttonConfig = { id: 'analyze-request-btn', text: 'Analisar o Pedido', onClick: () => this.game.startAnalysisProcess() };
        } else {
            buttonConfig = null;
            this._typewriteText(this.dom.eventDialogue, "O cliente descreve o que precisa... Devo consultar o diário para encontrar o sigilo correto.");
            this.highlightMenuItem('item-book');
        }
        
        this.clearActionPanel();
        if (buttonConfig) {
            this.dom.actionPanel.innerHTML = `<button id="${buttonConfig.id}">${buttonConfig.text}</button>`;
            document.getElementById(buttonConfig.id)?.addEventListener('click', buttonConfig.onClick);
        }
    }

    /**
     * Atualiza o HUD do jogador com os status atuais (dia, dinheiro, sanidade, etc.).
     */
    updateStats() {
        if(!this.gameState) return;
        this.dom.dayStat.textContent = `Dia: ${this.gameState.day}`;
        this.dom.moneyValue.textContent = this.gameState.money;
        this.dom.inkValue.textContent = this.gameState.inkCharges;
        if (this.dom.sanityProgressBar) {
            this.dom.sanityProgressBar.style.width = `${Math.max(0, (this.gameState.sanity / 100) * 100)}%`;
        }
        if (this.game && this.gameState.todaysAgenda) {
            const totalClientsForToday = this.gameState.todaysAgenda.length;
            this.dom.clientStat.textContent = `Cliente: ${this.gameState.clientInDay}/${totalClientsForToday}`;
        }
    }

    /**
     * Limpa o conteúdo do painel de ação.
     */
    clearActionPanel() {
        if (this.dom.actionPanel) this.dom.actionPanel.innerHTML = '';
    }

    /**
     * Exibe a tela de fim de jogo.
     * @param {string} reason - O motivo do fim de jogo.
     * @param {function} restartCallback - Função para reiniciar o jogo.
     */
    showEndGameView(reason, restartCallback) {
        this.hideCharacterSprite();
        this.clearActionPanel();
        this.hideInfoPanel();
        if (this.dom.eventClientName) this.dom.eventClientName.textContent = "Fim do Capítulo";
        this._typewriteText(this.dom.eventDialogue, reason);
        this.showInfoPanel({
            title: 'Fim de Jogo',
            button: { id: 'restart-btn', text: 'Jogar Novamente', callback: restartCallback }
        });
    }
}