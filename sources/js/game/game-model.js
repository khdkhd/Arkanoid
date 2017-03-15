import {Model} from 'model';

import createBricks from 'game/brick';
import levels from 'game/resources/levels';

const columns = 28;
const rows = 31;

export default function GameModel() {
	const model = Model({
		attributes: {
			cheatMode: false,
			levels,
			lifes: 3,
			score: 0,
			size: {
				width: 224*2,
				height: 248*2
			},
			state: 'game-over'
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
			const stage = model.get('stage')%levels.length + 1;
			model.set('stage', stage);
		},
		// Lifes
		lifeCount() {
			return model.get('lifes');
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
