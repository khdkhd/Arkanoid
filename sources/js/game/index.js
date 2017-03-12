import GameModel from 'game/game-model';
import GameView from 'game/game-view';
import GameController from 'game/game-controller';
import LifeView from 'game/lifes-view';
import ScoreView from 'game/score-view';

import View from 'ui/view';

export default function Game() {
	const gameModel = GameModel();
	const scoreView = ScoreView({model: gameModel});
	const lifeView = LifeView({model: gameModel});
	const gameView = GameView({model: gameModel});
	const gameController = GameController({gameModel, gameView});

	const ui = View({
		el: document.querySelector('#content-wrapper'),
		onRender(view) {
			view.el().appendChild(scoreView.render().el());
			view.el().appendChild(gameView.render().el());
			view.el().appendChild(lifeView.render().el());
		}
	});

	return Object.assign(ui, {
		start(stage) {
			gameController.run(stage);
		},
	});
}
