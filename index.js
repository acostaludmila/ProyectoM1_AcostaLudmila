/* Referencias a los elementos del DOM */
const generarBtn = document.getElementById("btn-generar");
const cantidadColores = document.getElementById("cantidad-colores");
const paletteContainer = document.getElementById("contenedor-colores");

/* Estado global de la aplicación */
let formatoActual = "hex";
let coloresActuales = [];

/* Escuchas de eventos globales y del panel */
document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "formatoColor") {
        formatoActual = e.target.value;
        renderizarTodo();
    }
});

cantidadColores.addEventListener("change", () => {
    ajustarCantidadColores();
});

generarBtn.addEventListener("click", () => {
    generarNuevaPaleta();
});

/* Funciones de conversión y generación de formatos de color */
function generarColorHex() {
    const caracteres = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += caracteres[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h, s, l;
    l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/* Renderizado dinámico de tarjetas en el contenedor */
function crearTarjetaColor(colorObj) {
    const card = document.createElement("article");
    card.classList.add("color-card");
    
    if (colorObj.fijado) {
        card.classList.add("fijado");
    }

    // Botón de acción para bloquear el color
    const actionButton = document.createElement("button");
    actionButton.classList.add("paint-button");
    actionButton.textContent = colorObj.fijado ? "🔒" : "🔓";

    actionButton.addEventListener("click", () => {
        colorObj.fijado = !colorObj.fijado;
        renderizarTodo();
    });

    // Contenedor del código de texto y copiado
    const copyContainer = document.createElement("div");
    copyContainer.classList.add("copy-container");

    const colorCode = document.createElement("p");
    colorCode.classList.add("color-text");
    
    if (formatoActual === "hex") {
        colorCode.textContent = colorObj.color;
    } else if (formatoActual === "rgb") {
        colorCode.textContent = hexToRgb(colorObj.color);
    } else {
        colorCode.textContent = hexToHsl(colorObj.color);
    }

    copyContainer.addEventListener("click", () => {
        const textoACopiar = colorCode.textContent;
        navigator.clipboard.writeText(textoACopiar).then(() => {
            copyContainer.classList.add("copied");
            setTimeout(() => {
                copyContainer.classList.remove("copied");
            }, 1500);
        });
    });

    copyContainer.appendChild(colorCode);
    card.appendChild(actionButton);
    card.appendChild(copyContainer);
    paletteContainer.appendChild(card);
}

/* Controladores de lógica de la paleta */
function generarNuevaPaleta() {
    const cantidad = Number(cantidadColores.value);
    
    for (let i = 0; i < cantidad; i++) {
        if (!coloresActuales[i] || !coloresActuales[i].fijado) {
            coloresActuales[i] = crearObjetoColor(i);
        }
    }
    
    coloresActuales = coloresActuales.slice(0, cantidad);
    renderizarTodo(); 
}

function ajustarCantidadColores() {
    const cantidad = Number(cantidadColores.value);
    const nuevosColores = [];

    for (let i = 0; i < cantidad; i++) {
        if (coloresActuales[i]) {
            nuevosColores.push(coloresActuales[i]);
        } else {
            nuevosColores.push(crearObjetoColor(i));
        }
    }
    
    coloresActuales = nuevosColores;
    renderizarTodo(); 
}

function renderizarTodo() {
    paletteContainer.innerHTML = "";
    coloresActuales.forEach(c => {
        crearTarjetaColor(c);
    });
}

function crearObjetoColor(index) {
    return {
        id: index,
        color: generarColorHex(),
        fijado: false
    };
}