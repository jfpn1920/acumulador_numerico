//---------------------------------------//
//--|funcionalidad_acumulador_numerico|--//
//---------------------------------------//
const valorTexto = document.getElementById('valor');
const btnSumar = document.getElementById('btnSumar');
const btnRestar = document.getElementById('btnRestar');
const btnReiniciar = document.getElementById('btnReiniciar');
const inputPaso = document.getElementById('paso');
const clicsTexto = document.getElementById('clics');
const maximoTexto = document.getElementById('maximo');
const listaHistorial = document.getElementById('historial');
const textoVacio = document.getElementById('vacio');
const CLAVE = 'acumulador_estado';
const estadoInicial = {
    valor: 0,
    paso: 1,
    clics: 0,
    maximo: 0,
    historial: []
};
//-----------------------------//
//--|leer_el_estado_guardado|--//
//-----------------------------//
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        return guardado
            ? { ...estadoInicial, ...JSON.parse(guardado) }
            : { ...estadoInicial };
    } catch (error) {
        return { ...estadoInicial };
    }
}
let estado = leerEstado();
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
//-----------------------------//
//--|registrar_un_movimiento|--//
//-----------------------------//
function registrarMovimiento(texto) {
    const hora = new Date().toLocaleTimeString(
        'es-CO',
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    );
    estado.historial.unshift({
        texto,
        hora
    });
    estado.historial = estado.historial.slice(0, 5);
}
//-----------------------------------//
//--|cambiar_el_valor_del_contador|--//
//-----------------------------------//
function cambiarValor(direccion) {
    const cambio = estado.paso * direccion;
    estado.valor += cambio;
    estado.clics++;
    if (estado.valor > estado.maximo) {
        estado.maximo = estado.valor;
    }
    const signo = cambio > 0 ? '+' : '';
    registrarMovimiento(`${signo}${cambio} → ${estado.valor}`);
    guardarEstado();
    dibujarPantalla();
    valorTexto.classList.remove('pulso');
    void valorTexto.offsetWidth;
    valorTexto.classList.add('pulso');
}
//---------------------------//
//--|cambiar_el_incremento|--//
//---------------------------//
function cambiarPaso() {
    const numero = parseInt(inputPaso.value, 10);
    if (isNaN(numero) || numero < 1) {
        return;
    }
    estado.paso = numero;
    guardarEstado();
}
//-------------------------------//
//--|reiniciar_todos_los_datos|--//
//-------------------------------//
function reiniciar() {
    if (!confirm('¿Seguro que quieres reiniciar todo?')) {
        return;
    }
    estado = {
        ...estadoInicial,
        historial: []
    };
    guardarEstado();
    dibujarPantalla();
}
//----------------------------//
//--|actualizar_la_pantalla|--//
//----------------------------//
function dibujarPantalla() {
    valorTexto.textContent = estado.valor;
    clicsTexto.textContent = estado.clics;
    maximoTexto.textContent = estado.maximo;
    inputPaso.value = estado.paso;
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
    textoVacio.hidden = estado.historial.length > 0;
}
//----------------------------//
//--|eventos_de_los_botones|--//
//----------------------------//
btnSumar.addEventListener('click', () => {
    cambiarValor(1);
});
btnRestar.addEventListener('click', () => {
    cambiarValor(-1);
});
btnReiniciar.addEventListener('click', reiniciar);
inputPaso.addEventListener('input', cambiarPaso);
inputPaso.addEventListener('change', () => {
    inputPaso.value = estado.paso;
});
dibujarPantalla();