import Model from 'sound/common/model';
import noop from 'lodash.noop';

export default ({audio_context}) => {

	const state = {
		division: 96,
		length: 32,
		stop: true,
		loop: true,
		nextTick: 0,
		start_time: audio_context.currentTime,
		onPlay: noop,
		onStop: noop,
		onStart: noop,
		onLoop: noop,
		pos:  Model({
			init: () => 0
		}),
		tempo: Model({
			init: () => 120
		})
	};

	function tick(state) {
		return 60 / (state.tempo.value * state.division);
	}

	function position(state){
		let pos = state.pos.value + 1;
		if(state.loop) {
			pos %= state.length;
		}
		if(0 === pos) {
			state.onLoop();
		}
		return pos;
	}

	function schedule(op) {
		const current_time = audio_context.currentTime - state.start_time;
		if (current_time >= state.nextTick) {
			op(current_time);
			state.nextTick += tick(state);
			state.pos.value = position(state);
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
			state.pos.value = 0;
			state.onStop();
		},
		isStarted() {
			return !state.stop;
		},
		setDivision(division){
			state.precision = division;
			return this;
		},
		getDivision(){
			return state.division;
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
		},
		onLoop(op){
			state.onLoop = op;
			return this;
		}
	};
}
