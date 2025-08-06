export const MORDECAI_INVENTORY = {
    'formula_abismo': {
        id: 'formula_abismo',
        name: "Fórmula: Tinta do Abismo",
        description: "Um sussurro revela como misturar Bile de Profundo e Osso de Profundo. A tinta anseia pela escuridão.",
        cost: 15, // Custo em Sanidade
        type: 'recipe', // Tipo de item
        payload: 'tintaDoAbismo' // O ID da receita a ser desbloqueada
    },
    'sigilo_proibido_1': {
        id: 'sigilo_proibido_1',
        name: "Fragmento de Sigilo Proibido",
        description: "Contém o conhecimento de um sigilo que Abner considerava perigoso demais para ser desenhado.",
        cost: 20,
        type: 'sigil',
        payload: 's07_forbidden' // Um novo ID de sigilo que você precisará adicionar a sigilData.js
    },
    'essencia_em_vidro': {
        id: 'essencia_em_vidro',
        name: "Essência Vital em Vidro",
        description: "Às vezes, precisamos comprar de volta o que já era nosso. Um frasco com sua própria essência, purificada.",
        cost: 200, // ✨ CUSTO EM DINHEIRO ✨
        currency: 'money', // Moeda especial
        type: 'ingredient',
        payload: 'sangue_do_tatuador'
    },
    'agulha_sussurrante': {
        id: 'agulha_sussurrante',
        name: "Agulha Sussurrante",
        description: "Esta agulha de osso guia sua mão, mas cobra um pedágio da sua mente a cada uso.",
        cost: 25,
        type: 'upgrade',
        payload: 'agulha_sussurrante' // ID do upgrade
    },
};