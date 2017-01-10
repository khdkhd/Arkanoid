import {Dialog} from 'ui/dialog';
import {expect} from 'chai';
import {jsdom} from 'jsdom';
import constant from 'lodash.constant';
import sinon from 'sinon';
import shuffle from 'lodash.shuffle';

import datasetPolyfill from '../dataset-polyfill-jsdom';

function random_string(len) {
	return shuffle('abcdefghijhklmnopqrstuvwxyz0123456789').slice(0, len).join('');
}

describe('Dialog({aboutToClose, className, content, id})', () => {
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
			const dialog = Dialog({content: ''});
			expect(dialog.run()).to.be.a('promise');
		});
		it('creates exactly one body > div#modal-overlay element', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			expect(document.querySelectorAll('body > div#modal-overlay'))
				.to.have.lengthOf(1);
		});
		it('creates exactly one body > div.dialog element', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			expect(document.querySelectorAll('body > div.dialog'))
				.to.have.lengthOf(1);
		});
		it('creates exactly one \'cancel\' button', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			expect(document.querySelectorAll('body > .dialog button[data-role="cancel"]'))
				.to.have.lengthOf(1);
		});
		it('creates exactly one \'ok\' button', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			expect(document.querySelectorAll('body > .dialog button[data-role="ok"]'))
				.to.have.lengthOf(1);
		});
		it('adds the specified className to the div.dialog element', () => {
			const dialog = Dialog({content: '', className: ['foo', 'bar']});
			dialog.run();
			expect(document.querySelector('body > .dialog').className.split(' '))
				.to.have.lengthOf(3);
		});
		it('adds the specified id to the div.dialog element', () => {
			const dialog = Dialog({content: '', id: 'foo'});
			dialog.run();
			expect(document.querySelector('body > div.dialog').id).to.equal('foo');
		});
		it('adds the specified content string to the div.dialog element', () => {
			const dialog = Dialog({content: 'foo'});
			dialog.run();
			expect(document.querySelector('body > .dialog > .content-wrapper').innerHTML).to.equal('foo');
		});
		it('adds the specified content element to the div.dialog element', () => {
			const content = document.createElement('div');
			const dialog = Dialog({content});
			content.id = 'foo';
			dialog.run();
			expect(document.querySelectorAll('body > .dialog > .content-wrapper > div#foo'))
				.to.have.lengthOf(1);
		});
		it('calls back aboutToClose with \'ok\' when ok button is clicked', () => {
			const aboutToClose = sinon.spy();
			const dialog = Dialog({aboutToClose, content: ''});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="ok"]').click();
			expect(aboutToClose).to.have.been.calledWith('ok');
		});
		it('calls back aboutToClose with \'cancel\' when cancel button is clicked', () => {
			const aboutToClose = sinon.spy();
			const dialog = Dialog({aboutToClose, content: ''});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			expect(aboutToClose).to.have.been.calledWith('cancel');
		});
		it('fulfills the returned promise with the value returned by aboutToClose', () => {
			const aboutToClose = constant(random_string(12));
			const dialog = Dialog({aboutToClose, content: ''});
			const promise = dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			return expect(promise).to.eventually.equal(aboutToClose());
		});
		it('removes body > div#modal-overlay element from the DOM when a button is clicked', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			expect(document.querySelectorAll('body > #modal-overlay'))
				.to.have.lengthOf(0);
		});
		it('removes body > div.dialog element from the DOM when a button is clicked', () => {
			const dialog = Dialog({content: ''});
			dialog.run();
			document.querySelector('body > .dialog button[data-role="cancel"]').click();
			expect(document.querySelectorAll('body > .dialog'))
				.to.have.lengthOf(0);
		});
	});
});
