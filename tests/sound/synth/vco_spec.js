import { expect } from 'chai';
import create_vco from 'sound/synth/vco';
import create_audio_context from '../test-assets/audio-context_mock';

describe('create_vco', () => {

	let audio_context;

	beforeEach(function() {
		audio_context = create_audio_context();
	});

	it('returns an object', () => {
		const vca = create_vco(audio_context);
		expect(vca).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const vco = create_vco(audio_context);
		expect(vco).to.have.property('type');
	});


});
