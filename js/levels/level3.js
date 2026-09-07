/* ===================================================
   level3.js — Logika Kuis Benar atau Salah
   =================================================== */

const Level3 = {
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: null,
    timerId: null,
    timeLeft: 20,

    init() {
        this.questions = [...DATABASE_TRUE_FALSE].sort(() => Math.random() - 0.5);
        this.currentIndex = 0;
        this.score = 0;
        this.startTime = new Date();
        this.showQuestion();
    },

    cleanup() {
        clearInterval(this.timerId);
        this.timerId = null;
    },

    startTimer() {
        this.cleanup();
        this.timeLeft = 20;
        const timer = document.getElementById('l3-timer');
        const update = () => {
            if (timer) timer.innerText = `00:${String(this.timeLeft).padStart(2, '0')}`;
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
        Dialog.alert("Waktu menjawab habis. Misi Level 3 gagal.", () => Router.go('home'));
    },

    showQuestion() {
        const q = this.questions[this.currentIndex];
        document.getElementById('l3-progress').innerText = `${this.currentIndex + 1} / ${this.questions.length}`;
        document.getElementById('l3-progress-bar').style.width = `${((this.currentIndex + 1) / this.questions.length) * 100}%`;
        document.getElementById('l3-statement').innerText = q.question;
        document.getElementById('l3-feedback').classList.add('hidden');
        this.startTimer();

        // Tampilkan gambar jika ada
        let imgContainer = document.getElementById('l3-question-img-wrap');
        if (q.image) {
            if (!imgContainer) {
                imgContainer = document.createElement('div');
                imgContainer.id = 'l3-question-img-wrap';
                imgContainer.className = 'flex justify-center mb-4';
                const cardBox = document.getElementById('l3-card-box');
                cardBox.insertBefore(imgContainer, cardBox.firstChild);
            }
            imgContainer.innerHTML = `<img src="${q.image}" alt="Ilustrasi soal"
                class="h-28 md:h-36 object-contain rounded-xl border border-cyan-500/20 shadow-lg opacity-0 transition-opacity duration-500"
                onload="this.classList.remove('opacity-0')"
                onerror="this.parentElement.style.display='none'">`;
            imgContainer.style.display = 'flex';
        } else if (imgContainer) {
            imgContainer.style.display = 'none';
        }
    },

    answer(userAnswer) {
        const q = this.questions[this.currentIndex];
        if (!this.timerId) return;
        this.cleanup();
        const fb = document.getElementById('l3-feedback');
        fb.classList.remove('hidden');
        
        if (userAnswer === q.answer) {
            SoundManager.play('correct');
            GameFeedback.show('correct', GameState.practiceMode ? 'Benar!' : 'Benar!');
            this.score += 100;
            fb.innerHTML = `
                <div class="text-green-400 font-bold text-sm mb-1">BENAR! 🎉 ${GameState.practiceMode ? '(Latihan)' : ''}</div>
                <p class="text-xs text-gray-300">${q.explanation}</p>
            `;
        } else {
            SoundManager.play('incorrect');
            GameFeedback.show('wrong', 'Belum tepat');
            fb.innerHTML = `
                <div class="text-red-400 font-bold text-sm mb-1">SALAH! ✘</div>
                <p class="text-xs text-gray-300">${q.explanation}</p>
            `;
        }

        document.getElementById('l3-card-box').style.pointerEvents = 'none';
        setTimeout(() => {
            document.getElementById('l3-card-box').style.pointerEvents = 'auto';
            this.nextQuestion();
        }, 3000);
    },

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex >= this.questions.length) {
            const durationSec = Math.floor((new Date() - this.startTime) / 1000);
            const durationStr = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
            GameState.currentLevel = 3;
            this.cleanup();
            GameState.completeLevel(3, {
                score: Math.max(1, Math.round((this.score / (this.questions.length * 100)) * 20)),
                accuracy: Math.max(1, Math.floor((this.score / (this.questions.length * 100)) * 100)),
                duration: durationStr
            });
        } else {
            this.showQuestion();
        }
    }
};
