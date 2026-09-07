/* ===================================================
   level4.js — Logika Kuis Pilihan Ganda (Quiz Adventure)
   =================================================== */

const Level4 = {
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: null,

    init() {
        this.questions = [...DATABASE_QUIZ].sort(() => Math.random() - 0.5);
        this.currentIndex = 0;
        this.score = 0;
        this.startTime = new Date();
        this.showQuestion();
    },

    showQuestion() {
        const q = this.questions[this.currentIndex];
        document.getElementById('l4-count').innerText = `${this.currentIndex + 1} / ${this.questions.length}`;
        document.getElementById('l4-progress-bar').style.width = `${((this.currentIndex + 1) / this.questions.length) * 100}%`;
        document.getElementById('l4-question').innerText = q.question;
        document.getElementById('l4-feedback').classList.add('hidden');

        const imgEl = document.getElementById('l4-question-img');
        if (q.image) {
            imgEl.src = q.image;
            imgEl.classList.remove('hidden');
        } else {
            imgEl.classList.add('hidden');
        }

        const optionsContainer = document.getElementById('l4-options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.style.pointerEvents = 'auto';

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]";
            btn.innerText = opt;
            btn.onclick = () => this.selectAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });
    },

    selectAnswer(selectedOpt, buttonEl) {
        const q = this.questions[this.currentIndex];
        const container = document.getElementById('l4-options-container');
        container.style.pointerEvents = 'none';

        const feedback = document.getElementById('l4-feedback');
        const fbTitle = document.getElementById('l4-feedback-title');
        const fbText = document.getElementById('l4-feedback-text');

        feedback.classList.remove('hidden');

        if (selectedOpt === q.answer) {
            SoundManager.play('correct');
            GameFeedback.show('correct', GameState.practiceMode ? 'Benar!' : 'Benar!');
            buttonEl.className = "w-full text-left p-4 bg-green-500/20 border border-green-500 text-green-300 rounded-2xl text-xs font-bold";
            this.score += 200;
            fbTitle.innerText = `Luar Biasa! 🎉 ${GameState.practiceMode ? '(Latihan)' : ''}`;
            fbTitle.className = "font-bold text-green-400 mb-1";
        } else {
            SoundManager.play('incorrect');
            GameFeedback.show('wrong', 'Kurang tepat');
            buttonEl.className = "w-full text-left p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-2xl text-xs font-bold";
            fbTitle.innerText = "Kurang Tepat! ✘";
            fbTitle.className = "font-bold text-red-400 mb-1";
        }

        fbText.innerText = q.explanation;
    },

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex >= this.questions.length) {
            const durationSec = Math.floor((new Date() - this.startTime) / 1000);
            const durationStr = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
            GameState.currentLevel = 4;
            GameState.completeLevel(4, {
                score: Math.max(1, Math.round((this.score / (this.questions.length * 200)) * 20)),
                accuracy: Math.max(1, Math.floor((this.score / (this.questions.length * 200)) * 100)),
                duration: durationStr
            });
        } else {
            this.showQuestion();
        }
    }
};
