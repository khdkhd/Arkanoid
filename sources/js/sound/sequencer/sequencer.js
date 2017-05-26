import Model from 'sound/common/model';
import noop from 'lodash.noop';

export const Sequencer = ({audio_context}) => {

	const state = {
		division: 96, // we can't handle 96 ppqn with requestAnimationFrame
		length: 4,
		stop: true,
		loop: false,
		ntTime: 0, // next tick time
		ticks: 0,
		stTime: audio_context.currentTime, // start time
		onPlay: noop,
		onStop: noop,
		onStart: noop,
		onLoop: noop,
		tempo: Model({
			init: () => 120
		})
	}

	const tick = (state)=> {
		state.ntTime += 60/(state.tempo.value*state.division)
		state.ticks += 1
	}

	const schedule = (op)=> {
		const current_time = audio_context.currentTime - state.stTime
		if (current_time >= state.ntTime) {
			op(current_time, state.ticks)
			tick(state)
			setTimeout(play, 0);
		}
		if(state.loop){
			state.ticks %= (state.length * state.division)
			state.onLoop()
		}
	}

	const play = ()=> {
		if (!state.stop) {
			schedule(state.onPlay)
		}
	}

	return {
		start() {
			state.onStart()
			state.stop = false
			play()
		},
		stop() {
			state.stop = true
			state.onStop()
		},
		isStarted() {
			return !state.stop
		},
		setDivision(division){
			state.division = division
			return this
		},
		getDivision(){
			return state.division
		},
		setLength(length){
			state.length = length
			return this
		},
		setTempo(tempo){
			state.tempo.value = tempo
			return this
		},
		getTempo() {
			return state.tempo.value
		},
		onStart(op){
			state.onStart = op
			return this
		},
		onStop(op){
			state.onStop = op
			return this
		},
		onPlay(op){
			state.onPlay = op
			return this
		},
		onLoop(op){
			state.onLoop = op
			return this
		}
	}
}
