// js/pageTransitions.js - Gerenciador Global de Transições, Efeitos Sonoros e Música

// ===================================================================
//  1. GERENCIADOR DE EFEITOS SONOROS (SoundManager)
// ===================================================================

/**
 * Um objeto singleton para gerenciar o pré-carregamento e a reprodução
 * de efeitos sonoros curtos (SFX).
 */
const SoundManager = {
    /**
     * Objeto que armazenará os elementos <audio> pré-carregados,
     * usando seus nomes como chaves.
     * @type {Object.<string, HTMLAudioElement>}
     */
    sounds: {},

    /**
     * Inicializa o SoundManager. Itera sobre uma lista de sons para pré-carregá-los.
     * @param {Object.<string, string>} soundList - Um objeto onde a chave é o nome de referência do som e o valor é o caminho do arquivo.
     */
    init(soundList) {
        console.log("SoundManager: Iniciando pré-carregamento de efeitos sonoros...");
        for (const name in soundList) {
            this.loadSound(name, soundList[name]);
        }
    },

    /**
     * Cria um elemento <audio> para um som específico e o armazena no objeto 'sounds'.
     * @param {string} name - O nome de referência para o som (ex: 'ui_click').
     * @param {string} src - O caminho para o arquivo de áudio.
     */
    loadSound(name, src) {
        const sound = new Audio(src);
        sound.preload = 'auto'; // Instrução para o navegador carregar o áudio o mais rápido possível.
        this.sounds[name] = sound;
    },

    /**
     * Toca um som pré-carregado.
     * @param {string} name - O nome do som a ser tocado, conforme definido na lista de inicialização.
     */
    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            // Reinicia o tempo do áudio para 0. Isso permite que o som seja tocado
            // novamente em rápida sucessão (ex: cliques rápidos em botões).
            sound.currentTime = 0;
            // O método play() retorna uma Promise. Usamos .catch() para capturar e silenciar
            // possíveis erros caso o navegador bloqueie a reprodução por algum motivo.
            sound.play().catch(error => console.warn(`Não foi possível tocar o som "${name}":`, error));
        } else {
            console.warn(`SoundManager: Som com o nome "${name}" não foi encontrado ou carregado.`);
        }
    }
};

// ===================================================================
//  2. GERENCIADOR DE MÚSICA DE FUNDO (MusicManager)
// ===================================================================

/**
 * Um objeto singleton para gerenciar a reprodução contínua de música de fundo.
 */
const MusicManager = {
    /**
     * Armazena a referência para o elemento <audio> da faixa de música atual.
     * @type {HTMLAudioElement | null}
     */
    currentTrack: null,

    /**
     * Toca uma faixa de música em loop. Para e substitui a faixa anterior se uma diferente for solicitada.
     * @param {string} src - O caminho para o arquivo de música.
     */
    play(src) {
        // Se a música solicitada já é a que está tocando, não faz nada para evitar recarregamentos.
        if (this.currentTrack && this.currentTrack.src.endsWith(src)) {
            return;
        }

        // Se uma música diferente estiver tocando, pausa e remove a referência a ela.
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack = null;
        }

        // Cria, configura e toca a nova faixa de música.
        this.currentTrack = new Audio(src);
        this.currentTrack.loop = true;   // Garante que a música se repita indefinidamente.
        this.currentTrack.volume = 0.3; // Define um volume padrão mais baixo (0.0 a 1.0).
        
        // Tenta tocar a música. Isso provavelmente será bloqueado pelo navegador até a primeira interação.
        // O .catch() lida com o erro esperado de forma silenciosa no console.
        this.currentTrack.play().catch(error => {
            console.log("Música de fundo bloqueada pelo navegador. Aguardando interação do usuário.", error.name);
        });
    }
};

// ===================================================================
//  3. NOVO: GERENCIADOR DE SOM DE AMBIENTE
// ===================================================================

/**
 * NOVO: Um objeto singleton para gerenciar sons de ambiente com fade-in e início aleatório.
 */
const AmbientSoundManager = {
    currentTrack: null,
    fadeInterval: null, // Armazena a referência do intervalo para o fade-in

    /**
     * Toca uma faixa de áudio ambiente em loop.
     * @param {string} src - O caminho para o arquivo de áudio.
     * @param {object} options - Opções de reprodução.
     * @param {number} options.targetVolume - O volume final após o fade-in (ex: 0.2).
     * @param {number} options.fadeDuration - A duração do fade-in em milissegundos (ex: 3000).
     */
    play(src, { targetVolume = 0.2, fadeDuration = 3000 } = {}) {
        if (this.currentTrack && this.currentTrack.src.endsWith(src)) {
            return;
        }

        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack = null;
        }
        
        // Limpa qualquer fade-in anterior que possa estar em execução
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }

        this.currentTrack = new Audio(src);
        this.currentTrack.loop = true;
        this.currentTrack.volume = 0; // Começa totalmente silencioso

        // Evento que dispara quando os metadados do áudio (como a duração) são carregados.
        // É essencial para definir um ponto de partida aleatório.
        this.currentTrack.addEventListener('loadedmetadata', () => {
            if (!this.currentTrack) return; // Checagem de segurança

            // Define um ponto de início aleatório no arquivo de áudio
            this.currentTrack.currentTime = Math.random() * this.currentTrack.duration;

            // Toca o áudio (ainda silencioso) e lida com o bloqueio de autoplay do navegador
            this.currentTrack.play().then(() => {
                console.log(`Som de ambiente iniciado em tempo aleatório: ${this.currentTrack.currentTime.toFixed(2)}s`);
                
                // Inicia o processo de fade-in
                let currentVolume = 0;
                const steps = 50; // Quantidade de "passos" no fade-in
                const stepTime = fadeDuration / steps;
                const volumeIncrement = targetVolume / steps;

                this.fadeInterval = setInterval(() => {
                    currentVolume += volumeIncrement;
                    if (currentVolume >= targetVolume) {
                        this.currentTrack.volume = targetVolume;
                        clearInterval(this.fadeInterval); // Para o intervalo quando o volume alvo é atingido
                    } else {
                        this.currentTrack.volume = currentVolume;
                    }
                }, stepTime);

            }).catch(error => {
                console.log("Som de ambiente bloqueado pelo navegador. Aguardando interação do usuário.", error.name);
            });
        });
    }
};


// ===================================================================
//  4. MODIFICADO: LÓGICA DE TRANSIÇÃO E INICIALIZAÇÃO GERAL
// ===================================================================

/**
 * Função principal que é executada quando o script é carregado.
 * Ela configura as transições de página e inicializa os gerenciadores de áudio.
 */
function initializePageEffects() {
    const body = document.body;
    const transitionType = body.dataset.transition;

    // --- LÓGICA DE FADE-IN DA PÁGINA ---
    if (transitionType) {
        body.classList.add('transition-fade');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                body.classList.add('page-visible');
            });
        });
    }

    // --- INICIALIZAÇÃO DO GERENCIADOR DE EFEITOS SONOROS ---
    const soundsToLoad = {
        'ui_click': '../media/sfx/click2.mp3',
        'sucesso': '../media/sfx/sucesso.mp3',
        'erro': '../media/sfx/erro.mp3',
        'page_turn': '../media/sfx/click.mp3',
        'paper_rustle': '../media/sfx/click.mp3',
        'item_get': '../media/sfx/item_get.mp3'
    };
    SoundManager.init(soundsToLoad);
    window.GameAudio = SoundManager;

    // --- LISTENER DE CLIQUE GENÉRICO PARA EFEITOS SONOROS ---
    document.addEventListener('click', (e) => {
        const clickableElement = e.target.closest('button, [data-sound-click]');
        if (clickableElement) {
            const specificSound = clickableElement.dataset.soundClick;
            if (specificSound) {
                window.GameAudio.play(specificSound);
            } else {
                window.GameAudio.play('ui_click');
            }
        }
    }, true);

    // --- MODIFICADO: LISTENER PARA A PRIMEIRA INTERAÇÃO DO USUÁRIO PARA INICIAR ÁUDIO ---
    /**
     * Esta função é acionada apenas uma vez para iniciar a música de fundo E/OU o som ambiente,
     * contornando a política de autoplay do navegador.
     */
    function handleFirstInteractionForAudio() {
        // Checa se há uma música definida para a página
        const musicSrc = body.dataset.musicSrc;
        if (musicSrc) {
            console.log(`Primeira interação detectada. Tocando a música da página: ${musicSrc}`);
            MusicManager.play(musicSrc);
        }

        // NOVO: Checa se há um som de ambiente definido para a página
        const ambientSrc = body.dataset.ambientSrc;
        if (ambientSrc) {
            console.log(`Primeira interação detectada. Tocando o som de ambiente: ${ambientSrc}`);
            const targetVolume = parseFloat(body.dataset.ambientVolume) || 0.2;
            const fadeDuration = parseInt(body.dataset.ambientFadeDuration, 10) || 4000;
            AmbientSoundManager.play(ambientSrc, { targetVolume, fadeDuration });
        }
    }

    // Vincula a função de inicialização de áudio a múltiplos tipos de interação.
    // A opção `{ once: true }` garante que o listener seja executado apenas uma vez.
    document.addEventListener('click', handleFirstInteractionForAudio, { once: true });
    document.addEventListener('keydown', handleFirstInteractionForAudio, { once: true });
    document.addEventListener('mousemove', handleFirstInteractionForAudio, { once: true });
}

// Inicia todo o processo.
initializePageEffects();