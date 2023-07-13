
export class Playhead {
    constructor({
        playing = false,
        interval = 4, 
        pattern,
        instrument = 92, 
        offset = -12,
        legato = 0.5,
        color = "#ffff00",
    }) {
        this.playing = playing
        this.interval = interval
        this.pattern = pattern
        this.instrument = instrument
        this.offset = offset
        this.legato = legato
        this.color = color
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
  }


  