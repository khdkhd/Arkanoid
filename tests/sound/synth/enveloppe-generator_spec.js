import { expect } from 'chai';
import create_enveloppe_generator from 'sound/synth/enveloppe-generator';

describe('create_lfo', () => {

	it('returns an object', () => {
		const lfo = create_enveloppe_generator();
		expect(lfo).to.be.an('object');
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
