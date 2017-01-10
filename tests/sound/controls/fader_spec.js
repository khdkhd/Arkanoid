import { expect } from 'chai';
import create_fader from 'sound/controls/fader';
import document from 'tests/sound/test-assets/dom';
import sinon from 'sinon';

const sandbox = sinon.sandbox.create();
const context = {};

describe('create_fader()', ()=> {

	beforeEach(()=>{
		global.document = document;
		context.canvas = document.getElementById('screen');
		global.MouseEvent = document.defaultView.MouseEvent;
	});

	afterEach(()=> {
		sandbox.restore();
	});


	it('returns an object', ()=>{
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		expect(fader).to.be.an.object;
	});

	it('returns an object with a param property', ()=>{
		const fader = create_fader({pos:{x:0,y:0},radius:10});
		expect(fader).to.have.property('param');
	});

	it('returns an object with a param property', ()=>{
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		expect(fader).to.have.property('param');
	});
	it('suscribes to its parameter change event', () => {
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		fader.param = {
			set value(value) {},
			get value() {},
			on: sinon.spy()
		};
		expect(fader.param.on.called).to.be.true;
		expect(fader.param.on.calledWith('change')).to.be.true;
	});
});

describe('set parameter', () => {

	beforeEach(()=>{
		global.document = document;
		context.canvas = document.getElementById('screen');
	});

	afterEach(()=> {
		sandbox.restore();
	});

	it('suscribes to change events on its parameter', () => {
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		const param_state = {
			value: 0
		};
		fader.param = {
			set value(value){
				param_state.value = value;
			},
			get value(){
				return 	param_state.value;
			},
			on: sandbox.spy()
		};
		expect(fader.param.on.calledWith('change')).to.be.true;
	});
});

describe('fader mousemove handling', ()=> {

	beforeEach(()=>{
		global.document = document;
		context.canvas = document.getElementById('screen');
		global.MouseEvent = document.defaultView.MouseEvent;
	});

	afterEach(()=> {
		sandbox.restore();
	});


	it('affects parameter value', () => {
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		const param_state = {
			value: 0
		};
		fader.param = {
			set value(value){
				param_state.value = value;
			},
			get value(){
				return 	param_state.value;
			},
			on: sandbox.spy()
		};
		const mouse_down_event = new MouseEvent('mousedown', {
			bubbles: true,
			clientX: 101,
			clientY: 101
		});
		const mouse_move_event = new MouseEvent('mousemove',{movementY: 1});
		mouse_move_event.movementY = -100;
		context.canvas.dispatchEvent(mouse_down_event);
		context.canvas.dispatchEvent(mouse_move_event);
		expect(fader.param.value).to.equal(1);
	});

	it('does not affects parameter value', () => {
		const fader = create_fader({pos:{x:0,y:0},height:100, width:10});
		const param_state = {
			value: 0
		};
		fader.param = {
			set value(value){
				param_state.value = value;
			},
			get value(){
				return 	param_state.value;
			},
			on: sandbox.spy()
		};
		const mouse_down_event = new MouseEvent('mousedown', {
			bubbles: true,
			clientX: 99,
			clientY: 99
		});
		const mouse_move_event = new MouseEvent('mousemove',{movementY: 1});
		mouse_move_event.movementY = -100;
		context.canvas.dispatchEvent(mouse_down_event);
		context.canvas.dispatchEvent(mouse_move_event);
		expect(fader.param.value).to.equal(0);
	});
});
