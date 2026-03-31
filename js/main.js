/**
 * 1. CONFIGURACIÓN Y SELECTORES
 */
const input = document.querySelector("#form__input");
const containerBotones = document.querySelector(".main__buttons");
const pantallaCentral = document.querySelector("#resultado-operacion"); // Área de trabajo (Centro)
const logDerecho = document.querySelector("#resultado"); // Historial/Actividad (Derecha)

// Estado de la aplicación
let palabrasGuardadas = JSON.parse(localStorage.getItem("palabrasGuardadas")) || [];

/**
 * 2. FUNCIÓN CONSTRUCTORA
 * Crea un objeto estandarizado para cada entrada.
 */
function Registro(texto, accion = "Manual") {
    this.id = Date.now();
    this.texto = texto;
    this.accion = accion;
    this.fecha = new Date().toLocaleTimeString();
}

/**
 * 3. LÓGICA DE INTERFAZ (DOM)
 */
// Limpia el área central y muestra un resultado destacado
function mostrarEnPantallaCentral(contenidoHtml) {
    pantallaCentral.innerHTML = contenidoHtml;
}

// Actualiza el log de la derecha con todos los registros
function actualizarLog() {
    logDerecho.innerHTML = ""; // Limpiamos para redibujar
    
    if (palabrasGuardadas.length === 0) {
        logDerecho.innerHTML = "<p class='placeholder-text'>Sin actividad reciente.</p>";
        return;
    }

    const lista = document.createElement("ul");
    lista.style.listStyle = "none";
    lista.style.padding = "0";

    // Mostramos los últimos 10 registros para no saturar
    palabrasGuardadas.slice(-10).reverse().forEach(item => {
        const li = document.createElement("li");
        li.className = "log-item";
        li.innerHTML = `
            <strong>${item.texto}</strong><br>
            <small>${item.accion} - ${item.fecha}</small>
        `;
        lista.appendChild(li);
    });
    logDerecho.appendChild(lista);
}

/**
 * 4. VALIDACIONES CENTRALIZADAS
 */
function esValido(tipo) {
    if (tipo === "input" && input.value.trim() === "") {
        alert("Primero escribe una palabra en el cuadro central.");
        return false;
    }
    if (tipo === "array" && palabrasGuardadas.length === 0) {
        alert("La base de datos está vacía.");
        return false;
    }
    return true;
}

/**
 * 5. PERSISTENCIA Y ASINCRONISMO (FETCH)
 */
/**
 * 5. PERSISTENCIA Y ASINCRONISMO (FETCH)
 * Ajustada para mostrar mensajes personalizados según el origen de los datos.
 */
async function inicializarDatos() {
    try {
        // Caso A: No hay nada en LocalStorage, vamos al JSON
        if (palabrasGuardadas.length === 0) {
            const response = await fetch('./db/data.json');
            if (!response.ok) throw new Error("No se pudo conectar con la base de datos JSON.");
            
            const datosJson = await response.json();
            
            // Convertimos los strings a objetos Registro
            palabrasGuardadas = datosJson.map(palabra => new Registro(palabra, "Carga Inicial"));
            
            // Guardamos en LocalStorage para la próxima vez
            guardarYRefrescar();

            // Mensaje solicitado para el área central
            mostrarEnPantallaCentral(`
                <div style="color: #2563eb; text-align: center;">
                    <h3>¡Base de Datos de Prueba Cargada!</h3>
                    <p>No se encontraron resultados en LocalStorage.</p>
                    <p>Las palabras en "Actividad" han sido descargadas de la base de datos de prueba (.json).</p>
                </div>
            `);
        } 
        // Caso B: Ya existen datos previos en LocalStorage
        else {
            actualizarLog();
            
            // Mensaje solicitado para el área central
            mostrarEnPantallaCentral(`
                <div style="color: #059669; text-align: center;">
                    <h3>Sesión Restaurada</h3>
                    <p>Se han cargado las palabras guardadas en tu LocalStorage.</p>
                    <p>Puedes seguir trabajando con tus registros anteriores.</p>
                </div>
            `);
        }
    } catch (error) {
        console.error("Error al inicializar:", error);
        mostrarEnPantallaCentral(`
            <h3 style="color: red;">Error de Conexión</h3>
            <p>No se pudo cargar la base de datos de prueba.</p>
        `);
    }
}

function guardarYRefrescar() {
    localStorage.setItem("palabrasGuardadas", JSON.stringify(palabrasGuardadas));
    actualizarLog();
}

/**
 * 6. FUNCIONES DE OPERACIÓN
 */
function transformar(modo) {
    if (!esValido("input")) return;
    const palabra = input.value.trim();
    const resultado = (modo === 'mayus') ? palabra.toUpperCase() : palabra.toLowerCase();
    
    input.value = resultado;
    mostrarEnPantallaCentral(`<h3>Transformación</h3><p style="font-size: 2rem;">${resultado}</p>`);
}

function guardar() {
    if (!esValido("input")) return;
    const nuevo = new Registro(input.value.trim(), "Guardado");
    palabrasGuardadas.push(nuevo);
    
    guardarYRefrescar();
    mostrarEnPantallaCentral(`<h3>¡Guardado!</h3><p>La palabra "${nuevo.texto}" está en la base de datos.</p>`);
    input.value = "";
}

function filtrarLongitud(tipo) {
    if (!esValido("array")) return;
    
    const encontrado = palabrasGuardadas.reduce((acc, curr) => {
        return (tipo === 'max') 
            ? (curr.texto.length > acc.texto.length ? curr : acc)
            : (curr.texto.length < acc.texto.length ? curr : acc);
    });

    mostrarEnPantallaCentral(`
        <h3>Palabra con ${tipo === 'max' ? 'mayor' : 'menor'} longitud</h3>
        <p style="font-size: 1.5rem; color: var(--primary)">${encontrado.texto}</p>
        <small>Longitud: ${encontrado.texto.length} caracteres</small>
    `);
}

function ordenarAlfabeticamente() {
    if (!esValido("array")) return;
    
    // Usamos spread operator [...] para no mutar el array original si no queremos
    const ordenadas = [...palabrasGuardadas].sort((a, b) => a.texto.localeCompare(b.texto));
    const listaHtml = ordenadas.map(p => `<li>${p.texto}</li>`).join("");
    
    mostrarEnPantallaCentral(`<h3>Lista Ordenada A-Z</h3><ul style="text-align:left; display:inline-block">${listaHtml}</ul>`);
}

function eliminarUltimo() {
    if (!esValido("array")) return;
    const eliminado = palabrasGuardadas.pop();
    guardarYRefrescar();
    mostrarEnPantallaCentral(`<h3>Eliminado</h3><p>Se quitó "${eliminado.texto}" del registro.</p>`);
}

/**
 * 7. EVENT LISTENER (DELEGACIÓN DE EVENTOS)
 */
containerBotones.addEventListener("click", (e) => {
    // Buscamos el botón más cercano al click
    const boton = e.target.closest(".btn__menu");
    
    // Si el click no fue en un botón, no hacemos nada
    if (!boton) return;

    // IMPORTANTE: Extraemos el valor de 'data-action' del HTML
    const accionSeleccionada = boton.dataset.action; 

    console.log("Ejecutando:", accionSeleccionada);

    // Usamos la variable que acabamos de definir
    switch (accionSeleccionada) {
        case "mayus": 
            transformar("mayus"); 
            break;
        case "minus": 
            transformar("minus"); 
            break;
        case "guardar": 
            guardar(); 
            break;
        case "visualizar": 
            mostrarEnPantallaCentral("<h3>Base de Datos Actual</h3><p>Revisa el panel derecho para ver el historial completo.</p>");
            break;
        case "menosCaracter": 
            filtrarLongitud("min"); 
            break;
        case "mayorCaracter": 
            filtrarLongitud("max"); 
            break;
        case "ordenar": 
            ordenarAlfabeticamente(); 
            break;
        case "eliminar": 
            eliminarUltimo(); 
            break;
        case "borrarTodo":
          if(confirm("¿Estás seguro de borrar TODA la base de datos?")) {
            palabrasGuardadas = [];
            localStorage.clear();
            guardarYRefrescar();
            mostrarEnPantallaCentral("<h3>Sistema Reiniciado</h3><p>Se han borrado todos los datos localstorage.</p>");
            }
           break;
        default:
            console.warn("Acción no reconocida:", accionSeleccionada);
    }
});

// Arrancar la App
inicializarDatos();