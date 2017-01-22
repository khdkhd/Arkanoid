import {completeAssign} from 'common/utils';

import Rect from 'maths/rect';
import Vector from 'maths/vector';

import Controller from 'game/game-controller';
import Brick from 'game/brick';
import Ball from 'game/ball';
import Vaus from 'game/vaus';

import {
	HorizontalWall,
	HorizontalLeftWall,
	HorizontalRightWall,
	VerticalLeftWall,
	VerticalRightWall,
	VerticalTopLeftWall,
	VerticalTopRightWall
} from 'game/wall';
import levels from 'game/levels';

import Scene from 'graphics/scene';

import ui from 'ui';

import {EventEmitter} from 'events';

import gameKeyboardController from 'game/keyboard-controller';

function create_ball(scene) {
	const ball = Ball(Vector.Null);
	scene.add(ball);
	return ball;
}

function create_bricks(level, scene) {
	const bricks = [];
	for (let brick_data of levels[level]) {
		const brick = Brick(brick_data.position, brick_data.color, level);
		bricks.push(brick);
		scene.add(brick);
	}
	return bricks;
}

function create_vaus(scene) {
	const position = {x: 1, y: scene.boundingBox.relative.height - 2};
	const vaus = Vaus(position);
	scene.add(vaus);
	return vaus;
}

function create_walls(cols, rows, scene) {
	const walls = [];
	for (let y = 1; y < rows; ++y) {
		walls.push(VerticalLeftWall({x: 0, y}));
		walls.push(VerticalRightWall({x: cols, y}));
	}
	walls.push(VerticalTopLeftWall({x: 0, y: 0}));
	walls.push(VerticalTopRightWall({x: cols, y: 0}));
	for (let x = 1; x < cols; ++x) {
		walls.push(HorizontalWall({x, y: 0}));
	}
	walls.push(HorizontalLeftWall({x: 0, y: 0}));
	walls.push(HorizontalRightWall({x: cols, y: 0}));
	for(let wall of walls){
		scene.add(wall);
	}
	return walls;
}

export default function Game() {
	const emitter = new EventEmitter();
	const keyboard = ui.keyboard;
	const screen = ui.screen;

	const scale = Math.round((screen.width/14)/2);
	const columns = screen.width/scale;
	const rows = screen.height/scale;

	const walls_scene = Scene(screen, screen.rect.scale(1/scale), scale, '#123');

	const zone = Rect({x: 1, y: 1}, {width: columns - 2, height: rows - 2});
	const game_scene = Scene(screen, zone, scale, '#123');

	const state = {
		bricks: [],
		vaus: create_vaus(game_scene),
		ball: create_ball(game_scene),
		scene: game_scene,
		cheatMode: false,
		paused: false,
		end: false,
		score: 0
	};

	const game_contoller = Controller(state);

	function loop() {
		if (!state.end) {
			if (!state.paused) {
				game_contoller.update();
			}
			walls_scene.render(screen);
			game_scene.render(screen);
			requestAnimationFrame(loop);
		} else {
			emitter.emit('end', state.level);
		}
	}

	game_contoller.on('pause', () => {
		state.paused = !state.paused;
	});
	game_contoller.on('update-score', points => {
		state.score += points;
	});
	game_contoller.on('end-of-level', () => {
		state.end = true;
	});

	create_walls(columns - 1, rows, walls_scene);

	return completeAssign(emitter, {
		start(level) {
			state.end = false;
			state.level = level;
			state.bricks.forEach(brick => game_scene.remove(brick));
			state.bricks = create_bricks(level - 1, game_scene);
			game_contoller.reset();
			keyboard.use(gameKeyboardController);
			requestAnimationFrame(loop);
		}
	});
}
