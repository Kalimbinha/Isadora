const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = 2;
canvas.width = 250 * scale;
canvas.height = 250 * scale;
canvas.style.width = "700px";
canvas.style.height = "500px";

// Lista de imagens para animação normal
const frames = [
    "../images/Face_1.png",
    "../images/Face_2.png",
    "../images/Face_3.png"
];

// Lista de imagens para animação especial
const specialFrames = [
    "../images/Face_7.png",
    "../images/Face_4.png"
];

let images = [];
let frameIndex = 0;
let animationInterval;
let currentTextIndex = 0;
let isTyping = false;
let isSpecialAnimation = false;

// Lista de textos
const texts = [
    "Olá, viajante!",
    "Prepare-se para algo incrível...",
    "Iniciando animação especial...",
    "Fim da experiência! Indo para a história."
];

const specialAnimationTrigger = 2; // Índice que ativa a animação especial

const dialogText = document.getElementById("dialog-text");
const blipSound = document.getElementById("blip-sound");

// Carregar imagens
function preloadImages(callback) {
    let loaded = 0;
    [...frames, ...specialFrames].forEach((src, index) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            loaded++;
            if (loaded === frames.length + specialFrames.length) {
                callback();
            }
        };
        images[index] = img;
    });
}

// Função para iniciar a animação de sprites
function startAnimation() {
    clearInterval(animationInterval); // Evita animações duplicadas
    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
        frameIndex = (frameIndex + 1) % frames.length;
    }, 500);
}

// Função para escrever texto na caixa de diálogo
function typeText(text, speed = 50) {
    let index = 0;
    isTyping = true;
    dialogText.innerHTML = "";

    function type() {
        if (index < text.length) {
            dialogText.innerHTML += text[index];

            if (text[index] !== " " && !blipSound.paused) {  
                blipSound.currentTime = 0; // Reseta o som para sincronizar com o texto
                blipSound.play();
            }
            
            index++;
            setTimeout(type, speed);
        } else {
            clearInterval(animationInterval); // Para a animação normal quando o texto terminar
            isTyping = false;
        }
    }
    type();
}

// Função de animação especial
function startSpecialAnimation() {
    isSpecialAnimation = true;
    dialogText.innerHTML = "";

    let specialSound = new Audio("../sounds/000029c2.mp3");
    specialSound.play();

    let index = 0;
    let specialInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frames.length + index], 0, 0, canvas.width, canvas.height);
        index = (index + 1) % specialFrames.length;
    }, 300);

    setTimeout(() => {
        clearInterval(specialInterval);
        isSpecialAnimation = false;
        nextText(); // Volta para os textos normais
    }, 5000);
}

// Avançar diálogo com Enter
function handleEnterPress(event) {
    if (event.key === "Enter" && !isTyping) {
        let enterSound = new Audio("../sounds/undertale-select-sound.mp3");
        enterSound.play();

        if (isSpecialAnimation) return;

        if (currentTextIndex === specialAnimationTrigger) {
            startSpecialAnimation();
        } else if (currentTextIndex < texts.length - 1) {
            nextText();
        } else {
            window.location.href = "genius.html";
        }
    }
}

// Função para avançar o texto
function nextText() {
    currentTextIndex++;
    dialogText.innerHTML = "";
    clearInterval(animationInterval);
    startAnimation();
    typeText(texts[currentTextIndex]);
}

// Iniciar a primeira animação
preloadImages(() => {
    startAnimation();
    typeText(texts[currentTextIndex]);
});

// Captura tecla Enter
document.addEventListener("keydown", handleEnterPress);
