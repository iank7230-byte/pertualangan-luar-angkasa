/* ===================================================
   ar-page.js — AR 3D Solar System Explorer (Enhanced)
   =================================================== */

const ARPage = {
  activePlanet: "matahari",
  activeTab: "overview",
  autoRotate: true,
  envLight: false,

  // Warna unik per planet untuk UI
  planetColors: {
    matahari:  { accent: "#FFD700", glow: "rgba(255,215,0,0.3)",   type: "Bintang" },
    merkurius: { accent: "#A0A0A0", glow: "rgba(160,160,160,0.2)", type: "Terestrial" },
    venus:     { accent: "#E8C46A", glow: "rgba(232,196,106,0.3)", type: "Terestrial" },
    bumi:      { accent: "#4FC3F7", glow: "rgba(79,195,247,0.3)",  type: "Terestrial" },
    mars:      { accent: "#EF5350", glow: "rgba(239,83,80,0.3)",   type: "Terestrial" },
    jupiter:   { accent: "#FF8A65", glow: "rgba(255,138,101,0.3)", type: "Gas Giant" },
    saturnus:  { accent: "#FFF176", glow: "rgba(255,241,118,0.3)", type: "Gas Giant" },
    uranus:    { accent: "#80DEEA", glow: "rgba(128,222,234,0.3)", type: "Ice Giant" },
    neptunus:  { accent: "#5C6BC0", glow: "rgba(92,107,192,0.3)",  type: "Ice Giant" },
  },

  // Ukuran relatif terhadap Bumi (Bumi = 1)
  relativeSize: {
    matahari: 109, merkurius: 0.38, venus: 0.95, bumi: 1,
    mars: 0.53, jupiter: 11.2, saturnus: 9.45, uranus: 4.0,
    neptunus: 3.88,
  },

  // Suhu permukaan (°C) — bipolar bar
  surfaceTemp: {
    matahari: 5500, merkurius: 125, venus: 460, bumi: 15,
    mars: -63, jupiter: -110, saturnus: -140, uranus: -195,
    neptunus: -200,
  },

  // Jumlah satelit
  moonCount: {
    matahari: 8, merkurius: 0, venus: 0, bumi: 1,
    mars: 2, jupiter: 95, saturnus: 146, uranus: 27,
    neptunus: 16,
  },

  // Default orbit untuk reset view (seluruh model terlihat)
  defaultOrbit: "45deg 80deg auto",

  objectAliases: {
    matahari: ["matahari", "sun"],
    merkurius: ["merkurius", "mercury"],
    venus: ["venus"],
    bumi: ["bumi", "earth"],
    mars: ["mars"],
    jupiter: ["jupiter"],
    saturnus: ["saturnus", "saturn"],
    uranus: ["uranus"],
    neptunus: ["neptunus", "neptune"],
  },

  // Misi luar angkasa per planet
  missions: {
    matahari:  ["Parker Solar Probe (2018)", "SOHO (1995)", "Solar Orbiter (2020)"],
    merkurius: ["Mariner 10 (1974)", "MESSENGER (2011)", "BepiColombo (2025)"],
    venus:     ["Venera 7 (1970)", "Magellan (1990)", "DAVINCI+ (2031)"],
    bumi:      ["Ribuan satelit aktif", "ISS (sejak 2000)", "GPS Constellation"],
    mars:      ["Perseverance (2021)", "Curiosity (2012)", "Ingenuity Helicopter"],
    jupiter:   ["Voyager 1&2 (1979)", "Galileo (1995)", "Juno (2016)"],
    saturnus:  ["Cassini-Huygens (2004)", "Voyager 1&2 (1980)", "Dragonfly (2034)"],
    uranus:    ["Voyager 2 (1986)", "Uranus Orbiter (2030s, direncanakan)"],
    neptunus:  ["Voyager 2 (1989)", "Neptune Odyssey (direncanakan)"],
    gerhana:   ["SOHO (pemantau korona)", "STEREO A&B", "Solar Dynamics Obs."],
    benda_lain:["OSIRIS-REx (Bennu)", "Hayabusa2 (Ryugu)", "Rosetta (Komet 67P)"],
  },

  init() {
    this.activeTab = "overview";
    this.autoRotate = true;
    this._autoRotateTimer = null;
    this.renderTabs();
    this.selectPlanet("matahari");
    this._initControlButtons();
    this._initViewerInteractionListeners();
  },

  goBack() {
    SoundManager.play("click");
    Router.go("home");
  },

  stopCamera() {},

  // ── Inisialisasi tombol kontrol ─────────────────────
  _initControlButtons() {
    const rotateBtn = document.getElementById("ar-btn-rotate");
    const resetBtn  = document.getElementById("ar-btn-reset");
    const lightBtn  = document.getElementById("ar-btn-light");
    const fullBtn   = document.getElementById("ar-btn-fullscreen");
    const viewer    = document.getElementById("solar-system-3d");

    if (rotateBtn) {
      rotateBtn.onclick = () => {
        this.autoRotate = !this.autoRotate;
        if (viewer) {
          if (this.autoRotate) {
            viewer.setAttribute("auto-rotate", "");
          } else {
            viewer.removeAttribute("auto-rotate");
          }
        }
        rotateBtn.querySelector(".rotate-icon").style.animationPlayState =
          this.autoRotate ? "running" : "paused";
        rotateBtn.querySelector(".rotate-label").innerText =
          this.autoRotate ? "Auto" : "Diam";
        SoundManager.play("click");
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        const viewer = document.getElementById("solar-system-3d");
        if (viewer) {
          // Reset ke view default — tampilkan seluruh model
          viewer.setAttribute("camera-target", "0m 0m 0m");
          viewer.setAttribute("camera-orbit", this.defaultOrbit);
        }
        SoundManager.play("click");
      };
    }

    if (lightBtn) {
      lightBtn.onclick = () => {
        this.envLight = !this.envLight;
        if (viewer) {
          viewer.setAttribute("exposure", this.envLight ? "2" : "1");
          viewer.setAttribute("shadow-intensity", this.envLight ? "0" : "1.5");
        }
        lightBtn.querySelector(".light-label").innerText = this.envLight ? "Terang" : "Gelap";
        lightBtn.classList.toggle("border-yellow-400/50", this.envLight);
        lightBtn.classList.toggle("text-yellow-300", this.envLight);
        SoundManager.play("click");
      };
    }

    if (fullBtn) {
      fullBtn.onclick = () => {
        const container = document.getElementById("ar-viewer-wrap");
        if (container) {
          if (!document.fullscreenElement) {
            container.requestFullscreen && container.requestFullscreen();
          } else {
            document.exitFullscreen && document.exitFullscreen();
          }
        }
        SoundManager.play("click");
      };
    }
  },

  // ── Listener interaksi viewer: pause auto-rotate saat drag ──
  _initViewerInteractionListeners() {
    const viewer = document.getElementById("solar-system-3d");
    if (!viewer) return;

    const pauseRotate = () => {
      if (!this.autoRotate) return;
      viewer.removeAttribute("auto-rotate");
      clearTimeout(this._autoRotateTimer);
      // Lanjutkan auto-rotate setelah 3 detik idle
      this._autoRotateTimer = setTimeout(() => {
        if (this.autoRotate) viewer.setAttribute("auto-rotate", "");
      }, 3000);
    };

    // Touch
    viewer.addEventListener("touchstart", pauseRotate, { passive: true });
    // Mouse
    viewer.addEventListener("mousedown", pauseRotate);
    // model-viewer custom event saat user interact
    viewer.addEventListener("camera-change", () => {
      if (viewer.interactionPrompt === "none") return;
    });
    viewer.addEventListener("load", () => this._focusObject(this.activePlanet));
  },

  // ── Render tab selector planet ───────────────────────
  renderTabs() {
    const container = document.getElementById("planet-selector-scroll");
    if (!container) return;
    const items = DATABASE_MATERI.filter(
      (m) => m.id !== "pengertian" && !["gerhana", "benda_lain"].includes(m.id),
    );
    container.innerHTML = items.map((m) => {
      const c = this.planetColors[m.id] || { accent: "#00d4ff" };
      return `
        <button onclick="ARPage.selectPlanet('${m.id}')" id="tab-ar-${m.id}"
            class="ar-planet-tab flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border transition-all duration-200 shrink-0 bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10">
            <span class="w-2 h-2 rounded-full shrink-0" style="background:${c.accent}"></span>
            ${m.judul.split(" ")[0]}
        </button>`;
    }).join("");
  },

  // ── Pilih planet & update semua UI ──────────────────
  selectPlanet(id) {
    SoundManager.play("click");
    this.activePlanet = id;
    const m = DATABASE_MATERI.find((item) => item.id === id);
    if (!m) return;

    const col = this.planetColors[id] || { accent: "#00d4ff", glow: "rgba(0,212,255,0.2)", type: "Objek" };

    // Update tab aktif
    DATABASE_MATERI.forEach((item) => {
      const btn = document.getElementById(`tab-ar-${item.id}`);
      if (!btn) return;
      const c = this.planetColors[item.id] || { accent: "#00d4ff" };
      if (item.id === id) {
        btn.style.borderColor = c.accent;
        btn.style.color = c.accent;
        btn.style.background = c.glow;
      } else {
        btn.style.borderColor = "";
        btn.style.color = "";
        btn.style.background = "";
      }
    });

    this._focusObject(id);

    // Update HUD overlay
    this._updateHUD(id, m, col);

    // Update glow border viewer
    const viewerWrap = document.getElementById("ar-viewer-wrap");
    if (viewerWrap) {
      viewerWrap.style.boxShadow = `0 0 40px ${col.glow}, inset 0 0 40px rgba(0,0,0,0.3)`;
      viewerWrap.style.borderColor = col.accent + "30";
    }

    // Render info panel dengan tab aktif
    this.activeTab = "overview";
    this._renderInfoPanel(m, col);
  },

  _focusObject(id) {
    const viewer = document.getElementById("solar-system-3d");
    if (!viewer) return;

    if (!viewer.loaded) {
      return;
    }

    const aliases = this.objectAliases[id] || [id];
    const normalizedAliases = aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, ""));
    let selectedNode = null;
    const scene = viewer.model && viewer.model.scene;

    if (scene && typeof scene.traverse === "function") {
      scene.traverse((node) => {
        if (selectedNode || !node.name) return;
        const nodeName = node.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normalizedAliases.some((alias) => nodeName === alias || nodeName.includes(alias))) {
          selectedNode = node;
        }
      });
    }

    if (!selectedNode || typeof selectedNode.getWorldPosition !== "function") {
      viewer.setAttribute("camera-target", "0m 0m 0m");
      viewer.setAttribute("camera-orbit", "0deg 75deg auto");
      return;
    }

    const target = selectedNode.position.clone();
    selectedNode.getWorldPosition(target);
    const radius = selectedNode.geometry?.boundingSphere?.radius || 0.1;
    const distance = Math.max(radius * 4, 0.15);

    viewer.setAttribute(
      "camera-target",
      `${target.x}m ${target.y}m ${target.z}m`,
    );
    viewer.setAttribute("camera-orbit", `0deg 75deg ${distance}m`);
  },

  // ── Update HUD di viewer ─────────────────────────────
  _updateHUD(id, m, col) {
    const badge = document.getElementById("ar-hud-planet-name");
    const typeBadge = document.getElementById("ar-hud-planet-type");
    const orbitBadge = document.getElementById("ar-hud-orbit");

    const idx = DATABASE_MATERI.filter(x => x.id !== "pengertian")
                                .findIndex(x => x.id === id);
    const pos = ["Matahari","Planet 1","Planet 2","Planet 3","Planet 4",
                 "Planet 5","Planet 6","Planet 7","Planet 8",
                 "Fenomena","Benda Kecil"];

    if (badge) {
      badge.innerText = m.judul.split(" - ")[0].split(" (")[0];
      badge.style.color = col.accent;
      badge.style.borderColor = col.accent + "40";
    }
    if (typeBadge) {
      typeBadge.innerText = col.type;
      typeBadge.style.background = col.glow;
    }
    if (orbitBadge) {
      const data = m.dataTabel;
      const keys = Object.keys(data);
      const periodIdx = data[keys[0]].findIndex(v =>
        typeof v === "string" && v.toLowerCase().includes("orbit")
      );
      orbitBadge.innerText = periodIdx >= 0
        ? "⏱ " + data[keys[1]][periodIdx]
        : "⏱ —";
    }
  },

  // ── Render panel informasi dengan tab ───────────────
  _renderInfoPanel(m, col) {
    const panel = document.getElementById("planet-info-panel");
    if (!panel) return;

    const tabs = [
      { id: "overview",  label: "Overview",   icon: "🪐" },
      { id: "stats",     label: "Data Fisik", icon: "📊" },
      { id: "facts",     label: "Fakta",      icon: "💡" },
      { id: "mission",   label: "Misi",       icon: "🚀" },
    ];

    const tabNav = tabs.map(t => `
      <button onclick="ARPage.switchTab('${t.id}')" id="info-tab-${t.id}"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all
                 ${this.activeTab === t.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}">
          <span>${t.icon}</span><span>${t.label}</span>
      </button>`).join("");

    panel.innerHTML = `
      <!-- Tab Nav -->
      <div class="flex gap-1 bg-white/5 rounded-xl p-1 mb-3" style="border: 1px solid ${col.accent}20">
        ${tabNav}
      </div>
      <!-- Planet Title -->
      <div class="mb-3 pb-2 border-b" style="border-color: ${col.accent}25">
        <span class="text-[9px] font-bold uppercase tracking-wider" style="color:${col.accent}">
          ${this.planetColors[this.activePlanet]?.type || "Objek"}
        </span>
        <h3 class="font-bubble-title text-base leading-tight text-white mt-0.5">${m.judul}</h3>
      </div>
      <!-- Tab Content -->
      <div id="info-tab-content" class="space-y-3">
        ${this._getTabContent(this.activeTab, m, col)}
      </div>
      <!-- Action Buttons -->
      <div class="pt-3 mt-3 border-t flex gap-2" style="border-color: ${col.accent}20">
        <button onclick="ARPage.goBack()" class="w-full py-2 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            ← Home
        </button>
      </div>
    `;

    // Update tab aktif visual
    this._highlightActiveTab(col);
  },

  // ── Highlight tab nav aktif ──────────────────────────
  _highlightActiveTab(col) {
    ["overview","stats","facts","mission"].forEach(t => {
      const btn = document.getElementById(`info-tab-${t}`);
      if (!btn) return;
      if (t === this.activeTab) {
        btn.style.background = col.glow;
        btn.style.color = col.accent;
      } else {
        btn.style.background = "";
        btn.style.color = "";
      }
    });
  },

  // ── Switch tab tanpa re-render seluruh panel ─────────
  switchTab(tabId) {
    SoundManager.play("click");
    this.activeTab = tabId;
    const m = DATABASE_MATERI.find(x => x.id === this.activePlanet);
    if (!m) return;
    const col = this.planetColors[this.activePlanet] || { accent: "#00d4ff", glow: "rgba(0,212,255,0.2)" };

    const content = document.getElementById("info-tab-content");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(6px)";
      setTimeout(() => {
        content.innerHTML = this._getTabContent(tabId, m, col);
        content.style.transition = "all 0.25s ease";
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      }, 150);
    }
    this._highlightActiveTab(col);
  },

  // ── Konten per tab ───────────────────────────────────
  _getTabContent(tab, m, col) {
    switch (tab) {
      case "overview": return this._tabOverview(m, col);
      case "stats":    return this._tabStats(m, col);
      case "facts":    return this._tabFacts(m, col);
      case "mission":  return this._tabMission(m, col);
      default:         return this._tabOverview(m, col);
    }
  },

  _tabOverview(m, col) {
    const moons = this.moonCount[this.activePlanet];
    return `
      <div class="bg-white/3 border rounded-xl p-3 text-[11px] text-gray-300 leading-relaxed" style="border-color:${col.accent}15">
        <p>${m.ringkasan}</p>
      </div>
      <div class="text-[10.5px] text-gray-400 leading-relaxed">
        <p>${m.penjelasan.split("\n\n")[0].substring(0, 280)}...</p>
      </div>
      ${moons !== undefined ? `
      <div class="flex items-center gap-2 bg-white/3 rounded-xl p-2.5 border border-white/5">
        <span class="text-xl">🌙</span>
        <div>
          <span class="text-[9px] text-gray-500 block">Jumlah Satelit</span>
          <span class="font-bold text-sm" style="color:${col.accent}">${moons}</span>
        </div>
      </div>` : ""}
    `;
  },

  _tabStats(m, col) {
    const keys = Object.keys(m.dataTabel);
    const col0 = m.dataTabel[keys[0]];
    const col1 = m.dataTabel[keys[1]];

    const relSize = this.relativeSize[this.activePlanet] || 1;
    const maxSize = 109; // Matahari
    const sizePercent = Math.min(100, (Math.log10(relSize + 1) / Math.log10(maxSize + 1)) * 100);

    const temp = this.surfaceTemp[this.activePlanet];
    let tempBar = "";
    if (temp !== null && temp !== undefined) {
      const normalized = Math.min(100, Math.max(0, ((temp + 230) / (5730)) * 100));
      const tempColor = temp < 0 ? "#80DEEA" : temp > 300 ? "#FF5252" : "#FFD740";
      tempBar = `
        <div class="bg-white/3 border border-white/5 rounded-xl p-3">
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-[9px] text-gray-500 uppercase tracking-wider">Suhu Permukaan</span>
            <span class="text-[10px] font-bold" style="color:${tempColor}">${temp > 0 ? "+" : ""}${temp}°C</span>
          </div>
          <div class="h-2 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700"
                 style="width:${normalized}%; background: linear-gradient(to right, #80DEEA, ${tempColor})">
            </div>
          </div>
        </div>`;
    }

    const rows = col0.slice(0, 5).map((k, i) => `
      <div class="flex justify-between items-start py-1.5 border-b border-white/4 last:border-0">
        <span class="text-[10px] text-gray-500">${k}</span>
        <span class="text-[10px] font-semibold text-gray-200 text-right max-w-[55%]">${col1[i]}</span>
      </div>`).join("");

    return `
      <div class="bg-white/3 border border-white/5 rounded-xl p-3">
        <div class="flex justify-between items-center mb-1.5">
          <span class="text-[9px] text-gray-500 uppercase tracking-wider">Ukuran Relatif</span>
          <span class="text-[10px] font-bold" style="color:${col.accent}">${relSize}× Bumi</span>
        </div>
        <div class="h-2 bg-white/5 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700"
               style="width:${sizePercent.toFixed(1)}%; background: linear-gradient(to right, ${col.accent}88, ${col.accent})">
          </div>
        </div>
      </div>
      ${tempBar}
      <div class="bg-white/3 border border-white/5 rounded-xl p-3 divide-y divide-white/4">
        ${rows}
      </div>
    `;
  },

  _tabFacts(m, col) {
    const subBab = m.subBab || [];
    const subHTML = subBab.map((s, i) => `
      <details class="bg-white/3 border rounded-xl overflow-hidden group" style="border-color:${col.accent}20">
        <summary class="flex items-center justify-between p-3 cursor-pointer list-none select-none">
          <span class="text-[10px] font-bold" style="color:${col.accent}">${s.judul}</span>
          <span class="text-gray-500 text-xs group-open:rotate-180 transition-transform duration-200">▾</span>
        </summary>
        <div class="px-3 pb-3 text-[10px] text-gray-400 leading-relaxed border-t border-white/5 pt-2">
          ${s.isi}
        </div>
      </details>`).join("");

    return `
      <div class="relative bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 overflow-hidden">
        <div class="absolute top-2 right-2 text-lg opacity-20">💡</div>
        <span class="text-[9px] font-bold text-yellow-400 uppercase tracking-wider block mb-1.5">Fakta Menarik</span>
        <p class="text-[10.5px] text-gray-300 leading-relaxed">${m.fakta}</p>
      </div>
      ${subHTML}
    `;
  },

  _tabMission(m, col) {
    const missions = this.missions[this.activePlanet] || ["Belum ada misi terdaftar"];
    const missionHTML = missions.map((ms, i) => `
      <div class="flex items-start gap-2.5 py-2 border-b border-white/4 last:border-0">
        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
             style="background:${col.glow}; color:${col.accent}; border: 1px solid ${col.accent}30">
          ${i + 1}
        </div>
        <span class="text-[10.5px] text-gray-300">${ms}</span>
      </div>`).join("");

    return `
      <div class="bg-white/3 border border-white/5 rounded-xl p-3">
        <span class="text-[9px] font-bold uppercase tracking-wider mb-2 block" style="color:${col.accent}">
          🚀 Misi Eksplorasi
        </span>
        <div class="divide-y divide-white/5">
          ${missionHTML}
        </div>
      </div>
      <div class="bg-white/3 border border-white/5 rounded-xl p-3 text-[10px] text-gray-400 leading-relaxed">
        ${m.penjelasan.split("\n\n").slice(1).join(" ").substring(0, 280)}...
      </div>
    `;
  },
};
