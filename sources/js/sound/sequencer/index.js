import Model from 'sound/common/model';
import noop from 'lodash.noop';

export default ({audio_context}) => {

	const state = {
		precision: 4,
		length: 32,
		stop: true,
		time: 0,
		start_time: audio_context.currentTime,
		onPlay: noop,
		onStop: noop,
		onStart: noop,
		pos:  Model({
			init: () => -1
		}),
		tempo: Model({
			init: () => 120
		})
	};

	function get_tick() {
		return 60 / (state.tempo.value * state.precision);
	}

	function schedule(op) {
		const current_time = audio_context.currentTime - state.start_time;
		if (current_time >= state.time) {
			op(current_time);
			state.time += get_tick();
			state.pos.value = ++state.pos.value % length;
		}
	}

	function play() {
		if (!stop) {
			schedule(state.onPlay);
			requestAnimationFrame(play);
		}
	}

	return {
		start() {
			state.onStart();
			state.stop = false;
			play();
		},
		stop() {
			state.stop = true;
			state.pos.value = -1;
			state.onStop();
		},
		isStarted() {
			return !state.stop;
		},
		setPrecision(precision){
			state.precision = precision;
			return this;
		},
		setLength(length){
			state.length = length;
			return this;
		},
		setTempo(tempo){
			state.tempo = tempo;
			return this;
		},
		getTempo() {
			return state.tempo;
		},
		getPos() {
			return state.pos;
		},
		onStart(op){
			state.onStart = op;
			return this;
		},
		onStop(op){
			state.onStop = op;
			return this;
		},
		onPlay(op){
			state.onPlay = op;
			return this;
		}
	};
}
