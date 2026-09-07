/* ===================================================
   level1.js — Logika Game Urutan Orbit Planet
   =================================================== */

const Level1 = {
    order: ["Merkurius", "Venus", "Bumi", "Mars", "Jupiter", "Saturnus", "Uranus", "Neptunus"],
    planetData: [
        { name: "Merkurius", r: 35, size: 16, speed: 1.6, key: "Merkurius", img: ASSETS.merkurius },
        { name: "Venus", r: 55, size: 20, speed: 1.3, key: "Venus", img: ASSETS.venus },
        { name: "Bumi", r: 75, size: 22, speed: 1.0, key: "Bumi", img: ASSETS.bumi },
        { name: "Mars", r: 95, size: 18, speed: 0.8, key: "Mars", img: ASSETS.mars },
        { name: "Jupiter", r: 120, size: 30, speed: 0.6, key: "Jupiter", img: ASSETS.jupiter },
        { name: "Saturnus", r: 145, size: 28, speed: 0.45, key: "Saturnus", img: ASSETS.saturnus, hasRings: true },
        { name: "Uranus", r: 170, size: 24, speed: 0.35, key: "Uranus", img: ASSETS.uranus },
        { name: "Neptunus", r: 195, size: 24, speed: 0.25, key: "Neptunus", img: ASSETS.neptunus }
    ],
    targetIndex: 0,
    lives: 3,
    startTime: null,

    init() {
        this.targetIndex = 0;
        this.lives = 3;
        this.startTime = new Date();
        this.updateUI();
        this.renderOrbits();
    },

    updateUI() {
        document.getElementById('l1-lives').innerText = this.lives;
        document.getElementById('l1-target-text').innerText = this.order[this.targetIndex];
    },

    renderOrbits() {
        const container = document.getElementById('l1-orbit-container');
        const paths = container.querySelectorAll('.orbit-line, .orbit-wrapper');
        paths.forEach(el => el.remove());

        // Hitung scale factor agar orbit muat dalam container
        const containerSize = Math.min(container.clientWidth, container.clientHeight);
        const maxOrbitR = 195; // radius orbit terluar (Neptunus)
        const scale = containerSize > 0 ? Math.min(1, (containerSize / 2 - 24) / maxOrbitR) : 1;

        this.planetData.forEach((planet) => {
            const scaledR = Math.round(planet.r * scale);
            const scaledSize = Math.max(10, Math.round(planet.size * scale));

            const orbit = document.createElement('div');
            orbit.className = "orbit-line";
            orbit.style.width = `${scaledR * 2}px`;
            orbit.style.height = `${scaledR * 2}px`;
            container.appendChild(orbit);

            const wrapper = document.createElement('div');
            wrapper.className = "orbit-wrapper pointer-events-none";
            wrapper.style.width = `${scaledR * 2}px`;
            wrapper.style.height = `${scaledR * 2}px`;
            wrapper.style.top = "50%";
            wrapper.style.left = "50%";
            wrapper.style.transform = "translate(-50%, -50%)";
            
            const duration = 16 / planet.speed;
            wrapper.style.animation = `rotate-orbit ${duration}s linear infinite`;
            
            const planetEl = document.createElement('div');
            planetEl.className = "absolute rounded-full pointer-events-auto cursor-pointer transition-transform active:scale-125 select-none shadow-lg";
            planetEl.style.width = `${scaledSize}px`;
            planetEl.style.height = `${scaledSize}px`;
            planetEl.style.top = "0px";
            planetEl.style.left = "50%";
            planetEl.style.transform = "translate(-50%, -50%)";
            planetEl.style.backgroundImage = `url('${planet.img}')`;
            planetEl.style.backgroundSize = "cover";
            planetEl.style.backgroundPosition = "center";
            planetEl.style.border = "1.5px solid rgba(255,255,255,0.4)";

            if (planet.hasRings) {
                const ring = document.createElement('div');
                ring.className = "absolute pointer-events-none";
                ring.style.width = `${scaledSize * 1.8}px`;
                ring.style.height = `${scaledSize * 0.6}px`;
                ring.style.border = "2px solid rgba(236, 199, 149, 0.7)";
                ring.style.borderRadius = "50%";
                ring.style.transform = "rotate(-15deg)";
                ring.style.top = "50%";
                ring.style.left = "50%";
                ring.style.marginTop = `-${scaledSize * 0.3}px`;
                ring.style.marginLeft = `-${scaledSize * 0.9}px`;
                planetEl.appendChild(ring);
            }
            
            if (scale > 0.6) {
                planetEl.innerHTML += `<span class="absolute text-[7px] font-bold text-gray-300 top-full mt-0.5 bg-black/60 px-0.5 rounded uppercase tracking-wider whitespace-nowrap">${planet.name.substring(0,3)}</span>`;
            }

            planetEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.planetClicked(planet.name, planetEl, orbit);
            });

            wrapper.appendChild(planetEl);
            container.appendChild(wrapper);
        });
    },

    planetClicked(name, element, orbitElement) {
        const targetName = this.order[this.targetIndex];
        
        if (name === targetName) {
            SoundManager.play('correct');
            GameFeedback.show('correct', GameState.practiceMode ? 'Benar! Mode latihan' : 'Benar!');
            this.targetIndex++;

            element.style.transform = "translate(-50%, -50%) scale(1.4)";
            orbitElement.style.borderColor = "#00f0ff";
            orbitElement.style.borderWidth = "2px";
            
            if (this.targetIndex >= this.order.length) {
                const durationSec = Math.floor((new Date() - this.startTime) / 1000);
                const durationStr = `${Math.floor(durationSec/60)}m ${durationSec%60}s`;
                GameState.currentLevel = 1;
                GameState.completeLevel(1, {
                    score: Math.max(1, Math.round((8 / (8 + (3 - this.lives))) * 20)),
                    accuracy: Math.max(1, Math.floor((8 / (8 + (3 - this.lives))) * 100)),
                    duration: durationStr
                });
            } else {
                this.updateUI();
            }
        } else {
            SoundManager.play('incorrect');
            GameFeedback.show('wrong', 'Urutan belum tepat');
            this.lives--;
            
            element.classList.add('shake-effect');
            setTimeout(() => element.classList.remove('shake-effect'), 400);

            if (this.lives <= 0) {
                Dialog.alert("Misi gagal! Energi penjelajah habis. Ayo ulangi kembali.", () => {
                    this.init();
                });
            } else {
                this.updateUI();
            }
        }
    }
};
