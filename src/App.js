import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";

import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import { p1, p2, p3, p4, p5 } from "./defaults";
import { parseSequence, toMidi } from "./helpers";
import { mapN, randRange } from "./utils";
import { queryPattern } from "./pattern";
import { updateEuclid, updateRotation } from "./playhead";

import { SwitchButton } from "./components/switchButton";

import { PlayheadsView } from "./components/playheads";
import { DnaVisualizer } from "./components/dnaVisualizer";
import { SequenceVisualizer } from "./components/sequenceVisualizer";

import {
  noteMappings,
  dnaMapping,
  numberMapping,
  emojiPalettes,
} from "./mappings";
import { loadedSequences, savedSequences } from "./loadedSequences";

import "./App.css";


function App() {
  const [bpm, setBpm] = useState(150);
  const [masterSteps, setMasterSteps] = useState(8);
  const [cps, setCps] = useState(60 / bpm);
  const [nodes, setNodes] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [userInputSequence, setUserInputSequence] = useState(
    savedSequences[sequenceIndex].sequence
  );
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.78);
  const [vizParam1, setVizParam1] = useState(0.5);
  const [vizParam2, setVizParam2] = useState(1);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [audioContext, setAudioContext] = useState();
  const [noteOffset, setNoteOffset] = useState(0);
  const noteOffsetRef = useRef(0);

  useEffect(() => {
    noteOffsetRef.current = noteOffset;
  }, [noteOffset]);

  const bpmRef = useRef(bpm);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const updateTempo = (tempo) => {
    setBpm(tempo);
    setCps(60 / tempo);
  };

  // midi settings
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [midiOutputDevice, setMidiOutputDevice] = useState({ index: -1 });

  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  window.examplePattern = [0, 3 / 8, 3 / 4];
  window.queryPattern = queryPattern;

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

  const captureKeyboardEvent = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault();
      getAudioContext();
      setPlaying(!playing);
    }
    if (event.keyCode >= 49 && event.keyCode < 54) {
      const index = event.keyCode - 49;
      updatePlayhead(index, {
        ...playheads[index],
        playing: !playheads[index].playing,
      });
    }
  };

  useEffect(() => {
    new Promise((resolve) => {
      document.addEventListener("click", async function listener() {
        await getAudioContext();
        resolve();
        document.removeEventListener("click", listener);
      });
    });

    new Promise((resolve) => {
      document.addEventListener("ontouchstart", async function listener() {
        await getAudioContext();
        resolve();
        document.removeEventListener("ontouchstart", listener);
      });
    });

    enableWebMidi();
  }, []);

  const getAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);
      return newAudioContext;
    }
    return audioContext;
  };

  const [ticker, setTicker] = useState(0);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [count5, setCount5] = useState(0);

  const [noteActive1, setNoteActive1] = useState(false);
  const [noteActive2, setNoteActive2] = useState(false);
  const [noteActive3, setNoteActive3] = useState(false);
  const [noteActive4, setNoteActive4] = useState(false);
  const [noteActive5, setNoteActive5] = useState(false);

  const countRef1 = useRef(0);
  const countRef2 = useRef(0);
  const countRef3 = useRef(0);
  const countRef4 = useRef(0);
  const countRef5 = useRef(0);

  const noteActiveRef1 = useRef(0);
  const noteActiveRef2 = useRef(0);
  const noteActiveRef3 = useRef(0);
  const noteActiveRef4 = useRef(0);
  const noteActiveRef5 = useRef(0);

  const counters = [count1, count2, count3, count4, count5];
  const countRefs = [countRef1, countRef2, countRef3, countRef4, countRef5];

  const activeNotes = [
    noteActive1,
    noteActive2,
    noteActive3,
    noteActive4,
    noteActive5,
  ];
  const activeNoteRefs = [
    noteActiveRef1,
    noteActiveRef2,
    noteActiveRef3,
    noteActiveRef4,
    noteActiveRef5,
  ];

  const setCounters = [setCount1, setCount2, setCount3, setCount4, setCount5];
  const setActiveNotes = [
    setNoteActive1,
    setNoteActive2,
    setNoteActive3,
    setNoteActive4,
    setNoteActive5,
  ];

  // playhead pos refs
  useEffect(() => {
    countRef1.current = count1;
  }, [count1]);
  useEffect(() => {
    countRef2.current = count2;
  }, [count2]);
  useEffect(() => {
    countRef3.current = count3;
  }, [count3]);
  useEffect(() => {
    countRef4.current = count4;
  }, [count4]);
  useEffect(() => {
    countRef5.current = count5;
  }, [count5]);

  // note active refs
  useEffect(() => {
    noteActiveRef1.current = noteActive1;
  }, [noteActive1]);
  useEffect(() => {
    noteActiveRef2.current = noteActive2;
  }, [noteActive2]);
  useEffect(() => {
    noteActiveRef3.current = noteActive3;
  }, [noteActive3]);
  useEffect(() => {
    noteActiveRef4.current = noteActive4;
  }, [noteActive4]);
  useEffect(() => {
    noteActiveRef5.current = noteActive5;
  }, [noteActive5]);

  const initPlayheads = (ps) => {
    let initialized = [];
    for (let i = 0; i < ps.length; i++) {
      initialized.push(updateEuclid({ ...ps[i] }));
    }
    return initialized;
  };

  const [playheads, setPlayheads] = useState(
    // initPlayheads([p1, p2])
    initPlayheads([p1, p2, p3, p4, p5])
  );
  const playheadsRef = useRef(null);

  useEffect(() => {
    playheadsRef.current = playheads;
  }, [playheads]);

  const updatePlayhead = (i, p) => {
    setPlayheads([
      ...playheads.slice(0, i),
      {
        ...p,
      },
      ...playheads.slice(i + 1),
    ]);
  };

  const resetCounters = () => {
    for (let i = 0; i < playheads.length; i++) {
      setCounters[i](0);
    }
  };

  const generatePattern = () => {
    // resetCounters();
    setNoteOffset(randRange(-5, 5));
    setVizParam1(Math.random()*0.6 + 0.1)
    setVizParam2(Math.random()*0.5 + 0.5)
    const tempo = randRange(100, 200);
    updateTempo(tempo);
    const special = [5, 7, 15, 10, 7, 7, 13];
    const steps =
      Math.random() > 0.3
        ? randRange(3, 5) * randRange(2, 5)
        : special[Math.floor(Math.random() * special.length)];
    const normalRotation = randRange(0, steps);
    setMasterSteps(steps);
    let updated = [];
    for (let i = 0; i < playheads.length; i++) {
      const events = tempo > 140 ? randRange(1, 5) : randRange(2, steps);
      let playing = i === 0 ? true : Math.random() > 0.3;
      if (!showAdvanced && i > 1) {
        playing = false;
      }
      const p = {
        ...playheads[i],
        steps,
        interval: 4,
        events: i === 3 ? randRange(1, 2) : events,
        rotation: Math.random() > 0.5 ? normalRotation : randRange(0, steps),
        playing: playing,
      };
      updated.push(updateEuclid(p));
    }
    setPlayheads(updated);
  };

  // main loop to update counters
  let clicksPerCycle = 1;
  let clicks = 0;

  useEffect(() => {
    let interval = null;
    let device = null;
    const lookahead = counter + 1;
    if (playing && nodes.length) {
      interval = setInterval(() => {
        clicks++;
        const timeWindow = cps * 1000; // convert fraction to time}
        if (clicks === clicksPerCycle) {
          setCounter(counter + 1);
          clicks = 0;
          for (let j = 0; j < masterSteps; j++) {
            setTimeout(() => {
              setTicker(counter * masterSteps + j);
            }, timeWindow * (j / masterSteps));
          }
          for (let i = 0; i < playheads.length; i++) {
            if (!showAdvanced && i > 1) {
              continue;
            }
            const active = playheads[i];
            const activeRef = playheadsRef.current;
            const haps = queryPattern(
              active.pattern,
              active.interval,
              counter,
              lookahead
            );

            // midi
            if (midiEnabled) {
              device = getDevice(midiOutputDevice.name, WebMidi.outputs);
            }

            haps.forEach((hap) => {
              setTimeout(() => {
                if (activeRef[i].playing) {
                  const pos = countRefs[i].current; // make sure to use ref
                  // for some reason the note is begin rendered one behind the note, TODO investigate this
                  const note =
                    getNote((pos + 1) % nodes.length) + active.offset;
                  setCounters[i]((pos + 1) % nodes.length);
                  if (midiEnabled && midiOutputDevice !== -1) {
                    // play to midi channel of each playhead
                    device.playNote(note + noteOffsetRef.current, i + 1, {
                      duration: active.legato * 1000,
                      attack: 0.8,
                    });
                  } else {
                    playNote(
                      active.instrument,
                      note + noteOffsetRef.current,
                      active.legato * 1000
                    );
                  }
                  setActiveNotes[i](true);
                  setTimeout(() => {
                    setActiveNotes[i](false);
                  }, active.legato * 1000);
                }
              }, timeWindow * (hap - counter));
            });
          }
        }
      }, (cps * 1000) / clicksPerCycle); // clicks);
    } else if (!playing && counter !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing, counter]);

  const stop = () => {
    setCounter(-1);
    resetCounters();
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
    const { nodes, sequence } = parseSequence(userInputSequence);
    setNodes(nodes);
    // setZoom(mapN(sequence.length, 1, 400, 5, 1));
    setSequence(sequence);
    renderCount.current = 0;
    resetCounters();
  }, [userInputSequence]);

  return (
    <div
      onKeyDown={captureKeyboardEvent}
      tabIndex={-1}
      className="App outline-none text-left max-w-full font-mono"
    >
      {!audioContext && (
        <div
          onClick={getAudioContext}
          className="visible md:invisible fixed w-full h-full bg-[rgba(0,0,0,0.5)] top-0 bottom-0 z-[99] flex items-center"
        >
          <div className="text-[#fff] text-center w-[100%]">
            <p>Touch to enable sound</p>
          </div>
        </div>
      )}
      <div className="absolute w-[100%] z-[1]">
        <div className="max-w-[1200px] mx-auto p-[1rem]">
          <div className="flex justify-between">
            <h1 className="text-[2rem]">
              DNA Sequencer{" "}
              {playing && ((counter - 1) / 2) % 1 === 0 ? "*" : ""}{" "}
            </h1>
            {fullscreen && (
              <button
                className="bg-[#666] p-2 mr-1 w-[8rem]"
                onClick={() => setFullscreen(!fullscreen)}
              >
                {!fullscreen ? "fullscreen" : "show UI"}
              </button>
            )}
          </div>
          <div className="my-2 flex items-start">
            <div>
              <p>
                Sequence: <strong>{savedSequences[sequenceIndex].name}</strong>{" "}
              </p>
              <p className="mb-2">
                <u>learn more!</u>
              </p>
              <SwitchButton
                leftOnClick={() => {
                  const newSequenceIndex =
                    sequenceIndex - 1 < 0
                      ? savedSequences.length - 1
                      : sequenceIndex - 1;
                  setUserInputSequence(
                    savedSequences[newSequenceIndex].sequence
                  );
                  setSequenceIndex(newSequenceIndex);
                }}
                rightOnClick={() => {
                  const newSequenceIndex =
                    sequenceIndex + 1 >= savedSequences.length
                      ? 0
                      : sequenceIndex + 1;
                  setUserInputSequence(
                    savedSequences[newSequenceIndex].sequence
                  );
                  setSequenceIndex(newSequenceIndex);
                }}
                leftText={"<"}
                rightText={">"}
              />
            </div>
            <div className="ml-[2rem]">
              <p className="">
                Genomic sequence:{" "}
                <strong>
                  {savedSequences[sequenceIndex].length} basepairs
                </strong>
              </p>
              <p className="">
                Viewing window:{" "}
                <strong>
                  {sequence.length} basepairs (
                  {(
                    (sequence.length / savedSequences[sequenceIndex].length) *
                    100
                  ).toFixed(4)}
                  %)
                </strong>
              </p>
              <p className="">
                Description:{" "}
                <strong>{savedSequences[sequenceIndex].description}</strong>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[0.9rem] bg-[#444] max-w-[1200px] mx-auto mb-[1rem] drop-shadow">
        <SequenceVisualizer
          playing={playing}
          counter={renderCount.current}
          activeNotes={activeNoteRefs}
          sequence={sequence}
          nodes={nodes}
          counters={counters}
          playheads={playheads}
          zoom={zoom}
          param1={vizParam1}
          param2={vizParam2}
        />
        {/* <DnaVisualizer
          playing={playing}
          counter={renderCount.current}
          sequence={sequence}
          nodes={nodes}
          counters={counters}
          playheads={playheads}
          zoom={zoom}
          param1={vizParam1}
          param2={vizParam2}
        /> */}

        <PlayheadsView
            playheads={playheads}
            showAdvanced={showAdvanced}
            updatePlayhead={updatePlayhead}
            playing={playing}
            ticker={ticker}
            masterSteps={masterSteps}
            counters={counters}
        />
        <div className="flex">
          <div className="">
            
          </div>
          <div className="flex items-center mx-auto"></div>
        </div>
        <div className="flex items-center mt-[0.5rem] px-[1rem]">
          <div className="flex items-center">
            <div className="flex">
              <button
                className="bg-[#888] mr-[0.5rem] px-[1rem] py-[1.2rem] hover:bg-[#aaa] text-[1.2rem] w-[7rem] rounded-[0.25rem]"
                onClick={() => (playing ? pause() : play())}
              >
                {playing ? "PAUSE" : "PLAY"}
              </button>
              {/* <button
                className="bg-[#666] mr-[0.5rem] px-[1rem] py-[1.2rem] hover:bg-[#888] text-[1.2rem] w-[6rem] rounded-[0.25rem]"
                onClick={stop}
              >
                STOP
              </button> */}
            </div>
          </div>
          <div className="hidden">
            <p>RENDERFRAME: {renderCount.current}</p>
            <p>COUNTER: {counter}</p>
          </div>
          <div className="flex flex-col">
            <div>
              <button
                className="bg-[#666] mr-[0.5rem] px-[1rem] py-[1.2rem] hover:bg-[#888] text-[1.2rem] w-[6rem] rounded-[0.25rem]"
                onClick={() => generatePattern()}
              >
                Remix
              </button>
            </div>
            <div className="hidden">
              <p className="mt-3">lock / unlock parameters</p>
            </div>
          </div>
          <div className="mx-[1rem]">
            <p>
              tempo: {bpm}bpm {/* {counter} */}
            </p>
            <div>
              <input
                type="range"
                className="w-[10rem]"
                min="20"
                max="260"
                value={bpm}
                onChange={(e) => {
                  updateTempo(e.target.value);
                }}
                step="1"
                aria-label="bpm slider"
              />
            </div>
          </div>
          <p className="ml-3 w-[6rem]">Steps: {masterSteps}</p>
          <SwitchButton
            leftOnClick={() => {
              if (masterSteps > 3) {
                let updated = [];
                for (let i = 0; i < playheads.length; i++) {
                  const cur = playheads[i];
                  updated.push(
                    updateEuclid({ ...cur, steps: masterSteps - 1 })
                  );
                }
                setPlayheads(updated);
                setMasterSteps(masterSteps - 1);
              }
            }}
            rightOnClick={() => {
              if (masterSteps < 16) {
                let updated = [];
                for (let i = 0; i < playheads.length; i++) {
                  const cur = playheads[i];
                  updated.push(
                    updateEuclid({ ...cur, steps: masterSteps + 1 })
                  );
                }
                setPlayheads(updated);
                setMasterSteps(masterSteps + 1);
              }
            }}
            leftStyle={{
              opacity: masterSteps > 3 ? 1 : 0.3,
              fontWeight: "bold",
            }}
            rightStyle={{
              opacity: masterSteps < 16 ? 1 : 0.3,
              fontWeight: "bold",
            }}
            leftText={"<"}
            rightText={">"}
          />
          <p className="ml-4 w-[5rem]">Key: {noteOffset}</p>
          <SwitchButton
            leftOnClick={() => setNoteOffset(noteOffset - 1)}
            rightOnClick={() => setNoteOffset(noteOffset + 1)}
            leftText={"-1"}
            rightText={"+1"}
          />
        </div>
        <div className="">
          <div className="mt-[1rem] hidden">
            <p>Additional sequences:</p>
            <div>
              {loadedSequences.map((seq) => {
                return (
                  <button
                    key={seq.sequence}
                    className="bg-[#777] text-[1rem] p-2 mr-1 mb-1 rounded-[0.25rem]"
                    onClick={() => {
                      //generatePattern();
                      setUserInputSequence(seq.sequence);
                      // setZoom(mapN(seq.sequence.length, 1, 2000, 5, 1));
                    }}
                  >
                    {seq.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="my-2 mt-[2rem]">
            <div className="flex items-center">
              <p className="">zoom: {(zoom * 100).toFixed(1)}%</p>
              <div className="mx-[1rem]">
                <div>
                  <input
                    className="w-[6rem]"
                    type="range"
                    min="0.3"
                    max="1"
                    value={zoom}
                    onChange={(e) => {
                      setZoom(e.target.value);
                    }}
                    step="0.01"
                    aria-label="scale amount slider"
                  />
                </div>
              </div>
              <p className="">param 1:</p>
              <div className="mx-[1rem]">
                <div>
                  <input
                    className="w-[6rem]"
                    type="range"
                    min="0.1"
                    max="1"
                    value={vizParam1}
                    onChange={(e) => {
                      setVizParam1(e.target.value);
                    }}
                    step="0.01"
                    aria-label="viz param 1 amount slider"
                  />
                </div>
              </div>
              <p>{vizParam1}</p>
              <p className="">param 2:</p>
              <div className="mx-[1rem]">
                <div>
                  <input
                    className="w-[6rem]"
                    type="range"
                    min="0.1"
                    max="1"
                    value={vizParam2}
                    onChange={(e) => {
                      setVizParam2(e.target.value);
                    }}
                    step="0.01"
                    aria-label="viz param 2 amount slider"
                  />
                </div>
              </div>
              <p>{vizParam2 + " "}</p>
              <p className="">advanced options</p>
              <input
                value={showAdvanced}
                onClick={() => {
                  setShowAdvanced(!showAdvanced);
                }}
                type="checkbox"
                className="checked:bg-blue-500 ml-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-[1rem] px-[1.5rem] bg-[#444] max-w-[1200px] mx-auto my-[1rem] drop-shadow">
        <div className="mt-1">
          <div className="flex">
            <button
              className="p-2 w-[5rem] rounded-[0.25rem]"
              style={{
                backgroundColor: midiEnabled ? "#666" : "#888",
                textDecoration: midiEnabled ? "none" : "line-through",
              }}
              onClick={() => {
                setMidiEnabled(!midiEnabled);
              }}
            >
              MIDI
            </button>
            <div className="p-2">{midiEnabled ? "enabled" : "disabled"}</div>
          </div>
          <div className="mt-[0.5rem]">
            {midiEnabled && (
              <div>
                {WebMidi._outputs.map((midi, index) => {
                  return (
                    <button
                      key={midi._midiOutput.name}
                      className="mr-2 mt-2 p-1"
                      style={{
                        backgroundColor:
                          index === midiOutputDevice.index ? "#666" : "#888",
                      }}
                      onClick={() => {
                        setMidiOutputDevice({
                          name: midi._midiOutput.name,
                          index,
                        });
                      }}
                    >
                      {midi._midiOutput.name}
                    </button>
                  );
                })}
                <p className="mt-2">{`MIDI signals sent to [playhead n] => [channel n]`}</p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3">{`DNA Sequence (edit):`}</p>
        <div className="flex mt-2">
          <textarea
            className="p-2 max-w-[30rem] w-[80%] min-w-[10rem] bg-[#666]"
            value={userInputSequence}
            onChange={(e) => setUserInputSequence(e.target.value)}
          />
        </div>
        <div>
          <ul className="mt-3">
            <li>Keyboard commands:</li>
            <li>{`- [ spacebar ] = play/pause`}</li>
            <li>{`- [ 1 ] = playhead 1 play/pause`}</li>
            <li>{`- [ 2 ] = playhead 2 play/pause`}</li>
            <li>{`- [ 3 ] = playhead 3 play/pause`}</li>
            <li>{`- [ 4 ] = playhead 4 play/pause`}</li>
            <li>{`- [ 5 ] = playhead 5 play/pause`}</li>
          </ul>
        </div>
        <div className="mt-3">
          {`DNA Amino Acid note mappings`}
          <pre>{JSON.stringify(noteMappings, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
