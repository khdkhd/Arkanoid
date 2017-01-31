import { createSynth, createSequencer } from 'sound';

import music_player_patch from 'sound/arkanoid/patches/music-player-patch';

const introduction_partition = [
	[
		{note:'G', octave: 4, duration: 'QUARTER'},{},{note:'A', octave: 4, duration: 'EIGHTH'},{note:'A', octave: 4, duration: 'EIGHTH'},
		{note:'G', octave: 4, duration: 'EIGHTH'},{},{note:'G', octave: 4, duration: 'EIGHTH'},{note:'D', octave: 5, duration: 'EIGHTH'},
		{note:'A', octave: 4, duration: 'EIGHTH'},{},{note:'G', octave: 4, duration: 'EIGHTH'},{},
		{note:'A', octave: 4, duration: 'EIGHTH'},{},{note:'D', octave: 5, duration: 'EIGHTH'},{}
	],
	[
		{note:'B', octave: 4, duration: 'EIGHTH'},{},{},{},
		{},{},{},{},
		{},{},{},{},
		{},{},{},{}
	]
];

function create_music_player(state){
	const seq = createSequencer(state.audio_context);
	const synth = createSynth(state.audio_context);
	synth.patch(music_player_patch);
	state.mixer.assign(state.track_id, synth);
	state.mixer.connect({input:state.audio_context.destination});
	state.mixer.tracks[state.track_id].gain.value = .5;
	return {

	};
}

export default state => {
	return create_music_player(state);
}
