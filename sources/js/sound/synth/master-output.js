function create_master_output(state){
	return {
		get input(){
			return state.audio_context.destination;
		}
	}
}

export default(audio_context)=>{
	const state = {
		audio_context: audio_context
	};
	return create_master_output(state);
}
