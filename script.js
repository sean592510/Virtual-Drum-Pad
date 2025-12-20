const sounds = {
  Q: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  W: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  E: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  A: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  S: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  D: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
};

const pads = document.querySelectorAll(".drum-pad");
const display = document.getElementById("display");

// Play on click
pads.forEach(pad => {
  pad.addEventListener("click", () => {
    playSound(pad.dataset.key);
  });
});

// Play on key press
window.addEventListener("keydown", e => {
  playSound(e.key.toUpperCase());
});

function playSound(key) {
  const audioUrl = sounds[key];
  if (!audioUrl) return;

  const audio = new Audio(audioUrl);
  audio.currentTime = 0;
  audio.play();

  display.innerText = `Playing: ${key}`;
}
