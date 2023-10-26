export const factoryPresets = [
  {
    name: 'hello world',
    author: 'karyo',
    "bpm": 180,
    "steps": 8,
    "keyOffset": 0,
    "userSequence": "",
    "playheads": [
      {
        "playing": true,
        "events": 5,
        "rotation": 0,
        "offset": 0,
        "legato": 0.6,
        "preset": "guitar"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 0,
        "offset": 12,
        "legato": 0.4,
        "preset": "kalimba"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 1,
        "offset": 0,
        "legato": 0.3,
        "preset": "flute"
      },
      {
        "playing": false,
        "events": 2,
        "rotation": 0,
        "offset": -24,
        "legato": 1,
        "preset": "bass"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 0,
        "offset": 0,
        "legato": 0.5,
        "preset": "xylophone"
      }
    ]
  },
  {
    name: 'bachata',
    author: 'karyo',
    bpm: 185,
    steps: 8,
    keyOffset: 0,
    sequence: 'hello world',
    sequenceBounds: false,
    playheads: [
      {
        playing: true, events: 5, rotation: 7, offset: 0, legato: 0.4, preset: "guitar", velocity: 0.7,
      },
      {
        playing: false, events: 5, rotation: 0, offset: 0, legato: 0.7, preset: "woodblock", velocity: 0.,
      },
      {
        playing: true, events: 3, rotation: 1, offset: -24, legato: 0.7, preset: "bass", velocity: 0.7,
      },
      {
        playing: false, events: 2, rotation: 1, offset: -24, legato: 0.5, preset: "kick2", velocity: 0.9,
      },
      {
        playing: true, events: 3, rotation: 5, offset: -24, legato: 0.1, preset: "kick", velocity: 0.9,
      },
    ]
  },
  {
    "name": "choral",
    "author": "karyo",
    "bpm": 180,
    "steps": 8,
    "keyOffset": 0,
    "userSequence": "",
    "playheads": [
      {
        "playing": true,
        "events": 5,
        "rotation": 6,
        "offset": 0,
        "legato": 0.4,
        "preset": "choir"
      },
      {
        "playing": true,
        "events": 3,
        "rotation": 0,
        "offset": -12,
        "legato": 0.3,
        "preset": "choir"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 1,
        "offset": 0,
        "legato": 0.4,
        "preset": "flute"
      },
      {
        "playing": false,
        "events": 5,
        "rotation": 2,
        "offset": 0,
        "legato": 0.4,
        "preset": "woodblock"
      },
      {
        "playing": false,
        "events": 2,
        "rotation": 0,
        "offset": -24,
        "legato": 0.1,
        "preset": "kick"
      }
    ]
  },
  {
    "name": "all low end",
    "author": "karyo",
    "bpm": 168,
    "steps": 8,
    "keyOffset": 0,
    "userSequence": "kalimbas",
    "playheads": [
      {
        "playing": true,
        "events": 3,
        "rotation": 4,
        "offset": -24,
        "legato": 0.5,
        "preset": "bass"
      },
      {
        "playing": true,
        "events": 1,
        "rotation": 2,
        "offset": -24,
        "legato": 0.6,
        "preset": "bass"
      },
      {
        "playing": true,
        "events": 2,
        "rotation": 1,
        "offset": -24,
        "legato": 0.5,
        "preset": "bass"
      },
      {
        "playing": false,
        "events": 5,
        "rotation": 2,
        "offset": -24,
        "legato": 0.5,
        "preset": "kick2"
      },
      {
        "playing": false,
        "events": 2,
        "rotation": 0,
        "offset": -24,
        "legato": 0.1,
        "preset": "kick"
      }
    ]
  },
  {
    "name": "kalimbas!",
    "author": "karyo",
    "bpm": 199,
    "steps": 8,
    "keyOffset": 0,
    "userSequence": "leucine",
    "playheads": [
      {
        "playing": true,
        "events": 4,
        "rotation": 4,
        "offset": 12,
        "legato": 0.4,
        "preset": "kalimba"
      },
      {
        "playing": true,
        "events": 2,
        "rotation": 4,
        "offset": -12,
        "legato": 0.4,
        "preset": "kalimba"
      },
      {
        "playing": false,
        "events": 2,
        "rotation": 3,
        "offset": 0,
        "legato": 0.4,
        "preset": "kalimba"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 3,
        "offset": 0,
        "legato": 0.4,
        "preset": "woodblock"
      },
      {
        "playing": false,
        "events": 3,
        "rotation": 0,
        "offset": -24,
        "legato": 0.1,
        "preset": "kick"
      }
    ]
  },
  {
    "name": "mallets^2",
    "author": "karyo",
    "bpm": 137,
    "steps": 9,
    "keyOffset": 2,
    "userSequence": "leucine",
    "playheads": [
      {
        "playing": true,
        "events": 8,
        "rotation": 6,
        "offset": 0,
        "legato": 0.4,
        "preset": "vibe"
      },
      {
        "playing": true,
        "events": 4,
        "rotation": 8,
        "offset": -12,
        "legato": 0.4,
        "preset": "xylophone"
      },
      {
        "playing": true,
        "events": 6,
        "rotation": 7,
        "offset": 0,
        "legato": 0.4,
        "preset": "xylophone"
      },
      {
        "playing": true,
        "events": 1,
        "rotation": 6,
        "offset": 0,
        "legato": 0.4,
        "preset": "woodblock"
      },
      {
        "playing": true,
        "events": 5,
        "rotation": 6,
        "offset": -24,
        "legato": 0.1,
        "preset": "kick"
      }
    ]
  }
]