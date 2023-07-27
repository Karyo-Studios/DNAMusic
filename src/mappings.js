export const codonMappings = {
  ATT: "I",
  ATC: "I",
  ATA: "I",
  CTT: "L",
  CTC: "L",
  CTA: "L",
  CTG: "L",
  TTA: "L",
  TTG: "L",
  GTT: "V",
  GTC: "V",
  GTA: "V",
  GTG: "V",
  TTT: "F",
  TTC: "F",
  ATG: "M",
  TGT: "C",
  TGC: "C",
  GCT: "A",
  GCC: "A",
  GCA: "A",
  GCG: "A",
  GGT: "G",
  GGC: "G",
  GGA: "G",
  GGG: "G",
  CCT: "P",
  CCC: "P",
  CCA: "P",
  CCG: "P",
  ACT: "T",
  ACC: "T",
  ACA: "T",
  ACG: "T",
  TCT: "S",
  TCC: "S",
  TCA: "S",
  TCG: "S",
  AGT: "S",
  AGC: "S",
  TAT: "Y",
  TAC: "Y",
  TGG: "W",
  CAA: "Q",
  CAG: "Q",
  AAT: "N",
  AAC: "N",
  CAT: "H",
  CAC: "H",
  GAA: "E",
  GAG: "E",
  GAT: "D",
  GAC: "D",
  AAA: "K",
  AAG: "K",
  CGT: "R",
  CGC: "R",
  CGA: "R",
  CGG: "R",
  AGA: "R",
  AGG: "R",
  TAA: "*",
  TAG: "*",
  TGA: "*",
};

export const codonNames = {
  'I': 'Isoleucine',
  'L': 'Leucine',
  'V': 'Valine',
  'F': 'Phenylalanine',
  'M': 'Methionine',
  'C': 'Cysteine',
  'A': 'Alanine',
  'G': 'Glycine',
  'P': 'Proline',
  'T': 'Threonine',
  'S': 'Serine',
  'Y': 'Tyrosine',
  'W': 'Tryptophan',
  'Q': 'Glutamine',
  'N': 'Asparagine',
  'H': 'Histidine',
  'E': 'Glutamicacid',
  'D': 'Asparticacid',
  'K': 'Lysine',
  'R': 'Arginine',
  "*": 'Stop'
}

// export const noteMappings = {
//     'I': 'A3',
//     'L': 'E4',
//     'V': 'G3',
//     'F': 'D5',
//     'M': 'B4',
//     'C': 'G5',
//     'A': 'F5',
//     'G': 'E3',
//     'P': 'D4',
//     'T': 'F4',
//     'S': 'C5',
//     'Y': 'C3',
//     'W': 'B3',
//     'Q': 'A5',
//     'N': 'D3',
//     'H': 'G4',
//     'E': 'A4',
//     'D': 'F3',
//     'K': 'E5',
//     'R': 'C4',
//     "*": 'B5'
// }

export const noteMappings = {
  'I': 'A3',
  'L': 'E4',
  'V': 'G3',
  'F': 'D5',
  'M': 'B4',
  'C': 'G5',
  'A': 'F5',
  'G': 'E3',
  'P': 'D4',
  'T': 'F4',
  'S': 'C5',
  'Y': 'C3',
  'W': 'B3',
  'Q': 'A5',
  'N': 'D3',
  'H': 'G4',
  'E': 'A4',
  'D': 'F3',
  'K': 'E5',
  'R': 'C4',
  "*": 'B5'
}

export const dnaMapping = { 'A': 0, 'C': 1, 'T': 2, 'G': 3 }
export const numberMapping = { 0: 'A', 1: 'C', 2: 'T', 3: 'G' }

const gem = `bg-gradient-to-r from-[#888] via-[#444] to-[#888] 
bg-clip-text font-bold text-transparent text-[3rem] tracking-[0.5rem]`

export const emojiPalettes = [
  {
    "theme": "Fruits",
    "emojis": ["🍎", "🍌", "🍊", "🍇"]
  },
  {
    "theme": "Animals",
    "emojis": ["🐶", "🐱", "🦁", "🐼"]
  },
  {
    "theme": "Planets",
    "emojis": ["🌍", "🌕", "🪐", "🌞"]
  },
  {
    "theme": "Music Instruments",
    "emojis": ["🎵", "🎹", "🥁", "🎸"]
  },
  {
    "theme": "Sports Balls",
    "emojis": ["⚽", "🏀", "🎾", "🏈"]
  },
  {
    "theme": "Travel Modes",
    "emojis": ["✈️", "🚆", "🚗", "🚀"]
  },
  {
    "theme": "Food Items",
    "emojis": ["🍔", "🍕", "🍣", "🍦"]
  },
  {
    "theme": "Holidays",
    "emojis": ["🎄", "🎃", "🎂", "🎉"]
  },
  {
    "theme": "Art Supplies",
    "emojis": ["🎨", "✏️", "🖌️", "📐"]
  },
  {
    "theme": "Technology",
    "emojis": ["📱", "💻", "📷", "🎮"]
  },
  {
    "theme": "Shapes",
    "emojis": ["🔺", "🔵", "🔶", "🔘"]
  },
  {
    "theme": "Elements",
    "emojis": ["🔥", "💧", "🌱", "🌪️"]
  },
  {
    "theme": "Transportation",
    "emojis": ["🚲", "🛴", "🚁", "🚂"]
  },
  {
    "theme": "Timepieces",
    "emojis": ["⌚", "🕰️", "⏱️", "⏲️"]
  },
  {
    "theme": "Cute Animals",
    "emojis": ["🐼", "🐧", "🦊", "🐢"]
  },
]

