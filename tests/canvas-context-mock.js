import sinon from 'sinon';

const screen_width  = 200;
const screen_height = 200;

const canvas_context_methods = [
	'save',
	'restore',
	'beginPath',
	'closePath',
	'clearRect',
	'fillRect',
	'strokeRect',
	'stroke',
	'fill',
	'moveTo',
	'lineTo',
	'arc',
	'stroke',
	'scale',
	'rotate',
	'translate',
	'createLinearGradient'
];

export default function() {
	return canvas_context_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {
		canvas: {
			width:  screen_width,
			height: screen_height
		},
		lineWidth: 1,
		strokeStyle: 'black',
		fillStyle: 'white'
	});
}
