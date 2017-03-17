import GameModel from 'game/model';
import GameController from 'game/controller';
import GameView from 'game/views/game';
import LifeView from 'game/views/lifes';
import GameOverView from 'game/views/game-over';
import PauseView from 'game/views/pause';
import ReadyView from 'game/views/ready';
import ScoreView from 'game/views/score';
import StartMenuView from 'game/views/start-menu';

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
	const gameController = GameController({model:gameModel, view: gameView, keyboard});

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
	const gameOverView = GameOverView({el: ui.el(), model: gameModel});

	const onGameStateChanged = cond([
		[matches('start'), () => {
			gameController.reset();
			gameMenu.start();
		}],
		[matches('ready'), () => {
			keyboard.use(null);
			gameReadyView.start();
		}],
		[matches('game-over'), () => {
			gameOverView.start();
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
			gameModel.setState('start');
			gameController.run();
		},
	});
}
