import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";
import ReactSlider from "react-slider";

import FPSStats from "react-fps-stats";

import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import { p1, p2, p3, p4, p5 } from "./defaults";
import { parseSequence, generatePattern } from "./helpers";
import { mapN, randRange, toMidi } from "./utils";
import { queryPattern } from "./pattern";
import { updateEuclid } from "./playhead";

import { SwitchButton } from "./components/switchButton";
import { PlayPauseButton } from "./components/playPauseButton";
import { RemixButton } from "./components/remixButton";
import { PlayheadButtons } from "./components/playheadButtons";
import { PlayheadsView } from "./components/playheads";
import { VisualizerSequence } from "./components/visualizerSequence";
import { VisualizerPlayheads } from "./components/visualizerPlayheads";
import { VisualizerBlobs } from "./components/visualizerBlobs";
import { DnaVisualizer } from "./components/dnaVisualizer";

import { noteMappings } from "./mappings";
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
  const [zoom, setZoom] = useState(0.6);
  const [vizParam1, setVizParam1] = useState(0.5);
  const [vizParam2, setVizParam2] = useState(1);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState();
  const [noteOffset, setNoteOffset] = useState(0);
  const noteOffsetRef = useRef(0);

  const [sequenceBounds, setSequenceBounds] = useState([
    0,
    savedSequences[sequenceIndex].sequence.length,
  ]);

  const [showSequence, setShowSequence] = useState(true);

  const [activeSequence, setActiveSequence] = useState(sequence);
  const [activeNodes, setActiveNodes] = useState(nodes);

  const width = 1200;
  const height = 600;

  const [menu, setMenu] = useState(2);

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
    if (activeNodes.length && activeNodes[index] !== undefined) {
      return toMidi(noteMappings[activeNodes[index].aminoacid]);
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
              if (WebMidi) {
                device = getDevice(midiOutputDevice.name, WebMidi.outputs);
              }
            }

            haps.forEach((hap) => {
              setTimeout(() => {
                if (activeRef[i].playing) {
                  const pos = countRefs[i].current; // make sure to use ref
                  // for some reason the note is begin rendered one behind the note, TODO investigate this
                  const note =
                    getNote((pos + 1) % activeNodes.length) + active.offset;
                  setCounters[i]((pos + 1) % activeNodes.length);
                  if (midiEnabled && midiOutputDevice !== -1) {
                    // play to midi channel of each playhead
                    device.playNote(note + noteOffsetRef.current, i + 1, {
                      duration: active.legato * timeWindow,
                      attack: 0.8,
                    });
                  } else {
                    playNote(
                      active.instrument,
                      note + noteOffsetRef.current,
                      active.legato * timeWindow
                    );
                  }
                  setActiveNotes[i](true);
                  setTimeout(() => {
                    setActiveNotes[i](false);
                  }, active.legato * timeWindow);
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
    setSequence(sequence);
    renderCount.current = 0;
    setActiveNodes(nodes);
    setActiveSequence(sequence);
    resetCounters();
  }, [userInputSequence]);

  useMemo(() => {
    setActiveNodes(nodes);
    setActiveSequence(sequence);
  }, [sequence]);

  useMemo(() => {
    const length = sequenceBounds[1] - sequenceBounds[0];
    // console.log(nodes.length, sequence.length)
    const snippet = sequence.slice(
      Math.floor(sequenceBounds[0] / 3) * 3,
      Math.floor(sequenceBounds[1] / 3) * 3
    );
    // console.log(sequenceBounds[0]/3, sequenceBounds[1]/3)
    const nodeSnippet = nodes.slice(
      Math.floor(sequenceBounds[0] / 3),
      Math.floor(sequenceBounds[1] / 3)
    );
    // console.log(snippet, nodeSnippet)
    setActiveSequence(snippet);
    setActiveNodes(nodeSnippet);
    const newZoom = mapN(length, 18, 300, 1.3, 0.7);
    setZoom(newZoom < 0.4 ? 0.4 : newZoom);
  }, [sequenceBounds]);

  return (
    <div
      onKeyDown={captureKeyboardEvent}
      tabIndex={-1}
      className="App outline-none text-left max-w-full"
    >
      <FPSStats />
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
      <div
        className="absolute w-[100%] z-[1]"
        style={{ borderBottom: "1px solid #fff" }}
      >
        <div className="max-w-[1200px] mx-auto p-[1rem]">
          <div className="w-[100%] z-[1] text-[#888] flex justify-between">
            <div>
              <h3>DNA SEQUENCER</h3>
            </div>
            <div>
              <h3>
                SEQUENCE: <span className="text-[#fff]">SARS-CoV-2</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[0.9rem] bg-[#222] max-w-[1200px] mx-auto mb-[1rem]">
        {showSequence ? (
          <div
            className="relative"
            style={{
              width: width,
              height: height,
            }}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              className="svg blobs"
            ></svg>
            <VisualizerBlobs
              playing={playing}
              counter={renderCount.current}
              activeNotes={activeNoteRefs}
              sequence={activeSequence}
              nodes={activeNodes}
              countRefs={countRefs}
              playheads={playheads}
              zoom={zoom}
              height={height}
              width={width}
              cps={cps}
            />
            <VisualizerSequence
              sequence={activeSequence}
              nodes={activeNodes}
              zoom={zoom}
              height={height}
              width={width}
            />
            <VisualizerPlayheads
              playing={playing}
              counter={renderCount.current}
              sequence={activeSequence}
              nodes={activeNodes}
              counters={counters}
              playheads={playheads}
              zoom={zoom}
              height={height}
              width={width}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              setVizParam1(Math.random() * 0.6 + 0.1);
              setVizParam2(Math.random() * 0.5 + 0.5);
            }}
          >
            <DnaVisualizer
              playing={playing}
              counter={renderCount.current}
              sequence={activeSequence}
              nodes={activeNodes}
              counters={counters}
              playheads={playheads}
              zoom={zoom}
              param1={vizParam1}
              param2={vizParam2}
            />
          </div>
        )}
        <div>
          <div className="relative text-[#888]" style={{ width: width }}>
            <div className="absolute flex left-[1rem] top-[-1rem]">
              <p className="text-[0.8rem]">
                START{" "}
                <span className="text-[#fff] text-[1.2rem]">
                  {sequenceBounds[0]}
                  {"  -"}
                </span>
              </p>
              <p className="text-[0.8rem]">
                <span className="text-[#fff] text-[1.2rem]">
                  &nbsp;
                  {`${sequenceBounds[1]}`}
                </span>{" "}
                END
              </p>
            </div>
            <div className="absolute flex right-[1rem] top-[-1rem]">
              <p className="text-[0.8rem]">
                <span className="text-[#fff] text-[1.2rem]">
                  {sequenceBounds[1] - sequenceBounds[0]}
                </span>{" "}
                LENGTH
              </p>
            </div>
            <div className="mb-[0.5rem] mt-[0.5rem]">
              <ReactSlider
                className="bounds-slider"
                thumbClassName="bounds-thumb"
                trackClassName="bounds-track"
                defaultValue={sequenceBounds}
                minDistance={18}
                min={0}
                max={sequence.length}
                pearling
                onChange={(value) => {
                  setSequenceBounds(value);
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="px-[1rem] pt-2 pb-[1rem]"
        >
          <div className="flex">
            <div className="mt-[0.5rem]">
              <PlayPauseButton
                playing={playing}
                counter={counter}
                play={play}
                pause={pause}
                stop={stop}
              />
              <div className="mt-[0.5rem]">
                <PlayheadButtons
                  playheads={playheads}
                  updatePlayhead={updatePlayhead}
                />
              </div>
            </div>
            <div className="flex">
              <div>
                <div className="flex justify-end mx-[0.5rem] text-[#fff] tracking-[0.1rem]">
                  <button
                    onMouseOver={() => setMenu(0)}
                    onClick={() => setMenu(0)}
                    className="px-[1.5rem] py-[1rem] rounded-tl-[0.5rem] bg-[#292929]"
                    style={{
                      textDecoration: menu === 0 ? "underline" : "none",
                    }}
                  >
                    DNA
                  </button>
                  <button
                    onMouseOver={() => setMenu(1)}
                    onClick={() => setMenu(1)}
                    className="px-[1.5rem] py-[1rem] bg-[#292929]"
                    style={{
                      textDecoration: menu === 1 ? "underline" : "none",
                    }}
                  >
                    MAPPING
                  </button>
                  <button
                    onMouseOver={() => setMenu(2)}
                    onClick={() => setMenu(2)}
                    className="px-[1.5rem] py-[1rem] bg-[#292929]"
                    style={{
                      textDecoration: menu === 2 ? "underline" : "none",
                    }}
                  >
                    PATTERN
                  </button>
                  <button
                    onMouseOver={() => setMenu(3)}
                    onClick={() => setMenu(3)}
                    className="px-[1.5rem] py-[1rem] rounded-tr-[0.5rem] bg-[#292929]"
                    style={{
                      textDecoration: menu === 3 ? "underline" : "none",
                    }}
                  >
                    SOUND
                  </button>
                </div>
                <div
                  className={`
                  bg-[#292929] mx-[0.5rem] pr-[0.5rem] 
                  rounded-b-[0.5rem] rounded-tl-[0.5rem] 
                  w-[48rem] h-[15.5rem]
                  `}
                >
                  {menu === 0 ? (
                    <div className="py-[0.5rem] px-[1rem]">
                      <p className="mt-3 text-[#888] select-none">
                        DNA SEQUENCE
                      </p>
                      <div className="flex mt-2">
                        <textarea
                          className="p-2 max-w-[30rem] w-[80%] min-w-[10rem] h-[10rem] bg-[#555]"
                          style={{fontFamily: 'monospace'}}
                          value={userInputSequence}
                          onChange={(e) => setUserInputSequence(e.target.value)}
                        />
                      </div>
                      <div className="zoom flex justify-end">
                  <div className="leading-[1rem] ml-[0.25rem] mr-[0.5rem] text-[#888] text-right">
                    <p className="text-[0.7rem]">SCALE</p>
                    <p className="text-[#fff] text-[1rem]">
                      {(zoom * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-[0.25rem] w-[8rem]">
                    <ReactSlider
                      className="tempo-slider"
                      thumbClassName="tempo-thumb"
                      trackClassName="tempo-track"
                      min={0.3}
                      max={1}
                      step={0.01}
                      value={zoom}
                      onChange={(value) => {
                        setZoom(value);
                      }}
                    ></ReactSlider>
                  </div>
                </div>
                    </div>
                  ) : menu === 1 ? (
                    <div className="py-[0.5rem] px-[1rem]">
                      <p className="mt-3 text-[#888] select-none">
                        NOTE MAPPINGS
                      </p>
                      <div className="mt-3">
                        {`DNA Amino Acid note mappings to come.`}
                        {/* <pre>{JSON.stringify(noteMappings, null, 2)}</pre> */}
                      </div>
                    </div>
                  ) : menu === 2 ? (
                    <div>
                      <PlayheadsView
                        playheads={playheads}
                        updatePlayhead={updatePlayhead}
                        playing={playing}
                        ticker={ticker}
                        masterSteps={masterSteps}
                        counters={counters}
                      />
                      <div className="flex items-center pt-[0.5rem] pb-[0.75rem]">
                        <div className="flex items-center">
                          <RemixButton
                            generatePattern={() =>
                              generatePattern({
                                playheads,
                                updateTempo,
                                setNoteOffset,
                                setMasterSteps,
                                setPlayheads,
                              })
                            }
                          />
                          <div className="leading-[1rem] ml-[0.25rem] w-[2rem] mr-[0.5rem] text-[#888] text-center">
                            <p className="text-[0.7rem]">BPM</p>
                            <p className="text-[#fff] text-[1.1rem]">{bpm}</p>
                          </div>
                          <div className=" rounded-[0.25rem] w-[8rem]">
                            <ReactSlider
                              className="tempo-slider"
                              thumbClassName="tempo-thumb"
                              trackClassName="tempo-track"
                              min={20}
                              max={260}
                              step={1}
                              value={bpm}
                              onChange={(value) => {
                                updateTempo(value);
                              }}
                            ></ReactSlider>
                          </div>
                        </div>
                        <div className="leading-[1rem] ml-[0.25rem] w-[2rem] mr-[0.5rem] text-[#888] text-center">
                          <p className="text-[0.7rem]">STEP</p>
                          <p className="text-[#fff] text-[1.1rem]">
                            {masterSteps}
                          </p>
                        </div>
                        <SwitchButton
                          leftOnClick={() => {
                            if (masterSteps > 3) {
                              let updated = [];
                              for (let i = 0; i < playheads.length; i++) {
                                const cur = playheads[i];
                                updated.push(
                                  updateEuclid({
                                    ...cur,
                                    steps: masterSteps - 1,
                                  })
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
                                  updateEuclid({
                                    ...cur,
                                    steps: masterSteps + 1,
                                  })
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
                        <div className="leading-[1rem] ml-[0.5rem] w-[2rem] mr-[0.5rem] text-[#888] text-center">
                          <p className="text-[0.7rem]">KEY</p>
                          <p className="text-[#fff] text-[1.1rem]">
                            {noteOffset}
                          </p>
                        </div>
                        <SwitchButton
                          leftOnClick={() =>
                            setNoteOffset(
                              noteOffset > -12 ? noteOffset - 1 : noteOffset
                            )
                          }
                          rightOnClick={() =>
                            setNoteOffset(
                              noteOffset < 12 ? noteOffset + 1 : noteOffset
                            )
                          }
                          leftText={"-"}
                          rightText={"+"}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-[0.5rem] px-[1rem]">
                      <p className="mt-3 text-[#888] select-none">
                        SOUND SETTINGS
                      </p>
                      <div className="flex">
                        <button
                          className="p-2 mt-[0.5rem] w-[5rem] rounded-[0.25rem]"
                          style={{
                            backgroundColor: midiEnabled ? "#555" : "#888",
                            textDecoration: midiEnabled
                              ? "none"
                              : "line-through",
                          }}
                          onClick={() => {
                            setMidiEnabled(!midiEnabled);
                          }}
                        >
                          MIDI
                        </button>
                        <div className="p-2">
                          {midiEnabled ? "enabled" : "disabled"}
                        </div>
                      </div>
                      <div className="mt-[0.5rem]">
                        {midiEnabled && (
                          <div>
                            {WebMidi &&
                              WebMidi._outputs.map((midi, index) => {
                                return (
                                  <button
                                    key={midi._midiOutput.name}
                                    className="mr-2 mt-2 p-1"
                                    style={{
                                      backgroundColor:
                                        index === midiOutputDevice.index
                                          ? "#555"
                                          : "#888",
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
                  )}
                </div>
                <div className="bg-[#292929] mx-[0.5rem] pr-[0.5rem] rounded-b-[0.5rem] rounded-tl-[0.5rem]"></div>
              </div>
              <div className="">
                <div className="w-[300px] ml-[0.5rem] bg-[#292929] h-[100%] rounded-[0.5rem]">
                  <p className="py-[0.25rem] text-center text-[#888] select-none">
                    CONSOLE
                  </p>
                  <div className="bg-[#444] w-[90%] h-[245px] m-auto p-[0.5rem]">
                    <p>
                      DNA Music sequencer. WIP. 
                      <br/>
                      Press Play to get started. Use headpones or speakers.
                    </p>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
