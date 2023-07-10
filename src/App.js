/*

TODOs:
- create options for 
  - legato
  - instruments
  - start / stop

*/

import React, { useState, useEffect, useMemo } from "react";
import { Playhead } from "./playhead";
import { parseSequence, toMidi } from "./helpers";
import { loadSoundfont, startPresetNote } from "sfumato";
import { noteMappings } from "./mappings";
import { loadedSequences } from "./loadedSequences";

import "./App.css";

///////////////////////////////////////////////////////
// Main App
///////////////////////////////////////////////////////
function App() {
  const [userInputSequence, setUserInputSequence] = useState(
    "ACTCACCCTGAAGTTCTCAGGATCCACGTGCAGCTTGTCACAGTGCAGCTCACTCAGTGT"
  );
  const [bpm, setBpm] = useState(90);
  const [cps, setCps] = useState(60 / bpm);
  const [nodes, setNodes] = useState([]);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState();

  // loading sounds
  const fonts = [
    "Vintage Dreams Waves v2",
    "Donkey Kong Country 2014",
    "Earthbound_NEW",
    "SuperMarioWorld",
  ];
  const [fontName, setFontName] = useState(fonts[0]);
  const [presetIndex, setPresetIndex] = useState(0);
  const [loaded, setLoaded] = useState();
  useEffect(() => {
    fontName &&
      loadSoundfont("./soundfonts/" + fontName + ".sf2").then(setLoaded);
  }, [fontName]);

  const getNote = (index) => {
    // make this prettier at some point
    if (nodes.length && nodes[index] !== undefined) {
      return toMidi(noteMappings[nodes[index].aminoacid]);
    }
  };

  const updatePlayhead = (i, p) => {
    setPlayheads([
      ...playheads.slice(0, i),
      {
        ...p,
      },
      ...playheads.slice(i + 1),
    ]);
  };

  const captureKeyboardEvent = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault();
      getAudioContext();
      if (!playing) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    console.log("init");
    new Promise((resolve) => {
      document.addEventListener("click", async function listener() {
        await getAudioContext();
        resolve();
        document.removeEventListener("click", listener);
      });
    });
  }, []);

  const getAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);
      return newAudioContext;
    }
    return audioContext;
  };

  const p1 = new Playhead({
    playing: true,
    interval: 6,
    instrument: 92,
    offset: -12,
    color: "#ffff00",
  });

  const p2 = new Playhead({
    playing: true,
    interval: 4,
    offset: 12,
    instrument: 66,
    legato: 0.5,
    color: "#ff0000",
  });

  const p3 = new Playhead({
    playing: true,
    interval: 16,
    offset: -24,
    instrument: 80,
    legato: 1,
    color: "#00ff00",
  });

  const p4 = new Playhead({
    playing: false,
    interval: 4,
    offset: 0,
    instrument: 92,
    color: "#0000ff",
  });

  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [playheads, setPlayheads] = useState([p1, p2, p3, p4]);

  const checkBang = (playheadIndex, currentCounter) => {
    // TODO: make this logic adapt to more complicated patterns
    return currentCounter % playheads[playheadIndex].interval === 0;
  };

  // main loop to update counters
  useEffect(() => {
    let interval = null;
    if (playing && nodes.length) {
      interval = setInterval(() => {
        setCounter((counter) => counter + 1);

        // batch all audio triggers after updating logic
        let audioQueue = [];
        let updatedCounters = [...counters];

        for (let i = 0; i < playheads.length; i++) {
          if (!playheads[i].playing) {
            continue;
          }
          // check if playhead should play
          if (checkBang(i, counter)) {
            audioQueue.push(i);
            updatedCounters[i] = (counters[i] + 1) % nodes.length;
          }
        }
        setCounters(updatedCounters);

        if (audioQueue.length) {
          // console.log('>>> playing ', audioQueue.length, 'notes')
          audioQueue.forEach((playheadIndex) => {
            const selected = playheads[playheadIndex];
            // playNote(
            //   92,
            //   getNote(updatedCounters[playheadIndex]) + selected.offset,
            //   selected.legato * 500
            // );
            playNote(
              selected.instrument,
              getNote(updatedCounters[playheadIndex]) + selected.offset,
              selected.legato * 500
            );
          });
        }
        // hardcode 8 times per cycle
      }, (cps / 8) * 1000);
    } else if (!playing && counter !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing, counter]);

  const stop = () => {
    setCounter(-1);
    setCounters([0, 0, 0, 0]);
    setPlaying(false);
  };

  const play = () => {
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const playNote = (instrument, note, duration) => {
    if (audioContext) {
      const stopHandle = startPresetNote(
        audioContext,
        loaded.presets[instrument],
        note
      );
      setTimeout(() => stopHandle(), duration);
    } else {
      console.log("no context!");
    }
  };

  useMemo(() => {
    setNodes(parseSequence(userInputSequence));
  }, [userInputSequence]);

  return (
    <div
      onKeyDown={captureKeyboardEvent}
      tabIndex={-1}
      className="App outline-none text-left max-w-full font-mono"
    >
      <div className="py-[1rem] px-[0.5rem] bg-[#f1f1f1] max-w-[1200px] mx-auto my-[1rem] drop-shadow w-[90%]">
        <div>
          <div className="mx-[0.5rem]">
            <h1 className="text-[3rem]">DNA Sonification</h1>
            <p>Sequence:</p>
            <textarea
              className="p-2 max-w-[30rem] w-[80%] min-w-[10rem]"
              value={userInputSequence}
              onChange={(e) => setUserInputSequence(e.target.value)}
            />
          </div>
          <div className="mx-[0.5rem] mb-[1.5rem] flex">
            <div className="flex">
              <button
                className="bg-[#ddd] p-2 mr-1 w-[4rem]"
                onClick={() => (playing ? pause() : play())}
              >
                {playing ? "PAUSE" : "PLAY"}
              </button>
              <button className="bg-[#ddd] p-2 mr-1 w-[4rem]" onClick={stop}>
                STOP
              </button>
            </div>
            <div className="ml-[1rem]">
              <p>
                BPM: {bpm} {playing && ((counter - 1) / 2) % 2 === 0 ? "*" : ""}
              </p>
              {/* <p>COUNTER: {counter}</p> */}
              <div>
                <input
                  type="range"
                  min="1"
                  max="400"
                  value={bpm}
                  onChange={(e) => {
                    setBpm(e.target.value);
                    setCps(60 / e.target.value);
                  }}
                  step="1"
                  aria-label="bpm slider"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap my-3 min-h-[6rem]">
            {nodes.map((node, index) => (
              <div
                className="relative bg-[#ddd] w-[4.5rem] h-[7rem] mx-[0.5rem] mb-[0.5rem] text-center drop-shadow"
                key={node.index}
              >
                <div className="flex flex-col absolute bottom-0 left-0">
                  {playheads.map((p, i) => (
                    <div
                      key={p + i}
                      className={`h-[0.75rem]`}
                      style={{
                        backgroundColor: `${p.color}`,
                        opacity: index === counters[i] ? 1 : 0.2,
                        width:
                          index === counters[i] && playing && p.playing
                            ? "4.5rem"
                            : "0.5rem",
                        transitionDuration:
                          index === counters[i] ? "100ms" : "500ms",
                        msTransitionProperty: "width,opacity",

                        // opacity: p.index === 0 ? 1 : 0.5
                      }}
                    ></div>
                  ))}
                </div>
                <div>
                  {/* <p className="leading-[1.4rem]">{noteMappings[node.aminoacid]}</p> */}
                  <p className="tracking-[0.6rem] font-mono mt-[0.25rem] ml-[0.4rem]">
                    {node.nucleotide}
                  </p>
                  <p className="text-[1.5rem] leading-[2rem]">
                    {node.aminoacid}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-[0.5rem]">
          {playheads.map((p, index) => (
            <div
              key={"playheads" + index}
              className="border-l-[0.5rem] relative my-4 px-2 flex"
              style={{
                borderColor: `${p.color}`,
              }}
            >
              <button
                className="p-2 mr-1"
                style={{
                  backgroundColor: p.playing ? "#ddd" : "#bbb",
                }}
                onClick={() =>
                  updatePlayhead(index, p.playing ? p.pause() : p.start())
                }
              >
                Playhead {index + 1}
              </button>
              <div className="px-3 w-[6rem] leading-[2.7rem]">
                Pos: {counters[index]}
              </div>
              <div className="px-3 w-[7rem] leading-[2.7rem]">
                Step: {p.interval}
              </div>
              <button
                className="bg-[#ddd] p-2 mr-1 w-[2rem]"
                onClick={() => {
                  updatePlayhead(index, p.updateStep(p.interval - 1));
                }}
              >
                -
              </button>
              <button
                className="bg-[#ddd] p-2 mr-1 w-[2rem]"
                onClick={() => {
                  const updated = p.updateStep(p.interval + 1);
                  updatePlayhead(index, updated);
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div className="mx-[0.5rem]">
          <div className="mt-[2rem]">
            <p>Additional sequences:</p>
            <div>
              {loadedSequences.map((seq) => {
                return (
                  <button
                    className="bg-[#ddd] text-[1rem] p-2 mr-1 mb-1"
                    onClick={() => setUserInputSequence(seq.sequence)}
                  >
                    {seq.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* <div>
        Mappings:
        <pre>{JSON.stringify(noteMappings, null, 4)}</pre>
      </div> */}
        {/* {loaded?.presets.map((preset, i) => (
        <button
          key={i}
          className={`p-2 text-s rounded-md mb-1 mr-1 ${
            presetIndex === i ? "bg-[#aaa]" : "bg-[#eee]"
          }`}
          onClick={() => {
            setPresetIndex(i);
            console.log("select preset", preset);
            const stopHandle = startPresetNote(audioContext, preset, 48);
            setTimeout(() => stopHandle(), 300);
          }}
        >
          {i + ": " + preset.header.name}
        </button>
      ))} */}
      </div>
    </div>
  );
}

export default App;
