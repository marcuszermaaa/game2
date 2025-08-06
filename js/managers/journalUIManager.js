// js/managers/journalUIManager.js - VERSÃO FINAL COMPATÍVEL COM DADOS "STRETCH & BEND"

export class SigilAnimator {
    constructor(canvas, sigilData, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sigilData = sigilData;
        this.options = options;

        // Validação de dados para prevenir crashes
        if (!sigilData || !sigilData.startNode || !sigilData.segments) {
            console.error("SigilAnimator: Dados do sigilo estão incompletos. Animação desativada.", sigilData);
            this.nodes = [];
            this.sigilData.segments = []; // Previne erros de desenho
        } else {
            this.nodes = [this.sigilData.startNode, ...this.sigilData.segments.map(s => s.end)].filter(Boolean);
        }

        this.isAnimating = false;
        this.currentSegmentIndex = 0;
        this.segmentProgress = 0;
        this.animationFrameId = null;
        this.lastTime = 0;
        this.ANIMATION_SPEED = 1.5; // Velocidade da animação (maior = mais rápido)

        this.startBound = this.start.bind(this);
        this.stopBound = this.stop.bind(this);

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.canvas.parentElement);

        this.canvas.addEventListener('mouseover', this.startBound);
        this.canvas.addEventListener('mouseout', this.stopBound);

        this.resize();
    }

    destroy() {
        this.stop();
        this.resizeObserver.disconnect();
        this.canvas.removeEventListener('mouseover', this.startBound);
        this.canvas.removeEventListener('mouseout', this.stopBound);
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.draw();
    }

    start() {
        if (this.isAnimating || this.nodes.length < 2) return;
        this.isAnimating = true;
        this.currentSegmentIndex = 0;
        this.segmentProgress = 0;
        this.lastTime = performance.now();
        this.animate();
    }

    stop() {
        this.isAnimating = false;
        cancelAnimationFrame(this.animationFrameId);
        this.draw();
    }

    animate(currentTime = performance.now()) {
        if (!this.isAnimating) return;
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Animação baseada no tempo, não em segmentos, para um fluxo constante
        this.segmentProgress += this.ANIMATION_SPEED * deltaTime;

        if (this.segmentProgress >= this.sigilData.segments.length) {
            this.segmentProgress = this.sigilData.segments.length;
            this.isAnimating = false;
        }
        
        this.draw();
        if (this.isAnimating) {
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        }
    }

    // Função que desenha o sigilo completo, estático
    _drawFullStaticSigil(strokeStyle, lineWidth) {
        const { ctx, sigilData, nodes } = this;
        const w = this.canvas.width, h = this.canvas.height;
        const getX = c => c * w, getY = c => c * h;
        
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        sigilData.segments.forEach((seg, index) => {
            const startNode = nodes[index];
            if (!startNode || !seg.end) return;

            ctx.beginPath();
            ctx.moveTo(getX(startNode.x), getY(startNode.y));
            if (seg.type === 'curve' && seg.control) {
                ctx.quadraticCurveTo(getX(seg.control.x), getY(seg.control.y), getX(seg.end.x), getY(seg.end.y));
            } else {
                ctx.lineTo(getX(seg.end.x), getY(seg.end.y));
            }
            ctx.stroke();
        });
    }

    draw() {
        if (!this.ctx || this.canvas.width === 0) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const w = this.canvas.width, h = this.canvas.height;
        const getX = c => c * w, getY = c => c * h;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // 1. Desenha o sigilo completo como um fundo cinza claro
        this._drawFullStaticSigil('rgba(200, 190, 170, 0.4)', 2);

        // 2. Se estiver animando, desenha a parte animada por cima
        if (this.isAnimating) {
            const segmentCount = this.sigilData.segments.length;
            const segmentsToDraw = this.segmentProgress;
            const currentSegmentIndex = Math.floor(segmentsToDraw);
            const progressInCurrentSegment = segmentsToDraw - currentSegmentIndex;

            this.ctx.strokeStyle = '#2ecc71';
            this.ctx.lineWidth = 4;

            // Desenha os segmentos já completados
            for (let i = 0; i < currentSegmentIndex; i++) {
                const seg = this.sigilData.segments[i];
                const startNode = this.nodes[i];
                this.ctx.beginPath();
                this.ctx.moveTo(getX(startNode.x), getY(startNode.y));
                if (seg.type === 'curve') {
                    this.ctx.quadraticCurveTo(getX(seg.control.x), getY(seg.control.y), getX(seg.end.x), getY(seg.end.y));
                } else {
                    this.ctx.lineTo(getX(seg.end.x), getY(seg.end.y));
                }
                this.ctx.stroke();
            }

            // Desenha o segmento atual em progresso
            if (currentSegmentIndex < segmentCount) {
                const seg = this.sigilData.segments[currentSegmentIndex];
                const startNode = this.nodes[currentSegmentIndex];
                let currentPos;

                this.ctx.beginPath();
                this.ctx.moveTo(getX(startNode.x), getY(startNode.y));

                if (seg.type === 'curve') {
                    // Interpolação de curva de Bézier quadrática
                    const p0 = { x: getX(startNode.x), y: getY(startNode.y) };
                    const p1 = { x: getX(seg.control.x), y: getY(seg.control.y) };
                    const p2 = { x: getX(seg.end.x), y: getY(seg.end.y) };
                    const t = progressInCurrentSegment;
                    const Bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
                    const By = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
                    
                    // Desenha a curva parcial
                    this.ctx.quadraticCurveTo(
                        p0.x + (p1.x - p0.x) * t, p0.y + (p1.y - p0.y) * t,
                        Bx, By
                    );
                    currentPos = { x: Bx, y: By };
                } else {
                    // Interpolação de linha reta
                    const endNode = this.nodes[currentSegmentIndex + 1];
                    const currentX = getX(startNode.x) + (getX(endNode.x) - getX(startNode.x)) * progressInCurrentSegment;
                    const currentY = getY(startNode.y) + (getY(endNode.y) - getY(startNode.y)) * progressInCurrentSegment;
                    this.ctx.lineTo(currentX, currentY);
                    currentPos = { x: currentX, y: currentY };
                }
                this.ctx.stroke();

                // Desenha a "cabeça" brilhante da animação
                if (currentPos) {
                    this.ctx.beginPath();
                    this.ctx.arc(currentPos.x, currentPos.y, 6, 0, 2 * Math.PI);
                    this.ctx.fillStyle = '#f1c40f';
                    this.ctx.shadowColor = '#f1c40f';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            }
        }
    }
}

export function generateSigilDrawing(nodes) { return ''; }