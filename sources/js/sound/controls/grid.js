import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import is_nil from 'lodash.isnil';
import { completeAssign as assign } from 'common/utils';
import { get_cursor_position } from 'sound/common/utils';

import Screen from 'graphics/screen';
import times from 'lodash.times';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';
import ui from 'sound/controls/ui';

import create_note from 'sound/sequencer/note';

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
	const width = Math.round(state.inner_rect.width/state.divisors);
	const height = Math.round(state.inner_rect.height/notes.length);
	const x_factor = note.duration * 4;
	return Object.assign({
		note,
		pos,
		y
	},
	Rect({x: pos*width + 1, y:y*height + 1},{width: width * x_factor - 2, height: height - 2}));
}

function create_grid_view(state){


	const canvas = document.createElement('canvas');
	canvas.innerHTML = 'Your browser does not support canvas!';
	const screen = Screen(canvas.getContext('2d'));
	screen.width = state.width;
	screen.height =  state.height;
	state.element.appendChild(canvas);



	function get_bounding_cell(cells, {x,y}){
		return cells.find(cell => cell.contains({x,y}));
	}

	function push(cell){
		state.cells.push(cell);
		state.partition[cell.pos].push(cell.note);
	}

	function pop(cell){
		state.cells = state.cells.filter(_cell => _cell !== cell);
		let target = state.partition[cell.pos];
		let note_index = target.indexOf(cell.note);
		target.splice(note_index, 1);
	}

	function create_cell({x,y}){
		const width = Math.round(state.inner_rect.width/state.divisors);
		const height = Math.round(state.inner_rect.height/notes.length);
		const _x = Math.floor(x/width);
		const _y = Math.floor(y/width);
		return Object.assign({
			note: create_note({
				note: notes[_y],
				octave: state.octave,
				duration: 'QUARTER'
			}),
			pos: _x,
			y: _y
		},
		Rect({x: _x*width + 1, y:_y*height + 1},{width: width - 2, height: height - 2}));
	}

	ui.bind_events({
		element: state.element,
		mousedown: event => {
			const pos = get_cursor_position(canvas, event);
			const cell = get_bounding_cell(state.cells, pos);
			if(is_nil(cell)){
				return push(create_cell(pos));
			}
			return pop(cell);
		},
	});

	const scene = Scene(Coordinates(screen.localRect()));

	const background = SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.save();
			screen.pen = 1;
			screen.brush = '#3c0a3c';
			screen.pen = '#fff';
			screen.fillRect(state.inner_rect);
			screen.drawRect(state.inner_rect);
			screen.restore();
		},
		zIndex: 0
	});

	const grid = SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.pen = '#fff';
			const cols = state.divisors, rows = notes.length;
			const width = state.inner_rect.width;
			const height = state.inner_rect.height;
			const step_x = Math.round(width/cols);
			const step_y = Math.round(height/rows);
			screen.save();
			screen.translate(state.inner_rect.topLeft);
			times(cols, () => {
				screen.translate({x: step_x, y: 0});
				screen.drawLine({x: 0, y: 0}, {x: 0, y: height});
			});
			screen.restore();
			screen.save();
			screen.translate(state.inner_rect.topLeft);
			times(rows, () => {
				screen.translate({x: 0, y: step_y});
				screen.drawLine({x: 0, y: 0}, {x: width, y: 0});
			});
			screen.restore();
			screen.save();
			screen.brush = '#700a2b';
			state.cells.forEach(cell => screen.fillRect(cell));
			screen.save();
		},
		zIndex: 1
	});

	const cursor = SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.pen = '#fff';
			screen.brush = 'hsla(0, 6%, 57%, 0.42)';
			const cols = state.divisors;
			const width = Math.round(state.inner_rect.width/cols);
			const height = state.inner_rect.height;
			screen.save();
			screen.fillRect(Rect(state.cursor_pos,{
					width,
					height
			}));
			screen.restore();
		},
		zIndex: 3
	});

	screen.add(scene.add(background).add(grid).add(cursor));
	screen.translate({x:.5,y:.5});

  return {
    render(){
			screen.clear();
			screen.render();
    }
  }
}

function create_grid_controller(state) {

	function update(value){
		const cols = state.divisors;
		const width = state.inner_rect.width;
		let step_x = Math.round(width/cols);
		state.cursor_pos = {
			x: value * step_x,
			y: 0
		};

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
		set partition(partition){
			state.partition = partition;
			state.partition.forEach((notes, pos) => {
				for(let note of notes){
					state.cells.push(get_note_cell(note, pos, state));
				}
			});
		},
		get param(){
			return state.param;
		}
	};
}

export default ({element})=> {

	let width = 800, height = 600;
	const padding = 5;
	const pos = Vector({x: 0, y: 0});
	const cursor_pos = Vector({x: 0, y: 0});
	const divisors = 16;
	const octave = 2;
	const state = {
		element,
		pos,
		divisors,
		octave,
		cursor_pos,
		padding,
		width,
		height,
		cells: [],
		inner_rect : Rect(
			pos,
			{
				width,
				height
			}
		),
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_grid_controller(state), create_grid_view(state));
}
