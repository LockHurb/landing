import "./firebase.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getRegistros } from './firebase_funcs.js';

async function mostrarSolicitudes() {
  const contenedor = document.getElementById("solicitudes-lista");
  if (!contenedor) return;

  contenedor.innerHTML = "<p>Cargando solicitudes...</p>";

  try {
    const solicitudes = await getRegistros();
    if (solicitudes.length === 0) {
      contenedor.innerHTML = "<p>No hay solicitudes registradas.</p>";
      return;
    }

    contenedor.innerHTML = "";
    solicitudes.forEach(contacto => {
      const card = document.createElement("div");
      card.className = "bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition-shadow duration-300";
      card.innerHTML = `
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Nombre:</span> ${contacto.nombre || ""}
        </div>
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Email:</span> ${contacto.email || ""}
        </div>
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Teléfono:</span> ${contacto.telefono || ""}
        </div>
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Programa de interés:</span> <span class="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">${contacto.programa || ""}</span>
        </div>
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Mensaje adicional:</span> ${contacto.mensaje || ""}
        </div>
        <div class="mb-2">
          <span class="font-semibold text-blue-700">Estado:</span> <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">${contacto.estado || ""}</span>
        </div>
        <div class="text-xs text-gray-500 mt-2">
          <span class="font-semibold">Fecha de envío:</span> ${contacto.fechaEnvio ? new Date(contacto.fechaEnvio).toLocaleString() : ""}
        </div>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    contenedor.innerHTML = "<p class='text-red-500'>Error al cargar las solicitudes.</p>";
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSolicitudes();
});
