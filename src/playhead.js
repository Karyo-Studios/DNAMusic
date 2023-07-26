
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
    // this.euclid = this.updateEuclid(steps, events)
    // this.pattern = euclidToPattern(this.euclid)
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

  updateEuclid = (steps, events) => {
    console.log(steps, events)
    let copy = { ...this }
    copy.steps = parseInt(steps)
    copy.events = parseInt(events)
    if (steps < events) {
      copy.events = copy.steps
    }
    copy.euclid = getPattern(copy.events, copy.steps)
    copy.pattern = euclidToPattern(copy.euclid)
    return copy
  }
}


