import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";
import ReactSlider from "react-slider";

import FPSStats from "react-fps-stats";

import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import { p1, p2, p3, p4, p5 } from "./defaults";
import { parseSequence, generatePattern, interpretSequence } from "./helpers";
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
import { VisualizerMappings } from "./components/visualizerMappings";

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
  const [userSequence, setUserSequence] = useState("hello world");
  const [zoom, setZoom] = useState(0.6);
  const [vizParam1, setVizParam1] = useState(0.5);
  const [vizParam2, setVizParam2] = useState(1);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState();
  const [noteOffset, setNoteOffset] = useState(0);
  const noteOffsetRef = useRef(0);

  const [showFPS, setShowFPS] = useState(false);
  const [showViz, setShowViz] = useState(true);

  const sequenceRef = useRef(sequence);

  const [sequenceBounds, setSequenceBounds] = useState([
    0,
    savedSequences[sequenceIndex].sequence.length,
  ]);

  const boundsRef = useRef(sequenceBounds);

  const [showSequence, setShowSequence] = useState(true);

  const [activeSequence, setActiveSequence] = useState(sequence);
  const [activeNodes, setActiveNodes] = useState(nodes);

  const [playheadCount, setPlayheadCount] = useState(2);

  const calculatedHeight = window.innerHeight - 20 * 22;

  const width = 62 * 20;
  const height = calculatedHeight < 400 ? 400 : calculatedHeight;

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
    const active = document.activeElement;
    if (active.id === "user-input-dna" || active.id === "user-input-name")
      return;
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

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    window.addEventListener("resize", (event) => {
      console.log("resize");
      setClearClick(clearClick + 1);
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

  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [holdLength, setHoldLength] = useState(false);
  const [clearClick, setClearClick] = useState(0);

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
          for (let i = 0; i < playheadCount; i++) {
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
    sequenceRef.current = sequence;
    setActiveNodes(nodes);
    setActiveSequence(sequence);
    setSequenceBounds([0, sequence.length]);
    boundsRef.current = [0, sequence.length];
    resetCounters();
  }, [userInputSequence]);

  useMemo(() => {
      const seq = interpretSequence(userSequence)
      setUserInputSequence(seq)
  }, [userSequence])

  useEffect(() => {
    boundsRef.current = sequenceBounds;
  }, [sequenceBounds]);

  useMemo(() => {
    setActiveNodes(nodes);
    setActiveSequence(sequence);
  }, [sequence]);

  useMemo(() => {
    const length = sequenceBounds[1] - sequenceBounds[0];
    // console.log(nodes.length, sequence.length)
    const snippet = sequence.slice(sequenceBounds[0], sequenceBounds[1]);
    // console.log(sequenceBounds[0]/3, sequenceBounds[1]/3)
    const nodeSnippet = nodes.slice(
      Math.ceil(sequenceBounds[0] / 3),
      Math.floor(sequenceBounds[1] / 3)
    );
    // console.log(snippet, nodeSnippet)
    setActiveSequence(snippet);
    setActiveNodes(nodeSnippet);
    if (showOnlyActive) {
      const newZoom = mapN(length, 18, 300, 1, 0.6);
      setZoom(newZoom < 0.4 ? 0.4 : newZoom);
    } else {
      const newZoom = mapN(sequence.length, 18, 300, 1, 0.6);
      setZoom(newZoom < 0.4 ? 0.4 : newZoom);
    }
  }, [sequenceBounds, showOnlyActive]);

  return (
    <div
      onKeyDown={captureKeyboardEvent}
      tabIndex={-1}
      className="App outline-none text-left max-w-full select-none"
      onClick={() => {
        setClearClick(clearClick + 1);
      }}
    >
      {showFPS && <FPSStats />}
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
        <div className="max-w-[62rem] mx-auto p-[1rem]">
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
      <div className="text-[0.9rem] bg-[#181818] max-w-[62rem] mx-auto mb-[0rem]">
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
          {showViz && (
            <VisualizerBlobs
              playing={playing}
              counter={renderCount.current}
              activeNotes={activeNoteRefs}
              bounds={sequenceBounds}
              activeSequence={activeSequence}
              showOnlyActive={showOnlyActive}
              sequence={sequence}
              nodes={nodes}
              activeNodes={activeNodes}
              countRefs={countRefs}
              playheads={playheads}
              zoom={zoom}
              height={height}
              width={width}
              cps={cps}
              clearClick={clearClick}
              playheadCount={playheadCount}
            />
          )}
          <VisualizerSequence
            bounds={sequenceBounds}
            showOnlyActive={showOnlyActive}
            sequence={sequence}
            nodes={nodes}
            activeSequence={activeSequence}
            activeNodes={activeNodes}
            zoom={zoom}
            height={height}
            width={width}
            playheadCount={playheadCount}
          />
          <VisualizerPlayheads
            playing={playing}
            counter={renderCount.current}
            bounds={sequenceBounds}
            showOnlyActive={showOnlyActive}
            sequence={sequence}
            nodes={nodes}
            activeSequence={activeSequence}
            activeNodes={activeNodes}
            counters={counters}
            playheads={playheads}
            zoom={zoom}
            height={height}
            width={width}
            playheadCount={playheadCount}
          />
        </div>
        <div>
          <div className="relative text-[#888]" style={{ width: width }}>
            <div className="absolute flex left-[1rem] top-[-1rem]">
              <p className="text-[0.8rem]">
                START{" "}
                <span className="text-[#fff] text-[0.8rem]">
                  {sequenceBounds[0]}
                  {"  -"}
                </span>
              </p>
              <p className="text-[0.8rem]">
                <span className="text-[#fff] text-[0.8rem]">
                  &nbsp;
                  {`${sequenceBounds[1]}`}
                </span>{" "}
                END
              </p>
            </div>
            <div className="absolute flex right-[1rem] top-[-1rem]">
              <p className="text-[0.8rem]">
                LENGTH{" "}
                <span className="text-[#fff] text-[0.8rem]">
                  {sequenceBounds[1] - sequenceBounds[0]}/{sequence.length}
                </span>
              </p>
            </div>
            <div className="mb-[0.5rem] mt-[0.5rem]">
              <ReactSlider
                className="bounds-slider"
                thumbClassName="bounds-thumb"
                trackClassName="bounds-track"
                defaultValue={sequenceBounds}
                value={boundsRef.current}
                minDistance={
                  sequenceRef.current.length > 6
                    ? 6
                    : sequenceRef.current.length
                }
                min={0}
                max={
                  sequenceRef.current.length > 1
                    ? sequenceRef.current.length
                    : 1
                }
                pearling
                onChange={(value, index) => {
                  setSequenceBounds(value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="px-[1rem] pt-2">
          <div className="flex">
            <div className="">
              <PlayPauseButton
                playing={playing}
                counter={counter}
                play={() => {
                  play();
                  // setMenu(2);
                }}
                pause={pause}
                stop={stop}
              />
              <div className="">
                <PlayheadButtons
                  playheads={playheads}
                  updatePlayhead={updatePlayhead}
                  playheadCount={playheadCount}
                  setPlayheadCount={setPlayheadCount}
                />
              </div>
            </div>
            <div className="flex">
              <div>
                <div className="flex justify-start mx-[0.5rem] items-end">
                  <div className="flex text-[#ddd] rounded-t-[0.5rem]">
                    <div className="bg-[#292929] px-[1.5rem] rounded-t-[0.5rem] cursor-pointer"
                                          onClick={() => setMenu(0)}
                      style={{
                        // textDecoration: menu === 0 ? "underline" : "none",
                        backgroundColor: menu === 0 ? "#292929" : "#181818",
                      }}
                    >
                      <button
                      onMouseOver={() => setMenu(0)}
                      className="tracking-[0.1rem] pb-[0.5rem] pt-[0.75rem]"
                    >
                      DNA
                    </button>
                    </div>
                    <div className="bg-[#292929] px-[1.5rem] rounded-t-[0.5rem] cursor-pointer"
                                          onClick={() => setMenu(1)}
                      style={{
                        // textDecoration: menu === 1 ? "underline" : "none",
                        backgroundColor: menu === 1 ? "#292929" : "#181818",
                      }}
                    >
                      <button
                      onMouseOver={() => setMenu(1)}
                      className="tracking-[0.1rem] pb-[0.5rem] pt-[0.75rem]"
                    >
                      MAPPING
                    </button>
                    </div>
                    <div className="bg-[#292929] px-[1.5rem] rounded-t-[0.5rem] cursor-pointer"
                                          onClick={() => setMenu(2)}
                      style={{
                        // textDecoration: menu === 2 ? "underline" : "none",
                        backgroundColor: menu === 2 ? "#292929" : "#181818",
                      }}
                    >
                      <button
                      onMouseOver={() => setMenu(2)}
                      className="tracking-[0.1rem] pb-[0.5rem] pt-[0.75rem]"
                    >
                      PATTERN
                    </button>
                    </div>
                    <div className="bg-[#292929] px-[1.5rem] rounded-t-[0.5rem] cursor-pointer"
                                          onClick={() => setMenu(3)}
                      style={{
                        // textDecoration: menu === 3 ? "underline" : "none",
                        backgroundColor: menu === 3 ? "#292929" : "#181818",
                      }}
                    >
                      <button
                      onMouseOver={() => setMenu(3)}
                      className="tracking-[0.1rem] pb-[0.5rem] pt-[0.75rem]"
                    >
                      SOUND
                    </button>
                    </div>
                  </div>
                  <div className="flex items-center h-[2.6rem] ml-[1.6rem]">
                    <div className="leading-[1rem] ml-[0.25rem] px-2 text-[#888] text-center">
                      <p className="text-[0.7rem]">BPM</p>
                      <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
                        {bpm}
                      </p>
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
                </div>
                <div
                  className={`
                  bg-[#292929] mx-[0.5rem] pr-[0.5rem] 
                  rounded-b-[0.5rem] rounded-tr-[0.5rem] 
                  w-[39rem] h-[15.5rem]
                  `}
                  style={{
                    borderTopLeftRadius: menu === 0 ? 0 : "0.5rem",
                  }}
                >
                  {menu === 0 ? (
                    <div className="py-[0.5rem] px-[0.5rem] text-[0.8rem]">
                      <div className="flex mb-[0.25rem] text-[#888] text-[0.8rem] select-none">
                        <p className="text-center w-[6rem]">DNA SEQUENCE</p>
                      </div>
                      {true ? 
                        <div>
                          <div className="flex mt-1">
                            <input
                              id="user-input-name"
                              className={`px-2 text-[1.2rem] 
                              w-[25rem] h-[1.9rem] bg-[#555] rounded-[0.25rem]`}
                              style={{ fontFamily: "monospace" }}
                              value={userSequence}
                              defaul
                              onChange={(e) => {
                                setUserSequence(e.target.value);
                              }}
                            />
                          </div>
                          <div className="flex mt-[0.25rem]">
                            <div
                              className="overflow-y-scroll p-2 w-[25rem] min-h-[4rem] max-h-[6rem] h-[6rem] bg-[#333] rounded-[0.25rem]"
                              style={{ fontFamily: "monospace" }}
                            >
                              <p className="break-all select-text">{userInputSequence}</p>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="flex mt-[0.25rem] pointer-events-none">
                            <textarea
                              id="user-input-dna"
                              className="text-wrap p-2 w-[25rem] min-h-[4rem] max-h-[6rem] h-[6rem] bg-[#555] rounded-[0.25rem]"
                              style={{ fontFamily: "monospace" }}
                              value={userInputSequence}
                              onChange={(e) =>
                                setUserInputSequence(e.target.value)
                              }
                            >
                              {userInputSequence}
                            </textarea>
                          </div>
                      }
                    </div>
                  ) : menu === 1 ? (
                    <div className="p-[0.5rem]">
                      <div className="">
                        {/* <pre>{JSON.stringify(noteMappings, null, 2)}</pre> */}
                        <VisualizerMappings
                          playheads={playheads}
                          countRefs={countRefs}
                          counters={counters}
                          activeNodes={activeNodes}
                          playheadCount={playheadCount}
                        />
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
                        playheadCount={playheadCount}
                      />
                      <div className="flex items-center pt-[0.4rem] pb-[0.75rem]">
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
                        </div>
                        <div className="leading-[1rem] ml-[0.25rem] px-2 text-[#888] text-center">
                          <p className="text-[0.7rem]">STEP</p>
                          <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
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
                        <div className="leading-[1rem] ml-[0.25rem] px-2 text-[#888] text-center">
                          <p className="text-[0.7rem]">KEY</p>
                          <p className="text-[#fff] text-[1rem] mt-[-0.15rem]">
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
                    <div className="p-[0.5rem]">
                      <p className="text-[#888] text-[0.8rem] select-none">
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
                <div className="h-[2.6rem] flex items-center justify-stretch">
                  <div className="flex h-[100%] items-center justify-end ">
                    <div className="zoom flex justify-end">
                      <div className="rounded-[0.25rem] w-[5rem] ml-[0.5rem]">
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
                    {activeSequence.length < sequence.length && (
                      <div className="flex ml-[0.5rem]">
                        <button
                          onClick={() => {
                            setSequenceBounds([0, sequence.length]);
                            boundsRef.current = [0, sequence.length];
                          }}
                          className="uppercase rounded-[0.25rem] mr-2"
                        >
                          Reset
                        </button>
                        <p className="text-[#888] uppercase">View:&nbsp;</p>
                        <button
                          onClick={() => setShowOnlyActive(!showOnlyActive)}
                          className="uppercase rounded-[0.25rem]"
                        >
                          {showOnlyActive ? "active" : "all"}
                        </button>
                        {/* <p className="ml-2 text-[#888] uppercase">Length:&nbsp;</p>
                      <button
                        onClick={() => setHoldLength(!holdLength)}
                        className="uppercase rounded-[0.25rem]"
                        style={{
                          textDecoration: 'underline'
                        }}>
                        {holdLength ? 'hold' : 'free'}
                      </button> */}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[16.5rem] p-[0.5rem]  ml-[0rem] bg-[#292929] rounded-[0.5rem]">
                  <div className="bg-[#333] h-[14.5rem] m-auto p-[0.5rem]">
                    <p>
                      DNA Music sequencer. WIP.
                      <br />
                      Press Play to get started. Use headpones or speakers.
                    </p>
                    <div>
                      <button
                        className="mt-4"
                        onClick={() => setShowFPS(!showFPS)}
                      >
                        FPS {showFPS ? "hide" : "show"}
                      </button>
                    </div>
                    <div>
                      <button
                        className="mt-4"
                        onClick={() => setShowViz(!showViz)}
                      >
                        Viz {showViz ? "hide" : "show"}
                      </button>
                    </div>
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
