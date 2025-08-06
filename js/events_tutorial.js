export const TUTORIAL_ARC = [
    {
        id: 'intro_legado',
        arc: 'Tutorial',
        priority: 1000,
        conditions: { minDay: 1, maxDay: 1 }, // Acontece apenas no Dia 1
        isNarrativeEvent: true,
        name: "A Herança de Abner",
        narrativeSequence: [{ text: "Port Blackwood. O estúdio é exatamente como seu tio descreveu..." }]
    },
    {
        id: 'intro_armitage',
        arc: 'Tutorial',
        priority: 990,
        conditions: { minDay: 1, maxDay: 1, requiresEvent: 'intro_legado' }, // Acontece após o evento legado
        characterId: 'prof_armitage',
        isNarrativeEvent: true,
        name: "Prof. Armitage",
        portraitUrls: ["/media/img/professor.png"],
      narrativeFlow: {
           startNode: 'dialogue_1',
           nodes: {
               'dialogue_1': { type: 'dialogue', text: "Você deve ser Elias. Eu era um... colega do seu tio Abner. Ele me pediu para lhe entregar isto caso o pior acontecesse. Este livro contém algumas das respostas que ele encontrou. Estude-o. Você vai precisar.", portraitIndex: 0, nextNode: 'action_give_lore' },
               'action_give_lore': { type: 'action', actions: [{ type: 'unlock_lore', payload: 'abner_diary_1' }], nextNode: 'outcome_end' },
               'outcome_end': { type: 'outcome', title: "Uma Pesada Herança", text: "O Professor se despede, deixando você com o pesado diário de seu tio e mais perguntas do que respostas.", nextNode: 'END_EVENT' }
           }
       }
    },
   {
    id: 'intro_arthur',
    arc: 'Tutorial',
    priority: 980,
    conditions: { minDay: 1, maxDay: 1, requiresEvent: 'intro_armitage' },
    characterId: 'arthur_estudante',
    name: "Arthur, o Estudante",
    // IMPORTANTE: isNarrativeEvent é false porque o evento REQUER uma ação interativa
    // do jogador (abrir o diário) após a conversa inicial.
    isNarrativeEvent: false, 
    portraitUrls: ["/media/img/estudante.png", "/media/img/estudante_perdido.png"],
    correctSigil: 's04', // Mantemos os dados do minigame aqui
    successPay: 60, failPay: 0, wrongPay: 20,
    
    // Este fluxo de narrativa será executado na PRIMEIRA vez que você encontrar Arthur.
    narrativeFlow: {
        startNode: 'arrival',
        nodes: {
            'arrival': { type: 'dialogue', text: "Por favor... você precisa me ajudar. Eu não aguento mais.", portraitIndex: 1, nextNode: 'player_inquiry' },
            
            'player_inquiry': { type: 'choice', title: "O que você responde?", text: "Arthur parece genuinamente aterrorizado. Suas mãos tremem.", 
                options: [ 
                    { text: "[Acalme-se] O que está acontecendo?", nextNode: 'arthur_explains' }, 
                    { text: "[Seja direto] Que tipo de ajuda você precisa?", nextNode: 'arthur_explains' } 
                ] 
            },

            'arthur_explains': { type: 'dialogue', text: "É como se a maré estivesse subindo na minha cabeça. Ouço vozes nos sussurros do oceano. Sinto que estou me afogando em meus próprios pensamentos.", portraitIndex: 1, nextNode: 'abner_suggestion' },
            
            'abner_suggestion': { type: 'dialogue', text: "Seu tio... Abner... ele me disse que havia uma forma de se prender à realidade. Um símbolo. Uma âncora.", portraitIndex: 0, nextNode: 'player_agreement' },
            
            'player_agreement': { type: 'choice', title: "A Âncora da Realidade", text: "Você reconhece a descrição. A palavra 'âncora' ecoa em sua mente.", 
                options: [ 
                    { text: "[Concordar] Eu posso fazer isso por você.", nextNode: 'action_accept_work' } 
                ] 
            },
            
            // Este nó executa a lógica de fundo (salvar no histórico)
            'action_accept_work': { 
                type: 'action', 
                actions: [ 
                    { type: 'update_history', payload: { outcome: 'accepted_normal', notes: 'Concordou em tatuar a Âncora da Realidade.' } } 
                ], 
                nextNode: 'outcome_accepted' // Em seguida, vai para a tela de resultado
            },

            // Este nó exibe a mensagem de confirmação para o jogador
            'outcome_accepted': {
                type: 'outcome',
                title: "Trabalho Aceito",
                text: "Arthur assente, um vislumbre de alívio em seus olhos. Agora você precisa selecionar o sigilo correto em seu diário.",
                nextNode: 'END_EVENT' // Encerra a parte narrativa do evento
            }
        }
    }
},
];