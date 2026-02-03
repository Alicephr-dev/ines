function loadPhotos() {
  const feed = document.getElementById('photo-feed');
  if(!feed) return;

  feed.innerHTML = '';

  for (let i = 0; i < 20; i++) {
    const randomId = Math.floor(Math.randomm() * 1000);
    const imgUrl = 'https://placekitten.com/${300 + i}/${400 + i}';

    const card = '
      <div class="photo-card" data-id="${randomId}">
        <img src="${imgUrl" alt="Gatinho">
        <div class="overlay">
        <button class="save-btn" onclick="openModal('${imgUrl}')">Salvar</button>
        <button class="report-ia-btn" onclick="reportIA('${randomId}')" title="Denunciar IA">🔴IA</button>
        </div>
      </div>
      ';
  }
}

function reportIA(imageId) {
  const card = document.querySelector('[data-id="${imageId}"]');
  if (confirm("Inês, quer bloquear essa imagem de IA?")) {
    card.style.opacity = '0';
    setTimeout(() => card.remove(), 300);
    console.log("ID denunciado para o banco:", imageId);
  }
}

    function openModal(imgUrl) {
      document.getElementById('modal-save').style.display = 'flex';
      document.getElementById('img-preview').src = imgUrl;
    }

    function closeModal() {
      document.getElementById('modal-save').style.display = 'none';
    }

    window.onload = loadPhotos;
