import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import is_nil from 'lodash.isnil';
import { completeAssign as assign } from 'common/utils';

import times from 'lodash.times';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';

import Note from 'sound/sequencer/note';

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

function get_note_cell(note, pos, state){
	const y = notes.indexOf(note.note);
	const width = Math.round(state.rect.width/(state.divisors));
	const height = Math.round(state.rect.height/notes.length);
	const x_factor = note.duration * 4;
	return Object.assign({
		note,
		pos,
		y
	},
	Rect({x: pos*width + 1, y:y*height + 1},{width: width * x_factor - 2, height: height - 2}));
}


const View = state => {

	let cols = state.divisors;
	state.rect.width = Math.round(state.rect.width/cols)*cols;
	state.rect.height = Math.round(state.rect.height/notes.length)*notes.length;
	let height = state.rect.height;
	let width = state.rect.width;
	let col_width = Math.round(width/cols);
	let row_height = Math.round(height/notes.length);

	const scene_coordinates = Coordinates(state.rect);
	const scene = Scene(scene_coordinates);

	let grid_coordinates = Coordinates(state.rect);

	const background = SceneObject(grid_coordinates, {
		onRender(screen) {
			screen.save();
			screen.brush = '#282726';
			screen.fillRect(state.rect);
			screen.restore();
		},
		zIndex: 0
	});

	state.grid = SceneObject(grid_coordinates, {
		onRender(screen) {
			screen.pen = 1;
			screen.save();
			times(cols-1, i => {
				screen.pen = (i + 1)%4 === 0 ? '#A37C27' : '#6A8A82';
				screen.translate({x: col_width, y: 0});
				screen.drawLine({x: 0, y: 0}, {x: 0, y: height});
			});
			screen.restore();
			screen.save();
			screen.pen = '#6A8A82';
			times(notes.length, () => {
				screen.translate({x: 0, y: row_height});
				screen.drawLine({x: 0, y: 0}, {x: width, y: 0});
			});
			screen.restore();
			screen.save();
			screen.brush = '#A37C27';
			if(!is_nil(state.cells)){
				state.cells.forEach(cell => screen.fillRect(cell));
			}
			screen.save();
		},
		zIndex: 1
	});

	state.cursor = SceneObject(grid_coordinates, {
		onRender(screen) {
			screen.brush = 'hsla(0, 20%, 27%, 0.28)';
			screen.save();
			screen.fillRect(Rect(state.cursor_pos,{
				width: col_width,
				height
			}));
			screen.restore();
		},
		zIndex: 3
	});
	return scene.add(background).add(state.grid).add(state.cursor);
}

const Controller = state => {

	function get_bounding_cell(cells, {x,y}){
		return cells.find(cell => cell.contains({x,y}));
	}

	function push(cell){
		state.cells.push(cell);
		if(!is_nil(state.track)){
			state.track.pattern[cell.pos].push(cell.note);
		}
	}

	function pop(cell){
		state.cells = state.cells.filter(_cell => _cell !== cell);
		if(!is_nil(state.track)){
			let target = state.track.pattern[cell.pos];
			let note_index = target.indexOf(cell.note);
			target.splice(note_index, 1);
		}

	}

	function create_cell({x,y}){
		const cols = state.divisors;
		const width = Math.round(state.rect.width/cols);
		const height = Math.round(state.rect.height/notes.length);
		const _x = Math.floor(x/width);
		const _y = Math.floor(y/height);
		return Object.assign({
			note: Note({
				note: notes[_y],
				octave: state.octave,
				duration: 'QUARTER'
			}),
			pos: _x,
			y: _y
		},
		Rect({x: _x*width + 1, y:_y*height + 1},{width: width - 2, height: height - 2}));
	}

	function update_position(value){
		const cols = state.divisors;
		const width = state.rect.width;
		let step_x = Math.round(width/cols);
		state.cursor_pos = {
			x: value*step_x,
			y: 0
		};
		console.log('updating position');
		state.cursor.render(this.screen());
	}

	return {
		updateCell(pos){
			const cell = get_bounding_cell(state.cells, pos);
			if(is_nil(cell)){
				push(create_cell(pos));
			} else {
				pop(cell);
			}
		},
		set track(track){
			state.track = track
			state.cells = []
			state.track.pattern.forEach((notes, pos) => {
				for(let note of notes){
					state.cells.push(get_note_cell(note, pos, state));
				}
			});
			state.track.pos.on('change', value => {
				update_position(value);
			});
		},
		updatePattern(){
			state.cells = []
			state.track.pattern.forEach((notes, pos) => {
				for(let note of notes){
					state.cells.push(get_note_cell(note, pos, state));
				}
			});
		}
	};
}

export default ({width, height})=> {
	const pos = Vector({x: 0, y: 0});
	const cursor_pos = Vector({x: 0, y: 0});
	const divisors = 32;
	const octave = 4;
	const state = {
		pos,
		divisors,
		octave,
		cursor_pos,
		width,
		height,
		cells: [],
		rect : Rect(
			pos,
			{
				width,
				height
			}
		),
		emitter: new EventEmitter()
	};
	return assign(View(state), Controller(state));
}
