import createMixer from 'sound/audio/mixer';
import collision_buzzer from 'sound/arkanoid/collision-buzzer';
import is_nil from 'lodash.isnil';

function create_audio_context(){
	if(!is_nil(AudioContext)){
		return new AudioContext()
	}
	else if(!is_nil(webkitAudioContext)) {
		return new webkitAudioContext(); // eslint-disable-line new-cap
	}
	throw new Error('Audio context not found');
}

const audio_context = create_audio_context();

const mixer = createMixer(audio_context);

const collizion_buzzer = collision_buzzer({
	audio_context,
	mixer
});

export default {
	ball_collides_with_bricks(){
		collizion_buzzer.buzz({note: 'A', octave: 3, duration: .125});
	},
	ball_collides_with_vaus(){
		collizion_buzzer.arpegiate(.125,
			{note: 'C', octave: 3, duration: .25},
			{note: 'A', octave: 4, duration: .25},
			{note: 'C', octave: 5, duration: .25},
			{note: 'A', octave: 6, duration: .25}
		);
	},
};
