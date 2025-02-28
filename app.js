// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUJmN0sihYuJ_X10fnVSqPge2cG_i3x_k",
  authDomain: "moichatz.firebaseapp.com",
  projectId: "moichatz",
  storageBucket: "moichatz.appspot.com",
  messagingSenderId: "520240695697",
  appId: "1:520240695697:web:459f44882bda66fe0ef230",
  measurementId: "G-7E2D4PQ2XY"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const messagesRef = db.collection('messages');
const usersRef = db.collection('users'); // Supondo que você tenha uma coleção de usuários

let selectedReceiverId = null; // Armazena o ID do destinatário selecionado

// Função para carregar os usuários
const loadUsers = () => {
  const userListContainer = document.getElementById('userList').querySelector('ul');
  usersRef.get().then(snapshot => {
    userListContainer.innerHTML = ''; // Limpa a lista de usuários
    
    snapshot.forEach(doc => {
      const user = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = user.name;
      listItem.addEventListener('click', () => {
        selectedReceiverId = doc.id; // Define o ID do usuário selecionado
        loadMessages(); // Carrega as mensagens para o usuário selecionado
      });
      userListContainer.appendChild(listItem);
    });
  }).catch(error => console.error("Erro ao carregar usuários:", error));
};

// Função para enviar mensagem
document.getElementById('sendMessageButton').addEventListener('click', async () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  
  if (message && selectedReceiverId) {
    const senderId = auth.currentUser.uid;
    
    try {
      // Envia a mensagem para o Firestore
      await messagesRef.add({
        senderId: senderId,
        receiverId: selectedReceiverId,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      messageInput.value = ''; // Limpa o campo de entrada após o envio
      loadMessages(); // Recarrega as mensagens para mostrar a mensagem recém-enviada
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
    }
  } else {
    alert("Por favor, selecione um destinatário e escreva uma mensagem!");
  }
});

// Função para carregar mensagens
const loadMessages = () => {
  if (!selectedReceiverId) return;
  
  const messagesContainer = document.getElementById('messagesContainer');
  
  // Escuta as mudanças na coleção de mensagens
  messagesRef.where('senderId', 'in', [auth.currentUser.uid, selectedReceiverId])
    .where('receiverId', 'in', [auth.currentUser.uid, selectedReceiverId])
    .orderBy('timestamp', 'asc')
    .onSnapshot((snapshot) => {
      messagesContainer.innerHTML = ''; // Limpa mensagens anteriores
      
      snapshot.forEach(doc => {
        const messageData = doc.data();
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        // Verifica se é uma mensagem enviada pelo usuário
        if (messageData.senderId === auth.currentUser.uid) {
          messageElement.classList.add('sent');
        } else {
          messageElement.classList.add('received');
        }
        
        messageElement.textContent = messageData.message; // Exibe a mensagem
        messagesContainer.appendChild(messageElement);
      });
    });
};

// Função para logout
document.getElementById('logoutButton').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'login.html'; // Redireciona para o login após logout
  });
});

// Carregar lista de usuários e configurar estado de autenticação
auth.onAuthStateChanged(user => {
  if (user) {
    loadUsers(); // Carrega os usuários quando o usuário estiver autenticado
  } else {
    window.location.href = 'login.html'; // Redireciona para o login se não estiver autenticado
  }
});