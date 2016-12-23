import { expect } from 'chai';
import create_lfo from 'sound/synth/lfo';
import create_audio_context from '../test-assets/audio-context_mock';

describe('create_lfo', () => {

	let audio_context;

	beforeEach(function() {
		audio_context = create_audio_context();
	});

	it('returns an object', () => {
		const lfo = create_lfo(audio_context);
		expect(lfo).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const lfo = create_lfo(audio_context);
		expect(lfo).to.have.property('type');
	});

	it('returns an object with a frequency property', () => {
		const lfo = create_lfo(audio_context);
		expect(lfo).to.have.property('frequency');
	});

	it('returns an object with a gain property', () => {
		const lfo = create_lfo(audio_context);
		expect(lfo).to.have.property('gain');
	});

});
