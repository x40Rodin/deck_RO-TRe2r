'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL', 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject', 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager', 'https://cdn.rodin.io/v0.0.1/rodinjs/animation/Animation', 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants', 'https://cdn.rodin.io/v0.0.1/rodinjs/time/Time'], function (_export, _context) {
    "use strict";

    var THREE, THREEObject, SceneManager, Animation, EVENT_NAMES, Time, _createClass, time, scene, breakDownAnimation, Floor, floor;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_httpsCdnRodinIoV001VendorThreeTHREEGLOBAL) {
            THREE = _httpsCdnRodinIoV001VendorThreeTHREEGLOBAL.THREE;
        }, function (_httpsCdnRodinIoV001RodinjsSculptTHREEObject) {
            THREEObject = _httpsCdnRodinIoV001RodinjsSculptTHREEObject.THREEObject;
        }, function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }, function (_httpsCdnRodinIoV001RodinjsAnimationAnimation) {
            Animation = _httpsCdnRodinIoV001RodinjsAnimationAnimation.Animation;
        }, function (_httpsCdnRodinIoV001RodinjsConstantsConstants) {
            EVENT_NAMES = _httpsCdnRodinIoV001RodinjsConstantsConstants.EVENT_NAMES;
        }, function (_httpsCdnRodinIoV001RodinjsTimeTime) {
            Time = _httpsCdnRodinIoV001RodinjsTimeTime.Time;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            time = Time.getInstance();
            scene = SceneManager.get();
            breakDownAnimation = new Animation('break', {
                position: {
                    y: -15
                }
            });

            breakDownAnimation.duration(2000);

            _export('Floor', Floor = function (_THREEObject) {
                _inherits(Floor, _THREEObject);

                function Floor() {
                    _classCallCheck(this, Floor);

                    var _this = _possibleConstructorReturn(this, (Floor.__proto__ || Object.getPrototypeOf(Floor)).call(this, new THREE.Object3D()));

                    _this.cubeCount = 30;
                    _this.cubeWidht = 1;
                    _this.cubes = [];

                    _this.on('ready', function () {
                        scene.add(_this.object3D);
                        _this.setup();
                    });
                    return _this;
                }

                _createClass(Floor, [{
                    key: 'setup',
                    value: function setup() {
                        var plane = new THREE.PlaneGeometry(this.cubeWidht, this.cubeWidht, 2, 2);
                        var material = new THREE.MeshBasicMaterial({
                            transparent: true,
                            depthWrite: false,
                            opacity: 0.5,
                            map: new THREE.TextureLoader().load("./models/plane/planeground.png")
                        });

                        var center = new THREE.Vector3(0, 0, 0);
                        for (var i = 0; i < this.cubeCount; i++) {
                            for (var j = 0; j < this.cubeCount; j++) {
                                var position = new THREE.Vector3((i - this.cubeCount / 2) * this.cubeWidht, 0, (j - this.cubeCount / 2) * this.cubeWidht);
                                var obj = new THREEObject(new THREE.Mesh(plane, material));

                                obj.object3D.rotation.x = -Math.PI / 2;
                                obj.object3D.position.copy(position);
                                this.object3D.add(obj.object3D);
                                obj.object3D.visible = false;
                                obj.object3D.distanceFromCenter = position.distanceTo(center);
                                obj.mustBrake = Math.random() < obj.object3D.distanceFromCenter / (this.cubeCount * this.cubeWidht / 2);
                                if (obj.mustBrake) {
                                    obj.animator.add(breakDownAnimation);
                                    obj.on(EVENT_NAMES.ANIMATION_COMPLETE, function (evt) {
                                        evt.target.object3D.visible = false;
                                    });
                                }
                                this.cubes.push(obj);
                            }
                        }
                    }
                }, {
                    key: 'animate',
                    value: function animate() {
                        var _this2 = this;

                        var _loop = function _loop(i) {
                            var obj = _this2.cubes[i];
                            setTimeout(function () {
                                obj.object3D.visible = true;
                                if (obj.mustBrake) {
                                    setTimeout(function () {
                                        obj.speed = 0;
                                        obj.on('update', function (evt) {
                                            if (!evt.target.object3D.visible) return;
                                            evt.target.object3D.position.y -= evt.target.speed * time.deltaTime() / 1000;
                                            evt.target.speed += time.deltaTime() / 1000 * 9.8;

                                            if (evt.target.object3D.position.y < -200) {
                                                evt.target.object3D.visible = false;
                                            }
                                        });
                                    }, 5000 * Math.random());
                                }
                            }, obj.object3D.distanceFromCenter * 200 + 500);
                        };

                        for (var i = 0; i < this.cubes.length; i++) {
                            _loop(i);
                        }
                    }
                }]);

                return Floor;
            }(THREEObject));

            _export('Floor', Floor);

            _export('floor', floor = new Floor());

            _export('floor', floor);
        }
    };
});