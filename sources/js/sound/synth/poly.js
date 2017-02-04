import mono from 'sound/synth/mono';

export default({audio_context}) => {

	const voices = {};
	const channel_merger = audio_context.createChannelMerger();

	return {
		noteOn(freq) {
			const voice = mono({audio_context});
			voice.noteOn(freq);
			voice.connect(channel_merger);
			voices[freq] = voice;
		},
		noteOff(freq, time) {
			voices[freq].noteOff(time);
		},
		connect({input}){
			channel_merger.connect(input);
		},
		get param(){
			return Object.values(voices).map(voice => voice.param);
		}

	}
}
