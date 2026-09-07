/* ===================================================
   level5.js — Logika Game Mission Space
   =================================================== */

const Level5 = {
    canvas: null,
    ctx: null,
    spaceship: { x: 275, y: 370, w: 50, h: 50, speed: 12 },
    stars: [],
    starCollectedCount: 0,
    gameActive: false,
    keys: {},
    questions: [],
    currentStarQuestion: null,
    startTime: null,
    answerAttempts: 0,
    keyDownHandler: null,
    keyUpHandler: null,
    stopMoveHandler: null,

    init() {
        this.canvas = document.getElementById('l5-game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starCollectedCount = 0;
        this.gameActive = true;
        this.questions = [...DATABASE_QUIZ].sort(() => Math.random() - 0.5);
        this.startTime = new Date();
        this.answerAttempts = 0;
        this.keys = {};

        // Pastikan canvas internal selalu 600x450 (koordinat game)
        // Display size dikontrol CSS (responsive), tapi drawing space tetap
        this.canvas.width = 600;
        this.canvas.height = 450;

        // Posisi awal pesawat di tengah bawah
        this.spaceship.x = (this.canvas.width - this.spaceship.w) / 2;
        this.spaceship.y = this.canvas.height - this.spaceship.h - 20;

        this.updateUI();

        if (this.keyDownHandler) window.removeEventListener('keydown', this.keyDownHandler);
        if (this.keyUpHandler) window.removeEventListener('keyup', this.keyUpHandler);
        this.keyDownHandler = (e) => this.keys[e.key] = true;
        this.keyUpHandler = (e) => this.keys[e.key] = false;
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);

        const btnLeft = document.getElementById('btn-move-left');
        const btnRight = document.getElementById('btn-move-right');
        
        let touchMoveInterval = null;
        if (this.stopMoveHandler) {
            window.removeEventListener('mouseup', this.stopMoveHandler);
            window.removeEventListener('touchend', this.stopMoveHandler);
        }
        btnLeft.onmousedown = btnLeft.ontouchstart = (e) => {
            e.preventDefault();
            if(touchMoveInterval) clearInterval(touchMoveInterval);
            touchMoveInterval = setInterval(() => { this.spaceship.x = Math.max(0, this.spaceship.x - 16); }, 40);
        };
        btnRight.onmousedown = btnRight.ontouchstart = (e) => {
            e.preventDefault();
            if(touchMoveInterval) clearInterval(touchMoveInterval);
            touchMoveInterval = setInterval(() => { this.spaceship.x = Math.min(this.canvas.width - this.spaceship.w, this.spaceship.x + 16); }, 40);
        };
        btnLeft.onmouseup = btnLeft.ontouchend = btnRight.onmouseup = btnRight.ontouchend = () => {
            clearInterval(touchMoveInterval);
        };
        this.stopMoveHandler = () => {
            clearInterval(touchMoveInterval);
        };
        window.addEventListener('mouseup', this.stopMoveHandler);
        window.addEventListener('touchend', this.stopMoveHandler);

        this.loop();
    },

    cleanup() {
        this.gameActive = false;
        if (this.keyDownHandler) window.removeEventListener('keydown', this.keyDownHandler);
        if (this.keyUpHandler) window.removeEventListener('keyup', this.keyUpHandler);
        if (this.stopMoveHandler) {
            window.removeEventListener('mouseup', this.stopMoveHandler);
            window.removeEventListener('touchend', this.stopMoveHandler);
        }
        this.keyDownHandler = null;
        this.keyUpHandler = null;
        this.stopMoveHandler = null;
        this.keys = {};
    },

    updateUI() {
        document.getElementById('l5-star-count').innerText = `⭐ ${this.starCollectedCount} / 5`;
    },

    spawnStar() {
        if (this.stars.length < 2 && Math.random() < 0.02) {
            this.stars.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                w: 30,
                h: 30,
                speed: 2 + Math.random() * 2
            });
        }
    },

    loop() {
        if (!this.gameActive) return;

        const ctx = this.ctx;
        const canvas = this.canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#051329";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.keys['ArrowLeft']) this.spaceship.x = Math.max(0, this.spaceship.x - this.spaceship.speed);
        if (this.keys['ArrowRight']) this.spaceship.x = Math.min(canvas.width - this.spaceship.w, this.spaceship.x + this.spaceship.speed);

        ctx.save();
        ctx.translate(this.spaceship.x + this.spaceship.w/2, this.spaceship.y + this.spaceship.h/2);
        ctx.fillStyle = Math.random() < 0.5 ? "#f97316" : "#ef4444";
        ctx.beginPath();
        ctx.moveTo(-12, 20);
        ctx.lineTo(0, 38);
        ctx.lineTo(12, 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(18, 20);
        ctx.lineTo(-18, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#e0f7fa";
        ctx.beginPath();
        ctx.arc(0, -2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.spawnStar();
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const s = this.stars[i];
            s.y += s.speed;

            ctx.save();
            ctx.fillStyle = "#ffd54f";
            ctx.shadowColor = "#ffd54f";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(s.x + s.w/2, s.y + s.h/2, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (s.x < this.spaceship.x + this.spaceship.w &&
                s.x + s.w > this.spaceship.x &&
                s.y < this.spaceship.y + this.spaceship.h &&
                s.y + s.h > this.spaceship.y) {
                
                this.stars.splice(i, 1);
                this.triggerChallenge();
                continue;
            }

            if (s.y > canvas.height) {
                this.stars.splice(i, 1);
            }
        }

        window.missionGameLoopId = requestAnimationFrame(() => this.loop());
    },

    triggerChallenge() {
        this.gameActive = false;
        this.currentStarQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        
        const overlay = document.getElementById('l5-question-overlay');
        const qText = document.getElementById('l5-question');
        const optionsBox = document.getElementById('l5-options');
        const fbText = document.getElementById('l5-feedback');
        const imgEl = document.getElementById('l5-question-img');

        qText.innerText = this.currentStarQuestion.question;
        fbText.classList.add('hidden');
        optionsBox.innerHTML = '';

        // Tampilkan gambar jika ada
        if (imgEl) {
            if (this.currentStarQuestion.image) {
                imgEl.src = this.currentStarQuestion.image;
                imgEl.classList.remove('hidden');
            } else {
                imgEl.classList.add('hidden');
            }
        }

        this.currentStarQuestion.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "w-full py-2.5 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-xl text-xs font-bold transition-all";
            btn.innerText = opt;
            btn.onclick = () => this.submitAnswer(opt, btn);
            optionsBox.appendChild(btn);
        });

        overlay.classList.remove('hidden');
    },

    submitAnswer(opt, buttonEl) {
        const fbText = document.getElementById('l5-feedback');
        fbText.classList.remove('hidden');
        this.answerAttempts++;
        
        document.getElementById('l5-options').style.pointerEvents = 'none';

        if (opt === this.currentStarQuestion.answer) {
            SoundManager.play('correct');
            GameFeedback.show('correct', GameState.practiceMode ? 'Bintang latihan!' : 'Bintang dikumpulkan!');
            buttonEl.className = "w-full py-2.5 bg-green-500/20 border border-green-500 text-green-300 rounded-xl text-xs font-bold";
            this.starCollectedCount++;
            this.updateUI();
            fbText.innerHTML = `<span class="text-green-400 font-bold">Benar! Bintang dikumpulkan ${GameState.practiceMode ? '(Latihan)' : ''}</span>`;
        } else {
            SoundManager.play('incorrect');
            GameFeedback.show('wrong', 'Bintang melayang pergi');
            buttonEl.className = "w-full py-2.5 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-xs font-bold";
            fbText.innerHTML = `<span class="text-red-400 font-bold">Salah! Bintang melayang pergi...</span>`;
        }

        setTimeout(() => {
            document.getElementById('l5-options').style.pointerEvents = 'auto';
            document.getElementById('l5-question-overlay').classList.add('hidden');
            
            if (this.starCollectedCount >= 5) {
                const durationSec = Math.floor((new Date() - this.startTime) / 1000);
                const durationStr = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
                GameState.currentLevel = 5;
                GameState.completeLevel(5, {
                    score: Math.max(1, Math.round((this.starCollectedCount / Math.max(1, this.answerAttempts)) * 20)),
                    accuracy: Math.max(1, Math.floor((this.starCollectedCount / Math.max(1, this.answerAttempts)) * 100)),
                    duration: durationStr
                });
            } else {
                this.gameActive = true;
                this.loop();
            }
        }, 2500);
    }
};
