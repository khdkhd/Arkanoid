import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';

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
		return _clamp(pos, state.inner_rect.y, state.inner_rect.y + state.inner_rect.height);
	}

	function fade(event) {
		state.cursor = clamp(state.cursor - event.movementY, state);
		state.emitter.emit('change', -(state.inner_rect.y - state.cursor)/state.inner_rect.height);
	}

	function update(value){
		state.cursor = value*state.inner_rect.height + state.inner_rect.y;
	}

	document.addEventListener('mousedown', event => {
		const x = event.clientX - event.target.offsetLeft;
		const y = event.clientY - event.target.offsetTop;
		if (state.bbox.contains({x , y})) {
			state.isActive = true;
		}
	});

	document.addEventListener('mouseup', () => {
		if (state.isActive) {
			state.isActive = false;
		}
	});

	document.addEventListener('mousemove', event => {
		if (state.isActive) {
			fade(event);
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
		cursor: pos.y + padding,
		outer_rect: Object.assign(pos, {width, height}),
		inner_rect: {
			x: pos.x + padding,
			y: pos.y + padding,
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
