import create_track from 'sound/audio/track';

function create_mixer(state){

	const channel_merger = state.audio_context.createChannelMerger(4);

	return {
		connect({input}){
			channel_merger.connect(input);
		},
		get input(){
			return channel_merger;
		},
		assign(track_id, instrument){
			if(!state.tracks.hasOwnProperty(track_id)){
				state.tracks[track_id] = create_track(state.audio_context);
			}
			state.tracks[track_id].assign(instrument);
			state.tracks[track_id].connect({input:channel_merger});
		},
		get tracks(){
			return state.tracks;
		}
	};
}

export default(audio_context) => {
	const state = {
		audio_context: audio_context,
		tracks: {}
	};
	return create_mixer(state);
}
