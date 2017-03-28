import is_nil from 'lodash.isnil';

export function scale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (range.max-range.min) * value + range.min;
}

export function unscale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (value-range.min)/(range.max-range.min);
}
