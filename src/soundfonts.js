
import { _tone_0110_Aspirin_sf2_file } from "./soundfonts/_tone_0110_Aspirin_sf2_file"; // vibes
import { _tone_0530_Aspirin_sf2_file } from "./soundfonts/_tone_0530_Aspirin_sf2_file"; // vox 
import { _tone_1170_Aspirin_sf2_file } from "./soundfonts/_tone_1170_Aspirin_sf2_file";  // toms
import { _tone_1151_FluidR3_GM_sf2_file } from "./soundfonts/_tone_1151_FluidR3_GM_sf2_file";  // woodblock
import { _tone_0161_SoundBlasterOld_sf2 } from "./soundfonts/_tone_0161_SoundBlasterOld_sf2";  // organ
import { _tone_0390_FluidR3_GM_sf2_file} from "./soundfonts/_tone_0390_FluidR3_GM_sf2_file"; //  electric bass
import { _tone_0660_Chaos_sf2_file} from "./soundfonts/_tone_0660_Chaos_sf2_file"; //  altosax
import { _tone_0320_JCLive_sf2_file} from "./soundfonts/_tone_0320_JCLive_sf2_file"; //  plucked bass
import { _tone_0270_SBAWE32_sf2_file} from "./soundfonts/_tone_0270_SBAWE32_sf2_file"; //  electric guitar
import { _tone_0730_JCLive_sf2_file} from "./soundfonts/_tone_0730_JCLive_sf2_file"; //  flute
import { _tone_0240_JCLive_sf2_file} from "./soundfonts/_tone_0240_JCLive_sf2_file"; //  guitar
import { _tone_0460_FluidR3_GM_sf2_file} from "./soundfonts/_tone_0460_FluidR3_GM_sf2_file"; //  harp
import { _tone_1080_JCLive_sf2_file} from "./soundfonts/_tone_1080_JCLive_sf2_file"; //  kalimba
import { _tone_0720_GeneralUserGS_sf2_file} from "./soundfonts/_tone_0720_GeneralUserGS_sf2_file"; //  piccolo
import { _tone_0640_JCLive_sf2_file} from "./soundfonts/_tone_0640_JCLive_sf2_file"; //  soprano sax
import { _tone_0130_GeneralUserGS_sf2_file} from "./soundfonts/_tone_0130_GeneralUserGS_sf2_file"; //  xylophone
import { _drum_35_0_Chaos_sf2_file} from "./soundfonts/_drum_35_0_Chaos_sf2_file.js"; //  kickdrum 1
import { _drum_36_0_Chaos_sf2_file} from "./soundfonts/_drum_36_0_Chaos_sf2_file.js"; //  kickdrum 2
import { _tone_0380_Chaos_sf2_file} from "./soundfonts/_tone_0380_Chaos_sf2_file.js"; //  synth

export const instruments = {
  vibe: 'vibe',
  vox: 'choir',
  toms: 'toms',
  woodblock: 'woodblock',
  organ: 'organ',
  e_bass: 'e_bass',
  altosax: 'altosax',
  bass: 'bass',
  e_guitar: 'e_guitar',
  flute: 'flute',
  guitar: 'guitar',
  harp: 'harp',
  kalimba: 'kalimba',
  piccolo: 'piccolo',
  saxophone: 'saxophone',
  xylophone: 'xylophone',
  kick: 'kick',
  kick2: 'kick2',
  synth: 'synth',
}

export const presetMappings = [
  {
    name: instruments.vibe,
    file: _tone_0110_Aspirin_sf2_file,
    velocity: 0.5,
    octave: 0,
    legato: 0.4,
  },
  { 
    name: instruments.vox,
    file: _tone_0530_Aspirin_sf2_file,
    velocity: 0.3,
    octave: 0,
    legato: 0.4,
  },
  // { 
  //   name: instruments.toms,
  //   file: _tone_1170_Aspirin_sf2_file 
  // },
  { 
    name: instruments.woodblock,
    file: _tone_1151_FluidR3_GM_sf2_file,
    velocity: 0.5,
    octave: 0,
    legato: 0.4, 
  },
  { 
    name: instruments.organ,
    file: _tone_0161_SoundBlasterOld_sf2,
    velocity: 0.5,
    octave: 0,
    legato: 0.4,
  },
  // { 
  //   name: instruments.e_bass,
  //   file: _tone_0390_FluidR3_GM_sf2_file 
  // },
  // { 
  //   name: instruments.altosax,
  //   file: _tone_0660_Chaos_sf2_file 
  // },
  { 
    name: instruments.bass,
    file: _tone_0320_JCLive_sf2_file,
    velocity: 0.5,
    octave: -2,
    legato: 0.4,
  },
  // { 
  //   name: instruments.e_guitar,
  //   file: _tone_0270_SBAWE32_sf2_file 
  // },
  { 
    name: instruments.flute,
    file: _tone_0730_JCLive_sf2_file,
    velocity: 0.4,
    octave: 0,
    legato: 0.4,
  },
  { 
    name: instruments.guitar,
    file: _tone_0240_JCLive_sf2_file,
    velocity: 0.5,
    octave: 0,
    legato: 0.4,
  },
  // { 
  //   name: instruments.harp,
  //   file: _tone_0460_FluidR3_GM_sf2_file 
  // },
  { 
    name: instruments.kalimba,
    file: _tone_1080_JCLive_sf2_file,
    velocity: 0.5,
    octave: 0,
    legato: 0.4,
  },
  // { 
  //   name: instruments.piccolo,
  //   file: _tone_0720_GeneralUserGS_sf2_file 
  // },
  // { 
  //   name: instruments.saxophone,
  //   file: _tone_0640_JCLive_sf2_file 
  // },
  { 
    name: instruments.xylophone,
    file: _tone_0130_GeneralUserGS_sf2_file,
    velocity: 0.3,
    octave: 0,
    legato: 0.4,
  },
  { 
    name: instruments.synth,
    file: _tone_0380_Chaos_sf2_file,
    velocity: 0.4,
    octave: -1,
    legato: 0.2,
  },
  { 
    name: instruments.kick,
    file: _drum_35_0_Chaos_sf2_file,
    velocity: 1,
    octave: -2,
    legato: 0.5,
  },
  { 
    name: instruments.kick2,
    file: _drum_36_0_Chaos_sf2_file,
    velocity: 1,
    octave: -2,
    legato: 0.5,
  },
];

