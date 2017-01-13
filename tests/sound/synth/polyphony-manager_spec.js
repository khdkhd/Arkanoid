import { expect } from 'chai';
import create_polyphony_manager from 'sound/synth/polyphony-manager';

describe('create_polyphony_manager', () => {

	it('returns an object', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:undefined});
		expect(polyphony_manager).to.be.an('object');
	});

	it('return an object with an assign method', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		expect(polyphony_manager.assign).to.be.function;
	});

	it('return an object with an unassign method', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		expect(polyphony_manager.unassign).to.be.function;
	});

});

describe('polyphony_manager.assign()', () => {
	it('allows one voice assingement only', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		const first_assignment = polyphony_manager.assign(440.);
		expect(first_assignment).to.be.equal(0);
		const second_assignment  = polyphony_manager.assign(880.);
		expect(second_assignment).to.be.equal(0);
		expect(polyphony_manager.unassign(440.)).to.be.equal(-1);
		expect(polyphony_manager.unassign(880.)).to.be.equal(0);
	});

	it('allows two voice assignemets', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:2});
		const first_assignment = polyphony_manager.assign(440.);
		expect(first_assignment).to.be.equal(1);
		const second_assignment  = polyphony_manager.assign(880.);
		expect(second_assignment).to.be.equal(0);
		expect(polyphony_manager.unassign(440.)).to.be.equal(1);
		expect(polyphony_manager.unassign(880.)).to.be.equal(0);
	});
});
