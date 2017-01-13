import { expect } from 'chai';
import create_polyphonic_generator from 'sound/synth/polyphonic-generator';
import create_audio_context from 'tests/sound/test-assets/audio-context_mock';
import create_synth_factory from 'tests/sound/test-assets/synth-factory_mock';
import create_polyphony_manager from 'sound/synth/polyphony-manager';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_polyphonic_generator', () => {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
		context.factory = create_synth_factory(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('returns an object', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('type');
	});

	it('returns an object with a gain property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('gain');
	});

	it('returns an object with an attack property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('attack');
	});

	it('returns an object with a decay property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('decay');
	});

	it('returns an object with a sustain property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('sustain');
	});

	it('returns an object with a release property', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator).to.have.property('release');
	});
	it('returns an object with a connect method', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator.connect).to.be.function;
	});
	it('returns an object with a noteOn method', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator.noteOn).to.be.function;
	});
	it('returns an object with a noteOff method', () => {
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(polyphonic_generator.noteOff).to.be.function;
	});

	it('calls vco once on the synth factory if number of voices is 1', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:1, factory: context.factory});
		expect(context.factory.vco.calledOnce).to.be.true;
	});

	it('calls vco twice on the synth factory if number of voices is 2', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(context.factory.vco.calledTwice).to.be.true;
	});

	it('calls vca twice on the synth factory if number of voices is 1', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:1, factory: context.factory});
		expect(context.factory.vca.calledTwice).to.be.true;
	});

	it('calls vca on the synth factory if number of voices is 2', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:2, factory: context.factory});
		expect(context.factory.vca.called).to.be.true;
	});

	it('calls createChannelMerger once on the Audio Context if number of voices is 1', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:1, factory: context.factory});
		expect(context.audio_context.createChannelMerger.calledOnce).to.be.true;
	});

	it('call polyphony manager factory', () => {
		create_polyphonic_generator(context.audio_context, {num_voices:1, factory: context.factory});
		expect(context.factory.polyphony_manager.calledOnce).to.be.true;
	});
});

describe('polyphonic_generator.noteOn()', ()=> {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
		context.factory = create_synth_factory(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('calls assign once on the polyphony manager', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		const _factory = create_synth_factory(context.sandbox);
		sinon.spy(polyphony_manager, 'assign');context.sandbox
		const factory = Object.assign(_factory,
			{
				polyphony_manager(){
					return polyphony_manager;
				}
			});
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:1, factory: factory});
		polyphonic_generator.connect({input:{connect(){}}});
		polyphonic_generator.noteOn(.440, 0);
		expect(polyphony_manager.assign.calledOnce).to.be.true;
	});

	it('forwards frequency argument to polyphony_manager.assign(freq)', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		const _factory = create_synth_factory(context.sandbox);
		sinon.spy(polyphony_manager, 'assign');
		const factory = Object.assign(_factory,
			{
				polyphony_manager(){
					return polyphony_manager;
				}
			});
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:1, factory: factory});
		polyphonic_generator.connect({input:{connect(){}}});
		polyphonic_generator.noteOn(.440, 0);
		expect(polyphony_manager.assign.calledWith(.440)).to.be.true;
	});
});

describe('polyphonic_generator.noteOff()', ()=> {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
		context.factory = create_synth_factory(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('calls unassign once on the polyphony manager', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		const _factory = create_synth_factory(context.sandbox);
		sinon.spy(polyphony_manager, 'unassign');
		const factory = Object.assign(_factory,
			{
				polyphony_manager(){
					return polyphony_manager;
				}
			});
		const polyphonic_generator = create_polyphonic_generator(context.audio_context, {num_voices:1, factory: factory});
		polyphonic_generator.connect({input:{connect(){}}});
		polyphonic_generator.noteOff(.440);
		expect(polyphony_manager.unassign.calledOnce).to.be.true;
	});
});
