/**
 * js/data/bestiaryData.js
 * -----------------
 * O BESTIÁRIO DO OCULTISTA
 * Este arquivo contém as definições e a lore de todas as criaturas
 * e entidades não-humanas que o jogador pode encontrar ou sobre as quais pode aprender.
 */

export const BESTIARY = {
    // Desbloqueado pelo e-mail de Kett sobre o Cais 7
    'deep_one': {
        id: 'deep_one',
        name: 'Profundo (Habitante de Innsmouth)',
        description: 'Uma criatura humanoide com traços de peixe e anfíbio, pele cinza-esverdeada e úmida, e olhos grandes e fixos. As anotações de Abner sugerem que eles não são meras bestas, mas os membros de uma civilização submarina antiga e devota a entidades abissais. Eles são conhecidos por formar pactos com comunidades costeiras, oferecendo ouro e peixes em abundância em troca de... mestiçagem. Sua presença em Port Blackwood é um sinal extremamente preocupante.',
        imageUrl: '/media/img/bestiary_deep_one.png'
    },

    // Desbloqueado ao sobreviver à cena 'birthing_chamber.html'
    'pickman_brood_queen': {
        id: 'pickman_brood_queen',
        name: 'Rainha da Ninhada Pickman',
        description: 'O resultado final e grotesco da fusão da Sra. Pickman com a Prole do Abismo. Ela não é mais humana, mas sim o útero senciente de uma nova e profana linhagem. Seu corpo se tornou uma incubadora viva, e sua mente foi substituída por um instinto primal e predatório: expandir a ninhada. Ela é a manifestação física da ambição desmedida, um poder que não foi dominado, mas que a consumiu completamente.',
        imageUrl: '/media/img/bestiary_pickman_queen.png' // Você precisará criar esta arte
    },

    // Desbloqueado pela lore 'the_watchers'
    'watcher': {
        id: 'watcher',
        name: 'O Observador',
        description: 'Não é uma criatura de carne e osso, mas uma ondulação senciente no próprio Véu. Abner os descreve como seres de pura curiosidade, atraídos pela energia liberada por sigilos e mentes instáveis. Eles são inofensivos em si, mas sua presença visível é um sintoma terrível: significa que a barreira entre os mundos está perigosamente fina, quase transparente.',
        imageUrl: '/media/img/bestiary_watcher.png'
    },
    
    // Desbloqueado ao testemunhar o final do caos de Armitage
    'astaroth_manifestation': {
        id: 'astaroth_manifestation',
        name: 'Manifestação de Astaroth (O Olho Cego)',
        description: 'O resultado da ambição de Armitage. Não é a entidade Astaroth em si, mas sim um portal canceroso e vivo para o seu domínio. O corpo de Armitage se tornou a moldura de uma janela para o caos, uma ferida aberta na realidade que sangra entropia e loucura. É um poder descontrolado, sem mente ou propósito além de desfazer e consumir.',
        imageUrl: '/media/img/bestiary_astaroth.png'
    }
};