let order = [];
let clickedOrder = [];
let score = 0;

// 0 - verde | 1 - vermelho | 2 - amarelo | 3 - azul
const blue = document.querySelector('.blue');
const red = document.querySelector('.red');
const green = document.querySelector('.green');
const yellow = document.querySelector('.yellow');

// Sons para cada cor
const sounds = {
    0: new Audio('../sounds/undertale-sound-effect-undernet-notification.mp3'),
    1: new Audio('../sounds/undertale-sound-effect-undernet-notification.mp3'),
    2: new Audio('../sounds/undertale-sound-effect-undernet-notification.mp3'),
    3: new Audio('../sounds/undertale-sound-effect-undernet-notification.mp3')
};

// Som de derrota e vitória
const som_dederrota = new Audio('../sounds/mus_wawa.mp3');
const som_devitoria = new Audio('../sounds/ohyes.mp3');

// Música de fundo
const backgroundMusic = document.getElementById('background-music');

// Gera uma nova sequência aleatória
let shuffleOrder = () => {
    let colorOrder = Math.floor(Math.random() * 4);
    order.push(colorOrder);
    clickedOrder = [];

    order.forEach((color, index) => {
        setTimeout(() => {
            lightColor(createColorElement(color));
        }, (index + 1) * 600);
    });
};

// Acende a cor selecionada
let lightColor = (element) => {
    element.classList.add('selected');  // Toca o som da cor correta

    setTimeout(() => {
        element.classList.remove('selected');
    }, 300);
};

// Verifica se os cliques do usuário estão corretos
let checkOrder = () => {
    for (let i in clickedOrder) {
        if (clickedOrder[i] !== order[i]) {
            gameOver();
            return;
        }
    }

    if (clickedOrder.length === order.length) {
        setTimeout(() => {
            backgroundMusic.pause();
            som_devitoria.play();
            alert(`✅ Pontuação: ${score}\n🎉 Você acertou! Próximo nível...`);
            backgroundMusic.play();
            nextLevel();
        }, 500);
    }
};

// Captura o clique do usuário
let click = (color) => {
    backgroundMusic.pause();
    clickedOrder.push(color);
    let element = createColorElement(color);
    element.classList.add('selected');
    sounds[color].play();  // Toca o som da cor selecionada
    backgroundMusic.play();


    setTimeout(() => {
        element.classList.remove('selected');
        checkOrder();
    }, 300);
};

// Retorna o elemento da cor correspondente
let createColorElement = (color) => {
    return [green, red, yellow, blue][color];
};

// Passa para o próximo nível
let nextLevel = () => {
    score++;
    shuffleOrder();
};

// Reseta o jogo após perder
let gameOver = () => {
    backgroundMusic.pause();  
    som_dederrota.play();// Pausa a música de fundo ao perder  // Toca o som de derrota
    alert(`❌ Pontuação final: ${score}\n😢 Você perdeu! Clique em OK para tentar novamente.`);
    order = [];
    clickedOrder = [];
    score = 0;
    setTimeout(playGame, 1000);
    backgroundMusic.play();
};

// Inicia o jogo
let playGame = () => {
    alert('👾 Bem-vindo ao Gênesis Dodó!\nPrepare-se para o desafio!');
    score = 0;
    nextLevel();
};

// Eventos de clique para as cores
green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);

// Inicia o jogo apenas após interação do usuário (para evitar bloqueio de som)
document.addEventListener('click', () => {
    if (score === 0) playGame();
}, { once: true });

// Garantir que a música de fundo só toque após uma interação do usuário
document.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();  // Toca a música de fundo após clique do usuário
    }
}, { once: true });
