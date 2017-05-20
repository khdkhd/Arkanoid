import Rect from 'maths/rect';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import clamp from 'lodash.clamp';
import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';
import is_nil from 'lodash.isnil';

export function fade(event, state) {
	let delta = event.deltaY;
	if(is_nil(event.wheelDelta)){
		delta *= 4;
	}
	const cursor = state.cursor + delta / 10;
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
			// screen.brush = '#fff';
			screen.fillRect(state.rect);
			screen.pen = .5;
			screen.pen = '#333333';
			// screen.drawRect(state.outer_rect);
			screen.brush = '#435675';
			screen.fillRect(state.outer_rect);
			screen.restore();
			screen.save();
			screen.brush = '#77ab63';
			screen.fillRect(
				Rect({
					x: state.outer_rect.bottomLeft.x - state.padding,
					y: state.cursor
				},
				{
					width: state.outer_rect.width + state.padding*2,
					height: state.padding*2
				}));
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
	const padding = 4;
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
		inner_rect: Rect(
			{
				x: pos.x,
				y: padding
			},
			{
				width: width - padding*2,
				height: height - padding*3
			}
		),
		outer_rect: Rect(
			{
				x: pos.x + padding,
				y: pos.y
			},
			{
				width: width - padding*4,
				height: height
			}
		),
		isActive: false,
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(View(state), Controller(state));
}
