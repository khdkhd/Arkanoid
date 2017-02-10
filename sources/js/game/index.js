import {EventEmitter} from 'events';

import {completeAssign} from 'common/utils';

import Rect from 'maths/rect';

import Controller from 'game/game-controller';
import LifeCounter from 'game/life-counter';
import createWalls from 'game/wall';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import ui from 'ui';

ui.screen.setSize({
	width: 224*2,
	height: 248*2
});

export default function Game() {
	const emitter = new EventEmitter();
	const {screen, lifes} = ui;

	const scale = Math.round((screen.width/14)/2);
	const columns = screen.width/scale;
	const rows = screen.height/scale;

	const zone = Rect({x: 1, y: 1}, {width: columns - 2, height: rows - 1});
	const scene = Scene(Coordinates(zone.size, zone.topLeft));

	const state = {
		cheatMode: false,
		end: false,
		lifes: LifeCounter(3),
		score: 0,
		scene: scene,
		zone: scene.localRect()
	};

	const game_contoller = Controller(state);

	function loop() {
		if (!state.end) {
			game_contoller.update();
			screen.render();
			requestAnimationFrame(loop);
		} else {
			emitter.emit('end', state.level);
		}
	}

	game_contoller
		.on('game-over', game_contoller.stop)
		.on('pause', game_contoller.pause)
		.on('update-score', points => {
			state.score += points;
		})
		.on('end-of-level', () => {
			state.end = true;
		})
		.on('ball-out', () => {
			game_contoller.stop();
			setTimeout(game_contoller.start, 2000);
		});

	lifes.setModel(state.lifes);
	screen
		.setBackgroundColor('#123')
		.setScale(scale)
		.add(...createWalls(columns - 1, rows))
		.add(scene);

	return completeAssign(emitter, {
		start(level) {
			state.end = false;
			state.level = level;
			game_contoller
				.reset()
				.start();
			requestAnimationFrame(loop);
		}
	});
}
