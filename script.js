const pads = document.querySelectorAll(".drum-pad");

// Click support
pads.forEach(pad => {
  pad.addEventListener("click", () => {
    playSound(pad.dataset.key);
  });
});

// Keyboard support
window.addEventListener("keydown", (e) => {
  playSound(e.key.toUpperCase());
});

function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  if (!audio) return;

  audio.currentTime = 0; // allows rapid replay
  audio.play();

  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  if (pad) {
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 100);
  }
}
