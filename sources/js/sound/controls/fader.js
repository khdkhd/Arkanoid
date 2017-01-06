import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import bind_events from 'sound/controls/event-binder';

function create_fader_view(state){
	function get_cursor_height(){
		return state.inner_rect.y - state.cursor;
	}

	return  {
		render(screen){
			screen.save();
			screen.pen = 1;
			screen.pen = '#fff';
			screen.beginPath();
			screen.drawRect(state.outer_rect);
			screen.drawPath();
			screen.brush = '#ccc';
			screen.beginPath();
			screen.fillRect(state.inner_rect);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.brush = '#fff';
			screen.pen = '#fff';
			screen.beginPath();
			screen.fillRect({
				topLeft: {
					x: state.inner_rect.bottomLeft.x,
					y: state.cursor
				},
				topRight: {
					x: state.inner_rect.topRight.x,
					y: state.cursor
				},
				bottomRight: {
					x: state.inner_rect.bottomRight.x,
					y: state.inner_rect.bottomRight.y
				},
				bottomLeft: {
					x: state.inner_rect.bottomLeft.x,
					y: state.inner_rect.bottomLeft.y
				},
				x: state.inner_rect.x,
				y: state.inner_rect.y + state.inner_rect.height,
				width: state.inner_rect.width,
				height: get_cursor_height()
			});
			screen.drawPath();
			screen.restore();
		}
	};
}

function create_fader_controller(state) {

	function clamp(pos, state){
		return _clamp(pos, state.inner_rect.topLeft.y, state.inner_rect.bottomRight.y);
	}

	function fade(event) {
		state.cursor = clamp(state.cursor + event.movementY, state);
		state.emitter.emit('change', unscale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, state.cursor));
	}

	function update(value){
		state.cursor = scale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, value);
	}

	bind_events({
		mousedown: event => {
			const x = event.clientX - event.target.offsetLeft;
			const y = event.clientY - event.target.offsetTop;
			if (state.bbox.contains({x , y})) {
				state.isActive = true;
			}
		},
		mousemove: event => {
			if (state.isActive) {
				fade(event);
			}
		},
		mouseup: () => {
			if (state.isActive) {
				state.isActive = false;
			}
		}
	});

	state.emitter.on('change', value => state.param.value = value);

	return {
		set param(audio_param){
			state.param = audio_param;
			state.param.on('change', value => {
				if(!state.isActive){
					update(value);
				}
			});
			update(audio_param.value);
		},
		get param(){
			return state.param;
		}
	};
}

export default ({pos, width, height})=> {

	const padding = width*.175;
	const state = {
		pos: pos,
		height: height - padding,
		cursor: pos.y + height - padding,
		outer_rect: {
			topLeft: {
				x: pos.x,
				y: pos.y
			},
			topRight: {
				x: pos.x + width,
				y: pos.y
			},
			bottomRight: {
				x: pos.x + width,
				y: pos.y + height
			},
			bottomLeft: {
				x: pos.x,
				y: pos.y + height
			},
		},
		inner_rect: {
			topLeft: {
				x: pos.x + padding,
				y: pos.y + padding
			},
			topRight: {
				x: pos.x + width - padding,
				y: pos.y + padding
			},
			bottomRight: {
				x: pos.x + width - padding,
				y: pos.y + height - padding
			},
			bottomLeft: {
				x: pos.x + padding,
				y: pos.y + height - padding
			},
			width: width - padding*2,
			height: height - padding*2
		},
		bbox: Rect(Vector(pos), {width, height}),
		isActive: false,
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_fader_view(state), create_fader_controller(state));
}
