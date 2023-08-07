
import { getPattern, euclidToPattern, rotate } from "./euclid"

import { hexToHSL } from "./helpers"

export class Playhead {
  constructor({
    playing = false,
    interval = 4,
    pattern,
    instrument = 92,
    offset = -12,
    legato = 0.5,
    color = "#ffff00",
    steps = 8,
    events = 3,
    instrumentName = '',
    rotation = 0,
  }) {
    this.playing = playing
    this.interval = interval
    this.pattern = pattern
    this.instrument = instrument
    this.instrumentName = instrumentName
    this.offset = offset
    this.legato = legato
    this.color = color
    this.hsl = hexToHSL(color)
    this.steps = steps
    this.events = events
    this.followSteps = true
    this.rotation = rotation
    this.midiEnabled = false
  }

  start = () => {
    this.playing = true;
    return this
  }

  pause = () => {
    this.playing = false;
    return this
  }

  stop = () => {
    this.playing = false;
    return this
  }

  updateStep = (newStep) => {
    let copy = { ...this }
    if (newStep > 0) {
      copy.interval = newStep
    }
    return copy
  }

  followStep = (follow) => {
    this.followSteps = follow
    return this
  }
}

export const updateEuclid = (playhead) => {
  if (playhead.steps < playhead.events) {
    playhead.events = playhead.steps
  }
  playhead.euclid = getPattern(playhead.steps, playhead.events, playhead.rotation)
  playhead.pattern = euclidToPattern(playhead.euclid)
  return playhead
}

export const updateRotation = (playhead) => {
  playhead.euclid = rotate(playhead.euclid, playhead.rotation)
  playhead.pattern = euclidToPattern(playhead.euclid)
  return playhead
}

