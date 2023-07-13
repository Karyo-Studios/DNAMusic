/*

TODOs:
- create options for 
  - legato
  - instruments
  - start / stop

*/

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Playhead } from "./playhead";
import { parseSequence, toMidi } from "./helpers";
import { queryPattern } from "./pattern";
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
  const [bpm, setBpm] = useState(120);
  const [cps, setCps] = useState(60 / bpm);
  const [nodes, setNodes] = useState([]);
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

  const updatePlayhead = (i, p) => {
    setPlayheads([
      ...playheads.slice(0, i),
      {
        ...p,
      },
      ...playheads.slice(i + 1),
    ]);
  };

  // const updateCounters = (i, c) => {
  //   setCounters([...counters.slice(0, i), c, ...counters.slice(i + 1)]);
  // };

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
    pattern: [0, 2 / 8, 3 / 8, 5 / 8, 6 / 8],
    interval: 4,
    offset: 0,
    legato: 0.5,
    instrument: 92,
    // instrument: 96,
    color: "#0000ff",
  });

  const p2 = new Playhead({
    playing: true,
    interval: 2,
    pattern: [0, 0.5, 0.75],
    offset: 12,
    instrument: 66,
    legato: 0.5,
    color: "#ff0000",
  });

  const p3 = new Playhead({
    playing: true,
    pattern: [0, 3 / 8, 6 / 8], // 1(3,8)
    interval: 4,
    instrument: 92,
    offset: -12,
    legato: 0.6,
    color: "#ffff00",
  });

  const p4 = new Playhead({
    playing: false,
    pattern: [0],
    interval: 8,
    offset: -24,
    instrument: 80,
    legato: 1,
    color: "#00ff00",
  });

  const p5 = new Playhead({
    playing: false,
    pattern: [0,0.75],
    interval: 4,
    offset: 0,
    legato: 0.5,
    instrument: 92,
    // instrument: 96,
    color: "#ff00ff",
  });

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [count5, setCount5] = useState(0);

  const counters = [count1, count2, count3, count4, count5];

  const countRef1 = useRef(0);
  const countRef2 = useRef(0);
  const countRef3 = useRef(0);
  const countRef4 = useRef(0);
  const countRef5 = useRef(0);

  const playheadRef1 = useRef(0);
  const playheadRef2 = useRef(0);
  const playheadRef3 = useRef(0);
  const playheadRef4 = useRef(0);
  const playheadRef5 = useRef(0);

  const refs = [countRef1, countRef2, countRef3, countRef4, countRef5];

  const updatePos = (i, p) => {
    if (i === 0) {
      setCount1(p);
    } else if (i === 1) {
      setCount2(p);
    } else if (i === 2) {
      setCount3(p);
    } else if (i === 3) {
      setCount4(p);
    } else if (i === 4) {
      setCount5(p);
    } else {
      console.error("please use correct playhead index");
    }
  };

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

  const stopAll = () => {
    for (let i = 0; i < playheads.length; i++) {
      updatePos(i, 0);
    }
  };

  // const [playheads, setPlayheads] = useState([p1, p2, p3, p4]);
  const [playheads, setPlayheads] = useState([
    p1, // 4
    p2, // 2
    p3, /// 1
    p4, /// 3
    p5, // 5
  ]);

  // main loop to update counters
  let clicksPerCycle = 2;
  let clicks = 0;

  useEffect(() => {
    let interval = null;
    const lookahead = counter + 1;
    if (playing && nodes.length) {
      interval = setInterval(() => {
        // console.log('clicks', clicks)
        clicks++;
        if (clicks === clicksPerCycle) {
          setCounter(counter + 1);
          clicks = 0;
          // if ((counter ) % 2 === 0) {
          //   playNote(92, 100, 100); // metronome
          // }
          for (let i = 0; i < playheads.length; i++) {
            const current = playheads[i];
            if (!current.playing) {
              continue;
            }
            const haps = queryPattern(
              current.pattern,
              current.interval,
              counter,
              lookahead
            );

            const timeWindow = cps * 1000; // convert fraction to time

            haps.forEach((hap) => {
              setTimeout(() => {
                const pos = refs[i].current; // make sure to use ref
                const note = getNote(pos) + current.offset;
                playNote(
                  current.instrument,
                  note + noteOffsetRef.current,
                  current.legato * 500
                );
                updatePos(i, (pos + 1) % nodes.length);
              }, timeWindow * (hap - counter));
            });
          }
        }
        // hardcode 8 times per cycle
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
    setNodes(parseSequence(userInputSequence));
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
            <div className="mx-[1rem]">
              <p>
                BPM: {bpm} {playing && ((counter - 1) / 2) % 2 === 0 ? "*" : ""}{" "}
                {/* {counter} */}
              </p>
              {/* <p>{renderCount.current}</p> */}
              {/* <p>COUNTER: {counter}</p> */}
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
          </div>
          <div className="flex flex-wrap my-3 min-h-[6rem]">
            {nodes.map((node, index) => (
              <div
                className="relative bg-[#ddd] w-[4.5rem] h-[9rem] mx-[0.5rem] mb-[0.5rem] text-center drop-shadow"
                key={node.index}
              >
                <div className="flex flex-col absolute bottom-0 left-0">
                  {playheads.map((p, i) => (
                    <div
                      key={p + i}
                      className={`h-[1rem]`}
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
              <div className="px-3 w-[7rem] leading-[2.7rem]">
                Pos: {counters[index]}
              </div>
              <div className="px-3 w-[7rem] leading-[2.7rem]">
                Time: {p.interval}
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
              <div className="px-3 leading-[2.7rem]">
                Pattern: {JSON.stringify(p.pattern)}
              </div>
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
