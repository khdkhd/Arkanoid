import { Synth, createKeyboard } from 'sound';

import collision_buzzer_patch from 'sound/arkanoid/patches/collision-buzzer-patch';

export default ({track_id, audio_context, mixer}) => {
	const synth = Synth({audio_context});
	const keyboard = createKeyboard({slave: synth});
	synth.patch(collision_buzzer_patch);
	mixer.addTrack(track_id, synth);
	mixer.connect({input:audio_context.destination});
	mixer.tracks[track_id].gain.value = 1;
	return {
		buzz({note, octave, duration}){
			keyboard.playNote(audio_context.currentTime, {note: note, octave: octave, duration: duration});
		},
		arpegiate(interval, notes){
			keyboard.arpegiate(audio_context.currentTime, interval, notes);
		}
	};
}
