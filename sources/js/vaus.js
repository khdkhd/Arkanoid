import Rect from 'rect';
import Vector from 'vector';

export default function createVaus({x, y}) {

	let pos = Vector({x,y});

	const blue_box = new Path2D(`
		M 0 ${3/8}
		L ${1/20} ${3/8}
		L ${1/20} ${2/8}
		L ${1/10}  ${2/8}
		L ${1/10} ${6/8}
		L ${1/20} ${6/8}
		L ${1/20} ${5/8}
		L 0 ${5/8}
		L 0	${3/8}
	`);

	const red_box = new Path2D(`
		M ${1/10} ${1/8}
		L ${3/20} ${1/8}
		L ${3/20} 0
		L ${9/20} 0
		L ${9/20} 1
		L ${3/20} 1
		L ${3/20} ${7/8}
		L ${1/10} ${7/8}
		L ${1/10} ${1/8}
	`);

	function draw_red_box(screen){
		screen.beginPath();
		screen.moveTo({x: 1/10,y: 1/8});
		screen.lineTo({x:3/20, y:1/8});
		screen.lineTo({x:3/20, y:0});
		screen.lineTo({x:9/20, y:0});
		screen.lineTo({x:9/20, y:1});
		screen.lineTo({x:3/20, y:1});
		screen.lineTo({x:3/20, y:7/8});
		screen.lineTo({x:1/10, y:7/8});
		screen.closePath();
		screen.fillPath();
	}

	const margin = new Path2D(`
		M ${9/20} ${1/8}
		L ${1/2} ${1/8}
		L ${1/2} ${7/8}
		L ${9/20} ${7/8}
		L ${9/20} ${1/8}
	`);

	const gray_box = new Path2D(`
		M ${1/2}  ${1/8}
		L 1 ${1/8}
		L 1 ${7/8}
		L ${1/2} ${7/8}
		L ${1/2} ${1/8}
	`);


	const grays = [
		gray_box,
		gray_box,
		gray_box
	];

	return {
		move(v) {
			pos = pos.add(v);
		},
		draw(screen){

			const gray_fill = screen.createLinearGradient(0,0, 0, 1,[
					{pos: 0, color: 'gray'},
					{pos: .3, color: 'white'},
					{pos: .4, color: 'gray'},
					{pos: 1, color: 'white'}
			]);

			const red_fill = screen.createLinearGradient(0,0, 0, 1,[
					{pos: 0, color: 'red'},
					{pos: .3, color: 'white'},
					{pos: 1, color: 'red'}
			]);

			const blue_fill = screen.createLinearGradient(0,0, 0, 1,[
					{pos: 0, color: 'blue'},
					{pos: .4, color: 'white'},
					{pos: 1, color: 'blue'}
			]);

			screen.save();

				screen.brush = {fillStyle: blue_fill};
				screen.fillPath(blue_box);

				screen.brush = {fillStyle: red_fill};
				screen.fillPath(red_box);

				screen.brush = 'black';
				screen.fillPath(margin);

				for(let gray_box of grays){
					screen.brush = {fillStyle: gray_fill};
					screen.fillPath(gray_box);
					screen.translate({x:.5,y:0});
				}
				screen.save();
				screen.brush = 'black';
				screen.fillPath(margin);
				screen.restore();



				screen.save();

				screen.scale({x:-1,y:1});
				screen.translate({x:-1,y:0});

					screen.brush = {fillStyle: red_fill};
					screen.fillPath(red_box);

					screen.brush = {fillStyle: blue_fill};
					screen.fillPath(blue_box);
				screen.restore();

			screen.restore();
		},
		get rect(){
			return Rect(pos, {width: 1 + grays.length/2, height: 1});
		},
		get pos(){
			return pos;
		}
	};
}
