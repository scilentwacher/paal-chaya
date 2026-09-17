/* =========================================================
   PAAL CHAYA — Main JavaScript
   V3 — Ambient Thunder + Lightning
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {

  const isOpen = nav?.style.display === "flex";

  if (nav) {
    nav.style.display = isOpen ? "" : "flex";
  }

  menuBtn.setAttribute(
    "aria-expanded",
    String(!isOpen)
  );

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


/* =========================================================
   CREATE AUDIO OBJECTS
   ========================================================= */

audioNames.forEach((name) => {

  const audio = new Audio(
    `audio/${name}.wav`
  );

  audio.loop = true;
  audio.preload = "auto";

  audio.volume =
    (defaultVolumes[name] / 100) * 0.72;

  sounds[name] = audio;

});


/* =========================================================
   ELEMENTS
   ========================================================= */

const audioStatus =
  document.getElementById("audioStatus");

const masterBtn =
  document.getElementById("masterBtn");

const testBtn =
  document.getElementById("testBtn");

const muteBtn =
  document.getElementById("muteBtn");


/* =========================================================
   AUDIO STATUS
   ========================================================= */

function setAudioStatus(message) {

  if (audioStatus) {
    audioStatus.textContent = message;
  }

}


/* =========================================================
   V3 — LIGHTNING SYSTEM
   ========================================================= */

/*
 * Thunder is an ambient looping WAV.
 *
 * Because the browser cannot reliably know which exact
 * moment inside a normal WAV file contains a thunderclap,
 * PAAL CHAYA uses a natural randomized lightning cycle
 * while the thunder ambience is active.
 *
 * This gives the feeling of:
 *
 *       🌧 Rain
 *       ↓
 *       ⚡ distant flash
 *       ↓
 *       🌩 Thunder
 *       ↓
 *       🌧 Rain again
 */


let lightningTimer = null;
let lightningRunning = false;


/* -------------------------
   CREATE LIGHTNING OVERLAY
   ------------------------- */

const lightningOverlay =
  document.createElement("div");

lightningOverlay.id =
  "paalChayaLightning";

document.body.appendChild(
  lightningOverlay
);


/* -------------------------
   LIGHTNING STYLE
   ------------------------- */

const lightningStyle =
  document.createElement("style");

lightningStyle.textContent = `

  #paalChayaLightning{
    position:fixed;
    inset:0;
    z-index:13;
    pointer-events:none;

    opacity:0;

    background:
      radial-gradient(
        ellipse at 62% 42%,
        rgba(255,245,214,.55),
        rgba(235,220,190,.16) 35%,
        transparent 72%
      );

    mix-blend-mode:screen;

    transition:
      opacity .04s linear;
  }

  #paalChayaLightning.pc-flash-1{
    opacity:.18;
  }

  #paalChayaLightning.pc-flash-2{
    opacity:.52;
  }

  #paalChayaLightning.pc-flash-3{
    opacity:.12;
  }

  @media(max-width:650px){

    #paalChayaLightning{
      background:
        radial-gradient(
          ellipse at 58% 45%,
          rgba(255,245,214,.48),
          rgba(235,220,190,.12) 38%,
          transparent 74%
        );
    }

  }

`;

document.head.appendChild(
  lightningStyle
);


/* -------------------------
   SINGLE LIGHTNING EVENT
   ------------------------- */

function lightningFlash() {

  if (!audioPlaying) return;

  if (audioMuted) return;

  const thunder =
    sounds.thunder;

  if (!thunder) return;

  /*
   * If thunder volume is essentially zero,
   * don't create visible lightning.
   */

  if (thunder.volume <= 0.01) {
    return;
  }


  lightningOverlay.className =
    "pc-flash-1";


  setTimeout(() => {

    lightningOverlay.className =
      "pc-flash-2";

  }, 55);


  setTimeout(() => {

    lightningOverlay.className =
      "pc-flash-3";

  }, 110);


  setTimeout(() => {

    lightningOverlay.className =
      "";

  }, 180);


  /*
   * Occasionally create a tiny second flash,
   * like distant lightning behind clouds.
   */

  if (Math.random() > 0.55) {

    setTimeout(() => {

      if (!audioPlaying || audioMuted) {
        return;
      }

      lightningOverlay.className =
        "pc-flash-1";

      setTimeout(() => {

        lightningOverlay.className =
          "";

      }, 90);

    }, 230 + Math.random() * 350);

  }

}


/* -------------------------
   NATURAL LIGHTNING SCHEDULER
   ------------------------- */

function scheduleLightning() {

  clearTimeout(lightningTimer);

  if (!audioPlaying) {
    lightningRunning = false;
    return;
  }

  lightningRunning = true;


  /*
   * Wait between roughly 14–32 seconds.
   *
   * This keeps lightning occasional rather than
   * turning the page into a flashing screen.
   */

  const delay =
    14000 +
    Math.random() * 18000;


  lightningTimer =
    setTimeout(() => {

      if (audioPlaying && !audioMuted) {

        lightningFlash();

      }

      scheduleLightning();

    }, delay);

}


/* -------------------------
   STOP LIGHTNING
   ------------------------- */

function stopLightning() {

  clearTimeout(lightningTimer);

  lightningTimer = null;

  lightningRunning = false;

  lightningOverlay.className = "";

  lightningOverlay.style.opacity = "0";

}


/* =========================================================
   START AUDIO
   ========================================================= */

async function startAudio() {

  try {

    for (const name of audioNames) {

      sounds[name].muted =
        audioMuted;

      /*
       * Calling play() after the user's button click
       * satisfies normal mobile browser interaction rules.
       */

      await sounds[name].play();

    }


    audioPlaying = true;


    if (masterBtn) {
      masterBtn.textContent =
        "⏹ Stop";
    }


    setAudioStatus(
      "Playing — Kerala ambience is active ☕"
    );


    /*
     * Start the atmospheric lightning cycle.
     */

    scheduleLightning();


  } catch (error) {

    console.error(
      "Audio start error:",
      error
    );

    audioPlaying = false;

    stopLightning();

    setAudioStatus(
      "Could not start audio. Tap Start again."
    );

  }

}


/* =========================================================
   STOP AUDIO
   ========================================================= */

function stopAudio() {

  audioNames.forEach((name) => {

    sounds[name].pause();

    sounds[name].currentTime = 0;

  });


  audioPlaying = false;


  stopLightning();


  if (masterBtn) {

    masterBtn.textContent =
      "▶ Start";

  }


  setAudioStatus(
    "Ready — tap Start Experience"
  );

}


/* =========================================================
   START / STOP BUTTON
   ========================================================= */

masterBtn?.addEventListener(
  "click",
  () => {

    if (audioPlaying) {

      stopAudio();

    } else {

      startAudio();

    }

  }
);


/* =========================================================
   TEST RAIN
   ========================================================= */

testBtn?.addEventListener(
  "click",
  async () => {

    try {

      /*
       * IMPORTANT:
       * Audio files are inside /audio/
       */

      const test =
        new Audio("audio/rain.wav");

      test.volume = 0.9;
      test.loop = false;

      await test.play();


      setAudioStatus(
        "Rain test playing 🌧️"
      );

    } catch (error) {

      console.error(
        "Rain test error:",
        error
      );

      setAudioStatus(
        "Rain could not play. Please tap the button again."
      );

    }

  }
);


/* =========================================================
   MUTE / UNMUTE
   ========================================================= */

muteBtn?.addEventListener(
  "click",
  () => {

    audioMuted =
      !audioMuted;


    audioNames.forEach((name) => {

      sounds[name].muted =
        audioMuted;

    });


    if (audioMuted) {

      /*
       * Stop visual lightning immediately.
       */

      stopLightning();


      muteBtn.textContent =
        "🔊 Unmute";

      setAudioStatus(
        "Audio muted 🔇"
      );

    } else {

      muteBtn.textContent =
        "🔇 Mute";


      if (audioPlaying) {

        setAudioStatus(
          "Playing — Kerala ambience is active ☕"
        );

        /*
         * Restart atmospheric lightning.
         */

        scheduleLightning();

      } else {

        setAudioStatus(
          "Ready — tap Start Experience"
        );

      }

    }

  }
);


/* =========================================================
   SOUND SLIDERS
   ========================================================= */

document
  .querySelectorAll(".sound-slider")
  .forEach((slider) => {

    const soundName =
      slider.dataset.sound;


    slider.addEventListener(
      "input",
      () => {

        const value =
          Number(slider.value);


        if (sounds[soundName]) {

          sounds[soundName].volume =
            (value / 100) * 0.72;

        }


        /*
         * Update percentage text.
         */

        const valueDisplay =
          slider.parentElement?.querySelector(
            ".volume-value"
          ) ||
          slider.parentElement?.querySelector(
            ".slider-value"
          );


        if (valueDisplay) {

          valueDisplay.textContent =
            `${value}%`;

        }

      }

    );

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


/* -------------------------
   APPLY PRESET
   ------------------------- */

function applyPreset(presetName) {

  const preset =
    presets[presetName];

  if (!preset) return;


  Object.entries(preset).forEach(
    ([name, value]) => {

      if (sounds[name]) {

        sounds[name].volume =
          (value / 100) * 0.72;

      }


      const slider =
        document.querySelector(
          `.sound-slider[data-sound="${name}"]`
        );


      if (slider) {

        slider.value =
          value;


        const valueDisplay =
          slider.parentElement?.querySelector(
            ".volume-value"
          ) ||
          slider.parentElement?.querySelector(
            ".slider-value"
          );


        if (valueDisplay) {

          valueDisplay.textContent =
            `${value}%`;

        }

      }

    }
  );


  document
    .querySelectorAll(".preset")
    .forEach((button) => {

      button.classList.remove(
        "selected"
      );

    });


  const selectedButton =
    document.querySelector(
      `.preset[data-preset="${presetName}"]`
    );


  selectedButton?.classList.add(
    "selected"
  );


  setAudioStatus(
    `Preset applied: ${presetName}`
  );


  /*
   * If the thunder amount changed while
   * ambience is playing, keep lightning alive.
   */

  if (audioPlaying && !audioMuted) {

    scheduleLightning();

  }

}


/* -------------------------
   PRESET BUTTONS
   ------------------------- */

document
  .querySelectorAll(".preset")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const presetName =
          button.dataset.preset;

        applyPreset(
          presetName
        );

      }
    );

  });


/* =========================================================
   EXPLORE — SEARCH & CATEGORY FILTER
   ========================================================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

const categoryFilter =
  document.getElementById(
    "categoryFilter"
  );


function filterPlaces() {

  const query =
    (searchInput?.value || "")
      .trim()
      .toLowerCase();


  const category =
    categoryFilter?.value ||
    "all";


  document
    .querySelectorAll(".place-card")
    .forEach((card) => {

      const name =
        (card.dataset.name || "")
          .toLowerCase();


      const text =
        (card.textContent || "")
          .toLowerCase();


      const cardCategory =
        card.dataset.category ||
        "";


      const matchesSearch =
        !query ||
        name.includes(query) ||
        text.includes(query);


      const matchesCategory =
        category === "all" ||
        cardCategory === category;


      card.style.display =
        matchesSearch &&
        matchesCategory
          ? ""
          : "none";

    });

}


searchInput?.addEventListener(
  "input",
  filterPlaces
);


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
  document.getElementById(
    "timerDisplay"
  );


function renderTimer() {

  if (!timerDisplay) return;


  const minutes =
    Math.floor(
      Math.max(remaining, 0) / 60
    );


  const seconds =
    Math.max(remaining, 0) % 60;


  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* -------------------------
   START TIMER
   ------------------------- */

function startTimer(minutes) {

  clearInterval(timerId);


  remaining =
    Number(minutes) * 60;


  renderTimer();


  timerId =
    setInterval(() => {

      remaining--;

      renderTimer();


      if (remaining <= 0) {

        clearInterval(timerId);

        timerId = null;

        remaining = 0;

        renderTimer();


        alert(
          "Focus session complete ☕"
        );

      }

    }, 1000);

}


/* -------------------------
   TIMER BUTTONS
   ------------------------- */

document
  .querySelectorAll(".timer")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const minutes =
          Number(
            button.dataset.min
          );


        if (minutes > 0) {

          startTimer(
            minutes
          );

        }

      }
    );

  });


/* -------------------------
   TIMER RESET
   ------------------------- */

const resetTimerBtn =
  document.getElementById(
    "resetTimer"
  );


resetTimerBtn?.addEventListener(
  "click",
  () => {

    clearInterval(timerId);

    timerId = null;

    remaining = 0;

    renderTimer();

  }
);


/* =========================================================
   ORMA — TIME MACHINE / ERA BUTTONS
   ========================================================= */

document
  .querySelectorAll(".era")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".era")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );

      }
    );

  });


/* =========================================================
   MEMORIES
   ========================================================= */

const memoryForm =
  document.getElementById(
    "memoryForm"
  );

const memoryList =
  document.getElementById(
    "memoryList"
  );


let memories = [];


try {

  memories =
    JSON.parse(
      localStorage.getItem(
        "paalChayaMemories"
      ) || "[]"
    );


  if (!Array.isArray(memories)) {

    memories = [];

  }

} catch (error) {

  console.error(
    "Memory loading error:",
    error
  );

  memories = [];

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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


      return entities[
        character
      ];

    }
  );

}


/* =========================================================
   RENDER MEMORIES
   ========================================================= */

function renderMemories() {

  if (!memoryList) return;


  if (!memories.length) {

    memoryList.innerHTML =
      `<p class="empty-memory">
        No memories yet. Add your first Kerala memory ☕
      </p>`;

    return;

  }


  memoryList.innerHTML =
    memories
      .map((memory) => {

        const title =
          escapeHtml(
            memory.title ||
            "Untitled memory"
          );


        const year =
          memory.year
            ? ` · ${escapeHtml(
                memory.year
              )}`
            : "";


        const text =
          escapeHtml(
            memory.text || ""
          );


        return `
          <article class="memory">
            <strong>${title}</strong>${year}
            <p>${text}</p>
          </article>
        `;

      })
      .join("");

}


/* =========================================================
   SAVE MEMORY
   ========================================================= */

memoryForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const titleInput =
      document.getElementById(
        "memoryTitle"
      );


    const yearInput =
      document.getElementById(
        "memoryYear"
      );


    const textInput =
      document.getElementById(
        "memoryText"
      );


    const title =
      titleInput?.value.trim() ||
      "";


    const year =
      yearInput?.value.trim() ||
      "";


    const text =
      textInput?.value.trim() ||
      "";


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
      JSON.stringify(
        memories
      )
    );


    memoryForm.reset();


    renderMemories();

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderMemories();

renderTimer();


console.log(
  "PAAL CHAYA loaded successfully ☕"
);


console.log(
  "V3 atmosphere: thunder + lightning enabled ⚡"
);


console.log(
  "Audio folder:",
  "audio/"
);


console.log(
  "Available sounds:",
  audioNames
);

/* =========================================================
   PAAL CHAYA — NATURAL LIGHTNING
   ========================================================= */

let lightningTimer = null;

function triggerLightning(){

  document.body.classList.add("lightning");

  setTimeout(() => {
    document.body.classList.remove("lightning");
  }, 90);

  /* occasional second flash */
  if (Math.random() > 0.55) {

    setTimeout(() => {

      document.body.classList.add("lightning");

      setTimeout(() => {
        document.body.classList.remove("lightning");
      }, 65);

    }, 130);

  }
}


function scheduleLightning(){

  clearTimeout(lightningTimer);

  if (!audioPlaying) return;

  const delay =
    9000 +
    Math.random() * 18000;

  lightningTimer = setTimeout(() => {

    triggerLightning();

    scheduleLightning();

  }, delay);
}


/* Start lightning when ambience starts */
const originalStartAudio = startAudio;

startAudio = async function(){

  await originalStartAudio();

  if (audioPlaying){
    scheduleLightning();
  }

};


/* Stop lightning when ambience stops */
const originalStopAudio = stopAudio;

stopAudio = function(){

  originalStopAudio();

  clearTimeout(lightningTimer);
  lightningTimer = null;

  document.body.classList.remove("lightning");

};