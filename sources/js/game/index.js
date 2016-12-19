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

import gameKeyboardController from 'game/keyboard-controller';

function create_ball(scene) {
	return Ball(Vector.Null, scene);
}

function create_bricks(level, scene) {
	const bricks = [];
	for (let brick_data of levels[level]) {
		bricks.push(Brick(Vector(brick_data.position).add({x: -1, y: -1}), brick_data.color, level, scene));
	}
	return bricks;
}

function create_vaus(scene) {
	const position = {x: 1, y: scene.boundingBox.relative.height - 2};
	return Vaus(position, scene);
}

function create_walls(cols, rows, scene) {
	const walls = [];
	for (let y = 1; y < rows; ++y) {
		walls.push(VerticalLeftWall({x: 0, y}, scene));
		walls.push(VerticalRightWall({x: cols, y}, scene));
	}
	walls.push(VerticalTopLeftWall({x: 0, y: 0}, scene));
	walls.push(VerticalTopRightWall({x: cols, y: 0}, scene));
	for (let x = 1; x < cols; ++x) {
		walls.push(HorizontalWall({x, y: 0}, scene));
	}
	walls.push(HorizontalLeftWall({x: 0, y: 0}, scene));
	walls.push(HorizontalRightWall({x: cols, y: 0}, scene));
	return walls;
}

export default function createGame(level = 1) {
	const keyboard = ui.keyboard;
	const screen = ui.screen;

	const scale_factor = Math.round((screen.width/14)/2);
	const columns = screen.width/scale_factor;
	const rows = screen.height/scale_factor;

	const walls_scene = Scene(screen, screen.rect.scale(1/scale_factor), scale_factor, '#123');

	const zone = Rect({x: 1, y: 1}, {width: columns - 2, height: rows - 2});
	const game_scene = Scene(screen, zone, scale_factor, '#123');

	const state = {
		bricks: create_bricks(level - 1, game_scene),
		vaus: create_vaus(game_scene),
		ball: create_ball(game_scene),
		scene: game_scene,
		paused: false,
		score: 0
	};

	const game_contoller = Controller(state);

	function loop() {
		if (!state.paused) {
			game_contoller.update();
		}
		game_scene.render();
		requestAnimationFrame(loop);
	}

	game_contoller.on('pause', () => {
		state.paused = !state.paused;
	});
	game_contoller.on('update-score', points => {
		state.score += points;
	});

	return {
		start() {
			create_walls(columns - 1, rows, walls_scene);
			walls_scene.render();
			keyboard.use(gameKeyboardController);
			requestAnimationFrame(loop);
		}
	};
}
