import { expect } from 'chai';
import create_polyphonic_generator from 'sound/synth/polyphonic-generator';
import create_audio_context from '../test-assets/audio-context_mock';
import create_synth_factory from '../test-assets/synth-factory_mock';


describe('create_polyphonic_generator', () => {

	let factory, audio_context;

	beforeEach(function() {
		factory = create_synth_factory();
		audio_context = create_audio_context();
	});

	it('should return an object', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.be.an('object');
	});

	it('should return an object with a type property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('type');
	});

	it('should return an object with a gain property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('gain');
	});

	it('should return an object with an attack property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('attack');
	});

	it('should return an object with a decay property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('decay');
	});

	it('should return an object with a sustain property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('sustain');
	});

	it('should return an object with a release property', () => {
		const pg = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(pg).to.have.property('release');
	});

	it('calls vco once on the synth factory', () => {
		create_polyphonic_generator(audio_context, {num_voices:1, factory: factory});
		expect(factory.vco.calledOnce).to.be.true;
	});

	it('calls vco twice on the synth factory', () => {
		create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(factory.vco.calledTwice).to.be.true;
	});

	it('calls vca once on the synth factory', () => {
		create_polyphonic_generator(audio_context, {num_voices:1, factory: factory});
		expect(factory.vca.calledOnce).to.be.true;
	});

	it('calls vca twice on the synth factory', () => {
		create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(factory.vca.calledTwice).to.be.true;
	});

	it('calls createChannelMerger once on the Audio Context', () => {
		create_polyphonic_generator(audio_context, {num_voices:1, factory: factory});
		expect(audio_context.createChannelMerger.calledOnce).to.be.true;
	});


});
