// js/data/veilStatusData.js - VERSÃO FINAL E CORRETA

export const VEIL_STATUSES = {
    GUARDIAN: { name: "Guardião" },
    OBSERVER: { name: "Observador" },
    PRACTITIONER: { name: "Praticante" },
    TRANSGRESSOR: { name: "Transgressor" },
    HARBINGER: { name: "Arauto" }
};

// A função exportada se chama getPlayerVeilStatus
export function getPlayerVeilStatus(points) {
    if (points >= 50) return VEIL_STATUSES.GUARDIAN;
    if (points >= 25) return VEIL_STATUSES.OBSERVER;
    if (points <= -51) return VEIL_STATUSES.HARBINGER;
    if (points <= -25) return VEIL_STATUSES.TRANSGRESSOR;
    return VEIL_STATUSES.PRACTITIONER;
}