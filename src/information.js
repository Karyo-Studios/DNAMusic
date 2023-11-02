
export const helpMessages = {
  introduction: [
    {
      name: 'What is DNA?',
      description: 'At its simplest, DNA is the blueprint for life. It contains the genetic code used to build and maintain organisms. It is made up of four basic letters called nucleotides: adenine (A), cytosine (C), guanine (G), and thymine (T).',
    },
    {
      name: 'How is DNA Read?',
      description: 'The order of these nucleotides is very important. They form the instructions. To read these instructions, DNA is grouped into sets of three nucleotides, which are called codons. For example, "ATG" is a codon.',
    },
    {
      name: 'What is a Codon?',
      description: `
A codon is the basic unit of information in DNA. Each three-letter codon corresponds to one of 20 different amino acids, which are the building blocks of proteins. In this way, the DNA sequence provides the blueprint for making proteins, which are the machinery of the cell.

The special codons are "start" codons and "stop" codons. A start codon (ATG) signals the beginning of a protein-coding sequence, while three different stop codons (TGA, TAG, TAA) signal its end.

Let’s translate a word into a DNA sequence. This is an over-simplified and not entirely accurate example, because not every alphabetical letter maps directly to a codon in biology. Like there’s no “O” or “B” amino acid. In our hypothetical example, we'll assign each letter in "HELLO" to a codon. 
  
H = CAT (Histidine)  
E = GAG (Glutamicacid)  
L = CTA (Leucine)  
L = CTG (Leucine)  
O = - - - (No corresponding amino acid)  

This gives us a DNA sequence: CAT, GAG, CTA, CTG
                `,
    },
    {
      name: 'What is DNA Sonification?',
      description: 'DNA sonification is a way of translating the information in DNA into sound. By mapping musical notes or sound elements to different nucleotides or codons, we can "play" the sequence of DNA as a piece of music. So now, instead of making proteins, your DNA makes music.',
    },
    {
      name: '"Hello World" Example',
      description: 'To Come',
    },
  ],
  acids: {
    I: {
      name: "Isoleucine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Isoleucine",
      img: "./assets/structures/L-Isoleucin_-_L-Isoleucine.svg"
    },
    L: {
      name: "Leucine",
      description2: "Leucine (symbol Leu or L) is an essential amino acid that is used in the biosynthesis of proteins. It is essential in humans, meaning the body cannot synthesize it: it must be obtained from the diet. Human dietary sources are foods that contain protein, such as meats, dairy products, soy products, and beans and other legumes.",
      source: "https://en.wikipedia.org/wiki/Leucine",
      img: "./assets/structures/L-Leucine.svg",
    },
    V: {
      name: "Valine",
      description2: "Valine (symbol Val or V) is an α-amino acid that is used in the biosynthesis of proteins. Valine, like other branched-chain amino acids, is synthesized by plants, but not by animals.[9] It is therefore an essential amino acid in animals, and needs to be present in the diet.",
      source: "https://en.wikipedia.org/wiki/Valine",
      img: "./assets/structures/L-valine-skeletal.svg",
    },
    F: {
      name: "Phenylalanine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Phenylalanine",
      img: "./assets/structures/L-Phenylalanin_-_L-Phenylalanine.svg",
    },
    M: {
      name: "Methionine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Methionine",
      img: "./assets/structures/Methionin_-_Methionine.svg",
    },
    C: {
      name: "Cysteine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Cysteine",
      img: "./assets/structures/L-Cystein_-_L-Cysteine.svg",
    },
    A: {
      name: "Alanine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Alanine",
      img: "./assets/structures/L-Alanin_-_L-Alanine.svg",
    },
    G: {
      name: "Glycine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Glycine",
      img: "./assets/structures/Glycine-zwitterion-2D-skeletal.svg",
    },
    P: {
      name: "Proline",
      description: "",
      source: "https://en.wikipedia.org/wiki/Proline",
      img: "./assets/structures/Prolin_-_Proline.svg",
    },
    T: {
      name: "Threonine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Threonine",
      img: "./assets/structures/L-Threonin_-_L-Threonine.svg",
    },
    S: {
      name: "Serine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Serine",
      img: "./assets/structures/L-Serin_-_L-Serine.svg",
    },
    Y: {
      name: "Tyrosine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Tyrosine",
      img: "./assets/structures/L-Tyrosin_-_L-Tyrosine.svg",
    },
    W: {
      name: "Tryptophan",
      description: "",
      source: "https://en.wikipedia.org/wiki/Tryptophan",
      img: "./assets/structures/L-Tryptophan_-_L-Tryptophan.svg",
    },
    Q: {
      name: "Glutamine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Glutamine",
      img: "./assets/structures/L-Glutamin_-_L-Glutamine.svg",
    },
    N: {
      name: "Asparagine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Asparagine",
      img: "./assets/structures/L-Asparagin_-_L-Asparagine.svg",
    },
    H: {
      name: "Histidine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Histidine",
      img: "./assets/structures/L-Histidine_physiological.svg",
    },
    E: {
      name: "Glutamicacid",
      description: "",
      source: "https://en.wikipedia.org/wiki/Glutamic_acid",
      img: "./assets/structures/L-Glutaminsaure_-_L-Glutamic_acid.svg",
    },
    D: {
      name: "Asparticacid",
      description: "",
      source: "https://en.wikipedia.org/wiki/Aspartic_acid",
      img: "./assets/structures/L-Asparaginsaure_-_L-Aspartic_acid.svg",
    },
    K: {
      name: "Lysine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Lysine",
      img: "./assets/structures/L-Lysin_-_L-Lysine.svg",
    },
    R: {
      name: "Arginine",
      description: "",
      source: "https://en.wikipedia.org/wiki/Arginine",
      img: "./assets/structures/Arginin_-_Arginine.svg",
    },
    "*": {
      name: "Stop Codon",
      description: "In biology, certain codons signal the start and stop of a protein-coding sequence.",
      source: "https://en.wikipedia.org/wiki/Stop_codon",
      img: "",
    },
    "other": {
      name: "Not an Amino Acid!",
      description: "There are 20 Amino acids, which means that some letters of the alphabet, and other characters are not included. The letters \"O\", \"J\", \"X\", \"U\", \"Z\", and \"B\".",
      source: "https://en.wikipedia.org/wiki/DNA_and_RNA_codon_tables",
      img: "",
    }
  },
}