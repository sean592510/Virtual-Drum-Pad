const pads = document.querySelectorAll('.drum-pad');

pads.forEach(pad => {
  pad.addEventListener('click', () => {
    playSound(pad.dataset.key);
  });
});

window.addEventListener('keydown', e => {
  playSound(e.key.toUpperCase());
});

function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
}
