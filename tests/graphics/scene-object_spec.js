import {expect} from 'chai';
import sinon from 'sinon';

import SceneObject from 'graphics/scene-object';
import Screen from 'graphics/screen';
import Vector from 'maths/vector';

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

describe('graphics.SceneObject({position, size, [, onSceneChanged][, onRender][, zIndex]})', () => {
	const zIndex = 42;
	const position = Vector({x: 1, y: 1});
	const size = {
		width: 1,
		height: 1
	};
	describe('#boundingBox.absolute', () => {
		it('is a maths.Rect', () => {
			const scene_object = SceneObject({position, size});
			const r = scene_object.boundingBox.absolute;
			expect(r.x).to.equal(position.x);
			expect(r.y).to.equal(position.y);
			expect(r.width).to.equal(size.width);
			expect(r.height).to.equal(size.height);
		});
	});
	describe('#boundingBox.relative', () => {
		it('is a maths.Rect with its top left point equals to (0, 0)', () => {
			const scene_object = SceneObject({position, size});
			const r = scene_object.boundingBox.relative;
			expect(r.x).to.equal(0);
			expect(r.y).to.equal(0);
			expect(r.width).to.equal(size.width);
			expect(r.height).to.equal(size.height);
		});
	});
	describe('#scene', () => {
		it('returns the scene', () => {
			const scene = SceneMock();
			const scene_object = SceneObject({position, size, scene});
			expect(scene_object.scene).to.equal(scene);
		});
		it('sets the scene when affected a value', () => {
			const scene1 = SceneMock();
			const scene2 = SceneMock();
			const scene_object = SceneObject({position, size, scene1});
			scene_object.scene = scene2;
			expect(scene_object.scene).to.equal(scene2);
		});
		it('adds itself to the scene when affected a value', () => {
			const scene_object = SceneObject({position, size});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(scene.add).to.have.been.calledOnce;
			expect(scene.add).to.have.been.calledWith(scene_object);
		});
		it('removes itself from the scene when affected null or undefined', () => {
			const scene = SceneMock();
			const scene_object = SceneObject({position, size, scene});
			scene_object.scene = null;
			expect(scene.remove).to.have.been.calledOnce;
			expect(scene.remove).to.have.been.calledWith(scene_object);
		});
		it('calls back onSceneChanged with scene when affected a value', () => {
			const onSceneChanged = sinon.spy();
			const scene_object = SceneObject({position, size, onSceneChanged});
			const scene = SceneMock();
			scene_object.scene = scene;
			expect(onSceneChanged).to.have.been.calledOnce;
			expect(onSceneChanged).to.have.been.calledWith(scene);
		});
	});
	describe('#zIndex', () => {
		it('returns the z-index', () => {
			const scene_object = SceneObject({position, size, zIndex});
			expect(scene_object.zIndex).to.equal(zIndex);
		});
		it('sets the z-index when affected a value', () => {
			const scene_object = SceneObject({position, size, zIndex});
			scene_object.zIndex = zIndex + 1;
			expect(scene_object.zIndex).to.equal(zIndex + 1);
		});
		it('re-adds itself to the scene when affected a value', () => {
			const scene_object = SceneObject({position, size, zIndex});
			scene_object.scene = SceneMock();
			scene_object.zIndex = zIndex + 1;
			expect(scene_object.scene.add).to.have.been.called;
		});
	});
	describe('#render()', () => {
		it('calls back onRender with the scene as parameter if rendering is enabled', () => {
			const onRender = sinon.spy();
			const scene = SceneMock();
			const scene_object = SceneObject({position, onRender, scene, size, zIndex});
			scene_object.toggleRender(true);
			scene_object.render();
			expect(onRender).to.have.been.calledOnce;
			expect(onRender).to.have.been.calledWith(scene);
		});
		it('does not calls back onRender if rendering is disabled', () => {
			const onRender = sinon.spy();
			const scene = SceneMock();
			const scene_object = SceneObject({position, onRender, scene, size, zIndex});
			scene_object.toggleRender(false);
			scene_object.render();
			expect(onRender).to.not.have.been.called;
		});
	});
});
