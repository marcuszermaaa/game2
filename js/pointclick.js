// /js/pointclick.js - VERSÃO APRIMORADA COM MODO DE DEBUG

import { PointClickManager } from './managers/pointclickmanager.js';

// Função para criar um estado de jogo padrão para depuração
function createDebugGameState() {
    console.warn("⚠️ AVISO: Nenhum GameState encontrado. Criando um estado de depuração padrão.");
    // Este objeto simula um jogador que chegou ao Dia 8
    // e possui os itens necessários para testar o quebra-cabeça.
    return {
        day: 8,
        sanity: 85, // Começamos com um pouco menos de sanidade, como se já tivesse custado algo
        money: 500,
        specialItems: [
            'sigil_fragment_1',
            'sigil_fragment_2',
            'broken_lens' // Essencial para o quebra-cabeça do código
        ],
        // Adicione outras propriedades que possam ser necessárias para testes
        discoveredSigils: ['s01', 's04', 's07'],
        unlockedLoreIds: ['abner_diary_1', 'abner_on_the_circle'],
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("===================================");
    console.log("▶️ INICIANDO MINIGAME POINT & CLICK");
    console.log("===================================");

    // Tenta carregar o gameState. Se falhar, verifica o modo de debug.
    let gameState = JSON.parse(localStorage.getItem('gameState'));
    const isDebugModeEnabled = localStorage.getItem('debugModeEnabled') === 'true';

    // Se não há gameState E o modo de debug está ativado no menu, cria um estado padrão.
    if (!gameState && isDebugModeEnabled) {
        gameState = createDebugGameState();
        // Opcional: Salva o estado de debug para que ele persista entre F5s na mesma página
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
    
    // Se, mesmo após a verificação de debug, não houver gameState, então é um erro fatal.
    if (!gameState) {
        console.error("❌ FATAL: GameState não encontrado e o modo de depuração está desativado. O minigame não pode iniciar.");
        alert("Erro crítico: Não foi possível carregar os dados do jogo. Inicie a partir do menu principal.");
        // Redireciona o jogador de volta para o início para evitar que ele fique preso.
        window.location.href = '/index.html';
        return;
    }

    console.log("✅ GameState carregado:", gameState);

    const onMinigameComplete = (result) => {
        console.log("===================================");
        console.log("🏁 MINIGAME CONCLUÍDO 🏁");
        console.log("===================================");
        console.log("Resultado a ser enviado de volta:", result);

        gameState.pointClickResult = result;
        // Assegura que os Sets sejam convertidos para Arrays antes de salvar
        gameState.purchasedUpgrades = Array.from(new Set(gameState.purchasedUpgrades));
        gameState.readMailIds = Array.from(new Set(gameState.readMailIds));
        gameState.discoveredSigils = Array.from(new Set(gameState.discoveredSigils));
        localStorage.setItem('gameState', JSON.stringify(gameState));
        window.location.href = '/game.html';
    };

    console.log("🚀 Instanciando PointClickManager...");
    const engine = new PointClickManager(gameState, onMinigameComplete);
    console.log("⚙️ Iniciando a engine do minigame...");
    engine.start();
    
    window.pc_engine = engine;
    console.log("✨ Engine de Point & Click disponível no console como 'pc_engine'.");
});