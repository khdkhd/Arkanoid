import GameModel from 'game/game-model';
import GameController from 'game/game-controller';
import GameView from 'game/game-view';
import LifeView from 'game/ui/lifes';
import PauseView from 'game/ui/pause';
import ReadyView from 'game/ui/ready';
import ScoreView from 'game/ui/score';
import StartMenuView from 'game/ui/start-menu';

import gameKeyboardController from 'game/keyboard-controller';

import keyboard from 'ui/keyboard';
import View from 'ui/view';

import cond from 'lodash.cond';
import matches from 'lodash.matches';

export default function Game() {
	const gameModel = GameModel();
	const scoreView = ScoreView({model: gameModel});
	const lifeView = LifeView({model: gameModel});
	const gameView = GameView({model: gameModel});
	const gameController = GameController({gameModel, gameView, keyboard});

	const ui = View({
		el: document.querySelector('#content-wrapper'),
		onRender(view) {
			view.el().appendChild(scoreView.render().el());
			view.el().appendChild(gameView.render().el());
			view.el().appendChild(lifeView.render().el());
		},
	});

	const gameMenu = StartMenuView({el: ui.el(), model: gameModel});
	const gameReadyView = ReadyView({el: ui.el(), model: gameModel});
	const gamePauseView = PauseView({el: ui.el(), model: gameModel});

	const onGameStateChanged = cond([
		[matches('ready'), () => {
			keyboard.use(null);
			gameReadyView.start();
		}],
		[matches('game-over'), () => {
		}],
		[matches('pause'), () => {
			gamePauseView.start();
		}],
		[matches('running'), () => {
			keyboard.use(gameKeyboardController);
		}]
	]);

	gameModel
		.on('changed', cond([
			[matches('state'), (attr, state) => onGameStateChanged(state)]
		]));

	return Object.assign(ui, {
		start() {
			gameController.run();
			gameMenu.start();
		},
	});
}
