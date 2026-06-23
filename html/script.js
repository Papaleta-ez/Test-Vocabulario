const preguntasFormaA = [
  {
    pregunta: "1 - 3 - 5 - 7 - ____ - 11 - 13",
    opciones: {
      A: "8",
      B: "9",
      C: "10",
      D: "12"
    },
    correcta: "B"
  },
  {
    pregunta: "2 - 4 - 6 - 8 - ____ - 12",
    opciones: {
      A: "9",
      B: "10",
      C: "11",
      D: "14"
    },
    correcta: "B"
  },
  {
    pregunta: "5 - 10 - 15 - 20 - ____",
    opciones: {
      A: "22",
      B: "23",
      C: "25",
      D: "30"
    },
    correcta: "C"
  }
];

const preguntasFormaB = [
  {
    pregunta: "Casa es a techo como carro es a ____",
    opciones: {
      A: "llanta",
      B: "motor",
      C: "puerta",
      D: "carretera"
    },
    correcta: "B"
  },
  {
    pregunta: "Día es a noche como claro es a ____",
    opciones: {
      A: "oscuro",
      B: "sol",
      C: "luna",
      D: "tarde"
    },
    correcta: "A"
  },
  {
    pregunta: "Si A, B, C, D continúa, ¿qué letra sigue?",
    opciones: {
      A: "F",
      B: "G",
      C: "E",
      D: "H"
    },
    correcta: "C"
  }
];

let preguntas = [];
let indicePregunta = 0;
let aciertos = 0;
let tiempoRestante = 0;
let intervalo;

// ==========================
// INICIO DEL TEST
// ==========================
function comenzarTest() {
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipoTest = document.getElementById("tipoTest").value;

  if (nombres === "" || apellidos === "") {
    alert("Ingrese nombres y apellidos antes de comenzar.");
    return;
  }

  const fechaActual = new Date();

  localStorage.setItem("nombres", nombres);
  localStorage.setItem("apellidos", apellidos);
  localStorage.setItem("tipoTest", tipoTest);
  localStorage.setItem("fecha", fechaActual.toLocaleDateString());
  localStorage.setItem("horaInicio", fechaActual.toLocaleTimeString());
  localStorage.setItem("indicePregunta", "0");
  localStorage.setItem("aciertos", "0");

  if (tipoTest === "A") {
    localStorage.setItem("tiempo", 10 * 60);
  } else {
    localStorage.setItem("tiempo", 12 * 60);
  }

  location.href = "pregunta.html";
}

// ==========================
// DETECTAR PÁGINA
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  const pagina = window.location.pathname.split("/").pop();

  if (pagina === "pregunta.html") {
    iniciarPaginaPregunta();
  }
});

// ==========================
// PÁGINA DE PREGUNTAS
// ==========================
function iniciarPaginaPregunta() {
  const nombres = localStorage.getItem("nombres");
  const apellidos = localStorage.getItem("apellidos");
  const fecha = localStorage.getItem("fecha");
  const horaInicio = localStorage.getItem("horaInicio");
  const tipoTest = localStorage.getItem("tipoTest");

  if (!nombres || !apellidos || !tipoTest) {
    location.href = "index.html";
    return;
  }

  document.getElementById("nombreCompleto").textContent = nombres + " " + apellidos;
  document.getElementById("fechaTest").textContent = fecha;
  document.getElementById("horaInicio").textContent = horaInicio;

  if (tipoTest === "A") {
    preguntas = preguntasFormaA;
  } else {
    preguntas = preguntasFormaB;
  }

  indicePregunta = parseInt(localStorage.getItem("indicePregunta"));
  aciertos = parseInt(localStorage.getItem("aciertos"));
  tiempoRestante = parseInt(localStorage.getItem("tiempo"));

  mostrarPregunta();
  iniciarTemporizador();
}

// ==========================
// MOSTRAR PREGUNTA
// ==========================
function mostrarPregunta() {
  const preguntaActual = preguntas[indicePregunta];

  document.getElementById("numeroPregunta").textContent =
    "Pregunta " + (indicePregunta + 1) + " de " + preguntas.length;

  document.getElementById("textoPregunta").textContent = preguntaActual.pregunta;

  document.getElementById("opcionA").textContent = preguntaActual.opciones.A;
  document.getElementById("opcionB").textContent = preguntaActual.opciones.B;
  document.getElementById("opcionC").textContent = preguntaActual.opciones.C;
  document.getElementById("opcionD").textContent = preguntaActual.opciones.D;

  const radios = document.querySelectorAll("input[name='respuesta']");
  radios.forEach(radio => {
    radio.checked = false;
  });
}

// ==========================
// SIGUIENTE PREGUNTA
// ==========================
function siguientePregunta() {
  const respuestaSeleccionada = document.querySelector("input[name='respuesta']:checked");

  if (!respuestaSeleccionada) {
    alert("Seleccione una respuesta antes de continuar.");
    return;
  }

  const preguntaActual = preguntas[indicePregunta];

  if (respuestaSeleccionada.value === preguntaActual.correcta) {
    aciertos++;
  }

  indicePregunta++;

  localStorage.setItem("indicePregunta", indicePregunta);
  localStorage.setItem("aciertos", aciertos);

  if (indicePregunta >= preguntas.length) {
    finalizarTest();
  } else {
    mostrarPregunta();
  }
}

// ==========================
// TEMPORIZADOR
// ==========================
function iniciarTemporizador() {
  intervalo = setInterval(function () {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;

    if (segundos < 10) {
      segundos = "0" + segundos;
    }

    document.getElementById("temporizador").textContent = minutos + ":" + segundos;

    localStorage.setItem("tiempo", tiempoRestante);

    if (tiempoRestante <= 0) {
      finalizarTest();
    }

    tiempoRestante--;
  }, 1000);
}

// ==========================
// FINALIZAR TEST
// ==========================
function finalizarTest() {
  clearInterval(intervalo);

  const horaFin = new Date().toLocaleTimeString();
  localStorage.setItem("horaFin", horaFin);

  location.href = "fin.html";
}