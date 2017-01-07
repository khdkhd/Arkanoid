import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import ui from 'sound/controls/ui';

const offset = 0;
const curve_start = -Math.PI/2 + offset;
const curve_end = 2*Math.PI - Math.PI/2 - offset;
const curve_length = curve_end - curve_start;
const inc_factor = 25;

function create_knob_view(state){
	return  {
		render(screen){
			screen.save();
			screen.pen =1;
			screen.pen = '#fff';
			screen.beginPath();
			screen.arc(state.pos, state.outer_radius, 0, 2*Math.PI);
			screen.drawPath();
			screen.beginPath();
			screen.arc(state.pos, state.inner_radius, 0, 2*Math.PI);
			screen.drawPath();
			screen.pen = state.cursor_width;
			screen.pen = '#ccc';
			screen.beginPath();
			screen.arc(state.pos, state.cursor_radius, curve_start, curve_end);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.pen = '#fff';
			screen.pen = state.cursor_width;
			screen.beginPath();
			screen.arc(state.pos, state.cursor_radius, curve_start, state.angle);
			screen.drawPath();
			screen.restore();
		}
	};
}

function create_knob_controller(state) {

	function clamp(angle){
		return _clamp(angle, curve_start, curve_end);
	}

	function get_angle_increment(event){
		return Math.sign(-event.movementY)*curve_length/inc_factor;
	}

	function tweak(event) {
		state.angle = clamp(state.angle + get_angle_increment(event));
		state.emitter.emit('change', (state.angle + Math.PI/2)/curve_length);
	}

	function update(value){
		state.angle = curve_length*value - Math.PI/2;
	}

	ui.bind_events({
		mousemove: event => {
			if (state.isActive) {
				tweak(event);
			}
		},
		mouseup: () => {
			if (state.isActive) {
				state.isActive = false;
			}
		},
		mousedown: event => {
			const x = event.clientX - event.target.offsetLeft;
			const y = event.clientY - event.target.offsetTop;
			if (state.bbox.contains({x: x,y: y})) {
				state.isActive = true;
			}
		}
	});

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

export default ({pos, radius})=> {
	const state = {
		pos: pos,
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
