import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactSlider from "react-slider";
//
import { WebAudioFontPlayer } from "./soundfonts/WebAudioFont";

import FPSStats from "react-fps-stats";

import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import { p1, p2, p3, p4, p5 } from "./defaults";
import {
  parseSequence,
  parseAllSequence,
  generatePattern,
  interpretSequence,
} from "./helpers";
import { mapN, randRange, toMidi } from "./utils";
import { queryPattern } from "./pattern";
import { updateEuclid } from "./playhead";

import { presetMappings, presetOrder, instruments } from "./soundfonts";

import { SwitchButton } from "./components/switchButton";
import { PlayPauseButton } from "./components/playPauseButton";
import { RemixButton } from "./components/remixButton";
import { PlayheadButtons } from "./components/playheadButtons";
import { PlayheadsView } from "./components/playheads";
import { SequenceInput } from "./components/sequenceInput";
import { VisualizerSequence } from "./components/visualizerSequence";
import { VisualizerPlayheads } from "./components/visualizerPlayheads";
import { VisualizerBlobs } from "./components/visualizerBlobs";
import { VisualizerMappings } from "./components/visualizerMappings";

import { noteMappings } from "./mappings";
import { loadedSequences, savedSequences } from "./loadedSequences";

import "./App.css";
import { SequenceBoundsSlider } from "./components/sequenceBoundsSlider";

function App() {
  const [menu, setMenu] = useState(0);
  const [selectedPlayhead, setSelectedPlayhead] = useState(0);
  const [modal, setModal] = useState(true);

  const [selectedPreset, setSelectedPreset] = useState(0);

  const [bpm, setBpm] = useState(150);
  const [playheadCount, setPlayheadCount] = useState(2);
  const [masterSteps, setMasterSteps] = useState(8);
  const [noteOffset, setNoteOffset] = useState(0);
  const noteOffsetRef = useRef(0);

  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [userInputSequence, setUserInputSequence] = useState(
    savedSequences[sequenceIndex].sequence
  );

  const [userSequence, setUserSequence] = useState("");
  const [zoom, setZoom] = useState(0.6);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [cps, setCps] = useState(60 / bpm);

  const [nodes, setNodes] = useState([]);
  const [sequence, setSequence] = useState([]);

  const [counter, setCounter] = useState(0);

  const [audioContext, setAudioContext] = useState();

  const [showFPS, setShowFPS] = useState(false);
  const [showViz, setShowViz] = useState(true);

  const sequenceRef = useRef(sequence);

  const [sequenceBounds, setSequenceBounds] = useState([
    0,
    savedSequences[sequenceIndex].sequence.length,
  ]);

  const boundsRef = useRef(sequenceBounds);

  const [activeSequence, setActiveSequence] = useState(sequence);
  const [activeNodes, setActiveNodes] = useState(nodes);

  const calculatedHeight = window.innerHeight - 20 * 20;
  const width = window.innerWidth < 1300 ? 1000 : 1200;
  const height = calculatedHeight < 350 ? 350 : calculatedHeight;

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

 
  const [players, setPlayers] = useState();

  const initializePlayers = (audioContext) => {
    let audioPlayers = [];
    playheads.forEach((p, index) => {
      console.log(p)
      const player = new WebAudioFontPlayer();
      const preset = presetMappings.find(x => x.name === p.preset);
      console.log(preset, p.preset)
      if (!preset) {
        console.error('incorrect preset mapping')
      }
      player.adjustPreset(audioContext, preset.file);
      audioPlayers.push(player)
    })
    setPlayers(audioPlayers);
  };

  const playSoundFont = (index, presetName, midi, duration, volume) => {
    const audioContext = getAudioContext();
    console.log("playing", presetName, midi, duration, volume);
    const preset = presetMappings.find(x => x.name === presetName);
    if (preset) {
      players[index].queueWaveTable(
        audioContext,
        audioContext.destination,
        preset.file,
        audioContext.currentTime + 0.01,
        midi,
        duration / 1000,
        volume
      );
    }
  };

  const getNote = (index) => {
    // make this prettier at some point
    if (activeNodes.length && activeNodes[index] !== undefined) {
      const acid = activeNodes[index].aminoacid;
      if (acid !== "-1") {
        return toMidi(noteMappings[acid]);
      }
      return -1;
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
      setClearClick(clearClick + 1);
    });

    enableWebMidi();
  }, []);

  const getAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);
      initializePlayers(newAudioContext);
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
                  const base = getNote((pos + 1) % activeNodes.length);
                  const note = base + active.offset;
                  setCounters[i]((pos + 1) % activeNodes.length);
                  if (parseInt(base) !== -1) {
                    if (midiEnabled && midiOutputDevice !== -1) {
                      // play to midi channel of each playhead
                      device.playNote(note + noteOffsetRef.current, i + 1, {
                        duration: active.legato * timeWindow,
                        attack: 0.8,
                      });
                    } else {
                      // playNote(
                      //   active.instrument,
                      //   note + noteOffsetRef.current,
                      //   active.legato * timeWindow
                      // );
                      playSoundFont(
                        i,
                        active.preset,
                        note + noteOffsetRef.current,
                        active.legato * timeWindow,
                        0.4
                      );
                    }
                    setActiveNotes[i](true);
                    setTimeout(() => {
                      setActiveNotes[i](false);
                    }, active.legato * timeWindow);
                  }
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

  useMemo(() => {
    // const { nodes, sequence } = parseSequence(userInputSequence);
    const { nodes, sequence } = parseAllSequence(userInputSequence);
    setNodes(nodes);
    setSequence(sequence);
    renderCount.current = 0;
    sequenceRef.current = sequence;
    setActiveNodes(nodes);
    setActiveSequence(sequence);
    setSequenceBounds([0, sequence.length]);
    boundsRef.current = [0, sequence.length];
    // resetCounters();
  }, [userInputSequence]);

  useMemo(() => {
    const seq = interpretSequence(userSequence);
    setUserInputSequence(seq);
  }, [userSequence]);

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
      const newZoom = mapN(sequence.length, 18, 200, 1, 0.6);
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
      {modal && (
        <div
          onClick={() => {
            getAudioContext();
          }}
          className="visible fixed w-full h-full bg-[rgba(0,0,0,0.6)] top-0 bottom-0 z-[999] flex items-center"
        >
          <div className="enter relative text-[#fff] text-center w-[25rem] bg-[#181818] px-[1rem] py-[3rem] mx-auto">
            <h3 className="text-[1.4rem]">DNA SEQUENCER</h3>
            <p className="">Translate DNA into music</p>
            <p className="mt-4 text-[0.8rem]">
              Type your name or phrase to get started!
            </p>
            <div className="flex flex-col items-center">
              <SequenceInput
                userSequence={userSequence}
                setUserSequence={setUserSequence}
                userInputSequence={userInputSequence}
                setUserInputSequence={setUserInputSequence}
              />
              <button
                className="mt-3 py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                style={{
                  cursor: userSequence.length > 0 ? "pointer" : "initial",
                  opacity: userSequence.length > 0 ? 1 : 0.5,
                }}
                onClick={() => {
                  if (userSequence.length > 0) {
                    setModal(false);
                    play();
                  }
                }}
              >
                Create melody!
              </button>
              {/* <button
                className="mt-3 py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                style={{
                  cursor: userSequence.length > 0 ? "pointer" : "initial",
                  opacity: userSequence.length > 0 ? 1 : 0.5,
                }}
                onClick={() => {
                  getAudioContext();
                }}
              >
                AUDIO CONTEXT
              </button>
              <button
                className="mt-3 py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                style={{
                  cursor: userSequence.length > 0 ? "pointer" : "initial",
                  opacity: userSequence.length > 0 ? 1 : 0.5,
                }}
                onClick={() => {
                    testAudio()
                }}
              >
                TEST
              </button>
              <button
                className="mt-3 py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                style={{
                  cursor: userSequence.length > 0 ? "pointer" : "initial",
                  opacity: userSequence.length > 0 ? 1 : 0.5,
                }}
                onClick={() => {
                    testAudio2()
                }}
              >
                TEST 2
              </button> */}
            </div>
            <div className="absolute top-0 left-[0.5rem] p-[0.5rem] text-[0.8rem] hidden">
              <button className="uppercase">exit</button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute w-[100%] z-[1]">
        <div style={{ borderBottom: "1px solid #fff" }}>
          <div className="mx-auto py-[1rem] w-[60rem]">
            <div className="z-[1] text-[#fff] flex justify-between">
              <div>
                <h3>DNA SEQUENCER</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[0.9rem] bg-[#181818] max-w-[60rem] mx-auto mb-[0rem]">
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
        <div className="hidden">
          <SequenceBoundsSlider
            sequenceBounds={sequenceBounds}
            setSequenceBounds={setSequenceBounds}
            sequence={sequence}
            width={width}
            sequenceRef={sequenceRef}
            boundsRef={boundsRef}
          />
        </div>
        <div
          className="w-[100%] mb-[1rem] text-center mx-auto"
          style={{ width: "30rem" }}
        >
          <SequenceInput
            userSequence={userSequence}
            setUserSequence={setUserSequence}
            userInputSequence={userInputSequence}
            setUserInputSequence={setUserInputSequence}
          />
        </div>
        <div className="">
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
            </div>
            <div className="flex items-center">
              <div>
                <div className="flex items-center justify-start items-end">
                  <div className="flex items-center">
                    <div className="leading-[1rem] px-2 text-[#888] w-[2.9rem] text-center">
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
                    <div className="leading-[1rem] px-1 text-[#888] text-center">
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
              </div>
              <div className="">
                <div className="flex items-center justify-stretch">
                  <div className="flex items-center justify-end ">
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
              </div>
            </div>
          </div>

          <div className="flex mt-[0.25rem]">
            <div
              className={`
                  bg-[#292929] mr-[0.5rem] pr-[0.5rem] 
                  rounded-[0.5rem]
                  w-[45rem] h-[13rem]
                  `}
            >
              <div className="h-full flex">
                <div className="bg-[#292929] pl-[0.5rem] rounded-[0.5rem]">
                  <PlayheadButtons
                    playheads={playheads}
                    updatePlayhead={updatePlayhead}
                    playheadCount={playheadCount}
                    setPlayheadCount={setPlayheadCount}
                    counter={counter}
                    playing={playing}
                    activeNotes={activeNoteRefs}
                  />
                </div>
                <PlayheadsView
                  playheads={playheads}
                  updatePlayhead={updatePlayhead}
                  playing={playing}
                  ticker={ticker}
                  masterSteps={masterSteps}
                  counters={counters}
                  playheadCount={playheadCount}
                  width={width}
                />
              </div>
            </div>
            <div className="w-[16.5rem] px-[0.5rem]  ml-[0rem] bg-[#292929] rounded-[0.5rem]">
              {menu === 0 ? (
                <div>
                  <VisualizerMappings
                    playheads={playheads}
                    countRefs={countRefs}
                    counters={counters}
                    activeNodes={activeNodes}
                    playheadCount={playheadCount}
                  />
                </div>
              ) : menu === 1 ? (
                <div className="">
                  <p className="px-[0.25rem] pt-[0.5rem] pb-[0.25rem] text-[#888] text-[0.8rem] select-none">
                    SOUND SETTINGS
                  </p>
                  <div className="flex">
                    <div className="flex flex-col mr-[0.25rem]">
                      {playheads.map((p, index) => {
                        if (index < playheadCount) {
                          return (
                            <button
                              className="mb-1 p-1 w-[2rem] h-[1.85rem] p-[0.25rem] text-[#fff] rounded-[0.25rem]"
                              key={index}
                              style={{
                                backgroundColor:
                                  selectedPlayhead === index ? p.color : "#444",
                              }}
                            >
                              P{index}
                            </button>
                          );
                        }
                      })}
                    </div>
                    <div className="ml-[1rem]">
                      <div>
                        <p>Selected: </p>
                      </div>
                      <div className="overflow-y-scroll h-[7rem] bg-[#181818] w-full rounded-[0.25rem]">
                        {midiEnabled ? (
                          <div className="flex flex-col">
                            {WebMidi &&
                              WebMidi._outputs.map((midi, index) => {
                                return (
                                  <button
                                    key={midi._midiOutput.name}
                                    className="text-left p-[0.05rem] text-[0.8rem] w-full"
                                    style={{
                                      backgroundColor:
                                        index === midiOutputDevice.index
                                          ? "#555"
                                          : "#333",
                                    }}
                                    onClick={() => {
                                      setMidiOutputDevice({
                                        name: midi._midiOutput.name,
                                        index,
                                      });
                                    }}
                                  >
                                    <p className="whitespace-nowrap overflow-hidden">
                                      {index}: {midi._midiOutput.name}
                                    </p>
                                  </button>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            { 
                              presetMappings.map((preset, index) => {
                                return (
                                  <button
                                    key={index}
                                    className="text-left p-[0.05rem] text-[0.8rem] w-full"
                                    style={{
                                      backgroundColor:
                                        index === selectedPreset
                                          ? "#555"
                                          : "#333",
                                    }}
                                    onClick={() => {
                                      setSelectedPreset(index);
                                    }}
                                  >
                                    <p className="whitespace-nowrap overflow-hidden">
                                      {index}: {preset.name}
                                    </p>
                                  </button>
                                );
                              })}
                          </div>
                        )}
                      </div>
                      <div className="flex mt-1">
                        <button
                          className="w-[50%] rounded-l-[0.25rem]"
                          style={{
                            backgroundColor: midiEnabled ? "#555" : "#888",
                          }}
                          onClick={() => {
                            setMidiEnabled(!midiEnabled);
                          }}
                        >
                          Audio
                        </button>
                        <button
                          className="w-[50%] rounded-r-[0.25rem]"
                          style={{
                            backgroundColor: midiEnabled ? "#555" : "#888",
                          }}
                          onClick={() => {
                            setMidiEnabled(!midiEnabled);
                          }}
                        >
                          MIDI
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>hello</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
