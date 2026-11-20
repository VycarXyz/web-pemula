
;
{

        const bgm = document.getElementById("bgm");
        const judulLagu = document.getElementById("judulLagu");
        const tombolMusik = document.getElementById("tombolMusik");

        // Daftar lagu
        const daftarLagu = [
            {
                judul: "Lullaby of the New Moon",
                file: "backsound for web.mp3"
            },
            {
                judul: "Wind Bless on you",
                file: "backsound web via genshin.mp3"
            },
            {
                judul: "Get Out Here",
                file: "backsound get out here.mpeg"
            },
            {
                judul: "Halvorsen Sunrise",
                file: "Halvorsen_Sunrise.mpeg"

            },
            {
                judul: "In Your Head",
                file: "InYourHead.mp3"
            },
            {
                judul: "giants",
                file: "giants.mpeg"
            },
            {
                judul: "Love For You",
                file: "love for you.mp3"
            },
        ];

        let laguSekarang = 0;

        // Memilih dan mengganti lagu
        function pilihLagu(index, putar = true) {
            laguSekarang =
                (index + daftarLagu.length) % daftarLagu.length;

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

        // Play dan Pause
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
        }

        // Lagu berikutnya
        window.laguBerikutnya = function laguBerikutnya() {
            pilihLagu(laguSekarang + 1);
        }

        // Lagu sebelumnya
        window.laguSebelumnya = function laguSebelumnya() {
            pilihLagu(laguSekarang - 1);
        }

        // Volume 0 sampai 100%
        window.setVolume = function setVolume(value) {
            bgm.volume = Number(value) / 100;
        }

        // Otomatis lanjut ketika lagu selesai
        bgm.addEventListener("ended", laguBerikutnya);

        // Pengaturan awal
        setVolume(document.getElementById("volumeMusik").value);
        pilihLagu(0, false);
        const statusMusik = document.getElementById("statusMusik");

// Mengubah tulisan status
function ubahStatus(pesan) {
    statusMusik.textContent = pesan;
}

// Audio mulai dimuat
bgm.addEventListener("loadstart", function () {
    ubahStatus("⏳ Memuat audio...");
});

// Audio siap diputar
bgm.addEventListener("canplay", function () {
    if (bgm.paused) {
        ubahStatus("✓ Audio siap diputar");
    }
});

// Musik sedang diputar
bgm.addEventListener("playing", function () {
    ubahStatus("♫ Musik sedang diputar");
});

// Musik dijeda
bgm.addEventListener("pause", function () {
    if (!bgm.ended && !bgm.error) {
        ubahStatus("Ⅱ Musik dijeda");
    }
});

// Audio sedang buffering
bgm.addEventListener("waiting", function () {
    ubahStatus("⏳ Buffering audio...");
});

// Audio gagal dimuat
bgm.addEventListener("error", function () {
    ubahStatus("✕ Audio gagal dimuat!");
});
    
}


;
{

  window.si = window.si || function () {
    (window.si.q = window.si.q || []).push(arguments);
  };

}


;
{

const feedVideos = [...document.querySelectorAll("video")]
    .filter(video => !video.closest("#gate"));
const videoAudioStorageKey = "site-video-audio";
let savedVideoAudio = null;
try {
    savedVideoAudio = JSON.parse(localStorage.getItem(videoAudioStorageKey) || "null");
} catch {}
const storedVolume = Number(savedVideoAudio?.volume);
let sharedVideoVolume = Number.isFinite(storedVolume)
    ? Math.min(1, Math.max(0, storedVolume))
    : 0.10;
let sharedVideoMuted = typeof savedVideoAudio?.muted === "boolean"
    ? savedVideoAudio.muted
    : true;
let syncingVideoSettings = false;

function syncVideoSettings(sourceVideo) {
    if (syncingVideoSettings) return;
    sharedVideoVolume = sourceVideo.volume;
    sharedVideoMuted = sourceVideo.muted;
    try {
        localStorage.setItem(videoAudioStorageKey, JSON.stringify({
            volume: sharedVideoVolume,
            muted: sharedVideoMuted
        }));
    } catch {}
    syncingVideoSettings = true;
    feedVideos.forEach(video => {
        if (video === sourceVideo) return;
        if (video.volume !== sharedVideoVolume) video.volume = sharedVideoVolume;
        if (video.muted !== sharedVideoMuted) video.muted = sharedVideoMuted;
    });
    syncingVideoSettings = false;
}

feedVideos.forEach(video => {
    video.volume = sharedVideoVolume;
    video.muted = sharedVideoMuted;
    video.addEventListener("volumechange", () => syncVideoSettings(video));
});

}


;
{

const gate = document.getElementById("gate");
const site = document.getElementById("site");
const teks = document.getElementById("teks");
window.userSignedIn = false;


/* LOADING */
const audioAutoplayKey = "site-audio-autoplay-approved";
window.siteIsOpen = false;
document.addEventListener("DOMContentLoaded", () => {
  if (!gate || !site) return;
  let audioAutoplayApproved = false;
  try { audioAutoplayApproved = localStorage.getItem(audioAutoplayKey) === "true"; } catch {}
  if (!audioAutoplayApproved) {
    gate.style.display = "block";
    return;
  }
  gate.style.display = "none";
  site.style.display = "block";
  if (!window.siteIsOpen) {
    window.siteIsOpen = true;
    window.playInitialVideo?.();
  }
});


/* ENTER */
window.openSite = function openSite(userInitiated = false) {
  if (!gate || !site) return;
  if (userInitiated) {
    try { localStorage.setItem(audioAutoplayKey, "true"); } catch {}
  }
  if (window.siteIsOpen) return;
  window.siteIsOpen = true;
  if (teks) teks.textContent = "Welcome to My Website";
  gate.style.opacity = "0";
  gate.style.transition = "2s ease";
  window.playInitialVideo?.();

  setTimeout(() => {
    gate.style.display = "none";
    site.style.display = "block";
  }, 900);
}

}


;
{

const allVideos = document.querySelectorAll("video");

allVideos.forEach(activeVideo => {
    activeVideo.addEventListener("play", () => {
        allVideos.forEach(videoItem => {
            if (videoItem !== activeVideo) videoItem.pause();
        });
    });
});

}


;
{

(() => {
  let autoScrollEnabled = false;
  try { autoScrollEnabled = localStorage.getItem("site-auto-scroll") === "true"; } catch {}
  const collections = [...document.querySelectorAll("details")]
    .map((details) => ({
      details,
      videos: [...details.querySelectorAll("video")],
      embeds: [...details.querySelectorAll("iframe")]
    }))
    .filter((collection) => collection.videos.length || collection.embeds.length);
  if (!collections.length) return;

  const feed = document.createElement("section");
  feed.className = "shorts-feed";
  feed.id = "video-feed";
  feed.setAttribute("aria-label", "Feed video");
  feed.innerHTML = `
    <form class="video-search-bar" id="videoSearchForm" role="search">
      <label class="video-search-label" for="videoCategorySearch">Cari kategori berdasarkan ID</label>
      <input id="videoCategorySearch" type="search" placeholder="Find Your Anime" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="searchSuggestions" aria-expanded="false">
      <button type="submit" aria-label="Cari video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
      </button>
      <div class="search-suggestions" id="searchSuggestions" role="listbox" aria-label="Rekomendasi kategori" hidden></div>
    </form>
    <header class="shorts-heading">
      <p class="shorts-eyebrow">VIDEO FEED</p>
      <h2>Jelajahi video</h2>
      <p>Scroll ke bawah untuk lanjut ke video berikutnya.</p>
    </header>
    <section class="search-results-page" id="searchResultsPage" aria-label="Hasil pencarian" hidden>
      <header class="search-results-heading">
        <button class="search-results-back" id="searchResultsBack" type="button" aria-label="Kembali ke video">←</button>
        <div>
          <p>HASIL PENCARIAN</p>
          <h2 id="searchResultsTitle"></h2>
        </div>
      </header>
      <p class="search-results-status" id="searchResultsStatus" role="status" aria-live="polite"></p>
      <div class="search-results-grid" id="searchResultsGrid"></div>
    </section>
    <section class="human-check-overlay" id="humanCheckOverlay" role="dialog" aria-modal="true" aria-labelledby="humanCheckTitle" hidden>
      <form class="human-check-dialog" id="humanCheckForm">
        <h2 id="humanCheckTitle">Verifikasi keamanan</h2>
        <p>Jawab soal sederhana untuk melanjutkan pencarian.</p>
        <label id="humanCheckQuestion" for="humanCheckAnswer"></label>
        <input id="humanCheckAnswer" type="number" inputmode="numeric" autocomplete="off" required>
        <p class="human-check-status" id="humanCheckStatus" role="status" aria-live="polite"></p>
        <div class="human-check-actions">
          <button type="button" id="humanCheckCancel">Batal</button>
          <button type="submit">Verifikasi</button>
        </div>
      </form>
    </section>
    <nav class="video-sidebar" id="videoSidebar" aria-label="Navigasi video">
      <button class="video-side-link is-active" type="button" data-feed-home><span class="video-side-icon">⌂</span><span>For You</span></button>
      <a class="video-side-link" href="https://vynime.pages.dev/"><span class="video-side-icon" aria-hidden="true">✦</span><span>Anime</span></a>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20v-1.2a6.5 6.5 0 0 1 13 0V20"/></svg></span><span>Following</span></div>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.8 20v-1a6.2 6.2 0 0 1 12.4 0v1M15.3 15.3a4.8 4.8 0 0 1 5.9 4.7"/></svg></span><span>Friends</span></div>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon video-side-live"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg></span><span>LIVE</span></div>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18v13H8l-5 3v-16Z"/><path d="M7 10h10M7 14h7"/></svg></span><span>Messages</span></div>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v13H9l-5 4V4Z"/><path d="M8 10h8M8 13h5"/></svg></span><span>Activity</span></div>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg></span><span>Upload</span></div>
      <button class="video-side-link" type="button" data-profile-open><span id="videoSidebarAvatar" class="video-side-icon video-side-profile" aria-hidden="true"><img alt=""></span><span>Profile</span></button>
      <a class="video-side-link" href="index3.html"><span class="video-side-icon">⌕</span><span>Saran & Sosmed</span></a>
      <div class="video-side-link video-side-link-static"><span class="video-side-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg></span><span>More</span></div>
    </nav>
    <nav class="video-actions" aria-label="Aksi video">
      <button class="video-action" id="videoLikeButton" type="button" aria-pressed="false" aria-label="Suka video" title="Login untuk menyukai video" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        <span>Suka</span>
      </button>
      <button class="video-action" id="videoCommentLink" type="button" aria-label="Komentar video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></svg>
        <span>Komentar</span>
      </button>
      <button class="video-action" id="videoSaveButton" type="button" aria-pressed="false" aria-label="Simpan video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17L12 17l-6 3.5v-17Z"/></svg>
        <span>Simpan</span>
      </button>
    </nav>
    <div class="shorts-menu-wrap">
      <button class="shorts-menu-trigger" id="shortsMenuTrigger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="shortsMenu">⋮</button>
      <div class="shorts-menu" id="shortsMenu" hidden>
        <button class="shorts-menu-option" id="autoScrollToggle" type="button" role="switch" aria-checked="false">
          <span>Autoscroll</span><span class="shorts-menu-switch" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <section class="profile-overlay" id="profileOverlay" aria-label="Profil" aria-modal="true" role="dialog" hidden>
      <div class="profile-dialog">
        <button class="profile-close" id="profileClose" type="button" aria-label="Tutup profil">×</button>
        <div class="profile-identity">
          <div class="profile-avatar-fallback" id="profileAvatarFallback" aria-hidden="true">&#128100;</div>
          <img class="profile-avatar" id="profileAvatar" alt="Foto profil" hidden>
          <h2 id="profileName">Pengunjung</h2>
        </div>
        <section class="profile-liked" aria-labelledby="profileLikedTitle">
          <h3 id="profileLikedTitle">Video yang disukai <span id="profileLikedCount">(0)</span></h3>
          <p id="profileLikedEmpty">Belum ada video yang disukai.</p>
          <div class="profile-liked-grid" id="profileLikedGrid"></div>
        </section>
        <button class="profile-logout" id="profileLogout" type="button">Log out</button>
        <p class="profile-status" id="profileStatus" role="status"></p>
      </div>
    </section>
    <div class="shorts-list" id="shortsList" aria-label="Daftar video"></div>`;

  const clips = [];
  const embeddedVideos = [];
  const embeddedItems = [];
  collections.forEach(({ details, videos, embeds }) => {
    const heading = details.previousElementSibling;
    const collectionName = heading && /^H[1-3]$/.test(heading.tagName)
      ? heading.textContent.replace(/\s+/g, " ").trim()
      : "Koleksi video";
    if (heading && /^H[1-3]$/.test(heading.tagName)) heading.hidden = true;

    embeds.forEach((embed) => {
      const src = embed.getAttribute("src");
      if (!src) return;
      const nextText = embed.nextElementSibling;
      const credit = nextText && /^(P|H[1-6])$/.test(nextText.tagName)
        ? nextText.textContent.replace(/\s+/g, " ").trim()
        : "";
      if (heading?.id !== "video hentai") {
        const item = document.createElement("article");
        item.className = "shorts-item shorts-embed-item";
        item.setAttribute("aria-label", `Video ${collectionName}`);
        item.innerHTML = `<div class="embed-frame"></div><div class="shorts-caption"><p class="shorts-collection"></p><p class="shorts-credit"></p></div>`;
        const frame = document.createElement("iframe");
        frame.src = src;
        frame.title = `Video ${collectionName}`;
        frame.loading = "lazy";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;
        item.querySelector(".embed-frame").append(frame);
        item.querySelector(".shorts-collection").textContent = collectionName;
        item.querySelector(".shorts-credit").textContent = credit;
        item.querySelector(".shorts-credit").hidden = !credit;
        embeddedItems.push(item);
      }
      embeddedVideos.push({ collectionId: heading?.id || "", collectionName, credit, src });
    });

    videos.forEach((video) => {
      const nextText = video.nextElementSibling;
      const credit = nextText && /^(P|H[1-6])$/.test(nextText.tagName)
        ? nextText.textContent.replace(/\s+/g, " ").trim()
        : "";
      const posterSrc = video.getAttribute("poster");
      if (posterSrc) {
        video.dataset.posterSrc = posterSrc;
        video.removeAttribute("poster");
      }
      const sourceElements = [...video.querySelectorAll("source")];
      sourceElements.forEach((source) => {
        source.dataset.src = source.getAttribute("src") || "";
        source.removeAttribute("src");
      });
      const directVideoSrc = video.getAttribute("src");
      if (directVideoSrc) {
        video.dataset.videoSrc = directVideoSrc;
        video.removeAttribute("src");
      }
      video.controls = false;
      video.preload = "none";
      video.load();
      video.playsInline = true;
      video.loop = true;

      const item = document.createElement("article");
      item.className = "shorts-item";
      item.classList.add("is-loading");
      item.setAttribute("aria-busy", "true");
      video.addEventListener("ended", () => {
        if (!autoScrollEnabled) return;
        const currentIndex = clips.findIndex((clip) => clip.video === video);
        const nextClip = clips[(currentIndex + 1) % clips.length];
        if (nextClip) list.scrollTo({ top: nextClip.item.offsetTop, behavior: "smooth" });
      });
      video.addEventListener("click", () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
      item.innerHTML = `<div class="shorts-video"><div class="shorts-video-frame"></div></div><div class="shorts-caption"><p class="shorts-collection"></p><p class="shorts-credit"></p></div><div class="shorts-volume-control"><button class="shorts-volume-toggle" type="button" aria-label="Nyalakan suara" title="Nyalakan suara">🔇</button><input class="shorts-volume-slider" type="range" min="0" max="1" step="0.01" aria-label="Volume video"></div><div class="shorts-controls"><input class="shorts-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Posisi video"><span class="shorts-time">0:00 / 0:00</span></div>`;
      const videoFrame = item.querySelector(".shorts-video-frame");
      const videoSkeleton = document.createElement("div");
      videoSkeleton.className = "shorts-video-skeleton";
      videoSkeleton.setAttribute("aria-hidden", "true");
      videoSkeleton.innerHTML = '<span class="feed-skeleton-play"></span><span class="feed-skeleton-caption"><i></i><i></i></span><span class="feed-skeleton-actions"><i></i><i></i><i></i></span>';
      videoFrame.append(videoSkeleton);
      const finishVideoLoading = () => {
        item.classList.remove("is-loading");
        item.removeAttribute("aria-busy");
      };
      video.addEventListener("loadeddata", finishVideoLoading, { once: true });
      video.addEventListener("error", () => {
        videoSkeleton.textContent = "Video gagal dimuat";
        videoSkeleton.classList.add("is-error");
        finishVideoLoading();
      }, { once: true });
      const setFrameRatio = (width, height) => {
        if (width > 0 && height > 0) {
          videoFrame.style.aspectRatio = `${width} / ${height}`;
          item.classList.toggle("is-portrait", height > width);
        }
      };
      video.addEventListener("loadedmetadata", () => setFrameRatio(video.videoWidth, video.videoHeight));
      videoFrame.append(video);
      item.querySelector(".shorts-collection").textContent = collectionName;
      item.querySelector(".shorts-credit").textContent = credit;
      item.querySelector(".shorts-credit").hidden = !credit;
      const seekSlider = item.querySelector(".shorts-seek");
      const timeLabel = item.querySelector(".shorts-time");
      const volumeToggle = item.querySelector(".shorts-volume-toggle");
      const volumeSlider = item.querySelector(".shorts-volume-slider");
      const formatTime = (seconds) => {
        if (!Number.isFinite(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${remainder}`;
      };
      const updateControls = () => {
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0) {
          seekSlider.value = String((video.currentTime / duration) * 100);
        }
        timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
      };
      const updateVolumeControls = () => {
        volumeSlider.value = String(video.volume);
        volumeToggle.textContent = video.muted ? "🔇" : "🔊";
        volumeToggle.setAttribute("aria-label", video.muted ? "Nyalakan suara" : "Matikan suara");
        volumeToggle.title = video.muted ? "Nyalakan suara" : "Matikan suara";
      };
      volumeToggle.addEventListener("click", () => { video.muted = !video.muted; });
      volumeSlider.addEventListener("input", () => {
        video.volume = Number(volumeSlider.value);
        video.muted = video.volume === 0;
      });
      video.addEventListener("volumechange", updateVolumeControls);
      updateVolumeControls();
      seekSlider.addEventListener("input", () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = (Number(seekSlider.value) / 100) * video.duration;
        }
      });
      ["timeupdate", "loadedmetadata", "durationchange"].forEach((eventName) => {
        video.addEventListener(eventName, updateControls);
      });
      updateControls();
      const clipKey = sourceElements[0]?.dataset.src || video.dataset.videoSrc || video.dataset.posterSrc || `${collectionName}-${clips.length}`;
      clips.push({ item, video, sources: sourceElements, collectionName, collectionId: heading?.id || "", key: clipKey });
    });
    details.remove();
  });

  const videoCatalog = Object.fromEntries(clips.map(({ item, video, collectionName, key }) => [key, {
    src: video.dataset.videoSrc || video.querySelector("source")?.dataset.src || "",
    poster: video.dataset.posterSrc || "",
    collectionName,
    credit: item.querySelector(".shorts-credit")?.textContent.trim() || ""
  }]));
  try { localStorage.setItem("site-video-catalog", JSON.stringify(videoCatalog)); } catch {}
  document.body.insertAdjacentElement("afterbegin", feed);

  for (let index = clips.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clips[index], clips[randomIndex]] = [clips[randomIndex], clips[index]];
  }

  const list = document.getElementById("shortsList");
  const menuTrigger = document.getElementById("shortsMenuTrigger");
  const menu = document.getElementById("shortsMenu");
  const autoScrollToggle = document.getElementById("autoScrollToggle");
  const setAutoScroll = (enabled) => {
    autoScrollEnabled = enabled;
    autoScrollToggle.setAttribute("aria-checked", String(enabled));
    clips.forEach(({ video }) => { video.loop = !enabled; });
    try { localStorage.setItem("site-auto-scroll", String(enabled)); } catch {}
  };
  setAutoScroll(autoScrollEnabled);
  menuTrigger.addEventListener("click", () => {
    const isOpen = menuTrigger.getAttribute("aria-expanded") === "true";
    menu.hidden = isOpen;
    menuTrigger.setAttribute("aria-expanded", String(!isOpen));
    menuTrigger.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
  });
  autoScrollToggle.addEventListener("click", () => setAutoScroll(!autoScrollEnabled));
  document.addEventListener("click", (event) => {
    if (menu.hidden || menu.contains(event.target) || menuTrigger.contains(event.target)) return;
    menu.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
    menuTrigger.setAttribute("aria-label", "Buka menu");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menu.hidden) return;
    menu.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
    menuTrigger.setAttribute("aria-label", "Buka menu");
    menuTrigger.focus();
  });
  const requestedUrl = new URL(window.location.href);
  const requestedVideoKey = requestedUrl.searchParams.get("video");
  const requestedClipIndex = requestedVideoKey ? clips.findIndex(({ key }) => key === requestedVideoKey) : -1;
  if (requestedVideoKey) {
    requestedUrl.searchParams.delete("video");
    window.history.replaceState(window.history.state, "", `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`);
  }
  clips.forEach(({ item }) => list.append(item));
  embeddedItems.forEach((item) => list.append(item));

  const profileOverlay = document.getElementById("profileOverlay");
  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");
  const profileAvatarFallback = document.getElementById("profileAvatarFallback");
  const profileLikedGrid = document.getElementById("profileLikedGrid");
  const profileLikedCount = document.getElementById("profileLikedCount");
  const profileLikedEmpty = document.getElementById("profileLikedEmpty");
  const profileStatus = document.getElementById("profileStatus");
  const renderProfile = () => {
    const user = window.siteCurrentUser;
    profileName.textContent = user?.displayName || "Pengunjung";
    if (user?.photoURL) {
      profileAvatar.src = user.photoURL;
      profileAvatar.hidden = false;
      profileAvatarFallback.hidden = true;
    } else {
      profileAvatar.removeAttribute("src");
      profileAvatar.hidden = true;
      profileAvatarFallback.hidden = false;
    }
    const likedStorageKey = userClipStorageKey("site-liked-videos");
    const likedKeys = likedStorageKey ? readClipSet(likedStorageKey) : [];
    let catalog = {};
    try { catalog = JSON.parse(localStorage.getItem("site-video-catalog") || "{}"); } catch {}
    profileLikedGrid.replaceChildren();
    profileLikedCount.textContent = `(${likedKeys.length})`;
    profileLikedEmpty.hidden = likedKeys.length > 0;
    likedKeys.forEach((key) => {
      const record = catalog[key] || {};
      const clip = clips.find((candidate) => candidate.key === key);
      const card = document.createElement("button");
      card.className = "profile-liked-card";
      card.type = "button";
      card.setAttribute("aria-label", `Putar ${record.collectionName || "video yang disukai"}`);
      const poster = document.createElement("img");
      poster.src = record.poster || "";
      poster.alt = "";
      poster.loading = "lazy";
      const title = document.createElement("span");
      title.textContent = record.collectionName || "Video yang disukai";
      card.append(poster, title);
      card.addEventListener("click", () => {
        if (!clip) return;
        profileResumeVideo = null;
        profileOverlay.hidden = true;
        list.scrollTo({ top: clip.item.offsetTop, behavior: "smooth" });
      });
      profileLikedGrid.append(card);
    });
  };
  let profileResumeVideo = null;
  const openProfile = () => {
    profileResumeVideo = clips[activeClipIndex]?.video || null;
    clips.forEach(({ video }) => video.pause());
    renderProfile();
    profileOverlay.hidden = false;
    document.getElementById("profileClose").focus();
  };
  const closeProfile = () => {
    profileOverlay.hidden = true;
    const videoToResume = profileResumeVideo;
    profileResumeVideo = null;
    if (videoToResume) videoToResume.play().catch(() => {});
  };
  feed.querySelector("[data-profile-open]").addEventListener("click", () => {
    setMobileSidebarOpen(false);
    openProfile();
  });
  document.getElementById("profileClose").addEventListener("click", closeProfile);
  profileOverlay.addEventListener("click", (event) => {
    if (event.target === profileOverlay) closeProfile();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !profileOverlay.hidden) closeProfile();
  });
  document.getElementById("profileLogout").addEventListener("click", async () => {
    const logoutButton = document.getElementById("profileLogout");
    logoutButton.disabled = true;
    profileStatus.textContent = "Sedang keluar...";
    try {
      await window.logoutGoogle?.();
      profileStatus.textContent = "";
      closeProfile();
    } catch (error) {
      console.error("Logout gagal:", error);
      profileStatus.textContent = "Logout gagal. Coba lagi.";
    } finally {
      logoutButton.disabled = false;
    }
  });
  window.addEventListener("site-auth-state-change", renderProfile);


  if (requestedClipIndex >= 0) list.scrollTop = requestedClipIndex * list.clientHeight;

  const readClipSet = (storageKey) => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  };
  const userClipStorageKey = (storageKey) => {
    const uid = window.siteCurrentUser?.uid;
    return uid ? `${storageKey}:${uid}` : null;
  };
  let likedClipKeys = [];
  let isSignedIn = false;
  let savedClipKeys = readClipSet("site-saved-videos");
  const likeButton = document.getElementById("videoLikeButton");
  const saveButton = document.getElementById("videoSaveButton");
  let activeClipIndex = requestedClipIndex >= 0 ? requestedClipIndex : 0;
  let activeClipScope = clips;
  window.playInitialVideo = () => {
    const firstVideo = clips[activeClipIndex]?.video;
    if (!firstVideo) return;
    firstVideo.muted = false;
    firstVideo.playsInline = true;
    firstVideo.play().catch(() => {});
  };
  const updateVideoActions = () => {
    const clip = clips[activeClipIndex];
    if (!clip) return;
    const isLiked = likedClipKeys.includes(clip.key);
    const isSaved = savedClipKeys.includes(clip.key);
    likeButton.setAttribute("aria-pressed", String(isLiked));
    likeButton.classList.toggle("is-active", isLiked);
    saveButton.setAttribute("aria-pressed", String(isSaved));
    saveButton.classList.toggle("is-active", isSaved);
  };
  const syncLikeAccess = (signedIn) => {
    isSignedIn = signedIn === true;
    likeButton.disabled = !isSignedIn;
    likeButton.title = isSignedIn ? "Suka video" : "Login untuk menyukai video";
    const likedStorageKey = userClipStorageKey("site-liked-videos");
    likedClipKeys = isSignedIn && likedStorageKey ? readClipSet(likedStorageKey) : [];
    updateVideoActions();
  };
  window.addEventListener("site-auth-state-change", (event) => {
    syncLikeAccess(event.detail?.signedIn);
  });
  if (typeof window.userSignedIn === "boolean") syncLikeAccess(window.userSignedIn);
  const persistClipSet = (storageKey, values) => {
    try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch {}
  };
  likeButton.addEventListener("click", () => {
    if (!isSignedIn) return;
    const key = clips[activeClipIndex]?.key;
    if (!key) return;
    likedClipKeys = likedClipKeys.includes(key)
      ? likedClipKeys.filter((savedKey) => savedKey !== key)
      : [...likedClipKeys, key];
    const likedStorageKey = userClipStorageKey("site-liked-videos");
    if (!likedStorageKey) return;
    persistClipSet(likedStorageKey, likedClipKeys);
    updateVideoActions();
  });
  saveButton.addEventListener("click", () => {
    const key = clips[activeClipIndex]?.key;
    if (!key) return;
    savedClipKeys = savedClipKeys.includes(key)
      ? savedClipKeys.filter((savedKey) => savedKey !== key)
      : [...savedClipKeys, key];
    persistClipSet("site-saved-videos", savedClipKeys);
    updateVideoActions();
  });
  updateVideoActions();

  const sidebar = feed.querySelector(".video-sidebar");
  const sidebarLinks = [...sidebar.querySelectorAll(".video-side-link")];
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const mobileNavMedia = window.matchMedia("(max-width: 767px)");
  const setMobileSidebarOpen = (open) => {
    const shouldOpen = mobileNavMedia.matches && open;
    sidebar.classList.toggle("is-open", shouldOpen);
    feed.classList.toggle("mobile-nav-open", shouldOpen);
    sidebar.setAttribute("aria-hidden", String(mobileNavMedia.matches && !shouldOpen));
    sidebar.inert = mobileNavMedia.matches && !shouldOpen;
    mobileNavToggle.setAttribute("aria-expanded", String(shouldOpen));
    mobileNavToggle.setAttribute("aria-label", shouldOpen ? "Tutup menu" : "Buka menu");
  };
  mobileNavToggle.disabled = !mobileNavMedia.matches;
  setMobileSidebarOpen(false);
  mobileNavToggle.addEventListener("click", () => {
    setMobileSidebarOpen(!sidebar.classList.contains("is-open"));
  });
  mobileNavMedia.addEventListener("change", () => {
    mobileNavToggle.disabled = !mobileNavMedia.matches;
    setMobileSidebarOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!mobileNavMedia.matches || !sidebar.classList.contains("is-open")) return;
    if (!sidebar.contains(event.target) && !mobileNavToggle.contains(event.target)) setMobileSidebarOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileSidebarOpen(false);
  });
  const setActiveNav = (activeLink) => {
    sidebarLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
  };
  const setSearchSidebarMode = (enabled) => {
    const homeLink = sidebar.querySelector("[data-feed-home]");
    sidebar.classList.toggle("is-search-mode", enabled);
    homeLink.querySelector(".video-side-icon").textContent = enabled ? "←" : "⌂";
    homeLink.lastElementChild.textContent = enabled ? "Kembali ke halaman utama" : "For You";
  };
  const searchForm = feed.querySelector("#videoSearchForm");
  const categorySearch = feed.querySelector("#videoCategorySearch");
  const searchResultsPage = feed.querySelector("#searchResultsPage");
  const searchResultsTitle = feed.querySelector("#searchResultsTitle");
  const searchResultsStatus = feed.querySelector("#searchResultsStatus");
  const searchResultsGrid = feed.querySelector("#searchResultsGrid");
  const searchResultsBack = feed.querySelector("#searchResultsBack");
  const humanCheckOverlay = feed.querySelector("#humanCheckOverlay");
  const humanCheckForm = feed.querySelector("#humanCheckForm");
  const humanCheckQuestion = feed.querySelector("#humanCheckQuestion");
  const humanCheckAnswer = feed.querySelector("#humanCheckAnswer");
  const humanCheckStatus = feed.querySelector("#humanCheckStatus");
  const humanCheckCancel = feed.querySelector("#humanCheckCancel");
  let humanCheckExpectedAnswer = 0;
  let humanCheckApproved = false;
  const createHumanCheck = () => {
    const firstNumber = Math.floor(Math.random() * 9) + 2;
    const secondNumber = Math.floor(Math.random() * 9) + 2;
    humanCheckExpectedAnswer = firstNumber + secondNumber;
    humanCheckQuestion.textContent = `${firstNumber} + ${secondNumber} = ?`;
    humanCheckAnswer.value = "";
    humanCheckStatus.textContent = "";
  };
  const closeHumanCheck = () => {
    humanCheckOverlay.hidden = true;
    humanCheckForm.reset();
    humanCheckStatus.textContent = "";
    categorySearch.focus();
  };
  const openHumanCheck = () => {
    createHumanCheck();
    humanCheckOverlay.hidden = false;
    humanCheckAnswer.focus();
  };
  humanCheckCancel.addEventListener("click", closeHumanCheck);
  humanCheckForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (Number(humanCheckAnswer.value) !== humanCheckExpectedAnswer) {
      createHumanCheck();
      humanCheckStatus.textContent = "Jawaban belum benar. Coba soal baru.";
      return;
    }
    humanCheckOverlay.hidden = true;
    humanCheckApproved = true;
    searchForm.requestSubmit();
  });
  const searchSuggestions = feed.querySelector("#searchSuggestions");
  const normalizeSearchText = (text) => text.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  const editDistance = (first, second) => {
    let previousRow = Array.from({ length: second.length + 1 }, (_, index) => index);
    for (let row = 1; row <= first.length; row++) {
      const currentRow = [row];
      for (let column = 1; column <= second.length; column++) {
        currentRow[column] = Math.min(
          currentRow[column - 1] + 1,
          previousRow[column] + 1,
          previousRow[column - 1] + (first[row - 1] === second[column - 1] ? 0 : 1)
        );
      }
      previousRow = currentRow;
    }
    return previousRow[second.length];
  };
  const matchesSearchWord = (queryWord, idWord) => {
    if (idWord.includes(queryWord)) return true;

    const allowedDistance = Math.max(queryWord.length, idWord.length) >= 6 ? 2 : 1;
    const shortestPrefixLength = Math.max(1, queryWord.length - allowedDistance);
    const longestPrefixLength = Math.min(idWord.length, queryWord.length + allowedDistance);
    for (let length = shortestPrefixLength; length <= longestPrefixLength; length++) {
      if (editDistance(queryWord, idWord.slice(0, length)) <= allowedDistance) return true;
    }
    return false;
  };
  const matchesCategoryId = (collectionId, query) => {
    const normalizedId = normalizeSearchText(collectionId);
    if (normalizedId.includes(query)) return true;

    const idWords = normalizedId.split(" ");
    return query.split(" ").every((queryWord) =>
      idWords.some((idWord) => matchesSearchWord(queryWord, idWord))
    );
  };
  const searchableCategories = [...new Map(
    [...clips, ...embeddedVideos]
      .filter(({ collectionId }) => collectionId)
      .map(({ collectionId, collectionName }) => [
        normalizeSearchText(collectionId),
        { id: collectionId, name: collectionName }
      ])
  ).values()];
  let activeSuggestionIndex = -1;
  const hideSearchSuggestions = () => {
    searchSuggestions.hidden = true;
    activeSuggestionIndex = -1;
    categorySearch.setAttribute("aria-expanded", "false");
    categorySearch.removeAttribute("aria-activedescendant");
  };
  const renderSearchSuggestions = () => {
    const query = normalizeSearchText(categorySearch.value);
    const suggestions = searchableCategories.filter(({ id }) =>
      !query || matchesCategoryId(id, query)
    );
    searchSuggestions.replaceChildren();
    activeSuggestionIndex = -1;

    suggestions.forEach((category, index) => {
      const option = document.createElement("button");
      option.className = "search-suggestion";
      option.type = "button";
      option.id = `searchSuggestion${index}`;
      option.dataset.categoryId = category.id;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");

      const name = document.createElement("span");
      name.textContent = category.name;
      const id = document.createElement("span");
      id.textContent = category.id;
      option.append(name, id);
      searchSuggestions.append(option);
    });

    searchSuggestions.hidden = suggestions.length === 0;
    categorySearch.setAttribute("aria-expanded", String(suggestions.length > 0));
  };
  const selectSearchSuggestion = (index) => {
    const options = [...searchSuggestions.querySelectorAll('[role="option"]')];
    const option = options[index];
    if (!option) return;
    categorySearch.value = option.dataset.categoryId;
    hideSearchSuggestions();
    searchForm.requestSubmit();
  };
  const setActiveSuggestion = (index) => {
    const options = [...searchSuggestions.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    activeSuggestionIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const isActive = optionIndex === activeSuggestionIndex;
      option.setAttribute("aria-selected", String(isActive));
      if (isActive) {
        categorySearch.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
  };
  categorySearch.addEventListener("focus", renderSearchSuggestions);
  categorySearch.addEventListener("input", renderSearchSuggestions);
  categorySearch.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (searchSuggestions.hidden) renderSearchSuggestions();
      const options = searchSuggestions.querySelectorAll('[role="option"]');
      if (!options.length) return;
      event.preventDefault();
      const nextIndex = event.key === "ArrowDown"
        ? activeSuggestionIndex + 1
        : (activeSuggestionIndex < 0 ? options.length - 1 : activeSuggestionIndex - 1);
      setActiveSuggestion(nextIndex);
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectSearchSuggestion(activeSuggestionIndex);
    } else if (event.key === "Escape" && !searchSuggestions.hidden) {
      event.preventDefault();
      hideSearchSuggestions();
    }
  });
  searchSuggestions.addEventListener("mousedown", (event) => event.preventDefault());
  searchSuggestions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-category-id]");
    if (!option) return;
    categorySearch.value = option.dataset.categoryId;
    hideSearchSuggestions();
    searchForm.requestSubmit();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!searchForm.contains(event.target)) hideSearchSuggestions();
  });
  let videoToResumeAfterSearch = null;
  const closeSearchResults = (resumeVideo) => {
    if (searchResultsPage.hidden) return;
    searchResultsPage.hidden = true;
    searchResultsGrid.replaceChildren();
    const videoToResume = videoToResumeAfterSearch;
    videoToResumeAfterSearch = null;
    if (resumeVideo && videoToResume) {
      videoToResume.play().catch((error) => console.warn("Video gagal dilanjutkan:", error));
    }
  };
  const showSearchResults = (event) => {
    event.preventDefault();
    const query = normalizeSearchText(categorySearch.value);
    if (!query) return;
    hideSearchSuggestions();

    const matches = clips.filter(({ collectionId }) => collectionId && matchesCategoryId(collectionId, query));
    const matchingEmbeds = embeddedVideos.filter(({ collectionId }) =>
      collectionId && matchesCategoryId(collectionId, query)
    );
    const needsHumanCheck = [...matches, ...matchingEmbeds]
      .some(({ collectionId }) => collectionId === "video hentai");
    if (needsHumanCheck && !humanCheckApproved) {
      openHumanCheck();
      return;
    }
    humanCheckApproved = false;

    if (searchResultsPage.hidden) {
      videoToResumeAfterSearch = clips.find(({ video }) => !video.paused)?.video || null;
      clips.forEach(({ video }) => video.pause());
    }
    const resultCount = matches.length + matchingEmbeds.length;
    searchResultsTitle.textContent = `Hasil untuk "${categorySearch.value.trim()}"`;
    searchResultsStatus.textContent = resultCount
      ? `${resultCount} video ditemukan berdasarkan ID kategori.`
      : `Tidak ada video untuk ID "${categorySearch.value.trim()}".`;
    searchResultsGrid.replaceChildren();

    matches.forEach((clip) => {
      const card = document.createElement("button");
      card.className = "search-result-card";
      card.type = "button";
      const poster = clip.video.dataset.posterSrc;
      if (poster) {
        const image = document.createElement("img");
        image.alt = "";
        image.loading = "lazy";
        image.addEventListener("load", () => {
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            image.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
          }
        }, { once: true });
        image.src = poster;
        card.append(image);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "search-result-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        placeholder.textContent = "▶";
        card.append(placeholder);
      }

      const details = document.createElement("span");
      details.className = "search-result-details";
      const title = document.createElement("strong");
      title.textContent = clip.collectionName;
      const credit = document.createElement("span");
      credit.textContent = clip.item.querySelector(".shorts-credit")?.textContent.trim() || "Video";
      details.append(title, credit);
      card.append(details);
      card.addEventListener("click", () => {
        const selectedVideoWasPlaying = videoToResumeAfterSearch === clip.video;
        const matchingClipSet = new Set(matches);
        closeSearchResults(false);
        activeClipScope = matches;
        setSearchSidebarMode(true);
        clips.forEach((searchClip) => {
          searchClip.item.hidden = !matchingClipSet.has(searchClip);
          if (!matchingClipSet.has(searchClip)) releaseClipMedia(searchClip);
        });
        setActiveNav(null);
        list.scrollTo({ top: clip.item.offsetTop, behavior: "auto" });
        if (selectedVideoWasPlaying) {
          clip.video.play().catch((error) => console.warn("Video gagal dilanjutkan:", error));
        }
      });
      searchResultsGrid.append(card);
    });

    matchingEmbeds.forEach((embed) => {
      const card = document.createElement("article");
      card.className = "search-result-embed-card";
      const frame = document.createElement("iframe");
      frame.src = embed.src;
      frame.title = `Video ${embed.collectionName}`;
      frame.loading = "lazy";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      card.append(frame);

      const details = document.createElement("div");
      details.className = "search-result-details";
      const title = document.createElement("strong");
      title.textContent = embed.collectionName;
      const credit = document.createElement("span");
      credit.textContent = embed.credit || "Video";
      details.append(title, credit);
      card.append(details);
      searchResultsGrid.append(card);
    });

    searchResultsPage.hidden = false;
  };
  searchForm.addEventListener("submit", showSearchResults);
  searchResultsBack.addEventListener("click", () => {
    closeSearchResults(true);
    categorySearch.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!humanCheckOverlay.hidden) closeHumanCheck();
    else closeSearchResults(true);
  });
  sidebar.querySelector("[data-feed-home]").addEventListener("click", (event) => {
    categorySearch.value = "";
    searchResultsPage.hidden = true;
    setSearchSidebarMode(false);
    setActiveNav(event.currentTarget);
    setMobileSidebarOpen(false);
    activeClipScope = clips;
    clips.forEach(({ item }) => { item.hidden = false; });
    updateClipPreloadWindow(activeClipIndex);
    list.scrollTo({ top: 0, behavior: "smooth" });
  });
  let preloadTimer = null;
  const attachClipMedia = (clip, preloadMode = "auto") => {
    const { video, sources = [] } = clip;
    let sourceChanged = false;
    video.preload = preloadMode;
    if (video.dataset.videoSrc && !video.hasAttribute("src")) {
      video.setAttribute("src", video.dataset.videoSrc);
      sourceChanged = true;
    }
    sources.forEach((source) => {
      if (source.dataset.src && !source.hasAttribute("src")) {
        source.setAttribute("src", source.dataset.src);
        sourceChanged = true;
      }
    });
    if (video.dataset.posterSrc && !video.poster) video.poster = video.dataset.posterSrc;
    if (sourceChanged) video.load();
  };
  const releaseClipMedia = (clip) => {
    const { video, sources = [] } = clip;
    const hasAttachedMedia = video.hasAttribute("src") || video.hasAttribute("poster") || sources.some((source) => source.hasAttribute("src"));
    if (!hasAttachedMedia) return;
    video.pause();
    video.removeAttribute("src");
    sources.forEach((source) => source.removeAttribute("src"));
    video.removeAttribute("poster");
    video.preload = "none";
    video.load();
  };
  const updateClipPreloadWindow = (currentIndex) => {
    if (preloadTimer) clearTimeout(preloadTimer);
    const currentClip = clips[currentIndex];
    const scope = activeClipScope;
    const scopeIndex = scope.indexOf(currentClip);
    if (scopeIndex < 0) return;
    const preloadWindow = new Set(scope.slice(Math.max(0, scopeIndex - 5), scopeIndex + 4));
    clips.forEach((clip, index) => {
      if (!preloadWindow.has(clip)) releaseClipMedia(clip);
    });
    attachClipMedia(currentClip, "auto");
    const upcoming = [1, 2, 3]
      .map((distance) => ({ clip: scope[scopeIndex + distance], distance }))
      .filter(({ clip }) => Boolean(clip));
    let nextIndex = 0;
    const preloadUpcoming = () => {
      if (activeClipIndex !== currentIndex || activeClipScope !== scope || nextIndex >= upcoming.length) return;
      const { clip, distance } = upcoming[nextIndex++];
      attachClipMedia(clip, distance === 1 ? "auto" : "metadata");
      if (nextIndex < upcoming.length) preloadTimer = setTimeout(preloadUpcoming, 700);
    };
    if (upcoming.length) preloadTimer = setTimeout(preloadUpcoming, 400);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const clip = clips.find((candidate) => candidate.item === entry.target);
      if (!clip) return;
      if (entry.isIntersecting) attachClipMedia(clip, "auto");
      if (entry.isIntersecting && entry.intersectionRatio >= .7) {
        const previousClip = clips[activeClipIndex];
        if (previousClip && previousClip !== clip) {
          previousClip.video.pause();
          try { previousClip.video.currentTime = 0; } catch {}
        }
        activeClipIndex = clips.indexOf(clip);
        updateClipPreloadWindow(activeClipIndex);
        updateVideoActions();
        clips.forEach(({ video }) => { if (video !== clip.video) video.pause(); });
        clip.video.play().catch(() => {});
      } else {
        clip.video.pause();
      }
    });
  }, { root: list, threshold: [.2, .7] });
  clips.forEach(({ item }) => observer.observe(item));

  document.querySelectorAll("details").forEach((details) => {
    const summary = details.querySelector(":scope > summary");
    if (summary) summary.remove();
    details.replaceWith(...details.childNodes);
  });
})();

}

