import create_track from 'sound/sequencer/track';

function create_sequencer(state) {

	function tick(){
		return 60/(state.tempo*state.precision);
	}

	return {
		start() {
			state.start_time = state.audio_context.currentTime;
		},
		play(){
			const current_time = state.audio_context.currentTime - state.start_time;
			if(current_time >= state.time){
				for(let track of Object.values(state.tracks)){
					track.schedule(current_time);
				}
				state.time += tick();
			}
		},
		set tempo(value){
			state.tempo = value;
		},
		assign(track_id, slave){
			console.log('assign', track_id, 'to', slave);
			if(!state.tracks.hasOwnProperty(track_id)){
				state.tracks[track_id] = create_track(state);
			}
			state.tracks[track_id].assign(slave);
		},
		get tracks(){
			return state.tracks;
		}
	};
}

export default (audio_context) => {
	const state = {
		audio_context: audio_context,
		tracks: {},
		precision: 4,
		tempo: 120,
		time: 0,
		start_time: 0
	};
	return create_sequencer(state);
}
