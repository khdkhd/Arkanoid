import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import is_nil from 'lodash.isnil';
import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';
import { getCanvasEventPosition } from 'sound/common/utils';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';


const notes = [
	'A',
	'A#',
	'B',
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#'
].reverse();

export function getNote(event, state){
	const pos = getCanvasEventPosition(event);
	const height = Math.round(state.height/notes.length);
	const i = Math.floor(pos.y/height);
	return notes[i];
}

function View(state){

	const rect = Rect({
		x: 0,
		y: 0
	},{
		width: state.width,
		height: Math.round(state.height/notes.length)*notes.length
	});

	let height = Math.round(rect.height/notes.length);
	let width = state.width;

	const coordinates = Coordinates(rect);
	const scene = Scene(coordinates);
	const keyboard = SceneObject(coordinates, {
		onRender(screen) {
			screen.save();
			screen.pen = 1;
			screen.pen = '#2e2a2a';
			const note_rect = Rect(
				{
					x: 0,
					y: 0
				},
				{
					width,
					height
				}
			);
			notes.forEach((note, i) => {
				screen.save();
				screen.brush = note.indexOf('#') === -1 ? '#fff' : '#000';
				screen.translate({x: 0, y: i*height});
				screen.fillRect(note_rect);
				screen.drawRect(note_rect);
				screen.restore();
			});
		},
		zIndex: 4
	});

	const view = GraphicsView({
		domEvents: MouseEventsHandler({
			onMouseDown(view, event){
				if(!is_nil(state.keyboard)){
					state.keyboard.noteOn(getNote(event,state), 2)
				}
			},
			onMouseUp(){
				if(!is_nil(state.keyboard)){
					state.keyboard.noteOff()
				}
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
	view.screen().add(scene.add(keyboard));
	return view;
}

function Controller(state){
	return {
		setKeyboard(keyboard){
			state.keyboard = keyboard;
		}
	}
}

export default function Keyboard({width, height}) {

	const pos = Vector({x: 0, y: 0});
	const state = {
		width,
		height,
		pos,
		cells: [],
		emitter: new EventEmitter()
	};
	return assign(View(state), Controller(state));
}
