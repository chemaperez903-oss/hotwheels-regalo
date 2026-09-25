// ============================================================
// HOT WHEELS INTERACTIVO
// ============================================================

const loading = document.getElementById("loadingScreen");
const app = document.getElementById("app");
const scene = document.getElementById("scene");
const video = document.getElementById("flowerVideo");
const loadingBar = document.getElementById("loadingBar");
const loadingPercent = document.getElementById("loadingPercent");

const carModal = document.getElementById("carModal");
const flipInner = document.getElementById("flipInner");
const carImage = document.getElementById("carImage");
const closeCar = document.getElementById("closeCar");
const mensajeEspecial = document.getElementById("mensajeEspecial");

const poemaBtn = document.getElementById("poemaBtn");
const poemaModal = document.getElementById("poemaModal");
const closePoema = document.getElementById("closePoema");

// ============================================================
// PANTALLA DE CARGA
// ============================================================
let progress = 0;
let loadingFinished = false;

function actualizarCarga(valor) {
    progress = Math.max(progress, Math.min(100, valor));
    loadingBar.style.width = `${progress}%`;
    loadingPercent.textContent = `${Math.round(progress)}%`;
}

const cargaAnimada = setInterval(() => {
    if (progress < 90) {
        actualizarCarga(progress + Math.random() * 4);
    }
}, 90);

function terminarCarga() {
    if (loadingFinished) return;

    loadingFinished = true;
    clearInterval(cargaAnimada);
    actualizarCarga(100);

    setTimeout(() => {
        loading.classList.add("hidden");
        app.classList.remove("hidden");
        posicionarFlores();
    }, 350);
}

window.addEventListener("load", () => {
    setTimeout(terminarCarga, 1100);
});

video.addEventListener("canplaythrough", () => {
    if (!loadingFinished) {
        actualizarCarga(Math.max(progress, 82));
    }
});

// ============================================================
// VIDEO DE LAS FLORES
// ============================================================
video.loop = false;

const flores = [
    { x: 288, y: 366, w: 180, h: 180 },
    { x: 443, y: 201, w: 185, h: 175 },
    { x: 622, y: 180, w: 190, h: 175 },
    { x: 806, y: 190, w: 185, h: 175 },
    { x: 1002, y: 360, w: 180, h: 180 },
    { x: 514, y: 462, w: 205, h: 190 },
    { x: 768, y: 467, w: 205, h: 190 }
];

function posicionarFlores() {
    const videoRect = video.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();

    if (videoRect.width < 5 || videoRect.height < 5) {
        requestAnimationFrame(posicionarFlores);
        return;
    }

    document.querySelectorAll(".flower-hotspot").forEach((hotspot, index) => {
        const flor = flores[index];

        const centroX = videoRect.left + (flor.x / 1280) * videoRect.width;
        const centroY = videoRect.top + (flor.y / 720) * videoRect.height;
        const ancho = (flor.w / 1280) * videoRect.width;
        const alto = (flor.h / 720) * videoRect.height;

        hotspot.style.left = `${centroX - sceneRect.left - ancho / 2}px`;
        hotspot.style.top = `${centroY - sceneRect.top - alto / 2}px`;
        hotspot.style.width = `${ancho}px`;
        hotspot.style.height = `${alto}px`;
    });
}

video.addEventListener("loadedmetadata", posicionarFlores);
video.addEventListener("loadeddata", posicionarFlores);
window.addEventListener("resize", posicionarFlores);
window.addEventListener("orientationchange", () => {
    setTimeout(posicionarFlores, 120);
});

video.addEventListener("ended", () => {
    video.pause();
    posicionarFlores();
    scene.classList.add("ready");
});

// ============================================================
// INTERACCIÓN DE LAS FLORES / HOT WHEELS
// ============================================================

document.querySelectorAll(".flower-hotspot").forEach((flor) => {
    flor.addEventListener("click", () => {

        carImage.src = flor.dataset.car;
        mensajeEspecial.textContent = flor.dataset.message || "Porque algunos detalles pequeños significan mucho. ❤️";

        flipInner.classList.remove("flipped");
        carModal.classList.add("visible");
        carModal.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            flipInner.classList.add("flipped");
        }, 1300);
    });
});

function cerrarCarrito() {
    carModal.classList.remove("visible");
    carModal.setAttribute("aria-hidden", "true");
    flipInner.classList.remove("flipped");
}

closeCar.addEventListener("click", cerrarCarrito);

carModal.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("modal-backdrop")) {
        cerrarCarrito();
    }
});

// ============================================================
// POEMA
// ============================================================
poemaBtn.addEventListener("click", () => {
    poemaModal.classList.add("visible");
    poemaModal.setAttribute("aria-hidden", "false");
});

function cerrarPoema() {
    poemaModal.classList.remove("visible");
    poemaModal.setAttribute("aria-hidden", "true");
}

closePoema.addEventListener("click", cerrarPoema);

poemaModal.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("modal-backdrop")) {
        cerrarPoema();
    }
});

// ============================================================
// TECLA ESC PARA CERRAR LAS VENTANAS
// ============================================================
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarCarrito();
        cerrarPoema();
    }
});
