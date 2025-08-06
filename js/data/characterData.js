/**
 * js/data/characterData.js
 * -----------------
 * O DOSSIÊ DE PERSONAGENS
 * Este arquivo serve como um banco de dados central para todos os personagens
 * do jogo, fornecendo seus nomes e descrições para a seção "Crônicas" do diário.
 */

export const CHARACTERS = {
    // --- PERSONAGENS DO ARCO DO TUTORIAL ---
    'arthur_estudante': {
        name: "Arthur, o Estudante",
        chronicleDescription: "Um jovem estudante da Universidade Miskatonic, atormentado por visões do mar. Ele busca nos sigilos um alívio para tormentos que mal consegue descrever."
    },

    // --- PERSONAGENS DO ARCO DE ARMITAGE ---
    'prof_armitage': {
        name: "Prof. Armitage",
        chronicleDescription: "Um colega acadêmico de Abner que parece saber mais do que revela. Sua busca por conhecimento beira a obsessão, e sua ajuda sempre vem com um preço oculto."
    },
    'zadok_allen': {
        name: "Zadok Allen",
        chronicleDescription: "Um velho bêbado de Port Blackwood. Seus delírios etílicos contêm fragmentos de verdades terríveis sobre os segredos da cidade e sua história sombria."
    },
    'olho_ansioso': {
        name: "O Olho Ansioso",
        chronicleDescription: "Um estudioso pálido e seguidor devoto do Professor Armitage. Sua ânsia por 'ver além' revela a perigosa influência que o professor exerce sobre mentes curiosas."
    },
    'vitima_armitage': {
        name: "Pescador Adoentado",
        chronicleDescription: "Um dos habitantes locais enganado por Armitage, sofrendo as consequências de uma tatuagem corrompida. Sua agonia é um testemunho sombrio da imprudência do professor."
    },

    // --- PERSONAGENS DO ARCO DA SRA. PICKMAN ---
    'sra_pickman': {
        name: "Sra. Pickman",
        chronicleDescription: "A herdeira fria e calculista de uma das famílias fundadoras. Ela vê o arcano não como um mistério a ser temido, mas como uma ferramenta para alcançar seus objetivos, não importa o quão profanos."
    },
    'sr_gilman': {
        name: "Sr. Gilman",
        chronicleDescription: "Um estivador desconfiado que trabalha nos cais. Ele vê e ouve coisas que não deveria nos contêineres que vêm de portos esquecidos, e confia nos sigilos para se manter são."
    },
    'homem_de_terno': {
        name: "Homem de Terno",
        chronicleDescription: "Um executor silencioso e ameaçador a serviço da Sra. Pickman. Sua presença é um lembrete de que o poder em Port Blackwood tem muitas formas, a maioria delas perigosa."
    },

    // --- PERSONAGENS DO ARCO DE MORDECAI ---
    'mordecai_antiquario': {
        name: "Mordecai, o Antiquário",
        chronicleDescription: "Uma entidade pálida e enigmática que se manifesta das sombras. Ele negocia com o arcano, mas sua verdadeira moeda é a essência da alma. Sua fome é antiga e seus motivos, incompreensíveis."
    },
    'eremita_do_conhecimento': {
        name: "Eremita Fragmentado",
        chronicleDescription: "Um indivíduo cuja mente foi estilhaçada pela busca do conhecimento proibido. Ele foi uma âncora crucial em sua tarefa para Mordecai, desesperado para se livrar de um artefato que o conectava a um poder aterrorizante."
    },
    'apostador_azarado': {
        name: "Apostador Azarado",
        chronicleDescription: "Um homem desesperado, afogado em dívidas, que foi 'sussurrado' pela influência de Mordecai. Ele busca uma solução mágica para seus problemas mundanos."
    },
    'herdeira_doente': {
        name: "Herdeira Doente",
        chronicleDescription: "Uma jovem rica afligida por uma doença misteriosa. Sua vitalidade se esvai, e em seus sonhos febris, ela ouviu a promessa de que a vida pode ser 'transferida'."
    },

    // --- PERSONAGENS DOS EVENTOS GERAIS ---
    'jonas_pescador': { name: "Jonas, o Pescador", chronicleDescription: "Um pescador local assombrado por pesadelos de cidades submersas e o som de sinos abissais. Sua busca é por paz." },
    'musico_assombrado': { name: "Músico Assombrado", chronicleDescription: "Um artista cuja criatividade foi invadida por uma melodia alienígena que vem com a maré. Ele busca o silêncio." },
    'helena_enlutada': { name: "Helena, a Enlutada", chronicleDescription: "Uma mulher cujo luto a tornou vulnerável. Sua busca para contatar seu falecido marido a colocou em um caminho perigoso." },
    'assistente_bibliotecario': { name: "Assistente de Bibliotecário", chronicleDescription: "Um jovem estudioso encarregado de catalogar os tomos perigosos de Abner. Ele é cauteloso e busca proteção para sua mente." },
    'gideon_artesao': { name: "Gideon, o Artesão", chronicleDescription: "Um mestre artesão cuja habilidade foi roubada por um tremor inexplicável. Um dos poucos clientes cuja gratidão é genuína." },
    'velho_historiador': { name: "Velho Historiador", chronicleDescription: "Um pesquisador da sombria história de Port Blackwood. Ele teme que sua pesquisa tenha atraído atenção indesejada." },
    'botanica_arcana': { name: "A Botânica Arcana", chronicleDescription: "Uma especialista em flora de outros mundos. Suas plantas não seguem as leis da nossa biologia, e ela usa os sigilos para se comunicar com elas." },
    'jornalista_paranoico': { name: "Jornalista Paranoico", chronicleDescription: "Um repórter investigando os acontecimentos nos cais. Ele está perto demais da verdade, e sua sanidade está começando a se desfazer." },
    'alquimista_viajante': { name: "Alquimista Viajante", chronicleDescription: "Um comerciante e colecionador de ingredientes arcanos. Ele entende a natureza instável de seus produtos e usa os sigilos como ferramentas de contenção." },
    'erudito_nervoso': { name: "Erudito da Caixa", chronicleDescription: "Um acadêmico que adquiriu um artefato que não consegue entender nem controlar. Sua curiosidade se transformou em terror." },
    'herborista_local': { name: "Herborista Assustada", chronicleDescription: "Uma mulher que vive da terra, mas a própria terra perto da costa de Port Blackwood está se tornando envenenada e hostil." },
    'guarda_do_farol': { name: "Guarda do Farol", chronicleDescription: "Um homem solitário que vigia a costa. Ele notou que a névoa de Port Blackwood não é natural e que a luz de seu farol não é mais suficiente." },
    'inspetor_policia': { name: "Inspetor da Polícia", chronicleDescription: "Um detetive pragmático que está sendo forçado a confrontar o irracional. Os crimes em Port Blackwood não seguem a lógica." },
    'ex_assistente': { name: "Velho Assistente", chronicleDescription: "Um homem idoso que conhecia Abner. Ele viu o fardo que o trabalho de tatuador arcano cobrava de seu tio e mostra uma preocupação paternal pelo jogador." },
    'cartografo_sonhos': { name: "Cartógrafo de Sonhos", chronicleDescription: "Um explorador de reinos oníricos. Ele navega por paisagens impossíveis e usa os sigilos como bússolas para encontrar seu caminho de volta." },
    'coveiro': { name: "Coveiro", chronicleDescription: "Um homem que sabe que, em Port Blackwood, os mortos não descansam em paz. Seu trabalho é garantir que eles permaneçam enterrados." },
    'cultista_desesperado': { name: "Acólito do Olho", chronicleDescription: "Um seguidor de um poder caótico. Ele não busca conhecimento, mas sim a aniquilação do eu em uma fusão com o que está além do Véu." },
};