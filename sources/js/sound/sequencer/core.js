import Track from 'sound/sequencer/track';

function create_sequencer(state) {

	function tick(){
		return state.tempo / (60 * state.length);
	}

	return {
		start() {
			state.time = state.audio_context.currentTime;
		},
		play(){
			if(state.time + tick() >= state.audio_context.currentTime){
				state.time += tick();
				state.tracks.forEach(track => track.schedule(state.time));
			}
		},
		set tempo(value){
			state.tempo = value;
		},
		assign(track_id, slave){
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
		tracks: [Track()],
		length: 32,
		tempo: 120,
		time: 0,
		pos: 0
	};
	return create_sequencer(state);
}
