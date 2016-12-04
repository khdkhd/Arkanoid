function create_master_output(state){
	const _input = state.audio_context.destination;
	return {
		get input(){
			return _input;
		}
	}
}

export default(audio_context)=>{
	const state = {
		audio_context: audio_context
	};
	return create_master_output(state);
}
