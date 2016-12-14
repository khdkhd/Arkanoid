function scale(range, value){
	return (range.max-range.min) * value + range.min;
}

function unscale(range, value){
	return (value-range.min)/(range.max-range.min);
}

export {
	scale,
	unscale
};
