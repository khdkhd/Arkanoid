import sinon from 'sinon';

const audio_context_methods = [
	'createOscillator',
	'createGain',
	'createBiquadFilter',
	'createChannelMerger'
];

export default() => {
	return audio_context_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {
		currentTime: 0
	});
}
