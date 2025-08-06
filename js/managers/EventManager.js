/**
 * js/managers/EventManager.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O Agendador de Eventos e Correspondências
 * Este arquivo é responsável por construir a agenda de eventos para cada dia
 * e por filtrar os e-mails disponíveis para o jogador com base em condições de jogo.
 */

import { ALL_EVENTS } from '../events.js';
import { CLIENTS_PER_DAY } from '../constants.js';
import { MAILS } from '../data/mailData.js'; // Importação necessária para a nova função

export class EventManager {
    constructor(gameState) {
        // Armazena uma referência ao estado completo do jogo para poder ler o histórico e as flags.
        this.gameState = gameState;
        // Esta propriedade é usada internamente para construir a agenda antes de passá-la ao GameManager.
        this.todaysAgenda = [];
    }

    /**
     * A função principal. Prepara a agenda para o dia, construindo-a iterativamente
     * para respeitar as dependências que são resolvidas no mesmo dia.
     * @param {number} day - O número do dia atual.
     */
    prepareAgendaForDay(day) {
        const fullHistory = this.gameState.clientHistory || [];
        const flags = this.gameState.flags || {};

        // 1. Cria um "pool" inicial de eventos, filtrando todos os eventos do jogo
        // que poderiam teoricamente acontecer hoje e que ainda não foram concluídos.
        const potentialEventsForToday = ALL_EVENTS.filter(event => {
            const cond = event.conditions;
            return cond && day >= cond.minDay && (!cond.maxDay || day <= cond.maxDay) && !fullHistory.some(h => h.clientId === event.id);
        });

        const newAgenda = [];
        // 2. Cria um "histórico simulado" para este dia, começando com tudo o que já aconteceu.
        const tempCompletedIds = new Set(fullHistory.map(e => e.clientId));

        // 3. Itera para preencher as vagas do dia (ex: CLIENTS_PER_DAY).
        for (let i = 0; i < CLIENTS_PER_DAY; i++) {
            // 4. A cada iteração, encontra os eventos cujas condições são atendidas AGORA.
            const availableNow = potentialEventsForToday
                .filter(event => {
                    if (tempCompletedIds.has(event.id)) return false;

                    const cond = event.conditions;
                    // Verificação de todas as condições possíveis.
                    if (cond.requiresFlag && !flags[cond.requiresFlag]) return false;
                    if (cond.requiresFlagAbsence && flags[cond.requiresFlagAbsence]) return false;
                    if (cond.requiresEvent && !tempCompletedIds.has(cond.requiresEvent)) return false;
                    
                    if (cond.requiresEventOutcome) {
                        const required = fullHistory.find(h => h.clientId === cond.requiresEventOutcome.id && h.outcome === cond.requiresEventOutcome.outcome);
                        if (!required) return false;
                    }

                    if(cond.hasSpecialItem && !(this.gameState.specialItems || []).includes(cond.hasSpecialItem)){
                        return false;
                    }
                    
                    return true;
                })
                .sort((a, b) => (b.priority || 0) - (a.priority || 0));

            // 5. Se encontrou um evento válido, adiciona-o à agenda do dia.
            if (availableNow.length > 0) {
                const nextEvent = availableNow[0];
                
                // Caso especial para eventos que dominam o dia inteiro (como o clímax).
                if (nextEvent.priority >= 9999) {
                    this.todaysAgenda = [nextEvent];
                    return;
                }

                newAgenda.push(nextEvent);
                // 6. ATUALIZA o histórico simulado, "completando" o evento que acabamos de agendar.
                tempCompletedIds.add(nextEvent.id); 
            } else {
                break;
            }
        }
        // Define o resultado final para que o GameManager possa lê-lo.
        this.todaysAgenda = newAgenda;
    }
    
    /**
     * Obtém o cliente/evento atual da agenda persistente no gameState.
     * @returns {object|null} O objeto do evento atual.
     */
    getCurrentClient() {
        const clientIndex = this.gameState.clientInDay - 1;
        const agenda = this.gameState.todaysAgenda || []; 
        
        if (clientIndex >= 0 && clientIndex < agenda.length) {
            return agenda[clientIndex];
        }
        
        return null;
    }

    /**
     * Verifica e retorna todos os e-mails que o jogador deve ter recebido
     * com base no dia atual e no histórico de eventos.
     * @returns {Array<object>} Uma lista de objetos de e-mail válidos.
     */
    getAvailableMails() {
        const { day, clientHistory, flags } = this.gameState;
        const fullHistory = clientHistory || [];
        const completedEventIds = new Set(fullHistory.map(e => e.clientId));

        return MAILS.filter(mail => {
            // Se um e-mail não tiver condições, ele aparece apenas com base no dia.
            if (!mail.conditions) {
                return mail.receivedDay <= day;
            }

            // Se tiver condições, todas devem ser atendidas.
            const cond = mail.conditions;
            if (mail.receivedDay > day) return false;
            if (cond.requiresEvent && !completedEventIds.has(cond.requiresEvent)) return false;
            if (cond.requiresFlag && (!flags || !flags[cond.requiresFlag])) return false;
            
            return true;
        });
    }
}