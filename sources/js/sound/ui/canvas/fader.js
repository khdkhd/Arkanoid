import Rect from 'maths/rect';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import clamp from 'lodash.clamp';
import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';

export function fade(event, state) {
	const cursor = state.cursor + event.deltaY / 10;
	const from = state.inner_rect.topLeft.y;
	const to = state.inner_rect.bottomRight.y;
	state.cursor = clamp(cursor, from, to);
	state.emitter.emit('change', unscale({
		max: state.inner_rect.topLeft.y,
		min: state.inner_rect.bottomRight.y
	}, state.cursor));
}

const View = state => {

	const coordinates = Coordinates(state.rect);
	const scene = Scene(coordinates);

	const fader = SceneObject(coordinates, {
		onRender(screen){
			screen.save();
			screen.pen = .5;
			screen.pen = '#333333';
			screen.drawRect(state.outer_rect);
			screen.brush = '#cbc5cb';
			screen.fillRect(state.inner_rect);
			screen.restore();
			screen.save();
			screen.brush = 'rgb(67, 86, 117)';
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
			screen.restore();
		}
	});

	const view = GraphicsView({
		domEvents: MouseEventsHandler({
			onMouseWheel(view, event){
				fade(event, state);
			}
		}),
		onBeforeRender(screen){
			screen.setBackgroundColor('#fff');
			screen.setSize({
				width: state.width,
				height: state.height
			})
		}
	});
	view.screen().add(scene.add(fader));
	return view;
}
const Controller = state => {

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

export default ({width, height})=> {
	const padding = 3;
	const pos = {x: padding, y: padding};
	const state = {
		pos,
		padding,
		width,
		height,
		cursor: pos.y + height - padding*3,
		rect: Rect(
			{
				x: 0,
				y: 0
			},
			{
				width,
				height
			}
		),
		outer_rect: Rect(
			{
				x: pos.x,
				y: pos.y
			},
			{
				width: width - padding*2,
				height: height - padding*2
			}
		),
		inner_rect: Rect(
			{
				x: pos.x + padding,
				y: pos.y + padding
			},
			{
				width: width - padding*4,
				height: height - padding*4
			}
		),
		isActive: false,
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, View(state), Controller(state));
}
