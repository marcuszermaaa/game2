/**
 * js/data/events_armitage.js
 * -----------------
 * VERSÃO CANÔNICA DEFINITIVA - O ARCO DO OLHO CEGO (TRAMA COMPLETA)
 * Este arquivo contém a saga completa do Professor Armitage, incluindo
 * todos os personagens de apoio, o evento do Pesadelo, a investigação Point & Click,
 * a "Semana do Acerto de Contas" e o clímax com múltiplos finais.
 */

export const ARMITAGE_ARC = [
    // --- ATO 1: A MANIPULAÇÃO SUTIL E A COLETA DE PISTAS ---

    // DIA 3: Armitage se apresenta como um aliado e introduz a mecânica de criação.
    {
       id: 'prof_armitage_workbench_intro',
       arc: 'Armitage',
       priority: 200,
       conditions: { minDay: 3, maxDay: 3, requiresEvent: 'intro_arthur' },
       characterId: 'prof_armitage',
       name: "Prof. Armitage",
       portraitUrls: [ "/media/img/professor_neutral.png", "/media/img/professor_serious.png" ], 
       isNarrativeEvent: true,
       narrativeFlow: {
           startNode: 'dialogue_1',
           nodes: {
               'dialogue_1': { type: 'dialogue', text: "Elias, um avanço. Nos pertences de Abner, encontrei isto.", portraitIndex: 0, nextNode: 'dialogue_2' },
               'dialogue_2': { type: 'dialogue', text: "(Ele lhe entrega um saquinho de couro úmido e pulsante). Ele o chamava de 'Bile de Profundo'.", portraitIndex: 0, nextNode: 'dialogue_3' },
               'dialogue_3': { type: 'dialogue', text: "Abner acreditava que a verdadeira tinta arcana não é encontrada, mas criada. Talvez você devesse investigar sua bancada.", portraitIndex: 1, nextNode: 'action_give_items' },
               'action_give_items': { 
                   type: 'action', 
                   actions: [ { type: 'add_ingredient', payload: 'bileDeProfundo' }, { type: 'unlock_lore', payload: 'abner_on_spirals' }, { type: 'trigger_menu_pulse', payload: 'item-workbench' } ], 
                   nextNode: 'outcome_end' 
               },
               'outcome_end': { type: 'outcome', title: "Um Presente Viscoso", text: "O Professor Armitage se despede, deixando o estranho ingrediente sobre o balcão.", nextNode: 'END_EVENT' }
           }
       }
    },

    // DIA 4: Armitage entrega o primeiro fragmento, aumentando seu envolvimento.
    {
        id: 'armitage_pressure',
        arc: 'Armitage',
        priority: 100,
        conditions: { minDay: 4, maxDay: 4, requiresEvent: 'prof_armitage_workbench_intro' },
        characterId: 'prof_armitage',
        name: "Prof. Armitage",
        portraitUrls: [ "/media/img/professor.png", "/media/img/professor_serious.png" ], 
        isNarrativeEvent: true,
        narrativeSequence: [
           { text: "Elias, que bom vê-lo. Encontrei o que acredito ser o primeiro fragmento do sigilo que procuramos. Guarde-o bem.", portraitIndex: 1 }
        ],
        action: { type: 'add_multiple', payload: [ { type: 'add_special_item', payload: 'sigil_fragment_1' }, { type: 'trigger_menu_pulse', payload: 'item-book' } ] }
    },
    
    // DIA 4: Zadok Allen aparece, fornecendo a ferramenta e a pista crucial para o Point & Click.
    {
       id: 'zadok_allen_intro',
       arc: 'Armitage',
       priority: 105,
       conditions: { minDay: 4, maxDay: 4, requiresEvent: 'armitage_pressure' },
       characterId: 'zadok_allen',
       name: "Zadok Allen",
       portraitUrls: ["/media/img/mendigo.png"],
       isNarrativeEvent: true,
       narrativeFlow: {
           startNode: 'dialogue_1',
           nodes: {
               'dialogue_1': { type: 'dialogue', text: "(Um homem velho, cheirando a maresia, tropeça para dentro.) Você... você tem o olhar dele. O olhar de Abner.", portraitIndex: 0, nextNode: 'dialogue_2' },
               'dialogue_2': { type: 'dialogue', text: "O velho Abner... ele temia o olho... o olho que não pisca. Ele o escondeu, ele o quebrou... usava isto para ver as costuras...", portraitIndex: 0, nextNode: 'action_give_item' },
               'action_give_item': { 
                   type: 'action', 
                   actions: [ { type: 'add_special_item', payload: 'broken_lens' }, { type: 'trigger_menu_pulse', payload: 'item-book' } ], 
                   nextNode: 'outcome_end' 
               },
               'outcome_end': { type: 'outcome', title: "Delírios de um Bêbado", text: "O velho resmunga algo ininteligível e sai cambaleando, deixando para trás uma lente quebrada.", nextNode: 'END_EVENT' }
           }
       }
    },

    // DIA 6: Kett entrega o segundo fragmento, solidificando a desconfiança.
    {
       id: 'kett_gives_fragment',
       arc: 'Armitage',
       priority: 110,
       conditions: { minDay: 6, maxDay: 6, requiresEvent: 'zadok_allen_intro' },
       name: "Uma Entrega Urgente",
       isNarrativeEvent: true,
       narrativeSequence: [
           { text: "Uma carta selada com o sinete da biblioteca chega. Dentro, um pedaço de pergaminho antigo e um bilhete apressado de Kett." },
           { text: "'Abner me confiou isto. Ele temia a obsessão de Armitage. Cuidado, Elias.'" }
       ],
       action: { type: 'add_multiple', payload: [ { type: 'add_special_item', payload: 'sigil_fragment_2' }, { type: 'trigger_menu_pulse', payload: 'item-mail' } ] }
    },

    // DIA 7: O "Olho Ansioso", pupilo de Armitage, força uma escolha moral.
    {
        id: 'olho_ansioso',
        arc: 'Armitage',
        priority: 120,
        conditions: { minDay: 7, maxDay: 7, requiresEvent: 'kett_gives_fragment' },
        characterId: 'olho_ansioso', 
        name: "O Olho Ansioso", 
        portraitUrls: ["/media/img/estudioso_palido.png", "/media/img/estudioso_palido_insano.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'initial_request',
            nodes: {
                'initial_request': { type: 'dialogue', text: "O mestre... Professor Armitage... disse que você poderia me ajudar. Preciso ver além. Ele mencionou uma espiral...", portraitIndex: 0, nextNode: 'player_choice' },
                'player_choice': {
                    type: 'choice', title: "A Espiral da Percepção", text: "Você sabe qual sigilo ele quer. Dar isso a uma mente instável parece... imprudente.",
                    options: [
                        { text: "[Recusar] Isso é perigoso. Não farei este sigilo.", nextNode: 'outcome_refuse' },
                        { text: "[Persuadir] A espiral é instável. Um Selo da Mente Tranquila o ajudaria a focar.", nextNode: 'persuade_attempt' },
                        { text: "[Ceder] Se é o que o Professor deseja... (-15 Sanidade)", style: 'danger', isTransgressiveChoice: true, nextNode: 'action_accept_dangerous' }
                    ]
                },
                'outcome_refuse': { type: 'outcome', title: "Recusa Prudente", text: "Você explica os perigos. O estudioso recua, desapontado, mas intacto.", nextNode: 'END_EVENT' },
                'persuade_attempt': { type: 'dialogue', text: "Não! O Mestre foi claro! A ESPIRAL! Você acha que sou fraco? Eu preciso ver!", portraitIndex: 1, nextNode: 'player_final_choice' },
                'player_final_choice': {
                    type: 'choice', title: "Ele está irredutível", text: "Sua tentativa de ajudar foi rejeitada.",
                    options: [
                        { text: "[Manter a recusa]", nextNode: 'outcome_refuse' },
                        { text: "[Ceder] Faça como quiser... (-15 Sanidade)", style: 'danger', isTransgressiveChoice: true, nextNode: 'action_accept_dangerous' }
                    ]
                },
                'action_accept_dangerous': { type: 'action', actions: [ { type: 'change_sanity', payload: -15 }, { type: 'update_history', payload: { outcome: 'tattooed_spiral' } } ], nextNode: 'outcome_accepted' },
                'outcome_accepted': { type: 'outcome', title: "Vontade Quebrada", text: "Você cede e desenha a espiral. Ao terminar, os olhos do estudioso se arregalam com um terror extasiado. Ele sai correndo, rindo para si mesmo.", nextNode: 'END_EVENT' }
            }
        }
    },

    // --- ATO 2: A REVELAÇÃO SUBCONSCIENTE ---

    // DIA 7 (NOITE) OU DIA 8: O evento do Pesadelo inicia a fase de investigação.
    {
        id: 'player_nightmare_event',
        arc: 'Armitage',
        priority: 9998,
        conditions: { minDay: 7, maxDay: 8, requiresEvent: 'olho_ansioso' },
        name: "O Pesadelo Conectado",
        isNarrativeEvent: true,
        portraitUrls: [ "/media/img/nightmare_art.png", "/media/img/player_awake.png", "/media/img/sigil_fragments_art.png", "/media/img/astaroth_sigil_art.png", "/media/img/journal_idea.png" ],
        narrativeFlow: {
            startNode: 'nightmare_1',
            nodes: {
                'nightmare_1': { type: 'dialogue', text: "(O pesadelo retorna, mais vívido do que nunca... a cidade submersa, o olho colossal...)", portraitIndex: 0, nextNode: 'nightmare_2' },
                'nightmare_2': { type: 'dialogue', text: "(Você acorda em um suor frio, o coração martelando no peito. O sino abissal ainda ecoa em sua mente.)", portraitIndex: 1, nextNode: 'assemble_sigil' },
                'assemble_sigil': { type: 'dialogue', text: "(Seu olhar recai sobre os dois fragmentos de pergaminho. Sua mente, febril, os vê se unindo, mas uma peça claramente falta... uma peça que você sente que está... perto.)", portraitIndex: 2, nextNode: 'realization_1' },
                'realization_1': { type: 'dialogue', text: "(A forma quase completa é inconfundível. É o Olho. O conduíte de Armitage. Kett estava certa. Abner não queria usá-lo, ele queria detê-lo...)", portraitIndex: 3, nextNode: 'realization_2' },
                'realization_2': { type: 'dialogue', text: "(As palavras de Zadok ecoam: 'ele o escondeu... usava isto para ver as costuras...'. A resposta para encontrar o último fragmento está aqui, no estúdio.)", portraitIndex: 4, nextNode: 'final_choice' },
                'final_choice': { type: 'choice', title: "O Momento da Verdade", text: "Não haverá clientes hoje. Apenas a verdade. A resposta final deve estar aqui.", options: [{ text: "[Trancar a porta e iniciar a investigação]", nextNode: 'action_start_investigation' }] },
                'action_start_investigation': { type: 'action', actions: [ { type: 'change_sanity', payload: -10 }, { type: 'start_point_and_click' } ] }
            }
        }
    },
    
    // --- ATO 3: A SEMANA DO ACERTO DE CONTAS ---

    // DIA 8+: O ULTIMATO. Acionado após o jogador montar o sigilo na bancada.
    {
        id: 'armitage_the_demand',
        arc: 'Armitage',
        priority: 9999,
        conditions: { minDay: 8, requiresFlag: 'astarothSigilAssembled' },
        characterId: 'prof_armitage',
        name: "Professor Armitage",
        portraitUrls: ["/media/img/professor_demanding.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'arrival',
            nodes: {
                'arrival': { type: 'dialogue', text: "(Armitage aparece em seu estúdio. Sua fachada amigável desapareceu.)", portraitIndex: 0, nextNode: 'demand' },
                'demand': { type: 'dialogue', text: "Você conseguiu. Sinto a ressonância. O Sigilo de Astaroth está completo. Agora, você vai terminar o trabalho.", portraitIndex: 0, nextNode: 'ultimatum' },
                'ultimatum': { type: 'dialogue', text: "Prepare-se. No décimo dia, ao anoitecer, você realizará o ritual em mim. Quer queira, quer não.", portraitIndex: 0, nextNode: 'action_start_countdown' },
                'action_start_countdown': {
                    type: 'action',
                    actions: [ { type: 'set_flag', payload: 'armitageUltimatumActive' }, { type: 'unlock_lore', payload: 'lore_abners_final_warning' }, { type: 'trigger_menu_pulse', payload: 'item-book' } ],
                    nextNode: 'outcome_countdown'
                },
                'outcome_countdown': { type: 'outcome', title: "O Ultimato", text: "Ele sai, deixando um silêncio pesado. Você está preso. A contagem regressiva começou, mas a anotação de Abner pode ser sua única saída.", nextNode: 'END_EVENT' }
            }
        }
    },
    
    // DIAS 8-10: VIGILÂNCIA. Evento repetível que aumenta a pressão.
    {
        id: 'armitage_guardian_watch',
        arc: 'Armitage',
        priority: 150,
        conditions: { minDay: 8, maxDay: 10, requiresFlag: 'armitageUltimatumActive' },
        characterId: 'olho_ansioso',
        name: "O Vigia",
        portraitUrls: ["/media/img/estudioso_palido.png"],
        isNarrativeEvent: true,
        narrativeSequence: [
            { text: "(O 'Olho Ansioso' entra no estúdio. Ele não quer uma tatuagem. Ele apenas se senta em um canto e observa você trabalhar, em silêncio.)" },
            { text: "(Sua presença é uma constante e enervante lembrança de que seu tempo está acabando.)" }
        ],
        action: { type: 'change_sanity', payload: -3 }
    },
    
    // NOITE DO DIA 10: O RITUAL FINAL. Acionado pelo gameCore.
    {
        id: 'armitage_final_ritual',
        arc: 'Armitage',
        conditions: { minDay: 10, maxDay: 10, requiresFlag: 'armitageUltimatumActive' },
        characterId: 'prof_armitage',
        name: "O Ritual",
        portraitUrls: ["/media/img/professor_ritual.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'summons',
            nodes: {
                'summons': { type: 'dialogue', text: "(Ao fechar a porta para a noite, você encontra Armitage esperando. As sombras estão mais profundas.) A hora chegou. Sem mais atrasos.", portraitIndex: 0, nextNode: 'player_choice' },
                'player_choice': {
                    type: 'choice', title: "A Escolha Final", text: "Este é o momento. O conhecimento de Abner contra a ambição de Armitage. O poder de abrir o Véu, ou o sacrifício para selá-lo.",
                    options: [
                        { text: "[Tatuar Armitage com o Sigilo de Astaroth]", nextNode: 'action_chaos_ending' },
                        { text: "[Usar a Tinta do Banimento]", style: 'danger', nextNode: 'action_sacrifice_ending' }
                    ]
                },
                'action_chaos_ending': { type: 'action', actions: [{ type: 'goto_page', payload: '/armitage_transformation.html' }] },
                'action_sacrifice_ending': {
                    type: 'action',
                    actions: [{ type: 'check_inventory', item: 'ink_of_banishment',
                        ifPresent: { type: 'goto_page', payload: '/banishment_ritual.html' },
                        ifNotPresent: { type: 'goto_page', payload: '/bad_ending_unprepared.html' }
                    }]
                }
            }
        }
    }
];