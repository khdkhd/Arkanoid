import Game from 'game';
import levels from 'game/resources/levels';

const game = Game(levels);

game
	.on('end', level => {
		game.start(level === 32 ? 1 : level + 1);
	})
	.render()
	.start(1);
