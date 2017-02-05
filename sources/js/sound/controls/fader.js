import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import Screen from 'graphics/screen';


function create_fader_view(state){

	function clamp(pos, state){
		return _clamp(pos, state.inner_rect.topLeft.y, state.inner_rect.bottomRight.y);
	}

	function fade(event) {
		state.cursor = clamp(state.cursor + event.movementY, state);
		state.emitter.emit('change', unscale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, state.cursor));
	}

	const canvas = document.createElement('canvas');
	canvas.innerHTML = 'Your browser does not support canvas!';
	const screen = Screen(canvas.getContext('2d'));
	screen.width = state.width;
	screen.height =  state.height;
	state.element.appendChild(canvas);

	ui.bind_events({
		element: state.element,
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

	return  {
		render(){
			screen.brush= '#fff';
			screen.clear();
			screen.save();
			screen.pen = 1;
			screen.pen = '#9a8c8c';
			screen.beginPath();
			screen.drawRect(state.outer_rect);
			screen.drawPath();
			screen.brush = '#546e6c';
			screen.pen = '#546e6c';
			screen.beginPath();
			screen.fillRect(state.inner_rect);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.brush = '#a5cbc8';
			screen.pen = '#a5cbc8';
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
				}
			});
			screen.drawPath();
			screen.restore();
		}
	};
}

function create_fader_controller(state) {

	function update(value){
		state.cursor = scale({min: state.inner_rect.topLeft.y, max: state.inner_rect.bottomRight.y}, value);
	}

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

export default ({element})=> {

	let width = 50, height = 150;
	const padding = 5;
	const pos = {x: padding, y: padding};
	const state = {
		element,
		pos,
		padding,
		width,
		height,
		cursor: pos.y + height - padding,
		outer_rect: {
			topLeft: {
				x: pos.x,
				y: pos.y
			},
			topRight: {
				x: pos.x + width - padding,
				y: pos.y
			},
			bottomRight: {
				x: pos.x + width -padding,
				y: pos.y + height-padding
			},
			bottomLeft: {
				x: pos.x,
				y: pos.y + height-padding
			},
		},
		inner_rect: {
			topLeft: {
				x: pos.x + padding,
				y: pos.y + padding
			},
			topRight: {
				x: pos.x + width - padding*2,
				y: pos.y + padding
			},
			bottomRight: {
				x: pos.x + width - padding*2,
				y: pos.y + height - padding*2
			},
			bottomLeft: {
				x: pos.x + padding,
				y: pos.y + height - padding*2
			}
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
