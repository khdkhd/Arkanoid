function square(x) {
	return x*x;
}

export function normalizedQuadraticsCurve(lower, upper) {
	const k = lower*upper - (square(lower) + square(upper))/2;
	return x => 2*(x - lower)*(x - upper)/k;
}

export function easeIn(x) {
	return square(x);
}

export function easeOut(x) {
	return -square(x) + 1;
}

export function quadratic(x) {
	return -4*x*(x - 1);
}
