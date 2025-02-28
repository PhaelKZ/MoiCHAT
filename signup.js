import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Função para verificar se o perfil foi configurado
async function isProfileConfigured(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists();
}

document.getElementById("signupBtn").addEventListener("click", async () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const birthDate = document.getElementById("birthDate").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  // Verificação de idade mínima
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  if (currentYear - birthYear < 12) {
    alert("Você precisa ter pelo menos 12 anos para se cadastrar.");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar o perfil do usuário
    await updateProfile(user, { displayName: username });
    
    // Armazenar informações no Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      username,
      email,
      birthDate
    });
    
    // Verificar se o perfil foi configurado
    const profileConfigured = await isProfileConfigured(user);
    if (!profileConfigured) {
      // Redireciona para a página de personalização de perfil
      window.location.href = "profile-setup.html";
    } else {
      // Caso o perfil já esteja configurado, redireciona para a home
      alert("Cadastro realizado com sucesso!");
      window.location.href = "home.html";
    }
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
})