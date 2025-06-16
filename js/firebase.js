/* src/firebase.js */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

/* Objeto de configuración alimentado por variables de entorno (.env) */
const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* 1️⃣ Inicializar la app */
const app = initializeApp(firebaseConfig);

/* 2️⃣ Obtener la instancia de la Realtime Database */
const db = getDatabase(app);

/* Función para guardar un voto */
export const saveVote = (productID) => {
  const votesRef = ref(db, "votes");
  const newVoteRef = push(votesRef);
  const voteData = {
    productID,
    date: new Date().toISOString(),
  };
  return set(newVoteRef, voteData)
    .then(() => ({
      success: true,
      message: "Voto guardado exitosamente.",
    }))
    .catch((error) => ({
      success: false,
      message: "Error al guardar el voto.",
      error,
    }));
};

/* 3️⃣ Ejemplos de referencia y escritura (comentados por ahora) */
// const rootRef   = ref(db);                     // referencia a la raíz
// const listRef   = ref(db, "productos");        // nodo específico
// const newItem   = push(listRef);               // genera clave única
// await set(newItem, { nombre: "Zapato", stock: 12 });

/* Sin exportaciones por el momento */
