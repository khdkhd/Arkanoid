import { expect } from 'chai';
import create_enveloppe_generator from 'sound/synth/enveloppe-generator';
import create_audio_context from '../test-assets/audio-context_mock';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_enveloppe_generator', () => {

	beforeEach(() =>{
		context.audio_context = {audio_context: create_audio_context(context.sandbox)};
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

describe('enveloppe_generator.gateOn()', () => {


	beforeEach(() =>{
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('calls cancelScheduledValues once on its  attached parameter with time as a parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOn(time);
		expect(gain.gain.cancelScheduledValues.calledOnce).to.be.true;
		expect(gain.gain.cancelScheduledValues.calledWith(time)).to.be.true;
	});
	it('calls setValueAtTime(0, time) once on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOn(time);
		expect(gain.gain.setValueAtTime.calledOnce).to.be.true;
		expect(gain.gain.setValueAtTime.calledWith(0,time)).to.be.true;
	});
	it('calls linearRampToValueAtTime(1, time + enveloppe.attack) on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOn(1);
		expect(gain.gain.linearRampToValueAtTime.called).to.be.true;
		expect(gain.gain.linearRampToValueAtTime.calledWith(1,time + enveloppe.attack.value)).to.be.true;
	});
	it('calls linearRampToValueAtTime(enveloppe.sustain, time + enveloppe.attack + enveloppe.decay) on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOn(1);
		expect(gain.gain.linearRampToValueAtTime.called).to.be.true;
		expect(gain.gain.linearRampToValueAtTime.calledWith(enveloppe.sustain.value,time + enveloppe.attack.value + enveloppe.decay.value)).to.be.true;
	});
});

describe('enveloppe_generator.voiceOff()', () => {


	beforeEach(() =>{
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('calls cancelScheduledValues(time) once on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOff(time);
		expect(gain.gain.cancelScheduledValues.calledOnce).to.be.true;
		expect(gain.gain.cancelScheduledValues.calledWith(time)).to.be.true;
	});
	it('calls setValueAtTime(param.value, time) once on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOff(time);
		expect(gain.gain.setValueAtTime.calledOnce).to.be.true;
		expect(gain.gain.setValueAtTime.calledWith(gain.gain.value,time)).to.be.true;
	});
	it('calls linearRampToValueAtTime(0, time + enveloppe.release) on its  attached parameter', () => {
		const enveloppe = create_enveloppe_generator();
		const gain = context.audio_context.createGain();
		const time = 1;
		enveloppe.connect({param: gain.gain});
		enveloppe.gateOff(1);
		expect(gain.gain.linearRampToValueAtTime.calledOnce).to.be.true;
		expect(gain.gain.linearRampToValueAtTime.calledWith(0, time + enveloppe.release.value)).to.be.true;
	});
});
