// js/data/achievementData.js

export const ACHIEVEMENTS = {
    // ... (primeiro_passo e lore_master permanecem os mesmos)
 
primeiro_passo: {
    id: 'primeiro_passo',
    name: "O Primeiro Passo",
    description: "Conclua o arco narrativo do tutorial.",
    icon: "/media/img/icons/achievement_first_step.png",
    // ✨ NOVA CONDIÇÃO, MUITO MAIS ESPECÍFICA ✨
    condition: { type: 'arcCompleted', arcName: 'Tutorial' }
},ition: { type: 'countOutcome', outcome: 'success', count: 1 }
    ,
     lore_master: {
        id: 'lore_master',
        name: "Guardião dos Segredos",
        description: "Descubra 10 páginas de lore.",
        icon: "/media/icons/achievement_lore.png",
        condition: { type: 'countLore', count: 10 }
    },

    master_corrector: {
        id: 'master_corrector',
        name: "Mestre Corretor",
        description: "Corrija 5 sigilos corrompidos perfeitamente.",
        icon: "/media/icons/achievement_corrector.png",
        condition: { type: 'countOutcome', outcome: 'correct', requestType: 'Corrupted', count: 5 },
        // ✨ NOVA PROPRIEDADE ✨
        unlocksLore: 'achievement_lore_master_corrector'
    },
    corruption_spreader: {
        id: 'corruption_spreader', 
        name: "Agente do Caos",
        description: "Aceite 3 sigilos corrompidos.",
        icon: "/media/icons/achievement_chaos.png",
        condition: { type: 'countOutcome', outcome: 'accept_corrupted', count: 3 },
        // ✨ NOVA PROPRIEDADE ✨
        unlocksLore: 'achievement_lore_corruption_spreader'
    },
    guardian_of_the_veil: {
        id: 'guardian_of_the_veil',
        name: "Guardião do Véu",
        description: "Alcance o ranque máximo de Guardião, provando sua dedicação em proteger a realidade.",
        icon: "/media/icons/achievement_guardian.png",
        condition: { type: 'checkVeilStatus', rank: 'GUARDIAN' },
        // ✨ NOVA PROPRIEDADE ✨
        unlocksLore: 'achievement_lore_guardian_of_the_veil'
    },
    harbinger_of_oblivion: {
        id: 'harbinger_of_oblivion',
        name: "Arauto do Esquecimento",
        description: "Mergulhe nas profundezas da transgressão e alcance o ranque de Arauto.",
        icon: "/media/icons/achievement_harbinger.png",
        condition: { type: 'checkVeilStatus', rank: 'HARBINGER' },
        // ✨ NOVA PROPRIEDADE ✨
        unlocksLore: 'achievement_lore_harbinger_of_oblivion'
    }
};