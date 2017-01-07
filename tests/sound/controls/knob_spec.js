import { expect } from 'chai';
import create_knob from 'sound/controls/knob';
import document from '../test-assets/dom';
import sinon from 'sinon';
import times from 'lodash.times';

const sandbox = sinon.sandbox.create();
const context = {};

describe('create_knob()', ()=> {

	beforeEach(()=>{
		global.document = document;
		context.canvas = document.getElementById('screen');
		global.MouseEvent = document.defaultView.MouseEvent;
	});

	afterEach(()=> {
		sandbox.restore();
	});


	it('returns an object', ()=>{
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		expect(knob).to.be.an.object;
	});

	it('returns an object with a param property', ()=>{
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		expect(knob).to.have.property('param');
	});

	it('returns an object with a param property', ()=>{
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		expect(knob).to.have.property('param');
	});
	it('suscribes to its parameter change event', () => {
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		knob.param = {
			set value(value) {},
			get value() {},
			on: sinon.spy()
		};
		expect(knob.param.on.called).to.be.true;
		expect(knob.param.on.calledWith('change')).to.be.true;
	});
});

describe('knob mousemove handling', ()=> {

	beforeEach(()=>{
		global.document = document;
		context.canvas = document.getElementById('screen');
		global.MouseEvent = document.defaultView.MouseEvent;
	});

	afterEach(()=> {
		sandbox.restore();
	});

	it('suscribes to change events on its parameter', () => {
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		const param_state = {
			value: 0
		};
		knob.param = {
			set value(value){
				param_state.value = value;
			},
			get value(){
				return 	param_state.value;
			},
			on: sandbox.spy()
		};
		expect(knob.param.on.calledWith('change')).to.be.true;
	});

	it('affects parameter value', () => {
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		const param_state = {
			value: 0
		};
		knob.param = {
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
		context.canvas.dispatchEvent(mouse_down_event);
		times(100, () => {
			const mouse_move_event = new MouseEvent('mousemove',{movementY: 1});
			mouse_move_event.movementY = -1;
			context.canvas.dispatchEvent(mouse_move_event);
		});

		expect(knob.param.value).to.equal(1);
	});

	it('does not affects parameter value', () => {
		const knob = create_knob({pos:{x:0,y:0},radius: 25});
		const param_state = {
			value: 0
		};
		knob.param = {
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
		mouse_move_event.movementY = 1000;
		context.canvas.dispatchEvent(mouse_down_event);
		context.canvas.dispatchEvent(mouse_move_event);
		expect(knob.param.value).to.equal(0);
	});
});
