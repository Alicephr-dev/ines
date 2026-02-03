let myFolders = ["Gatinhos", "Favoritos", "Ideias Inês"];

function loadPhotos() {
  const feed = document.getElementById("photo-feed");
  if (!feed) return;

  feed.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const randomId = Math.floor(Math.random() * 5000);
    const imgUrl = `https://loremflickr.com/400/${400 + (i % 3) * 100}/cat?lock=${randomId}`;

    const card = document.createElement("div");
    card.className = "photo-card";
    card.innerHTML = `
            <img src="${imgUrl}" alt="Gatinho">
            <div class="overlay">
                <button class="save-btn">Salvar</button>
                <button class="report-ia-btn" title="Denunciar IA">🔴</button>
            </div>
        `;

    card.querySelector(".save-btn").onclick = () => openSave(imgUrl);
    card.querySelector(".report-ia-btn").onclick = () => {
      if (confirm("Bloquear esta imagem de IA?")) card.remove();
    };

    feed.appendChild(card);
  }
}

function openSave(url) {
  document.getElementById("img-preview").src = url;
  document.getElementById("modal-save").style.display = "flex";
  renderFolders();
}

function renderFolders() {
  const list = document.getElementById("dynamic-folder-list");
  list.innerHTML = "";
  myFolders.forEach((folder) => {
    const btn = document.createElement("button");
    btn.className = "folder-item";
    btn.innerText = folder;
    btn.onclick = () => {
      alert(`Salvo em ${folder}!`);
      closeModal("modal-save");
    };
    list.appendChild(btn);
  });
}

function addNewFolder() {
  const input = document.getElementById("new-folder-name");
  const name = input.value.trim();
  if (name) {
    myFolders.push(name);
    input.value = "";
    renderFolders();
    alert(`Pasta "${name}" criada!`);
  }
}

function openAuth(type) {
  document.getElementById("auth-title").innerText =
    type === "login" ? "Bem-vinda de volta!" : "Criar conta🐈‍⬛";
  document.getElementById("modal-auth").style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", loadPhotos);
