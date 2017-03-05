  export default({audio_context}) => {

	const channel_merger = audio_context.createChannelMerger();
  const gain_1 = audio_context.createGain();
  const gain_2 = audio_context.createGain();
  gain_1.connect(channel_merger);
  gain_2.connect(channel_merger);

  let osc_1, osc_2;

	return {
		noteOn(note, octave, time) {
      osc_1 = audio_context.createOscillator();
      osc_2 = audio_context.createOscillator();
      osc_1.type = 'triangle';
      osc_2.type = 'sine';
      gain_1.gain.exponentialRampToValueAtTime(1, time);
      gain_2.gain.exponentialRampToValueAtTime(1, time);
      osc_1.frequency.setValueAtTime(120, time);
      osc_2.frequency.setValueAtTime(100, time);
      osc_1.frequency.exponentialRampToValueAtTime(.1, time + 0.3);
      osc_2.frequency.exponentialRampToValueAtTime(.1, time + 0.3);
      gain_1.gain.linearRampToValueAtTime(.001, time + 0.4);
      gain_2.gain.linearRampToValueAtTime(.001, time + 0.4);
      osc_1.connect(gain_1);
      osc_2.connect(gain_2);
      osc_1.start(time);
      osc_2.start(time);
      osc_1.stop(time + .4);
      osc_2.stop(time + .4)
		},
		noteOff() {	},
		connect({input}){
			channel_merger.connect(input.input);
		},
		get param(){
			return null
		},
		get type(){
			return null;
		},
	}
}
