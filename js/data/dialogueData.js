export const DIALOGUES = {
    homem_apressado: {
        initial: {
            text: "Por favor, me diga o que você precisa com este símbolo.",
            options: [
                { text: "Parece um símbolo de proteção marinha, mas algo está errado com ele.", nextNode: 'dialogue_1a' },
                { text: "Um velho marinheiro? Que tipo de proteção ele buscava?", nextNode: 'dialogue_1b' }
            ]
        },
        dialogue_1a: {
            text: "Errado? Como assim? Ele disse que era o único! É urgente!",
            options: [
                { text: "As linhas estão invertidas. Isso pode atrair o oposto do que você quer.", nextNode: 'dialogue_2a' },
                { text: "O material do papel parece antigo...", nextNode: 'dialogue_1a_fallback' }
            ]
        },
        dialogue_1b: {
            text: "Proteção contra... bem, contra o que espreita nas marés. Coisas que não deveriam ver a luz do dia. E ele me deu este papel.",
            options: [
                { text: "Entendo. O sigilo parece corrompido. Posso tentar corrigi-lo.", action: 'correct', nextNode: 'dialogue_2a' },
                { text: "Marés? Coisas espreitando? Isso soa perigoso.", nextNode: 'dialogue_1b_fallback' }
            ]
        },
        dialogue_2a: {
            text: "Corrigir? Você pode fazer isso? Não tenho tempo para outra coisa!",
            options: [
                { text: "Sim, posso fazer o sigilo correto para você. (+5 Sanidade)", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Farei exatamente como pedido, corrompido ou não. (-20 Sanidade)", action: 'accept_corrupted', nextNode: 'dialogue_final' }
            ]
        },
        dialogue_1a_fallback: {
            text: "O papel? É apenas um papel velho! O que importa é o símbolo!",
            options: [
                 { text: "Talvez você tenha razão. O que você quer que eu faça?", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_1b_fallback: {
            text: "Perigoso? Sim, é por isso que preciso da proteção!",
            options: [
                { text: "Entendido. Vamos com o sigilo que você trouxe.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_final: {
            text: "A Âncora... sim. Farei isso. Obrigado.",
            options: [
                { text: "Pode deixar.", nextNode: null }
            ]
        }
    },

    arthur_estudante: {
        initial: {
            text: "Você parece aflito. Diga-me, o que são esses pensamentos que o atormentam?",
            options: [
                { text: "São como... vozes. Sussurros do fundo do mar, prometendo segredos.", nextNode: 'dialogue_voices' },
                { text: "Não são pensamentos, são sentimentos. Sinto que estou sendo arrastado para um lugar escuro e frio.", nextNode: 'dialogue_feelings' }
            ]
        },
        dialogue_voices: {
            text: "Vozes do mar... Abner escrevia sobre isso. Ele dizia que o oceano tem uma memória profunda e perigosa. A âncora serve para isolar sua mente desses ecos.",
            options: [
                { text: "Isolar... sim, é disso que preciso. Por favor, faça a âncora.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Mas e se os segredos que elas prometem forem reais?", nextNode: 'dialogue_temptation' }
            ]
        },
        dialogue_feelings: {
            text: "Entendo. É um medo de se perder, de se dissolver na escuridão. A âncora não é apenas um símbolo, é uma afirmação de que você pertence a este lugar, a esta realidade.",
            options: [
                { text: "Exato. Preciso me prender a algo sólido. Faça-a o mais forte que puder.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "E se esta realidade não for onde eu deveria estar?", nextNode: 'dialogue_temptation' }
            ]
        },
        dialogue_temptation: {
            text: "Esse é um caminho perigoso, Arthur. Alguns que buscaram esses segredos nunca mais voltaram os mesmos. A âncora é uma proteção, não uma prisão. A escolha é sua.",
            options: [
                { text: "Você está certo. É proteção que busco, não perdição. Faça o sigilo correto.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Vou arriscar. Faça o sigilo como Abner ensinou.", action: 'correct', nextNode: 'dialogue_final' }
            ]
        },
        dialogue_final: {
            text: "Entendido. Prepare-se. Farei uma âncora que nem as marés mais profundas poderão mover.",
            options: [ 
                { text: "Obrigado... eu confio em você.", nextNode: null }
            ]
        }
    },

    jonas_pescador: {
        initial: {
            text: "A arte de Abner... dizem que pode trazer a paz que busco. Você pode fazê-la?",
            options: [
                { text: "Este selo é para trazer calma às águas turbulentas. Posso fazê-lo.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Não posso prometer nada além da tinta e da agulha.", nextNode: 'dialogue_1a' }
            ]
        },
        dialogue_1a: {
            text: "Apenas a tinta e a agulha não bastam para o que enfrento...",
            options: [ { text: "Entendo. O selo original é forte. Farei o meu melhor.", action: 'correct', nextNode: 'dialogue_final' } ]
        },
        dialogue_final: {
            text: "Que os ventos e as marés estejam a seu favor.",
            options: [ { text: "Que assim seja.", nextNode: null } ]
        }
    },

    prof_armitage: {
        initial: {
            text: "Ah, um colega adepto das artes arcanas! Abner me disse que você poderia aprimorar este esboço de uma espiral de percepção.",
            options: [
                { text: "Interessante! Vejamos o que você tem.", nextNode: 'dialogue_1a' },
                { text: "Abner? Ele mencionou algo sobre este sigilo.", nextNode: 'dialogue_1b' }
            ]
        },
        dialogue_1a: {
            text: "A névoa em minha mente se dissipa com a sua compreensão. As linhas precisam de clareza.",
            options: [
                { text: "Compreendo. A clareza é a chave. Farei o sigilo como Abner o ensinou.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "A névoa pode ser um sinal de que você está perto de algo perigoso.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_1b: {
            text: "Sim, ele tem um profundo conhecimento sobre o alinhamento das energias. Este sigilo é vital para minha pesquisa.",
            options: [
                { text: "Estou ciente. Abner me instruiu sobre a importância de mantê-lo puro.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Alinhamento de energias... soa como uma forma polida de lidar com o 'véu'.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_2a: {
            text: "O véu é apenas um conceito para aqueles que não o veem. Mas sim, a energia é real, e pode ser perigosa se mal compreendida.",
            options: [ { text: "Então, devemos garantir que esta energia seja canalizada corretamente.", action: 'correct', nextNode: 'dialogue_final' } ]
        },
        dialogue_final: {
            text: "Sua arte é precisa. Que suas descobertas sejam iluminadoras.",
            options: [ { text: "Que assim seja.", nextNode: null } ]
        }
    },

    sra_pickman: {
        initial: {
            text: "Ouvi dizer que você é especialista em alterar sortes. Preciso de um certo... desvio.",
            options: [
                { text: "Desviar sortes? Do que estamos falando?", nextNode: 'dialogue_1a' },
                { text: "Sou um tatuador, não um cartomante.", nextNode: 'dialogue_1b' }
            ]
        },
        dialogue_1a: {
            text: "Meu rival em negócios. Ele prospera de forma antinatural. Abner sugeriu que este glifo 'desvia o mau-olhado'.",
            options: [
                { text: "Um glifo para desviar sorte... parece um sigilo de proteção seguro.", action: 'accept_normal', nextNode: 'dialogue_final' },
                { text: "Desviar prosperidade alheia? Isso soa... arriscado.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_1b: {
            text: "Sua arte manipula símbolos, não é? E símbolos têm poder.",
            options: [
                { text: "Símbolos sim, mas com responsabilidade. E a seu favor, se for seguro.", action: 'accept_normal', nextNode: 'dialogue_final' },
                { text: "Poderes perigosos não são meu forte.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_2a: {
            text: "Arriscado? Ou apenas... eficiente? O que você tem a perder?",
            options: [
                { text: "Minha sanidade. E talvez a minha vida. Não farei sigilos que possam corromper.", action: 'refuse', nextNode: null },
                { text: "Entendido. Farei como foi pedido.", action: 'accept_normal', nextNode: 'dialogue_final' }
            ]
        },
        dialogue_final: {
            text: "Excelente. Que sua precisão seja tão afiada quanto seu julgamento.",
            options: [ { text: "Farei meu melhor.", action: 'accept_normal', nextNode: null } ]
        }
    },

    sr_gilman: {
        initial: {
            text: "Ouvi dizer que você lida com as sombras. Preciso de algo para me manter firme.",
            options: [
                { text: "Manter firme contra o quê?", nextNode: 'dialogue_1a' },
                { text: "O que você entende por 'sombras'?", nextNode: 'dialogue_1b' }
            ]
        },
        dialogue_1a: {
            text: "As coisas que se movem nos contêineres nos cais à noite. Abner me deu um desenho de âncora. Disse que é para momentos assim.",
            options: [
                { text: "Uma âncora. Para te prender à realidade, imagino. Pode deixar.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Âncoras podem prender... mas também podem ser puxadas para o fundo.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_1b: {
            text: "Coisas que não deviam estar lá. Sons que não deviam ser ouvidos. Abner me deu um desenho que ele chamou de 'âncora'.",
            options: [
                { text: "Uma âncora é um símbolo de estabilidade. Posso fazê-la para você.", action: 'correct', nextNode: 'dialogue_final' },
                { text: "Parece que Abner sabe muito sobre o que espreita nas bordas.", nextNode: 'dialogue_2a' }
            ]
        },
        dialogue_2a: {
            text: "Talvez. Mas ele disse que esta âncora é forte. Preciso dela.",
            options: [ { text: "Então, vamos garantir que ela seja forte.", action: 'correct', nextNode: 'dialogue_final' } ]
        },
        dialogue_final: {
            text: "Bom. Mantenha o bom trabalho.",
            options: [ { text: "Pode contar comigo.", nextNode: null } ]
        }
    },
};