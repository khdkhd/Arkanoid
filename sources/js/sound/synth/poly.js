import mono from 'sound/synth/mono';
import { create_audio_model } from 'sound/common/utils';

export default({audio_context}) => {

	const voices = {};
	const channel_merger = audio_context.createChannelMerger();
	let _type = 'sine';

	const type = create_audio_model({
		param: {
			get value(){
				return _type;
			},
			set value(value){
				_type = value;
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
		connect({input}){
			channel_merger.connect(input);
		},
		get param(){
			return Object.values(voices).map(voice => voice.param);
		},
		get type(){
			return type;
		},
	}
}
