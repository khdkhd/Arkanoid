import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import ui from 'sound/controls/ui';


function create_fader_view(state){

	const screen = state.screen;

	function clamp(pos, state){
		return _clamp(pos, state.inner_rect.topLeft.y, state.inner_rect.bottomRight.y);
	}

	function fade(event) {
		switch(event.type){
			case 'mousewheel':
				state.cursor = clamp(state.cursor - event.wheelDelta/10, state);
				break;
			case 'DOMMouseScroll':
				state.cursor = clamp(state.cursor + event.detail, state);
				break;
			case 'mousemove':
				state.cursor = clamp(state.cursor + event.movementY, state);
				break;
		}
		state.emitter.emit('change', unscale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, state.cursor));
		// state.cursor = clamp(state.cursor + event.movementY, state);
		// state.emitter.emit('change', unscale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, state.cursor));
	}


	ui.bind_events({
		element: state.element,
		mousemove: () => {
			if (state.isActive) {
				//tweak(event);
			}
		},
		mouseup: () => {
			state.isActive = false;
		},
		mousedown: () => {

		},
		mousewheel: event => {
			state.isActive = true;
			fade(event);
		}
	});


	return  {
		render(){
			screen.brush= '#2f1f2f';
			screen.clear();
			screen.save();
			screen.pen = 1;
			screen.pen = '#aba1ab';
			screen.brush = '#2f1f2f';
			screen.beginPath(); // useless ?
			screen.drawRect(state.outer_rect);
			screen.drawPath();
			screen.brush = '#aba1ab';
			screen.pen = '#aba1ab';
			screen.beginPath();
			screen.fillRect(state.inner_rect);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.brush = '#700a2b';
			screen.pen = '#700a2b';
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
		state.cursor = scale({max: state.inner_rect.topLeft.y, min: state.inner_rect.bottomRight.y}, value);
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

export default ({element, screen})=> {

	const padding = 5;
	const pos = {x: padding, y: padding};
	let width = screen.width, height = screen.height;
	const state = {
		element,
		screen,
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
				x: pos.x + width - padding*2,
				y: pos.y
			},
			bottomRight: {
				x: pos.x + width -padding*2,
				y: pos.y + height-padding*2
			},
			bottomLeft: {
				x: pos.x,
				y: pos.y + height-padding*2
			},
		},
		inner_rect: {
			topLeft: {
				x: pos.x + padding,
				y: pos.y + padding
			},
			topRight: {
				x: pos.x + width - padding*3,
				y: pos.y + padding
			},
			bottomRight: {
				x: pos.x + width - padding*3,
				y: pos.y + height - padding*3
			},
			bottomLeft: {
				x: pos.x + padding,
				y: pos.y + height - padding*3
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
