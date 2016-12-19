import Game from 'game/index';
import ui from 'ui';

ui.screen.size = {
	width: 224*2,
	height: 256*2
};

Game(1).start();
