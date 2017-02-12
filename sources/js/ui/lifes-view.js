import times from 'lodash.times';

import View from 'ui/view';

const vaus = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin" viewBox="0 0 300 100">
	<defs>
		<path d="M6.25 68.75L6.25 62.5L0 62.5L0 37.5L6.25 37.5L6.25 31.25L12.5 31.25L12.5 68.75L6.25 68.75Z" id="aqBNuZd1v"></path>
		<path d="M62.5 6.25L75 6.25L75 87.5L62.5 87.5L62.5 6.25Z" id="a1kpm5xOf"></path>
		<path d="M31.25 100L31.25 93.75L25 93.75L25 6.25L31.25 6.25L31.25 0L62.5 0L62.5 100L31.25 100ZM18.75 87.49L18.75 12.49L25 12.49L25 87.49L18.75 87.49ZM12.5 81.24L12.5 18.74L18.75 18.74L18.75 81.24L12.5 81.24Z" id="b3SDRzRG3E"></path>
		<path d="M150 87.5L150 0L225 0L225 87.5L150 87.5ZM75 87.49L75 0L150 0L150 87.49L75 87.49Z" id="g45fUfTuXh"></path>
		<path d="M275 6.25L275 93.75L268.75 93.75L268.75 100L237.5 100L237.5 0L268.75 0L268.75 6.25L275 6.25ZM287.5 18.74L287.5 81.25L281.25 81.25L281.25 87.5L275 87.5L275 12.5L281.25 12.5L281.25 18.74L287.5 18.74Z" id="cjxvjPeBZ"></path>
		<path d="M225 6.25L237.5 6.25L237.5 87.5L225 87.5L225 6.25Z" id="a179KzNmKL"></path>
		<path d="M287.5 31.25L293.75 31.25L293.75 37.5L300 37.5L300 62.5L293.75 62.5L293.75 68.75L287.5 68.75L287.5 31.25Z" id="ahuird8ej"></path>
		<linearGradient id="gradientc3DNLhVnIy" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="150" y2="87.5">
			<stop style="stop-color: #6f6f6d;stop-opacity: 1" offset="0%"></stop>
			<stop style="stop-color: #6f6f6d;stop-opacity: 1" offset="12%"></stop>
			<stop style="stop-color: #d6d6d6;stop-opacity: 1" offset="24%"></stop>
			<stop style="stop-color: #d6d6d6;stop-opacity: 1" offset="34.5%"></stop>
			<stop style="stop-color: #8f8f8f;stop-opacity: 1" offset="46%"></stop>
			<stop style="stop-color: #8f8f8f;stop-opacity: 1" offset="55%"></stop>
			<stop style="stop-color: #696969;stop-opacity: 1" offset="80%"></stop>
			<stop style="stop-color: #3b3b3b;stop-opacity: 1" offset="92%"></stop>
			<stop style="stop-color: #3b3b3b;stop-opacity: 1" offset="100%"></stop>
		</linearGradient>
		<linearGradient id="gradientm1MTT4lYQR" gradientUnits="userSpaceOnUse" x1="37.5" y1="0" x2="37.5" y2="100">
			<stop style="stop-color: #9c2c08;stop-opacity: 1" offset="0%"></stop>
			<stop style="stop-color: #9a2b07;stop-opacity: 1" offset="10%"></stop>
			<stop style="stop-color: #eec0a0;stop-opacity: 1" offset="20%"></stop>
			<stop style="stop-color: #eec0a0;stop-opacity: 1" offset="30%"></stop>
			<stop style="stop-color: #dd5e02;stop-opacity: 1" offset="40%"></stop>
			<stop style="stop-color: #dd5e02;stop-opacity: 1" offset="70%"></stop>
			<stop style="stop-color: #8e2901;stop-opacity: 1" offset="80%"></stop>
			<stop style="stop-color: #8e2901;stop-opacity: 1" offset="100%"></stop>
		</linearGradient>
	</defs>
	<g visibility="inherit">
		<g visibility="inherit">
			<g visibility="inherit">
				<use xlink:href="#aqBNuZd1v" opacity="1" fill="#474f50" fill-opacity="1"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#a1kpm5xOf" opacity="1" fill="#222222" fill-opacity="1"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#b3SDRzRG3E" opacity="1" fill="url(#gradientm1MTT4lYQR)"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#g45fUfTuXh" opacity="1" fill="url(#gradientc3DNLhVnIy)"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#cjxvjPeBZ" opacity="1" fill="url(#gradientm1MTT4lYQR)"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#a179KzNmKL" opacity="1" fill="#222222" fill-opacity="1"></use>
			</g>
			<g visibility="inherit">
				<use xlink:href="#ahuird8ej" opacity="1" fill="#474f50" fill-opacity="1"></use>
			</g>
		</g>
	</g>
</svg>
`;

export default ({el, model}) => {
	return View({el, model, onRender(el, model) {
		times(model.count(), () => {
			const life = document.createElement('li');
			life.innerHTML = vaus;
			life.className = 'life';
			el.appendChild(life);
		});
	}});
}
