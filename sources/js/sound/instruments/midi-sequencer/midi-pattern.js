import { Flux } from './flux'

export const MidiPattern = (events = []) => {

	const state = {
		events: [...events]
	}

	return {
		getEvents(tick = null, buffer = 1) {
			if (null === tick) {
				return state.events
			}
			// we can't handle 96 ppqn with requestAnimationFrame
			return state.events.filter((event) => event.time >= tick * buffer && event.time <= (tick + 1) * buffer)
		},
		push(event) {
			state.events.push[event]
		},
		setEvents(events) {
			state.events = [...events]
			Flux.dispatch({ type: 'pattern-change', data: state.events })
			return this
		}
	}
}
