{
  const bgm = document.getElementById("bgm");
  const judulLagu = document.getElementById("judulLagu");
  const tombolMusik = document.getElementById("tombolMusik");
  const statusMusik = document.getElementById("statusMusik");

  const daftarLagu = [
    { judul: "Lullaby of the New Moon", file: "backsound for web.mp3" },
    { judul: "Wind Bless on you", file: "backsound web via genshin.mp3" },
    { judul: "Get Out Here", file: "backsound get out here.mpeg" },
    { judul: "Halvorsen Sunrise", file: "Halvorsen_Sunrise.mpeg" },
    { judul: "In Your Head", file: "InYourHead.mp3" },
    { judul: "giants", file: "giants.mpeg" },
    { judul: "Love For You", file: "love for you.mp3" }
  ];

  let laguSekarang = 0;

  function pilihLagu(index, putar = true) {
    laguSekarang = (index + daftarLagu.length) % daftarLagu.length;
    bgm.src = daftarLagu[laguSekarang].file;
    judulLagu.textContent = daftarLagu[laguSekarang].judul;

    if (putar) {
      bgm.play()
        .then(() => {
          tombolMusik.textContent = "⏸ Pause Music";
        })
        .catch(error => {
          console.log("Lagu gagal diputar:", error);
          tombolMusik.textContent = "▶ Play Music";
        });
    } else {
      bgm.pause();
      tombolMusik.textContent = "▶ Play Music";
    }
  }

  window.toggleMusic = function toggleMusic() {
    if (bgm.paused) {
      bgm.play()
        .then(() => {
          tombolMusik.textContent = "⏸ Pause Music";
        })
        .catch(error => {
          console.log("Lagu gagal diputar:", error);
        });
    } else {
      bgm.pause();
      tombolMusik.textContent = "▶ Play Music";
    }
  };

  window.laguBerikutnya = function laguBerikutnya() {
    pilihLagu(laguSekarang + 1);
  };

  window.laguSebelumnya = function laguSebelumnya() {
    pilihLagu(laguSekarang - 1);
  };

  window.setVolume = function setVolume(value) {
    bgm.volume = Number(value) / 100;
  };

  function ubahStatus(pesan) {
    statusMusik.textContent = pesan;
  }

  bgm.addEventListener("ended", window.laguBerikutnya);
  bgm.addEventListener("loadstart", () => ubahStatus("⏳ Memuat audio..."));
  bgm.addEventListener("canplay", () => {
    if (bgm.paused) {
      ubahStatus("✓ Audio siap diputar");
    }
  });
  bgm.addEventListener("playing", () => ubahStatus("♫ Musik sedang diputar"));
  bgm.addEventListener("pause", () => {
    if (!bgm.ended && !bgm.error) {
      ubahStatus("Ⅱ Musik dijeda");
    }
  });
  bgm.addEventListener("waiting", () => ubahStatus("⏳ Buffering audio..."));
  bgm.addEventListener("error", () => ubahStatus("✕ Audio gagal dimuat!"));

  setVolume(document.getElementById("volumeMusik").value);
  pilihLagu(0, false);
}
