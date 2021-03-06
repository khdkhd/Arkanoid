import jsdom from 'jsdom';

const document = jsdom.jsdom(
	`<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<title></title>
			<link rel="stylesheet" href="/assets/css/sound.css" charset="utf-8">
		</head>
		<body>
			<div class="ui-panel">
				<div>
					<span class="knob" id="knob-1" data-control="knob" data-param="filter.frequency"></span>
					<span class="knob" id="knob-2" data-control="knob" data-param="filter.Q"></span>
					<span class="knob" id="knob-3" data-control="knob" data-param="lfo.frequency"></span>
					<span class="knob" id="knob-4" data-control="knob" data-param="lfo.amplitude"></span>
				</div>
				<div>
					<span class="fader" id="fader-1" data-control="fader"></span>
					<span class="fader" id="fader-2" data-control="fader"></span>
					<span class="fader" id="fader-3" data-control="fader"></span>
					<span class="fader" id="fader-4" data-control="fader"></span>
				</div>
			</div>
			<canvas id="screen"></canvas>
			<script type="text/javascript" src="/assets/js/sound.js"></script>
		</body>
	</html>`);

export default document;
