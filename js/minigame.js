// js/minigame.js - VERSÃO COM VERIFICAÇÃO DE DADOS PARA PREVENIR CRASHES

import { SIGILS } from './data/sigilData.js';

class MasterMinigame {
    constructor(canvas, sigil, gameState, onComplete) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sigil = sigil;
        this.gameState = gameState;
        this.onComplete = onComplete;
        
        // Verificação de segurança crucial no início
        if (!this.sigil || !this.sigil.startNode || !this.sigil.segments) {
            console.error("ERRO FATAL: Os dados do sigilo carregado estão incompletos.", this.sigil);
            this.minigameState = 'FINISHED'; // Previne a inicialização
            this.onComplete({ success: false, error: 'bad_sigil_data' });
            return;
        }

        this.referenceCanvas = document.getElementById('sigil-reference-canvas');
        this.referenceCtx = this.referenceCanvas ? this.referenceCanvas.getContext('2d') : null;
        this.commentBox = document.getElementById('client-comment-box');
        this.toolsDisplay = document.getElementById('active-tools-display');

        this.tools = {
            decalque: this.gameState.purchasedUpgrades.has('decalque_arcano'),
            luminaria: this.gameState.purchasedUpgrades.has('luminaria_da_alma'),
            munhequeira: this.gameState.purchasedUpgrades.has('brace'),
        };

        this.isBloodTattoo = this.gameState.bloodTattooActive || false;
        this.activeSpecialInk = this.gameState.specialInkActive || null;
        if (this.gameState.bloodTattooActive) delete this.gameState.bloodTattooActive;
        if (this.gameState.specialInkActive) delete this.gameState.specialInkActive;
        
        this.mousePos = { x: -100, y: -100 };
        // Criação segura de nós, filtrando qualquer valor indefinido
        this.nodes = [this.sigil.startNode, ...this.sigil.segments.map(s => s.end)].filter(Boolean);
        this.minigameState = 'IDLE';
        this.currentSegmentIndex = 0;
        this.lockedSegments = [];
        this.tempControlPoint = null;
        this.isShaking = false;
        this.shakeIntensity = 10;
        this.bleedParticles = [];
        this.painEventsTriggered = 0;
        this.errorCount = 0; 
        this.totalErrorScore = 0;
        this.lastErrorTime = 0;
        this.gameState.recargasBorrifador = this.gameState.recargasBorrifador || 0;

        this.init();
    }

    init() {
        if (this.minigameState === 'FINISHED') return; // Não inicializa se os dados falharam

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
        
        this.renderToolsHUD();
        this.drawSigilReference();
        this.startAnimationLoop();
    }

    drawSigilReference() {
        if (!this.referenceCtx) return;
        const { nodes, sigil } = this;
        const w = this.referenceCanvas.width, h = this.referenceCanvas.height;
        const getX = c => c * w, getY = c => c * h;
        
        this.referenceCtx.fillStyle = '#f5eeda';
        this.referenceCtx.fillRect(0, 0, w, h);
        this.referenceCtx.strokeStyle = '#3a3a3a';
        this.referenceCtx.lineWidth = 2;
        sigil.segments.forEach((seg, index) => {
            const startNode = nodes[index];
            // Verificação de segurança dentro do loop
            if (!startNode || !seg.end) return; 
            
            this.referenceCtx.beginPath();
            this.referenceCtx.moveTo(getX(startNode.x), getY(startNode.y));
            if (seg.type === 'curve') this.referenceCtx.quadraticCurveTo(getX(seg.control.x), getY(seg.control.y), getX(seg.end.x), getY(seg.end.y));
            else this.referenceCtx.lineTo(getX(seg.end.x), getY(seg.end.y));
            this.referenceCtx.stroke();
        });
        this.referenceCtx.fillStyle = '#5c5c5c';
        nodes.forEach(node => {
            if (node) { // Garante que o nó existe antes de desenhar
                this.referenceCtx.beginPath();
                this.referenceCtx.arc(getX(node.x), getY(node.y), 3, 0, Math.PI * 2);
                this.referenceCtx.fill();
            }
        });
    }

    // O resto do arquivo (finish, startAnimationLoop, draw, etc.) permanece o mesmo da sua versão anterior
    // ... cole aqui o restante das funções da sua versão funcional ...
    // ... (handleMouseDown, handleMouseMove, etc.)
    finish(success) {
        if (this.minigameState === 'FINISHED') return;
        this.minigameState = 'FINISHED';
        window.removeEventListener('resize', this.resize);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);

        this.showClientComment(success ? "Perfeito... Sinto a energia fluindo." : "Não! Está tudo errado! O que você fez?!");
        setTimeout(() => {
            if (this.onComplete) {
                let method = this.isBloodTattoo ? 'blood' : (this.activeSpecialInk || 'normal');
                this.onComplete({ success: success, painEvents: this.painEventsTriggered, method: method, accuracy: this.totalErrorScore });
            }
        }, 3000);
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.minigameState === 'FINISHED') return;
            this.update(); this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }

    triggerPainEvent(segment) {
        if (this.gameState.purchasedUpgrades.has('borrifador_base') && this.gameState.recargasBorrifador > 0) {
            this.gameState.recargasBorrifador--; this.renderToolsHUD(); 
            this.showClientComment("Ufa... essa foi por pouco. O borrifador ajudou.");
            return;
        }
        this.painEventsTriggered++;
        this.shakeIntensity = this.isBloodTattoo ? 25 : 10;
        this.showClientComment(this.isBloodTattoo ? "O SANGUE! QUEIMA COMO O PRÓPRIO ABISSO!" : (segment.dialogue || "A agulha rasga a pele!"));
        this.isShaking = true;
        setTimeout(() => { this.isShaking = false; }, this.isBloodTattoo ? 1200 : 700);
        this.createBleedEffect(this.nodes[this.currentSegmentIndex + 1]);
    }

    showClientComment(text) {
        if (this.commentBox) {
            this.commentBox.textContent = text;
            this.commentBox.className = 'comment-box visible';
            setTimeout(() => { if(this.commentBox) this.commentBox.className = 'comment-box'; }, 2800);
        }
    }

    renderToolsHUD() {
        if (!this.toolsDisplay) return;
        this.toolsDisplay.innerHTML = '<h3>Ferramentas Ativas</h3>';
        if (this.tools.decalque) this.toolsDisplay.innerHTML += `<div class="tool-item active"><h4>Decalque Arcano</h4><p>Mostrando o caminho...</p></div>`;
        if (this.tools.luminaria) this.toolsDisplay.innerHTML += `<div class="tool-item active"><h4>Luminária da Alma</h4><p>Revelando os pontos...</p></div>`;
        if (this.tools.munhequeira) this.toolsDisplay.innerHTML += `<div class="tool-item active"><h4>Munhequeira de Firmeza</h4><p>Reduzindo o tremor.</p></div>`;
        if (this.gameState.purchasedUpgrades.has('borrifador_base')) {
            const recargas = this.gameState.recargasBorrifador || 0;
            this.toolsDisplay.innerHTML += `<div class="tool-item ${recargas > 0 ? 'active' : 'used'}"><h4>Borrifador de Lótus</h4><p>Recargas: ${recargas}</p></div>`;
        }
    }

    createBleedEffect(node) {
        const pos = { x: node.x * this.canvas.width, y: node.y * this.canvas.height };
        for (let i = 0; i < 20; i++) {
            this.bleedParticles.push({
                x: pos.x, y: pos.y, radius: Math.random() * 2 + 1, maxRadius: Math.random() * 6 + 6,
                life: 1.0, velocity: { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 }
            });
        }
    }

    update() {
        for (let i = this.bleedParticles.length - 1; i >= 0; i--) {
            const p = this.bleedParticles[i];
            p.life -= 0.008;
            if (p.life <= 0) { this.bleedParticles.splice(i, 1); continue; }
            p.x += p.velocity.x; p.y += p.velocity.y; p.radius = Math.min(p.maxRadius, p.radius + 0.1);
        }
    }
    
    draw() {
        const getX = c => c * this.canvas.width, getY = c => c * this.canvas.height;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        if (this.isShaking) {
            let intensity = this.tools.munhequeira ? this.shakeIntensity / 2 : this.shakeIntensity;
            this.ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
        }

        if (this.tools.decalque) {
            this.sigil.segments.forEach((seg, index) => {
                this.ctx.strokeStyle = 'rgba(50, 100, 255, 0.2)'; this.ctx.lineWidth = 3; this.ctx.beginPath();
                this.ctx.moveTo(getX(this.nodes[index].x), getY(this.nodes[index].y));
                if (seg.type === 'curve') this.ctx.quadraticCurveTo(getX(seg.control.x), getY(seg.control.y), getX(seg.end.x), getY(seg.end.y));
                else this.ctx.lineTo(getX(seg.end.x), getY(seg.end.y));
                this.ctx.stroke();
            });
        }
        
        this.lockedSegments.forEach(compSeg => {
            this.ctx.strokeStyle = this.isBloodTattoo ? '#6d1414' : (this.activeSpecialInk ? '#4a0e69' : '#16a085');
            this.ctx.lineWidth = 5; this.ctx.beginPath();
            this.ctx.moveTo(getX(this.nodes[compSeg.index].x), getY(this.nodes[compSeg.index].y));
            if (compSeg.type === 'curve') this.ctx.quadraticCurveTo(getX(compSeg.control.x), getY(compSeg.control.y), getX(this.nodes[compSeg.index + 1].x), getY(this.nodes[compSeg.index + 1].y));
            else this.ctx.lineTo(getX(this.nodes[compSeg.index + 1].x), getY(this.nodes[compSeg.index + 1].y));
            this.ctx.stroke();
        });

        if (['STRETCHING', 'BENDING', 'DRAGGING_CONTROL'].includes(this.minigameState)) {
            this.ctx.strokeStyle = this.isBloodTattoo ? '#a01c1c' : (this.activeSpecialInk ? '#8e44ad' : '#2ecc71');
            this.ctx.lineWidth = 4; this.ctx.beginPath();
            this.ctx.moveTo(getX(this.nodes[this.currentSegmentIndex].x), getY(this.nodes[this.currentSegmentIndex].y));
            if (this.minigameState === 'STRETCHING') this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
            else this.ctx.quadraticCurveTo(this.tempControlPoint.x, this.tempControlPoint.y, getX(this.nodes[this.currentSegmentIndex + 1].x), getY(this.nodes[this.currentSegmentIndex + 1].y));
            this.ctx.stroke();
        }

        this.nodes.forEach((node, index) => {
            if (index > this.currentSegmentIndex + 1 && !this.tools.decalque) return;
            this.ctx.beginPath(); this.ctx.arc(getX(node.x), getY(node.y), 12, 0, 2 * Math.PI);
            this.ctx.fillStyle = index < this.currentSegmentIndex ? '#16a085' : (index === this.currentSegmentIndex ? '#2980b9' : 'rgba(100, 95, 80, 0.5)');
            this.ctx.globalAlpha = index <= this.currentSegmentIndex + 1 ? 1.0 : 0.2; this.ctx.fill(); this.ctx.globalAlpha = 1.0;
            if (this.tools.luminaria || index <= this.currentSegmentIndex + 1) {
                this.ctx.font = `bold 13px 'Special Elite', cursive`; this.ctx.fillStyle = "#1a1a1a";
                this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
                this.ctx.fillText(index + 1, getX(node.x), getY(node.y));
            }
        });
        
        if (['BENDING', 'DRAGGING_CONTROL'].includes(this.minigameState)) {
            this.ctx.beginPath(); this.ctx.arc(this.tempControlPoint.x, this.tempControlPoint.y, 8, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.minigameState === 'DRAGGING_CONTROL' ? '#f39c12' : '#e67e22'; this.ctx.fill();
        }

        this.bleedParticles.forEach(p => {
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = `rgba(${this.isBloodTattoo ? '160, 28, 28' : '192, 57, 43'}, ${p.life})`; this.ctx.fill();
        });
        
        this.ctx.restore();
    }

    getMousePos(evt) { const rect = this.canvas.getBoundingClientRect(); return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }; }
    
    handleMouseDown(e) {
        const pos = this.getMousePos(e); const getX = c => c * this.canvas.width, getY = c => c * this.canvas.height;
        if (this.minigameState === 'IDLE' && this.currentSegmentIndex < this.nodes.length - 1) {
            if (Math.hypot(pos.x - getX(this.nodes[this.currentSegmentIndex].x), pos.y - getY(this.nodes[this.currentSegmentIndex].y)) < 15) this.minigameState = 'STRETCHING';
        } else if (this.minigameState === 'BENDING') {
            if (Math.hypot(pos.x - this.tempControlPoint.x, pos.y - this.tempControlPoint.y) < 20) this.minigameState = 'DRAGGING_CONTROL';
        }
    }
    
    handleMouseMove(e) { this.mousePos = this.getMousePos(e); if (this.minigameState === 'DRAGGING_CONTROL') this.tempControlPoint = this.mousePos; }
    handleMouseLeave(e) { this.mousePos = { x: -200, y: -200 }; }

    handleMouseUp(e) {
        if (this.minigameState === 'FINISHED') return;
        const pos = this.getMousePos(e); const getX = c => c * this.canvas.width, getY = c => c * this.canvas.height;

        if (this.minigameState === 'STRETCHING') {
            const endNode = this.nodes[this.currentSegmentIndex + 1];
            if (Math.hypot(pos.x - getX(endNode.x), pos.y - getY(endNode.y)) > 15) {
                this.errorCount++; this.showClientComment(`Cuidado! Você errou a conexão. (${this.errorCount}/4)`);
                this.minigameState = 'IDLE'; if (this.errorCount >= 4) this.finish(false); return;
            }
            const segment = this.sigil.segments[this.currentSegmentIndex];
            if (segment.type === 'line') {
                this.lockedSegments.push({ type: 'line', index: this.currentSegmentIndex });
                if (segment.painEvent) this.triggerPainEvent(segment);
                this.currentSegmentIndex++; this.minigameState = 'IDLE';
            } else {
                const startNode = this.nodes[this.currentSegmentIndex];
                this.tempControlPoint = { x: (getX(startNode.x) + getX(endNode.x)) / 2, y: (getY(startNode.y) + getY(endNode.y)) / 2 };
                this.minigameState = 'BENDING';
            }
        } else if (this.minigameState === 'DRAGGING_CONTROL') {
            const segment = this.sigil.segments[this.currentSegmentIndex];
            if (Math.hypot(this.tempControlPoint.x - getX(segment.control.x), this.tempControlPoint.y - getY(segment.control.y)) > 50) {
                this.errorCount++; this.showClientComment(`Essa curva não está certa... Tente de novo. (${this.errorCount}/4)`);
                this.minigameState = 'BENDING'; if (this.errorCount >= 4) this.finish(false); return;
            }
            this.lockedSegments.push({ type: 'curve', index: this.currentSegmentIndex, control: { x: this.tempControlPoint.x / this.canvas.width, y: this.tempControlPoint.y / this.canvas.height } });
            if (segment.painEvent) this.triggerPainEvent(segment);
            this.currentSegmentIndex++; this.minigameState = 'IDLE';
        }
        if (this.currentSegmentIndex >= this.sigil.segments.length) this.finish(true);
    }
    
    resize() {
        const parent = this.canvas.parentElement; if (!parent) return;
        this.canvas.width = parent.clientWidth; this.canvas.height = parent.clientHeight;
        this.drawSigilReference();
    }
}

// PONTO DE ENTRADA ADAPTADO
document.addEventListener('DOMContentLoaded', () => {
    const isDebugMode = localStorage.getItem('debugModeEnabled') === 'true';

    let gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        gameState.purchasedUpgrades = new Set(Array.isArray(gameState.purchasedUpgrades) ? gameState.purchasedUpgrades : []);
    }

    const sigilId = gameState ? gameState.playerSigilChoice : null;
    const sigil = sigilId ? SIGILS[sigilId] : null;

    if (!gameState || !sigil) {
        alert("Erro ao carregar dados da tatuagem. Retornando ao jogo.");
        window.location.href = '/game.html';
        return;
    }

    const canvas = document.getElementById('tattoo-canvas');
    const onMinigameComplete = (result) => {
        let currentGameState = JSON.parse(localStorage.getItem('gameState'));
        currentGameState.lastOutcomeData = result; 
        localStorage.setItem('gameState', JSON.stringify(currentGameState));
        window.location.href = '/game.html';
    };

    const minigameInstance = new MasterMinigame(canvas, sigil, gameState, onMinigameComplete);

    if (isDebugMode) {
        const debugPanel = document.getElementById('minigame-debug-panel');
        if (debugPanel) {
            debugPanel.classList.remove('hidden');
            document.getElementById('debug-win-btn')?.addEventListener('click', () => minigameInstance.finish(true));
            document.getElementById('debug-lose-btn')?.addEventListener('click', () => minigameInstance.finish(false));
        }
    }
});