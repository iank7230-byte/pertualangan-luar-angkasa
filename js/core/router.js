/* ===================================================
   router.js — Routing Halaman & State Game
   =================================================== */

const GameState = {
  playerName: StorageManager.get("playerName", ""),
  score: StorageManager.get("score", 0),
  progress: StorageManager.get("progress", {
    materiRead: [],
    levelsCompleted: [],
  }),
  history: StorageManager.get("history", []),
  currentLevel: 1,
  lastLevel: StorageManager.get("lastLevel", 1),
  practiceMode: false,

  load() {
    this.playerName = StorageManager.get("playerName", "");
    this.score = StorageManager.get("score", 0);
    this.progress = StorageManager.get("progress", {
      materiRead: [],
      levelsCompleted: [],
    });
    if (!Array.isArray(this.progress.materiRead)) this.progress.materiRead = [];
    if (!Array.isArray(this.progress.levelsCompleted)) {
      this.progress.levelsCompleted = [];
    }
    this.history = StorageManager.get("history", []);
    this.lastLevel = StorageManager.get("lastLevel", 1);
    this.practiceMode = false;
  },

  save() {
    StorageManager.set("playerName", this.playerName);
    StorageManager.set("score", this.score);
    StorageManager.set("progress", this.progress);
    StorageManager.set("history", this.history);
    StorageManager.set("lastLevel", this.lastLevel);
    this.updateGlobalHeader();
  },

  addScore(points) {
    if (this.practiceMode) return;
    this.score += points;
    this.save();
    this.updateGlobalHeader();
  },

  isLevelUnlocked(levelNum) {
    const levelNumber = Number(levelNum);
    if (!Number.isFinite(levelNumber) || levelNumber < 1) return false;
    if (levelNumber === 1) return true;
    if ((this.progress.levelsCompleted || []).includes(levelNumber)) return true;
    return (this.progress.levelsCompleted || []).includes(levelNumber - 1);
  },

  getHighestUnlockedLevel() {
    let highestUnlocked = 1;
    for (let level = 1; level <= 5; level += 1) {
      if (this.isLevelUnlocked(level)) {
        highestUnlocked = level;
      } else {
        break;
      }
    }
    return highestUnlocked;
  },

  completeLevel(levelNum, stats = {}) {
    this.lastLevel = levelNum;
    StorageManager.set("lastLevel", this.lastLevel);

    if (this.practiceMode) {
      Dialog.alert(
        `Latihan Level ${levelNum} selesai. Skor dan progres tidak disimpan dalam mode latihan.`,
        () => {
          this.practiceMode = false;
          Router.go("home");
        },
      );
      return;
    }

    if (!this.progress.levelsCompleted.includes(levelNum)) {
      this.progress.levelsCompleted.push(levelNum);
    }

    const newRecord = {
      level: levelNum,
      date: new Date().toLocaleDateString("id-ID"),
      score: stats.score || 0,
      accuracy: stats.accuracy || 100,
      duration: stats.duration || "00:00",
    };
    this.history.unshift(newRecord);
    this.save();

    const badge = this.calculateBadge();
    showLevelUpModal(levelNum, stats.score, stats.accuracy, badge);
  },

  calculateBadge() {
    const totalCompleted = this.progress.levelsCompleted.length;
    if (totalCompleted >= 5) return "🥇 Solar System Expert";
    if (totalCompleted >= 3) return "🥈 Planet Master";
    if (totalCompleted >= 1) return "🥉 Space Explorer";
    return "🛰️ Space Cadet";
  },

  updateGlobalHeader() {
    const playerTag = document.getElementById("player-welcome-tag");
    if (playerTag) {
      playerTag.innerHTML = `Selamat Belajar, <span class="text-yellow-300 font-bold">${this.playerName || "Sobat IPA"}</span>`;
    }
  },
};

const LEVEL_GUIDES = {
  1: {
    title: "Petunjuk Level 1",
    body: "Klik planet sesuai urutan orbit dari yang paling dekat dengan Matahari sampai yang paling jauh. Perhatikan target yang muncul di panel kanan.",
  },
  2: {
    title: "Petunjuk Level 2",
    body: "Pilih nama planet di sebelah kiri, lalu klik gambar planet yang cocok. Setelah semua terisi, tekan Validasi Jawaban.",
  },
  3: {
    title: "Petunjuk Level 3",
    body: "Baca pernyataan dengan teliti, lalu pilih Benar atau Salah. Setelah menjawab, baca penjelasan singkat sebelum soal berikutnya muncul.",
  },
  4: {
    title: "Petunjuk Level 4",
    body: "Pilih satu jawaban yang paling tepat. Setelah feedback tampil, tekan Lanjut untuk menuju pertanyaan berikutnya.",
  },
  5: {
    title: "Petunjuk Level 5",
    body: "Gerakkan pesawat dengan tombol kiri/kanan atau keyboard panah. Tangkap bintang, lalu jawab kuis untuk mengumpulkannya.",
  },
};

const GameFeedback = {
  show(type, message) {
    const oldToast = document.getElementById("game-feedback-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "game-feedback-toast";
    toast.className = `game-feedback-toast ${type === "correct" ? "feedback-correct" : "feedback-wrong"}`;
    toast.innerText = message || (type === "correct" ? "Jawaban benar!" : "Coba lagi!");
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("is-visible"), 20);
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 250);
    }, 1200);
  },
};

const Router = {
  currentPage: "splash",
  previousPage: "splash",

  go(pageId) {
    SoundManager.play("click");
    this.previousPage = this.currentPage;
    this.currentPage = pageId;

    // Update BGM sesuai dengan halaman baru
    SoundManager.playBGMForPage(pageId);

    const container = document.getElementById("main-content");
    const horizonBg = document.getElementById("bottom-planet-horizon");

    if (pageId === "splash" || pageId === "home") {
      horizonBg.style.transform = "translateY(0)";
    } else {
      horizonBg.style.transform = "translateY(100%)";
    }

    // Sembunyikan elemen header tertentu jika berada di halaman splash
    const playerTag = document.getElementById("player-welcome-tag");
    const btnScore = document.querySelector('[title="Statistik & Skor"]');
    const btnHome = document.querySelector('[title="Kembali ke Menu Utama"]');

    if (pageId === "splash") {
      if (playerTag) playerTag.style.visibility = "hidden";
      if (btnScore) btnScore.style.visibility = "hidden";
      if (btnHome) btnHome.style.visibility = "hidden";
    } else {
      if (playerTag) playerTag.style.visibility = "visible";
      if (btnScore) btnScore.style.visibility = "visible";
      if (btnHome) btnHome.style.visibility = "visible";
    }

    if (window.missionGameLoopId) {
      cancelAnimationFrame(window.missionGameLoopId);
      window.missionGameLoopId = null;
    }

    if (
      typeof Level5 !== "undefined" &&
      typeof Level5.cleanup === "function" &&
      pageId !== "level5"
    ) {
      Level5.cleanup();
    }

    // Pastikan kamera AR dinonaktifkan saat meninggalkan halaman AR
    if (
      typeof ARPage !== "undefined" &&
      typeof ARPage.stopCamera === "function"
    ) {
      ARPage.stopCamera();
    }

    switch (pageId) {
      case "splash":
        container.innerHTML = Pages.splash();
        const splashInput = document.getElementById("input-player-name");
        if (splashInput) {
          splashInput.focus();
        }
        break;
      case "home":
        container.innerHTML = Pages.home();
        break;
      case "team":
        container.innerHTML = Pages.team();
        break;
      case "materi":
        container.innerHTML = Pages.materi();
        MateriPage.init();
        break;
      case "level1":
        container.innerHTML = Pages.level1();
        Level1.init();
        break;
      case "level2":
        container.innerHTML = Pages.level2();
        Level2.init();
        break;
      case "level3":
        container.innerHTML = Pages.level3();
        Level3.init();
        break;
      case "level4":
        container.innerHTML = Pages.level4();
        Level4.init();
        break;
      case "level5":
        container.innerHTML = Pages.level5();
        Level5.init();
        break;
      case "ar":
        container.innerHTML = Pages.ar();
        ARPage.init();
        break;
      case "score":
        container.innerHTML = Pages.score();
        break;
      case "about":
        container.innerHTML = Pages.about();
        break;
    }

    if (pageId !== "splash") {
      GameState.updateGlobalHeader();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};

function startLevel(levelNum, practiceMode = false) {
  if (!practiceMode && !GameState.isLevelUnlocked(levelNum)) {
    const requiredLevel = levelNum - 1;
    const message =
      requiredLevel === 1
        ? "Selesaikan Level 1 terlebih dahulu untuk membuka Level 2."
        : `Selesaikan Level ${requiredLevel} terlebih dahulu untuk membuka Level ${levelNum}.`;
    Dialog.alert(message);
    return;
  }

  GameState.currentLevel = levelNum;
  GameState.lastLevel = levelNum;
  GameState.practiceMode = practiceMode;
  GameState.save();
  Router.go("level" + levelNum);
}

function continueLastLevel() {
  const targetLevel = GameState.getHighestUnlockedLevel();
  startLevel(targetLevel, false);
}

function showLevelGuide(levelNum) {
  const guide = LEVEL_GUIDES[levelNum];
  if (!guide) return;
  Dialog.show({
    title: guide.title.toUpperCase(),
    message: guide.body,
    confirmText: "Mengerti",
    showCancel: false,
    icon: "💡",
  });
}

function openMissionSelector() {
  const container = document.getElementById("main-content");
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center py-2 md:py-4 w-full">
      <div class="w-full max-w-4xl px-4 mb-5">
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-center">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div class="text-left">
              <p class="text-[10px] uppercase tracking-widest text-yellow-300 font-bold">Misi Pertualangan</p>
              <h2 class="font-bubble-title text-2xl md:text-3xl text-white">PILIH TANTANGAN MISI</h2>
            </div>
            <button onclick="Router.go('home')" class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] md:text-xs font-bold border border-white/10 transition-all">Kembali</button>
          </div>

          ${Pages.progressMap()}

          <p class="text-[11px] text-gray-400 mb-4">Pilih Misi untuk mencatat skor atau Latihan untuk mencoba tanpa menyimpan progres.</p>
          <div class="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              ${[1, 2, 3, 4, 5]
                .map((levelNum) => {
                  const labels = {
                    1: "🛰️ LEVEL 1: URUTAN ORBIT PLANET",
                    2: "🪐 LEVEL 2: COCOKKAN GAMBAR",
                    3: "⚖️ LEVEL 3: BENAR / SALAH",
                    4: "📝 LEVEL 4: PILIHAN GANDA",
                    5: "🚀 LEVEL 5: MISSION SPACE",
                  };
                  const type = levelNum <= 2 ? "Game" : levelNum <= 4 ? "Kuis" : "Game Pesawat";
                  const completed = GameState.progress.levelsCompleted || [];
                  const isDone = completed.includes(levelNum);
                  const isUnlocked = GameState.isLevelUnlocked(levelNum);
                  const lockedText = isUnlocked ? "" : `<p class="text-[10px] text-yellow-400 mt-2">Buka setelah menyelesaikan Level ${levelNum - 1}</p>`;
                  return `
                    <div class="bg-[#0a1931] border-2 ${isUnlocked ? "border-cyan-400/30" : "border-white/10 opacity-70"} rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 text-left">
                      <div class="flex-1">
                        <p class="text-xs md:text-sm font-bold">${labels[levelNum]}</p>
                        <span class="inline-block mt-1 text-[10px] ${isDone ? "bg-green-500/20 text-green-300" : isUnlocked ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-gray-400"} px-2 py-0.5 rounded-full font-bold uppercase">${isDone ? "Selesai" : isUnlocked ? "Terbuka" : "Terkunci"}</span>
                        ${lockedText}
                      </div>
                      <div class="grid grid-cols-2 gap-2 sm:w-44">
                        <button ${isUnlocked ? `onclick="startLevel(${levelNum}, false)"` : "disabled"} class="py-2 ${isUnlocked ? "bg-cyan-400 hover:bg-cyan-300 text-black" : "bg-white/10 border border-white/20 text-gray-400 cursor-not-allowed"} rounded-xl font-extrabold text-[11px] transition-all">Misi</button>
                        <button ${isUnlocked ? `onclick="startLevel(${levelNum}, true)"` : "disabled"} class="py-2 ${isUnlocked ? "bg-white/10 hover:bg-white/20 border border-white/20" : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"} rounded-xl font-bold text-[11px] transition-all">Latihan</button>
                      </div>
                    </div>
                  `;
                })
                .join("")}
          </div>
        </div>
      </div>
    </div>
    `;
}

function savePlayerNameAndStart() {
  const input = document.getElementById("input-player-name");
  const name = input.value.trim();
  if (name === "") {
    input.classList.add("shake-effect");
    setTimeout(() => input.classList.remove("shake-effect"), 400);
    return;
  }
  GameState.playerName = name;
  GameState.save();
  SoundManager.startBGM(); // Aktifkan musik secara paksa setelah interaksi tombol
  Router.go("team");
}

function confirmExit() {
  Dialog.show({
    title: "KONFIRMASI KELUAR",
    message:
      "Apakah kamu yakin ingin menghentikan misi dan kembali ke menu utama?",
    icon: "🚀",
    confirmText: "Ya, Keluar",
    cancelText: "Batal",
    onConfirm: () => {
      Router.go("home");
    },
  });
}

function handleHomeButton() {
  if (Router.currentPage === "splash" || Router.currentPage === "home") {
    Router.go("home");
  } else {
    confirmExit();
  }
}

function goToNextLevel() {
  const nextLevel = GameState.currentLevel + 1;
  closeLevelUpModal();

  if (nextLevel > 5) {
    Dialog.alert(
      "Selamat! Kamu telah menyelesaikan semua level! 🎉 Kembali ke menu utama untuk menjelajahi materi atau mengulangi level.",
      () => {
        Router.go("home");
      },
    );
  } else {
    GameState.currentLevel = nextLevel;
    Router.go("level" + nextLevel);
  }
}

function repeatCurrentLevel() {
  const level = GameState.currentLevel;
  closeLevelUpModal();
  Router.go("level" + level);
}
