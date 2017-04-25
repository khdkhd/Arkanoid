import {Model} from 'model';

import createBricks from 'game/entities/brick';

const columns = 28;
const rows = 31;

export default function GameModel(levels) {
	const model = Model({
		attributes: {
			cheatMode: false,
			levels,
			lifes: 0,
			score: 0,
			size: {
				width: 224*2,
				height: 248*2
			},
			state: GameModel.State.Stopped
		}
	});
	// Mix model methods with some custom attributes accessors/modifiers.
	return Object.assign(model, {
		// State
		state() {
			return model.get('state');
		},
		setState(state) {
			model.set('state', state);
			return this;
		},
		isRunning() {
			return model.get('state') === GameModel.State.Running;
		},
		// Cheat mode
		cheatMode() {
			return model.get('cheatMode');
		},
		toggleCheatMode(enabled) {
			model.set('cheatMode', enabled);
			return this;
		},
		// levels
		setStage(stage) {
			model.set('stage', stage);
			return this;
		},
		stage() {
			return model.get('stage');
		},
		bricks() {
			const stage = model.get('stage');
			return createBricks(model.get('levels')[Math.max(stage - 1, 0)]);
		},
		nextStage() {
			const stage = model.get('stage');
			if (stage < levels.length) {
				model.set('stage', stage + 1);
			} else {
				model.set('state', 'game-over');
			}
		},
		// Lifes
		lifeCount() {
			return model.get('lifes');
		},
		setlifes(count) {
			return model.set('lifes', count);
		},
		gainLife() {
			return model.set('lifes', model.get('lifes') + 1);
		},
		takeLife() {
			const lifes = Math.max(model.get('lifes') - 1, 0);
			model.set('lifes', lifes);
			if (lifes === 0) {
				model.emit('game-over');
			}
			return this;
		},
		// Score
		score() {
			return model.get('score');
		},
		updateScore(points) {
			return model.set(
				'score',
				model.get('score') + points
			);
		},
		// Size
		columns() {
			return columns;
		},
		rows() {
			return rows;
		},
		scale() {
			return Math.round(model.get('size').width/columns);
		},
		size() {
			return model.get('size');
		},
		setSize({width, height}) {
			return model.set('size', {
				width,
				height
			});
		}
	});
}

Object.defineProperty(GameModel, 'State', {
	writable: false,
	value: Object.freeze({
		Stopped: 0,
		Ready: 1,
		Running: 2,
		Paused: 3,
		GameOver: 4
	})
});
