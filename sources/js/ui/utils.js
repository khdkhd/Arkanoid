import clamp from 'lodash.clamp';

export function centerH(rect, el) {
	el.style.left = `${(rect.width - el.clientWidth)/2}px`;
}

export function centerV(rect, el) {
	el.style.top = `${(rect.height - el.clientHeight)/2}px`;
}

export function center(rect, el) {
	centerH(rect, el);
	centerV(rect, el);
}

export function eventCoordinates(el, ev) {
	return {
		x: clamp(ev.offsetX, 0, el.clientWidth),
		y: clamp(ev.offsetY, 0, el.clientHeight)
	};
}
