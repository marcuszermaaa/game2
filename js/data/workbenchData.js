/**
 * js/data/workbenchData.js
 * -----------------
 * O LIVRO DE RECEITAS ARCANAS
 * Este arquivo define todos os componentes da mecânica de criação:
 * os ingredientes básicos (ELEMENTOS), os itens que podem ser fabricados (ITENS_CRIADOS),
 * e as combinações necessárias para criá-los (RECEITAS).
 */

// --- 1. INGREDIENTES BÁSICOS (ITENS DE COLETA) ---
export const ELEMENTOS = {
    // Ingredientes Raros de Arcos Narrativos
    "bileDeProfundo": { descricao: "Uma secreção viscosa e iridescente de uma criatura abissal. Pulsa com energia latente." },
    "ossoDeProfundo": { descricao: "Um fragmento de osso poroso de uma criatura das profundezas. Parece absorver a luz." },
    "cristal_de_kadath": { descricao: "Um cristal translúcido que não refrata a luz, mas a dobra de maneiras impossíveis. Parece vibrar com o som de sonhos." },
    
    // Ingredientes Comuns de Clientes
    "poeiraEstelar": { descricao: "O brilho residual de estrelas mortas. Carrega uma aura de ordem e destino." },
    "fragmentoDeCometa": { descricao: "Um caco de um corpo celeste errante. Volátil e carregado com a energia do caos." },
    "seivaDeYggdrasil": { descricao: "A essência dourada e espessa de uma árvore que conecta mundos. Cheira a terra antiga e ozônio." },
    "póDeSonhos": { descricao: "Partículas iridescentes coletadas de reinos oníricos. Imprevisível e potente." },
    "agua_purificada": { descricao: "Água benta, livre de impurezas físicas e espirituais. Uma base estável para qualquer mistura." },
    "sabao_especial": { descricao: "Sabão feito com ervas raras que acalmam a pele e o espírito. Essencial para soluções calmantes." },

    // Ingrediente de Sacrifício
    "sangue_do_tatuador": { descricao: "Sua própria essência vital. O catalisador supremo para a arte arcana, usado apenas no mais absoluto desespero." }
};


// --- 2. ITENS QUE PODEM SER FABRICADOS ---
export const ITENS_CRIADOS = {
    // Tintas Especiais
    "tintaDaClarividencia": { 
        name: "Tinta da Clarividência", 
        description: "Uma tinta que brilha com uma luz interior. Aprimora sigilos de percepção e revelação, mas é instável." 
    },
    "tintaDoAbismo": { 
        name: "Tinta do Abismo", 
        description: "Uma tinta oleosa e escura como a meia-noite. Garante que o resultado de um sigilo seja mais sombrio e potente." 
    },
    "ink_of_banishment": { 
        name: "Tinta do Banimento", 
        description: "Uma tinta feita de poder invertido e sacrifício. A única coisa capaz de selar o Sigilo de Astaroth." 
    },

    // Consumíveis Especiais
    "recarga_borrifador": {
        name: "Recarga de Borrifador de Lótus",
        description: "Uma dose de solução calmante para o Borrifador. Previne um evento de dor durante o minigame de tatuagem."
    },

    // Itens de Quest
    "sigil_astaroth_inert": {
        name: "Sigilo de Astaroth (Inerte)",
        description: "Os três fragmentos foram unidos. O sigilo está completo, mas dormente. Sua mera presença é opressiva."
    },
    "cristal_essencia_focada": {
        name: "Cristal de Essência Focada",
        description: "Sua própria dor, sanidade e força vital, cristalizadas. Ele pulsa com um calor fraco e emite um som que só você pode ouvir. É um farol para o que se esconde nas sombras."
    }
};


// --- 3. AS RECEITAS DE CRIAÇÃO ---
export const RECEITAS = [
    // --- Receitas Básicas (Disponíveis desde o início) ---
    { 
        combinacao: ["poeiraEstelar", "póDeSonhos"], 
        resultado: "tintaDaClarividencia" 
    },
    { 
        combinacao: ["bileDeProfundo", "ossoDeProfundo"], 
        resultado: "tintaDoAbismo" 
    },

    // --- Receitas Desbloqueáveis (Requerem 'unlock_recipe') ---
    { 
        id: 'receita_recarga_borrifador', // ID para ser desbloqueado
        combinacao: ["agua_purificada", "sabao_especial"], 
        resultado: "recarga_borrifador" 
    },
    {
        id: 'receita_cristal_essencia', // Desbloqueada por Mordecai
        combinacao: ["cristal_de_kadath", "póDeSonhos", "sangue_do_tatuador"],
        resultado: "cristal_essencia_focada",
        // Ação especial acionada ao criar este item
        onCraft: [
            { type: 'set_flag', payload: 'hasForgedTheCrystal' }
        ]
    },

    // --- Receitas de Quest do Arco Principal ---
    { 
        // Esta receita é para montar o sigilo, não para criar um item consumível.
        combinacao: ["sigil_fragment_1", "sigil_fragment_2", "sigil_fragment_3"], 
        resultado: "sigil_astaroth_inert",
        type: 'assembly', // Um tipo para diferenciar da criação normal, se necessário
        // Ação especial que acontece no instante em que o sigilo é montado.
        onCraft: [
            { type: 'unlock_lore', payload: 'lore_abners_final_warning' },
            { type: 'set_flag', payload: 'astarothSigilAssembled' }
        ]
    },
    {
        // A receita para a Tinta do Banimento, aprendida com Kett ou com a lore de Abner
        id: 'receita_tinta_banimento',
        combinacao: ["sigil_astaroth_inert", "sangue_do_tatuador"],
        resultado: "ink_of_banishment",
        type: 'crafting'
    }
];