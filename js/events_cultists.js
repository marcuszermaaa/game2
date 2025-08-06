/**
 * js/data/events_cultists.js
 * -----------------
 * Contém eventos relacionados a cultistas e seguidores de poderes
 * arcanos que não estão diretamente ligados aos arcos principais.
 * Este evento serve como a principal quest para obter o item do arco de Mordecai.
 */

export const CULTIST_ARC = [
    {
        id: 'cultista_fragmentado_cristal',
        arc: 'Cultista', // Um arco próprio e contido
        priority: 250, // Prioridade alta para garantir que apareça quando for relevante
        conditions: { 
            minDay: 4, 
            requiresFlag: 'mordecaiQuestStarted', // Só aparece depois que Mordecai lhe deu a tarefa
            requiresFlagAbsence: 'hasCristalDeKadath' // Não aparece se você já tem o cristal
        },
        characterId: 'eremita_do_conhecimento',
        name: "Eremita Fragmentado",
        portraitUrls: ["/media/img/cultist_broken.png"],
        isNarrativeEvent: false, // É um evento interativo (requer tatuagem)
        problem: "(O homem está claramente perturbado, olhando para os cantos da sala.) Ele vê... através disto. Enquanto eu o carregar, ele pode me encontrar. Por favor... pegue-o. Eu lhe dou tudo o que tenho se você me ajudar a silenciar os sussurros.",
        
        correctSigil: 's01', // Ele precisa de um Selo da Mente Tranquila

        successPay: 50,
        failPay: 0,
        wrongPay: 10,
        
        rewards: {
            // Se você tiver sucesso, ele lhe dá o cristal e uma pequena recompensa.
            success: [
                { type: 'add_ingredient', payload: 'cristal_de_kadath' },
                { type: 'set_flag', payload: 'hasCristalDeKadath' }
            ],
            // Se você falhar, ele entra em pânico, joga o cristal em você e foge.
            fail_minigame: [
                { type: 'add_ingredient', payload: 'cristal_de_kadath' },
                { type: 'set_flag', payload: 'hasCristalDeKadath' },
                { type: 'change_sanity', payload: -10 }
            ],
            wrong_sigil: [
                { type: 'add_ingredient', payload: 'cristal_de_kadath' },
                { type: 'set_flag', payload: 'hasCristalDeKadath' },
                { type: 'change_sanity', payload: -15 }
            ]
        }
    }
];