/* =========================================
   PAAL CHAYA — COMPLETE SCRIPT
   Audio + Presets + Timer + Search + Memories
========================================= */


/* =========================================
   1. AUDIO ENGINE
========================================= */

const audioNames = [
  "rain",
  "thunder",
  "crickets",
  "fire",
  "train"
];

const volumes = {
  rain: 55,
  thunder: 25,
  crickets: 40,
  fire: 15,
  train: 10
};

const sounds = {};

let audioPlaying = false;
let audioMuted = false;


/* Load audio files from repository ROOT */

audioNames.forEach(name => {

  const audio = new Audio(`${name}.wav`);

  audio.loop = true;
  audio.preload = "auto";

  audio.volume = volumes[name] / 100 * 0.72;

  sounds[name] = audio;

});


/* =========================================
   AUDIO STATUS
========================================= */

function setAudioStatus(message) {

  const status =
    document.getElementById("audioStatus");

  if (status) {
    status.textContent = message;
  }

}


/* =========================================
   START AUDIO
========================================= */

async function startAudio() {

  try {

    /*
      Start every audio track.
      Mobile browsers require this to happen
      after a user interaction.
    */

    for (const name of audioNames) {

      sounds[name].muted = audioMuted;

      await sounds[name].play();

    }

    audioPlaying = true;

    const masterButton =
      document.getElementById("masterBtn");

    if (masterButton) {
      masterButton.textContent = "⏸ Stop";
    }

    setAudioStatus(
      "🎧 Ambience playing"
    );

  } catch (error) {

    console.error(
      "Audio playback error:",
      error
    );

    setAudioStatus(
      "⚠️ Tap Test Sound to start audio"
    );

  }

}


/* =========================================
   STOP AUDIO
========================================= */

function stopAudio() {

  audioNames.forEach(name => {

    sounds[name].pause();

    sounds[name].currentTime = 0;

  });

  audioPlaying = false;

  const masterButton =
    document.getElementById("masterBtn");

  if (masterButton) {
    masterButton.textContent = "▶ Start";
  }

  setAudioStatus(
    "Audio stopped"
  );

}


/* =========================================
   START / STOP BUTTON
========================================= */

const masterButton =
  document.getElementById("masterBtn");

masterButton?.addEventListener(
  "click",
  () => {

    if (audioPlaying) {

      stopAudio();

    } else {

      startAudio();

    }

  }
);


/* =========================================
   TEST SOUND
========================================= */

const testButton =
  document.getElementById("testBtn");

testButton?.addEventListener(
  "click",
  async () => {

    try {

      const testAudio =
        new Audio("rain.wav");

      testAudio.volume = 0.9;

      await testAudio.play();

      setAudioStatus(
        "🔊 Rain test sound playing"
      );

    } catch (error) {

      console.error(
        "Test audio error:",
        error
      );

      setAudioStatus(
        "⚠️ Audio could not start. Tap again."
      );

    }

  }
);


/* =========================================
   MUTE / UNMUTE
========================================= */

const muteButton =
  document.getElementById("muteBtn");

muteButton?.addEventListener(
  "click",
  () => {

    audioMuted = !audioMuted;

    audioNames.forEach(name => {

      sounds[name].muted = audioMuted;

    });

    if (audioMuted) {

      muteButton.textContent =
        "🔊 Unmute";

      setAudioStatus(
        "🔇 Audio muted"
      );

    } else {

      muteButton.textContent =
        "🔇 Mute";

      setAudioStatus(
        "🎧 Ambience playing"
      );

    }

  }
);


/* =========================================
   2. SOUND SLIDERS
========================================= */

document
  .querySelectorAll(".sound-slider")
  .forEach(slider => {

    slider.addEventListener(
      "input",
      () => {

        const name =
          slider.dataset.sound;

        const value =
          Number(slider.value);

        volumes[name] = value;

        if (sounds[name]) {

          sounds[name].volume =
            audioMuted
              ? 0
              : value / 100 * 0.72;

        }

        const output =
          document.getElementById(
            name + "Out"
          );

        if (output) {

          output.textContent =
            value + "%";

        }

      }
    );

  });


/* =========================================
   3. PRESETS
========================================= */

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


/* =========================================
   PRESET BUTTONS
========================================= */

document
  .querySelectorAll(".preset")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /*
          Remove previous selection
        */

        document
          .querySelectorAll(".preset")
          .forEach(b => {

            b.classList.remove(
              "selected"
            );

          });


        button.classList.add(
          "selected"
        );


        const preset =
          presets[
            button.dataset.preset
          ];

        if (!preset) return;


        /*
          Apply preset volumes
        */

        Object.entries(preset)
          .forEach(
            ([name, value]) => {

              volumes[name] = value;


              const slider =
                document.querySelector(
                  `[data-sound="${name}"]`
                );

              if (slider) {

                slider.value =
                  value;

              }


              const output =
                document.getElementById(
                  name + "Out"
                );

              if (output) {

                output.textContent =
                  value + "%";

              }


              if (sounds[name]) {

                sounds[name].volume =
                  audioMuted
                    ? 0
                    : value / 100 * 0.72;

              }

            }
          );


        /*
          Automatically start ambience
        */

        if (!audioPlaying) {

          startAudio();

        }

      }
    );

  });


/* =========================================
   4. MOBILE MENU
========================================= */

const menuButton =
  document.getElementById("menuBtn");

const navigation =
  document.getElementById("nav");


menuButton?.addEventListener(
  "click",
  () => {

    const isOpen =
      navigation.style.display === "flex";

    navigation.style.display =
      isOpen
        ? ""
        : "flex";

    menuButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

  }
);


navigation
  ?.querySelectorAll("a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        if (window.innerWidth <= 800) {

          navigation.style.display =
            "";

        }

      }
    );

  });


/* =========================================
   5. SEARCH & CATEGORY FILTER
========================================= */

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
    (
      searchInput?.value || ""
    ).toLowerCase();


  const category =
    categoryFilter?.value ||
    "all";


  document
    .querySelectorAll(".place-card")
    .forEach(card => {

      const name =
        (
          card.dataset.name ||
          ""
        ).toLowerCase();


      const text =
        card.textContent.toLowerCase();


      const searchMatch =
        name.includes(query) ||
        text.includes(query);


      const categoryMatch =
        category === "all" ||
        card.dataset.category ===
          category;


      card.style.display =
        searchMatch &&
        categoryMatch
          ? "block"
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


/* =========================================
   6. FOCUS / SLEEP TIMER
========================================= */

let timerId = null;

let remainingSeconds = 0;


const timerDisplay =
  document.getElementById(
    "timerDisplay"
  );


function renderTimer() {

  if (!timerDisplay) return;


  const minutes =
    Math.floor(
      remainingSeconds / 60
    );


  const seconds =
    remainingSeconds % 60;


  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/*
  IMPORTANT:
  Only buttons containing data-min
  are treated as timer buttons.
*/

document
  .querySelectorAll(".timer[data-min]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        clearInterval(timerId);


        remainingSeconds =
          Number(
            button.dataset.min
          ) * 60;


        renderTimer();


        timerId =
          setInterval(
            () => {

              remainingSeconds--;

              renderTimer();


              if (
                remainingSeconds <= 0
              ) {

                clearInterval(
                  timerId
                );

                remainingSeconds =
                  0;

                renderTimer();


                /*
                  Stop ambience when
                  session finishes.
                */

                if (audioPlaying) {

                  stopAudio();

                }


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


/* =========================================
   TIMER RESET
========================================= */

const timerReset =
  document.getElementById(
    "timerReset"
  );


timerReset?.addEventListener(
  "click",
  () => {

    clearInterval(timerId);

    remainingSeconds = 0;

    renderTimer();

  }
);


/* =========================================
   7. ORMA ERA BUTTONS
========================================= */

document
  .querySelectorAll(".era")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".era")
          .forEach(
            item => {

              item.classList.remove(
                "active"
              );

            }
          );


        button.classList.add(
          "active"
        );

      }
    );

  });


/* =========================================
   8. MEMORY SYSTEM
========================================= */

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

  memories = [];

}


/* =========================================
   ESCAPE HTML
========================================= */

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

      return entities[character];

    }
  );

}


/* =========================================
   DISPLAY MEMORIES
========================================= */

function renderMemories() {

  if (!memoryList) return;


  memoryList.innerHTML =
    memories
      .map(memory => {

        const year =
          memory.year
            ? ` · ${escapeHtml(
                memory.year
              )}`
            : "";


        return `
          <article class="memory">

            <strong>
              ${escapeHtml(
                memory.title
              )}
            </strong>

            ${year}

            <p>
              ${escapeHtml(
                memory.text
              )}
            </p>

          </article>
        `;

      })
      .join("");

}


/* =========================================
   SAVE MEMORY
========================================= */

memoryForm?.addEventListener(
  "submit",
  event => {

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


    if (
      !titleInput ||
      !textInput
    ) {

      return;

    }


    const memory = {

      title:
        titleInput.value.trim(),

      year:
        yearInput
          ? yearInput.value.trim()
          : "",

      text:
        textInput.value.trim()

    };


    if (
      !memory.title ||
      !memory.text
    ) {

      return;

    }


    memories.unshift(
      memory
    );


    localStorage.setItem(
      "paalChayaMemories",
      JSON.stringify(memories)
    );


    memoryForm.reset();

    renderMemories();

  }
);


/* =========================================
   INITIAL RENDER
========================================= */

renderMemories();

renderTimer();