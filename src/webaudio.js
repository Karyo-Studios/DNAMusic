// export const getEnvelope = (attack, decay, sustain, release, velocity, begin) => {
//     const gainNode = getAudioContext().createGain();
//     gainNode.gain.setValueAtTime(0, begin);
//     gainNode.gain.linearRampToValueAtTime(velocity, begin + attack); // attack
//     gainNode.gain.linearRampToValueAtTime(sustain * velocity, begin + attack + decay); // sustain start
//     // sustain end
//     return {
//       node: gainNode,
//       stop: (t) => {
//         //if (typeof gainNode.gain.cancelAndHoldAtTime === 'function') {
//         // gainNode.gain.cancelAndHoldAtTime(t); // this seems to release instantly....
//         // see https://discord.com/channels/779427371270275082/937365093082079272/1086053607360712735
//         //} else {
//         // firefox: this will glitch when the sustain has not been reached yet at the time of release
//         gainNode.gain.setValueAtTime(sustain * velocity, t);
//         //}
//         gainNode.gain.linearRampToValueAtTime(0, t + release);
//       },
//     };
//   };
  