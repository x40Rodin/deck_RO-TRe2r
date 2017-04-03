'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager', 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants', './objects/screen.js', './objects/characters.js', './objects/index.js'], function (_export, _context) {
    "use strict";

    var SceneManager, EVENT_NAMES, screen, Characters, env, initialPositions, activeUsers, scene, SS;


    function renderMan(position, socketId) {
        var man = Characters.createMan();
        man.on('ready', function (evt) {
            evt.target.object3D.position.set(position.x, position.y, position.z);
            activeUsers[socketId] = evt.target.object3D;
            scene.add(evt.target.object3D);
        });
    }

    return {
        setters: [function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }, function (_httpsCdnRodinIoV001RodinjsConstantsConstants) {
            EVENT_NAMES = _httpsCdnRodinIoV001RodinjsConstantsConstants.EVENT_NAMES;
        }, function (_objectsScreenJs) {
            screen = _objectsScreenJs.screen;
        }, function (_objectsCharactersJs) {
            Characters = _objectsCharactersJs;
        }, function (_objectsIndexJs) {
            env = _objectsIndexJs.env;
        }],
        execute: function () {
            initialPositions = [{ x: -1, y: 0, z: -1 }, { x: 1, y: 0, z: -1 }, { x: 2, y: 0, z: -1 }, { x: 3, y: 0, z: -1 }, { x: 4, y: 0, z: -1 }, { x: -2, y: 0, z: -1 }, { x: -3, y: 0, z: -1 }];
            activeUsers = {};
            scene = SceneManager.get();
            SS = new RodinSocket();


            screen.on(EVENT_NAMES.CONTROLLER_KEY_UP, function (evt) {
                SS.broadcastToAll('changeMode', {});
            });

            SS.connect({});

            SS.onConnected(function (data) {
                return SS.getConnectedUsersList();
            });

            SS.onMessage('socketDisconnected', function (data) {
                return scene.scene.remove(activeUsers[data.socketId]);
            });

            SS.onMessage('changeMode', function (data) {
                if (env.mode === 'light') {
                    env.enterDarkMode();
                    SS.setData({ darkMode: true });
                }
            });

            SS.onMessage('renderPerson', function (data) {
                if (data.socketId != SS.Socket.id) renderMan(initialPositions[data.coordinateIndex], data.socketId);

                var interval = setInterval(function () {
                    var cameraDirection = scene.camera.getWorldDirection();
                    var angle = Characters.getAngle(new THREE.Vector2(0, 0), new THREE.Vector2(cameraDirection.x, cameraDirection.z));
                    SS.broadcastToAll('changeUserCoordinates', { rotation: Math.PI / 2 - angle, socketId: SS.Socket.id });
                }, 50);
            });

            SS.onMessage('changeUserCoordinates', function (data) {
                if (activeUsers[data.socketId]) activeUsers[data.socketId].rotation.y = data.rotation;
            });

            SS.onMessage('changeMainPicture', function (data) {

                if (data.socketId != SS.Socket.id) screen.show(data.imageIndex);
            });

            SS.onMessage('getConnectedUsersList', function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].positionIndex)) {
                        var socket = data[i].socketId;
                        initialPositions[data[i].positionIndex].id = data[i].socketId;
                        renderMan(initialPositions[data[i].positionIndex], socket);
                    }
                }
                var firstFreePosition = initialPositions.findIndex(function (position) {
                    return !position.id;
                });
                var findPresentaionImageState = data.find(function (user) {
                    return user.imageIndex;
                });
                var findEnteredDarkMode = data.find(function (user) {
                    return user.darkMode;
                });

                if (findEnteredDarkMode) {
                    env.enterDarkMode();
                    SS.setData({ darkMode: true });
                }

                if (findPresentaionImageState) {
                    screen.unlock();
                    screen.show(findPresentaionImageState.imageIndex);
                    SS.setData({ imageIndex: findPresentaionImageState.imageIndex });
                }

                SS.setData({ positionIndex: firstFreePosition });
                SS.broadcastToAll('renderPerson', { coordinateIndex: firstFreePosition, socketId: SS.Socket.id });
            });

            screen.on('change', function (evt) {
                if (SS.Socket) {
                    SS.setData({ imageIndex: evt.target.currentIndex });
                    SS.broadcastToAll('changeMainPicture', { imageIndex: evt.target.currentIndex, socketId: SS.Socket.id });
                }
            });window.onbeforeunload = function (event) {
                SS.disconnect();
            };
        }
    };
});