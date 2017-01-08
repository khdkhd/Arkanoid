function create_audio_context_mock(sandbox){
	const audio_param = {
		setValueAtTime: sandbox.spy(),
		cancelScheduledValues: sandbox.spy(),
		linearRampToValueAtTime: sandbox.spy(),
		set value(value){

		},
		get value(){

		}
	}

	function create_gain() {
		return {
			gain: Object.assign({}, audio_param),
			connect: sandbox.spy()
		}
	}

	function create_oscillator() {
		return {
			get frequency() {
				return Object.assign({}, audio_param);
			},
			connect: sandbox.spy(),
			start: sandbox.spy()
		}
	}

	function create_channel_merger(){
		return {
			connect: sandbox.spy()
		}
	}

	function create_biquad_filter() {
		return {
			frequency: Object.assign({}, audio_param),
			grain: Object.assign({}, audio_param),
			Q: Object.assign({}, audio_param),
			connect: sandbox.spy()
		}
	}

	const oscillators = [];
	const gains = [];

	const audio_context_methods = {
		createOscillator(){
			const osc = create_oscillator();
			oscillators.push(osc);
			return osc;
		},
		createGain(){
			const gain = create_gain();
			gains.push(gain);
			return gain;
		},
		createBiquadFilter(){
			return create_biquad_filter();
		},
		createChannelMerger() {
			return create_channel_merger();
		}
	};

	for(let func of Object.keys(audio_context_methods)){
		sandbox.spy(audio_context_methods, func);
	}

	return Object.assign({}, audio_context_methods, {
		get oscillators(){
			return oscillators;
		},
		get gains(){
			return gains;
		}
	});
}

export default sandbox => create_audio_context_mock(sandbox);
