import jsdom from 'jsdom';

const document = jsdom.jsdom(
	`<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<title>Arkanoid</title>
		</head>
		<body>
			<canvas id="screen" width="300" height="300">
				Your browser does not support canvas!
			</canvas>
		</body>
	</html>`);

const canvas = document.getElementById('screen');
canvas.offsetTop = 100;
canvas.offsetLeft = 100;
export default document;
