/* =========================================================
   PAAL CHAYA
   MAIN JAVASCRIPT — V4 STABLE + OPTIMIZED
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

  menuBtn.addEventListener("click", () => {

    const isOpen =
      nav.classList.contains("menu-open");

    if (isOpen) {

      nav.classList.remove("menu-open");

      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );

    } else {

      nav.classList.add("menu-open");

      menuBtn.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      if (window.innerWidth <= 900) {

        nav.classList.remove("menu-open");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  });

}


/* =========================================================
   AUDIO SYSTEM
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

audioNames.forEach(name => {

  const audio =
    new Audio(`audio/${name}.wav`);

  audio.loop = true;

  /*
   * Do not force-load every large WAV immediately.
   * Browser can load them when playback starts.
   */

  audio.preload = "metadata";

  audio.volume =
    (defaultVolumes[name] / 100) * 0.72;

  sounds[name] = audio;

});


/* =========================================================
   AUDIO ELEMENTS
   ========================================================= */

const audioStatus =
  document.getElementById("audioStatus");

const masterBtn =
  document.getElementById("masterBtn");

const testBtn =
  document.getElementById("testBtn");

const muteBtn =
  document.getElementById("muteBtn");


function setAudioStatus(message) {

  if (audioStatus) {

    audioStatus.textContent =
      message;

  }

}


/* =========================================================
   LIGHTNING SYSTEM
   ========================================================= */

let lightningTimer = null;

let lightningFlashTimers = [];


/*
 * Create overlay only once.
 */

const lightningOverlay =
  document.createElement("div");

lightningOverlay.id =
  "paalChayaLightning";

document.body.appendChild(
  lightningOverlay
);


/*
 * Lightweight lightning CSS.
 */

const lightningStyle =
  document.createElement("style");

lightningStyle.textContent = `

  #paalChayaLightning {

    position: fixed;

    inset: 0;

    z-index: 13;

    pointer-events: none;

    opacity: 0;

    background:
      radial-gradient(
        ellipse at 62% 45%,
        rgba(255,245,220,.42),
        rgba(235,220,190,.12) 38%,
        transparent 72%
      );

    mix-blend-mode: screen;

    transition:
      opacity .035s linear;

  }


  #paalChayaLightning.pc-flash-1 {

    opacity: .12;

  }


  #paalChayaLightning.pc-flash-2 {

    opacity: .38;

  }


  #paalChayaLightning.pc-flash-3 {

    opacity: .08;

  }


  @media(max-width:650px) {

    #paalChayaLightning {

      background:
        radial-gradient(
          ellipse at 58% 45%,
          rgba(255,245,220,.36),
          rgba(235,220,190,.09) 40%,
          transparent 75%
        );

    }

  }

`;

document.head.appendChild(
  lightningStyle
);


/* =========================================================
   CLEAR LIGHTNING
   ========================================================= */

function clearLightningTimers() {

  if (lightningTimer) {

    clearTimeout(
      lightningTimer
    );

    lightningTimer = null;

  }


  lightningFlashTimers.forEach(
    timer => clearTimeout(timer)
  );

  lightningFlashTimers = [];


  lightningOverlay.className = "";

}


/* =========================================================
   SINGLE LIGHTNING FLASH
   ========================================================= */

function triggerLightning() {

  /*
   * Never flash when ambience is not active.
   */

  if (!audioPlaying) return;

  /*
   * Never flash while muted.
   */

  if (audioMuted) return;


  /*
   * Do not flash if thunder volume is
   * essentially turned off.
   */

  const thunder =
    sounds.thunder;

  if (!thunder) return;

  if (thunder.volume <= 0.01) {
    return;
  }


  /*
   * First flash.
   */

  lightningOverlay.className =
    "pc-flash-1";


  const flash1 =
    setTimeout(() => {

      lightningOverlay.className =
        "pc-flash-2";

    }, 45);


  const flash2 =
    setTimeout(() => {

      lightningOverlay.className =
        "pc-flash-3";

    }, 90);


  const flash3 =
    setTimeout(() => {

      lightningOverlay.className =
        "";

    }, 155);


  lightningFlashTimers.push(
    flash1,
    flash2,
    flash3
  );


  /*
   * Sometimes a small secondary flash.
   */

  if (Math.random() > 0.60) {

    const secondDelay =
      220 +
      Math.random() * 300;


    const secondFlash =
      setTimeout(() => {

        if (
          !audioPlaying ||
          audioMuted
        ) {
          return;
        }


        lightningOverlay.className =
          "pc-flash-1";


        const secondEnd =
          setTimeout(() => {

            lightningOverlay.className =
              "";

          }, 70);


        lightningFlashTimers.push(
          secondEnd
        );

      }, secondDelay);


    lightningFlashTimers.push(
      secondFlash
    );

  }

}


/* =========================================================
   SCHEDULE LIGHTNING
   ========================================================= */

function scheduleLightning() {

  clearTimeout(
    lightningTimer
  );

  lightningTimer = null;


  if (!audioPlaying) {
    return;
  }


  if (audioMuted) {
    return;
  }


  /*
   * 14–30 seconds between possible flashes.
   *
   * This is intentionally slow so the phone
   * does not constantly animate.
   */

  const delay =
    14000 +
    Math.random() * 16000;


  lightningTimer =
    setTimeout(() => {

      if (
        audioPlaying &&
        !audioMuted
      ) {

        triggerLightning();

      }


      scheduleLightning();

    }, delay);

}


/* =========================================================
   STOP LIGHTNING
   ========================================================= */

function stopLightning() {

  clearLightningTimers();

}


/* =========================================================
   START AUDIO
   ========================================================= */

async function startAudio() {

  if (audioPlaying) {
    return;
  }


  try {

    /*
     * Set state BEFORE playback.
     * This prevents double taps from starting
     * multiple copies.
     */

    audioPlaying = true;


    if (masterBtn) {

      masterBtn.textContent =
        "⏹ Stop";

    }


    setAudioStatus(
      "Starting Kerala ambience ☕"
    );


    /*
     * Start all sounds together.
     *
     * IMPORTANT:
     * We do NOT await each sound one by one.
     */

    const playPromises =
      audioNames.map(name => {

        const audio =
          sounds[name];

        if (!audio) {
          return Promise.resolve();
        }


        audio.muted =
          audioMuted;


        return audio
          .play()
          .catch(error => {

            console.warn(
              `${name} audio could not start:`,
              error
            );

          });

      });


    await Promise.all(
      playPromises
    );


    /*
     * Start lightning only after
     * audio playback has been attempted.
     */

    scheduleLightning();


    setAudioStatus(
      "Playing — Kerala ambience is active ☕"
    );


  } catch (error) {

    console.error(
      "Audio start error:",
      error
    );


    audioPlaying = false;


    stopLightning();


    if (masterBtn) {

      masterBtn.textContent =
        "▶ Start";

    }


    setAudioStatus(
      "Could not start audio. Tap Start again."
    );

  }

}


/* =========================================================
   STOP AUDIO
   ========================================================= */

function stopAudio() {

  /*
   * Stop lightning first.
   */

  stopLightning();


  audioNames.forEach(name => {

    const audio =
      sounds[name];

    if (!audio) return;


    audio.pause();


    /*
     * Reset playback position.
     */

    try {

      audio.currentTime = 0;

    } catch (_) {}

  });


  audioPlaying = false;


  if (masterBtn) {

    masterBtn.textContent =
      "▶ Start";

  }


  setAudioStatus(
    "Ready — tap Start Experience"
  );

}


/* =========================================================
   MASTER AUDIO BUTTON
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

let testRain = null;


testBtn?.addEventListener(
  "click",
  async () => {

    try {

      /*
       * Reuse the same audio object instead
       * of creating a new object every tap.
       */

      if (!testRain) {

        testRain =
          new Audio(
            "audio/rain.wav"
          );

        testRain.volume = 0.9;

        testRain.loop = false;

        testRain.preload =
          "metadata";

      }


      testRain.currentTime = 0;


      await testRain.play();


      setAudioStatus(
        "Rain test playing 🌧️"
      );


    } catch (error) {

      console.warn(
        "Rain test error:",
        error
      );


      setAudioStatus(
        "Tap Test Rain again."
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


    audioNames.forEach(name => {

      if (sounds[name]) {

        sounds[name].muted =
          audioMuted;

      }

    });


    if (audioMuted) {

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
  .forEach(slider => {

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


        const valueDisplay =
          slider.parentElement
            ?.querySelector(
              ".volume-value"
            ) ||
          slider.parentElement
            ?.querySelector(
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
   PRESETS
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


/* =========================================================
   APPLY PRESET
   ========================================================= */

function applyPreset(presetName) {

  const preset =
    presets[presetName];

  if (!preset) return;


  Object.entries(preset)
    .forEach(([name, value]) => {

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
          slider.parentElement
            ?.querySelector(
              ".volume-value"
            ) ||
          slider.parentElement
            ?.querySelector(
              ".slider-value"
            );


        if (valueDisplay) {

          valueDisplay.textContent =
            `${value}%`;

        }

      }

    });


  document
    .querySelectorAll(".preset")
    .forEach(button => {

      button.classList.remove(
        "selected"
      );

    });


  const selected =
    document.querySelector(
      `.preset[data-preset="${presetName}"]`
    );


  selected?.classList.add(
    "selected"
  );


  setAudioStatus(
    `Preset applied: ${presetName}`
  );


  /*
   * Recalculate lightning schedule
   * after thunder volume changes.
   */

  if (
    audioPlaying &&
    !audioMuted
  ) {

    scheduleLightning();

  }

}


/* =========================================================
   PRESET BUTTONS
   ========================================================= */

document
  .querySelectorAll(".preset")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        applyPreset(
          button.dataset.preset
        );

      }
    );

  });


/* =========================================================
   EXPLORE
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
    .forEach(card => {

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
   POMODORO / FOCUS TIMER
   ========================================================= */

let timerId = null;

let remaining = 0;


const timerDisplay =
  document.getElementById(
    "timerDisplay"
  );


function renderTimer() {

  if (!timerDisplay) {
    return;
  }


  const safeRemaining =
    Math.max(
      0,
      Math.floor(remaining)
    );


  const minutes =
    Math.floor(
      safeRemaining / 60
    );


  const seconds =
    safeRemaining % 60;


  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =========================================================
   START TIMER
   ========================================================= */

function startTimer(minutes) {

  const duration =
    Number(minutes);


  if (
    !Number.isFinite(duration) ||
    duration <= 0
  ) {

    return;

  }


  /*
   * Stop previous timer.
   */

  if (timerId !== null) {

    clearInterval(timerId);

  }


  remaining =
    Math.floor(
      duration * 60
    );


  renderTimer();


  /*
   * Use timestamp-based timing.
   *
   * This is more accurate when the phone
   * temporarily lags.
   */

  const endTime =
    Date.now() +
    remaining * 1000;


  timerId =
    setInterval(() => {

      remaining =
        Math.max(
          0,
          Math.ceil(
            (endTime - Date.now()) /
            1000
          )
        );


      renderTimer();


      if (remaining <= 0) {

        clearInterval(
          timerId
        );

        timerId = null;

        remaining = 0;

        renderTimer();


        /*
         * Small vibration if supported.
         */

        if (
          "vibrate" in navigator
        ) {

          navigator.vibrate(
            [200, 100, 200]
          );

        }


        alert(
          "Focus session complete ☕"
        );

      }

    }, 500);

}


/* =========================================================
   TIMER BUTTONS
   ========================================================= */

document
  .querySelectorAll(".timer")
  .forEach(button => {

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


/* =========================================================
   TIMER RESET
   ========================================================= */

const resetTimerBtn =
  document.getElementById(
    "resetTimer"
  );


resetTimerBtn?.addEventListener(
  "click",
  () => {

    if (timerId !== null) {

      clearInterval(
        timerId
      );

    }


    timerId = null;

    remaining = 0;

    renderTimer();

  }
);


/* =========================================================
   ORMA
   ========================================================= */

document
  .querySelectorAll(".era")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".era")
          .forEach(item => {

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

  console.warn(
    "Memory loading error:",
    error
  );

  memories = [];

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => {

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

  if (!memoryList) {
    return;
  }


  if (!memories.length) {

    memoryList.innerHTML =
      `<p class="empty-memory">
        No memories yet. Add your first Kerala memory ☕
      </p>`;

    return;

  }


  memoryList.innerHTML =
    memories
      .map(memory => {

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
            memory.text ||
            ""
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
  event => {

    event.preventDefault();


    const title =
      document
        .getElementById(
          "memoryTitle"
        )
        ?.value
        .trim() || "";


    const year =
      document
        .getElementById(
          "memoryYear"
        )
        ?.value
        .trim() || "";


    const text =
      document
        .getElementById(
          "memoryText"
        )
        ?.value
        .trim() || "";


    if (!title && !text) {
      return;
    }


    memories.unshift({

      title,

      year,

      text,

      createdAt:
        Date.now()

    });


    try {

      localStorage.setItem(
        "paalChayaMemories",
        JSON.stringify(
          memories
        )
      );

    } catch (error) {

      console.warn(
        "Could not save memory:",
        error
      );

    }


    memoryForm.reset();

    renderMemories();

  }
);


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

/*
 * When the user leaves the page, stop the lightning
 * scheduler. This saves battery and CPU.
 */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden
    ) {

      stopLightning();

    } else if (
      audioPlaying &&
      !audioMuted
    ) {

      scheduleLightning();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderMemories();

renderTimer();


console.log(
  "PAAL CHAYA V4 loaded successfully ☕"
);

console.log(
  "Audio folder: audio/"
);

console.log(
  "Sounds:",
  audioNames
);

console.log(
  "Timer: timestamp based"
);

console.log(
  "Lightning: single optimized system ⚡"
);