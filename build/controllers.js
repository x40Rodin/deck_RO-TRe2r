'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL', 'https://cdn.rodin.io/v0.0.1/vendor/three/examples/js/loaders/OBJLoader', 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN', 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager', 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController', 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/OculusController', 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController', 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/CardboardController'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, SceneManager, ViveController, OculusController, MouseController, CardboardController, scene, controls, mouse, cardboard, oculus, controllerL, controllerR, vive;


    function setupGazePointUpdate(gazePoint) {
        gazePoint.Sculpt.object3D.renderOrder = 10000;

        gazePoint.Sculpt.on('update', function () {
            gazePoint.alpha = gazePoint.controller.intersected.length === 0 ? .00000001 : .02;
            if (gazePoint.controller.intersected.length !== 0) {
                gazePoint.fixedDistance = 0;
            }
            gazePoint.currentAlpha = gazePoint.currentAlpha || gazePoint.alpha;
            var delta = (gazePoint.alpha - gazePoint.currentAlpha) * RODIN.Time.deltaTime() * 0.01;
            if (Math.abs(delta) < 0.0000001) return;
            gazePoint.currentAlpha += delta;

            gazePoint.Sculpt.object3D.geometry.dispose();
            gazePoint.Sculpt.object3D.geometry = new THREE.RingGeometry(.00000001 + gazePoint.currentAlpha, .01 + gazePoint.currentAlpha, 32);
        });
    }

    /**
     * Mouse Controller
     */
    return {
        setters: [function (_httpsCdnRodinIoV001VendorThreeTHREEGLOBAL) {
            THREE = _httpsCdnRodinIoV001VendorThreeTHREEGLOBAL.THREE;
        }, function (_httpsCdnRodinIoV001VendorThreeExamplesJsLoadersOBJLoader) {}, function (_httpsCdnRodinIoV001RodinjsRODIN) {
            RODIN = _httpsCdnRodinIoV001RodinjsRODIN;
        }, function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }, function (_httpsCdnRodinIoV001RodinjsControllersViveController) {
            ViveController = _httpsCdnRodinIoV001RodinjsControllersViveController.ViveController;
        }, function (_httpsCdnRodinIoV001RodinjsControllersOculusController) {
            OculusController = _httpsCdnRodinIoV001RodinjsControllersOculusController.OculusController;
        }, function (_httpsCdnRodinIoV001RodinjsControllersMouseController) {
            MouseController = _httpsCdnRodinIoV001RodinjsControllersMouseController.MouseController;
        }, function (_httpsCdnRodinIoV001RodinjsControllersCardboardController) {
            CardboardController = _httpsCdnRodinIoV001RodinjsControllersCardboardController.CardboardController;
        }],
        execute: function () {
            scene = SceneManager.get();
            controls = scene.controls;

            _export('mouse', mouse = new MouseController());

            _export('mouse', mouse);

            mouse.raycastLayers = 2;
            SceneManager.addController(mouse);

            /**
             * Cardboard Controller
             */

            _export('cardboard', cardboard = null);

            _export('cardboard', cardboard);

            _export('cardboard', cardboard = new CardboardController());
            cardboard.raycastLayers = 2;
            SceneManager.addController(cardboard);
            setTimeout(function () {
                setupGazePointUpdate(cardboard.gazePoint);
            }, 2000);

            /**
             * Oculus Controller
             */

            _export('oculus', oculus = null);

            _export('oculus', oculus);

            _export('oculus', oculus = new OculusController());
            oculus.raycastLayers = 2;
            SceneManager.addController(oculus);
            setTimeout(function () {
                setupGazePointUpdate(oculus.gazePoint);
            }, 2000);

            /**
             * Vive Controllers
             */
            controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 2);
            controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 2);

            controllerL.standingMatrix = controls.getStandingMatrix();
            controllerL.initControllerModel();
            controllerL.initRaycastingLine();
            SceneManager.addController(controllerL);
            scene.add(controllerL);

            controllerR.standingMatrix = controls.getStandingMatrix();
            controllerR.initControllerModel();
            controllerR.initRaycastingLine();
            SceneManager.addController(controllerR);
            scene.add(controllerR);

            _export('vive', vive = {
                left: controllerL,
                right: controllerR
            });

            _export('vive', vive);
        }
    };
});