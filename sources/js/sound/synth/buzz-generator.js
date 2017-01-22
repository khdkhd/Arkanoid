export default({audio_context, factory})=> {

	const vco = factory['vco']({audio_context});
	const vca = factory['vca']({audio_context});
	const main_vca = factory['vca']({audio_context});

	return {
		connect({input}) {
			vco.connect(vca);
			vca.connect(main_vca);
			main_vca.connect({input});
		},
		noteOn(freq, time) {
			vco.noteOn(freq, time);
			vca.gain.setValueAtTime(1, time);
		},
		noteOff(freq = null, time){
			vca.gain.setValueAtTime(0, time);
		},
		get type(){
			return vco.type;
		},
		get gain(){
			return main_vca.gain;
		},
	};

}
