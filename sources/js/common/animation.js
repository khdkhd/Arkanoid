function square(x) {
	return x*x;
}

function normalized_quadratics_curve(upper) {
	const k = square(upper);
	return x => -2*x*(x - upper)/k;
}

export default function Animation(frame_count, frame_callback) {
	const state_begin_count = Math.round(frame_count/3);
	const state_end_count = state_begin_count;
	const state_frame_count = frame_count - state_begin_count - state_end_count;

	const ease_in = normalized_quadratics_curve(2*state_begin_count);
	const ease = () => 1;
	const ease_out = (x) => 1 - ease_in(x);

	let begin = state_begin_count;
	let frame = state_frame_count;
	let end = state_end_count;

	return {
		start() {
			if (end >= state_end_count) {
				begin = frame = end = 0;
			} else if (frame <= state_frame_count) {
				frame = 0;
			} else {
				begin = state_begin_count - end;
			}
		},
		next() {
			let v;
			if (begin < state_begin_count) {
				v = frame_callback(ease_in(begin));
				begin++;
			} else
			if (frame < state_frame_count) {
				v = frame_callback(ease(frame))
				frame++;
			} else
			if (end < state_end_count) {
				v = frame_callback(ease_out(end));
				end++;
			} else {
				v = frame_callback(0);
			}
			return v;
		}
	}
}
