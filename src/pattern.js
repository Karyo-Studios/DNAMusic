export const queryPattern = (p, patternCycleLength, start, end) => {
    if (patternCycleLength <= 0) {
      console.error("# of patternCycleLength cannot be <= 0");
      return [];
    } 
    const startPhase = Math.floor(start / patternCycleLength);
    const endPhase = Math.ceil(end / patternCycleLength);
    let events = [];

    for (let phase = startPhase; phase <= endPhase; phase++) {
      for (let i = 0; i < p.length; i++) {
        // for each phase, we want to go through the pattern and add
        const timing = patternCycleLength * p[i] + phase * patternCycleLength;
        if (timing >= start && timing < end) {
          events.push(timing);
        }
      }
    }
    return events;
  };
