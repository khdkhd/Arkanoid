import { expect } from 'chai';
import create_enveloppe_generator from 'sound/synth/enveloppe-generator';
import create_audio_context from '../test-assets/audio-context_mock';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_enveloppe_generator', () => {

	beforeEach(() =>{
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('returns an object', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe).to.be.an('object');
	});
	it('returns an object with an attack property', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe).to.have.property('attack');
	});
	it('returns an object with a decay property', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe).to.have.property('decay');
	});
	it('returns an object with a sustain property', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe).to.have.property('sustain');
	});
	it('returns an object with a release property', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe).to.have.property('release');
	});
	it('returns an object with a connect method', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe.connect).to.be.function;
	});
	it('returns an object with a gateOn method', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe.gateOn).to.be.function;
	});
	it('returns an object with a gateOff method', () => {
		const enveloppe = create_enveloppe_generator();
		expect(enveloppe.gateOff).to.be.function;
	});
});

describe('enveloppe_generator.voiceOn()', () => {
	it('calls cancelScheduledValues once on its  attached parameter with time as a parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOn(1);
		expect(gain.gain.cancelScheduledValues.calledOnce).to.be.true;
		expect(gain.gain.cancelScheduledValues.calledWith(1)).to.be.true;
	});
});
