import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

/* Configuración de Firebase (aquí debes poner tu configuración real o usar variables de entorno si trabajas con Vite) */
const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://landingpage-7f0ce-default-rtdb.firebaseio.com",
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
