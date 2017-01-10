import {expect} from 'chai';
import sinon from 'sinon';

import SceneObject from 'graphics/scene-object';
import Screen from 'graphics/screen';

import CanvasContextMock from 'tests/canvas-context-mock';

const scene_methods = [
	'add',
	'remove',
	'render'
];

function SceneMock() {
	return scene_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {screen: Screen(CanvasContextMock())});
}

describe('graphics.SceneObject({[onSceneChanged,] onRender, zIndex})', () => {
	const zIndex = 42;
	describe('#scene', () => {
		it('sets the scene when affected a value', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(scene_object.scene).to.equal(scene);
		});
		it('calls back onSceneChanged with scene when affected a value', () => {
			const onRender = () => {};
			const onSceneChanged = sinon.spy();
			const scene_object = SceneObject({zIndex, onRender, onSceneChanged});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(onSceneChanged).to.have.been.calledOnce;
			expect(onSceneChanged).to.have.been.calledWith(scene);
		});
		it('adds itself to the scene when affected a value', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(scene.add).to.have.been.called;
		});
		it('removes itself from the scene when affected null or undefined', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			const scene = SceneMock();
			scene_object.scene = scene;
			scene_object.scene = null;
			expect(scene.remove).to.have.been.called;
		});
		it('returns the scene', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(scene_object.scene).to.equal(scene);
		});
	});
	describe('#zIndex', () => {
		it('sets the z-index when affected a value', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			scene_object.zIndex = zIndex + 1;
			expect(scene_object.zIndex).to.equal(zIndex + 1);
		});
		it('re-adds itself to the scene when affected a value', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			scene_object.scene = SceneMock();
			scene_object.zIndex = zIndex + 1;
			expect(scene_object.scene.add).to.have.been.called;
		});
		it('returns the z-index', () => {
			const onRender = () => {};
			const scene_object = SceneObject({zIndex, onRender});
			expect(scene_object.zIndex).to.equal(zIndex);
		});
	});
	describe('#render()', () => {
		it('calls back onRender with the scene as parameter if rendering is enabled', () => {
			const onRender = sinon.spy();
			const scene_object = SceneObject({zIndex, onRender});
			scene_object.scene = SceneMock();
			scene_object.toggleRender(true);
			scene_object.render();
			expect(onRender).to.have.been.calledOnce;
			expect(onRender).to.have.been.calledWith(scene_object.scene);
		});
		it('does not calls back onRender if rendering is disabled', () => {
			const onRender = sinon.spy();
			const scene_object = SceneObject({zIndex, onRender});
			scene_object.scene = SceneMock();
			scene_object.toggleRender(false);
			scene_object.render();
			expect(onRender).to.not.have.been.called;
		});
	});
});
