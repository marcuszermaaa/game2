/**
 * js/managers/FXManager.js
 * -----------------
 * A Caixa de Ferramentas de Horror
 * Este gerenciador contém as funções reutilizáveis para criar efeitos de glitch,
 * jumpscares e outros efeitos visuais/sonoros. Ele é chamado por outros
 * gerenciadores (como o gameCore ou pointClickManager) para executar os efeitos.
 */

export class FXManager {
    constructor() {
        // Pré-carrega sons, se necessário.
        this.sounds = {
            glitch: new Audio('/media/sfx/glitch.wav'),
            glass_crack: new Audio('/media/sfx/glass_crack.mp3'),
            jumpscare_minor: new Audio('/media/sfx/jumpscare_minor.wav'),
        };
    }

    /**
     * Corrompe um elemento de texto por um breve período.
     * @param {HTMLElement} element - O elemento de texto a ser corrompido.
     */
    glitchText(element) {
        if (!element) return;
        const originalText = element.textContent;
        // Simples substituição por símbolos aleatórios.
        element.textContent = "§≠±¥øπ... W̴H̷Y̶? ...¶∑å∂";
        this.sounds.glitch.play();
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 500); // 0.5 segundos de glitch
    }

    /**
     * Mostra uma imagem de susto em tela cheia por um instante.
     * @param {string} imageUrl - A URL da imagem do susto.
     * @param {number} duration - Quanto tempo a imagem fica na tela em milissegundos.
     */
    flashJumpscare(imageUrl, duration = 300) {
        const scareElement = document.createElement('div');
        scareElement.style.position = 'fixed';
        scareElement.style.top = '0';
        scareElement.style.left = '0';
        scareElement.style.width = '100vw';
        scareElement.style.height = '100vh';
        scareElement.style.backgroundImage = `url(${imageUrl})`;
        scareElement.style.backgroundSize = 'cover';
        scareElement.style.zIndex = '9999';
        scareElement.style.opacity = '1';
        
        document.body.appendChild(scareElement);
        this.sounds.jumpscare_minor.play();

        setTimeout(() => {
            scareElement.style.transition = 'opacity 0.2s';
            scareElement.style.opacity = '0';
            setTimeout(() => scareElement.remove(), 200);
        }, duration);
    }

    /**
     * Faz um retrato de personagem piscar para uma versão "glitchada".
     * @param {HTMLElement} characterSpriteElement - O elemento do sprite do personagem.
     * @param {string} glitchImageUrl - A URL da imagem corrompida.
     */
    glitchPortrait(characterSpriteElement, glitchImageUrl) {
        if (!characterSpriteElement) return;
        const originalImage = characterSpriteElement.style.backgroundImage;
        
        characterSpriteElement.style.backgroundImage = `url(${glitchImageUrl})`;
        this.sounds.glitch.play();

        setTimeout(() => {
            characterSpriteElement.style.backgroundImage = originalImage;
        }, 200); // 0.2 segundos de glitch
    }
}