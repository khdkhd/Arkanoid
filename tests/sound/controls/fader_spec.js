import { expect } from 'chai';
import create_fader from 'sound/controls/fader';
import jsdom from 'jsdom';
import sinon from 'sinon';


describe('create_fader()', ()=> {

	beforeEach(()=>{
		const document = jsdom.jsdom('arkanoid');
		global.document = document;
		global.MouseEvent = document.defaultView.MouseEvent;
	});

	it('returns an object', ()=>{
		const fader = create_fader({pos:{x:0,y:0},radius:10});
		expect(fader).to.be.an.object;
	});

	it('returns an object with a param property', ()=>{
		const fader = create_fader({pos:{x:0,y:0},radius:10});
		expect(fader).to.have.property('param');
	});

	it('returns an object with a param property', ()=>{
		const fader = create_fader({pos:{x:0,y:0},radius:10});
		expect(fader).to.have.property('param');
	});
});

describe('fader handles mousemove', ()=> {
	it('forwards an event to the parametre object', () => {
		const fader = create_fader({pos:{x:0,y:0},radius:10});
		let _value  = 0;
		fader.param = {
			set value(value){
				_value = value;
			},
			get value(){
				return _value;
			},
			on: sinon.spy()
		};
		document.dispatchEvent(new MouseEvent('mousemove', {}));
		expect(fader.param.on.called).to.be.true;
	});
});
