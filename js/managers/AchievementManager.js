/**
 * js/managers/AchievementManager.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O Gerenciador de Conquistas
 * Este arquivo é responsável por toda a lógica de verificação e concessão de conquistas.
 * Ele lê o estado do jogo e os dados das conquistas para determinar se o jogador
 * atendeu aos critérios para desbloquear novos marcos.
 */

import { ACHIEVEMENTS } from '../data/achievementData.js';
import { getPlayerVeilStatus, VEIL_STATUSES } from '../data/veilStatusData.js';
import { ALL_EVENTS } from '../events.js'; // Importação crucial para a lógica de arcos

export class AchievementManager {
    constructor() {
        // Mapeia os tipos de condição das conquistas para as funções de lógica correspondentes.
        // Isso torna o sistema facilmente expansível: para criar um novo tipo de conquista,
        // basta adicionar uma nova entrada aqui e a função de lógica correspondente.
        this.conditionCheckers = {
            countOutcome: this.checkCountOutcome,
            countLore: this.checkCountLore,
            checkVeilStatus: this.checkVeilStatus,
            arcCompleted: this.checkArcCompleted,
        };
    }

    /**
     * A função principal. Verifica todas as conquistas definidas em achievementData.js
     * contra o estado atual do jogo para ver se alguma nova foi desbloqueada.
     * @param {object} gameState - O estado completo do jogo, vindo do GameManager.
     * @returns {Array<string>} Uma lista de IDs de novas conquistas desbloqueadas nesta verificação.
     */
    checkAchievements(gameState) {
        const newlyUnlocked = [];
        const unlockedAchievementsSet = new Set(gameState.unlockedAchievements || []);
        const unlockedLoreSet = new Set(gameState.unlockedLoreIds || []);
        
        // Itera por todas as conquistas disponíveis no jogo.
        for (const achievementId in ACHIEVEMENTS) {
            // Se o jogador já tem esta conquista, pula para a próxima.
            if (unlockedAchievementsSet.has(achievementId)) {
                continue;
            }

            const achievement = ACHIEVEMENTS[achievementId];
            // Se uma conquista nos dados não tiver uma condição, ignora-a.
            if (!achievement.condition) continue;

            // Encontra a função de lógica correta com base no tipo de condição.
            const checker = this.conditionCheckers[achievement.condition.type];

            // Se a função de verificação existir e retornar 'true'...
            if (checker && checker.call(this, gameState, achievement.condition)) {
                // ...adiciona a conquista à lista de recém-desbloqueadas.
                newlyUnlocked.push(achievementId);
                unlockedAchievementsSet.add(achievementId);

                // Verifica se esta conquista também desbloqueia uma página de lore.
                if (achievement.unlocksLore) {
                    unlockedLoreSet.add(achievement.unlocksLore);
                }
            }
        }
        
        // Atualiza os conjuntos de conquistas e lore no estado principal do jogo.
        gameState.unlockedAchievements = Array.from(unlockedAchievementsSet);
        gameState.unlockedLoreIds = Array.from(unlockedLoreSet);
        
        return newlyUnlocked;
    }

    /**
     * CONDIÇÃO: Verifica conquistas baseadas em contar o número de vezes que um resultado específico ocorreu.
     * Ex: "Corrija 5 sigilos corrompidos" (outcome: 'correct', requestType: 'Corrupted', count: 5)
     * @param {object} gameState - O estado do jogo.
     * @param {object} condition - A condição da conquista (type, outcome, count, requestType?).
     * @returns {boolean} - True se a condição for atendida.
     */
    checkCountOutcome(gameState, condition) {
        const count = gameState.clientHistory.filter(entry => {
            // Verifica se a condição exige um tipo de pedido específico (ex: 'Corrupted')
            if (condition.requestType) {
                return entry.outcome === condition.outcome && entry.requestType === condition.requestType;
            }
            // Se não, apenas verifica o resultado.
            return entry.outcome === condition.outcome;
        }).length;
        
        return count >= condition.count;
    }

    /**
     * CONDIÇÃO: Verifica conquistas baseadas no número de páginas de lore desbloqueadas.
     * @param {object} gameState - O estado do jogo.
     * @param {object} condition - A condição da conquista (type, count).
     * @returns {boolean} - True se a condição for atendida.
     */
    checkCountLore(gameState, condition) {
        const unlockedLore = new Set(gameState.unlockedLoreIds || []);
        return unlockedLore.size >= condition.count;
    }

    /**
     * CONDIÇÃO: Verifica se o jogador alcançou um ranque específico no alinhamento com o Véu.
     * @param {object} gameState - O estado do jogo.
     * @param {object} condition - A condição da conquista (type, rank).
     * @returns {boolean} - True se a condição for atendida.
     */
    checkVeilStatus(gameState, condition) {
        const currentStatus = getPlayerVeilStatus(gameState.veilContactPoints || 0);
        // Compara o objeto de status atual do jogador com o objeto de status exigido pela conquista.
        return currentStatus === VEIL_STATUSES[condition.rank];
    }
    
    /**
     * CONDIÇÃO: Verifica se todos os eventos de um arco narrativo específico foram concluídos.
     * @param {object} gameState - O estado do jogo.
     * @param {object} condition - A condição da conquista (type, arcName).
     * @returns {boolean} - True se o arco estiver completo.
     */
    checkArcCompleted(gameState, condition) {
        // Pega todos os IDs de eventos que já foram concluídos pelo jogador.
        const completedEventIds = new Set(
            gameState.clientHistory.map(entry => entry.clientId)
        );

        // Filtra a lista mestre de eventos para encontrar todos que pertencem ao arco desejado.
        const eventsInArc = ALL_EVENTS.filter(event => event.arc === condition.arcName);

        // Se, por algum motivo, não houver eventos nesse arco (erro nos dados), a condição não pode ser atendida.
        if (eventsInArc.length === 0) {
            return false;
        }

        // A condição é atendida se CADA evento do arco estiver presente na lista de eventos concluídos.
        // A função 'every' retorna true apenas se a condição for verdadeira para todos os itens do array.
        return eventsInArc.every(event => completedEventIds.has(event.id));
    }
}