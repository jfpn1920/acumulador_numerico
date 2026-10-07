// ===== REFERENCIAS A LOS ELEMENTOS DEL HTML =====
const valorTexto = document.getElementById('valor');
const btnSumar = document.getElementById('btnSumar');
const btnRestar = document.getElementById('btnRestar');
const btnReiniciar = document.getElementById('btnReiniciar');
const inputPaso = document.getElementById('paso');
const clicsTexto = document.getElementById('clics');
const maximoTexto = document.getElementById('maximo');
const listaHistorial = document.getElementById('historial');
const textoVacio = document.getElementById('vacio');
// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'acumulador_estado';
// ===== ESTADO POR DEFECTO =====
// valor: número actual | paso: cuánto cambia por clic | clics: veces presionado
// maximo: valor más alto alcanzado | historial: últimos movimientos
const estadoInicial = { valor: 0, paso: 1, clics: 0, maximo: 0, historial: [] };
// ===== LEER EL ESTADO GUARDADO =====
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        // Si hay datos guardados los usamos; si no, partimos del estado inicial
        return guardado ? { ...estadoInicial, ...JSON.parse(guardado) } : { ...estadoInicial };
    } catch (error) {
      return { ...estadoInicial }; // si algo falla, empezamos desde cero
    }
}
// Al cargar la página recuperamos lo que ya estaba guardado
let estado = leerEstado();
// ===== GUARDAR EL ESTADO =====
// Guarda todo el estado como texto en localStorage
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// ===== REGISTRAR UN MOVIMIENTO EN EL HISTORIAL =====
function registrarMovimiento(texto) {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    estado.historial.unshift({ texto, hora });  // unshift lo pone de primero
    estado.historial = estado.historial.slice(0, 5);  // solo conservamos los últimos 5
}
// ===== CAMBIAR EL CONTADOR (suma o resta) =====
// direccion vale 1 para sumar y -1 para restar
function cambiarValor(direccion) {
    const cambio = estado.paso * direccion;
    estado.valor += cambio;
    estado.clics++;
    if (estado.valor > estado.maximo) estado.maximo = estado.valor;  // actualiza el máximo
    // Texto del movimiento, por ejemplo "+5 → 15"
    const signo = cambio > 0 ? '+' : '';
    registrarMovimiento(`${signo}${cambio} → ${estado.valor}`);
    guardarEstado();
    dibujarPantalla();
    // Reinicia la animación del número para que se vea en cada clic
    valorTexto.classList.remove('pulso');
    void valorTexto.offsetWidth;  // truco para que el navegador reinicie la animación
    valorTexto.classList.add('pulso');
}
// ===== CAMBIAR EL INCREMENTO =====
function cambiarPaso() {
    const numero = parseInt(inputPaso.value, 10);
    if (isNaN(numero) || numero < 1) return;  // ignoramos valores inválidos
    estado.paso = numero;
    guardarEstado();
}
// ===== REINICIAR TODO =====
function reiniciar() {
    if (!confirm('¿Seguro que quieres reiniciar todo?')) return;
    estado = { ...estadoInicial, historial: [] };  // volvemos al estado inicial
    guardarEstado();
    dibujarPantalla();
}
// ===== ACTUALIZAR TODO LO QUE SE VE EN PANTALLA =====
function dibujarPantalla() {
    valorTexto.textContent = estado.valor;
    clicsTexto.textContent = estado.clics;
    maximoTexto.textContent = estado.maximo;
    inputPaso.value = estado.paso;
    // Dibujamos el historial
    listaHistorial.innerHTML = '';
    estado.historial.forEach(movimiento => {
        const item = document.createElement('li');
        const texto = document.createElement('span');
        texto.textContent = movimiento.texto;
        const hora = document.createElement('span');
        hora.className = 'hora';
        hora.textContent = movimiento.hora;
        item.append(texto, hora);
        listaHistorial.appendChild(item);
    });
    // Mostramos u ocultamos el texto de "sin movimientos"
    textoVacio.hidden = estado.historial.length > 0;
}
// ===== EVENTOS =====
btnSumar.addEventListener('click', () => cambiarValor(1));    // suma
btnRestar.addEventListener('click', () => cambiarValor(-1));  // resta
btnReiniciar.addEventListener('click', reiniciar);
inputPaso.addEventListener('input', cambiarPaso);             // guarda mientras se escribe
// Al salir del campo, si quedó vacío o inválido, volvemos al último valor correcto
inputPaso.addEventListener('change', () => { inputPaso.value = estado.paso; });
// ===== INICIO: se ejecuta al cargar o refrescar la página =====
dibujarPantalla();