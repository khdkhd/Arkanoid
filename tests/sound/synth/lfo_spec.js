import { expect } from 'chai';
import create_lfo from 'sound/synth/lfo';
import create_audio_context from '../test-assets/audio-context_mock';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_lfo', () => {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('returns an object', () => {
		const lfo = create_lfo(context);
		expect(lfo).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const lfo = create_lfo(context);
		expect(lfo).to.have.property('type');
	});

	it('returns an object with a frequency property', () => {
		const lfo = create_lfo(context);
		expect(lfo).to.have.property('frequency');
	});

	it('returns an object with an amplitude property', () => {
		const lfo = create_lfo(context);
		expect(lfo).to.have.property('amplitude');
	});

	it('returns an object with a connect method', () => {
		const lfo = create_lfo(context);
		expect(lfo.connect).to.be.function;
	});

	it('calls createOscillator once on the AudioContext', () => {
		create_lfo(context);
		expect(context.audio_context.createOscillator.calledOnce).to.be.true;
	});

	it('calls createGain once on the AudioContext', () => {
		create_lfo(context);
		expect(context.audio_context.createGain.calledOnce).to.be.true;
	});

});

describe('lfo.connect()', () => {

	it('calls connect once on its internal oscillator node', () => {
		const lfo = create_lfo(context);
		const osc = context.audio_context.oscillators.pop();
		const filter = context.audio_context.createBiquadFilter();
		lfo.connect(filter.frequency);
		expect(osc.connect.calledOnce).to.be.true;
	});

	it('calls start once on its oscillator node', () => {
		const lfo = create_lfo(context);
		const osc = context.audio_context.oscillators.pop();
		const filter = context.audio_context.createBiquadFilter();
		lfo.connect(filter.frequency);
		expect(osc.start.calledOnce).to.be.true;
	});

	it('calls connect once on its gain node', () => {
		const lfo = create_lfo(context);
		const gain = context.audio_context.gains.pop();
		const filter = context.audio_context.createBiquadFilter();
		lfo.connect(filter.frequency);
		expect(gain.connect.calledOnce).to.be.true;
	});
});
