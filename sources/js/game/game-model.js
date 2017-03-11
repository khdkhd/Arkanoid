import {Model} from 'model';

import createBricks from 'game/brick';
import levels from 'game/resources/levels';

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
			}
		}
	});
	// Mix model methods with some custom attributes accessors/modifiers.
	return Object.assign(model, {
		// Cheat mode
		cheatMode() {
			return model.get('cheatMode');
		},
		toggleCheatMode(enabled) {
			model.set('cheatMode', enabled);
			return this;
		},
		// levels
		bricks(stage) {
			return createBricks(model.get('levels')[Math.max(stage - 1, 0)]);
		},
		// Lifes
		lifeCount() {
			return model.get('lifes');
		},
		gainLife() {
			return model.set(
				'lifes',
				model.get('lifes') + 1
			);
		},
		takeLife() {
			return model.set(
				'lifes',
				Math.max(model.get('lifes') - 1, 0)
			);
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
