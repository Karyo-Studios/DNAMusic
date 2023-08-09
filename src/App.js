import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";
import ReactSlider from "react-slider";

import FPSStats from "react-fps-stats";

import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import { p1, p2, p3, p4, p5 } from "./defaults";
import { parseSequence, toMidi } from "./helpers";
import { mapN, randRange } from "./utils";
import { queryPattern } from "./pattern";
import { updateEuclid, updateRotation } from "./playhead";

import { SwitchButton } from "./components/switchButton";
import { SingleButton } from "./components/singleButton";

import { PlayheadsView } from "./components/playheads";
import { VisualizerSequence } from "./components/visualizerSequence";
import { VisualizerPlayheads } from "./components/visualizerPlayheads";
import { VisualizerBlobs } from "./components/visualizerBlobs";
import { DnaVisualizer } from "./components/dnaVisualizer";

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
  const [zoom, setZoom] = useState(0.6);
  const [vizParam1, setVizParam1] = useState(0.5);
  const [vizParam2, setVizParam2] = useState(1);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState();
  const [noteOffset, setNoteOffset] = useState(0);
  const noteOffsetRef = useRef(0);

  const [menu, setMenu] = useState(0);

  const [sequenceBounds, setSequenceBounds] = useState([
    0,
    savedSequences[sequenceIndex].sequence.length,
  ]);
  const [initialBounds, setInitialBounds] = useState([
    0,
    savedSequences[sequenceIndex].sequence.length,
  ]);

  const [showSequence, setShowSequence] = useState(true);

  const [activeSequence, setActiveSequence] = useState(sequence);
  const [activeNodes, setActiveNodes] = useState(nodes);

  const width = 1200;
  const height = 650;

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

  // useEffect(() => {}, [sequenceBounds]);

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
    setVizParam1(Math.random() * 0.6 + 0.1);
    setVizParam2(Math.random() * 0.5 + 0.5);
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
      sequenceBounds[1]
    );
    // console.log(sequenceBounds[0]/3, sequenceBounds[1]/3)
    const nodeSnippet = nodes.slice(
      Math.floor(sequenceBounds[0] / 3),
      Math.floor(sequenceBounds[1] / 3)
    );
    // console.log(snippet, nodeSnippet)
    setActiveSequence(snippet);
    setActiveNodes(nodeSnippet);
    const newZoom = mapN(length, 18, 300, 1, 0.7);
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
      <div className="absolute w-[100%] z-[1]"
        style={{borderBottom: '1px solid #fff'}}
      >
        <div className="max-w-[1200px] mx-auto p-[1rem]">
          <div className="w-[100%] z-[1] text-[#aaa] flex justify-between">
            <div>
              <h3>DNA SEQUENCER</h3>
            </div>
            <div>
              <h3>SEQUENCE: <span className="text-[#fff]">SARS-CoV-2</span></h3>
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
          <div className="relative text-[#aaa]" style={{ width: width }}>
            <div className="absolute left-[1rem] top-[-0.5rem]">
              <p>
                START – <span className="text-[#fff]">{sequenceBounds[0]}</span>
              </p>
            </div>
            <div className="absolute right-[1rem] top-[-0.5rem]">
              <p>
                <span className="text-[#fff]">{sequenceBounds[1]}</span> – END
              </p>
            </div>
            <div>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                defaultValue={sequenceBounds}
                ariaLabel={["Lower thumb", "Upper thumb"]}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                // orientation="vertical"
                renderThumb={(props, state) => {
                  return <div {...props} />;
                }}
                minDistance={18}
                min={0}
                max={sequence.length}
                pearling
                onAfterChange={(value, index) => {}}
                onChange={(value) => {
                  setSequenceBounds(value);
                  // setInitialBounds(value);
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="w-[2.5rem] px-[1rem] my-[0.5rem]">
            <div className="flex mt-[0.5rem] text-center text-[#aaa] select-none min-w-[1000px] uppercase">
              <button
                className="bg-[#888] h-[2.5rem] w-[2.5rem] hover:bg-[#aaa] text-[1.2rem] rounded-[0.25rem]"
                onClick={() => (playing ? pause() : play())}
              >
                <div className="pl-[0.1rem] w-[1.2rem] h-[1.2rem] m-auto">
                  {playing ? (
                    <svg
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="5" width="7" height="30" rx="2" fill="white" />
                      <rect x="18" width="7" height="30" rx="2" fill="white" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 28 29" fill="#fff">
                      <path
                        d="M26.7793 13.1932C27.5007 13.5658 27.5007 14.5975 26.7793 14.9701L1.45812 28.0504C0.792534 28.3942 -0.000834731 27.9111 -0.000834699 27.162L-0.000833555 1.00134C-0.000833522 0.252187 0.792537 -0.23095 1.45812 0.112876L26.7793 13.1932Z"
                        fill="#fff"
                      />
                    </svg>
                  )}
                </div>
              </button>
              <button
                className="ml-[0.25rem] bg-[#888] h-[2.5rem] w-[2.5rem] hover:bg-[#aaa] text-[1.2rem] rounded-[0.25rem]"
                onClick={stop}
              >
                <div className="w-[1rem] h-[1rem] m-auto">
                  <svg
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="30" height="30" rx="3" fill="white" />
                  </svg>
                </div>
              </button>
              <div
                className="hidden ml-[1rem] bg-[#888] h-[2.5rem] w-[2.5rem] hover:bg-[#aaa] text-[1.2rem] rounded-[2rem]"
                style={{
                  backgroundColor:
                    playing && ((counter - 1) / 2) % 1 === 0 ? "#888" : "#444",
                }}
              >
                *
              </div>
              {/* {playheads.map((p, index) => {
              return <div>
                <div className="w-[5rem] mr-2 ">
              <button
                className="w-[5rem] p-1 rounded-[0.25rem] bg-[#555] box-sizing"
                style={{
                  // backgroundColor: `hsl(${p.hsl.h*360},${p.hsl.s*100}%,${p.hsl.l})`
                  backgroundColor: p.playing
                    ? `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${
                        p.hsl.l * 100
                      }%)`
                    : `hsla(${p.hsl.h * 360},${p.hsl.s * 100}%,${
                        p.hsl.l * 100
                      }%, 0.2)`,
                  // border: `2px solid ${p.color}`,
                }}
                onClick={() =>
                  updatePlayhead(index, { ...p, playing: !p.playing })
                }
              >
                {p.instrumentName}
              </button>
            </div>
                </div> 
             })} */}
            </div>
          </div>
          <PlayheadsView
            playheads={playheads}
            updatePlayhead={updatePlayhead}
            playing={playing}
            ticker={ticker}
            masterSteps={masterSteps}
            counters={counters}
          />
          <div className="flex items-center mt-[1rem]">
            <div className="flex items-center"></div>
            <div className="hidden">
              <p>RENDERFRAME: {renderCount.current}</p>
              <p>COUNTER: {counter}</p>
            </div>
            <div className="px-[1rem] remix">
              <div
                className="flex justify-center bg-[#888] h-[2.5rem] w-[4rem] hover:bg-[#aaa] rounded-[0.25rem] cursor-pointer"
                onClick={() => generatePattern()}
              >
                <button className="h-[2.5rem] w-[2.5rem]">
                    <svg
                      viewBox="0 0 51 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M45.4056 26.8194L40.497 30.219V25.3578C40.497 25.3578 34.9452 25.3578 33.939 25.3578C24.6084 25.3578 15.9456 8.81821 8.943 8.81821H0V4.89301H8.9436C19.8186 4.89301 26.3814 21.483 33.9396 21.483C34.9956 21.483 40.4976 21.483 40.4976 21.483V16.6218L45.4062 20.0214L50.3178 23.4204L45.4056 26.8194Z"
                        fill="white"
                      />
                      <path
                        d="M25.5292 12.636C25.7542 12.8736 25.9786 13.1124 26.203 13.35C28.8094 10.7376 31.3156 8.736 33.9394 8.736C34.9954 8.736 40.4974 8.736 40.4974 8.736V13.5978L45.406 10.1982L50.3176 6.7986L45.406 3.399L40.4974 0V4.8612C40.4974 4.8612 34.9456 4.8612 33.9394 4.8612C30.3106 4.8612 26.7838 7.3644 23.416 10.4226C24.1366 11.1612 24.841 11.9052 25.5292 12.636Z"
                        fill="white"
                      />
                      <path
                        d="M17.9502 17.9412C17.5704 17.5656 17.1846 17.1846 16.7964 16.8048C14.007 19.407 11.3742 21.4014 8.9436 21.4014H0V25.326H8.9436C13.131 25.326 16.677 22.8642 19.8894 19.839C19.2324 19.2042 18.585 18.5676 17.9502 17.9412Z"
                        fill="white"
                      />
                    </svg>
                </button>
              </div>
              <div className="hidden">
                <p className="mt-3">lock / unlock parameters</p>
              </div>
            </div>
            <div className="mx-[1rem] flex">
              <p>
                TEMPO {bpm}bpm {/* {counter} */}
              </p>
              <div>
                <input
                  type="range"
                  className="w-[10rem] ml-4"
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
            <p className="mx-4 w-[5rem] text-right">STEPS <span>{masterSteps}</span></p>
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
            <p className="mx-4 w-[5rem] text-right">KEY {noteOffset}</p>
            <SwitchButton
              leftOnClick={() => setNoteOffset(noteOffset - 1)}
              rightOnClick={() => setNoteOffset(noteOffset + 1)}
              leftText={"-1"}
              rightText={"+1"}
            />
          </div>
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
                      // setPlaying(false);
                      setZoom(e.target.value);
                    }}
                    step="0.01"
                    aria-label="scale amount slider"
                  />
                </div>
              </div>
              <div className="hidden">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-[1rem] px-[1.5rem] bg-[#222] max-w-[1200px] mx-auto my-[1rem] drop-shadow">
        <div className="mt-1">
          <div className="flex">
            <button
              className="p-2 w-[5rem] rounded-[0.25rem]"
              style={{
                backgroundColor: midiEnabled ? "#555" : "#888",
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
                {WebMidi &&
                  WebMidi._outputs.map((midi, index) => {
                    return (
                      <button
                        key={midi._midiOutput.name}
                        className="mr-2 mt-2 p-1"
                        style={{
                          backgroundColor:
                            index === midiOutputDevice.index ? "#555" : "#888",
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
            className="p-2 max-w-[30rem] w-[80%] min-w-[10rem] bg-[#555]"
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
