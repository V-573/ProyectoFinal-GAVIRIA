const urlLocal = './db/data.json'
// Guarda el estado actual en el navegador
function guardarEnStorage() {
    localStorage.setItem("palabrasGuardadas", JSON.stringify(palabrasGuardadas));
}

//2do: Carga inicial asincrónica desde archivo data.json 
async function inicializarDatos() {
    try {
        if (palabrasGuardadas.length === 0) { //si el array en el paso 1 se cargo como vacio. 
            const response = await fetch(urlLocal);
            if (!response.ok) throw new Error("Error en JSON");
            
            const datosJson = await response.json();
            palabrasGuardadas = datosJson.map(p => new Registro(p, "Carga Inicial"));
            
            guardarEnStorage();
            
            mostrarMensajeInicial(true); //funcion para mostrar el primer mensaje de donde se estan cargando los datos, en este caso desde data.json
        } else { // si el array en el paso 1 tenia datos
            mostrarMensajeInicial(false); //funcion para mostrar el primer mensaje de donde se estan cargando los datos, en este caso desde localStorage
        }
        actualizarLog(); // Refresca el panel derecho
    } catch (error) {
        console.error("Fallo al cargar datos:", error);
    }
}