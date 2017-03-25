import {matcher} from 'common/functional';
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

export default function Game(levels) {
	const gameModel = GameModel(levels);
	const scoreView = ScoreView({model: gameModel});
	const lifeView = LifeView({model: gameModel});
	const gameView = GameView({model: gameModel});
	const gameController = GameController({model:gameModel, view: gameView, keyboard});

	const ui = View({
		el: document.querySelector('#content-wrapper'),
		model: gameModel,
		modelEvents: {
			changed: cond([
				[matcher('state', GameModel.state.Stopped), (attr, value, view) => {
					gameModel.reset();
					StartMenuView({el: view.el()})
						.start()
						.then(() => {
							gameModel.setlifes(3);
							gameModel.setStage(1);
							gameModel.setState(GameModel.state.Ready);
						});
				}],
				[matcher('state', GameModel.state.GameOver), (attr, value, view) => {
					GameOverView({el: view.el()})
						.start()
						.then(() => {
							gameModel.setState(GameModel.state.Stopped);
						});
				}],
				[matcher('state', GameModel.state.Paused), (attr, value, view) => {
					PauseView({el: view.el()})
						.start()
						.then(() => {
							gameModel.setState(GameModel.state.Running);
						});
				}],
				[matcher('state', GameModel.state.Ready), (attr, value, view) => {
					keyboard.use(null);
					ReadyView({el: view.el(), model: gameModel})
						.start()
						.then(() => {
							gameModel.setState(GameModel.state.Running);
						});
				}],
				[matcher('state', GameModel.state.Running), () => {
					keyboard.use(gameKeyboardController);
				}]
			]),
		},
		onRender(view) {
			view.el().appendChild(scoreView.render().el());
			view.el().appendChild(gameView.render().el());
			view.el().appendChild(lifeView.render().el());
		},
	});

	return Object.assign(ui, {
		start() {
			gameModel.setState(GameModel.state.Stopped);
			gameController.run();
		},
	});
}
