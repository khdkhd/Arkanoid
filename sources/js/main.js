import Game from 'game/index';
import ui from 'ui';

ui.screen.size = {
	width: 224*2,
	height: 256*2
};

const game = Game();

game
	.on('end', level => {
		game.start(level + 1);
	})
	.start(1);
