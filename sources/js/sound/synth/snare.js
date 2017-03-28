export default ({audio_context})  => {

  const buffer = (()=> {
    const bufferSize = audio_context.sampleRate;
    const buffer = audio_context.createBuffer(1, bufferSize, audio_context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  })()

  const channel_merger = audio_context.createChannelMerger();

  const noise_gain = audio_context.createGain();
  const filter = audio_context.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;
  filter.connect(noise_gain);

  const osc_gain = audio_context.createGain();

  noise_gain.connect(channel_merger);
  osc_gain.connect(channel_merger);

  return {
    noteOn(note, octave, time) {
      const osc = audio_context.createOscillator();
      osc.type = 'triangle';
      osc.connect(osc_gain);
      const noise = audio_context.createBufferSource();
      noise.buffer = buffer;
      noise.connect(filter);
      noise_gain.gain.setValueAtTime(1, time);
      noise_gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      noise.start(time)
      osc.frequency.setValueAtTime(100, time);
      osc_gain.gain.setValueAtTime(0.7, time);
      osc_gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time)
      osc.stop(time + 0.2);
      noise.stop(time + 0.2);
    },
    noteOff() {	},
    connect({input, connect}){
      channel_merger.connect(input);
      return {input, connect};
    },
    get param(){
      return null
    },
    get type(){
      return null;
    },
  }
}
