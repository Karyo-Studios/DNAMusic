/*

TODOs:
- create options for 
  - legato
  - instruments
  - start / stop
    
*/

import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";

import { enableWebMidi, WebMidi } from './webmidi';

import { p1, p2, p3, p4, p5 } from './defaults'
import { parseSequence, toMidi } from "./helpers";
import { queryPattern } from "./pattern";
import { updateEuclid } from "./playhead";
import { noteMappings, dnaMapping, numberMapping, emojiPalettes } from "./mappings";
import { loadedSequences } from "./loadedSequences";

import "./App.css";

function App() {
  const [userInputSequence, setUserInputSequence] = useState(
    "ACTCACCCTGAAGTTCTCAGGATCCACGTGCAGCTTGTCACAGTGCAGCTCACTCAGTGT"
  );
  const [bpm, setBpm] = useState(120);
  const [masterSteps, setMasterSteps] = useState(8);
  const [cps, setCps] = useState(60 / bpm);
  const [nodes, setNodes] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [emojiMap, setEmojiMap] = useState(Math.floor(Math.random() * emojiPalettes.length));
  const [emojiEnabled, setEmojiEnabled] = useState(false);
  const [scaleAmount, setScaleAmount] = useState(3);
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
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
  const [midiOutputDevice, setMidiOutputDevice] = useState(null);

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
      if (!playing) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
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

    enableWebMidi()
  }, []);

  const getAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);
      return newAudioContext;
    }
    return audioContext;
  };

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [count5, setCount5] = useState(0);

  const countRef1 = useRef(0);
  const countRef2 = useRef(0);
  const countRef3 = useRef(0);
  const countRef4 = useRef(0);
  const countRef5 = useRef(0);

  const counters = [count1, count2, count3, count4, count5];
  const countRefs = [countRef1, countRef2, countRef3, countRef4, countRef5];

  const setCounters = [setCount1, setCount2, setCount3, setCount4, setCount5]

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


  const [playheads, setPlayheads] = useState([p1, p2, p3, p4, p5]);
  const playheadsRef = useRef(null);

  useEffect(() => {
    playheadsRef.current = playheads
  }, [playheads])

  const updatePlayhead = (i, p) => {
    setPlayheads([
      ...playheads.slice(0, i),
      {
        ...p,
      },
      ...playheads.slice(i + 1),
    ]);
  };

  const stopAll = () => {
    for (let i = 0; i < playheads.length; i++) {
      setCounters[i](0)
    }
  };

  // main loop to update counters
  let clicksPerCycle = 4;
  let clicks = 0;

  useEffect(() => {
    let interval = null;
    const lookahead = counter + 1;
    if (playing && nodes.length) {
      interval = setInterval(() => {
        clicks++;
        if (clicks === clicksPerCycle) {
          setCounter(counter + 1);
          clicks = 0;
          // if ((counter ) % 2 === 0) {
          //   playNote(92, 100, 100); // metronome
          // }
          for (let i = 0; i < playheads.length; i++) {
            const active = playheads[i];
            const activeRef = playheadsRef.current;
            console.log(activeRef)
            if (!active.playing) {
              continue;
            }
            const haps = queryPattern(
              active.pattern,
              active.interval,
              counter,
              lookahead
            );

            const timeWindow = cps * 1000; // convert fraction to time

            haps.forEach((hap) => {
              setTimeout(() => {
                if (activeRef[i].playing) {
                  const pos = countRefs[i].current; // make sure to use ref
                  // for some reason the note is begin rendered one behind the note, TODO investigate this
                  const note = getNote((pos + 1) % nodes.length) + active.offset;
                  setCounters[i]((pos + 1) % nodes.length);
                  playNote(
                    active.instrument,
                    note + noteOffsetRef.current,
                    active.legato * 500
                  );
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
    stopAll();
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
    const { nodes, sequence } = parseSequence(userInputSequence)
    setNodes(nodes);
    setSequence(sequence);
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
          className="visible md:invisible fixed w-full h-full bg-[rgba(0,0,0,0.5)] top-0 bottom-0 z-[999] flex items-center"
        >
          <div className="text-[#fff] text-center w-[100%]">
            <p>Touch to enable sound</p>
          </div>
        </div>
      )}
      <div className="py-[1rem] px-[0.5rem] bg-[#f1f1f1] max-w-[1200px] mx-auto my-[1rem] drop-shadow">
        <div>
          <div className="mx-[0.5rem]">
            <h1 className="text-[2rem]">DNA Sonification</h1>
            <p>Sequence:</p>
            <div className="flex">
              <textarea
                className="p-2 max-w-[30rem] w-[80%] min-w-[10rem]"
                value={userInputSequence}
                onChange={(e) => setUserInputSequence(e.target.value)}
              />
            </div>
            <div className="m-2 flex">
              <p className="mr-1">
                zoom:
              </p>
              <div >
                <input
                  className="w-[10rem]"
                  type="range"
                  min="0.5"
                  max="5"
                  value={scaleAmount}
                  onChange={(e) => {
                    setScaleAmount(e.target.value);
                  }}
                  step="0.1"
                  aria-label="scale amount slider"
                />
              </div>
              <p className="ml-2">
                {((scaleAmount / 5) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex flex-wrap my-3 tracking-[0.5rem]">
            {/* <div> */}
            {
              sequence.map((letter, index) => {
                return <div
                  className={`
                    relative z-[-99]
                    border-box border-[#000]  
                    `}
                  style={{
                    fontSize: `${scaleAmount * 0.6}rem`,
                    width: `${scaleAmount}rem`,
                    height: `${scaleAmount}rem`,
                    borderWidth: `${scaleAmount * 0.02}rem`,
                    border: 'solid'
                  }}
                >
                  <div className="text-center z-[99]">
                    {
                      emojiEnabled ?
                        emojiPalettes[emojiMap].emojis[dnaMapping[letter]]
                        :
                        letter
                    }
                  </div>
                  <div className="absolute top-0 left-0 z-[-999]">
                    {playheads.map((p, i) => {
                      const active = index >= counters[i] * 3 && index < (counters[i] + 1) * 3
                      // const active = index === counters[i] * 3
                      return <div
                        key={p + i}
                        className='absolute top-0 left-0 z-[-999]'
                        style={{
                          backgroundColor: `${p.color}`,
                          opacity: active ? 0.6 : 0,
                          width: `${scaleAmount}rem`,
                          height:
                            active && p.playing
                              ? `${scaleAmount}rem`
                              : "0rem",
                          top:
                            active && p.playing
                              ? "0rem"
                              : `${scaleAmount / 2}rem`,
                          // transitionDuration:
                          //   active ? "300ms" : "400ms",
                          // msTransitionProperty: "height,opacity,top",
                        }}
                      ></div>
                    })}
                  </div>
                </div>
              })
            }
            {/* </div> */}
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
            <div className="mx-[1rem]">
              <p>
                BPM: {bpm} {playing && ((counter - 1) / 2) % 2 === 0 ? "*" : ""}{" "}
                {/* {counter} */}
              </p>
              <div>
                <input
                  type="range"
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
            <div className="mx-[1rem]">
              <p>
                STEPS: {masterSteps}
              </p>
              <div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={masterSteps}
                  onChange={(e) => {
                    setMasterSteps(e.target.value);
                    let updated = [];
                    for (let i = 0; i < playheads.length; i++) {
                      const cur = playheads[i]
                      updated.push(updateEuclid({ ...cur, steps: parseInt(e.target.value) }))
                    }
                    setPlayheads(updated)
                  }}
                  step="1"
                  aria-label="master steps slider"
                />
              </div>
            </div>
            <div className="flex">
              <button
                className="bg-[#ddd] py-2 mr-1 w-[7rem]"
                onClick={() =>
                  setNoteOffset(Math.floor(Math.random() * 12 - 6))
                }
              >
                KEY: {noteOffset}
              </button>
            </div>
            {/* <div className="flex">
              <button
                className="bg-[#ddd] py-2 mr-1 w-[7rem]"
                onClick={() => {
                  setEmojiMap(Math.floor(Math.random() * emojiPalettes.length));
                }
                }
              >
                TEST
              </button>
            </div> */}
            {/* <div>
              <p>RENDERFRAME: {renderCount.current}</p>
              <p>COUNTER: {counter}</p>
            </div> */}
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
                  updatePlayhead(index, { ...p, playing: !p.playing })
                }
              >
                Playhead {index + 1}
              </button>
              {/* <div className="px-3 w-[7rem] leading-[2.7rem]">
                Pos: {counters[index]}
              </div>
              <div className="px-3 w-[8rem] leading-[2.7rem]">
                Length: {p.interval}
              </div>
              <button
                className="bg-[#ddd] p-2 mr-1 w-[2rem]"
                onClick={() => {
                  updatePlayhead(index, { ...p, interval: p.interval / 2 })
                }}
              >
                -
              </button>
              <button
                className="bg-[#ddd] p-2 mr-1 w-[2rem]"
                onClick={() => {
                  updatePlayhead(index, { ...p, interval: p.interval * 2 })
                }}
              >
                +
              </button> */}
              <button
                className="ml-2 w-[2rem]"
                style={{
                  opacity: p.events > 1 ? 1 : 0.5,
                  color: p.color,
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  if (p.events > 1) {
                    updatePlayhead(index, updateEuclid({ ...p, events: p.events - 1 }))
                  }
                }}
              >
                {'-'}
              </button>
              <div className="px-1 flex flex-col">
                <div className="relative w-[12rem] bg-[#ddd] h-[1.5rem]">
                  {
                    p.pattern.map((hap) => {
                      return <div
                        key={hap}
                        className="absolute bg-[#00f] t-0 h-[100%]"
                        style={{
                          left: `${16 * 12 * hap + (16 * 12 / masterSteps) * 0.1}px`,
                          backgroundColor: `${p.color}`,
                          width: `${(16 * 12 / masterSteps) * 0.8}px`
                        }}></div>
                    })
                  }
                </div>
                <div className="flex">
                  <input
                    className="p-1 w-[12rem] opacity-[0.3]"
                    type="range"
                    min="0"
                    max={p.steps - 1}
                    value={parseInt(p.rotation)}
                    onChange={(e) => {
                      updatePlayhead(index, updateEuclid({ ...p, rotation: parseInt(e.target.value) }))
                    }}
                    step="1"
                    aria-label="event slider"
                  />
                </div>
              </div>
              <button
                className="mr-2 w-[2rem]"
                style={{
                  opacity: p.events < masterSteps ? 1 : 0.5,
                  color: p.color,
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  if (p.events < masterSteps) {
                    updatePlayhead(index, updateEuclid({ ...p, events: p.events + 1 }))
                  }
                }}
              >
                {'+'}
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
                    key={seq.sequence}
                    className="bg-[#ddd] text-[1rem] p-2 mr-1 mb-1"
                    onClick={() => {
                      setNoteOffset(Math.floor(Math.random() * 12 - 6));
                      updateTempo(Math.floor(Math.random() * 150 + 60));
                      setUserInputSequence(seq.sequence);
                    }}
                  >
                    {seq.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-[2rem]">
            <div className="flex">
              <button
                className="m-2"
                style={{
                  textDecoration: emojiEnabled ? 'none' : 'line-through'
                }}
                onClick={() => { setEmojiEnabled(!emojiEnabled) }}
              >
                Emojis!
              </button>
              {
                emojiEnabled &&
                <div className="flex">
                  {emojiPalettes[emojiMap].emojis.map((emoji, i) => {
                    return <p className="m-2 align-middle">{numberMapping[i]}:{emoji} </p>
                  })}
                  <p
                    className="m-2 flex align-middle"
                    onClick={() => {
                      setEmojiMap(Math.floor(Math.random() * emojiPalettes.length));
                    }}
                  >
                    re-roll
                  </p>
                </div>
              }
              <div>
              </div>
            </div>
          </div>
          <div className="mt-[2rem]">
            <p>MIDI Settings:</p>
            <div className="flex">
              <button
                className="p-2 w-[5rem]"
                style={{
                  backgroundColor: midiEnabled ? '#ddd' : '#bbb',
                  textDecoration: midiEnabled ? 'none' : 'line-through'
                }}
                onClick={() => {
                  setMidiEnabled(!midiEnabled)
                }}
              >
                MIDI
              </button>
              <div className="p-2">
                MIDI {midiEnabled ? 'enabled' : 'disabled'}
              </div>
            </div>
            <div className="mt-[0.5rem]">
              {
                midiEnabled && WebMidi._outputs.map((midi, index) => {
                  return <button
                    key={midi._midiOutput.name}
                    className="mr-2 mt-2 p-1 w-[8rem]"
                    style={{
                      backgroundColor: index === midiOutputDevice ? '#ddd' : '#bbb',
                    }}
                    onClick={() => {
                      setMidiOutputDevice(index)
                    }}
                  >
                    {midi._midiOutput.name}
                  </button>
                })
              }
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
