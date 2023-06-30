import React, { useState, useEffect, useMemo } from "react";

import { codonMappings, codonNames, noteMappings } from "./mappings";

import * as Tone from "tone";

import "./App.css";

///////////////////////////////////////////////////////
// Main App
///////////////////////////////////////////////////////
function App() {
  const [sequence, setSequence] = useState();
  const [userInputSequence, setUserInputSequence] = useState(
    "ACTCACCCTGAAGTTCTCAGGATCCACGTGCAGCTTGTCACAGTGCAGCTCACTCAGTGT"
  );
  const [bpm, setBpm] = useState(90);
  const [counter, setCounter] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [synth, setSynth] = useState();

  const parseSequence = (seq) => {
    const splitUp = seq.split("");
    const filtered = splitUp.filter((el) => {
      const l = el.toString().toLowerCase();
      if (l === "c" || l === "a" || l === "t" || l === "g") {
        return l;
      }
    });
    return filtered;
  };

  const stop = () => {
    setCounter(-1);
    setPlaying(false);
  };

  const play = () => {
    if (!audioInitialized) {
      const filter = new Tone.Filter(300, "lowpass", -24).toDestination();
      // const newSynth = new Tone.Synth().connect(filter).toDestination();
      const vol = new Tone.Volume(-40).toDestination();
      const reverb = new Tone.Reverb().toDestination();
      const newSynth = new Tone.PolySynth().chain(vol, filter, reverb).toDestination();
      setSynth(newSynth);
      setAudioInitialized(true);
    }
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const playNote = (note) => {
    if (audioInitialized && playing) {
      synth.triggerAttackRelease(note, '64n');
    }
  };

  useMemo(() => {
    setSequence(parseSequence(userInputSequence));
  }, [userInputSequence]);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        setCounter((counter) => counter + 1);
      }, (60 / bpm / 3) * 1000);
    } else if (!playing && counter !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing, counter]);

  ///////////////////////////////////////////////////////
  // Reading Frame
  ///////////////////////////////////////////////////////
  const ReadingFrame = (props) => {
    const { sequence, offset, counter, player } = props;

    const [playhead, setPlayhead] = useState();
    const [muted, setMuted] = useState(false);

    const nodes = useMemo(() => {
      let amount = 0;
      let tempNodes = [];
      let triNucleotide = "";
      for (let i = offset; i < sequence.length; i++) {
        triNucleotide += sequence[i];
        amount = amount + 1;
        if (amount === 3) {
          // NOTE: We are hard-coding tri-nucleotides
          tempNodes.push(triNucleotide);
          triNucleotide = "";
          amount = 0;
        }
      }
      return tempNodes;
    }, [sequence]);

    useMemo(() => {
      const newPlayhead = Math.floor((counter - offset) / 3) % nodes.length;
      if (nodes) {
        if ((counter - offset) % 3 === 0) {
          if (nodes[newPlayhead] !== undefined) {
            player(noteMappings[codonMappings[nodes[newPlayhead].toUpperCase()]]);
          }
        }
        setPlayhead(newPlayhead);
      }
    }, [counter, nodes]);

    return (
      <div>
        {/* <div>
          {JSON.stringify({playhead, counter, offset, 'len': nodes.length})}
        </div> */}
        <div className="flex">
          <p>Reading frame {offset + 1}</p>
        </div>
        <div className="flex flex-wrap">
          {nodes &&
            nodes.map((node, index) => {
              return (
                <div key={`${node + index}`}>
                  <div
                    className={`${
                      playhead === index ? "border-[#ff0000]" : ""
                    } border-2 bg-[#eee] px-2 py-2 mr-2 w-[3rem] mb-2`}
                  >
                    {node}
                  </div>
                  <p>
                    {codonMappings[node.toUpperCase()]}:{" "}
                    {noteMappings[codonMappings[node.toUpperCase()]]}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const colors = {
    a: "#ffaaff",
    c: "#ffffaa",
    t: "#aaffff",
    g: "#aaffaa",
  };

  return (
    <div className="App text-left max-w-full">
      <p>DNA Sequence:</p>
      <input
        className="p-2 w-[30rem]"
        value={userInputSequence}
        onChange={(e) => setUserInputSequence(e.target.value)}
      />
      <div>
        <p>counter: {counter}</p>
        <p>BPM: {bpm}</p>
        <div>
          <input
            type="range"
            min="1"
            max="400"
            value={bpm}
            onChange={(e) => {
              pause();
              setBpm(e.target.value);
            }}
            step="1"
            aria-label="bpm slider"
          />
        </div>
        <p>playing: {playing ? "YES" : "NO"}</p>
        <div className="flex mb-4">
          <button className="bg-[#ddd] p-2 mr-1" onClick={play}>
            PLAY
          </button>
          <button className="bg-[#ddd] p-2 mr-1" onClick={pause}>
            PAUSE
          </button>
          <button className="bg-[#ddd] p-2 mr-1" onClick={stop}>
            STOP
          </button>
        </div>
        {sequence && (
          <p>
            Playhead position: {counter % sequence.length} / {sequence.length}
          </p>
        )}
      </div>
      <div className="flex flex-wrap">
        {sequence !== undefined &&
          sequence.map((actg, index) => {
            return (
              <div
                className={`${
                  counter % sequence.length === index
                    ? "border-[#ff0000] border-2"
                    : ""
                } w-[2rem] h-[2rem] text-[1.2rem] line-height-[2rem] text-center mb-2`}
                style={{ backgroundColor: `${colors[actg.toLowerCase()]}` }}
                key={`${actg + index}`}
              >
                {actg}
              </div>
            );
          })}
      </div>
      <div>
        {sequence && (
          <div>
            <ReadingFrame
              offset={0}
              counter={counter}
              sequence={sequence}
              player={(note) => playNote(note)}
            />
            <ReadingFrame
              offset={1}
              counter={counter}
              sequence={sequence}
              player={(note) => playNote(note)}
            />
            <ReadingFrame
              offset={2}
              counter={counter}
              sequence={sequence}
              player={(note) => playNote(note)}
            />
          </div>
        )}
      </div>
      <div>
        Mappings:
        <pre>{JSON.stringify(noteMappings, null, 4)}</pre>
      </div>
    </div>
  );
}

export default App;
