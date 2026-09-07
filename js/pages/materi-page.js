/* ===================================================
   materi-page.js — Logika Halaman Ensiklopedia Materi
   =================================================== */

const MateriPage = {
    currentIndex: 0,

    init() {
        this.renderMenu();
        this.show(0);
    },

    renderMenu() {
        const menuList = document.getElementById('materi-menu-list');
        menuList.innerHTML = DATABASE_MATERI.map((m, idx) => `
        <button onclick="MateriPage.show(${idx})" id="btn-materi-item-${idx}"
            class="w-36 md:w-full shrink-0 text-left px-3 py-2 md:px-4 md:py-3 bg-white/5 hover:bg-cyan-500/10 rounded-xl text-[10px] md:text-xs font-semibold flex items-center gap-2 md:gap-3 transition-all border border-transparent">
            <img src="${m.gambar}" alt="${m.judul}" class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover planet-thumb" onerror="this.src='${ASSETS.placeholder}'">
            <span class="truncate">${m.judul}</span>
        </button>
        `).join('');
    },

    show(idx) {
        SoundManager.play('click');
        this.currentIndex = idx;
        const m = DATABASE_MATERI[idx];

        if (!GameState.progress.materiRead.includes(m.id)) {
            GameState.progress.materiRead.push(m.id);
        }

        DATABASE_MATERI.forEach((_, i) => {
            const btn = document.getElementById(`btn-materi-item-${i}`);
            if (btn) {
                if (i === idx) {
                    btn.classList.add('border-cyan-400', 'bg-cyan-500/10');
                } else {
                    btn.classList.remove('border-cyan-400', 'bg-cyan-500/10');
                }
            }
        });

        // Build data table
        let dataTableHTML = '';
        if (m.dataTabel) {
            const keys = Object.keys(m.dataTabel);
            const rows = m.dataTabel[keys[0]].length;
            dataTableHTML = '<div class="data-table-wrapper"><table class="data-table"><thead><tr>';
            keys.forEach(k => { dataTableHTML += `<th>${k}</th>`; });
            dataTableHTML += '</tr></thead><tbody>';
            for (let r = 0; r < rows; r++) {
                dataTableHTML += '<tr>';
                keys.forEach(k => { dataTableHTML += `<td>${m.dataTabel[k][r]}</td>`; });
                dataTableHTML += '</tr>';
            }
            dataTableHTML += '</tbody></table></div>';
        }

        // Build sub-bab
        let subBabHTML = '';
        if (m.subBab && m.subBab.length > 0) {
            subBabHTML = '<h3 class="font-bubble-title text-xl text-yellow-300 mt-6 mb-4">📚 Materi Lengkap</h3>';
            m.subBab.forEach(sb => {
                subBabHTML += `
                <div class="sub-bab-card">
                    <h4>🔭 ${sb.judul}</h4>
                    <p>${sb.isi}</p>
                </div>
                `;
            });
        }

        const container = document.getElementById('materi-content-display');
        container.innerHTML = `
        <div class="scroll-content">
            <div class="flex items-center gap-3 border-b border-cyan-500/10 pb-3 mb-4">
                <img src="${m.gambar}" alt="${m.judul}" class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-cyan-400 planet-thumb shrink-0" onerror="this.src='${ASSETS.placeholder}'">
                <div>
                    <h3 class="font-bold text-base md:text-lg text-cyan-300">${m.judul}</h3>
                    <span class="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold">Sudah dibaca</span>
                </div>
            </div>

            <div class="w-full flex flex-col items-center bg-black/40 p-2 rounded-xl border border-cyan-400/20 mb-4">
                <img src="${m.fotoAsli}" alt="${m.judul} Real" class="rounded-lg max-h-40 md:max-h-48 object-cover w-full shadow-lg game-image" onerror="this.src='${ASSETS.placeholder}'">
                <span class="text-[10px] text-gray-400 mt-1.5 italic">Ilustrasi Tata Surya</span>
            </div>

            <div class="text-xs md:text-sm text-gray-200 leading-relaxed space-y-2">
                ${m.penjelasan.split('\n\n').map(p => `<p>${p}</p>`).join('')}
            </div>

            ${dataTableHTML ? `
            <div class="section-header">
                <h4 class="font-bold text-cyan-300 text-sm">📊 Data Penting</h4>
            </div>
            ${dataTableHTML}
            ` : ''}

            ${subBabHTML}

            <div class="fact-card">
                <h4 class="font-bold text-yellow-300 mb-1">💡 FAKTA MENARIK:</h4>
                <p class="text-gray-300 text-xs">${m.fakta}</p>
            </div>

            <div class="bg-cyan-500/5 border border-cyan-400/20 p-3 rounded-xl text-xs mb-4">
                <h4 class="font-bold text-cyan-300 mb-1">📝 Ringkasan:</h4>
                <p class="text-gray-300">${m.ringkasan}</p>
            </div>

            <div class="flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                <button onclick="MateriPage.prev()" class="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-bold ${idx === 0 ? 'opacity-30 pointer-events-none' : 'hover:bg-white/10'}">◀ Sebelumnya</button>
                <span class="text-xs text-gray-500">${idx + 1} / ${DATABASE_MATERI.length}</span>
                <button onclick="MateriPage.next()" class="px-3 py-1.5 bg-cyan-500 text-black font-bold rounded-lg text-xs ${idx === DATABASE_MATERI.length - 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-cyan-400'}">Berikutnya ▶</button>
            </div>
        </div>
        `;
    },

    next() {
        if (this.currentIndex < DATABASE_MATERI.length - 1) {
            this.show(this.currentIndex + 1);
        }
    },

    prev() {
        if (this.currentIndex > 0) {
            this.show(this.currentIndex - 1);
        }
    }
};
