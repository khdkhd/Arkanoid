import Game from 'game';
import Level from 'editor/level';
import Editor from 'editor/level-editor';

const level = Level();
const editor = Editor({level});

editor.render();
editor.on('play', () => {
	const levels = [level.serialize().items];
	const game = Game(levels);
	game
		.on('end', level => {
			game.start(level === 32 ? 1 : level + 1);
		})
		.render()
		.start(1);
});
