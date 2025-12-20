const sounds = {
  clap: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/clap.wav',
  hihat: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav',
  kick: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/kick.wav',
  openhat: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav',
  boom: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav',
  snare: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav',
  tom: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav',
  tink: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/tink.wav',
  ride: 'https://cdn.jsdelivr.net/gh/wesbos/JavaScript30@master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav'
};

const pianoNotes = {
  'C4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/C4.mp3',
  'C#4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/Db4.mp3',
  'D4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/D4.mp3',
  'D#4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/Eb4.mp3',
  'E4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/E4.mp3',
  'F4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/F4.mp3',
  'F#4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/Gb4.mp3',
  'G4': 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/G4.mp3'
};

const audioCache = {};
Object.entries({...sounds, ...pianoNotes}).forEach(([k, v]) => {
  const a = new Audio(v); a.preload = 'auto'; audioCache[k] = a;
});

const matrix = document.getElementById('matrix');
const allSounds = ['clap','hihat','kick','openhat','boom','snare','tom','tink','ride',
                   'C4','C#4','D4','D#4','E4','F4','F#4','G4'];
allSounds.forEach((s) => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.sound = s;
  cell.innerHTML = `<div>${s.replace('4','').replace('#',' sharp')}</div>`;
  cell.addEventListener('click', () => playSound(s));
  matrix.appendChild(cell);
});

const masterVol = document.getElementById('masterVolume');
const volValue = document.getElementById('volValue');
masterVol.addEventListener('input', () => {
  volValue.textContent = masterVol.value + '%';
});

const songPatterns = [
  { name: "1", seq: ["kick","hihat","snare","hihat","C4","E4","G4","E4"] },
  { name: "2", seq: ["boom","clap","boom","clap","G4","F4","E4","D4"] },
  { name: "3", seq: ["kick","openhat","snare","openhat","C4","G4","C4","G4"] },
  { name: "4", seq: ["kick","hihat","kick","snare","D4","F#4","A4","F#4"] },
  { name: "5", seq: ["boom","snare","boom","snare","E4","G4","B4","G4"] },
  { name: "6", seq: ["kick","clap","snare","clap","C4","E4","G4","C5"] },
  { name: "7", seq: ["kick","hihat","snare","ride","G4","B4","D5","B4"] },
  { name: "8", seq: ["boom","openhat","boom","clap","F4","A4","C5","A4"] },
  { name: "9", seq: ["kick","snare","kick","snare","C4","D4","E4","G4"] }
];

const patternGrid = document.getElementById('patternGrid');
songPatterns.forEach((p, i) => {
  const btn = document.createElement('div');
  btn.className = 'pattern-btn';
  btn.textContent = p.name;
  btn.dataset.index = i;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    playSongPattern(p.seq);
  });
  patternGrid.appendChild(btn);
});

function playSound(sound, isPattern = false) {
  const audio = isPattern ? new Audio(audioCache[sound].src) : audioCache[sound].cloneNode();
  audio.volume = masterVol.value / 100;
  audio.currentTime = 0;
  audio.play().catch(() => {});

  if (!isPattern) {
    const cell = document.querySelector(`.cell[data-sound="${sound}"]`) || 
                 document.querySelector(`[data-note="${sound}"]`);
    if (cell) {
      cell.classList.add('playing');
      setTimeout(() => cell.classList.remove('playing'), 100);
    }
  }

  if (isSequencing) {
    sequence.push({ sound, time: performance.now() - sequenceStartTime });
  }
}

let patternInterval = null;
function playSongPattern(seq) {
  if (patternInterval) clearInterval(patternInterval);
  let idx = 0;
  const beatMs = 60000 / currentBPM;
  patternInterval = setInterval(() => {
    playSound(seq[idx % seq.length], true);
    idx++;
  }, beatMs);
}

let baseLoop = [], loopInterval = null, isLooping = false;
let sequence = [], isSequencing = false, sequenceStartTime = 0;
let replayTimeout = null;
let currentBPM = 120;

const boomCell = [...matrix.children].find(c => c.dataset.sound === 'boom');
const loopBtn = document.getElementById('loopBtn');
const stopBtn = document.getElementById('stopBtn');
const patternBtn = document.getElementById('patternBtn');
const sequenceBtn = document.getElementById('sequenceBtn');
const replayBtn = document.getElementById('replayBtn');
const patternPanel = document.getElementById('patternPanel');

const bpmSlider = document.getElementById('bpmSlider');
const bpmInput = document.getElementById('bpmInput');
const bpmValue = document.getElementById('bpmValue');
function updateBPM(v) {
  currentBPM = v;
  bpmSlider.value = v; bpmInput.value = v; bpmValue.textContent = v;
  if (isLooping) restartLoop();
  if (patternInterval) restartPattern();
}
bpmSlider.addEventListener('input', () => updateBPM(bpmSlider.value));
bpmInput.addEventListener('change', () => updateBPM(Math.max(60, Math.min(240, bpmInput.value))));

function restartPattern() {
  const active = document.querySelector('.pattern-btn.active');
  if (active) {
    const seq = songPatterns[active.dataset.index].seq;
    playSongPattern(seq);
  }
}

let capturing = false;
loopBtn.addEventListener('click', () => {
  if (isLooping || capturing) return;
  capturing = true; baseLoop = []; 
  const start = performance.now();
  loopBtn.textContent = 'Recording...'; loopBtn.disabled = true;

  setTimeout(() => {
    if (baseLoop.length < 2) { alert("Play Boom twice!"); resetLoop(); return; }
    const duration = baseLoop[baseLoop.length-1] - baseLoop[0];
    startLoop(duration);
    resetLoop();
  }, 8000);
});

function resetLoop() {
  capturing = false; loopBtn.textContent = 'Loop Base'; loopBtn.disabled = false;
}

boomCell.addEventListener('click', () => {
  if (capturing) baseLoop.push(performance.now() - (performance.now() - 8000));
  if (isLooping) return;
  playSound('boom');
});

function startLoop(duration) {
  stopLoop();
  isLooping = true;
  const beatMs = 60000 / currentBPM;
  const loopBeats = duration / beatMs;
  const intervalMs = duration / loopBeats;

  loopInterval = setInterval(() => {
    baseLoop.forEach((t, i) => {
      const delay = i === 0 ? 0 : (t - baseLoop[i-1]) * (beatMs / (duration / (baseLoop.length-1)));
      setTimeout(() => playSound('boom', true), delay);
    });
  }, intervalMs);
  loopBtn.classList.add('active'); stopBtn.disabled = false;
}

function stopLoop() {
  if (loopInterval) clearInterval(loopInterval);
  loopInterval = null; isLooping = false;
  loopBtn.classList.remove('active'); stopBtn.disabled = true;
}
stopBtn.addEventListener('click', stopLoop);

function restartLoop() { 
  if (isLooping) { 
    const d = baseLoop[baseLoop.length-1] - baseLoop[0]; 
    stopLoop(); startLoop(d); 
  } 
}

sequenceBtn.addEventListener('click', () => {
  if (isSequencing) {
    isSequencing = false; sequenceBtn.classList.remove('recording'); sequenceBtn.textContent = 'Sequence';
    replayBtn.disabled = false;
  } else {
    isSequencing = true; sequence = []; sequenceStartTime = performance.now();
    sequenceBtn.classList.add('recording'); sequenceBtn.textContent = 'Stop Sequence';
    replayBtn.disabled = true;
  }
});

replayBtn.addEventListener('click', () => {
  if (sequence.length === 0) return;
  stopReplay();
  let idx = 0; const start = performance.now();
  const step = () => {
    const now = performance.now();
    while (idx < sequence.length && now - start >= sequence[idx].time) {
      playSound(sequence[idx].sound);
      idx++;
    }
    if (idx < sequence.length) replayTimeout = setTimeout(step, 1);
    else { idx = 0; const newStart = performance.now(); start = newStart; replayTimeout = setTimeout(step, 1); }
  };
  step();
  replayBtn.classList.add('active');
});
function stopReplay() { if (replayTimeout) clearTimeout(replayTimeout); replayTimeout = null; replayBtn.classList.remove('active'); }

patternBtn.addEventListener('click', () => {
  patternPanel.classList.toggle('active');
});

document.querySelector('.cell[data-sound="C4"]').addEventListener('click', () => {
  document.getElementById('pianoKeys').style.display = 'flex';
});
document.querySelectorAll('[data-note]').forEach(k => {
  k.addEventListener('click', () => playSound(k.dataset.note));
});

document.addEventListener('keydown', e => {
  const map = { KeyQ: 'clap', KeyW: 'hihat', KeyE: 'kick', KeyA: 'openhat', KeyS: 'boom', KeyZ: 'snare', KeyX: 'tom', KeyC: 'tink' };
  if (map[e.code]) playSound(map[e.code]);
});
