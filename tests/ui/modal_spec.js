import Modal from 'ui/modal';
import View from 'ui/view';

import {expect} from 'chai';
import {jsdom} from 'jsdom';
// import constant from 'lodash.constant';
// import sinon from 'sinon';
// import shuffle from 'lodash.shuffle';

import datasetPolyfill from '../dataset-polyfill-jsdom';

// function random_string(len) {
// 	return shuffle('abcdefghijhklmnopqrstuvwxyz0123456789').slice(0, len).join('');
// }

describe('Modal({el, childView})', () => {
	beforeEach(() => {
		const document = jsdom('<!DOCTYPE html><html><head></head><body><div id="wrapper"></div></body></html>');
		global.document = document;
		global.window = document.defaultView;
		datasetPolyfill(global.window);
	});

	afterEach(() => {
		window.close();
	});

	describe('#start()', () => {
		it('inserts exactly div.overlay element inside the wrapping element', () => {
			const el = document.querySelector('#wrapper');
			const childView = View({id: 'child-view-id'});
			const modal = Modal({el, childView});
			modal.start();
			expect(document.querySelectorAll('#wrapper > div.overlay'))
				.to.have.lengthOf(1);
		});
		it('inserts childView inside the wrapping element directly after the overlay element', () => {
			const el = document.querySelector('#wrapper');
			const childView = View({id: 'child-view-id'});
			const modal = Modal({el, childView});
			modal.start();
			expect(document.querySelectorAll('#wrapper > div.overlay + #child-view-id'))
				.to.have.lengthOf(1);
		});
	});

	describe('#stop()', () => {
		it('removes the overlay element from the wrapping element', () => {
			const el = document.querySelector('#wrapper');
			const childView = View({id: 'child-view-id'});
			const modal = Modal({el, childView});
			modal.start();
			modal.stop();
			expect(document.querySelectorAll('#wrapper > div.overlay'))
				.to.have.lengthOf(0);
		});
		it('removes childView from the wrapping element', () => {
			const el = document.querySelector('#wrapper');
			const childView = View({id: 'child-view-id'});
			const modal = Modal({el, childView});
			modal.start();
			modal.stop();
			expect(document.querySelectorAll('#wrapper > div.overlay + #child-view-id'))
				.to.have.lengthOf(0);
		});
	});
});
