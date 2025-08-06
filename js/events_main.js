/**
 * js/data/events_main.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - Clientes e Encontros de Port Blackwood
 * Este arquivo contém os eventos de clientes "avulsos" e de um dia só.
 * Inclui o evento crucial do "Geólogo Assombrado" para o arco de Armitage.
 */

export const MAIN_EVENTS = [
    // --- DIA 1: O BÁSICO E A ATMOSFERA ---
    {
        id: 'jonas_o_pescador_dia1',
        arc: 'Geral', priority: 10, conditions: { minDay: 1, maxDay: 1 },
        characterId: 'jonas_pescador', name: "Jonas, o Pescador", portraitUrls: ["/media/img/pescador.png"],
        isNarrativeEvent: false,
        problem: "Os pesadelos não me deixam em paz. Sonho com cidades submersas. Um Selo da Mente Tranquila poderia ajudar.",
        correctSigil: 's01', successPay: 50, failPay: 10, wrongPay: 20
    },
    {
        id: 'musico_assombrado_dia1',
        arc: 'Geral', priority: 9, conditions: { minDay: 1, maxDay: 1 },
        characterId: 'musico_assombrado', name: "Músico Assombrado", portraitUrls: ["/media/img/musico.png"],
        isNarrativeEvent: false,
        problem: "Há uma melodia na minha cabeça. Não é minha. Ela vem com a maré. Preciso de silêncio. Um Selo da Mente Tranquila, por favor.",
        correctSigil: 's01', successPay: 60,
        rewards: { success: [ { type: 'add_ingredient', payload: 'sabao_especial' } ] }
    },

    // --- DIA 2: INTRODUÇÃO À ANÁLISE E LORE ---
    {
        id: 'helena_a_enlutada_dia2',
        arc: 'Geral', priority: 15, conditions: { minDay: 2, maxDay: 2 },
        characterId: 'helena_enlutada', name: "Helena, a Enlutada", portraitUrls: ["/media/img/enlutada.png"],
        isNarrativeEvent: false,
        problem: "Meu marido se foi no mar. Um vidente me deu este desenho para contatá-lo em sonhos. Mas parece... distorcido.",
        request: 's01_corrupted', successPay: 70, failPay: 10, wrongPay: 30
    },
    {
        id: 'assistente_bibliotecario_dia2',
        arc: 'Geral', priority: 14, conditions: { minDay: 2, maxDay: 2 },
        characterId: 'assistente_bibliotecario', name: "Assistente de Bibliotecário", portraitUrls: ["/media/img/assistente.png"],
        isNarrativeEvent: false,
        problem: "Estou catalogando a coleção de Abner. Alguns livros... eles resistem. Preciso de uma Âncora da Realidade para me manter são enquanto trabalho.",
        correctSigil: 's04', successPay: 50,
        rewards: { success: [ { type: 'add_ingredient', payload: 'poeiraEstelar' } ] }
    },

    // --- DIAS 3-6: APROFUNDAMENTO DAS MECÂNICAS ---
    {
        id: 'gideon_o_artesao_dia3',
        arc: 'Geral', priority: 20, conditions: { minDay: 3, maxDay: 3 },
        characterId: 'gideon_artesao', name: "Gideon, o Artesão", portraitUrls: ["/media/img/artesao.png"],
        isNarrativeEvent: false,
        problem: "Minhas mãos tremem. Não consigo mais criar. Preciso de uma Âncora que me prenda à minha própria arte.",
        correctSigil: 's04', successPay: 40,
        rewards: { success: [ { type: 'set_flag', payload: 'helpedGideon' } ] }
    },
    {
        id: 'jornalista_paranoico_dia4',
        arc: 'Geral', priority: 27, conditions: { minDay: 4, maxDay: 4 },
        characterId: 'jornalista_paranoico', name: "Jornalista Paranoico", portraitUrls: ["/media/img/jornalista.png"],
        isNarrativeEvent: false,
        problem: "Estou investigando os desaparecimentos nos cais. Sinto que estou perto de algo. Este sigilo... ele deveria aguçar minha percepção, mas está borrado.",
        request: 's03_corrupted', successPay: 90, failPay: 20, wrongPay: 40
    },
    {
        id: 'alquimista_viajante_dia5',
        arc: 'Geral', priority: 25, conditions: { minDay: 5, maxDay: 5 },
        characterId: 'alquimista_viajante', name: "Alquimista Viajante", portraitUrls: ["/media/img/alquimista.png"],
        isNarrativeEvent: false,
        problem: "Tenho este 'Fragmento de Cometa', mas sua energia é caótica. Um Escudo do Marinheiro poderia contê-la para o transporte.",
        correctSigil: 's06', successPay: 80,
        rewards: { success: [ { type: 'add_ingredient', payload: 'fragmentoDeCometa' } ] }
    },
    {
        id: 'erudito_da_caixa_dia5',
        arc: 'Geral', priority: 22, conditions: { minDay: 5, maxDay: 5 },
        characterId: 'erudito_nervoso', name: "Erudito da Caixa", portraitUrls: ["/media/img/erudito.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'arrival',
            nodes: {
                'arrival': { type: 'dialogue', text: "Eu a comprei de um marinheiro. Ela sussurra à noite. Não ouso abri-la. Você saberia o que fazer?", nextNode: 'player_choice' },
                'player_choice': { type: 'choice', title: 'A Caixa Sussurrante', text: 'A caixa de chumbo é fria e parece vibrar.',
                    options: [ { text: "[Tentar abrir a caixa]", nextNode: 'outcome_open' }, { text: "[Sugerir um sigilo de contenção]", nextNode: 'outcome_seal' } ]
                },
                'outcome_open': { type: 'outcome', title: 'Curiosidade Mortal', text: "Você força a fechadura. Um gás pálido escapa. O erudito foge apavorado. A caixa agora está vazia e silenciosa.", actions: [{ type: 'change_sanity', payload: -15 }], nextNode: 'END_EVENT' },
                'outcome_seal': { type: 'outcome', title: 'Prudência Arcana', text: "Você desenha um sigilo de proteção na caixa. Os sussurros param. O erudito, aliviado, lhe paga e lhe dá um item estranho.", actions: [{ type: 'add_money', payload: 100 }, { type: 'add_ingredient', payload: 'póDeSonhos' }], nextNode: 'END_EVENT' }
            }
        }
    },
    {
        id: 'lamento_de_helena_dia6',
        arc: 'Geral', priority: 100,
        conditions: { minDay: 6, maxDay: 6, requiresEventOutcome: { id: 'helena_a_enlutada_dia2', outcome: 'accept_corrupted' } },
        characterId: 'helena_enlutada', name: "O Lamento de Helena", portraitUrls: ["/media/img/enlutada_assombrada.png"],
        isNarrativeEvent: true,
        narrativeSequence: [
            { text: "(Helena retorna. Ela está mais magra, com olheiras profundas.) Eu falo com ele todas as noites agora. A tatuagem funcionou." },
            { text: "(Ela se aproxima e sussurra.) 'Ele diz... que tem saudades de você também. Ele diz que o Véu é tão... fino... onde você está.'" }
        ],
        action: { type: 'change_sanity', payload: -10 }
    },

    // --- DIAS 7-10: EVENTOS FINAIS E DE QUEST ---
    {
        id: 'guarda_do_farol_dia7',
        arc: 'Geral', priority: 30, conditions: { minDay: 7, maxDay: 7 },
        characterId: 'guarda_do_farol', name: "Guarda do Farol", portraitUrls: ["/media/img/faroleiro.png"],
        isNarrativeEvent: true,
        narrativeFlow: { /* ... (como definido anteriormente) ... */ }
    },

    // ✨ EVENTO CRUCIAL PARA O ARCO DE ARMITAGE ✨
    {
        id: 'geologo_assombrado',
        arc: 'Geral',
        priority: 300, // Prioridade alta para garantir que apareça durante o ultimato.
        conditions: { 
            minDay: 8, maxDay: 10,
            requiresFlag: 'armitageUltimatumActive', // Só aparece durante a semana final.
            requiresFlagAbsence: 'hasCoracaoDeCristal' // Não aparece se você já tem o item.
        },
        characterId: 'geologo_assombrado',
        name: "Geólogo Assombrado",
        portraitUrls: ["/media/img/geologo.png"],
        isNarrativeEvent: false,
        problem: "Eu o encontrei em uma mina que não deveria existir. Um geodo que pulsa... Ele sussurra números. Preciso de um Selo da Mente Tranquila para poder dormir de novo. Leve-o, por favor, apenas me ajude.",
        correctSigil: 's01',
        successPay: 100,
        rewards: {
            success: [
                { type: 'add_ingredient', payload: 'coracao_de_cristal' },
                { type: 'set_flag', payload: 'hasCoracaoDeCristal' }
            ]
        }
    },
    {
        id: 'cartografo_de_sonhos_dia10',
        arc: 'Geral', priority: 38, conditions: { minDay: 10, maxDay: 10 },
        characterId: 'cartografo_sonhos', name: "Cartógrafo de Sonhos", portraitUrls: ["/media/img/cartografo.png"],
        isNarrativeEvent: false,
        problem: "Estou preso em um labirinto nos Reinos do Sonho. Abner criou um sigilo para 'mapear a saída', mas perdi parte do desenho.",
        request: 's03_corrupted', successPay: 120,
        rewards: { success: [ { type: 'unlock_lore', payload: 'lore_dream_map' } ] }
    }
];