import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("solicitudes-lista");
  leerSolicitudes((data) => {
    if (data) {
      contenedor.innerHTML = "";
      Object.entries(data).forEach(([id, solicitud]) => {
        const div = document.createElement("div");
        div.className = "p-4 bg-blue-100 rounded shadow";
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${solicitud.nombre}</p>
          <p><strong>Email:</strong> ${solicitud.email}</p>
          <p><strong>Mensaje:</strong> ${solicitud.mensaje}</p>
        `;
        contenedor.appendChild(div);
      });
    } else {
      contenedor.innerHTML = "<p>No hay solicitudes registradas.</p>";
    }
  });
});

setupCounter(document.querySelector('#counter'))
