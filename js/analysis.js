/**
 * js/analysis.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - Recebe os dados do evento diretamente
 * do GameManager, eliminando a lógica de recálculo e corrigindo o erro
 * "Dados do evento ou sigilo não encontrados".
 */

// A única importação necessária agora são os dados dos Sigilos.
import { SIGILS } from './data/sigilData.js';

class AnalysisMinigame {
    constructor() {
        this.dom = {
            canvas: document.getElementById('sigil-canvas'),
            notesContent: document.getElementById('notes-content'),
            decisionPanel: document.getElementById('decision-panel'),
            toolPanel: document.getElementById('tool-panel'),
            displayArea: document.getElementById('sigil-display-area'),
        };
        this.ctx = this.dom.canvas.getContext('2d');
        this.eventData = null;
        this.sigilData = null;
        this.gameState = null;
        this.init();
    }

    init() {
        this.loadGameState();
        // A lógica antiga foi substituída por esta função direta e confiável.
        this.loadDataFromStorage(); 

        if (this.eventData && this.sigilData) {
            window.addEventListener('resize', () => this.resizeAndDraw());
            this.resizeAndDraw();
            this.setupTools();
            this.setupDecisionPanel();
        } else {
            // Se, mesmo assim, algo falhar, a mensagem de erro ainda funciona.
            this.dom.notesContent.innerHTML = `<p class="error-text">ERRO: Dados do evento ou sigilo não encontrados.</p>`;
            console.error("Analysis Error: Não foi possível carregar eventData ou sigilData.", { event: this.eventData, sigil: this.sigilData });
            setTimeout(() => window.location.href = '/game.html', 3000);
        }
    }

    loadGameState() {
        const stateJSON = localStorage.getItem('gameState');
        if (stateJSON) {
            this.gameState = JSON.parse(stateJSON);
            this.gameState.purchasedUpgrades = new Set(this.gameState.purchasedUpgrades || []);
        }
    }

    /**
     * Carrega os dados do evento diretamente da "caixa de correio" temporária
     * criada pelo gameCore.js no localStorage.
     */
    loadDataFromStorage() {
        const eventJSON = localStorage.getItem('currentAnalysisEvent');
        if (!eventJSON) {
            console.error("Analysis Error: 'currentAnalysisEvent' não encontrado no localStorage.");
            return;
        }

        // Limpa a chave temporária imediatamente para não deixar lixo para trás.
        localStorage.removeItem('currentAnalysisEvent');

        try {
            this.eventData = JSON.parse(eventJSON);
            if (this.eventData && this.eventData.request) {
                this.sigilData = SIGILS[this.eventData.request];
            }
        } catch (e) {
            console.error("Falha ao analisar os dados do evento do localStorage.", e);
        }
    }
    
    // NENHUMA MUDANÇA NECESSÁRIA NAS FUNÇÕES ABAIXO
    // Elas já funcionam corretamente com os dados carregados.

    resizeAndDraw() {
        if (!this.dom.displayArea) return;
        this.dom.canvas.width = this.dom.displayArea.offsetWidth;
        this.dom.canvas.height = this.dom.displayArea.offsetHeight;
        this.drawSigil();
    }

    drawSigil() {
        if (!this.sigilData) return;
        const w = this.dom.canvas.width, h = this.dom.canvas.height;
        const getX = c => c * w, getY = c => c * h;
        const nodes = [this.sigilData.startNode, ...this.sigilData.segments.map(s => s.end)].filter(Boolean);
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.strokeStyle = '#2a2421';
        this.ctx.lineWidth = 3;
        this.sigilData.segments.forEach((seg, index) => {
            const startNode = nodes[index];
            if (!startNode || !seg.end) return;
            this.ctx.beginPath();
            this.ctx.moveTo(getX(startNode.x), getY(startNode.y));
            if (seg.type === 'curve' && seg.control) {
                this.ctx.quadraticCurveTo(getX(seg.control.x), getY(seg.control.y), getX(seg.end.x), getY(seg.end.y));
            } else {
                this.ctx.lineTo(getX(seg.end.x), getY(seg.end.y));
            }
            this.ctx.stroke();
        });
    }

    setupTools(){if(this.gameState.purchasedUpgrades.has("lupa_analise")){const e=document.createElement("button");e.id="lupa-tool-btn";e.textContent="Usar Lupa de Análise";this.dom.toolPanel.appendChild(e);e.addEventListener("click",()=>{this.lupaActive=!this.lupaActive;e.classList.toggle("active",this.lupaActive);this.dom.displayArea.classList.toggle("lupa-active",this.lupaActive);this.lupaActive?(this.revealInstabilityPoints(),e.textContent="Lupa Ativa"):(this.removeInstabilityPoints(),e.textContent="Usar Lupa de Análise")},{once:!0})}}
    
    revealInstabilityPoints(){this.removeInstabilityPoints();if(!this.sigilData.instabilityPoints)return;const e=this.dom.displayArea.offsetWidth,t=this.dom.displayArea.offsetHeight,i=s=>s*e,a=s=>s*t;this.sigilData.instabilityPoints.forEach((s,l)=>{const n=document.createElement("div");n.className="instability-hotspot";n.style.left=`${i(s.x)}px`;n.style.top=`${a(s.y)}px`;n.addEventListener("click",()=>{const e=document.createElement("p");e.className="journal-entry";e.innerHTML=`<strong>Anomalia #${l+1}:</strong> "${s.note}"`;this.dom.notesContent.querySelector(".placeholder")?.remove();this.dom.notesContent.appendChild(e);n.style.display="none"});this.dom.displayArea.appendChild(n)})}
    
    removeInstabilityPoints(){this.dom.displayArea.querySelectorAll(".instability-hotspot").forEach(e=>e.remove())}
    
    setupDecisionPanel(){this.dom.decisionPanel.classList.remove("hidden");let e="";"Corrupted"===this.sigilData.type?(e+='<button data-choice="correct">Corrigir o Sigilo</button>',e+='<button data-choice="accept_corrupted" class="danger">Tatuar como Está</button>'):"Prohibited"===this.sigilData.type&&(e+='<button data-choice="accept_prohibited" class="danger">Aceitar o Pedido Proibido</button>');e+='<button data-choice="refuse">Recusar o Trabalho</button>';this.dom.decisionPanel.innerHTML=e;this.dom.decisionPanel.addEventListener("click",e=>{e.target.tagName==="BUTTON"&&e.target.dataset.choice&&this.makeDecision(e.target.dataset.choice)})}
    
    makeDecision(choice) {
        if (!this.gameState) return;
        let fullGameState = JSON.parse(localStorage.getItem('gameState') || '{}');
        fullGameState.analysisChoice = choice;
        localStorage.setItem('gameState', JSON.stringify(fullGameState));
        window.location.href = '/game.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnalysisMinigame();
});