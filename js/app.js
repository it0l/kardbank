import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwFR62axvxdK2_ImKIPKu9o2tCc74Z7eQ",
  authDomain: "kardbank-contratos-1a1e9.firebaseapp.com",
  projectId: "kardbank-contratos-1a1e9",
  storageBucket: "kardbank-contratos-1a1e9.firebasestorage.app",
  messagingSenderId: "449626007544",
  appId: "1:449626007544:web:c984a843e1af2ff0a5180d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const openBtn = document.getElementById('open-menu');
const closeBtn = document.getElementById('close-menu');

const stepCpf = document.getElementById('step-cpf');
const stepContract = document.getElementById('step-contract');
const stepSuccess = document.getElementById('step-success');
const inputCpf = document.getElementById('cpf-input');

let userCpf = "";

// Sidebar Logic
const toggleSidebar = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
};

openBtn.onclick = toggleSidebar;
closeBtn.onclick = toggleSidebar;
overlay.onclick = toggleSidebar;

// CPF Mask
inputCpf.oninput = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
};

// Flow Logic
document.getElementById('form-cpf').onsubmit = (e) => {
    e.preventDefault();
    if (inputCpf.value.length < 14) return alert("CPF incompleto!");
    userCpf = inputCpf.value;
    stepCpf.classList.remove('active');
    stepCpf.classList.add('hidden');
    stepContract.classList.remove('hidden');
    stepContract.classList.add('active');
};

document.getElementById('agree-terms').onchange = (e) => {
    document.getElementById('btn-sign').disabled = !e.target.checked;
};

document.getElementById('form-contract').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-sign');
    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    try {
        await addDoc(collection(db, "contratos_assinados"), {
            cpf: userCpf,
            data: serverTimestamp(),
            aceite: true
        });
        stepContract.classList.remove('active');
        stepContract.classList.add('hidden');
        stepSuccess.classList.remove('hidden');
        stepSuccess.classList.add('active');
    } catch (err) {
        alert("Erro ao salvar. Verifique sua conexão.");
        btn.innerText = "ASSINAR DIGITALMENTE";
        btn.disabled = false;
    }
};