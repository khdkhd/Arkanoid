import { expect } from 'chai';
import create_polyphonic_generator from 'sound/synth/polyphonic-generator';
import create_audio_context from '../test-assets/audio-context_mock';
import create_synth_factory from '../test-assets/synth-factory_mock';


describe('create_polyphonic_generator', () => {

	const factory = create_synth_factory();
	const audio_context = create_audio_context();


	beforeEach(function() {
		factory.reset();
		audio_context.reset();
	});

	it('returns an object', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('type');
	});

	it('returns an object with a gain property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('gain');
	});

	it('returns an object with an attack property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('attack');
	});

	it('returns an object with a decay property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('decay');
	});

	it('returns an object with a sustain property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('sustain');
	});

	it('returns an object with a release property', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:2, factory: factory});
		expect(polyphonic_generator).to.have.property('release');
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

	it('call polyphony manager factory', () => {
		create_polyphonic_generator(audio_context, {num_voices:1, factory: factory});
		expect(factory.polyphony_manager.calledOnce).to.be.true;
	});

	it('call assign on the polyphony manager', () => {
		const polyphonic_generator = create_polyphonic_generator(audio_context, {num_voices:1, factory: factory});
		polyphonic_generator.connect({input:{connect(){}}});
		polyphonic_generator.voiceOn(.440, 0);
		expect(factory.getPolyphonyManager().assign.calledOnce).to.be.true;
	});
});
