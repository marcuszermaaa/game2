/**
 * js/data/loreData.js
 * -----------------
 * O BANCO DE DADOS DE CONHECIMENTO (GRIMÓRIO)
 * Este arquivo contém as definições de todas as páginas do diário, anotações
 * e tomos que o jogador pode desbloquear. O conteúdo aqui é lido e exibido
 * em várias partes do jogo.
 */

export const LORE_PAGES = {
    // --- LORE INICIAL E DO TUTORIAL ---
    'abner_diary_1': {
        title: "Minhas Anotações sobre a Tinta",
        content: `
            <p>Encontrei as primeiras anotações de Abner sobre a tinta. Ele a chama de "Icor". Não é uma simples mistura, mas algo... vivo. Ele escreve sobre ela como "o sangue doentio de uma ferida na realidade".</p>
            <p>Essa "ferida", segundo ele, está escondida nas profundezas desta cidade amaldiçoada. É por isso que os sigilos funcionam. Não é a tinta que tem poder; é o que ela toca. Ela serve como um canal, uma ponte. A ideia me arrepia. Cada vez que a agulha perfura a pele, estou conectando alguém a essa... ferida.</p>
        `
    },
    'veil_and_errors': {
        title: "O Véu e o Custo do Erro",
        content: `
            <p>Abner menciona repetidamente um "Véu". Pelo que entendi, é uma espécie de barreira frágil que nos separa de... bem, do resto. Do que não deveria estar aqui.</p>
            <p>Ele diz que cada sigilo que eu desenho é um trabalho de manutenção nesse Véu. Cada linha correta o fortalece, como uma sutura. Mas cada erro... ele descreve como um convite. Um convite para o que está do outro lado "olhar mais de perto". A pressão é imensa. Não posso errar.</p>
        `
    },

    // --- LORE DO ARCO DE ARMITAGE ---
    'abner_on_spirals': {
        title: "Anotações sobre a Espiral",
        content: `
            <p>Abner parecia obcecado com o conceito de percepção. Encontrei um trecho onde ele descreve um sigilo específico com um fervor quase maníaco. Ele o chama de "A Espiral da Percepção".</p>
            <p><em>"Não é um olho,"</em> ele escreve, com a caligrafia tremida, <em>"é uma lente para a alma! Ela não abre uma porta, ela foca o que já está dentro. Permite ver as cores da insanidade, as formas da verdade que se escondem na névoa da mente! É perigosa, bela e absolutamente necessária!"</em></p>
        `
    },
    'the_watchers': {
        title: "Os Observadores",
        content: `
            <p>O Véu não é uma parede sólida. Abner o descreve como um tecido encharcado. Às vezes, ele se estica, fica fino. Nesses momentos, as coisas podem... vazar.</p>
            <p>Ele fala de "Observadores", entidades que não são hostis nem amigáveis, apenas curiosas. Elas são atraídas por mentes instáveis e pela energia liberada pelos sigilos. Sinto seus olhares às vezes, um peso frio na nuca quando estou sozinho no estúdio à noite.</p>
        `
    },
    'lore_abners_final_warning': {
        title: "Anotação Final: O Catalisador da Linhagem",
        content: `
            <p>Se você montou os fragmentos e está lendo isto, então o pior aconteceu. Armitage o forçou a recriar o Sigilo de Astaroth, o Olho Cego. Não o tatue nele. Não como ele espera.</p>
            <p>Ele acredita que o sigilo é uma chave e que ele se tornará a fechadura, um portal vivo. Ele está terrivelmente enganado. Ele não se tornará um deus, se tornará um buraco. Um rasgo canceroso na realidade que consumirá tudo.</p>
            <p>Eu não consegui destruir o sigilo, mas encontrei uma falha em sua ressonância, uma contramedida. Nossa linhagem, a dos Vance... nosso sangue vibra em uma frequência que é antagônica a esses símbolos abissais. Sozinho, é apenas sangue. Mas quando usado como catalisador, como a base para a tinta que desenha o próprio sigilo, ele não o ativa. Ele o **inverte**.</p>
            <p>O portal se torna uma prisão. A chave se torna o selo. É um sacrifício terrível, infundir sua própria essência em uma abominação, mas pode ser a única maneira de selar o Olho para sempre. Não deixe que a ambição dele seja o nosso fim.</p>
        `
    },

    // --- LORE DO ARCO DA SRA. PICKMAN ---
    'lore_finch_report': {
        title: "Minha Anotação sobre o 'Acidente'",
        content: `
            <p>O jornal chamou de 'ataque de animal', mas eu sei a verdade. Alistair Finch foi massacrado. O sigilo que tatuei na Sra. Pickman não foi uma simples maldição. Eu não desviei a sorte. Eu abri uma jaula.</p>
            <p>Gilman estava certo sobre o contêiner. Havia algo lá dentro, algo que Finch estava controlando. Meu sigilo quebrou esse controle. A criatura está solta, e Pickman agora tem o que restou do império de Finch. Eu fui a ferramenta dela. O peso disso é... esmagador.</p>
        `
    },
    'lore_pickman_retaliation': {
        title: "A Sombra da Família Pickman",
        content: `
            <p>Eles vieram até mim. Um homem de terno com olhos vazios. A mensagem era clara: a Sra. Pickman não esquece. Recusar seu pedido não foi o fim, foi o começo de outra coisa. Abner deve ter lidado com gente assim, que veem o arcano como uma alavanca para mover o mundo a seu favor.</p>
        `
    },
    'lore_zadok_prophecy': {
        title: "A Profecia do Bêbado",
        content: `
            <p>Zadok Allen voltou. Sóbrio. Foi a coisa mais aterrorizante que vi esta semana. Suas palavras ecoam em minha mente: <em>'Eles não se fundem, eles... semeiam! Ela não está no controle. Ela é o campo! O ninho!'</em></p>
            <p>A história se repete. Hibridização. Não se trata de uma mulher se transformando em um monstro. Trata-se de uma mulher se tornando o útero para uma nova geração deles. E eu a ajudei a matar o único homem que mantinha a 'semente' trancada.</p>
        `
    },

    // --- LORE DO ARCO DE MORDECAI ---
    'lore_blood_echo': {
        title: "Anotação: A Ressonância da Carne",
        content: `
            <p>Eu cometi um erro. Ou talvez fosse inevitável. Fiquei sem tinta e, em um momento de desespero, usei meu próprio sangue para completar um sigilo.</p>
            <p>O sigilo funcionou, talvez bem demais. Mas o cliente... ele não é mais inteiramente dele. Ele carrega uma parte de mim agora, um eco da minha alma preso em sua carne. É uma conexão fria e tênue, mas está lá.</p>
            <p>E o pior de tudo... eu senti que algo nas sombras notou esse eco. Algo faminto. Abner nunca escreveu sobre isso, mas sinto em meus ossos: este é um preço que ele se recusava a pagar. O sangue não é apenas tinta. É um farol.</p>
        `
    },

    // --- LORE DE CLIENTES GERAIS ---
    'lore_dream_map': {
        title: "Fragmento de um Mapa Onírico",
        content: `
            <p>O Cartógrafo de Sonhos, como agradecimento, me deixou um pedaço de seu trabalho. Não é um mapa de um lugar, mas de um... sentimento. As ruas de Kadath, a cidade no Deserto Frio.</p>
            <p>As anotações dele são desconexas: <em>"Os cristais cantam com o frio das estrelas distantes... A poeira é feita de memórias esquecidas... Não olhe para o que se senta no trono..."</em>. É um vislumbre de um lugar que eu nunca deveria querer visitar.</p>
        `
    },

    // --- TOMOS DE REFLEXÃO (LIGADOS ÀS CONQUISTAS) ---
    'achievement_lore_master_corrector': {
        title: "Reflexão: A Ordem no Caos",
        content: `<p>Corrigir um sigilo corrompido é como afinar um instrumento desafinado. Agora... eu vejo a intenção por trás do erro. Vejo a ordem que anseia por ser restaurada. Sinto que meus olhos estão se acostumando a ver as 'costuras' do Véu.</p>`
    },
    'achievement_lore_corruption_spreader': {
        title: "Reflexão: O Fio Solto",
        content: `<p>Cada vez que eu cedia, sentia algo se soltar, como um fio sendo puxado de uma tapeçaria antiga. O Véu não se rasgou, mas está mais... permeável. Eu não introduzi o caos, apenas me recusei a impedi-lo. E, em troca, o caos parece ter me notado.</p>`
    },
    'achievement_lore_guardian_of_the_veil': {
        title: "Reflexão: O Farol",
        content: `<p>Eu mantive a linha. Recusei o poder fácil e corrigi os erros. Não é uma luta de poder, percebo agora. É um ato de resistência silenciosa. Meu estúdio não é apenas um lugar de arte, mas um bastião contra a maré de escuridão.</p>`
    },
    'achievement_lore_harbinger_of_oblivion': {
        title: "Reflexão: O Eco",
        content: `<p>Eu abracei a escuridão, e ela me abraçou de volta. Eu não sou mais um simples tatuador. Sou um eco. Uma ressonância das verdades sombrias que Abner tanto temia. O Véu não é mais uma barreira para mim. É um espelho.</p>`
    }
};