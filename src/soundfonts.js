
import { _tone_0110_Aspirin_sf2_file } from "./soundfonts/_tone_0110_Aspirin_sf2_file"; // vibes
import { _tone_0530_Aspirin_sf2_file } from "./soundfonts/_tone_0530_Aspirin_sf2_file"; // vox 
import { _tone_1170_Aspirin_sf2_file } from "./soundfonts/_tone_1170_Aspirin_sf2_file";  // toms
import { _tone_1151_FluidR3_GM_sf2_file } from "./soundfonts/_tone_1151_FluidR3_GM_sf2_file";  // woodblock
import { _tone_0161_SoundBlasterOld_sf2 } from "./soundfonts/_tone_0161_SoundBlasterOld_sf2";  // organ
import { _tone_0390_FluidR3_GM_sf2_file} from "./soundfonts/_tone_0390_FluidR3_GM_sf2_file"; //  bass

export const instruments = {
  vibe: 'vibe',
  vox: 'vox',
  toms: 'toms',
  woodblock: 'woodblock',
  organ: 'organ',
  bass: 'bass',
}

export const presetOrder = {
  [instruments.vibe]: 0,
  [instruments.vox]: 1,
}

export const presetMappings = [
  {
    name: instruments.vibe,
    file: _tone_0110_Aspirin_sf2_file
  },
  { 
    name: instruments.vox,
    file: _tone_0530_Aspirin_sf2_file 
  },
  { 
    name: instruments.toms,
    file: _tone_1170_Aspirin_sf2_file 
  },
  { 
    name: instruments.woodblock,
    file: _tone_1151_FluidR3_GM_sf2_file 
  },
  { 
    name: instruments.organ,
    file: _tone_0161_SoundBlasterOld_sf2 
  },
  { 
    name: instruments.bass,
    file: _tone_0390_FluidR3_GM_sf2_file 
  },
];

