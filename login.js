import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Função para verificar se o perfil foi configurado
async function isProfileConfigured(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists();
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Verificar se o perfil foi configurado
    const profileConfigured = await isProfileConfigured(user);
    if (!profileConfigured) {
      // Redireciona para a página de personalização de perfil
      window.location.href = "profile-setup.html";
    } else {
      // Caso o perfil já esteja configurado, redireciona para a home
      alert("Login realizado com sucesso!");
      window.location.href = "home.html";
    }
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
});