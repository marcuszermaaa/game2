/**
 * js/data/events_mordecai.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O ARCO DO COLECIONADOR DE ECOS
 * Uma narrativa focada no mistério e na manipulação, onde o jogador é coagido
 * a criar um artefato de sacrifício para Mordecai, encontrando clientes
 * influenciados por sua presença sombria ao longo do caminho.
 */

export const MORDECAI_ARC = [
    // --- EVENTO 1: A PRIMEIRA MANIFESTAÇÃO ---
    // Gatilho: A primeira vez que o jogador usa seu próprio sangue.
    {
        id: 'encontro_mordecai_sussurro',
        arc: 'Mordecai',
        priority: 1000, // Prioridade máxima para acontecer imediatamente após a ação.
        conditions: { 
            minDay: 3, 
            requiresFlag: 'hasUsedBloodMagic', 
            requiresFlagAbsence: 'mordecaiIsAware' // Garante que só aconteça uma vez.
        },
        name: "Um Sussurro na Tinta",
        isNarrativeEvent: true,
        narrativeSequence: [
            { text: "(No instante em que a agulha, manchada com seu sangue, completa o sigilo, a luz do estúdio pisca violentamente.)" },
            { text: "(Por um breve momento, a sombra mais profunda no canto da sala se contorce, assumindo uma forma alta e esguia... e então volta ao normal.)" },
            { text: "(Uma única frase, fria e sibilante, ecoa diretamente em sua mente, sobreposta por um som de estática pura: 'Um sacrifício... saboroso...')" }
        ],
        action: { 
            type: 'add_multiple', 
            payload: [ 
                { type: 'change_sanity', payload: -2 }, 
                { type: 'set_flag', payload: 'mordecaiIsAware' } 
            ] 
        }
    },

    // --- EVENTO 2: A PROPOSTA / A TAREFA ---
    // Gatilho: Ocorre no primeiro dia disponível após Mordecai se tornar ciente do jogador.
    {
        id: 'encontro_mordecai_proposta',
        arc: 'Mordecai',
        priority: 600,
        conditions: { 
            minDay: 3, 
            requiresFlag: 'mordecaiIsAware', 
            requiresFlagAbsence: 'mordecaiQuestStarted' 
        },
        characterId: 'mordecai_antiquario',
        name: "Mordecai",
        portraitUrls: ["/media/img/mordecai.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
           startNode: 'arrival',
           nodes: {
               'arrival': { type: 'dialogue', text: "Sua essência... tem uma ressonância que não sinto há séculos. Pura. Potente. Eu quero um... concentrado.", nextNode: 'the_deal' },
               'the_deal': { type: 'dialogue', text: "Traga-me um Cristal de Kadath e Pó de Sonhos. Leve-os à sua bancada. Infunda-os com seu próprio sacrifício. Forje para mim um Cristal de Essência Focada.", nextNode: 'the_reward' },
               'the_reward': { type: 'dialogue', text: "Em troca, as portas do meu antiquário se abrirão para você. E minha... atenção... será desviada. Por enquanto.", nextNode: 'action_start_quest' },
               'action_start_quest': {
                   type: 'action',
                   actions: [
                       { type: 'set_flag', payload: 'mordecaiQuestStarted' },
                       { type: 'unlock_recipe', payload: 'receita_cristal_essencia' }
                   ],
                   nextNode: 'outcome_quest_started'
               },
               'outcome_quest_started': {
                   type: 'outcome',
                   title: "Uma Tarefa Profana",
                   text: "A entidade desaparece, deixando um frio gélido e o conhecimento profano de uma nova receita em sua mente. A caçada pelos ingredientes começou.",
                   nextNode: 'END_EVENT'
               }
           }
       }
    },
    
    // --- CLIENTES "SUSSURRADOS" (Incentivam o uso de sangue) ---
    {
        id: 'apostador_azarado',
        arc: 'Mordecai',
        priority: 500,
        conditions: {
            minDay: 4,
            requiresFlag: 'mordecaiIsAware',
            requiresFlagAbsence: 'gamblerHelped' // Para não repetir
        },
        characterId: 'apostador_azarado',
        name: "Apostador Azarado",
        portraitUrls: ["/media/img/gambler.png"],
        isNarrativeEvent: false,
        problem: "Eles vão quebrar minhas pernas... ou pior. Ouvi um sussurro no beco, sobre uma tinta especial que você faz, uma que esconde um homem das vistas de seus inimigos. Por favor, eu pago qualquer preço.",
        request: 's10_corrupted_shroud', // Um sigilo de ocultação complexo e corrompido
        successPay: 200,
        // As recompensas e a lógica de dificuldade são tratadas no gameCore.js
        rewards: {
            success: [ { type: 'set_flag', payload: 'gamblerHelped' } ]
        }
    },
    {
        id: 'herdeira_doente',
        arc: 'Mordecai',
        priority: 510,
        conditions: {
            minDay: 5,
            requiresFlag: 'mordecaiIsAware',
            requiresFlagAbsence: 'heiressHelped'
        },
        characterId: 'herdeira_doente',
        name: "Herdeira Doente",
        portraitUrls: ["/media/img/heiress.png"],
        isNarrativeEvent: false,
        problem: "Os médicos me abandonaram. Mas uma voz em meus sonhos febris me disse que a vitalidade pode ser... transferida. Que você poderia compartilhar um fragmento da sua força comigo.",
        request: 's11_draining_ward', // Um sigilo de vitalidade que drena energia
        successPay: 100,
        rewards: {
            success: [
                { type: 'set_flag', payload: 'heiressHelped' },
                { type: 'add_special_item', payload: 'pickmans_ring' }
            ]
        }
    },

    // --- EVENTO 3: A TROCA FINAL ---
    // Gatilho: Ocorre na noite do dia em que o jogador forja o Cristal de Essência.
    {
        id: 'encontro_mordecai_a_troca',
        arc: 'Mordecai',
        priority: 1100, // Prioridade altíssima para garantir sua execução.
        conditions: {
            minDay: 4,
            requiresFlag: 'hasForgedTheCrystal' // Flag ativada na bancada de trabalho.
        },
        characterId: 'mordecai_antiquario',
        name: "Mordecai",
        portraitUrls: ["/media/img/mordecai.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'arrival',
            nodes: {
                'arrival': { type: 'dialogue', text: "(Ele aparece no instante em que o cristal se forma em suas mãos, seus olhos vazios fixos no brilho etéreo.) Esplêndido. Um eco perfeito.", nextNode: 'the_exchange' },
                'the_exchange': { type: 'dialogue', text: "Um acordo é um acordo. Meu conhecimento é seu. E minha fome... está saciada. Por enquanto.", nextNode: 'action_complete_quest' },
                'action_complete_quest': {
                    type: 'action',
                    actions: [
                        { type: 'remove_item', payload: 'cristal_essencia_focada' },
                        { type: 'set_flag', payload: 'mordecaiShopUnlocked' },
                        { type: 'unlock_achievement', payload: 'echo_forger' }
                    ],
                    nextNode: 'outcome_quest_complete'
                },
                'outcome_quest_complete': {
                    type: 'outcome',
                    title: "Dívida Paga",
                    text: "Mordecai se dissolve nas sombras. Você sente um alívio imenso, mas também um vazio. A porta para o antiquário estará aberta esta noite.",
                    nextNode: 'END_EVENT'
                }
            }
        }
    }
];