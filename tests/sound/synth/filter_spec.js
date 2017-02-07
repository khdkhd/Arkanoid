import { expect } from 'chai';
import create_filter from 'sound/synth/filter';
import create_audio_context from '../test-assets/audio-context_mock';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_filter', () => {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});

	it('returns an object', () => {
		const filter = create_filter(context);
		expect(filter).to.be.an('object');
	});

	it('calls createBiquadFilter once on the Audio Context', () => {
		create_filter(context);
		expect(context.audio_context.createBiquadFilter.calledOnce).to.be.true;
	});

	it('returns an object with a frequency property', () => {
		const filter = create_filter(context);
		expect(filter).to.have.property('frequency');
	});

	it('returns an object with a frequency property which implements a connect method', () => {
		const filter = create_filter(context);
		expect(filter.frequency.connect).to.be.function;
	});

	it('returns an object with a gain property', () => {
		const filter = create_filter(context);
		expect(filter).to.have.property('gain');
	});

	it('returns an object with a gain property which implements a connect method', () => {
		const filter = create_filter(context);
		expect(filter.gain.connect).to.be.function;
	});


	it('returns an object with a Q property', () => {
		const filter = create_filter(context);
		expect(filter).to.have.property('Q');
	});

	it('returns an object with a Q property which implements a connect method', () => {
		const filter = create_filter(context);
		expect(filter.Q.connect).to.be.function;
	});

	it('returns an object with a type property', () => {
		const filter = create_filter(context);
		expect(filter).to.have.property('type');
	});

	it('returns an object with an input property', () => {
		const filter = create_filter(context);
		expect(filter).to.have.property('input');
	});


});
