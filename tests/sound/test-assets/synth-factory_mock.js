import sinon from 'sinon';

const factories = [
	'biquad_filter',
	'enveloppe_generator',
	'lfo',
	'polyphonic_generator',
	'master',
	'vco',
	'vca',
];

export default() => {
	return factories.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {});
}
