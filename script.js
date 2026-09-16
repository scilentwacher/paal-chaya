/* =========================================================
   PAAL CHAYA
   Main JavaScript
   ========================================================= */


/* ================= MENU ================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav?.style.display === "flex";

  if (nav) {
    nav.style.display = open ? "" : "flex";
  }

  menuBtn.setAttribute(
    "aria-expanded",
    String(!open)
  );
});


nav?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 800 && nav) {
      nav.style.display = "";
    }
  });
});


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


/* Default mixer volumes */

const volumes = {
  rain: 55,
  thunder: 25,
  crickets: 40,
  fire: 15,
  train: 10
};


/* Audio objects */

const sounds = {};

audioNames.forEach((name) => {

  const audio = new Audio(`${name}.wav`);

  audio.loop = true;
  audio.preload = "auto";

  /*
    Keep the actual sound comfortable.
    Slider controls the relative volume.
  */

  audio.volume =
    (volumes[name] / 100) * 0.72;

  sounds[name] = audio;

});


let audioPlaying = false;
let audioMuted = false;


/* ================= AUDIO ELEMENTS ================= */

const masterBtn =
  document.getElementById("masterBtn");

const testBtn =
  document.getElementById("testBtn");

const muteBtn =
  document.getElementById("muteBtn");

const audioStatus =
  document.getElementById("audioStatus");


/* ================= STATUS ================= */

function setAudioStatus(message) {

  if (audioStatus) {
    audioStatus.textContent = message;
  }

}


/* ================= START AUDIO ================= */

async function startAudio() {

  try {

    /*
      Browser audio must normally begin
      from a user interaction.
    */

    for (const name of audioNames) {

      sounds[name].muted = audioMuted;

      /*
        Only play sounds whose slider is above 0.
      */

      if (sounds[name].volume > 0) {
        await sounds[name].play();
      }

    }

    audioPlaying = true;

    if (masterBtn) {
      masterBtn.textContent = "⏹ Stop";
    }

    setAudioStatus(
      "Playing Kerala ambience ☕"
    );

  } catch (error) {

    console.error(
      "Audio playback error:",
      error
    );

    setAudioStatus(
      "Audio could not start. Tap Test Rain."
    );

  }

}


/* ================= STOP AUDIO ================= */

function stopAudio() {

  audioNames.forEach((name) => {

    sounds[name].pause();

    sounds[name].currentTime = 0;

  });

  audioPlaying = false;

  if (masterBtn) {
    masterBtn.textContent = "▶ Start";
  }

  setAudioStatus(
    "Stopped — tap Start Experience"
  );

}


/* ================= MASTER BUTTON ================= */

masterBtn?.addEventListener(
  "click",
  async () => {

    if (audioPlaying) {

      stopAudio();

    } else {

      await startAudio();

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
        Create a separate test audio.
        This helps us verify whether rain.wav
        itself can be played by the browser.
      */

      const test = new Audio("rain.wav");

      test.volume = 0.9;
      test.loop = false;

      await test.play();

      setAudioStatus(
        "✅ Rain audio is working"
      );

    } catch (error) {

      console.error(
        "Rain test failed:",
        error
      );

      setAudioStatus(
        "❌ Rain audio failed — check rain.wav"
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

    audioMuted = !audioMuted;

    audioNames.forEach((name) => {
      sounds[name].muted = audioMuted;
    });


    if (audioMuted) {

      muteBtn.textContent = "🔊 Unmute";

      setAudioStatus(
        "🔇 Audio muted"
      );

    } else {

      muteBtn.textContent = "🔇 Mute";

      setAudioStatus(
        audioPlaying
          ? "🔊 Audio playing"
          : "Ready — tap Start Experience"
      );

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

    const output =
      document.getElementById(
        `${soundName}Out`
      );


    function updateSound() {

      const value =
        Number(slider.value);

      /*
        Update displayed percentage.
      */

      if (output) {
        output.textContent =
          `${value}%`;
      }


      /*
        Convert 0–100 slider value
        into comfortable audio volume.
      */

      if (sounds[soundName]) {

        sounds[soundName].volume =
          (value / 100) * 0.72;

      }


      /*
        If the mixer is already playing
        and volume is increased from 0,
        start that sound.
      */

      if (
        audioPlaying &&
        value > 0 &&
        sounds[soundName]?.paused
      ) {

        sounds[soundName]
          .play()
          .catch((error) => {
            console.error(
              `${soundName} playback error:`,
              error
            );
          });

      }

    }


    slider.addEventListener(
      "input",
      updateSound
    );


    /*
      Initialize slider values.
    */

    updateSound();

  });


/* =========================================================
   PRESETS
   ========================================================= */

const presets = {

  mazha: {
    rain: 80,
    thunder: 35,
    crickets: 20,
    fire: 0,
    train: 0
  },

  chaya: {
    rain: 20,
    thunder: 0,
    crickets: 25,
    fire: 10,
    train: 0
  },

  village: {
    rain: 10,
    thunder: 0,
    crickets: 70,
    fire: 5,
    train: 0
  },

  midnight: {
    rain: 25,
    thunder: 5,
    crickets: 65,
    fire: 0,
    train: 0
  },

  study: {
    rain: 45,
    thunder: 5,
    crickets: 15,
    fire: 10,
    train: 0
  },

  sleep: {
    rain: 55,
    thunder: 10,
    crickets: 35,
    fire: 5,
    train: 0
  },

  beach: {
    rain: 0,
    thunder: 0,
    crickets: 25,
    fire: 0,
    train: 0
  },

  train: {
    rain: 5,
    thunder: 0,
    crickets: 10,
    fire: 0,
    train: 75
  }

};


/* Apply preset */

function applyPreset(name) {

  const preset =
    presets[name];

  if (!preset) return;


  audioNames.forEach((soundName) => {

    const value =
      preset[soundName] ?? 0;


    const slider =
      document.querySelector(
        `.sound-slider[data-sound="${soundName}"]`
      );


    const output =
      document.getElementById(
        `${soundName}Out`
      );


    if (slider) {
      slider.value = value;
    }


    if (output) {
      output.textContent =
        `${value}%`;
    }


    if (sounds[soundName]) {

      sounds[soundName].volume =
        (value / 100) * 0.72;

    }

  });


  /*
    If audio is already playing,
    apply the preset immediately.
  */

  if (audioPlaying) {

    audioNames.forEach((soundName) => {

      const value =
        preset[soundName] ?? 0;

      if (
        value > 0 &&
        sounds[soundName].paused
      ) {

        sounds[soundName]
          .play()
          .catch((error) => {
            console.error(error);
          });

      }

      if (value === 0) {

        sounds[soundName].pause();

      }

    });

  }


  setAudioStatus(
    `${name.charAt(0).toUpperCase() + name.slice(1)} preset selected ☕`
  );

}


/* Preset buttons */

document
  .querySelectorAll(".preset")
  .forEach((button) => {

    button.addEventListener(
      "click",
      async () => {

        document
          .querySelectorAll(".preset")
          .forEach((b) => {
            b.classList.remove(
              "selected"
            );
          });


        button.classList.add(
          "selected"
        );


        const presetName =
          button.dataset.preset;

        applyPreset(presetName);


        /*
          If not playing yet,
          automatically start the ambience.
        */

        if (!audioPlaying) {
          await startAudio();
        }

      }

    );

  });


/* =========================================================
   SEARCH / EXPLORE
   ========================================================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

const filter =
  document.getElementById(
    "categoryFilter"
  );


function filterPlaces() {

  const q =
    (searchInput?.value || "")
      .toLowerCase();

  const cat =
    filter?.value || "all";


  document
    .querySelectorAll(".place-card")
    .forEach((card) => {

      const name =
        (
          card.dataset.name || ""
        ).toLowerCase();


      const text =
        (
          card.textContent || ""
        ).toLowerCase();


      const category =
        card.dataset.category;


      const matchesSearch =
        name.includes(q) ||
        text.includes(q);


      const matchesCategory =
        cat === "all" ||
        category === cat;


      card.style.display =
        matchesSearch &&
        matchesCategory
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


/* =========================================================
   FOCUS / SLEEP TIMER
   ========================================================= */

let timerId = null;
let remaining = 0;


const display =
  document.getElementById(
    "timerDisplay"
  );


function renderTimer() {

  if (!display) return;


  const minutes =
    Math.floor(
      remaining / 60
    );


  const seconds =
    remaining % 60;


  display.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* Timer buttons */

document
  .querySelectorAll(".timer")
  .forEach((button) => {

    /*
      Ignore Reset button here.
    */

    if (!button.dataset.min) return;


    button.addEventListener(
      "click",
      () => {

        clearInterval(timerId);


        remaining =
          Number(
            button.dataset.min
          ) * 60;


        renderTimer();


        timerId =
          setInterval(
            () => {

              remaining--;

              renderTimer();


              if (remaining <= 0) {

                clearInterval(
                  timerId
                );

                remaining = 0;

                renderTimer();


                alert(
                  "Focus session complete ☕"
                );

              }

            },
            1000
          );

      }

    );

  });


/* Reset timer */

document
  .getElementById("timerReset")
  ?.addEventListener(
    "click",
    () => {

      clearInterval(timerId);

      timerId = null;

      remaining = 0;

      renderTimer();

    }
  );


/* =========================================================
   ORMA ERA BUTTONS
   ========================================================= */

document
  .querySelectorAll(".era")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".era")
          .forEach((b) => {

            b.classList.remove(
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

const form =
  document.getElementById(
    "memoryForm"
  );

const list =
  document.getElementById(
    "memoryList"
  );


let memories =
  JSON.parse(
    localStorage.getItem(
      "paalChayaMemories"
    ) || "[]"
  );


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


function renderMemories() {

  if (!list) return;


  list.innerHTML =
    memories
      .map(
        (memory) => `

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

        `
      )
      .join("");

}


form?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const title =
      document.getElementById(
        "memoryTitle"
      )?.value || "";


    const year =
      document.getElementById(
        "memoryYear"
      )?.value || "";


    const text =
      document.getElementById(
        "memoryText"
      )?.value || "";


    memories.unshift({

      title,
      year,
      text

    });


    localStorage.setItem(
      "paalChayaMemories",
      JSON.stringify(memories)
    );


    form.reset();

    renderMemories();

  }
);


renderMemories();


/* =========================================================
   INITIAL AUDIO STATUS
   ========================================================= */

setAudioStatus(
  "Ready — tap Start Experience"
);

console.log(
  "☕ PAAL CHAYA audio engine loaded"
);