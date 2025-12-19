const { useState, useEffect, useRef } = React;

const DRUM_PADS = [
  { key: 'Q', id: 'Heater-1', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
  { key: 'W', id: 'Heater-2', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
  { key: 'E', id: 'Heater-3', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
  { key: 'A', id: 'Heater-4', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
  { key: 'S', id: 'Clap', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
  { key: 'D', id: 'Open-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
  { key: 'Z', id: 'Kick-n-Hat', src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
  { key: 'X', id: 'Kick', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
  { key: 'C', id: 'Closed-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
];

const DrumMachine = () => {
  const [display, setDisplay] = useState('Drum Machine Ready');
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequence, setSequence] = useState(
    DRUM_PADS.map(() => Array(16).fill(false))
  );
  const [volume, setVolume] = useState(0.5);
  const audioRefs = useRef(DRUM_PADS.map(() => React.createRef()));

  
  const playSound = (index) => {
    const audio = audioRefs.current[index].current;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
    setDisplay(DRUM_PADS[index].id);
  };

  
  const handlePadClick = (index) => {
    playSound(index);
  };

  
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();
      const index = DRUM_PADS.findIndex((pad) => pad.key === key);
      if (index !== -1) {
        playSound(index);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [volume]);

  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000 / 4; 
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % 16;
          sequence.forEach((track, index) => {
            if (track[nextStep]) {
              playSound(index);
            }
          });
          return nextStep;
        });
      }, intervalMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, sequence, volume]);

  
  const toggleStep = (trackIndex, stepIndex) => {
    setSequence((prev) =>
      prev.map((track, i) =>
        i === trackIndex
          ? track.map((step, j) => (j === stepIndex ? !step : step))
          : track
      )
    );
  };

  
  const clearSequence = () => {
    setSequence(DRUM_PADS.map(() => Array(16).fill(false)));
    setDisplay('Sequence Cleared');
  };

  
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    setDisplay(isPlaying ? 'Stopped' : 'Playing Sequence');
  };

  
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    setDisplay(`Volume: ${Math.round(newVolume * 100)}%`);
  };

  
  const handleBpmChange = (e) => {
    const newBpm = parseInt(e.target.value);
    setBpm(newBpm);
    setDisplay(`BPM: ${newBpm}`);
  };

  return (
    <div id="drum-machine">
      <div id="display">{display}</div>
      <div className="drum-pads">
        {DRUM_PADS.map((pad, index) => (
          <div
            key={pad.key}
            className="drum-pad"
            id={pad.id}
            onClick={() => handlePadClick(index)}
          >
            {pad.key}
            <audio
              ref={audioRefs.current[index]}
              className="clip"
              id={pad.key}
              src={pad.src}
            />
          </div>
        ))}
      </div>
      <div className="controls">
        <div>
          <label>BPM: {bpm}</label>
          <input
            type="range"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
          />
        </div>
        <div>
          <label>Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
          />
        </div>
        <button onClick={togglePlay}>{isPlaying ? 'Stop' : 'Play'}</button>
        <button onClick={clearSequence}>Clear Sequence</button>
      </div>
      <div>
        {DRUM_PADS.map((pad, trackIndex) => (
          <div key={pad.key} style={{ margin: '10px 0' }}>
            <span>{pad.id}</span>
            <div className="sequencer">
              {sequence[trackIndex].map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`step ${step ? 'active' : ''} ${
                    currentStep === stepIndex && isPlaying ? 'playing' : ''
                  }`}
                  onClick={() => toggleStep(trackIndex, stepIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


ReactDOM.render(<DrumMachine />, document.getElementById('root'));
