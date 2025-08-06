// js/data/events.js - VERSÃO CORRIGIDA (SEM A EXPORTAÇÃO DE 'FINAL_INVESTIGATION')

import { TUTORIAL_ARC } from './events_tutorial.js';
import { MAIN_EVENTS } from './events_main.js';
import { MORDECAI_ARC } from './events_mordecai.js';
import { ARMITAGE_ARC } from './events_armitage.js';
import { PICKMAN_ARC } from './events_pickman.js';
import { CULTIST_ARC } from './events_cultists.js';

// A única exportação necessária é a lista mestra que combina todos os arcos.
export const ALL_EVENTS = [
   ...TUTORIAL_ARC,
    ...MAIN_EVENTS,
    ...MORDECAI_ARC,
    ...ARMITAGE_ARC,
    ...PICKMAN_ARC,
    // ✨ 2. ADICIONA O NOVO ARCO À LISTA ✨
    ...CULTIST_ARC,
];