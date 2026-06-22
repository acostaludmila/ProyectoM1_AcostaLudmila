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
        paletteContainer.innerHTML = "";
        coloresActuales.forEach((colorObj) => {
            crearMancha(colorObj, false);
        });
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

/* Generación y Renderizado de Tarjetas de Color */

function generarFormaMancha() {
    const tl = Math.floor(Math.random() * 60) + 20; 
    const tr = Math.floor(Math.random() * 60) + 20; 
    const br = Math.floor(Math.random() * 60) + 20; 
    const bl = Math.floor(Math.random() * 60) + 20; 

    const vtl = Math.floor(Math.random() * 60) + 20;
    const vtr = Math.floor(Math.random() * 60) + 20;
    const vbr = Math.floor(Math.random() * 60) + 20;
    const vbl = Math.floor(Math.random() * 60) + 20;

    return `${tl}% ${100 - tl}% ${tr}% ${100 - tr}% / ${vtl}% ${vtr}% ${100 - vtr}% ${100 - vtl}%`;
}

function crearMancha(colorObj, animar) {
    const card = document.createElement("article");
    card.classList.add("color-card");
    
    if (animar) {
        card.classList.add("animar-entrada");
    }
    
    if (colorObj.fijado) {
        card.classList.add("fijado");
    }

    const actionButton = document.createElement("button");
    actionButton.classList.add("paint-button");
    actionButton.textContent = colorObj.fijado ? "🔒" : "🎨";
    if (colorObj.fijado) actionButton.style.opacity = "1";
    
    actionButton.style.transform = `rotate(${colorObj.botonRotacion}deg)`;

    actionButton.addEventListener("click", () => {
        colorObj.fijado = !colorObj.fijado;
        colorObj.botonRotacion += 360;
        
        actionButton.style.transform = `rotate(${colorObj.botonRotacion}deg)`;
        
        guardarEnLocalStorage();
        
        setTimeout(() => {
            paletteContainer.innerHTML = "";
            coloresActuales.forEach(c => {
                crearMancha(c, false);
            });
        }, 400);
    });

    const paintWrapper = document.createElement("div");
    paintWrapper.classList.add("paint-wrapper");

    const stain = document.createElement("div");
    stain.classList.add("paint-stain");
    stain.style.backgroundColor = colorObj.color;
    stain.style.borderRadius = colorObj.borderRadius; 
    stain.style.width = `${colorObj.width}px`;
    stain.style.height = `${colorObj.height}px`;
    stain.style.transform = `rotate(${colorObj.rotacion}deg)`;

    const droplet1 = document.createElement("div");
    droplet1.classList.add("droplet", "droplet-1");
    droplet1.style.backgroundColor = colorObj.color;
    droplet1.style.width = `${colorObj.drop1Width}px`;
    droplet1.style.height = `${colorObj.drop1Height}px`;
    droplet1.style.borderRadius = colorObj.drop1Radius;
    droplet1.style.styleObj = droplet1.setAttribute(
        "style", 
        `background-color: ${colorObj.color}; width: ${colorObj.drop1Width}px; height: ${colorObj.drop1Height}px; border-radius: ${colorObj.drop1Radius}; top: ${colorObj.drop1Top}px; left: ${colorObj.drop1Left}px; --rotacion-base: ${colorObj.drop1Rotacion}deg;`
    );

    const droplet2 = document.createElement("div");
    droplet2.classList.add("droplet", "droplet-2");
    droplet2.style.backgroundColor = colorObj.color;
    droplet2.style.width = `${colorObj.drop2Width}px`;
    droplet2.style.height = `${colorObj.drop2Height}px`;
    droplet2.style.borderRadius = colorObj.drop2Radius;
    droplet2.style.styleObj = droplet2.setAttribute(
        "style", 
        `background-color: ${colorObj.color}; width: ${colorObj.drop2Width}px; height: ${colorObj.drop2Height}px; border-radius: ${colorObj.drop2Radius}; bottom: ${colorObj.drop2Bottom}px; right: ${colorObj.drop2Right}px; --rotacion-base: ${colorObj.drop2Rotacion}deg;`
    );

    paintWrapper.appendChild(stain);
    paintWrapper.appendChild(droplet1);
    paintWrapper.appendChild(droplet2);

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

    const copyButton = document.createElement("button");
    copyButton.classList.add("copy-button");
    copyButton.innerHTML = "🗐"; 

    copyContainer.addEventListener("click", () => {
        const textoACopiar = colorCode.textContent;
        navigator.clipboard.writeText(textoACopiar).then(() => {
            copyButton.innerHTML = "✓";
            copyContainer.classList.add("copied");
            setTimeout(() => {
                copyButton.innerHTML = "🗐";
                copyContainer.classList.remove("copied");
            }, 1500);
        });
    });

    copyContainer.appendChild(colorCode);
    copyContainer.appendChild(copyButton);

    card.appendChild(actionButton);
    card.appendChild(paintWrapper);
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
    renderizarTodo(false); 
    guardarEnLocalStorage();
}

function ajustarCantidadColores() {
    const cantidad = Number(cantidadColores.value);

    if (cantidad === 9) {
        paletteContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (cantidad === 8 && window.innerWidth >= 992) {
        paletteContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else {
        paletteContainer.style.gridTemplateColumns = "";
    }

    const nuevosColores = [];
    for (let i = 0; i < cantidad; i++) {
        if (coloresActuales[i]) {
            nuevosColores.push(coloresActuales[i]);
        } else {
            nuevosColores.push(crearObjetoColor(i));
        }
    }
    
    coloresActuales = nuevosColores;
    renderizarTodo(false); 
    guardarEnLocalStorage();
}

function crearObjetoColor(index) {
    return {
        id: index,
        color: generarColorHex(),
        fijado: false,
        botonRotacion: 0,
        borderRadius: generarFormaMancha(),
        width: Math.floor(Math.random() * 21) + 85,
        height: Math.floor(Math.random() * 21) + 85,
        rotacion: Math.floor(Math.random() * 360),
        
        drop1Width: Math.floor(Math.random() * 8) + 20,
        drop1Height: Math.floor(Math.random() * 8) + 20,
        drop1Radius: generarFormaMancha(),
        drop1Rotacion: Math.floor(Math.random() * 360),
        drop1Top: Math.floor(Math.random() * 11) + 32,    
        drop1Left: Math.floor(Math.random() * 11) + 32,   
        
        drop2Width: Math.floor(Math.random() * 6) + 16,
        drop2Height: Math.floor(Math.random() * 6) + 16,
        drop2Radius: generarFormaMancha(),
        drop2Bottom: Math.floor(Math.random() * 11) + 32,
        drop2Right: Math.floor(Math.random() * 11) + 32,
        drop2Rotacion: Math.floor(Math.random() * 360)
    };
}

function renderizarTodo(animar) {
    paletteContainer.innerHTML = "";
    coloresActuales.forEach(c => {
        const debeAnimar = c.fijado ? false : animar;
        crearMancha(c, debeAnimar);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem("paletaColores", JSON.stringify(coloresActuales));
}

function cargarDeLocalStorage() {
    const guardados = localStorage.getItem("paletaColores");
    if (guardados) {
        coloresActuales = JSON.parse(guardados);
        cantidadColores.value = coloresActuales.length;
        renderizarTodo(true); 
    } else {
        generarNuevaPaleta();
    }
}

cargarDeLocalStorage();