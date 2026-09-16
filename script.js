/* ================================
   PAAL CHAYA — AUDIO ENGINE
================================ */

const sounds = {};
const vals = {
  rain: 55,
  thunder: 25,
  crickets: 40,
  fire: 15,
  train: 10
};

let playing = false;
let muted = false;

/* Load audio files from ROOT of repository */
Object.keys(vals).forEach(n => {
  const audio = new Audio(`${n}.wav`);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = vals[n] / 100 * 0.72;
  sounds[n] = audio;
});

function setStatus(text) {
  const status = document.getElementById("audioStatus");
  if (status) status.textContent = text;
}

/* ================================
   START AUDIO
================================ */

async function startAudio() {
  try {
    await Promise.all(
      Object.keys(sounds).map(n => sounds[n].play())
    );

    playing = true;
    muted = false;

    document.querySelectorAll(".preset").forEach(b => {
      b.classList.remove("selected");
    });

    const masterBtn = document.getElementById("masterBtn");
    const muteBtn = document.getElementById("muteBtn");

    if (masterBtn) masterBtn.textContent = "⏸ Stop";
    if (muteBtn) muteBtn.textContent = "🔇 Mute";

    setStatus("🎧 Ambience playing");
  } catch (error) {
    console.error("Audio error:", error);
    setStatus("⚠️ Tap Test Sound to start audio");
  }
}

/* ================================
   STOP AUDIO
================================ */

function stopAudio() {
  Object.keys(sounds).forEach(n => {
    sounds[n].pause();
    sounds[n].currentTime = 0;
  });

  playing = false;

  const masterBtn = document.getElementById("masterBtn");

  if (masterBtn) {
    masterBtn.textContent = "▶ Start";
  }

  setStatus("Audio stopped");
}

/* ================================
   START / STOP BUTTON
================================ */

const masterBtn = document.getElementById("masterBtn");

masterBtn?.addEventListener("click", () => {
  if (playing) {
    stopAudio();
  } else {
    startAudio();
  }
});

/* ================================
   TEST SOUND
================================ */

const testBtn = document.getElementById("testBtn");

testBtn?.addEventListener("click", async () => {
  try {
    const testAudio = new Audio("rain.wav");
    testAudio.volume = 0.9;

    await testAudio.play();

    setStatus("🔊 Rain test sound playing");

  } catch (error) {
    console.error(error);
    setStatus("⚠️ Browser blocked audio. Tap again.");
  }
});

/* ================================
   MUTE / UNMUTE
================================ */

const muteBtn = document.getElementById("muteBtn");

muteBtn?.addEventListener("click", () => {

  muted = !muted;

  Object.keys(sounds).forEach(n => {
    sounds[n].muted = muted;
  });

  if (muteBtn) {
    muteBtn.textContent = muted
      ? "🔊 Unmute"
      : "🔇 Mute";
  }

  setStatus(muted ? "🔇 Audio muted" : "🎧 Ambience playing");
});

/* ================================
   SOUND SLIDERS
================================ */

document.querySelectorAll(".sound-slider").forEach(slider => {

  slider.addEventListener("input", () => {

    const name = slider.dataset.sound;
    const value = Number(slider.value);

    vals[name] = value;

    if (sounds[name]) {
      sounds[name].volume =
        muted ? 0 : value / 100 * 0.72;
    }

    const output = document.getElementById(name + "Out");

    if (output) {
      output.textContent = value + "%";
    }
  });

});


/* ================================
   PRESETS
================================ */

const presets = {

  mazha: {
    rain: 90,
    thunder: 55,
    crickets: 10,
    fire: 0,
    train: 0
  },

  chaya: {
    rain: 20,
    thunder: 0,
    crickets: 20,
    fire: 45,
    train: 5
  },

  village: {
    rain: 0,
    thunder: 0,
    crickets: 55,
    fire: 15,
    train: 0
  },

  midnight: {
    rain: 18,
    thunder: 0,
    crickets: 75,
    fire: 5,
    train: 0
  },

  study: {
    rain: 35,
    thunder: 0,
    crickets: 8,
    fire: 0,
    train: 0
  },

  sleep: {
    rain: 45,
    thunder: 0,
    crickets: 25,
    fire: 3,
    train: 0
  },

  beach: {
    rain: 0,
    thunder: 0,
    crickets: 8,
    fire: 0,
    train: 35
  },

  train: {
    rain: 0,
    thunder: 0,
    crickets: 0,
    fire: 0,
    train: 90
  }

};


/* ================================
   PRESET BUTTONS
================================ */

document.querySelectorAll(".preset").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".preset")
      .forEach(b => b.classList.remove("selected"));

    button.classList.add("selected");

    const preset = presets[button.dataset.preset];

    if (!preset) return;

    Object.entries(preset).forEach(([name, value]) => {

      const slider =
        document.querySelector(`[data-sound="${name}"]`);

      if (slider) {
        slider.value = value;

        vals[name] = value;

        const output =
          document.getElementById(name + "Out");

        if (output) {
          output.textContent = value + "%";
        }

        if (sounds[name]) {
          sounds[name].volume =
            muted ? 0 : value / 100 * 0.72;
        }
      }

    });

    if (!playing) {
      startAudio();
    }

  });

});


/* ================================
   MENU
================================ */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {

  const open = nav.style.display === "flex";

  nav.style.display = open ? "" : "flex";

  menuBtn.setAttribute(
    "aria-expanded",
    String(!open)
  );

});

nav?.querySelectorAll("a").forEach(a => {

  a.addEventListener("click", () => {

    if (innerWidth <= 800) {
      nav.style.display = "";
    }

  });

});


/* ================================
   SEARCH & FILTER
================================ */

const searchInput =
  document.getElementById("searchInput");

const filter =
  document.getElementById("categoryFilter");

function filterPlaces() {

  const q =
    (searchInput?.value || "").toLowerCase();

  const cat =
    filter?.value || "all";

  document.querySelectorAll(".place-card")
    .forEach(card => {

      const name =
        card.dataset.name.toLowerCase();

      const text =
        card.textContent.toLowerCase();

      const matchesSearch =
        name.includes(q) ||
        text.includes(q);

      const matchesCategory =
        cat === "all" ||
        card.dataset.category === cat;

      card.style.display =
        matchesSearch && matchesCategory
          ? "block"
          : "none";

    });

}

searchInput?.addEventListener(
  "input",
  filterPlaces
);

filter?.addEventListener(
  "change",
  filterPlaces
);


/* ================================
   TIMER
================================ */

let timerId = null;
let remaining = 0;

const display =
  document.getElementById("timerDisplay");

function renderTimer() {

  if (!display) return;

  const minutes =
    Math.floor(remaining / 60);

  const seconds =
    remaining % 60;

  display.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


document.querySelectorAll(".timer").forEach(button => {

  button.addEventListener("click", () => {

    clearInterval(timerId);

    remaining =
      Number(button.dataset.min) * 60;

    renderTimer();

    timerId = setInterval(() => {

      remaining--;

      renderTimer();

      if (remaining <= 0) {

        clearInterval(timerId);

        stopAudio();

        alert("Focus session complete ☕");

      }

    }, 1000);

  });

});


/* ================================
   TIMER RESET
================================ */

const timerReset =
  document.getElementById("timerReset");

timerReset?.addEventListener("click", () => {

  clearInterval(timerId);

  remaining = 0;

  renderTimer();

});


/* ================================
   ORMA ERA BUTTONS
================================ */

document.querySelectorAll(".era").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".era")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");

  });

});


/* ================================
   MEMORY SYSTEM
================================ */

const form =
  document.getElementById("memoryForm");

const list =
  document.getElementById("memoryList");

let memories =
  JSON.parse(
    localStorage.getItem("paalChayaMemories") || "[]"
  );


function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );

}


function renderMemories() {

  if (!list) return;

  list.innerHTML =
    memories.map(memory => `

      <article class="memory">

        <strong>
          ${escapeHtml(memory.title)}
        </strong>

        ${
          memory.year
            ? ` · ${escapeHtml(memory.year)}`
            : ""
        }

        <p>
          ${escapeHtml(memory.text)}
        </p>

      </article>

    `).join("");

}


form?.addEventListener("submit", event => {

  event.preventDefault();

  const title =
    document.getElementById("memoryTitle");

  const year =
    document.getElementById("memoryYear");

  const text =
    document.getElementById("memoryText");

  memories.unshift({

    title: title.value,

    year: year.value,

    text: text.value

  });

  localStorage.setItem(
    "paalChayaMemories",
    JSON.stringify(memories)
  );

  form.reset();

  renderMemories();

});


renderMemories();