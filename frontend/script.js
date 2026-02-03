window.myFolders = JSON.parse(localStorage.getItem("ines_folders")) || [];
window.userProfile = JSON.parse(localStorage.getItem("ines_profile")) || null;
window.searchHistory = JSON.parse(localStorage.getItem("ines_history")) || [];
window.authMode = "signup";

window.openModal = (id) => {
  document.getElementById(id).style.display = "flex";
};
window.closeModal = (id) => {
  document.getElementById(id).style.display = "none";
};

window.openZoom = (imgSrc) => {
  console.log("Tentando abrir zoom com:", imgSrc);
  const modal = document.getElementById("modal-zoom");
  const img = document.getElementById("zoom-img");

  console.log("Modal encontrado?", !!modal);
  console.log("Imagem encontrada?", !!img);

  if (modal && img) {
    img.src = imgSrc;
    modal.style.display = "flex";
    console.log("Modal aberto");
  } else {
    console.log("Erro: modal ou imagem não encontrada");
  }
};

window.closeZoom = () => {
  console.log("Tentando fechar zoom");
  const modal = document.getElementById("modal-zoom");
  if (modal) {
    modal.style.display = "none";
    console.log("Modal fechado");
  }
};

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-zoom");
  if (e.target === modal) {
    window.closeZoom();
  }
});

// Fechar com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.closeZoom();
  }
});

window.showToast = (msg) => {
  let t = document.getElementById("toast-msg");
  t.innerText = msg;
  t.className = "show";
  setTimeout(() => (t.className = ""), 2000);
};

window.confirmAction = (txt, cb) => {
  document.getElementById("confirm-text").innerText = txt;
  window.openModal("modal-confirm");
  document.getElementById("btn-confirm-yes").onclick = () => {
    cb();
    window.closeModal("modal-confirm");
  };
};

// --- PERFIL ---
window.openProfile = () => {
  const content = document.getElementById("profile-card-content");
  if (!window.userProfile) return window.openModal("modal-auth");

  let historyHtml =
    window.searchHistory.length > 0
      ? window.searchHistory
          .slice(-5)
          .map((h) => `<span class="tag-history">${h}</span>`)
          .join("")
      : "<span style='color:#ccc'>Vazio</span>";

  content.innerHTML = `
        <span class="close" onclick="window.closeModal('modal-profile')">&times;</span>
        <div class="profile-avatar-big">
            <img src="${window.userProfile.avatar || ""}" style="display:${window.userProfile.avatar ? "block" : "none"}">
        </div>
        <h2 style="margin:0;">${window.userProfile.name}</h2>
        <p style="color:#888; margin:5px 0 15px;">${window.userProfile.user}</p>
        <button onclick="window.toggleView('saved'); window.closeModal('modal-profile')" class="btn-main">🖼️ Minhas Pastas</button>
        <button onclick="window.editProfileMode()" class="btn-link" style="margin-top:10px; display:block; width:100%;">Editar Perfil</button>
        <div class="history-section">
            <p>RECENTES</p>
            <div>${historyHtml}</div>
            <button onclick="window.clearHistory()" class="btn-link" style="color:#ff4d4d; font-size:0.7rem; margin-top:10px;">Limpar Histórico 🗑️</button>
        </div>
        <button onclick="localStorage.removeItem('is_logged'); location.reload();" style="margin-top:20px; background:none; border:none; color:#bbb; text-decoration:underline; cursor:pointer; font-size:0.75rem;">Sair</button>
    `;
  window.openModal("modal-profile");
};

window.editProfileMode = () => {
  const content = document.getElementById("profile-card-content");
  content.innerHTML = `
        <span class="close" onclick="window.openProfile()">&larr; Voltar</span>
        <h3 style="margin-top:25px;">Editar Perfil</h3>
        <label style="font-size:0.7rem; font-weight:bold; color:var(--rosa-forte); display:block; text-align:left;">NOME</label>
        <input type="text" id="edit-name" value="${window.userProfile.name}" class="auth-input">
        <label style="font-size:0.7rem; font-weight:bold; color:var(--rosa-forte); display:block; text-align:left;">USUÁRIO</label>
        <input type="text" id="edit-user" value="${window.userProfile.user}" class="auth-input">
        <label for="file-upload" class="btn-upload" style="display:block; border:2px dashed #ffc0cb; padding:10px; border-radius:10px; cursor:pointer; margin-bottom:10px; font-size:0.8rem;">📁 Mudar Foto</label>
        <input type="file" id="file-upload" accept="image/*" style="display:none">
        <button onclick="window.saveProfile()" class="btn-main">Salvar Alterações</button>
    `;
};

window.saveProfile = () => {
  window.userProfile.name = document.getElementById("edit-name").value;
  window.userProfile.user = document.getElementById("edit-user").value;
  localStorage.setItem("ines_profile", JSON.stringify(window.userProfile));
  window.showToast("Perfil salvo! 🤍");
  setTimeout(() => location.reload(), 500);
};

window.clearHistory = () => {
  window.searchHistory = [];
  localStorage.setItem("ines_history", JSON.stringify([]));
  window.openProfile();
};

// --- GESTÃO DE FOTOS ---
window.loadPhotos = (query = "aesthetic") => {
  const feed = document.getElementById("photo-feed");
  feed.innerHTML = "";
  if (query !== "aesthetic" && !window.searchHistory.includes(query)) {
    window.searchHistory.push(query);
    localStorage.setItem("ines_history", JSON.stringify(window.searchHistory));
  }
  for (let i = 0; i < 40; i++) {
    const url = `https://loremflickr.com/400/${Math.floor(Math.random() * 200) + 300}/${query}?lock=${Math.floor(Math.random() * 9999)}`;
    const card = document.createElement("div");
    card.className = "photo-card";
    card.innerHTML = `
            <img src="${url}" class="feed-img" data-zoom="${url}">
            <div class="overlay">
                <button class="btn-save-img" data-save="${url}">💾 Salvar</button>
                <button class="btn-ia-report">🚫 Denunciar</button>
            </div>
        `;
    feed.appendChild(card);
  }

  // Adicionar listeners após criar elementos
  document.querySelectorAll(".feed-img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("Imagem clicada:", img.dataset.zoom);
      window.openZoom(img.dataset.zoom);
    });
  });

  document.querySelectorAll(".btn-save-img").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.openSave(btn.dataset.save);
    });
  });

  document.querySelectorAll(".btn-ia-report").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.reportIA(btn);
    });
  });

  console.log("Event listeners adicionados");
};

window.reportIA = (el) => {
  window.confirmAction("Remover esta imagem do feed?", () => {
    el.closest(".photo-card").remove();
    window.showToast("Removida! 🚫");
  });
};

window.openSave = (url) => {
  if (localStorage.getItem("is_logged") !== "true")
    return window.openModal("modal-auth");
  document.getElementById("img-preview").src = url;
  window.openModal("modal-save");
  const list = document.getElementById("dynamic-folder-list");
  list.innerHTML = "";
  window.myFolders.forEach(
    (f, i) =>
      (list.innerHTML += `<div class="folder-item" onclick="window.saveToFolder(${i})">${f.name} <span>+</span></div>`),
  );
};

window.saveToFolder = (i) => {
  window.myFolders[i].images.push(document.getElementById("img-preview").src);
  localStorage.setItem("ines_folders", JSON.stringify(window.myFolders));
  window.closeModal("modal-save");
  window.showToast("Salvo!");
};

window.addNewFolder = () => {
  const name = document.getElementById("new-folder-name").value;
  if (!name) return window.showToast("Digite um nome para a pasta!");
  window.myFolders.push({
    name,
    images: [document.getElementById("img-preview").src],
  });
  localStorage.setItem("ines_folders", JSON.stringify(window.myFolders));
  document.getElementById("new-folder-name").value = "";
  window.closeModal("modal-save");
  window.showToast("Pasta criada!");
};

window.renderGallery = () => {
  const feed = document.getElementById("photo-feed");
  feed.innerHTML = window.myFolders.length
    ? ""
    : "<h2 style='grid-column:1/-1; text-align:center;'>Nenhuma pasta.</h2>";
  window.myFolders.forEach((f, i) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    card.onclick = () => window.openFolder(i);
    card.innerHTML = `
            <img src="${f.images[0] || "https://via.placeholder.com/400x300?text=Sem+fotos"}" class="folder-thumb" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+fotos'">
            <div style="padding:10px; text-align:center;"><h3>${f.name}</h3><p>${f.images.length} fotos</p></div>
        `;
    feed.appendChild(card);
  });
};

window.openFolder = (i) => {
  const f = window.myFolders[i];
  const feed = document.getElementById("photo-feed");
  feed.innerHTML = `<div style="grid-column:1/-1; text-align:center; margin-bottom:20px;">
        <button onclick="window.renderGallery()" class="btn-back">&larr; Voltar</button>
        <h1>${f.name}</h1>
        <div class="folder-actions">
            <button onclick="window.renameFolder(${i})" class="btn-rename-folder">✏️ Renomear</button>
            <button onclick="window.deleteFolder(${i})" class="btn-delete-folder">🗑️ Excluir</button>
        </div>
    </div>`;

  f.images.forEach((img, idx) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    card.innerHTML = `
            <img src="${img}" class="folder-img" data-zoom="${img}">
            <div class="overlay">
                <button class="btn-remove-photo" data-remove="${idx}">🗑️ Remover</button>
            </div>
        `;
    feed.appendChild(card);
  });

  // Listeners para imagens da pasta
  document.querySelectorAll(".folder-img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      window.openZoom(img.dataset.zoom);
    });
  });

  // Listeners para remover foto
  document.querySelectorAll(".btn-remove-photo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = btn.dataset.remove;
      window.removePhoto(i, idx);
    });
  });
};

window.renameFolder = (i) => {
  const folderName = window.myFolders[i].name;
  document.getElementById("rename-input").value = folderName;
  window.currentFolderIndex = i;
  document.getElementById("modal-rename").style.display = "flex";
  document.getElementById("rename-input").focus();
};

window.closeRenameModal = () => {
  document.getElementById("modal-rename").style.display = "none";
  window.currentFolderIndex = null;
};

window.saveRename = () => {
  const novoNome = document.getElementById("rename-input").value.trim();
  if (!novoNome) {
    window.showToast("Digite um nome válido!");
    return;
  }

  window.myFolders[window.currentFolderIndex].name = novoNome;
  localStorage.setItem("ines_folders", JSON.stringify(window.myFolders));
  window.showToast("Pasta renomeada!");
  window.closeRenameModal();
  window.openFolder(window.currentFolderIndex);
};

window.removePhoto = (fIdx, pIdx) => {
  window.confirmAction("Remover esta foto?", () => {
    window.myFolders[fIdx].images.splice(pIdx, 1);
    localStorage.setItem("ines_folders", JSON.stringify(window.myFolders));
    window.openFolder(fIdx);
    window.showToast("Foto removida!");
  });
};

window.deleteFolder = (i) => {
  window.confirmAction("Excluir pasta e todas as fotos?", () => {
    window.myFolders.splice(i, 1);
    localStorage.setItem("ines_folders", JSON.stringify(window.myFolders));
    window.renderGallery();
    window.showToast("Pasta excluída!");
  });
};

window.handleAuth = () => {
  if (window.authMode === "signup") {
    const name = document.getElementById("reg-name")?.value || "Inês";
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;

    if (!name || !email || !pass) {
      return window.showToast("Preencha todos os campos!");
    }

    window.userProfile = {
      name,
      email,
      pass,
      user: "@" + name.toLowerCase().replace(/\s/g, ""),
      avatar: "",
    };
  } else {
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;

    if (!email || !pass) {
      return window.showToast("Preencha e-mail e senha!");
    }

    // Simulação de login (aqui você colocaria validação real)
    window.userProfile = JSON.parse(localStorage.getItem("ines_profile"));
    if (!window.userProfile) {
      return window.showToast("Usuário não encontrado!");
    }
  }

  localStorage.setItem("ines_profile", JSON.stringify(window.userProfile));
  localStorage.setItem("is_logged", "true");
  window.closeModal("modal-auth");
  location.reload();
};

window.switchAuthMode = () => {
  window.authMode = window.authMode === "signup" ? "login" : "signup";
  const titleEl = document.getElementById("auth-title");
  const switchText = document.getElementById("auth-switch-text");
  const switchLink = document.getElementById("auth-switch-link");
  const fields = document.getElementById("auth-fields");

  if (window.authMode === "login") {
    titleEl.innerText = "Bem-vindo de volta! 🤍";
    switchText.innerText = "Não tem conta?";
    switchLink.innerText = "Criar Conta";
    fields.innerHTML = `<input type="email" id="reg-email" placeholder="E-mail" class="auth-input"><input type="password" id="reg-pass" placeholder="Senha" class="auth-input">`;
  } else {
    titleEl.innerText = "Olá! 🤍";
    switchText.innerText = "Já tem conta?";
    switchLink.innerText = "Entrar";
    fields.innerHTML = `<input type="text" id="reg-name" placeholder="Nome" class="auth-input"><input type="email" id="reg-email" placeholder="E-mail" class="auth-input"><input type="password" id="reg-pass" placeholder="Senha" class="auth-input">`;
  }
};

window.toggleView = (v) =>
  v === "home" ? location.reload() : window.renderGallery();

// Event listener global para qualquer clique
document.addEventListener("click", (e) => {
  console.log("Clique detectado em:", e.target.className);

  // Se clicar em qualquer coisa dentro de photo-card, tenta abrir zoom
  const photoCard = e.target.closest(".photo-card");
  if (
    photoCard &&
    !e.target.classList.contains("btn-save-img") &&
    !e.target.classList.contains("btn-ia-report") &&
    !e.target.classList.contains("btn-remove-photo")
  ) {
    // Não abre zoom se for um clique duplo ou se for em um link/botão
    if (e.target.tagName !== "BUTTON" && !window.isEnteringFolder) {
      console.log("Clique em photo-card detectado!");
      const img = photoCard.querySelector("img");
      if (img && !img.classList.contains("folder-thumb")) {
        const url = img.src;
        console.log("Abrindo zoom com URL:", url);
        window.openZoom(url);
      }
    }
  }

  if (e.target.classList.contains("btn-save-img")) {
    console.log("Clique em salvar");
    const photoCard = e.target.closest(".photo-card");
    const url = photoCard.querySelector("img").src;
    window.openSave(url);
  }

  if (e.target.classList.contains("btn-ia-report")) {
    console.log("Clique em denunciar");
    window.reportIA(e.target);
  }

  if (e.target.classList.contains("btn-remove-photo")) {
    console.log("Clique em remover");
    window.removePhoto(
      window.currentFolderIndex,
      parseInt(e.target.dataset.remove),
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded disparado");
  const nav = document.getElementById("nav-auth");
  if (localStorage.getItem("is_logged") === "true" && window.userProfile) {
    nav.innerHTML = `<div onclick="window.openProfile()" style="cursor:pointer; display:flex; align-items:center; gap:10px;"><b>${window.userProfile.name}</b><div class="nav-avatar-circle" style="width:35px; height:35px; border-radius:50%; background:#ffc0cb; overflow:hidden;"><img src="${window.userProfile.avatar}" style="width:100%; height:100%; object-fit:cover; display:${window.userProfile.avatar ? "block" : "none"}"></div></div>`;
  } else {
    nav.innerHTML = `<button onclick="window.openModal('modal-auth')" class="btn-main" style="width:auto; padding:8px 15px">Entrar</button>`;
  }
  console.log("Chamando loadPhotos");
  window.loadPhotos();
  console.log("loadPhotos chamado");
  document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.loadPhotos(e.target.value);
  });
});

document.addEventListener("change", (e) => {
  if (e.target.id === "file-upload") {
    const r = new FileReader();
    r.onload = (ev) => {
      window.userProfile.avatar = ev.target.result;
      window.showToast("Foto adicionada! Salve.");
    };
    r.readAsDataURL(e.target.files[0]);
  }
});
