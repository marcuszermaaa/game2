/**
 * js/data/sigilData.js
 * -----------------
 * O GRIMÓRIO DE SÍMBOLOS ARCANOS
 * Este arquivo contém as definições de todos os sigilos do jogo.
 * Cada objeto define a aparência, o tipo e as propriedades de um sigilo,
 * servindo como o banco de dados para as telas de Análise e Minigame.
 * Esta é a versão final e completa, incluindo todos os sigilos de quest.
 */

export const SIGILS = {
    // --- SIGILOS PADRÃO (USÁVEIS PELO JOGADOR) ---
    s01: {
        id: 's01',
        name: 'Selo da Mente Tranquila',
        lore: 'Abner acreditava que a mente era um farol em um mar de caos. Este selo age como a lente do farol, focando a luz interior e mantendo as sombras afastadas.',
        type: 'Standard',
        startNode: { x: 0.5, y: 0.16 },
        segments: [
            { type: 'curve', end: { x: 0.83, y: 0.5 }, control: { x: 0.83, y: 0.16 } },
            { type: 'curve', end: { x: 0.5, y: 0.83 }, control: { x: 0.83, y: 0.83 } },
            { type: 'curve', end: { x: 0.16, y: 0.5 }, control: { x: 0.16, y: 0.83 } },
            { type: 'curve', end: { x: 0.5, y: 0.16 }, control: { x: 0.16, y: 0.16 } },
            { type: 'line', end: { x: 0.4, y: 0.4 } },
            { type: 'line', end: { x: 0.6, y: 0.4 } },
            { type: 'line', end: { x: 0.4, y: 0.6 } },
            { type: 'line', end: { x: 0.6, y: 0.6 } },
        ]
    },
    s02: {
        id: 's02',
        name: 'Glifo do Olhar Averso',
        lore: 'Um sigilo de desvio, projetado para repelir má sorte e intenções maliciosas. Usado com frequência por comerciantes e políticos de Port Blackwood.',
        type: 'Standard',
        startNode: { x: 0.5, y: 0.25 },
        segments: [
            { type: 'line', end: { x: 0.75, y: 0.75 } },
            { type: 'line', end: { x: 0.25, y: 0.75 } },
            { type: 'line', end: { x: 0.5, y: 0.25 } },
            { type: 'line', end: { x: 0.5, y: 0.8 } },
        ]
    },
    s03: {
        id: 's03',
        name: 'Espiral da Percepção',
        lore: 'Não é um olho, é uma lente para a alma. Foca a percepção do usuário, permitindo-lhe ver verdades ocultas, ao custo de expô-lo a realidades que a mente humana não foi feita para suportar.',
        type: 'Standard',
        startNode: { x: 0.5, y: 0.5 },
        segments: [
            { type: 'curve', end: { x: 0.6, y: 0.45 }, control: { x: 0.6, y: 0.55 } },
            { type: 'curve', end: { x: 0.4, y: 0.35 }, control: { x: 0.5, y: 0.3 } },
            { type: 'curve', end: { x: 0.7, y: 0.65 }, control: { x: 0.25, y: 0.6 } },
            { type: 'curve', end: { x: 0.2, y: 0.75 }, control: { x: 0.65, y: 0.9 } },
        ]
    },
    s04: {
        id: 's04',
        name: 'Âncora da Realidade',
        lore: 'Para aqueles cujas mentes são levadas pela maré dos sussurros, esta âncora os prende firmemente à sanidade e ao plano físico.',
        type: 'Standard',
        startNode: { x: 0.5, y: 0.23 },
        segments: [
            { type: 'line', end: { x: 0.5, y: 0.66 } },
            { type: 'curve', end: { x: 0.75, y: 0.66 }, control: { x: 0.625, y: 0.85 } },
            { type: 'curve', end: { x: 0.25, y: 0.66 }, control: { x: 0.5, y: 0.85 } },
            { type: 'line', end: { x: 0.5, y: 0.66 } },
            { type: 'curve', end: { x: 0.5, y: 0.18 }, control: { x: 0.55, y: 0.205 } },
            { type: 'curve', end: { x: 0.5, y: 0.23 }, control: { x: 0.45, y: 0.205 } },
        ]
    },
    s06: {
        id: 's06',
        name: 'Escudo do Marinheiro',
        lore: 'Um símbolo de poder sobre o mar, usado para garantir travessias seguras e para conter energias instáveis.',
        type: 'Standard',
        startNode: { x: 0.5, y: 0.3 },
        segments: [
            { type: 'curve', end: { x: 0.2, y: 0.3 }, control: { x: 0.35, y: 0.1 } },
            { type: 'curve', end: { x: 0.8, y: 0.3 }, control: { x: 0.5, y: 0.1 } },
            { type: 'line', end: { x: 0.5, y: 0.3 } },
            { type: 'line', end: { x: 0.5, y: 0.8 } },
            { type: 'line', end: { x: 0.3, y: 0.6 } },
            { type: 'line', end: { x: 0.5, y: 0.8 } },
            { type: 'line', end: { x: 0.7, y: 0.6 } },
        ]
    },

    // --- SIGILOS CORROMPIDOS (Apresentados para Análise) ---
    s01_corrupted: {
        id: 's01_corrupted', name: 'Selo da Mente Tranquila (Corrompido)', type: 'Corrupted', correctVersion: 's01',
        instabilityPoints: [ { x: 0.65, y: 0.2, note: "A curva superior está assimétrica, puxando a energia para fora." }, { x: 0.5, y: 0.83, note: "A base foi substituída por uma linha reta, quebrando o ciclo de proteção." } ],
        startNode: { x: 0.5, y: 0.16 }, segments: [ { type: 'curve', end: { x: 0.83, y: 0.5 }, control: { x: 0.7, y: 0.2 } }, { type: 'line', end: { x: 0.5, y: 0.83 } }, { type: 'curve', end: { x: 0.16, y: 0.5 }, control: { x: 0.2, y: 0.7 } }, ]
    },
    s03_corrupted: {
        id: 's03_corrupted', name: 'Espiral da Percepção (Corrompida)', type: 'Corrupted', correctVersion: 's03',
        instabilityPoints: [ { x: 0.45, y: 0.5, note: "A espiral está se fechando em si mesma, criando um loop de feedback psíquico." } ],
        startNode: { x: 0.5, y: 0.5 }, segments: [ { type: 'curve', end: { x: 0.6, y: 0.55 }, control: { x: 0.6, y: 0.45 } }, { type: 'curve', end: { x: 0.45, y: 0.45 }, control: { x: 0.5, y: 0.35 } }, ]
    },
    s06_corrupted: {
        id: 's06_corrupted', name: 'Escudo do Marinheiro (Corrompido)', type: 'Corrupted', correctVersion: 's06',
        instabilityPoints: [ { x: 0.3, y: 0.8, note: "A base do tridente está invertida, simbolizando submissão ao mar em vez de domínio." } ],
        startNode: { x: 0.5, y: 0.7 }, segments: [ { type: 'curve', end: { x: 0.2, y: 0.4 }, control: { x: 0.3, y: 0.8 } }, { type: 'line', end: { x: 0.5, y: 0.2 } }, { type: 'line', end: { x: 0.8, y: 0.4 }, control: { x: 0.7, y: 0.8 } } ]
    },
    s10_corrupted_shroud: {
        id: 's10_corrupted_shroud', name: 'Manto do Desvio (Corrompido)', type: 'Corrupted', correctVersion: 's10',
        lore: 'Um sigilo que visa desviar a atenção. A versão corrompida, no entanto, atrai atenção indesejada de... outros lugares.',
        startNode: { x: 0.1, y: 0.1 }, segments: [ { type: 'line', end: { x: 0.9, y: 0.9 } }, { type: 'line', end: { x: 0.1, y: 0.9 } }, { type: 'line', end: { x: 0.9, y: 0.1 } }, { type: 'line', end: { x: 0.1, y: 0.1 } } ]
    },
    s11_draining_ward: {
        id: 's11_draining_ward', name: 'Ala Drenante', type: 'Corrupted', correctVersion: null,
        lore: 'Um sigilo parasítico que drena a vitalidade e a energia arcana ao seu redor para sustentar o portador.',
        startNode: { x: 0.5, y: 0.5 }, segments: [ { type: 'line', end: { x: 0.5, y: 0.1 } }, { type: 'line', end: { x: 0.1, y: 0.8 } }, { type: 'line', end: { x: 0.9, y: 0.8 } }, { type: 'line', end: { x: 0.5, y: 0.1 } } ]
    },

    // ✨ NOVO SIGILO DE QUEST PARA A SRA. PICKMAN ✨
    s12_birthing_rune_corrupted: {
        id: 's12_birthing_rune_corrupted',
        name: 'Runa do Nascimento (Profana)',
        type: 'Corrupted', // É inerentemente corrompida
        correctVersion: null, // Não há versão "boa" para esta ação
        lore: 'Um sigilo biológico e perverso. Ele não manipula a sorte ou a mente, mas a própria carne, preparando um hospedeiro para se tornar um receptáculo para uma linhagem não-humana.',
        instabilityPoints: [
            { x: 0.5, y: 0.5, note: "O núcleo do sigilo pulsa com uma energia faminta. Ele não está canalizando poder, está criando um útero." },
            { x: 0.8, y: 0.8, note: "Esta runa não é de proteção, é de dissolução. Ela quebra a estrutura humana para reconstruí-la em algo... outro." }
        ],
        // Design visual que lembra um óvulo ou célula sendo perfurado por formas espirais.
        startNode: { x: 0.5, y: 0.2 },
        segments: [
            { type: 'curve', end: { x: 0.8, y: 0.5 }, control: { x: 0.8, y: 0.2 } },
            { type: 'curve', end: { x: 0.5, y: 0.8 }, control: { x: 0.8, y: 0.8 } },
            { type: 'curve', end: { x: 0.2, y: 0.5 }, control: { x: 0.2, y: 0.8 } },
            { type: 'curve', end: { x: 0.5, y: 0.2 }, control: { x: 0.2, y: 0.2 } },
            { type: 'line', end: { x: 0.1, y: 0.1 } },
            { type: 'line', end: { x: 0.5, y: 0.5 } },
            { type: 'line', end: { x: 0.9, y: 0.9 } }
        ]
    },

    // --- SIGILOS PROIBIDOS ---
    s05_prohibited: {
        id: 's05_prohibited', name: 'O Olho que se Abre', type: 'Prohibited', correctVersion: null,
        lore: 'Um sigilo que não apenas foca a percepção, mas a rasga, abrindo uma fenda direta no Véu. Abner considerava seu uso um ato de suicídio espiritual.',
        startNode: { x: 0.2, y: 0.5 }, segments: [ { type: 'curve', end: { x: 0.8, y: 0.5 }, control: { x: 0.5, y: 0.2 } }, { type: 'curve', end: { x: 0.2, y: 0.5 }, control: { x: 0.5, y: 0.8 } }, { type: 'curve', end: { x: 0.5, y: 0.5 }, control: { x: 0.35, y: 0.5 } }, { type: 'curve', end: { x: 0.8, y: 0.5 }, control: { x: 0.65, y: 0.5 } }, ]
    },

    // --- SIGILOS ESPECIAIS DE TRAMA ---
    sigil_astaroth: {
        id: 'sigil_astaroth', name: 'Sigilo de Astaroth (O Olho Cego)', type: 'Quest',
        lore: 'Um sigilo lendário, mais um mapa de circuito arcano do que um símbolo. Ele usa um hospedeiro humano como fechadura para abrir um portão para uma entidade.',
        startNode: { x: 0.5, y: 0.1 },
        segments: [
            { type: 'line', end: { x: 0.9, y: 0.5 } }, { type: 'line', end: { x: 0.5, y: 0.9 } }, { type: 'line', end: { x: 0.1, y: 0.5 } }, { type: 'line', end: { x: 0.5, y: 0.1 } },
            { type: 'line', end: { x: 0.5, y: 0.3 } }, { type: 'line', end: { x: 0.7, y: 0.5 } }, { type: 'line', end: { x: 0.5, y: 0.7 } }, { type: 'line', end: { x: 0.3, y: 0.5 } }, { type: 'line', end: { x: 0.5, y: 0.3 } },
            { type: 'line', end: { x: 0.5, y: 0.9 } }, { type: 'line', end: { x: 0.3, y: 1.0 } },
            { type: 'line', end: { x: 0.5, y: 0.9 } }, { type: 'line', end: { x: 0.7, y: 1.0 } },
            { type: 'line', end: { x: 0.1, y: 0.5 } }, { type: 'line', end: { x: 1.0, y: 0.3 } },
            { type: 'line', end: { x: 0.9, y: 0.5 } }, { type: 'line', end: { x: 0.0, y: 0.3 } },
        ]
    }
};