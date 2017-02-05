import createMixer from 'sound/audio/mixer';
import collision_buzzer from 'sound/arkanoid/collision-buzzer';
import is_nil from 'lodash.isnil';
import constant from 'lodash.constant';
import cond from 'lodash.cond';

const create_audio_context = (() => {
	let context = null;
	return cond([
		[() => !is_nil(context), () => context],
		[() => typeof AudioContext !== 'undefined', () => {
			context = new AudioContext();
			return context;
		}],
		[() => typeof webkitAudioContext != 'undefined', () => {
			context = new webkitAudioContext(); // eslint-disable-line new-cap
			return context;
		}],
		[constant(true), () => {
			throw new Error('Audio context not found')
		}]
	]);
})();

const audio_context = create_audio_context();

const mixer = createMixer({audio_context});

const collizion_buzzer = collision_buzzer({
	track_id: 'collision_buzzer',
	audio_context,
	mixer
});

export default {
	ball_collides_with_bricks(){
		collizion_buzzer.buzz({note: 'A', octave: 3, duration: .125});
	},
	ball_collides_with_vaus(){
		collizion_buzzer.buzz({note: 'A', octave: 6, duration: .125});
	},
	ball_collides_with_wall(){
		collizion_buzzer.buzz({note: 'C', octave: 3, duration: .125});
	},
	ball_goes_out(){
		collizion_buzzer.arpegiate(.125, [
			{note: 'G', octave: 4, duration: .125},
			{note: 'F', octave: 3, duration: .125},
			{note: 'E', octave: 2, duration: .125},
			{note: 'D', octave: 1, duration: .125}
		]);
	}
};
