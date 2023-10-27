// TODOs:
/*

- add menu button
- add main modes
- fix bug when clearing the input and it pauses things 
- enter button on input
- when interacting with specific playhead, select that within the menu 
- hide period
- add advanced menu w/ period and steps per track
- playheads viz is active during note length

who we know who would want to share these things 
  - get people to use it 
  - have a way to understand the sentiment around it 
  

*/

import React, { useState, useEffect, useMemo, useRef } from "react";

import FPSStats from "react-fps-stats";

import { WebAudioFontPlayer } from "./soundfonts/WebAudioFont"; // exportable version of https://surikov.github.io/webaudiofont/
import { enableWebMidi, WebMidi, getDevice } from "./webmidi";

import "./reverb.js";

import { p1, p2, p3, p4, p5 } from "./defaults";
import { parseAllSequence, interpretSequence } from "./helpers";
import { mapN, toMidi } from "./utils";
import { queryPattern } from "./pattern";
import { updateEuclid } from "./playhead";

import { presetMappings } from "./soundfonts";

import { PlayheadButtons } from "./components/playheadButtons";
import { PlayheadsView } from "./components/playheads";
import { SequenceInput } from "./components/sequenceInput";
import { VisualizerSequence } from "./components/visualizerSequence";
import { VisualizerPlayheads } from "./components/visualizerPlayheads";
import { VisualizerBlobs } from "./components/visualizerBlobs";
import { VisualizerMappings } from "./components/visualizerMappings";
import { InstrumentMenu } from "./components/instrumentMenu";
import { SequencerSettings } from "./components/sequencerSettings";
import { PresetMenu } from "./components/presetMenu";

import { noteMappings } from "./mappings";
import {
  loadedSequences,
  savedSequences,
  textSequences,
} from "./loadedSequences";

import { helpMessages } from "./information";

import "./App.css";
import { SequenceBoundsSlider } from "./components/sequenceBoundsSlider";
import { RemixButton } from "./components/remixButton";

function App() {
  const [menu, setMenu] = useState(0);
  const [selectedPlayhead, setSelectedPlayhead] = useState(0);
  const [modal, setModal] = useState(true);
  const [initialMenu, setInitialMenu] = useState(false);

  // modes
  // 0 = phrase
  // 1 = melodies
  // 2 = entire sequence

  const [showIntroduction, setShowIntroduction] = useState(true);
  const [introductionIndex, setIntroductionIndex] = useState(0);

  const [showControls, setShowControls] = useState(false);
  const [showControlsTransition, setShowControlsTransition] = useState(false);

  const transitionRef = useRef(0);
  useEffect(() => {
    transitionRef.current = showControlsTransition;
  }, showControlsTransition);

  const [showSequenceAbove, setShowSequenceAbove] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [helpMessage, setHelpMessage] = useState({
    name: "",
    description: "",
    img: "",
    source: "",
  });

  const [showEntireSequence, setShowEntireSequence] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(savedSequences[0]);

  const [bpm, setBpm] = useState(180);
  const [playheadCount, setPlayheadCount] = useState(5);
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

  const calculatedHeight =
    window.innerHeight -
    (window.innerWidth < 1300
      ? (showControls ? 16 : 12) * 20
      : (showControls ? 20 : 16) * 20);
  // const calculatedHeight =
  //   window.innerHeight - (window.innerWidth < 1300 ? 16 * 20 : 20 * 20);
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

  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  const [players, setPlayers] = useState();

  const initializePlayers = (audioContext) => {
    let audioPlayers = [];
    playheads.forEach((p, index) => {
      const player = new WebAudioFontPlayer();
      const preset = presetMappings.find((x) => x.name === p.preset);
      console.log(preset, p.preset);
      if (!preset) {
        console.error("incorrect preset mapping");
      }
      player.adjustPreset(audioContext, preset.file);
      audioPlayers.push(player);
    });
    setPlayers(audioPlayers);
  };

  // updates audio players
  const updatePlayer = (index, preset) => {
    const audioContext = getAudioContext();
    const currentPreset = presetMappings.find((x) => x.name === preset);
    const newPlayer = new WebAudioFontPlayer();
    newPlayer.adjustPreset(audioContext, currentPreset.file);
    updatePlayers(index, newPlayer);
  };

  const playSoundFont = (index, presetName, midi, start, duration, volume) => {
    const audioContext = getAudioContext();
    // console.log("playing", presetName, midi, duration, volume);
    const preset = presetMappings.find((x) => x.name === presetName);
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
    if (event.keyCode === 13) {
      console.log("enter button! TODO");
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

  function effectSend(input, effect, wet, ac) {
    const send = gainNode(wet, ac);
    input.connect(send);
    send.connect(effect);
    return send;
  }

  function gainNode(value, ac) {
    const node = ac.createGain();
    node.gain.value = value;
    return node;
  }

  const getAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new AudioContext();
      // const reverb = newAudioContext.createReverb(2);
      // reverb.connect(newAudioContext.destination);
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

  const updatePlayers = (i, p) => {
    setPlayers([...players.slice(0, i), p, ...players.slice(i + 1)]);
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
            if (active.midiEnabled && active.midiOutputDevice.index !== -1) {
              if (WebMidi) {
                device = getDevice(
                  active.midiOutputDevice.name,
                  WebMidi.outputs
                );
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
                    if (
                      device !== null &&
                      active.midiEnabled &&
                      active.midiOutputDevice !== -1
                    ) {
                      // play to midi channel of each playhead
                      device.playNote(note + noteOffsetRef.current, i + 1, {
                        duration: active.legato * timeWindow,
                        attack: 0.8,
                      });
                    } else {
                      playSoundFont(
                        i,
                        active.preset,
                        note + noteOffsetRef.current,
                        (timeWindow * (hap - counter)) / 1000,
                        active.legato * timeWindow,
                        active.velocity
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
    if (userSequence.length === 0) {
      pause();
    }
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
    const snippet = sequence.slice(sequenceBounds[0], sequenceBounds[1]);
    const nodeSnippet = nodes.slice(
      Math.ceil(sequenceBounds[0] / 3),
      Math.floor(sequenceBounds[1] / 3)
    );
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

  const getState = () => {
    let ps = [];
    for (let i = 0; i < playheads.length; i++) {
      ps.push({
        playing: playheads[i].playing,
        events: playheads[i].events,
        rotation: playheads[i].rotation,
        offset: playheads[i].offset,
        legato: playheads[i].legato,
        preset: playheads[i].preset,
        interval: playheads[i].interval,
      });
    }
    return JSON.stringify(
      {
        name: "",
        author: "",
        bpm,
        steps: masterSteps,
        keyOffset: noteOffset,
        userSequence,
        playheads: ps,
      },
      null,
      2
    );
  };

  return (
    <div
      onKeyDown={captureKeyboardEvent}
      tabIndex={-1}
      className="App outline-none text-left max-w-full select-none"
      style={{ height: "100vh", minHeight: "700px" }}
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
          className="visible fixed w-full h-full bg-[rgba(0,0,0,0.6)] top-0 bottom-0 z-[9999] flex items-center"
        >
          <div className="enter relative text-[#fff] text-center h-[28rem] w-[25rem] bg-[#222] px-[1rem] py-[2rem] mx-auto">
            <h3 className="text-[1.4rem]">DNA Music Maker</h3>
            <p className="">Translate DNA into music</p>
            <div className="flex mt-[1rem] h-[3rem] w-[12em] m-auto">
              <button
                className="w-[50%] rounded-l-[0.25rem]"
                style={{
                  backgroundColor: !showEntireSequence
                    ? "#555"
                    : "rgba(50,50,50,0.4)",
                  textDecoration: showEntireSequence ? "initial" : "underline",
                }}
                onClick={() => {
                  setShowEntireSequence(false);
                  setUserInputSequence("type here");
                }}
              >
                phrase
              </button>
              <button
                className="w-[50%] rounded-r-[0.25rem]"
                style={{
                  backgroundColor: showEntireSequence
                    ? "#555"
                    : "rgba(50,50,50,0.4)",
                  textDecoration: !showEntireSequence ? "initial" : "underline",
                }}
                onClick={() => {
                  setShowEntireSequence(true);
                }}
              >
                sequences
              </button>
            </div>
            <div>
              {showEntireSequence ? (
                <div>
                  <p className="mt-[1.5rem] text-[0.9rem]">
                    Select a DNA sequence to get started!
                  </p>
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-[8.5rem] w-[10.75rem] bg-[#222] w-full rounded-[0.25rem]">
                      <div className="flex flex-wrap w-[15rem] mx-auto pt-[1rem] h-[10rem] overflow-y-scroll rounded-[0.25rem]">
                        {savedSequences.map((sequence, index) => {
                          return (
                            <div className="bg-[#181818]">
                              <button
                                key={index}
                                className="text-left w-[15rem] px-[0.25rem]"
                                style={{
                                  backgroundColor:
                                    selectedSequence.name === sequence.name
                                      ? "#333"
                                      : "rgba(0,0,0,0)",
                                }}
                                onClick={() => {
                                  setSelectedSequence(sequence);
                                }}
                              >
                                <p className="whitespace-nowrap overflow-hidden text-[1rem]">
                                  {sequence.name}
                                </p>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      className="mt-[2rem] absolute bottom-[2rem] py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                      onClick={() => {
                        setModal(false);
                        play();
                        setUserInputSequence(selectedSequence.sequence);
                      }}
                    >
                      Get started
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mt-[1.5rem] text-[0.9rem]">
                    Type your name or phrase to get started!
                  </p>
                  <div className="flex flex-col items-center">
                    <div className="flex relative">
                      <SequenceInput
                        userSequence={userSequence}
                        setUserSequence={setUserSequence}
                      />
                      <div className="absolute left-[-3rem] top-[0.5rem]">
                        <RemixButton
                          onclick={() => {
                            setUserSequence(
                              textSequences[
                                Math.floor(Math.random() * textSequences.length)
                              ].value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <button
                      className="mt-3 absolute bottom-[2rem] py-[0.25rem] px-[2rem] bg-[#333] hover:bg-[#444] rounded-[0.25rem] mt-1"
                      style={{
                        cursor: userSequence.length > 0 ? "pointer" : "initial",
                        opacity: userSequence.length > 0 ? 1 : 0.5,
                      }}
                      onClick={() => {
                        if (userSequence.length > 0) {
                          setModal(false);
                          play();
                          setInitialMenu(false);
                        }
                      }}
                    >
                      Get started
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="absolute w-[100%] z-[1]">
        <div style={{ borderBottom: "1px solid #fff" }}>
          <div className="mx-auto py-[1rem] w-[60rem]">
            <div className="z-[1] text-[#fff] flex justify-between">
              <div>
                <h3>DNA Music Maker</h3>
              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    setShowControls(!showControls);
                    setShowControlsTransition(true);
                    setTimeout(() => {
                      setShowControlsTransition(false);
                    }, 400);
                  }}
                  className="mr-[1rem]"
                >
                  <h3>about</h3>
                </button>
                <button className="mr-[1rem]">
                  <h3>learn</h3>
                </button>
                <button
                  onClick={() => {
                    setModal(true);
                    pause();
                    console.log(getState());
                  }}
                >
                  <h3>menu</h3>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-[60rem]">
          {helpMessages.introduction.map((intro, index) => {
            return (
              <button
                onClick={() => {
                  setHelpMessage(intro);
                  setMenu(0);
                  setShowHelp(true);
                }}
                key={index}
                className={`py-[0.5rem] px-[0.5rem] text-[0.8rem] intro-title ${
                  introductionIndex === index && "active"
                }`}
              >
                {index + 1}: {intro.name}
              </button>
            );
          })}
        </div>
        {/* <div className="mx-auto w-[60rem]">
          <p>content!</p>
        </div> */}
      </div>
      <div>
        <div
          className="relative mx-auto transition-translate"
          style={{
            width: width,
            height: height,
            transitionDuration: "200ms",
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
              showSequenceAbove={!showEntireSequence}
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
            setShowHelp={setShowHelp}
            setHelpMessage={setHelpMessage}
            playheads={playheads}
            getNote={getNote}
            noteOffsetRef={noteOffsetRef}
            playSoundFont={playSoundFont}
            setMenu={setMenu}
            showSequenceAbove={!showEntireSequence}
            showControlsTransition={showControlsTransition}
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
            showSequenceAbove={!showEntireSequence}
            showControlsTransition={showControlsTransition}
          />
        </div>
      </div>
      <div
      // className="relative"
      //   style={{
      //   // height: "100vh", minHeight: "700px"
      //   height: '50rem'
      // }}
      >
        <div className="text-[0.9rem] relative max-w-[60rem] mx-auto pb-[0.5rem] overflow-y-hidden">
          {/* <div className="text-[0.9rem] absolute bottom-[0] left-[0] right-[0] max-w-[60rem] mx-auto pb-[0.5rem] overflow-y-hidden"> */}
          {/* <div className="absolute bottom-[0] left-[0] right-[0] z-[88]"> */}
          <div>
            {showEntireSequence && (
              <div className="">
                <SequenceBoundsSlider
                  selectedSequence={selectedSequence}
                  sequenceBounds={sequenceBounds}
                  setSequenceBounds={setSequenceBounds}
                  sequence={sequence}
                  width={width}
                  sequenceRef={sequenceRef}
                  boundsRef={boundsRef}
                />
              </div>
            )}
            {!showEntireSequence && (
              <div
                className="mb-[1rem] text-center mx-auto"
                style={{ width: "30rem" }}
              >
                <div className="relative">
                  <SequenceInput
                    userSequence={userSequence}
                    setUserSequence={setUserSequence}
                    width={"30rem"}
                  />
                  <div className="absolute left-[-3rem] top-[0.5rem]">
                    <RemixButton
                      onclick={() => {
                        setUserSequence(
                          textSequences[
                            Math.floor(Math.random() * textSequences.length)
                          ].value
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                height: showControls ? "15.8rem" : "2.25rem",
                transitionDuration: "400ms",
              }}
            >
              <div className="flex justify-center">
                <div className="w-[38rem]">
                  <SequencerSettings
                    playing={playing}
                    counter={counter}
                    play={play}
                    pause={pause}
                    bpm={bpm}
                    stop={stop}
                    updateTempo={updateTempo}
                    setPlayheads={setPlayheads}
                    masterSteps={masterSteps}
                    setMasterSteps={setMasterSteps}
                    playheads={playheads}
                    setNoteOffset={setNoteOffset}
                    noteOffset={noteOffset}
                    zoom={zoom}
                    setZoom={setZoom}
                    activeSequence={activeSequence}
                    setSequenceBounds={setSequenceBounds}
                    sequence={sequence}
                    boundsRef={boundsRef}
                    showControls={showControls}
                    updatePlayhead={updatePlayhead}
                    activeNotes={activeNoteRefs}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-[0.5rem] mx-auto">
                <div
                  className={`
                    bg-[#292929] mr-[0.5rem] pr-[0.25rem] 
                    rounded-[0.5rem]
                    w-[38rem] h-[13rem]
                    relative
                    `}
                >
                  <div className="flex">
                    <PlayheadsView
                      playheads={playheads}
                      updatePlayhead={updatePlayhead}
                      playing={playing}
                      ticker={ticker}
                      masterSteps={masterSteps}
                      counters={counters}
                      playheadCount={playheadCount}
                      width={width}
                      activeNotes={activeNoteRefs}
                      setSelectedPlayhead={setSelectedPlayhead}
                    />
                    <div className="bg-[#292929] pl-[0.5rem] rounded-[0.5rem]">
                      <PlayheadButtons
                        playheads={playheads}
                        updatePlayhead={updatePlayhead}
                        playheadCount={playheadCount}
                        setPlayheadCount={setPlayheadCount}
                        counter={counter}
                        playing={playing}
                        setMenu={setMenu}
                        setSelectedPlayhead={setSelectedPlayhead}
                      />
                    </div>
                  </div>
                  <div
                    className="w-[16.5rem] ml-[0rem] bg-[#292929] rounded-tl-[0.5rem] rounded-b-[0.5rem] absolute hidden top-0 right-[-16rem]"
                    style={{
                      borderTopRightRadius: menu === 0 ? "0" : "0.5rem",
                      borderTopLeftRadius: menu === 1 ? "0" : "0.5rem",
                    }}
                  >
                    <div
                      className="absolute flex justify-end w-[16.5rem] h-[2.7rem] top-[-2.7rem] left-[0.0rem]"
                      style={{
                        display: showControls ? "flex" : "none",
                      }}
                    >
                      <button
                        className="uppercase text-[#aaa] rounded-t-[0.5rem] w-[5.5rem] text-center"
                        onClick={() => {
                          setMenu(1);
                          setShowHelp(false);
                        }}
                        style={{
                          backgroundColor:
                            menu === 1 ? "#292929" : "rgba(0,0,0,0)",
                        }}
                      >
                        Sounds
                      </button>
                      <button
                        className="uppercase text-[#aaa] rounded-t-[0.5rem] w-[5.5rem] text-center"
                        onClick={() => {
                          setMenu(2);
                          setShowHelp(false);
                        }}
                        style={{
                          backgroundColor:
                            menu === 2 ? "#292929" : "rgba(0,0,0,0)",
                        }}
                      >
                        Presets
                      </button>
                      <button
                        className="uppercase text-[#aaa] rounded-t-[0.5rem] w-[5.5rem] text-center"
                        onClick={() => {
                          setMenu(0);
                          setShowHelp(false);
                        }}
                        style={{
                          backgroundColor:
                            menu === 0 ? "#292929" : "rgba(0,0,0,0)",
                        }}
                      >
                        Log
                      </button>
                    </div>
                    {menu === 0 ? (
                      <div className="w-[16.5rem]">
                        <VisualizerMappings
                          playheads={playheads}
                          countRefs={countRefs}
                          counters={counters}
                          activeNodes={activeNodes}
                          playheadCount={playheadCount}
                          showHelp={showHelp}
                          helpMessage={helpMessage}
                          setShowHelp={setShowHelp}
                        />
                      </div>
                    ) : menu === 1 ? (
                      <InstrumentMenu
                        playheads={playheads}
                        selectedPlayhead={selectedPlayhead}
                        updatePlayhead={updatePlayhead}
                        WebMidi={WebMidi}
                        presetMappings={presetMappings}
                        playheadCount={playheadCount}
                        setSelectedPlayhead={setSelectedPlayhead}
                        updatePlayer={updatePlayer}
                      />
                    ) : (
                      <div className="w-[16.5rem]">
                        <PresetMenu
                          playheads={playheads}
                          updatePlayer={updatePlayer}
                          setPlayheads={setPlayheads}
                          updateTempo={updateTempo}
                          setMasterSteps={setMasterSteps}
                          setNoteOffset={setNoteOffset}
                          updatePlayhead={updatePlayhead}
                        />
                      </div>
                    )}
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
