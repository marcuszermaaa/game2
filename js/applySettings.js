/**
 * js/applySettings.js
 * -----------------
 * SCRIPT DE CONFIGURAÇÕES GLOBAIS
 * Este script é incluído em TODAS as páginas do jogo. Ele lê as configurações
 * salvas no localStorage (como Zoom e Tela Cheia) e as aplica
 * imediatamente no carregamento da página para uma experiência consistente.
 */

// Usamos uma "Immediately Invoked Function Expression" (IIFE) para executar o código
// imediatamente e manter o ambiente limpo.
(function() {
    
    // --- LÓGICA DE ZOOM ---
    const savedZoom = localStorage.getItem('gameZoomLevel');
    if (savedZoom && savedZoom !== '100') {
        const zoomClass = `zoom-${savedZoom}`;
        document.body.classList.add(zoomClass);
    }

    // --- LÓGICA DE TELA CHEIA ---
    const isFullscreenEnabled = localStorage.getItem('fullscreenEnabled') === 'true';

    // Função para entrar em tela cheia de forma compatível com vários navegadores.
    function openFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) { elem.requestFullscreen().catch(err => console.error(err)); }
        else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } // Safari
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); } // IE11
    }

    // Função para verificar se já estamos em tela cheia.
    function isAlreadyInFullscreen() {
        return (document.fullscreenElement || document.webkitFullscreenElement) !== null;
    }
    
    // Se a configuração de tela cheia estiver ATIVADA e o navegador NÃO estiver em tela cheia...
    if (isFullscreenEnabled && !isAlreadyInFullscreen()) {
        // ...então pedimos ao navegador para entrar em tela cheia.
        // IMPORTANTE: A maioria dos navegadores modernos exige uma interação do usuário
        // (como um clique) para permitir a entrada em tela cheia. Por isso, adicionamos
        // um listener que tentará ativar a tela cheia no primeiro clique ou toque do usuário.
        function requestFullscreenOnFirstInteraction() {
            // Tenta entrar em tela cheia.
            openFullscreen();
            // Remove o listener após a primeira tentativa para não ficar tentando sempre.
            document.body.removeEventListener('click', requestFullscreenOnFirstInteraction);
            document.body.removeEventListener('touchstart', requestFullscreenOnFirstInteraction);
        }

        // Adiciona os listeners para a primeira interação.
        document.body.addEventListener('click', requestFullscreenOnFirstInteraction);
        document.body.addEventListener('touchstart', requestFullscreenOnFirstInteraction);
    }

})();