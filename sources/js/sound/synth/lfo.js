import Model from 'sound/common/model';

export default({audio_context})=> {

		const frequency_range = {
			min: 0,
			max: 20
		};
		const gain_range = {
			min: 0,
			max: 250
		};

		const osc = audio_context.createOscillator();
		const gain = audio_context.createGain();

		const frequency = Model({
			param: osc.frequency,
			range: frequency_range
		})

		const amplitude = Model({
			param: gain.gain,
			range: gain_range
		});

		const type = Model({
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
			connect({lfoIn}){
				osc.connect(gain);
				gain.connect(lfoIn);
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
