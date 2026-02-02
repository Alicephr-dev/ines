const feed = document.getElementById("photo-feed");

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1533733501017-cf7d79982536?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
];

for (let i = 0; i < 15; i++) {
  const randomImg =
    placeholderPhotos[Math.floor(Math.random() * placeholderPhotos.length)];
  const card = `
        <div class="photo-card">
            <img src="${randomImg}" alt="Foto">
            <div class="overlay">
                <button class="save-btn">Salvar</button>
                <button class="report-ia-btn">🔴IA</button>
            </div>
        </div>
    `;
  feed.innerHTML += card;
}
