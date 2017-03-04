import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';


import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';


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


function create_keyboard_view(state){

	const rect = Rect({
		x: 0,
		y: 0
	},{
		width: state.screen.width,
		height: Math.round(state.screen.height/notes.length)*notes.length
	});
	let height = Math.round(rect.height/notes.length);
	let width = state.screen.width;

	const scene_coordinates = Coordinates(rect);
	const scene = Scene(scene_coordinates);

	const keyboard = SceneObject(scene_coordinates, {
		onRender(screen) {
			screen.save();
			screen.pen = 1;
			screen.pen = '#000';
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

	state.screen.add(scene.add(keyboard));

	return {
		render(){
			state.screen.render()
		}
	}
}


export default ({element, screen})=> {

	const pos = Vector({x: 0, y: 0});
	const state = {
		element,
		screen,
		pos,
		cells: [],
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_keyboard_view(state));
}
