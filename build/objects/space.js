'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL', 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject', 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager'], function (_export, _context) {
    "use strict";

    var THREE, THREEObject, SceneManager, scene, material, textureLoader, space;
    return {
        setters: [function (_httpsCdnRodinIoV001VendorThreeTHREEGLOBAL) {
            THREE = _httpsCdnRodinIoV001VendorThreeTHREEGLOBAL.THREE;
        }, function (_httpsCdnRodinIoV001RodinjsSculptTHREEObject) {
            THREEObject = _httpsCdnRodinIoV001RodinjsSculptTHREEObject.THREEObject;
        }, function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }],
        execute: function () {
            scene = SceneManager.get();
            material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide
            });
            textureLoader = new THREE.TextureLoader();

            material.map = textureLoader.load('./images/background.jpg');

            _export('space', space = new THREEObject(new THREE.Mesh(new THREE.SphereGeometry(90, 40, 40), material)));

            _export('space', space);

            space.show = function () {
                if (space.ready) {
                    return scene.add(space.object3D);
                }

                space.on('ready', function () {
                    scene.add(space.object3D);
                });
            };
        }
    };
});