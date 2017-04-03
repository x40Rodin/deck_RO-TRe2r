'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL', 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/ModelLoader', 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager'], function (_export, _context) {
    "use strict";

    var THREE, ModelLoader, SceneManager, scene, room;
    return {
        setters: [function (_httpsCdnRodinIoV001VendorThreeTHREEGLOBAL) {
            THREE = _httpsCdnRodinIoV001VendorThreeTHREEGLOBAL.THREE;
        }, function (_httpsCdnRodinIoV001RodinjsSculptModelLoader) {
            ModelLoader = _httpsCdnRodinIoV001RodinjsSculptModelLoader.ModelLoader;
        }, function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }],
        execute: function () {
            scene = SceneManager.get();

            _export('room', room = ModelLoader.load('./models/room/room.json'));

            _export('room', room);

            room.on('ready', function (evt) {
                var floorTexture = new THREE.TextureLoader().load("./models/room/floor.jpg");
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture.repeat.set(4, 4);

                evt.target.object3D.children[0].material.materials[0].map = floorTexture;
                evt.target.object3D.scale.set(.004, .004, .004);
                scene.add(evt.target.object3D);
            });
        }
    };
});