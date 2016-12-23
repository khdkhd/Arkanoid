import { expect } from 'chai';
import create_biquad_filter from 'sound/synth/biquad-filter';
import create_audio_context from '../test-assets/audio-context_mock';

describe('create_biquad_filter', () => {

	let audio_context;

	beforeEach(function() {
		audio_context = create_audio_context();
	});

	it('returns an object', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.be.an('object');
	});

	it('calls createBiquadFilter once on the Audio Context', () => {
		create_biquad_filter(audio_context);
		expect(audio_context.createBiquadFilter.calledOnce).to.be.true;
	});

	it('returns an object with a gain property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('gain');
	});

	it('returns an object with a Q property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('Q');
	});

	it('returns an object with a type property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('type');
	});

	it('returns an object with an input property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('input');
	});

	it('returns an object with an attack property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('attack');
	});

	it('returns an object with a decay property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('decay');
	});

	it('returns an object with a sustain property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('sustain');
	});

	it('returns an object with a release property', () => {
		const biquad_filter = create_biquad_filter(audio_context);
		expect(biquad_filter).to.have.property('release');
	});

});
