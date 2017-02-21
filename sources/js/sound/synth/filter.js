import { create_audio_model } from 'sound/common/utils';

export default({audio_context})=> {

		const frequency_range = {
			min: 33,
			max: 8250
		};
		const gain_range = {
			min: 0,
			max: 1000
		};
		const Q_range = {
			min: 0,
			max: 25
		};

		const filter = audio_context.createBiquadFilter();

		const frequency = create_audio_model({
			param: filter.frequency,
			range: frequency_range
		});

		const gain = create_audio_model({
			param: filter.gain,
			range: gain_range
		});

		const Q = create_audio_model({
			param: filter.Q,
			range: Q_range
		});

		const type = create_audio_model({
			param : {
				get value(){
					return filter.type;
				},
				set value(value){
					filter.type = value;
				}
			}
		});

		return {
			connect({input}){
				filter.connect(input);
			},
			get input(){
				return filter;
			},
			get param(){
				return filter.frequency;
			},
			get type(){
				return type;
			},
			get frequency(){
				return frequency;
			},
			get gain(){
				return gain;
			},
			get Q(){
				return Q;
			}
		};
}
