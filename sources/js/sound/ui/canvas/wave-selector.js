import EventEmitter from 'events';
import {
	completeAssign as assign
} from 'common/utils';
import ui from 'sound/controls/ui';
import times from 'lodash.times';
import keyboard from 'ui/keyboard';
import {
	default as GraphicsView,
	MouseEventsHandler
} from 'ui/graphics-view';
import Coordinates from 'graphics/coordinates';
import Rect from 'maths/rect';
import SceneObject from 'graphics/scene-object';
import GroupView from 'sound/ui/common/group-view';
import Scene from 'graphics/scene';
import Spinbox from 'sound/ui/canvas/spinbox';


function drawSine(screen, state) {
	screen.beginPath();
	screen.moveTo({
		x: 5,
		y: state.height/2
	})
	for (let x = 0; x <= state.width-10; x += 1) {
		const y = state.height/2 - Math.sin(x * Math.PI/180 * 9.5 ) * (state.height/2 - 5);
		screen.lineTo({x:x+5,y});
	}
	screen.drawPath();
}

function drawSaw(screen, state) {
	screen
		.beginPath()
		.moveTo({
			x: 5,
			y: (state.height-5)/2
		})	
		.lineTo({
			x: (state.width-5)/3,
			y: 5
		})
		.lineTo({
			x: 2*(state.width-5)/3,
			y: state.height-5
		})
		.lineTo({
			x: (state.width-5),
			y: state.height/2
		})
		.drawPath();
}

const drawWave = [drawSaw, drawSine];

let type = 0;

function View(state) {

	const col = GroupView({
		id: 'test',
		classNames: ['column', 'waveSelector']
	});
	const row = GroupView({
		id: 'test',
		classNames: ['row', 'waveSelector']
	});

	const upArrow = Spinbox({
		width: 15,
		height: 10
	}, {
		onMouseDown(){
				type = ++type%drawWave.length
		}
	});
	const downArrow = Spinbox({
		width: 15,
		height: 10
	}).setDirection(Spinbox.DOWN);
	const rect = Rect({
		x: 0,
		y: 0
	}, {
		width: 50,
		height: 30
	});

	const coordinates = Coordinates(rect);
	const scene = Scene(coordinates);
	const sceneo = SceneObject(coordinates, {
		onRender(screen) {
			screen.clear();
			screen.save();
			screen.brush = '#435675';
			screen.fillRect(rect);
			screen.pen = '#77ab63';
			screen.drawRect(rect);
			drawWave[type](screen, {
				width: 50,
				height: 30
			});
			screen.restore();
		},
		zIndex: 4
	});

	const display = GraphicsView({
		domEvents: MouseEventsHandler({
			onMouseUp() {

			}
		}),
		onBeforeRender(screen) {
			screen.setSize({
				width: 50,
				height: 30
			})
		}
	});
	display.screen().add(scene.add(sceneo));
	row.add(
		col
		.add(upArrow)
		.add(downArrow))
			.add(display);
		return row;
	}


	function Controller(state) {

		function update(value) {}

		state.emitter.on('change', value => state.param.value = value);


		return {
			set param(audio_param) {
				audio_param.on('change', value => {
					if (!state.isActive) {
						update(value);
					}
				});
				times(10, i => {
					ui.bind_events({
						keypress: {
							code: keyboard['KEY_' + i],
							event: 'change',
							keyup() {
								audio_param.value = i
							},
							keydown() {}
						}
					});
				});
				state.param = audio_param;
			},
			get param() {
				return state.param;
			}
		};

	}

	export default function OscType({
		width,
		height
	}) {
		const state = {
			width,
			height,
			emitter: new EventEmitter()
		};
		return assign(state.emitter, View(state), Controller(state));
	}
