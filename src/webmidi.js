import * as _WebMidi from 'webmidi';

export const { WebMidi } = _WebMidi;

function supportsMidi() {
  return typeof navigator.requestMIDIAccess === 'function';
}

export function enableWebMidi(options = {}) {
  const { onReady, onConnected, onDisconnected } = options;

  if (!supportsMidi()) {
    console.error('Your Browser does not support WebMIDI.');
    return
  }
  return new Promise((resolve, reject) => {
    if (WebMidi.enabled) {
      // if already enabled, just resolve WebMidi
      resolve(WebMidi);
      return;
    }
    WebMidi.enable((err) => {
      if (err) {
        reject(err);
      }
      WebMidi.addListener('connected', (e) => {
        onConnected?.(WebMidi);
      });
      // Reacting when a device becomes unavailable
      WebMidi.addListener('disconnected', (e) => {
        onDisconnected?.(WebMidi, e);
      });
      onReady?.(WebMidi);
      resolve(WebMidi);
    });
  });
}
// const outputByName = (name: string) => WebMidi.getOutputByName(name);
const outputByName = (name) => WebMidi.getOutputByName(name);

export const getDevice = (output, outputs) => {
  if (!outputs.length) {
    throw new Error(`🔌 No MIDI devices found. Connect a device or enable IAC Driver.`);
  }
  if (typeof output === 'number') {
    return outputs[output];
  }
  if (typeof output === 'string') {
    return outputByName(output);
  }
  return outputs[0];
}