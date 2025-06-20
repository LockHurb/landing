import "./firebase.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

function mostrarSolicitudes() {
  const db = getDatabase(getApp());
  const contactosRef = ref(db, "contactos");
  const contenedor = document.getElementById("solicitudes-enviadas");
  if (!contenedor) return;

  onValue(contactosRef, (snapshot) => {
    contenedor.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.values(data).forEach(contacto => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.borderRadius = "8px";
        card.style.padding = "16px";
        card.style.marginBottom = "16px";
        card.style.background = "#fafafa";
        card.innerHTML = `
          <strong>Nombre:</strong> ${contacto.nombre || ""}<br>
          <strong>Email:</strong> ${contacto.email || ""}<br>
          <strong>Teléfono:</strong> ${contacto.telefono || ""}<br>
          <strong>Programa de interés:</strong> ${contacto.programa || ""}<br>
          <strong>Mensaje adicional:</strong> ${contacto.mensaje || ""}<br>
          <strong>Estado:</strong> ${contacto.estado || ""}<br>
          <strong>Fecha de envío:</strong> ${contacto.fechaEnvio || ""}<br>
          <strong>Timestamp:</strong> ${contacto.timestamp || ""}
        `;
        contenedor.appendChild(card);
      });
    } else {
      contenedor.innerHTML = "<p>No hay solicitudes registradas.</p>";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSolicitudes();
});
