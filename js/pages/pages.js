/* ===================================================
   pages.js — Template HTML Dinamis untuk Setiap Halaman
   =================================================== */

const Pages = {
  levelControls(levelNum) {
    return `
        <div class="flex flex-wrap items-center justify-end gap-2">
            <span class="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${GameState.practiceMode ? "bg-purple-500/20 text-purple-200 border border-purple-400/40" : "bg-green-500/20 text-green-200 border border-green-400/40"}">
                ${GameState.practiceMode ? "Latihan" : "Misi Skor"}
            </span>
            <button onclick="showLevelGuide(${levelNum})" class="px-3 py-1.5 bg-yellow-400/15 hover:bg-yellow-400/25 border border-yellow-300/30 rounded-full text-[10px] md:text-xs font-bold text-yellow-200 transition-all">Petunjuk</button>
            <button onclick="Router.go('home')" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] md:text-xs font-bold border border-white/10 transition-all">Home</button>
        </div>
    `;
  },

  progressMap() {
    const completed = GameState.progress.levelsCompleted || [];
    return `
        <div class="w-full max-w-4xl px-4 mb-5">
            <div class="bg-black/40 border border-cyan-500/20 rounded-2xl p-3 md:p-4 backdrop-blur-md">
                <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div class="text-left">
                        <p class="text-[10px] uppercase tracking-widest text-cyan-300 font-bold">Peta Progres Misi</p>
                        <p class="text-[11px] text-gray-400">Selesaikan 5 level untuk menjadi Solar System Expert.</p>
                    </div>
                    <button onclick="continueLastLevel()" class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl font-extrabold text-xs shadow-lg active:scale-95 transition-all">
                        Lanjutkan Misi
                    </button>
                </div>
                <div class="grid grid-cols-5 gap-2">
                    ${[1, 2, 3, 4, 5]
                      .map((levelNum) => {
                        const isDone = completed.includes(levelNum);
                        const isUnlocked = GameState.isLevelUnlocked(levelNum);
                        const isLast = Number(GameState.lastLevel) === levelNum;
                        const stateClass = isDone
                          ? "bg-green-500/20 border-green-400/50 text-green-200"
                          : isUnlocked
                            ? isLast
                              ? "bg-yellow-400/15 border-yellow-300/50 text-yellow-200"
                              : "bg-white/5 border-white/10 text-gray-300"
                            : "bg-white/10 border-white/10 text-gray-500 opacity-60";
                        const displayText = isDone ? "✓" : isUnlocked ? levelNum : "🔒";
                        const label = isDone ? "Selesai" : isUnlocked ? (isLast ? "Terakhir" : "Level") : "Terkunci";
                        return `
                            <button onclick="${isUnlocked ? `startLevel(${levelNum}, false)` : "void(0)"}" ${isUnlocked ? "" : "disabled"} class="relative min-h-[54px] rounded-xl border ${stateClass} flex flex-col items-center justify-center gap-0.5 transition-all ${isUnlocked ? "hover:bg-cyan-500/15" : "cursor-not-allowed"}">
                                <span class="font-bubble-title text-base md:text-lg">${displayText}</span>
                                <span class="text-[8px] md:text-[9px] font-bold uppercase">${label}</span>
                            </button>
                        `;
                      })
                      .join("")}
                </div>
            </div>
        </div>
    `;
  },

  splash() {
    return `
        <div class="relative flex flex-col items-center justify-center text-center py-4 px-4 max-w-lg mx-auto">
            <div class="mt-4 md:mt-2 mb-3 float-anim">
                <img src="${ASSETS.astronautSplash}" alt="Siswa SMP astronaut" class="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-cyan-400 shadow-2xl" onerror="this.src='${ASSETS.placeholder}'">
            </div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest text-cyan-300 font-bold mb-1">Edisi Eksplorasi Digital</p>
            <h2 class="font-bubble-title text-2xl md:text-5xl text-yellow-300 uppercase leading-tight mb-4 md:mb-6">
                MENGENAL<br/><span class="text-white">TATA SURYA</span>
            </h2>
            
            <div class="bg-black/50 border border-cyan-500/30 p-4 md:p-6 rounded-[24px] md:rounded-[28px] w-full backdrop-blur-md">
                <label class="block text-left text-xs font-semibold tracking-wider text-cyan-300 mb-2">Nama Kosmonot Anda:</label>
                <input id="input-player-name" type="text" placeholder="Masukkan nama panggilan..." 
                    value="${GameState.playerName}"
                    autofocus
                    class="w-full bg-[#0a1931]/80 border-2 border-cyan-400 rounded-xl px-4 py-3 text-center text-yellow-300 font-bold tracking-wider focus:outline-none focus:ring-4 focus:ring-cyan-500/30 transition-all mb-3 md:mb-4">
                
                <button onclick="savePlayerNameAndStart()" class="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-extrabold uppercase tracking-wider rounded-2xl shadow-lg border-b-4 border-amber-700 active:transform active:scale-95 transition-all">
                    Mulai Eksplorasi 🚀
                </button>
            </div>
        </div>
        `;
  },

  dosen() {
    return `
        <div class="bg-black/40 border border-cyan-500/20 rounded-[28px] p-6 mx-auto max-w-3xl">
            <div class="text-center mb-6">
                <p class="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-2">Dosen Pengampuh Mata Kuliah</p>
                <h2 class="font-bubble-title text-3xl md:text-4xl text-yellow-300 mb-3">Dosen Pengampuh</h2>
                <p class="text-sm md:text-base text-gray-300 max-w-xl mx-auto">Berikut daftar dosen pengampuh dan NIDN.</p>
            </div>

            <div class="space-y-4 text-sm md:text-base">
                <div class="rounded-3xl bg-white/5 border border-cyan-500/20 p-4">
                    <p class="font-bold text-white">1. Nur Indah Sari, S.Pd., M.Pd.</p>
                    <p class="text-cyan-200 mt-1">NIDN: 0904048901</p>
                </div>
                <div class="rounded-3xl bg-white/5 border border-cyan-500/20 p-4">
                    <p class="font-bold text-white">2. Dr. Sitti Saenab, M. Pd.</p>
                    <p class="text-cyan-200 mt-1">NIDN: 0002038104</p>
                </div>
                <div class="rounded-3xl bg-white/5 border border-cyan-500/20 p-4">
                    <p class="font-bold text-white">3. A. Afrinaramadhani Hatta, S.Pd., M.Pd.</p>
                    <p class="text-cyan-200 mt-1">NIDN: 0011049009</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
                <button onclick="Router.go('splash')" class="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-sm font-bold transition-all">Kembali</button>
                <button onclick="Router.go('team')" class="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-2xl text-sm font-extrabold shadow-lg transition-all">Lanjut ke Profil Tim</button>
            </div>
        </div>
        `;
  },

  home() {
    return `
        <div class="flex flex-col items-center justify-center text-center py-2 md:py-4">
            <h2 class="font-bubble-title text-3xl md:text-6xl text-yellow-300 uppercase mb-6 md:mb-10 leading-none">
                MENGENAL<br/><span class="text-cyan-200 text-2xl md:text-5xl">TATA SURYA</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl px-4 z-10">
                
                <div onclick="Router.go('materi')" class="card-menu-cyan p-4 md:p-6 flex flex-row md:flex-col items-center justify-start md:justify-between gap-4 md:gap-0 min-h-[90px] md:min-h-[280px] cursor-pointer">
                    <div class="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center float-anim shrink-0">
                        <img src="${ASSETS.astronautMateri}" alt="Siswa SMP membaca materi" class="w-12 h-12 md:w-28 md:h-28 rounded-full object-cover border-2 md:border-4 border-white shadow-xl" onerror="this.src='${ASSETS.placeholder}'">
                    </div>
                    <div class="flex flex-col items-start md:items-center">
                        <span class="font-bubble-title text-xl md:text-2xl tracking-wider text-white font-bubble-stroke">MATERI</span>
                        <p class="text-[9px] md:text-[11px] text-cyan-200 mt-1">Ensiklopedia Tata Surya & Planet</p>
                    </div>
                </div>

                <div onclick="openMissionSelector()" class="card-menu-cyan p-4 md:p-6 flex flex-row md:flex-col items-center justify-start md:justify-between gap-4 md:gap-0 min-h-[90px] md:min-h-[280px] cursor-pointer">
                    <div class="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center float-anim shrink-0" style="animation-delay: 0.5s;">
                        <img src="${ASSETS.astronautGame}" alt="Siswa SMP bermain misi" class="w-12 h-12 md:w-28 md:h-28 rounded-full object-cover border-2 md:border-4 border-white shadow-xl" onerror="this.src='${ASSETS.placeholder}'">
                    </div>
                    <div class="flex flex-col items-start md:items-center">
                        <span class="font-bubble-title text-xl md:text-2xl tracking-wider text-white font-bubble-stroke text-left md:text-center">MISI PETUALANGAN</span>
                        <p class="text-[9px] md:text-[11px] text-cyan-200 mt-1">Selesaikan Level 1 s.d. Level 5</p>
                    </div>
                </div>

                <div onclick="Router.go('ar')" class="card-menu-cyan p-4 md:p-6 flex flex-row md:flex-col items-center justify-start md:justify-between gap-4 md:gap-0 min-h-[90px] md:min-h-[280px] cursor-pointer">
                    <div class="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center float-anim shrink-0" style="animation-delay: 1s;">
                        <img src="${ASSETS.astronautQuiz}" alt="Siswa SMP menjelajah AR" class="w-12 h-12 md:w-28 md:h-28 rounded-full object-cover border-2 md:border-4 border-white shadow-xl" onerror="this.src='${ASSETS.placeholder}'">
                    </div>
                    <div class="flex flex-col items-start md:items-center">
                        <span class="font-bubble-title text-xl md:text-2xl tracking-wider text-white font-bubble-stroke">JELAJAH AR</span>
                        <p class="text-[9px] md:text-[11px] text-cyan-200 mt-1">Scan Planet di Sekitarmu 📸</p>
                    </div>
                </div>

            </div>
        </div>
        `;
  },

  team() {
    return `
        <div class="bg-black/40 border border-cyan-500/20 rounded-[28px] p-5 md:p-7 mx-auto max-w-4xl">
            <div class="text-center mb-6">
                <p class="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-2">Pengenalan Tim Pengembangan</p>
                <h2 class="font-bubble-title text-3xl md:text-5xl text-yellow-300 mb-3">Tim Pengembang</h2>
                <p class="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">Temui dosen pengampuh dan mahasiswa yang mendukung pembuatan media pembelajaran ini.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button id="team-btn-dosen" onclick="showTeamProfile('dosen')" class="w-full py-4 bg-cyan-500/15 border border-cyan-400/30 rounded-2xl text-white font-bold hover:bg-cyan-500/25 transition-all">Profil Dosen Pengampuh</button>
                <button id="team-btn-mahasiswa" onclick="showTeamProfile('mahasiswa')" class="w-full py-4 bg-yellow-400/10 border border-yellow-300/30 rounded-2xl text-white font-bold hover:bg-yellow-400/20 transition-all">Profil Mahasiswa</button>
            </div>

            <div id="team-profile-panel" class="mt-6 bg-[#06192f] border border-cyan-500/15 rounded-3xl p-5 min-h-[220px] text-left">
                <p class="text-sm text-cyan-200">Pilih profil untuk melihat detail tim pengembangan.</p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                <button onclick="Router.go('dosen')" class="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-sm font-bold transition-all">Kembali ke Dosen</button>
                <button onclick="Router.go('home')" class="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-2xl text-sm font-extrabold shadow-lg transition-all">Selanjutnya</button>
            </div>
        </div>
        `;
  },

  materi() {
    return `
        <div class="bg-black/40 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6 backdrop-blur-md">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-4 md:mb-6">
                <h2 class="font-bubble-title text-xl md:text-2xl text-cyan-300">Ensiklopedia Tata Surya</h2>
                <button onclick="Router.go('home')" class="px-4 py-1.5 md:px-5 md:py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10">Kembali</button>
            </div>

            <div class="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6">
                <div class="md:col-span-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pr-2 pb-2 md:pb-0 shrink-0" id="materi-menu-list"></div>
                <div class="md:col-span-8 bg-[#0a1931]/80 border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-6" id="materi-content-display"></div>
            </div>
        </div>
        `;
  },

  level1() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3 mb-4">
                <div>
                    <span class="text-xs font-bold text-yellow-400">MISI LEVEL 1</span>
                    <h2 class="font-bubble-title text-xl md:text-2xl text-white">URUTAN ORBIT PLANET</h2>
                </div>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <div class="text-xs md:text-sm font-bold bg-red-500/20 border border-red-500/40 px-3 py-1.5 rounded-full text-red-300">
                        ❤️ NYAWA: <span id="l1-lives" class="font-bubble-title text-base md:text-lg">3</span>
                    </div>
                    ${this.levelControls(1)}
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex flex-row items-center justify-between gap-3 bg-white/5 p-3 md:p-4 rounded-2xl">
                    <p class="text-xs text-gray-300 leading-relaxed flex-1">Klik planet yang mengorbit sesuai urutan dari Matahari!</p>
                    <div class="bg-cyan-500/10 border border-cyan-400/30 p-3 rounded-xl text-center shrink-0">
                        <span class="text-[10px] uppercase text-cyan-300 font-bold block mb-0.5">Target:</span>
                        <span id="l1-target-text" class="font-bubble-title text-lg text-yellow-300 animate-pulse">-</span>
                    </div>
                </div>

                <div class="flex justify-center items-center relative bg-[#051329] rounded-2xl border border-cyan-500/20 overflow-hidden" id="l1-orbit-container" style="height: min(430px, 65vw)">
                    <div class="absolute w-10 h-10 md:w-12 md:h-12 rounded-full glow-sun z-20 flex items-center justify-center text-lg md:text-xl" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">☀️</div>
                </div>
            </div>
        </div>
        `;
  },

  level2() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
                <div>
                    <span class="text-xs font-bold text-yellow-400">MISI LEVEL 2</span>
                    <h2 class="font-bubble-title text-xl md:text-2xl text-white">COCOKKAN PLANET</h2>
                </div>
                ${this.levelControls(2)}
            </div>

            <p class="text-xs text-cyan-300 mb-4 bg-cyan-500/10 p-3 rounded-xl">Klik nama planet, lalu klik gambar planet yang sesuai!</p>

            <div class="flex flex-col md:grid md:grid-cols-12 gap-4">
                <div class="md:col-span-4 bg-[#0a1931]/60 p-3 rounded-2xl grid grid-cols-2 md:flex md:flex-col gap-2" id="l2-names-source"></div>
                <div class="md:col-span-8 bg-[#0a1931]/60 p-3 rounded-2xl grid grid-cols-4 gap-3" id="l2-slots-target"></div>
            </div>

            <div class="mt-4 flex justify-end">
                <button onclick="Level2.checkAnswers()" class="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold rounded-2xl transition-all shadow-lg active:scale-95 text-sm">Validasi Jawaban ➔</button>
            </div>
        </div>
        `;
  },

  level3() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6 max-w-2xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
                <h2 class="font-bubble-title text-xl md:text-2xl text-white">BENAR ATAU SALAH</h2>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <span class="text-xs font-bold bg-cyan-500/20 px-3 py-1.5 rounded-full text-cyan-300" id="l3-progress">1 / 15</span>
                    ${this.levelControls(3)}
                </div>
            </div>

            <div class="w-full bg-white/5 h-2 rounded-full mb-4 overflow-hidden">
                <div id="l3-progress-bar" class="bg-cyan-400 h-2 transition-all" style="width: 10%"></div>
            </div>

            <div class="bg-cyan-950/20 border border-cyan-500/30 p-5 md:p-8 rounded-2xl text-center" id="l3-card-box">
                <p id="l3-statement" class="text-sm md:text-lg font-semibold leading-relaxed mb-5"></p>
                <div class="grid grid-cols-2 gap-3 md:gap-4 max-w-sm mx-auto">
                    <button onclick="Level3.answer(true)" class="py-3 md:py-4 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-2xl active:scale-95 transition-all text-sm">✔ BENAR</button>
                    <button onclick="Level3.answer(false)" class="py-3 md:py-4 bg-red-500 hover:bg-red-400 text-white font-extrabold rounded-2xl active:scale-95 transition-all text-sm">✘ SALAH</button>
                </div>
            </div>

            <div id="l3-feedback" class="mt-3 bg-[#0a1931] border border-cyan-500/20 rounded-xl p-4 hidden"></div>
        </div>
        `;
  },

  level4() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6 max-w-2xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
                <h2 class="font-bubble-title text-xl md:text-2xl text-white">QUIZ ADVENTURE</h2>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <span class="text-xs font-bold bg-cyan-500/20 px-3 py-1.5 rounded-full text-cyan-300" id="l4-count">1 / 10</span>
                    ${this.levelControls(4)}
                </div>
            </div>

            <div class="w-full bg-white/5 h-2 rounded-full mb-4 overflow-hidden">
                <div id="l4-progress-bar" class="bg-cyan-400 h-2 transition-all" style="width: 20%"></div>
            </div>

            <div class="bg-cyan-950/20 border border-cyan-500/30 p-4 md:p-6 rounded-2xl mb-4">
                <div class="w-full flex justify-center mb-4">
                    <img id="l4-question-img" src="" alt="Ilustrasi Soal"
                        class="rounded-2xl border border-cyan-500/30 max-h-40 md:max-h-52 w-auto object-contain shadow-xl hidden"
                        style="background: rgba(0,0,0,0.3)">
                </div>
                <h3 id="l4-question" class="text-sm md:text-base font-bold mb-4"></h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3" id="l4-options-container"></div>
            </div>

            <div id="l4-feedback" class="bg-[#0a1931] border border-cyan-500/30 rounded-2xl p-4 hidden">
                <h4 class="font-bold text-yellow-300 mb-1" id="l4-feedback-title"></h4>
                <p id="l4-feedback-text" class="text-xs text-gray-300 mb-3"></p>
                <button onclick="Level4.nextQuestion()" class="px-4 py-2 bg-cyan-400 text-black font-bold rounded-lg text-xs">Lanjut ▶</button>
            </div>
        </div>
        `;
  },

  level5() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
                <h2 class="font-bubble-title text-xl md:text-2xl text-white">MISSION SPACE</h2>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <span class="text-xs md:text-sm font-bold bg-cyan-500/20 px-3 md:px-4 py-1.5 rounded-full text-yellow-300" id="l5-star-count">⭐ 0 / 5</span>
                    ${this.levelControls(5)}
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="relative">
                    <canvas id="l5-game-canvas" class="w-full bg-[#051329] rounded-2xl border border-cyan-500/20 block" style="aspect-ratio: 4/3; max-height: 55vh;" width="600" height="450"></canvas>
                    
                    <div id="l5-question-overlay" class="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3 md:p-6 hidden">
                        <div class="bg-gradient-to-b from-[#0a1931] to-[#15305b] border-2 border-cyan-400 p-4 md:p-6 rounded-2xl w-full max-w-md text-center shadow-2xl">
                            <span class="text-lg md:text-xl mb-2 block font-bold tracking-wider text-cyan-300">✦ TANTANGAN BINTANG ✦</span>
                            <div class="flex justify-center mb-3">
                                <img id="l5-question-img" src="" alt="" class="h-24 md:h-32 object-contain rounded-xl border border-cyan-500/20 hidden"
                                    onerror="this.style.display='none'">
                            </div>
                            <h4 id="l5-question" class="text-xs md:text-sm font-bold mb-3"></h4>
                            <div class="flex flex-col gap-2 mb-3" id="l5-options"></div>
                            <p id="l5-feedback" class="text-xs font-semibold hidden"></p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <p class="text-xs text-gray-400 leading-relaxed flex-1">Gunakan tombol atau keyboard ◀ ▶ untuk gerak pesawat. Tangkap bintang untuk kuis!</p>
                    <div class="grid grid-cols-2 gap-2 w-full sm:w-auto shrink-0">
                        <button id="btn-move-left" class="py-3 px-6 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl font-bold border border-cyan-400/40 text-sm">◀ KIRI</button>
                        <button id="btn-move-right" class="py-3 px-6 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl font-bold border border-cyan-400/40 text-sm">KANAN ▶</button>
                    </div>
                </div>
            </div>
        </div>
        `;
  },

  score() {
    const history = GameState.history;
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6 max-w-2xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
                <h2 class="font-bubble-title text-xl md:text-2xl text-cyan-300">Papan Prestasi</h2>
                <button onclick="Router.go('home')" class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10">← Kembali ke Beranda</button>
            </div>
            <div class="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                <div class="bg-white/5 p-3 md:p-4 rounded-xl text-center">
                    <span class="text-[9px] md:text-[10px] text-gray-400 uppercase block mb-1">Skor</span>
                    <span class="font-bubble-title text-base md:text-xl text-yellow-300">${GameState.score} XP</span>
                </div>
                <div class="bg-white/5 p-3 md:p-4 rounded-xl text-center">
                    <span class="text-[9px] md:text-[10px] text-gray-400 uppercase block mb-1">Misi</span>
                    <span class="font-bubble-title text-base md:text-xl text-green-400">${GameState.progress.levelsCompleted.length} / 5</span>
                </div>
                <div class="bg-white/5 p-3 md:p-4 rounded-xl text-center">
                    <span class="text-[9px] md:text-[10px] text-gray-400 uppercase block mb-1">Lencana</span>
                    <span class="text-[10px] md:text-xs font-bold block mt-1">${GameState.calculateBadge().split(" ").slice(1).join(" ")}</span>
                </div>
            </div>

            <h3 class="font-bold text-xs md:text-sm text-cyan-300 mb-3">Aktivitas Misi Terakhir</h3>
            <div class="space-y-2 max-h-48 md:max-h-52 overflow-y-auto pr-2">
                ${
                  history.length === 0
                    ? `<p class="text-xs text-gray-400 text-center py-4">Belum ada aktivitas yang tercatat.</p>`
                    : history
                        .map(
                          (item) => `
                <div class="bg-white/5 p-2.5 md:p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                        <p class="font-bold">Misi Level ${item.level}</p>
                        <span class="text-[10px] text-gray-500">${item.date}</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-yellow-300">+${item.score} XP</span>
                        <p class="text-[9px] text-gray-400">Akurasi: ${item.accuracy}%</p>
                    </div>
                </div>
                `,
                        )
                        .join("")
                }
            </div>
        </div>
        `;
  },

  about() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[32px] p-6 max-w-xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 class="font-bubble-title text-2xl text-cyan-300">Tentang & Bantuan</h2>
                <button onclick="Router.go(Router.previousPage || 'home')" class="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10">← Kembali</button>
            </div>
            <div class="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
                <div class="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 rounded-lg text-yellow-100">
                    <strong class="block text-sm text-yellow-300">PERINGATAN PENTING — KUIS HANYA SEKALI DIKIRIM</strong>
                    <p class="text-[11px] text-yellow-100 mt-1">Setiap kuis misi hanya dapat diisi satu kali untuk dicatat sebagai skor. Pastikan membaca soal dan memeriksa jawaban sebelum mengirim, karena skor dan progres tidak dapat diubah setelah disimpan.</p>
                </div>
                <p><strong>Kosmos Petualang</strong> adalah platform edukasi interaktif yang dirancang khusus untuk mempermudah siswa SMP Kelas VII dalam mengeksplorasi ilmu sains Tata Surya dengan seru!</p>
                <div class="bg-[#0a1931] border border-cyan-500/30 p-4 rounded-xl space-y-2">
                    <h4 class="font-bold text-white text-xs">PETUNJUK NARASI:</h4>
                    <p class="text-[11px]">Mulailah dari halaman sampul dengan menulis nama panggilan, lalu tekan <strong>Mulai Eksplorasi</strong>. Di Home, siswa dapat melihat peta progres, melanjutkan level terakhir, membaca Materi, memainkan Misi Petualangan dari Level 1 sampai Level 5, atau membuka Jelajah AR. Pilih <strong>Misi</strong> untuk mencatat skor dan progres, atau <strong>Latihan</strong> untuk mencoba level tanpa menyimpan nilai.</p>
                </div>
                <div class="bg-[#0a1931] border border-yellow-400/30 p-4 rounded-xl space-y-2">
                    <h4 class="font-bold text-white text-xs">PETUNJUK TOMBOL NAVIGASI:</h4>
                    <ul class="list-disc pl-5 space-y-1 text-[11px]">
                        <li><strong>Home / 🏠:</strong> kembali ke menu utama.</li>
                        <li><strong>? Petunjuk:</strong> membuka halaman bantuan dan penjelasan penggunaan aplikasi.</li>
                        <li><strong>👤:</strong> melihat skor, lencana, dan riwayat misi.</li>
                        <li><strong>🔊:</strong> menyalakan atau mematikan suara latar.</li>
                        <li><strong>Kembali / Batal:</strong> kembali ke halaman sebelumnya atau membatalkan pilihan.</li>
                        <li><strong>Lanjutkan Misi:</strong> membuka level terakhir yang dimainkan.</li>
                        <li><strong>Misi / Latihan:</strong> menjalankan level dengan skor atau mencoba tanpa menyimpan progres.</li>
                        <li><strong>Petunjuk:</strong> menampilkan arahan khusus untuk level yang sedang dimainkan.</li>
                        <li><strong>Level Berikutnya / Ulangi Level Ini:</strong> lanjut ke misi selanjutnya atau mengulang misi yang sama setelah selesai.</li>
                        <li><strong>◀ KIRI dan KANAN ▶:</strong> menggerakkan pesawat pada Mission Space.</li>
                    </ul>
                </div>
                <p class="text-[11px] text-gray-500 text-center border-t border-white/5 pt-4">Versi 8.0 (Enhanced AR Edition) | Dikembangkan untuk IPA Kurikulum Merdeka.</p>
            </div>
        </div>
        `;
  },

          team() {
            return `
                <div class="bg-black/50 border border-cyan-500/20 rounded-[32px] p-6 max-w-xl mx-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-bubble-title text-2xl text-cyan-300">Profil Tim</h2>
                        <button onclick="Router.go('home')" class="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10">← Lanjut ke Beranda</button>
                    </div>

                    <div class="space-y-4 text-sm text-gray-300">
                        <p class="text-xs text-gray-400">Berikut anggota tim pengembang (urutan):</p>

                        <div class="grid grid-cols-1 gap-3">
                            <div class="bg-[#0a1931] border border-cyan-500/30 p-3 rounded-xl flex items-center gap-3">
                                <img src="${ASSETS.astronautMateri}" alt="Evi Wahyuni" class="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-md" onerror="this.src='${ASSETS.placeholder}'">
                                <div>
                                    <div class="font-bold text-white">1. Evi Wahyuni</div>
                                    <div class="text-[11px] text-gray-400">230111510003 • Astronot — Navigator & Desain Visual</div>
                                    <div class="text-[11px] text-cyan-300 mt-1">Siap menjelajah tata surya bersama sobat IPA.</div>
                                </div>
                            </div>

                            <div class="bg-[#0a1931] border border-cyan-500/30 p-3 rounded-xl flex items-center gap-3">
                                <img src="${ASSETS.astronautGame}" alt="Artika Sari Devi" class="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-md" onerror="this.src='${ASSETS.placeholder}'">
                                <div>
                                    <div class="font-bold text-white">2. Artika Sari Devi</div>
                                    <div class="text-[11px] text-gray-400">230111510002 • Astronot — Pengembang Konten</div>
                                    <div class="text-[11px] text-cyan-300 mt-1">Menyusun materi dan kuis edukatif.</div>
                                </div>
                            </div>

                            <div class="bg-[#0a1931] border border-cyan-500/30 p-3 rounded-xl flex items-center gap-3">
                                <img src="${ASSETS.astronautQuiz}" alt="A. Anna Fitri Maulida" class="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-md" onerror="this.src='${ASSETS.placeholder}'">
                                <div>
                                    <div class="font-bold text-white">3. A. Anna Fitri Maulida</div>
                                    <div class="text-[11px] text-gray-400">230111512001 • Astronot — Pengembang Frontend</div>
                                    <div class="text-[11px] text-cyan-300 mt-1">Bertugas memastikan antarmuka ramah siswa.</div>
                                </div>
                            </div>

                            <div class="bg-[#0a1931] border border-cyan-500/30 p-3 rounded-xl flex items-center gap-3">
                                <img src="${ASSETS.astronautSplash}" alt="Dwi Ardiyan Putra" class="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-md" onerror="this.src='${ASSETS.placeholder}'">
                                <div>
                                    <div class="font-bold text-white">4. Dwi Ardiyan Putra</div>
                                    <div class="text-[11px] text-gray-400">230111512009 • Astronot — Pengembang Logika & Game</div>
                                    <div class="text-[11px] text-cyan-300 mt-1">Merancang mekanik misi dan kuis interaktif.</div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-white/5">
                            <button onclick="Router.go('home')" class="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold rounded-2xl shadow-lg">Lanjut ke Beranda ▶</button>
                        </div>
                    </div>
                </div>
                `;
          },

  ar() {
    return `
        <div class="bg-black/50 border border-cyan-500/20 rounded-[24px] md:rounded-[32px] p-4 md:p-6 backdrop-blur-md">

            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-5">
                <div>
                    <span class="text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] block mb-1">
                        ✦ Solar System Explorer 3D
                    </span>
                    <h2 class="font-bubble-title text-lg md:text-2xl text-white leading-none">
                        Jelajah AR Tata Surya
                    </h2>
                </div>
                <div class="flex items-center gap-2">
                    <span class="hidden md:flex items-center gap-1.5 text-[10px] text-gray-500 bg-white/3 border border-white/5 rounded-lg px-2.5 py-1.5">
                        <span>🖱</span> Seret · Cubit · Scroll
                    </span>
                    <button onclick="ARPage.goBack()"
                        class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10">
                        ← Kembali
                    </button>
                </div>
            </div>

            <!-- Planet Selector -->
            <div class="mb-4">
                <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Pilih Objek:</span>
                <div class="flex flex-wrap gap-1.5" id="planet-selector-scroll"></div>
            </div>

            <!-- Main Layout -->
            <div class="flex flex-col xl:grid xl:grid-cols-12 gap-4 md:gap-5">

                <!-- 3D Viewer -->
                <div class="xl:col-span-7 flex flex-col gap-3">

                    <div id="ar-viewer-wrap"
                        class="relative rounded-2xl overflow-hidden border transition-all duration-700"
                        style="height: 360px; background: radial-gradient(ellipse at center, #0d1f3c 0%, #030b1a 100%); border-color: rgba(0,212,255,0.15);">

                        <model-viewer
                            id="solar-system-3d"
                            src="${MODEL_3D_TATA_SURYA}"
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-controls
                            auto-rotate
                            auto-rotate-delay="3000"
                            rotation-per-second="4deg"
                            orbit-sensitivity="2.5"
                            zoom-sensitivity="2.0"
                            shadow-intensity="1"
                            exposure="1.2"
                            interaction-prompt="none"
                            alt="3D Solar System Model"
                            class="w-full h-full"
                            style="background-color: transparent; --progress-bar-color: transparent;">

                            <button slot="ar-button"
                                class="absolute bottom-4 right-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-[11px] shadow-lg shadow-cyan-500/20 active:scale-95 transition-all border border-cyan-400/30">
                                📡 Buka AR
                            </button>
                        </model-viewer>

                        <!-- HUD Planet Name -->
                        <div class="absolute top-3 left-3 pointer-events-none">
                            <div class="backdrop-blur-md bg-black/60 rounded-xl px-3 py-2 border border-white/10">
                                <div id="ar-hud-planet-type"
                                    class="text-[8px] font-bold uppercase tracking-widest mb-0.5 px-1.5 py-0.5 rounded-full inline-block bg-white/10 text-gray-400">
                                    —
                                </div>
                                <div id="ar-hud-planet-name"
                                    class="text-sm font-bold text-white leading-none mt-0.5">
                                    Memuat...
                                </div>
                            </div>
                        </div>

                        <!-- HUD Orbit Period -->
                        <div class="absolute top-3 right-3 pointer-events-none">
                            <div class="backdrop-blur-md bg-black/60 rounded-xl px-3 py-2 border border-white/10 text-right">
                                <div class="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Periode Orbit</div>
                                <div id="ar-hud-orbit" class="text-[11px] font-bold text-cyan-300">—</div>
                            </div>
                        </div>

                        <!-- Controls hint -->
                        <div class="absolute bottom-4 left-4 pointer-events-none">
                            <div class="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/5">
                                <span class="text-[9px] text-gray-500">Seret · Cubit · Scroll untuk kontrol</span>
                            </div>
                        </div>
                    </div>

                    <!-- Control Toolbar -->
                    <div class="flex items-center gap-2 flex-wrap">
                        <button id="ar-btn-rotate"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all">
                            <span class="rotate-icon" style="display:inline-block; animation: spin 3s linear infinite">⟳</span>
                            <span class="rotate-label">Auto Rotate</span>
                        </button>
                        <button id="ar-btn-reset"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all">
                            <span>⌖</span>
                            <span>Reset Kamera</span>
                        </button>
                        <button id="ar-btn-light"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/30 transition-all">
                            <span>☀</span>
                            <span class="light-label">Mode Gelap</span>
                        </button>
                        <button id="ar-btn-fullscreen"
                            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all ml-auto">
                            <span>⛶</span>
                            <span class="hidden sm:inline">Layar Penuh</span>
                        </button>
                    </div>
                </div>

                <!-- Info Panel -->
                <div class="xl:col-span-5 bg-[#070f23]/90 border border-white/8 rounded-2xl p-4 flex flex-col"
                    style="max-height: 470px; overflow-y: auto;">
                    <div id="planet-info-panel" class="flex flex-col gap-3 text-xs"></div>
                </div>
            </div>
        </div>
        `;
  },
};

