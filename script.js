/* =========================================================
   PAAL CHAYA — MAIN JAVASCRIPT
   CLEAN V4
   Audio + Timer + Explore + Orma + Memories
   Lightweight Lightning
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

  menuBtn.addEventListener("click", () => {

    const open =
      nav.classList.toggle("menu-open");

    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );

    nav.style.display =
      open ? "grid" : "";

  });

  nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      if (window.innerWidth <= 900) {

        nav.classList.remove("menu-open");

        nav.style.display = "";

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  });

}


/* =========================================================
   AUDIO ENGINE
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
   CREATE AUDIO
   ========================================================= */

audioNames.forEach((name) => {

  const audio =
    new Audio(`audio/${name}.wav`);

  audio.loop = true;

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
    audioStatus.textContent = message;
  }

}


/* =========================================================
   LIGHTNING
   ========================================================= */

let lightningTimer = null;

const lightningOverlay =
  document.createElement("div");

lightningOverlay.id =
  "paalChayaLightning";

document.body.appendChild(
  lightningOverlay
);


function flashLightning() {

  if (!audioPlaying || audioMuted) {
    return;
  }

  const thunder =
    sounds.thunder;

  if (!thunder || thunder.volume < 0.01) {
    return;
  }

  lightningOverlay.classList.add(
    "flash"
  );

  setTimeout(() => {

    lightningOverlay.classList.remove(
      "flash"
    );

  }, 90);

  /* occasional second flash */

  if (Math.random() > 0.65) {

    setTimeout(() => {

      if (
        audioPlaying &&
        !audioMuted
      ) {

        lightningOverlay.classList.add(
          "flash"
        );

        setTimeout(() => {

          lightningOverlay.classList.remove(
            "flash"
          );

        }, 60);

      }

    }, 140);

  }

}


function scheduleLightning() {

  clearTimeout(lightningTimer);

  if (!audioPlaying) {
    return;
  }

  const delay =
    12000 +
    Math.random() * 18000;

  lightningTimer =
    setTimeout(() => {

      flashLightning();

      scheduleLightning();

    }, delay);

}


function stopLightning() {

  clearTimeout(lightningTimer);

  lightningTimer = null;

  lightningOverlay.classList.remove(
    "flash"
  );

}


/* =========================================================
   START AUDIO
   ========================================================= */

async function startAudio() {

  if (audioPlaying) {
    return;
  }

  try {

    setAudioStatus(
      "Starting Kerala ambience… ☕"
    );

    /*
     * Start all audio together.
     *
     * This is smoother than waiting for
     * each WAV file separately.
     */

    const playPromises =
      audioNames.map((name) => {

        const audio =
          sounds[name];

        audio.muted =
          audioMuted;

        return audio.play();

      });


    await Promise.all(
      playPromises
    );


    audioPlaying = true;


    if (masterBtn) {

      masterBtn.textContent =
        "⏹ Stop";

    }


    setAudioStatus(
      "Playing — Kerala ambience is active ☕"
    );


    scheduleLightning();

  }

  catch (error) {

    console.error(
      "PAAL CHAYA audio error:",
      error
    );

    audioPlaying = false;

    stopLightning();

    setAudioStatus(
      "Tap Start Experience again to enable audio."
    );

  }

}


/* =========================================================
   STOP AUDIO
   ========================================================= */

function stopAudio() {

  audioNames.forEach((name) => {

    const audio =
      sounds[name];

    if (!audio) {
      return;
    }

    audio.pause();

    try {
      audio.currentTime = 0;
    }
    catch (_) {}

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
   MASTER BUTTON
   ========================================================= */

if (masterBtn) {

  masterBtn.addEventListener(
    "click",
    () => {

      if (audioPlaying) {

        stopAudio();

      }

      else {

        startAudio();

      }

    }
  );

}


/* =========================================================
   TEST RAIN
   ========================================================= */

if (testBtn) {

  testBtn.addEventListener(
    "click",
    async () => {

      try {

        const test =
          new Audio(
            "audio/rain.wav"
          );

        test.volume = .9;

        test.loop = false;

        await test.play();

        setAudioStatus(
          "Rain test playing 🌧️"
        );

        /*
         * Release audio object after playback.
         */

        test.addEventListener(
          "ended",
          () => {

            test.src = "";

          },
          { once:true }
        );

      }

      catch (error) {

        console.error(
          "Rain test error:",
          error
        );

        setAudioStatus(
          "Rain could not play. Tap again."
        );

      }

    }
  );

}


/* =========================================================
   MUTE / UNMUTE
   ========================================================= */

if (muteBtn) {

  muteBtn.addEventListener(
    "click",
    () => {

      audioMuted =
        !audioMuted;


      audioNames.forEach((name) => {

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

      }

      else {

        muteBtn.textContent =
          "🔇 Mute";

        if (audioPlaying) {

          setAudioStatus(
            "Playing — Kerala ambience is active ☕"
          );

          scheduleLightning();

        }

        else {

          setAudioStatus(
            "Ready — tap Start Experience"
          );

        }

      }

    }
  );

}


/* =========================================================
   SOUND SLIDERS
   ========================================================= */

document
  .querySelectorAll(".sound-slider")
  .forEach((slider) => {

    const soundName =
      slider.dataset.sound;


    const updateVolume = () => {

      const value =
        Number(slider.value);


      if (sounds[soundName]) {

        sounds[soundName].volume =
          (value / 100) * 0.72;

      }


      const display =
        slider.parentElement?.querySelector(
          ".volume-value"
        ) ||
        slider.parentElement?.querySelector(
          ".slider-value"
        );


      if (display) {

        display.textContent =
          `${value}%`;

      }

    };


    slider.addEventListener(
      "input",
      updateVolume
    );


    /*
     * Set correct value on page load.
     */

    updateVolume();

  });


/* =========================================================
   PRESETS
   ========================================================= */

const presets = {

  monsoon:{
    rain:80,
    thunder:35,
    crickets:25,
    fire:5,
    train:5
  },

  night:{
    rain:20,
    thunder:5,
    crickets:75,
    fire:20,
    train:5
  },

  chaya:{
    rain:15,
    thunder:5,
    crickets:20,
    fire:55,
    train:15
  },

  journey:{
    rain:20,
    thunder:5,
    crickets:15,
    fire:5,
    train:75
  }

};


function applyPreset(name) {

  const preset =
    presets[name];

  if (!preset) {
    return;
  }


  Object.entries(preset)
    .forEach(([soundName,value]) => {

      if (sounds[soundName]) {

        sounds[soundName].volume =
          (value / 100) * 0.72;

      }


      const slider =
        document.querySelector(
          `.sound-slider[data-sound="${soundName}"]`
        );


      if (slider) {

        slider.value =
          value;


        const display =
          slider.parentElement?.querySelector(
            ".volume-value"
          ) ||
          slider.parentElement?.querySelector(
            ".slider-value"
          );


        if (display) {

          display.textContent =
            `${value}%`;

        }

      }

    });


  document
    .querySelectorAll(".preset")
    .forEach((button) => {

      button.classList.remove(
        "selected"
      );

    });


  const selected =
    document.querySelector(
      `.preset[data-preset="${name}"]`
    );


  selected?.classList.add(
    "selected"
  );


  setAudioStatus(
    `Preset applied: ${name}`
  );


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
  .forEach((button) => {

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
   EXPLORE SEARCH
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
        (
          card.dataset.name ||
          ""
        ).toLowerCase();


      const text =
        (
          card.textContent ||
          ""
        ).toLowerCase();


      const cardCategory =
        card.dataset.category ||
        "";


      const searchMatch =
        !query ||
        name.includes(query) ||
        text.includes(query);


      const categoryMatch =
        category === "all" ||
        cardCategory === category;


      card.style.display =
        searchMatch &&
        categoryMatch
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
   FOCUS TIMER
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


  const safe =
    Math.max(
      0,
      Math.floor(remaining)
    );


  const minutes =
    Math.floor(
      safe / 60
    );


  const seconds =
    safe % 60;


  timerDisplay.textContent =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

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


  clearInterval(timerId);


  remaining =
    Math.round(
      duration * 60
    );


  renderTimer();


  const startedAt =
    Date.now();


  timerId =
    setInterval(() => {

      /*
       * Date.now() prevents timer drift
       * when the phone slows down or
       * the browser throttles JavaScript.
       */

      const elapsed =
        Math.floor(
          (Date.now() - startedAt) / 1000
        );


      remaining =
        Math.max(
          0,
          Math.round(duration * 60) - elapsed
        );


      renderTimer();


      if (remaining <= 0) {

        clearInterval(
          timerId
        );

        timerId = null;

        alert(
          "Focus session complete ☕"
        );

      }

    },1000);

}


/* =========================================================
   TIMER BUTTONS
   ========================================================= */

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


        startTimer(
          minutes
        );

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

    clearInterval(
      timerId
    );

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

}

catch (error) {

  console.error(
    "Memory loading error:",
    error
  );

  memories = [];

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

  return String(value)
    .replace(
      /[&<>"']/g,
      (character) => {

        const entities = {

          "&":"&amp;",
          "<":"&lt;",
          ">":"&gt;",
          '"':"&quot;",
          "'":"&#039;"

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

    memoryList.innerHTML = `
      <p class="empty-memory">
        No memories yet. Add your first Kerala memory ☕
      </p>
    `;

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

    }

    catch (error) {

      console.error(
        "Memory save error:",
        error
      );

    }


    memoryForm.reset();

    renderMemories();

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderMemories();

renderTimer();

setAudioStatus(
  "Ready — tap Start Experience"
);


console.log(
  "PAAL CHAYA V4 loaded ☕"
);

console.log(
  "Audio system ready"
);

console.log(
  "Timer system ready"
);

console.log(
  "Vintage rain atmosphere ready 🌧️"
);