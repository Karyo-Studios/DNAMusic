import { Playhead } from "./playhead";
import { instruments } from "./soundfonts";

export const p1 = new Playhead({
  playing: true,
  pattern: [0, 2 / 8, 3 / 8, 5 / 8, 6 / 8],
  interval: 4,
  offset: 0,
  legato: 0.6,
  steps: 8,
  events: 4,
  preset: instruments.guitar,
  instrumentName: '1',
  color: "#ed1c51",
  velocity: 0.4,
});

export const p2 = new Playhead({
  playing: false,
  interval: 4,
  pattern: [0, 0.5, 0.75],
  offset: 12,
  legato: 0.4,
  preset: instruments.kalimba,
  instrumentName: '2',
  color: "#2277E8",
  velocity: 0.4,
});

export const p3 = new Playhead({
  playing: false,
  pattern: [0, 1 / 4, 2 / 4, 3 / 4], // 1(3,8)
  interval: 4,
  offset: 0,
  legato: 0.3,
  rotation: 1,
  preset: instruments.flute,
  instrumentName: '3',
  color: "#ffa333",
  velocity: 0.4,
});

export const p4 = new Playhead({
  playing: false,
  pattern: [0],
  interval: 4,
  events: 2,
  offset: -24,
  legato: 1,
  preset: instruments.bass,
  instrumentName: '4',
  color: "#11CA3A",
  velocity: 0.4,
});

export const p5 = new Playhead({
  playing: false,
  pattern: [0, 0.75],
  interval: 4,
  events: 3,
  offset: 0,
  legato: 0.5,
  preset: instruments.xylophone,
  instrumentName: '5',
  color: "#ff00ff",
  velocity: 0.4,
});