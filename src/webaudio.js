
// export const getAudioContext = (ctx) => {
//     if (!audioContext) {
//       const audioContext = new AudioContext();
//     }
//     return audioContext;
//   };


//   export async function initAudio() {
//     if (typeof window !== 'undefined') {
//       try {
//         await getAudioContext().resume();
//         // await loadWorklets();
//       } catch (err) {
//         console.warn('could not load AudioWorklet effects coarse, crush and shape', err);
//       }
//     }
//   }
  
//   export async function initAudioOnFirstClick() {
//     return new Promise((resolve) => {
//       document.addEventListener('click', async function listener() {
//         await initAudio();
//         resolve();
//         document.removeEventListener('click', listener);
//       });
//     });
//   }
  