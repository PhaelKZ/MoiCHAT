// Importando os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";  // Importando o Firebase Storage

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUJmN0sihYuJ_X10fnVSqPge2cG_i3x_k",
  authDomain: "moichatz.firebaseapp.com",
  projectId: "moichatz",
  storageBucket: "moichatz.appspot.com",  // Corrigido para o correto valor de storageBucket
  messagingSenderId: "520240695697",
  appId: "1:520240695697:web:459f44882bda66fe0ef230",
  measurementId: "G-7E2D4PQ2XY"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);  // Inicializando o Firebase Storage

// Exportando os módulos para uso em outros arquivos
export { auth, db, analytics, storage };  // Exportando também o storage