import Model from 'sound/common/model';

export default({audio_context})=> {

		const frequency_range = {
			min: 33,
			max: 4500
		};
		const gain_range = {
			min: 0,
			max: 1000
		};
		const Q_range = {
			min: 0,
			max: 10
		};

		const filter = audio_context.createBiquadFilter();

		const frequency = Model({
			param: filter.frequency,
			range: frequency_range
		});

		const gain = Model({
			param: filter.gain,
			range: gain_range
		});

		const Q = Model({
			param: filter.Q,
			range: Q_range
		});

		const type = Model({
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
			connect({input, connect}){
				filter.connect(input);
				return {connect};
			},
			get input(){
				return filter;
			},
			get lfoIn(){
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
