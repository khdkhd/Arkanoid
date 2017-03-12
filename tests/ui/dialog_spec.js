import {default as Dialog} from 'ui/dialog';
import View from 'ui/view';

import {expect} from 'chai';
import {jsdom} from 'jsdom';
import constant from 'lodash.constant';
import sinon from 'sinon';
import shuffle from 'lodash.shuffle';

import datasetPolyfill from '../dataset-polyfill-jsdom';

function random_string(len) {
	return shuffle('abcdefghijhklmnopqrstuvwxyz0123456789').slice(0, len).join('');
}

describe('Dialog({el, childView, classNames, buttons, aboutToClose})', () => {
	beforeEach(() => {
		const document = jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
		global.document = document;
		global.window = document.defaultView;
		datasetPolyfill(global.window);
	});

	afterEach(() => {
		window.close();
	});

	describe('run()', () => {
		it('returns a promise', () => {
			const childView = View();
			const dialog = Dialog({childView});
			expect(dialog.run()).to.be.a('promise');
		});
		it('inserts exactly one .dialog element in the wrapping element', () => {
			const childView = View();
			const dialog = Dialog({childView});
			dialog.run();
			expect(document.querySelectorAll('body > .dialog'))
				.to.have.lengthOf(1);
		});
		it('inserts exactly one .dialog-button-box in the .dialog element', () => {
			const childView = View();
			const dialog = Dialog({childView});
			dialog.run();
			expect(document.querySelectorAll('body > .dialog > .dialog-button-box'))
				.to.have.lengthOf(1);
		});
		it('inserts the childView in the .dialog element', () => {
			const childView = View({id: 'child-view-id'});
			const dialog = Dialog({childView});
			dialog.run();
			expect(document.querySelectorAll('body > .dialog > #child-view-id'))
				.to.have.lengthOf(1);
		});
		it('calls back aboutToClose with \'ok\' when ok button is clicked', () => {
			const aboutToClose = sinon.spy();
			const childView = View({id: 'child-view-id'});
			const dialog = Dialog({childView, aboutToClose});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="ok"]').click();
			expect(aboutToClose).to.have.been.calledWith('ok');
		});
		it('calls back aboutToClose with \'cancel\' when cancel button is clicked', () => {
			const aboutToClose = sinon.spy();
			const childView = View({id: 'child-view-id'});
			const dialog = Dialog({childView, aboutToClose});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			expect(aboutToClose).to.have.been.calledWith('cancel');
		});
		it('fulfills the returned promise with the value returned by aboutToClose', () => {
			const aboutToClose = constant(random_string(12));
			const childView = View({id: 'child-view-id'});
			const dialog = Dialog({childView, aboutToClose});
			dialog.run();
			const promise = dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			return expect(promise).to.eventually.equal(aboutToClose());
		});
		it('removes the dialog from the DOM when a button is clicked', () => {
			const childView = View({id: 'child-view-id'});
			const dialog = Dialog({childView});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			expect(document.querySelectorAll('body > .dialog'))
				.to.have.lengthOf(0);
		});
	});
});
