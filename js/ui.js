// SELECTORES
const input = document.querySelector("#form__input");
const containerBotones = document.querySelector(".main__buttons");
const pantallaCentral = document.querySelector("#resultado-operacion");
const logDerecho = document.querySelector("#resultado");

//  FUNCIONES DE APOYO (REUTILIZABLES)

// Función para centralizar el mensaje de error cuando el input está vacío
function validarEntrada(valor) {
    if (!valor) {
        Swal.fire({
            title: '¡Campo vacío!',
            text: 'Debes escribir una palabra antes de realizar esta acción.',
            icon: 'warning',
            confirmButtonColor: '#2563eb'
        });
        return false;
    }
    return true;
}

//3ro: mensaje inicial segun procedencia de datos. Escribe el html correspondiente
function mostrarMensajeInicial(esDesdeJson) { 
    const mensaje = esDesdeJson 
        ? `<h3>¡Datos de Prueba Cargados!</h3><p>Descargados de base de datos JSON.</p>`
        : `<h3>Sesión Restaurada</h3><p>Cargados desde LocalStorage.</p>`;
    mostrarEnPantallaCentral(mensaje);
}


//4to: muestro al primer momento de ejecucion el mensaje de donde provienen los datos iniciales en el cuadro central de la pagina
function mostrarEnPantallaCentral(html) {
    pantallaCentral.innerHTML = html;
}


//5to: muestra en mi aside derecho registros de data.json inicialmente, luego mas los creados pero solo los ultimos 10 registros
function actualizarLog() {
    logDerecho.innerHTML = "";
    if (palabrasGuardadas.length === 0) {
        logDerecho.innerHTML = "<p class='placeholder-text'>Sin actividad reciente.</p>";
        return;
    }
    
    const lista = document.createElement("ul");
    lista.style.listStyle = "none";
    lista.style.padding = "0";

    //escojo los ultimos 10 registros, los acomodo en el orden que quiero mostrar invirtiendo el "pedazo de array" para mostrar el ultinmo dato ingresado de primero, itero por cada uno para crear la lista. 
    palabrasGuardadas.slice(-10).reverse().forEach(item => {
        const li = document.createElement("li");
        li.className = "log-item";
        li.innerHTML = `<strong>${item.texto}</strong><br><small>${item.accion} - ${item.fecha}</small>`;
        lista.appendChild(li);
    });
    logDerecho.appendChild(lista);
}



//  6to: MANEJADOR DE EVENTOS. Aca dispongo de las 9 acciones del programa. 
containerBotones.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn__menu");
    if (!boton) return;

    const accion = boton.dataset.action;
    const valorInput = input.value.trim();

    switch (accion) {
        case "mayus":
            if (!validarEntrada(valorInput)) break; // Si está vacío, sale
            input.value = valorInput.toUpperCase();
            mostrarEnPantallaCentral(`<h3>Transformación</h3><p style="font-size: 2rem;">${input.value}</p>`);
            break;

        case "minus":
            if (!validarEntrada(valorInput)) break; // Si está vacío, sale
            input.value = valorInput.toLowerCase();
            mostrarEnPantallaCentral(`<h3>Transformación</h3><p style="font-size: 2rem;">${input.value}</p>`);
            break;

        case "guardar":
            if (!validarEntrada(valorInput)) break; 

            const nuevo = new Registro(valorInput, "Guardado");
            palabrasGuardadas.push(nuevo);
            guardarEnStorage();
            actualizarLog();
            input.value = "";

            Swal.fire({
                icon: 'success',
                title: 'Guardado correctamente',
                showConfirmButton: false,
                timer: 1500
            });

            mostrarEnPantallaCentral(`<h3>¡Guardado!</h3><p>La palabra "${nuevo.texto}" se añadió al registro.</p>`);
            break;

        case "visualizar":
            const todos = palabrasGuardadas.map(p => `<li>${p.texto}</li>`).join("");
            mostrarEnPantallaCentral(`<h3>Palabras Guardadas</h3><ul style="text-align:left; display:inline-block">${todos || "No hay datos"}</ul>`);
            break;

        case "menosCaracter":
            const menor = calcularExtremo('min');
            mostrarEnPantallaCentral(menor 
                ? `<h3>Menor Longitud</h3><p style="font-size: 1.5rem; color: var(--primary)">${menor.texto}</p><small>${menor.texto.length} letras</small>` 
                : "<h3>Sin datos</h3>");
            break;

        case "mayorCaracter":
            const mayor = calcularExtremo('max');
            mostrarEnPantallaCentral(mayor 
                ? `<h3>Mayor Longitud</h3><p style="font-size: 1.5rem; color: var(--primary)">${mayor.texto}</p><small>${mayor.texto.length} letras</small>` 
                : "<h3>Sin datos</h3>");
            break;

        case "ordenar":
            const ordenadas = obtenerListaOrdenada();
            const listaHtml = ordenadas.map(p => `<li>${p.texto}</li>`).join("");
            mostrarEnPantallaCentral(`<h3>Lista Ordenada A-Z</h3><ul style="text-align:left; display:inline-block">${listaHtml}</ul>`);
            break;

        case "eliminar":
            if (palabrasGuardadas.length > 0) {
                const eliminado = palabrasGuardadas.pop();
                guardarEnStorage();
                actualizarLog();
                mostrarEnPantallaCentral(`<h3>Eliminado</h3><p>Se quitó "${eliminado.texto}".</p>`);
            } else {
                Swal.fire('Error', 'No hay nada que eliminar', 'error');
            }
            break;

        case "borrarTodo":
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto y se limpiará el LocalStorage!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Sí, borrar todo',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    palabrasGuardadas = [];
                    localStorage.clear();
                    guardarEnStorage();
                    actualizarLog();
                    mostrarEnPantallaCentral("<h3>Base de Datos Limpia</h3>");
                    Swal.fire('¡Eliminado!', 'Tu base de datos ha sido reseteada.', 'success');
                }
            });
            break;

        default:
            console.warn("Acción desconocida:", accion);
    }
});

// INICIO
inicializarDatos();