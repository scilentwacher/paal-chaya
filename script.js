/* =========================================================
   PAAL CHAYA — Main JavaScript
   ========================================================= */

/* =========================
   MOBILE MENU
   ========================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav?.style.display === "flex";

  if (nav) {
    nav.style.display = isOpen ? "" : "flex";
  }

  menuBtn.setAttribute("aria-expanded", String(!isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 800 && nav) {
      nav.style.display = "";
    }
  });
});


/* =========================================================
   PAAL CHAYA — AMBIENT SOUND MIXER
   ========================================================= */

const audioNames = [
  "rain",
  "thunder",
  "crickets",
  "fire",
  "train"
];

const defaultVolumes = {
  rain: 55,
  thunder: 25,
  crickets: 40,
  fire: 15,
  train: 10
};

const sounds = {};
let audioPlaying = false;
let audioMuted = false;


/* -------------------------
   CREATE AUDIO OBJECTS
   ------------------------- */

audioNames.forEach((name) => {
  const audio = new Audio(`audio/${name}.wav`);

  audio.loop = true;
  audio.preload = "auto";
  audio.volume = (defaultVolumes[name] / 100) * 0.72;

  sounds[name] = audio;
});


/* -------------------------
   ELEMENTS
   ------------------------- */

const audioStatus = document.getElementById("audioStatus");
const masterBtn = document.getElementById("masterBtn");
const testBtn = document.getElementById("testBtn");
const muteBtn = document.getElementById("muteBtn");


/* -------------------------
   STATUS MESSAGE
   ------------------------- */

function setAudioStatus(message) {
  if (audioStatus) {
    audioStatus.textContent = message;
  }
}


/* -------------------------
   START AUDIO
   ------------------------- */

async function startAudio() {
  try {
    for (const name of audioNames) {
      sounds[name].muted = audioMuted;

      /*
       * Calling play() after the user's button click
       * satisfies normal mobile browser interaction rules.
       */
      await sounds[name].play();
    }

    audioPlaying = true;

    if (masterBtn) {
      masterBtn.textContent = "⏹ Stop";
    }

    setAudioStatus("Playing — Kerala ambience is active ☕");

  } catch (error) {
    console.error("Audio start error:", error);

    audioPlaying = false;

    setAudioStatus(
      "Could not start audio. Tap Start again."
    );
  }
}


/* -------------------------
   STOP AUDIO
   ------------------------- */

function stopAudio() {
  audioNames.forEach((name) => {
    sounds[name].pause();
    sounds[name].currentTime = 0;
  });

  audioPlaying = false;

  if (masterBtn) {
    masterBtn.textContent = "▶ Start";
  }

  setAudioStatus("Ready — tap Start Experience");
}


/* -------------------------
   START / STOP BUTTON
   ------------------------- */

masterBtn?.addEventListener("click", () => {
  if (audioPlaying) {
    stopAudio();
  } else {
    startAudio();
  }
});


/* =========================================================
   TEST RAIN
   ========================================================= */

testBtn?.addEventListener("click", async () => {
  try {
    /*
     * IMPORTANT:
     * Audio files are now inside /audio/
     */
    const test = new Audio("audio/rain.wav");

    test.volume = 0.9;
    test.loop = false;

    await test.play();

    setAudioStatus("Rain test playing 🌧️");

  } catch (error) {
    console.error("Rain test error:", error);

    setAudioStatus(
      "Rain could not play. Please tap the button again."
    );
  }
});


/* =========================================================
   MUTE / UNMUTE
   ========================================================= */

muteBtn?.addEventListener("click", () => {
  audioMuted = !audioMuted;

  audioNames.forEach((name) => {
    sounds[name].muted = audioMuted;
  });

  if (audioMuted) {
    muteBtn.textContent = "🔊 Unmute";
    setAudioStatus("Audio muted 🔇");
  } else {
    muteBtn.textContent = "🔇 Mute";

    if (audioPlaying) {
      setAudioStatus("Playing — Kerala ambience is active ☕");
    } else {
      setAudioStatus("Ready — tap Start Experience");
    }
  }
});


/* =========================================================
   SOUND SLIDERS
   ========================================================= */

document.querySelectorAll(".sound-slider").forEach((slider) => {

  const soundName = slider.dataset.sound;

  slider.addEventListener("input", () => {

    const value = Number(slider.value);

    if (sounds[soundName]) {
      sounds[soundName].volume = (value / 100) * 0.72;
    }

    /*
     * Update nearby percentage text if the HTML has one.
     */
    const valueDisplay =
      slider.parentElement?.querySelector(".volume-value") ||
      slider.parentElement?.querySelector(".slider-value");

    if (valueDisplay) {
      valueDisplay.textContent = `${value}%`;
    }
  });

});


/* =========================================================
   SOUND PRESETS
   ========================================================= */

const presets = {
  monsoon: {
    rain: 80,
    thunder: 35,
    crickets: 25,
    fire: 5,
    train: 5
  },

  night: {
    rain: 20,
    thunder: 5,
    crickets: 75,
    fire: 20,
    train: 5
  },

  chaya: {
    rain: 15,
    thunder: 5,
    crickets: 20,
    fire: 55,
    train: 15
  },

  journey: {
    rain: 20,
    thunder: 5,
    crickets: 15,
    fire: 5,
    train: 75
  }
};


function applyPreset(presetName) {

  const preset = presets[presetName];

  if (!preset) return;

  Object.entries(preset).forEach(([name, value]) => {

    if (sounds[name]) {
      sounds[name].volume = (value / 100) * 0.72;
    }

    const slider = document.querySelector(
      `.sound-slider[data-sound="${name}"]`
    );

    if (slider) {
      slider.value = value;

      const valueDisplay =
        slider.parentElement?.querySelector(".volume-value") ||
        slider.parentElement?.querySelector(".slider-value");

      if (valueDisplay) {
        valueDisplay.textContent = `${value}%`;
      }
    }

  });

  document.querySelectorAll(".preset").forEach((button) => {
    button.classList.remove("selected");
  });

  const selectedButton = document.querySelector(
    `.preset[data-preset="${presetName}"]`
  );

  selectedButton?.classList.add("selected");

  setAudioStatus(`Preset applied: ${presetName}`);
}


document.querySelectorAll(".preset").forEach((button) => {

  button.addEventListener("click", () => {

    const presetName = button.dataset.preset;

    applyPreset(presetName);

  });

});


/* =========================================================
   EXPLORE — SEARCH & CATEGORY FILTER
   ========================================================= */

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");


function filterPlaces() {

  const query = (searchInput?.value || "")
    .trim()
    .toLowerCase();

  const category = categoryFilter?.value || "all";

  document.querySelectorAll(".place-card").forEach((card) => {

    const name =
      (card.dataset.name || "").toLowerCase();

    const text =
      (card.textContent || "").toLowerCase();

    const cardCategory =
      card.dataset.category || "";

    const matchesSearch =
      !query ||
      name.includes(query) ||
      text.includes(query);

    const matchesCategory =
      category === "all" ||
      cardCategory === category;

    card.style.display =
      matchesSearch && matchesCategory
        ? ""
        : "none";
  });
}


searchInput?.addEventListener("input", filterPlaces);

categoryFilter?.addEventListener(
  "change",
  filterPlaces
);


/* =========================================================
   FOCUS / POMODORO TIMER
   ========================================================= */

let timerId = null;
let remaining = 0;

const timerDisplay =
  document.getElementById("timerDisplay");


function renderTimer() {

  if (!timerDisplay) return;

  const minutes =
    Math.floor(Math.max(remaining, 0) / 60);

  const seconds =
    Math.max(remaining, 0) % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startTimer(minutes) {

  clearInterval(timerId);

  remaining = Number(minutes) * 60;

  renderTimer();

  timerId = setInterval(() => {

    remaining--;

    renderTimer();

    if (remaining <= 0) {

      clearInterval(timerId);
      timerId = null;

      remaining = 0;
      renderTimer();

      alert("Focus session complete ☕");

    }

  }, 1000);
}


document.querySelectorAll(".timer").forEach((button) => {

  button.addEventListener("click", () => {

    const minutes =
      Number(button.dataset.min);

    if (minutes > 0) {
      startTimer(minutes);
    }

  });

});


/* -------------------------
   TIMER RESET
   ------------------------- */

const resetTimerBtn =
  document.getElementById("resetTimer");

resetTimerBtn?.addEventListener("click", () => {

  clearInterval(timerId);

  timerId = null;
  remaining = 0;

  renderTimer();

});


/* =========================================================
   ORMA — TIME MACHINE / ERA BUTTONS
   ========================================================= */

document.querySelectorAll(".era").forEach((button) => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".era").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

  });

});


/* =========================================================
   MEMORIES
   ========================================================= */

const memoryForm =
  document.getElementById("memoryForm");

const memoryList =
  document.getElementById("memoryList");


let memories = [];

try {

  memories = JSON.parse(
    localStorage.getItem("paalChayaMemories") || "[]"
  );

  if (!Array.isArray(memories)) {
    memories = [];
  }

} catch (error) {

  console.error("Memory loading error:", error);

  memories = [];
}


/* -------------------------
   HTML ESCAPE
   ------------------------- */

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    (character) => {

      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];

    }
  );
}


/* -------------------------
   RENDER MEMORIES
   ------------------------- */

function renderMemories() {

  if (!memoryList) return;

  if (!memories.length) {

    memoryList.innerHTML =
      `<p class="empty-memory">
        No memories yet. Add your first Kerala memory ☕
      </p>`;

    return;
  }


  memoryList.innerHTML = memories
    .map((memory) => {

      const title =
        escapeHtml(memory.title || "Untitled memory");

      const year =
        memory.year
          ? ` · ${escapeHtml(memory.year)}`
          : "";

      const text =
        escapeHtml(memory.text || "");

      return `
        <article class="memory">
          <strong>${title}</strong>${year}
          <p>${text}</p>
        </article>
      `;

    })
    .join("");
}


/* -------------------------
   SAVE MEMORY
   ------------------------- */

memoryForm?.addEventListener("submit", (event) => {

  event.preventDefault();

  const titleInput =
    document.getElementById("memoryTitle");

  const yearInput =
    document.getElementById("memoryYear");

  const textInput =
    document.getElementById("memoryText");


  const title =
    titleInput?.value.trim() || "";

  const year =
    yearInput?.value.trim() || "";

  const text =
    textInput?.value.trim() || "";


  if (!title && !text) {
    return;
  }


  memories.unshift({
    title,
    year,
    text,
    createdAt: Date.now()
  });


  localStorage.setItem(
    "paalChayaMemories",
    JSON.stringify(memories)
  );


  memoryForm.reset();

  renderMemories();

});


/* =========================================================
   INITIALIZE
   ========================================================= */

renderMemories();

renderTimer();

console.log(
  "PAAL CHAYA loaded successfully ☕"
);

console.log(
  "Audio folder:",
  "audio/"
);

console.log(
  "Available sounds:",
  audioNames
);