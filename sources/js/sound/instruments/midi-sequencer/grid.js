import GridScene from './grid-scene';
import { getCanvasEventPosition } from 'sound/common/utils';
import is_nil from 'lodash.isnil';
import { completeAssign as assign } from 'common/utils';
import times from 'lodash.times';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';
import EventEmitter from 'events';
import { Flux } from './flux'

let current_grid
const grids = {}


export function midiToGrid(events) {
	const noteOnEvents = events.filter(event => 'NOTE_ON' === event.type)
	const noteOffEvents = events.filter(event => 'NOTE_OFF' === event.type)
	return noteOnEvents.reduce((a, n) => {
		const i = noteOffEvents.findIndex(noteOff => {
			return noteOff.data.value === n.data.value && n.data.octave === noteOff.data.octave
		})
		if (i > 0) {
			const noteOff = noteOffEvents.splice(i, 1)[0]
			n.data.duration = noteOff.time - n.time
			a.push(n.data)
		}
		return a
	}, [])
}

const View = state => {

	const view = GraphicsView({
		domEvents: MouseEventsHandler({
			onMouseDown(view, event) {
				if (!is_nil(current_grid)) {
					current_grid.updateCell(getCanvasEventPosition(event))
					current_grid.render(view.screen())
				}
			}
		}),
		onBeforeRender(screen) {
			screen.setSize({
				width: Math.round(state.width / 32) * 32,
				height: Math.round(state.height / 12) * 12
			})
			state.width = screen.width
			state.height = screen.height
			times(10, i => {
				grids[i] = GridScene({ width: state.width, height: state.height }, screen)
			})
			view.screen().add(grids[0])
			current_grid = grids[0]
			Flux.subscribe({
				type: 'pattern-change'
			}, events => {
				current_grid.updatePattern(midiToGrid(events))
				current_grid.render(view.screen())
			})

		}
	});

	return view;
}

const Controller = state => {
	return {
		setSequencer(sequencer) {
			state.sequencer = sequencer

			return this
		},
		setTrack(track) {
			Flux.dispatch({ type: 'track-change', data: track })
		}
	}
}


export default ({ width, height }) => {
	const state = {
		width,
		height,
		emitter: new EventEmitter()
	}
	return assign(View(state), Controller(state));
}
