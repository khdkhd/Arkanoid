import Game from 'game';

const game = Game();

game
	.on('end', level => {
		game.start(level === 32 ? 1 : level + 1);
	})
	.render()
	.start(1);
