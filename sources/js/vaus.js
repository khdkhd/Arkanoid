import Rect from 'rect';
import Vector from 'vector';
import ui from 'ui';

export default function createVaus({x, y}, screen) {

	const margin = .2;
	const scale_factor = (screen.width/14)/4;
	const small_left_blue_rect = Rect({x:0, y:+margin}, {width:.25, height:1-margin*2});
	const small_left_red_rect = Rect({x:.25, y:0}, {width:.25, height:1});
	const big_left_red_rect = Rect({x:.5, y:-margin}, {width:1, height:1+(margin*2)});
	const center_rect = Rect({x: 1.5 + margin, y: 0},{width: 4, height: 1});
	const big_right_red_rect = Rect({x: 5.5 + (margin * 2), y: -margin},{width: 1, height: 1+(margin*2)});
	const small_right_red_rect = Rect({x:6.5 + (margin * 2), y:0}, {width:.25, height:1});
	const small_right_blue_rect = Rect({x:6.75 + margin*2, y:+margin}, {width:.25, height:1-margin*2});
	let pos = Vector({x,y});
	ui.keyboard.on('direction-changed', vector => {
		pos = pos.add(vector);
	});
	return {
		draw(){
			screen.save();
			screen.scale(scale_factor);
			screen.translate(pos);
			screen.brush = {
				fillStyle: screen.createLinearGradient(0,0, 0, 1,[
						{pos: 0, color: 'gray'},
						{pos: .3, color: 'white'},
						{pos: .4, color: 'gray'},
						{pos: 1, color: 'white'}
				])
			};
			screen.fillRect(center_rect);
			screen.brush = {
				fillStyle: screen.createLinearGradient(0,0, 0, 1,[
						{pos: 0, color: 'red'},
						{pos: .3, color: 'white'},
						{pos: 1, color: 'red'}
				])
			};
			screen.fillRect(small_left_red_rect);
			screen.fillRect(big_left_red_rect);
			screen.fillRect(big_right_red_rect);
			screen.fillRect(small_right_red_rect);
			screen.brush = {
				fillStyle: screen.createLinearGradient(0,0, 0, 1,[
						{pos: 0, color: 'blue'},
						{pos: .4, color: 'white'},
						{pos: 1, color: 'blue'}
				])
			};
			screen.fillRect(small_left_blue_rect);
			screen.fillRect(small_right_blue_rect);


			screen.restore();
		}
	};

}
