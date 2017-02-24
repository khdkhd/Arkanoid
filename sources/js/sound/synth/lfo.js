import { create_audio_model } from 'sound/common/utils';

export default({audio_context})=> {

		const frequency_range = {
			min: 0,
			max: 15
		};
		const gain_range = {
			min: 0,
			max: 450
		};

		const osc = audio_context.createOscillator();
		const gain = audio_context.createGain();

		const frequency = create_audio_model({
			param: osc.frequency,
			range: frequency_range
		})

		const amplitude = create_audio_model({
			param: gain.gain,
			range: gain_range
		});

		const type = create_audio_model({
			param: {
				set value(value){
					osc.type = value;
				},
				get value(){
					return osc.type;
				}
			}
		});


		return {
			connect({param}){
				osc.connect(gain);
				gain.connect(param);
				osc.start();
			},
			get frequency(){
				return frequency;
			},
			get amplitude(){
				return amplitude;
			},
			get type(){
				return type;
			}
		};
}
