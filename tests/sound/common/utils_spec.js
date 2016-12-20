import { expect } from 'chai';
import { scale, unscale } from 'sound/common/utils';

describe('unscale(range, value)', ()=> {
	it('returns the value scaled in a 0..1 range', ()=>{
		const v = unscale({min: 500, max: 1000}, 750);
		expect(v).to.equal(.5);
	});
});

describe('scale(range, value)', ()=> {
	it('returns the value between 0 and 1 scaled back in given range', ()=>{
		const v = scale({min: 500, max: 1000}, .5);
		expect(v).to.equal(750);
	});
});
