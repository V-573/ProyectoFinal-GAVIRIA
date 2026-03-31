// Definición del objeto para cada palabra
function Registro(texto, accion = "Manual") {
    this.id = Date.now();
    this.texto = texto;
    this.accion = accion;
    this.fecha = new Date().toLocaleTimeString();
}

//1ro: leemos storage si tiene datos previos en el navegador. Sino tene datos el array empieza vacio. En el primer flujo solo se hace esta linea de codigo.
let palabrasGuardadas = JSON.parse(localStorage.getItem("palabrasGuardadas")) || [];



// uso de funciones de orden superior de cálculo puro (sin tocar el DOM)
function calcularExtremo(tipo) {
    if (palabrasGuardadas.length === 0) return null;
    return palabrasGuardadas.reduce((acc, curr) => {
        return (tipo === 'max') 
            ? (curr.texto.length > acc.texto.length ? curr : acc)
            : (curr.texto.length < acc.texto.length ? curr : acc);
    });
}

function obtenerListaOrdenada() {
    return [...palabrasGuardadas].sort((a, b) => a.texto.localeCompare(b.texto));
}
//a.texto.localeCompare(b.texto) Compara dos cadenas de texto teniendo en cuenta las reglas del idioma (acentos, la letra "ñ", mayúsculas, etc.).