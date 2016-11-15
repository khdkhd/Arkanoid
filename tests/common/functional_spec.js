import * as functional from 'common/functional';
import {expect} from 'chai';
import sinon from 'sinon';

describe('common.functional.dispatch(...fns)', () => {
	it('returns a function', () => {
		const f = functional.dispatch(() => {});
		expect(f).to.be.a('function');
	});
	it('calls the given functions until one does returns a thruthy value', () => {
		const f1 = sinon.stub().returns(undefined);
		const f2 = sinon.stub().returns(null);
		const f3 = sinon.stub().returns({});
		const f4 = sinon.stub().returns([]);
		functional.dispatch(f1, f2, f3, f4)(); // create and invoke a dispatcher
		expect(f1.calledOnce).to.be.true;
		expect(f2.calledOnce).to.be.true;
		expect(f3.calledOnce).to.be.true;
		expect(f4.called).to.be.false;
	});
	it('forwards its argument to the given functions when invoked', () => {
		const f1 = sinon.stub().returns(null);
		const f2 = sinon.stub().returns(null);
		const args = [ 'foo', {}, [], true, false, 1];
		functional.dispatch(f1, f2)(...args); // create and invoke a dispatcher
		expect(f1.args[0]).to.deep.equal(args);
		expect(f2.args[0]).to.deep.equal(args);
	});
	it('returns back the value of the function which returned', () => {
		const f1 = sinon.stub().returns(null);
		const f2 = sinon.stub().returns('foo');
		const f3 = sinon.stub().returns('bar');
		const value = functional.dispatch(f1, f2, f3)(); // create and invoke a dispatcher
		expect(value).to.equal('foo');
	});
});
