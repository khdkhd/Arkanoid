import mono from 'sound/synth/mono';
import Model  from 'sound/common/model';

export default({audio_context}) => {

	const voices = {};
	const channel_merger = audio_context.createChannelMerger();
	let type_value = 'sine';

	const type = Model({
		param: {
			get value(){
				return type_value;
			},
			set value(value){
				type_value = value;
			}
		}
	});


	return {
		noteOn(freq) {
			const voice = mono({audio_context});
			voice.type.value = type.value;
			voice.noteOn(freq);
			voice.connect(channel_merger);
			voices[freq] = voice;
		},
		noteOff(freq, time) {
			voices[freq].noteOff(time);
		},
		connect({input, connect}){
			channel_merger.connect(input);
			return {connect};
		},
		get envIn(){
			return Object.values(voices).map(voice => voice.envIn);
		},
		get type(){
			return type;
		},
	}
}
