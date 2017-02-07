import Game from 'game/index';

const game = Game();

game
	.on('end', level => {
		game.start(level === 32 ? 1 : level + 1);
	})
	.start(1);
