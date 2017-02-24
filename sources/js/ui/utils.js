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
