
import { getPattern, euclidToPattern } from "./euclid"

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
  }) {
    this.playing = playing
    this.interval = interval
    this.pattern = pattern
    this.instrument = instrument
    this.offset = offset
    this.legato = legato
    this.color = color
    this.steps = steps
    this.events = events
    this.followSteps = true
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
    if (newStep > 0) {
      this.interval = newStep
    }
    return this
  }

  followStep = (follow) => {
    this.followSteps = follow
    return this
  }

  updateEuclid = (steps, events) => {
    this.steps = parseInt(steps)
    this.events = parseInt(events)
    if (steps < events) {
      this.events = this.steps
    }
    this.euclid = getPattern(this.events, this.steps)
    this.pattern = euclidToPattern(this.euclid)
    return this
  }
}


