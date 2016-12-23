import { expect } from 'chai';
import create_vca from 'sound/synth/vca';
import create_audio_context from '../test-assets/audio-context_mock';

describe('create_vca', () => {

	let audio_context;

	beforeEach(function() {
		audio_context = create_audio_context();
	});

	it('returns an object', () => {
		const vca = create_vca(audio_context);
		expect(vca).to.be.an('object');
	});

	it('returns an object with a input property', () => {
		const vca = create_vca(audio_context);
		expect(vca).to.have.property('input');
	});

	it('returns an object with a frequency property', () => {
		const vca = create_vca(audio_context);
		expect(vca).to.have.property('gain');
	});

});
