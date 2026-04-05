const songList = document.getElementById("songList");
const filter = document.getElementById("filter");
const count = document.getElementById("songCount");
const songsToggle = document.getElementById("songsToggle");
const songListContainer = document.getElementById("songList");

let songs = [];
let open = true;

// Load songs from JSON
fetch("songs.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    console.log(songs)
    renderSongs();
    setTimeout(() => {
      document.querySelector(".song-card")?.click();
    }, 100);
  })
  .catch(err => console.error("Failed to load songs.json:", err));

function renderSongs() {
  const f = filter.value;
  songList.innerHTML = "";

  const filtered = songs.filter(s => f === "all" || s.composer.id === f);
  count.textContent = filtered.length;

  filtered.forEach(song => {
    const el = document.createElement("div");
    el.className = "song-card";

    el.innerHTML = `
      <div class="song-title">${song.title}</div>
      <div class="song-meta">${song.composer.name} ${song.singer ? `• ${song.singer}` : ""}</div>
    `;

    el.onclick = () => selectSong(song, el);
    songList.appendChild(el);
  });
}

function selectSong(song, el) {
  document.querySelectorAll(".song-card").forEach(c => c.classList.remove("active"));
  el.classList.add("active");

  // Update hero text
  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("songMeta").textContent =
    `${song.composer.name} • ${song.year}`;

  // Update hero background image
  const hero = document.querySelector(".hero");
  hero.style.backgroundImage = `url('${song.image}')`;

  const eraPill = document.querySelector(".golden-era");
  (song.year >= 1935 && song.year <= 1955) && (eraPill.style.display = "block");

  // Replace Spotify iframe to ensure proper loading
  const playerContainer = document.querySelector(".player");
  playerContainer.innerHTML = `
    <iframe
      id="spotifyPlayer"
      src="${song.spotifyEmbed}"
      width="100%"
      height="80"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  `;

  // Update lyrics
  document.getElementById("lyricsEs").innerHTML =
    song.lyrics.es.map(l => `<p>${l}</p>`).join("");

  document.getElementById("lyricsEn").innerHTML =
    song.lyrics.en.map(l => `<p>${l}</p>`).join("");
}

// Filter change
filter.addEventListener("change", renderSongs);

// Mobile toggle
songsToggle.addEventListener("click", () => {
  if (window.innerWidth > 900) return;
  open = !open;
  songListContainer.style.display = open ? "flex" : "none";
});