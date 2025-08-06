/**
 * js/data/mailData.js
 * -----------------
 * VERSÃO CANÔNICA COMPLETA - O BANCO DE DADOS DE CORRESPONDÊNCIA
 * Contém todos os e-mails e cartas que o jogador pode receber, servindo como
 * uma ferramenta primária para a entrega de lore, início de quests e
 * desenvolvimento de personagens.
 */

export const MAILS = [
    // --- DIA 1 ---
    {
        id: 'abner_final_letter',
        sender: 'Seu falecido tio, Abner',
        subject: 'Se você está lendo isto...',
        content: 'Sobrinho,\n\nSe esta carta chegou até você, então meu tempo acabou. O estúdio agora é seu, assim como o fardo que ele carrega. A tinta não é comum. Os símbolos não são meros desenhos. Leia meu diário. Não confie em ninguém que ofereça conhecimento fácil. O verdadeiro poder exige sacrifício.\n\nTenha cuidado.\n-A.',
        receivedDay: 1
    },

    // --- DIA 2 ---
    {
        id: 'armitage_sigil_discovery',
        sender: 'Prof. Armitage',
        subject: 'Uma pequena descoberta',
        content: 'Elias,\n\nAnalisando as anotações de Abner que guardei, encontrei o esboço de um sigilo que ele classificava como "seguro", para repelir olhares indesejados. Estou lhe enviando uma cópia. Sinto que estamos apenas na superfície de algo muito maior.',
        receivedDay: 2,
        action: {
            type: 'add_multiple',
            payload: [
                { type: 'add_sigil', payload: 's02' },
                { type: 'unlock_lore', payload: 'veil_and_errors' }
            ]
        }
    },
    {
        id: 'letter_whispers',
        sender: 'Desconhecido',
        subject: 'Sussurros na Névoa',
        content: 'Eles dizem que a tinta tem memória.\nQue os símbolos que você cria ecoam nos planos inferiores.\nCuidado com o que você evoca.',
        receivedDay: 2,
        action: { type: 'change_sanity', payload: -5 }
    },
    
    // --- DIA 3 ---
    {
        id: 'kett_on_watchers',
        sender: 'Kett, a Bibliotecária',
        subject: 'Você não está sozinho',
        content: 'Elias,\n\nTenho sentido uma... estática... emanando do Véu ultimamente. Quero que saiba de algo que Abner me ensinou. Existem entidades que vivem no próprio tecido do Véu. Abner os chamava de "Observadores". Eles são atraídos pela energia que você libera. Se você sentir a sensação de estar sendo vigiado, são eles. A presença deles é um barômetro. Quanto mais eles se aproximam, mais fino o Véu está ficando.\n\n- Kett',
        receivedDay: 3,
        action: { 
            type: 'unlock_lore', 
            payload: 'the_watchers'
        }
    },

    // --- DIA 4 ---
    {
        id: 'gift_from_gideon',
        sender: 'Gideon, o Artesão',
        subject: 'Uma dívida de gratidão',
        content: 'Tatuador,\n\nA sua arte me livrou de um tormento que paralisava minhas mãos. Como um gesto de gratidão, estou lhe enviando um pequeno bônus. Ouvi dizer que a loja noturna às vezes tem itens que ajudam a firmar o pulso. Talvez isso ajude.\n\n- Gideon',
        receivedDay: 4,
        // Este e-mail só aparece se a flag 'helpedGideon' for verdadeira.
        // O EventManager precisaria de uma lógica para "eventos de e-mail".
        // Por enquanto, ele aparece no dia 4.
        action: { type: 'add_money', payload: 50 }
    },
    {
        id: 'kett_on_deep_ones',
        sender: 'Kett, a Bibliotecária',
        subject: 'Rumores do Cais 7',
        content: 'Elias,\n\nOuvi os estivadores falando sobre uma carga especial que chegou para Alistair Finch, vinda de Innsmouth. Sons de algo arranhando para sair. Isso me lembrou das anotações de Abner sobre os Profundos. Anexei as anotações dele. Se Finch está realmente contrabandeando um deles, isso é muito perigoso.\n\n- Kett',
        receivedDay: 4,
        action: { 
            type: 'add_multiple', 
            payload: [ 
                { type: 'unlock_bestiary', payload: 'deep_one' }, 
                { type: 'trigger_menu_pulse', payload: 'item-book' } 
            ] 
        }
    },

    // --- DIA 5 ---
    {
        id: 'kett_on_hooded_ones',
        sender: 'Kett, a Bibliotecária',
        subject: 'RE: Pedidos Perigosos',
        content: 'Elias,\n\nUm contato mencionou um aumento na atividade dos Acólitos do Olho Cego. Se um deles o procurou, entenda: eles não buscam conhecimento, buscam a aniquilação do eu. O sigilo que eles procuram, "O Olho que se Abre", não é uma ferramenta. É uma porta de mão única. Por favor, seja prudente.\n\n- Kett',
        receivedDay: 5,
        // Idealmente, a condição seria requiresEvent: 'cultista_desesperado_pedido'
        action: { 
            type: 'unlock_lore', 
            payload: 'abner_on_the_circle' 
        }
    },

    // --- DIA 6: O MANIFESTO DE ARMITAGE ---
    {
        id: 'armitage_manifesto',
        sender: 'Prof. Armitage',
        subject: 'Sobre a Natureza da "Loucura"',
        content: 'Elias,\n\nImagino que, ao lidar com os fragmentos e as anotações de seu tio, certas dúvidas possam ter surgido. Palavras como "perigo", "loucura". São termos usados pelos medíocres para descrever o que não compreendem.\n\nEles veem o Véu como uma muralha a ser defendida. Eu o vejo pelo que ele é: uma membrana permeável, um órgão sensorial. A "loucura" é a sobrecarga sensorial de uma mente despreparada tentando processar a verdadeira natureza da existência.\n\nO Sigilo de Astaroth não é uma chave para um monstro; é um diapasão para nos harmonizar com o cosmos, para nos tornarmos a antena que recebe o conhecimento universal. Abner temia ser um receptáculo. Eu anseio por isso. Não deixe que o medo paroquial o desvie do nosso grande trabalho.\n\nAtenciosamente,\nProfessor Armitage',
        receivedDay: 6,
        action: {
            type: 'add_multiple',
            payload: [
                { type: 'change_sanity', payload: -5 },
                { type: 'unlock_lore', payload: 'lore_armitage_philosophy' }
            ]
        }
    },

    // --- DIA 9: A PISTA FINAL DE KETT ---
    {
        id: 'kett_final_clue',
        sender: 'Kett, a Bibliotecária',
        subject: 'O Catalisador da Linhagem',
        content: 'Elias,\n\nArmitage está se movendo. Se a anotação de Abner sobre o sangue estiver correta, você precisará de um catalisador para focar sua energia. Ele o chamava de "Coração de Cristal". Não sei o que é, mas ele acreditava que era a chave para a Tinta do Banimento. O tempo está se esgotando.\n\n- Kett',
        receivedDay: 9,
        // Condição: requiresFlag: 'armitageUltimatumActive'
        action: { 
            type: 'add_multiple', 
            payload: [ 
                { type: 'unlock_recipe', payload: 'receita_tinta_banimento' }, 
                { type: 'trigger_menu_pulse', payload: 'item-workbench' } 
            ] 
        }
    }
];