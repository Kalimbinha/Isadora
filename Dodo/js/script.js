const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Define a resolução real do canvas para evitar perda de qualidade
const scale = 2;  // Ajuste o valor conforme necessário
canvas.width = 250 * scale;
canvas.height = 250 * scale;

// Ajuste o estilo para que ele fique maior sem perder qualidade
canvas.style.width = "500px";  // Escala visual
canvas.style.height = "500px"; // Escala visual

// Lista de imagens para a animação
const frames = [
    "../images/Face_1.png",
    "../images/Face_2.png",
    "../images/face_3.png"
];

let images = [];
let frameIndex = 0;
let animationInterval;
let currentTextIndex = 0;

// Lista de textos para serem exibidos
const texts = [
    "Olá Isadora",
    "Vai santoswevwwfwrwer",
    ":8)"
];

// Pré-carrega as imagens
function preloadImages(callback) {
    let loaded = 0;
    frames.forEach((src, index) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            loaded++;
            if (loaded === frames.length) {
                callback();
            }
        };
        images[index] = img;
    });
}

// Função para desenhar o frame atual
function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    frameIndex = (frameIndex + 1) % images.length;
}

// Função para iniciar a animação e a digitação do texto
function startAnimation() {
    // Inicia a animação das imagens
    animationInterval = setInterval(drawFrame, 500); // Muda o frame a cada 500ms

    // Começa a digitar o primeiro texto
    typeText(texts[currentTextIndex]);
}

// Função para digitar o texto na caixa de diálogo
const dialogText = document.getElementById("dialog-text");
const blipSound = document.getElementById("blip-sound");

function typeText(text, speed = 50) {
    let index = 0;
    dialogText.innerHTML = ""; // Limpa o texto anterior

    function type() {
        if (index < text.length) {
            dialogText.innerHTML += text[index];
            if (text[index] !== "") blipSound.play(); // Som para cada letra (ignora espaços)
            index++;
            setTimeout(type, speed);
        } else {
            // Quando a digitação terminar, para a animação das imagens
            clearInterval(animationInterval);
        }
    }

    type();
}

// Função para avançar para o próximo texto quando a tecla Enter for pressionada
function handleEnterPress(event) {
    if (event.key === "Enter") {
        // Se houver mais textos, avança para o próximo
        if (currentTextIndex < texts.length - 1) {
            currentTextIndex++;
            dialogText.innerHTML = "";  // Limpa a caixa de texto

            // Inicia a animação novamente com o próximo texto
            clearInterval(animationInterval);  // Para a animação anterior
            startAnimation();  // Inicia novamente com o próximo texto
        } else {
            // Quando todos os textos terminarem, para a animação
            clearInterval(animationInterval);

            // Redireciona para a página historia_1.html
            window.location.href = 'historia_1.html'; // Muda para a página desejada
        }
    }
}

// Carrega as imagens e inicia a animação
preloadImages(startAnimation);

// Adiciona o evento de "keydown" para capturar a tecla Enter
document.addEventListener("keydown", handleEnterPress);



