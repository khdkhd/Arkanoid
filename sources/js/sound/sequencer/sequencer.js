import Model from 'sound/common/model';
import noop from 'lodash.noop';

export const Sequencer = ({ audio_context }) => {

	const stTime = audio_context.currentTime;
	const state = {
		division: 120,
		length: 8,
		stop: true,
		loop: false,
		stTime: null, // start time
		ntTime: stTime, // next tick time
		tick: 0,
		onPlay: noop,
		onStop: noop,
		onStart: noop,
		onLoop: noop,
		tempo: Model({
			init: () => 120
		})
	}

	const tick = (state, currentTime) => {
		state.ntTime = currentTime + 60 / (state.tempo.value * (state.division))
		state.tick += 1
		if (state.loop) {
			state.tick %= (state.length * state.division)
			if (0 === state.tick) {
				state.onLoop()
			}
		}
	}

	const schedule = (op) => {
		if (null === state.stTime) {
			state.stTime = audio_context.currentTime
		}
		const currentTime = audio_context.currentTime - state.stTime;
		if (currentTime >= state.ntTime) {
			if (!state.stop) {
				op(state.stTime, state.tick, state.tempo.value, state.division)
			}
			tick(state, currentTime)
		}
	}

	const play = () => {
		schedule(state.onPlay)
		requestAnimationFrame(play)
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
		loop() {
			state.loop = true;
			return this;
		},
		setDivision(division) {
			state.division = division
			return this
		},
		getDivision() {
			return state.division
		},
		setLength(length) {
			state.length = length
			return this
		},
		setTempo(tempo) {
			state.tempo.value = tempo
			return this
		},
		getTempo() {
			return state.tempo.value
		},
		onStart(op) {
			state.onStart = op
			return this
		},
		onStop(op) {
			state.onStop = op
			return this
		},
		onPlay(op) {
			state.onPlay = op
			return this
		},
		onLoop(op) {
			state.onLoop = op
			return this
		}
	}
}
