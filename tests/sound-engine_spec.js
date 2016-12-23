import {Synth, Seq, Parts } from 'sound';
import {expect} from 'chai';
import sinon from 'sinon';


const audio_context_methods = [
	'createOscillator',
	'createGain',
	'createBiquadFilter',
	'createChannelMerger'
];

function createAudioContextMock() {
	return audio_context_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {
		currentTime: 0
	});
}

describe('createSynth(audio_context)',()=>{
	it('creates and return a new Synth object', () => {
		const synth = Synth(createAudioContextMock());
		expect(synth).to.be.an('object');
	});
});

describe('createSequencer(audio_context)',()=>{
	it('creates and return a new Sequencer object', () => {
		const audio_context = createAudioContextMock();
		const seq = Seq(audio_context, {slave:Synth(audio_context)});
		expect(seq).to.be.an('object');
	});
});

describe('createVCO(audio_context)',()=>{
	it('creates and return a new VCO object', () => {
		const audio_context = createAudioContextMock();
		expect(Parts.vco(audio_context)).to.be.an('object');
	});
	it('calls createOscillator once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.vco(audio_context);
		expect(audio_context.createOscillator.called).to.be.true;
	});
});

describe('createVCA(audio_context)',()=>{
	it('creates and return a new VCA object', () => {
		const audio_context = createAudioContextMock();
		expect(Parts.vca(audio_context)).to.be.an('object');
	});
	it('calls createGain once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.vca(audio_context);
		expect(audio_context.createGain.called).to.be.true;
	});
});

describe('createBiquadFilter(audio_context)',()=>{
	it('creates and return a new Biquad Filter object', () => {
		const audio_context = createAudioContextMock();
		expect(Parts.biquad_filter(audio_context)).to.be.an('object');
	});
	it('calls createBiquadFilter once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.biquad_filter(audio_context);
		expect(audio_context.createBiquadFilter.called).to.be.true;
	});
});

describe('createLFO(audio_context)',()=>{
	it('creates and return a new LFO object', () => {
		const audio_context = createAudioContextMock();
		expect(Parts.lfo(audio_context)).to.be.an('object');
	});
	it('calls createOscillator once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.lfo(audio_context);
		expect(audio_context.createOscillator.calledOnce).to.be.true;
	});
	it('calls createGain once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.lfo(audio_context);
		expect(audio_context.createGain.calledOnce).to.be.true;
	});
});

describe('createPolyphonicGenerator(audio_context)',()=>{
	it('creates and return a new Polyphic Generator object', () => {
		const audio_context = createAudioContextMock();
		expect(Parts.polyphonic_generator(audio_context,{voices:1})).to.be.an('object');
	});
	it('calls createOscillator once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.polyphonic_generator(audio_context,{voices:1});
		expect(audio_context.createOscillator.calledOnce).to.be.true;
	});
	it('calls createOscillator twice on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.polyphonic_generator(audio_context,{voices:2});
		expect(audio_context.createOscillator.calledTwice).to.be.true;
	});
	it('calls createGain once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.polyphonic_generator(audio_context,{voices:1});
		expect(audio_context.createGain.calledOnce).to.be.true;
	});
	it('calls createGain twice on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.polyphonic_generator(audio_context,{voices:2});
		expect(audio_context.createGain.calledTwice).to.be.true;
	});
	it('calls createChannelMerger once on the Audio Context', () => {
		const audio_context = createAudioContextMock();
		Parts.polyphonic_generator(audio_context,{voices:2});
		expect(audio_context.createChannelMerger.calledOnce).to.be.true;
	});
});
