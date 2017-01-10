import {expect} from 'chai';
import sinon from 'sinon';
import {EventEmitter} from 'events';

import CanvasContextMock from 'tests/canvas-context-mock';

import SceneObject from 'graphics/scene-object';
import Screen from 'graphics/screen';

describe('graphics.SceneObject({emitter, onRender, zIndex})', () => {
	const zIndex = 42;

	describe('#zIndex', () => {
		it('returns the z-index', () => {
			const onRender = () => {};
			const scene_object = SceneObject({
				emitter: new EventEmitter(),
				zIndex,
				onRender
			});
			expect(scene_object.zIndex).to.equal(zIndex);
		});
		it('sets the z-index when affected a value', () => {
			const onRender = () => {};
			const scene_object = SceneObject({
				emitter: new EventEmitter(),
				zIndex,
				onRender
			});
			scene_object.zIndex = zIndex + 1;
			expect(scene_object.zIndex).to.equal(zIndex + 1);
		});
		it('emits \'zindex-changed\' event when affected a value', () => {
			const emitter = new EventEmitter();
			const onRender = () => {};
			const cb = sinon.spy();
			const scene_object = SceneObject({emitter, zIndex, onRender});
			emitter.once('zindex-changed', cb);
			scene_object.zIndex = 12;
			expect(cb).to.have.been.calledOnce;
		});
	});
	describe('#render(screen)', () => {
		it('calls back onRender with screen as parameter if rendering is enabled', () => {
			const screen = Screen(CanvasContextMock());
			const emitter = new EventEmitter();
			const onRender = sinon.spy();
			const scene_object = SceneObject({emitter, zIndex, onRender});
			scene_object.toggleRender(true);
			scene_object.render(screen);
			expect(onRender).to.have.been.calledOnce;
			expect(onRender).to.have.been.calledWith(screen);
		});
		it('does not calls back onRender if rendering is disabled', () => {
			const screen = Screen(CanvasContextMock());
			const emitter = new EventEmitter();
			const onRender = sinon.spy();
			const scene_object = SceneObject({emitter, zIndex, onRender});
			scene_object.toggleRender(false);
			scene_object.render(screen);
			expect(onRender).to.not.have.been.called;
		});
	});
});
