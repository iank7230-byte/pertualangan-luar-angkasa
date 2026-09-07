/* ===================================================
   level2.js — Logika Game Pencocokan Planet
   =================================================== */

const Level2 = {
    planets: [
        { id: "p1", name: "Merkurius", img: ASSETS.merkurius },
        { id: "p2", name: "Venus", img: ASSETS.venus },
        { id: "p3", name: "Bumi", img: ASSETS.bumi },
        { id: "p4", name: "Mars", img: ASSETS.mars },
        { id: "p5", name: "Jupiter", img: ASSETS.jupiter },
        { id: "p6", name: "Saturnus", img: ASSETS.saturnus },
        { id: "p7", name: "Uranus", img: ASSETS.uranus },
        { id: "p8", name: "Neptunus", img: ASSETS.neptunus }
    ],
    selectedName: null,
    selectedNameEl: null,
    assignments: {},
    startTime: null,
    timerId: null,
    timeLeft: 60,

    init() {
        this.selectedName = null;
        this.selectedNameEl = null;
        this.assignments = {};
        this.startTime = new Date();
        this.startTimer();
        this.renderBoard();
    },

    cleanup() {
        clearInterval(this.timerId);
        this.timerId = null;
    },

    startTimer() {
        this.cleanup();
        this.timeLeft = 60;
        const timer = document.getElementById('l2-timer');
        const update = () => {
            if (timer) timer.innerText = `${String(Math.floor(this.timeLeft / 60)).padStart(2, '0')}:${String(this.timeLeft % 60).padStart(2, '0')}`;
        };
        update();
        this.timerId = setInterval(() => {
            this.timeLeft--;
            update();
            if (this.timeLeft <= 0) this.failByTimeout();
        }, 1000);
    },

    failByTimeout() {
        this.cleanup();
        Dialog.alert("Waktu Level 2 habis. Misi gagal, silakan coba lagi.", () => Router.go('home'));
    },

    renderBoard() {
        const sourceContainer = document.getElementById('l2-names-source');
        const targetContainer = document.getElementById('l2-slots-target');
        
        sourceContainer.innerHTML = `<h3 class="text-xs font-extrabold uppercase tracking-widest text-cyan-300 border-b border-cyan-500/10 pb-2 mb-2"> Klik Nama</h3>`;
        targetContainer.innerHTML = '';

        const shuffledNames = [...this.planets].sort(() => Math.random() - 0.5);
        shuffledNames.forEach(planet => {
            const el = document.createElement('div');
            el.className = "px-4 py-3 bg-[#0a1931] border border-cyan-400/30 rounded-xl text-xs font-bold cursor-pointer select-none transition-all active:scale-95 flex justify-between items-center";
            el.innerText = planet.name;
            el.addEventListener('click', () => this.selectName(planet.name, el));
            sourceContainer.appendChild(el);
        });

        const shuffledTargets = [...this.planets].sort(() => Math.random() - 0.5);
        shuffledTargets.forEach(planet => {
            const slot = document.createElement('div');
            slot.className = "bg-white/5 border border-cyan-500/10 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 aspect-square relative hover:border-cyan-400 transition-all select-none overflow-hidden";
            slot.dataset.id = planet.id;

            slot.innerHTML = `
                <div class="w-16 h-16 rounded-full border border-cyan-400/30 planet-thumb" style="background-image: url('${planet.img}'); background-size: cover; background-position: center;"></div>
                <div class="l2-dropped-text absolute bottom-2 left-2 right-2 py-1.5 bg-black/60 border border-dashed border-white/25 text-[10px] text-gray-400 font-bold rounded-lg uppercase">
                    Kosong
                </div>
            `;

            slot.addEventListener('click', () => this.dropToSlot(planet.id, slot));
            targetContainer.appendChild(slot);
        });
    },

    selectName(name, element) {
        SoundManager.play('click');
        if (this.selectedNameEl) {
            this.selectedNameEl.classList.remove('bg-cyan-500/20', 'border-cyan-400');
        }
        this.selectedName = name;
        this.selectedNameEl = element;
        element.classList.add('bg-cyan-500/20', 'border-cyan-400');
    },

    dropToSlot(targetId, slotElement) {
        if (!this.selectedName) return;
        SoundManager.play('click');
        this.assignments[targetId] = this.selectedName;

        const dropBox = slotElement.querySelector('.l2-dropped-text');
        dropBox.innerText = this.selectedName;
        dropBox.className = "l2-dropped-text absolute bottom-2 left-2 right-2 py-1.5 bg-cyan-400 text-black text-xs font-bold rounded-lg uppercase shadow-lg";

        if (this.selectedNameEl) {
            this.selectedNameEl.classList.add('opacity-30', 'pointer-events-none');
        }

        this.selectedName = null;
        this.selectedNameEl = null;
    },

    checkAnswers() {
        if (!this.timerId) return;
        let correctCount = 0;
        let total = this.planets.length;

        this.planets.forEach(planet => {
            if (this.assignments[planet.id] === planet.name) {
                correctCount++;
            }
        });

        if (correctCount === total) {
            this.cleanup();
            SoundManager.play('win');
            GameFeedback.show('correct', GameState.practiceMode ? 'Latihan selesai!' : 'Misi berhasil!');
            const durationSec = Math.floor((new Date() - this.startTime) / 1000);
            const durationStr = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
            GameState.currentLevel = 2;
            GameState.completeLevel(2, {
                score: 20,
                accuracy: 100,
                duration: durationStr
            });
        } else {
            SoundManager.play('incorrect');
            GameFeedback.show('wrong', `${correctCount} dari ${total} benar`);
            Dialog.alert(`Skor: ${correctCount} / ${total} Benar. Ayo susun kembali dengan benar!`);
            this.init();
        }
    }
};
