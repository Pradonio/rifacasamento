// Importar funções necessárias do SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Configuração do seu aplicativo Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDBgCqbqzr6Bkkv1Z9CMBivVonZDa3e-fY",
    authDomain: "rifa-victor-e-luana.firebaseapp.com",
    databaseURL: "https://rifa-victor-e-luana-default-rtdb.firebaseio.com",
    projectId: "rifa-victor-e-luana",
    storageBucket: "rifa-victor-e-luana.appspot.com",
    messagingSenderId: "720917477516",
    appId: "1:720917477516:web:e3066203c220a6de2723a9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Autenticar Victor e Luana (modifique os emails e senhas conforme necessário)
const emailVictor = "seu_email@example.com";
const senhaVictor = "sua_senha";
const emailLuana = "email_luana@example.com";
const senhaLuana = "senha_luana";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário autenticado:", user.email);
        // Carregar reservas ao iniciar sessão
        carregarReservas();
    } else {
        console.log("Usuário não autenticado");
        // Realizar login automático (opcional)
        login(emailVictor, senhaVictor); // Mude para Luana se necessário
    }
});

// Função para adicionar número da rifa
function adicionarNumeroRifa() {
    const rifaNumeros = document.getElementById("rifa-numeros");
    for (let i = 1; i <= 150; i++) {
        const numeroDiv = document.createElement("div");
        numeroDiv.className = "numero";
        numeroDiv.textContent = i;
        numeroDiv.onclick = () => reservarNumero(i);
        rifaNumeros.appendChild(numeroDiv);
    }
}

// Função para reservar número
function reservarNumero(numero) {
    const nome = prompt("Digite seu nome para reservar:");
    if (nome) {
        const reservasRef = ref(database, 'reservas/' + numero);
        set(reservasRef, {
            nome: nome,
            status: 'reservado'
        });
    } else {
        alert("Nome é obrigatório para reservar.");
    }
}

// Função para carregar reservas
function carregarReservas() {
    const reservasRef = ref(database, 'reservas');
    onValue(reservasRef, (snapshot) => {
        const reservas = snapshot.val();
        const listaReservas = document.getElementById("reservas-lista");
        listaReservas.innerHTML = ""; // Limpa a lista atual

        for (const numero in reservas) {
            const itemLista = document.createElement("li");
            itemLista.textContent = `Número: ${numero}, Nome: ${reservas[numero].nome}, Status: ${reservas[numero].status}`;
            listaReservas.appendChild(itemLista);

            // Atualizar a cor do número correspondente
            const numeroDiv = document.querySelector(`.numero:nth-child(${numero})`);
            if (numeroDiv) {
                if (reservas[numero].status === 'reservado') {
                    numeroDiv.classList.add("reservado");
                } else if (reservas[numero].status === 'pago') {
                    numeroDiv.classList.add("pago");
                }
            }
        }
    });
}

// Função para aprovar reserva
function aprovarReserva() {
    const numero = document.getElementById("numero-aprovar").value;
    const reservasRef = ref(database, 'reservas/' + numero);
    set(reservasRef, {
        ...reservas[numero],
        status: 'pago'
    });
}

// Função para reprovar reserva
function reprovarReserva() {
    const numero = document.getElementById("numero-aprovar").value;
    const reservasRef = ref(database, 'reservas/' + numero);
    set(reservasRef, {
        ...reservas[numero],
        status: 'reservado' // Você pode ajustar o status conforme necessário
    });
}

// Função para exportar dados para TXT
function exportarDados() {
    const reservasRef = ref(database, 'reservas');
    reservasRef.once('value').then((snapshot) => {
        const reservas = snapshot.val();
        const dataStr = JSON.stringify(reservas);
        const blob = new Blob([dataStr], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reservas.txt";
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Função para importar dados de um arquivo TXT
function importarDados(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const reservas = JSON.parse(event.target.result);
        for (const numero in reservas) {
            const reservasRef = ref(database, 'reservas/' + numero);
            set(reservasRef, reservas[numero]);
        }
    };
    reader.readAsText(file);
}

// Função para mostrar o painel de controle
function mostrarPainelControle() {
    const painel = document.getElementById("painel-controle");
    painel.style.display = painel.style.display === "none" ? "block" : "none";
}

// Chamar a função para adicionar números da rifa
adicionarNumeroRifa();
