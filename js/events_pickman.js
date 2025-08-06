/**
 * js/data/events_pickman.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O ARCO DA FAMÍLIA PICKMAN ("SEMENTE DO ABISMO")
 * Este arquivo contém a saga completa da Sra. Pickman, desde seu pedido inicial
 * até as consequências finais de transformação ou perseguição.
 */

export const PICKMAN_ARC = [
    // --- ATO 1: O PEDIDO E SUAS CONSEQUÊNCIAS IMEDIATAS ---
    {
        id: 'sra_pickman_intro',
        arc: 'Pickman',
        priority: 40,
        conditions: { minDay: 2, maxDay: 2 },
        characterId: 'sra_pickman',
        name: "Sra. Pickman",
        portraitUrls: ["/media/img/herdeira.png"],
        isNarrativeEvent: false,
        narrativeFlow: {
            startNode: 'arrival',
            nodes: {
                'arrival': { type: 'dialogue', text: "(Sra. Pickman, fria, olha fixamente.) Meu rival, Alistair Finch, prospera de forma antinatural. Preciso que a sorte dele seja 'adversa' à minha.", portraitIndex: 0, nextNode: 'player_choice' },
                'player_choice': { 
                    type: 'choice', title: "O que você responde?", text: "A mulher fala de negócios, mas seus olhos sugerem algo mais perigoso.", 
                    options: [ 
                        { text: "[Concordar] Entendido. Um Glifo do Olhar Averso.", nextNode: 'action_accept_pickman_job' },
                        { text: "[Recusar] Não me envolvo nesse tipo de disputa.", style: 'danger', nextNode: 'action_refuse_pickman_job' }
                    ] 
                },
                'action_accept_pickman_job': { type: 'action', actions: [{ type: 'set_flag', payload: 'pickmanJobAccepted' }], nextNode: 'outcome_accepted_pickman' },
                'outcome_accepted_pickman': { type: 'outcome', title: "Contrato Selado", text: "Você concorda. Ela espera que você selecione o glifo correto para selar o destino de Finch.", nextNode: 'END_EVENT' },
                'action_refuse_pickman_job': { type: 'action', actions: [{ type: 'set_flag', payload: 'pickmanJobRefused' }], nextNode: 'outcome_refused_pickman' },
                'outcome_refused_pickman': { type: 'outcome', title: "Contrato Recusado", text: "Sra. Pickman lhe lança um olhar gelado. 'Você se arrependerá disso, tatuador'.", nextNode: 'END_EVENT' }
            }
        },
        correctSigil: 's02',
        successPay: 150, failPay: 10, wrongPay: 30,
        rewards: { success: [ { type: 'set_flag', payload: 'pickmanRivalFinchDead' } ] }
    },
    {
        id: 'finch_death_news',
        arc: 'Pickman',
        priority: 200,
        conditions: { minDay: 4, requiresFlag: 'pickmanRivalFinchDead' },
        name: "Notícias Sangrentas",
        isNarrativeEvent: true,
        narrativeSequence: [
            { text: "A manchete do jornal é brutal: 'MAGNATA DOS TRANSPORTES, ALISTAIR FINCH, ENCONTRADO DESPEDAÇADO NO CAIS 7'." },
            { text: "A reportagem fala de um 'ataque de animal'. O contêiner de Innsmouth foi encontrado aberto e vazio. Seu trabalho não apenas 'desviou a sorte'. Ele abriu uma jaula." }
        ],
        action: { type: 'add_multiple', payload: [ { type: 'change_sanity', payload: -10 }, { type: 'unlock_lore', payload: 'lore_finch_report' } ] }
    },

    // --- ATO 2: O CAMINHO DA TRANSFORMAÇÃO ---
    {
        id: 'pickman_transformation_1',
        arc: 'Pickman',
        priority: 70,
        conditions: { minDay: 5, requiresFlag: 'pickmanRivalFinchDead' },
        characterId: 'sra_pickman',
        name: "Sra. Pickman",
        portraitUrls: ["/media/img/herdeira_transform1.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'return',
            nodes: {
                'return': { type: 'dialogue', text: "(Sra. Pickman retorna. Há um brilho predatório em seus olhos e sua pele tem um tom pálido e úmido.) O 'acidente' de Finch foi proveitoso. Herdei sua... carga mais preciosa.", portraitIndex: 0, nextNode: 'revelation' },
                'revelation': { type: 'dialogue', text: "A Prole do Abismo agora busca um novo mestre. Para iniciar o vínculo, preciso de um sigilo que prepare meu corpo, que me torne um receptáculo digno.", portraitIndex: 0, nextNode: 'player_choice' },
                'player_choice': {
                    type: 'choice', title: "Um Pacto Profano", text: "Ela não quer se transformar em um monstro. Ela quer dar à luz a eles.",
                    options: [
                        { text: "[Recusar] Isso é uma abominação!", style: 'danger', nextNode: 'refuse_transformation' },
                        { text: "[Concordar] (-25 Sanidade) Mostre-me o sigilo.", nextNode: 'accept_transformation' }
                    ]
                },
                'refuse_transformation': { type: 'outcome', title: "Linha Traçada na Areia", text: "Ela ri, um som desumano. 'Tolo. Eu encontrarei outro. Mas agora você sabe demais.'", nextNode: 'END_EVENT' },
                'accept_transformation': {
                    type: 'action',
                    actions: [ { type: 'set_flag', payload: 'acceptedPickmanTransformation' } ],
                    nextNode: 'outcome_accepted_transformation'
                },
                'outcome_accepted_transformation': { type: 'outcome', title: "O Obstetra do Abismo", text: "Você concorda, a mente entorpecida. Ela lhe deixa um recado: 'Voltarei quando for a hora da próxima fase.'", nextNode: 'END_EVENT' }
            }
        }
    },
    {
        id: 'pickman_transformation_2',
        arc: 'Pickman',
        priority: 80,
        conditions: { minDay: 7, requiresFlag: 'acceptedPickmanTransformation' },
        characterId: 'sra_pickman',
        name: "Sra. Pickman",
        portraitUrls: ["/media/img/herdeira_transform2.png"], // Retrato mais deformado
        isNarrativeEvent: false, // É um evento interativo
        problem: "(Ela está visivelmente mudada. Sua postura é menos humana, mais predatória.) O tempo está próximo. A casca deve ser preparada. Este é o sigilo final. Faça-o. Agora.",
        // Este é um sigilo que o jogador não conhece. Ele é forçado a ir para a tela de Análise.
        request: 's12_birthing_rune_corrupted',
        successPay: 500, // Pagamento desesperado
        failPay: 0,
        wrongPay: 0, // Falhar não é uma opção para ela
        rewards: {
            success: [ { type: 'set_flag', payload: 'finalTattooCompleted' } ]
        }
    },
    {
        id: 'pickman_the_birthing_summons',
        arc: 'Pickman',
        priority: 1000,
        conditions: {
            minDay: 9,
            requiresFlag: 'finalTattooCompleted'
        },
        characterId: 'homem_de_terno',
        name: "O Convocador",
        portraitUrls: ["/media/img/homem_de_terno_transform.png"],
        isNarrativeEvent: true,
        narrativeFlow: {
            startNode: 'summons',
            nodes: {
                'summons': { type: 'dialogue', text: "(O Homem de Terno aparece em sua porta. Ele não fala, apenas aponta. Sua pele tem o mesmo brilho pálido da Sra. Pickman.) A Mestra... o chama. O momento chegou.", portraitIndex: 0, nextNode: 'decision' },
                'decision': {
                    type: 'choice', title: "O Chamado Final", text: "Você não tem escolha. Recusar agora significaria a morte. Você o segue até a mansão Pickman.",
                    options: [ { text: "[Ir para a Mansão]", nextNode: 'action_goto_mansion' } ]
                },
                'action_goto_mansion': {
                    type: 'action',
                    actions: [ { type: 'goto_page', payload: '/birthing_chamber.html' } ]
                }
            }
        }
    },

    // --- ATO 2: O CAMINHO DA PERSEGUIÇÃO ---
    {
        id: 'pickman_capanga_visita',
        arc: 'Pickman',
        priority: 50,
        conditions: { 
            minDay: 3, 
            requiresFlag: 'pickmanJobRefused',
            requiresFlagAbsence: 'pickmanJobAccepted' // Garante que não aconteça se você aceitou.
        },
        characterId: 'homem_de_terno',
        name: "Homem de Terno",
        portraitUrls: ["/media/img/homem_de_terno.png"],
        isNarrativeEvent: true,
        narrativeSequence: [
            { text: "(Um homem alto e bem-vestido entra no estúdio.) A Sra. Pickman está... desapontada com sua falta de cooperação.", portraitIndex: 0 },
            { text: "Ela acredita em segundas chances. E em garantir que seus investimentos não sejam ignorados. Considere esta a sua segunda chance.", portraitIndex: 0 }
        ],
        action: { type: 'set_flag', payload: 'pickmanCapangaVisited' }
    }
];