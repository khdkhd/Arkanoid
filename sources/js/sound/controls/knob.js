import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import Screen from 'graphics/screen';
import ui from 'sound/controls/ui';

function create_knob_view(state){

	const canvas = document.createElement('canvas');
	canvas.innerHTML = 'Your browser does not support canvas!';
	const screen = Screen(canvas.getContext('2d'));
	screen.width = 2 * state.outer_radius + state.padding*2;
	screen.height = 2 * state.outer_radius + state.padding*2;
	state.parent.appendChild(canvas);

	function clamp(angle) {
		return _clamp(angle, state.curve_start, state.curve_end);
	}

	function get_angle_increment(event){
		switch(event.type){
			case 'mousewheel':
				return Math.sign(event.wheelDelta)*(state.curve_length/state.inc_factor);
			case 'mousemove':
				return Math.sign(-event.movementY)*(state.curve_length/state.inc_factor);
		}
	}

	function tweak(event) {
		state.angle = clamp(state.angle + get_angle_increment(event));
		state.emitter.emit('change', (state.angle + Math.PI/2)/state.curve_length);
	}

	ui.bind_events({
		element: state.parent,
		mousemove: event => {
			if (state.isActive) {
				//tweak(event);
			}
		},
		mouseup: () => {
			state.isActive = false;
		},
		mousedown: () => {
			state.isActive = true;
		},
		mousewheel: event => {
			tweak(event);
		}
	});

	return  {
		render(){
			screen.clear();
			screen.brush = '#40504f';
			screen.save();
			screen.pen =1;
			screen.pen = '#999';
			screen.beginPath();
			screen.arc(state.pos, state.outer_radius, 0, 2*Math.PI);
			screen.drawPath();
			screen.beginPath();
			screen.arc(state.pos, state.inner_radius, 0, 2*Math.PI);
			screen.drawPath();
			screen.pen = state.cursor_width;
			screen.pen = '#546e6c';
			screen.beginPath();
			screen.arc(state.pos, state.cursor_radius, state.curve_start, state.curve_end);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.pen = '#a5cbc8';
			screen.pen = state.cursor_width;
			screen.beginPath();
			screen.arc(state.pos, state.cursor_radius, state.curve_start, state.angle);
			screen.drawPath();
			screen.restore();
		}
	};
}

function create_knob_controller(state) {

	function update(value){
		state.angle = state.curve_length*value - Math.PI/2;
	}

	state.emitter.on('change', value => state.param.value = value);

	return {
		set param(audio_param){
			audio_param.on('change', value => {
				if(!state.isActive){
					update(value);
				}
			});
			update(audio_param.value);
			state.param = audio_param;
		},
		get param(){
			return state.param;
		}
	};
}

export default ({parent})=> {
	let radius = 50;
	const padding = 5;
	let pos = {x:radius + padding,y: radius + padding};
	const offset = 0;
	const curve_start = -Math.PI/2 + offset;
	const curve_end = 2*Math.PI - Math.PI/2 - offset;
	const curve_length = curve_end - curve_start;
	const inc_factor = 25;
	const state = {
		parent: document.querySelector(parent),
		pos,
		padding,
		curve_start,
		curve_end,
		curve_length,
		inc_factor,
		outer_radius: radius,
		inner_radius: radius - radius*.64,
		cursor_radius: radius - radius*.32,
		cursor_width: radius*.4,
		bbox: Rect(Vector(pos).add({x: -radius, y: -radius}), {width: radius*2, height: radius*2}),
		angle: curve_start,
		isActive: false,
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_knob_view(state), create_knob_controller(state));
}
