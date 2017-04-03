'use strict';

System.register(['https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL', 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/elements/Element', 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject', 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager', 'https://cdn.rodin.io/v0.0.1/rodinjs/animation/Animation', 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants', 'https://cdn.rodin.io/v0.0.1/rodinjs/Event'], function (_export, _context) {
    "use strict";

    var THREE, Element, THREEObject, SceneManager, Animation, EVENT_NAMES, Event, _createClass, scene, hoverAnimation, hoverOutAnimation, Screen, screen;

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
        }, function (_httpsCdnRodinIoV001RodinjsSculptElementsElement) {
            Element = _httpsCdnRodinIoV001RodinjsSculptElementsElement.Element;
        }, function (_httpsCdnRodinIoV001RodinjsSculptTHREEObject) {
            THREEObject = _httpsCdnRodinIoV001RodinjsSculptTHREEObject.THREEObject;
        }, function (_httpsCdnRodinIoV001RodinjsSceneSceneManager) {
            SceneManager = _httpsCdnRodinIoV001RodinjsSceneSceneManager.SceneManager;
        }, function (_httpsCdnRodinIoV001RodinjsAnimationAnimation) {
            Animation = _httpsCdnRodinIoV001RodinjsAnimationAnimation.Animation;
        }, function (_httpsCdnRodinIoV001RodinjsConstantsConstants) {
            EVENT_NAMES = _httpsCdnRodinIoV001RodinjsConstantsConstants.EVENT_NAMES;
        }, function (_httpsCdnRodinIoV001RodinjsEvent) {
            Event = _httpsCdnRodinIoV001RodinjsEvent.Event;
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

            scene = SceneManager.get();
            hoverAnimation = new Animation('hover', {
                scale: {
                    x: 1.01,
                    y: 1.01,
                    z: 1.01
                }
            });

            hoverAnimation.duration(100);

            hoverOutAnimation = new Animation('hoverout', {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                }
            });

            hoverOutAnimation.duration(100);

            _export('Screen', Screen = function (_THREEObject) {
                _inherits(Screen, _THREEObject);

                function Screen() {
                    _classCallCheck(this, Screen);

                    var width = 6;
                    var p = 1920 / 1080;
                    var height = width / p;

                    var _this = _possibleConstructorReturn(this, (Screen.__proto__ || Object.getPrototypeOf(Screen)).call(this, new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))));

                    _this.locked = false;
                    _this.lastChanged = 0;

                    _this.animator.add(hoverAnimation, hoverOutAnimation);

                    var textureLoader = new THREE.TextureLoader();

                    _this.slides = [textureLoader.load('./images/presentation/p2.jpg'), textureLoader.load('./images/presentation/p3.jpg'), textureLoader.load('./images/presentation/p4.jpg')];

                    _this.on('ready', function () {
                        _this.currentIndex = -1;
                        _this.show(0);
                        _this.lock();

                        _this.backButton = new Element({
                            width: .2,
                            height: .2,
                            background: {
                                color: 0xaaaaaa,
                                opacity: 0
                            },
                            image: {
                                url: "./images/backbutton.png",
                                width: .2,
                                height: .2,
                                opacity: 1,
                                position: {
                                    h: 50,
                                    v: 50
                                }
                            }
                        });

                        _this.backButton.on('ready', function (evt) {
                            evt.target.object3D.position.set(-width / 2 + .4, height / 2 - .3, .1);
                            _this.object3D.add(evt.target.object3D);
                            evt.target.raycastable = true;
                            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
                        });

                        _this.backButton.on(EVENT_NAMES.CONTROLLER_HOVER, function (evt) {
                            if (evt.target.animator.isPlaying('hoverout')) {
                                evt.target.animator.stop('hoverout', false);
                            }
                            evt.target.animator.start('hover');
                        });

                        _this.backButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
                            if (evt.target.animator.isPlaying('hover')) {
                                evt.target.animator.stop('hover', false);
                            }
                            evt.target.animator.start('hoverout');
                        });

                        _this.backButton.on([EVENT_NAMES.CONTROLLER_KEY_DOWN, EVENT_NAMES.CONTROLLER_KEY_UP], function (evt) {
                            evt.stopPropagation();
                        });

                        _this.backButton.on(EVENT_NAMES.CONTROLLER_KEY_UP, function () {
                            _this.prev();
                        });
                    });
                    return _this;
                }

                _createClass(Screen, [{
                    key: 'show',
                    value: function show(slideIndex) {
                        if (Date.now() - this.lastChanged < 200) return;
                        this.lastChanged = Date.now();
                        if (this.locked || this.currentIndex === slideIndex) return;
                        this.object3D.material.map = this.slides[slideIndex];
                        this.currentIndex = slideIndex;
                        this.emit('change', new Event(this));
                    }
                }, {
                    key: 'next',
                    value: function next() {
                        if (this.currentIndex < this.slides.length - 1) {
                            this.show(this.currentIndex + 1);
                        }
                    }
                }, {
                    key: 'prev',
                    value: function prev() {
                        if (this.currentIndex > 0) {
                            this.show(this.currentIndex - 1);
                        }
                    }
                }, {
                    key: 'lock',
                    value: function lock() {
                        this.locked = true;
                    }
                }, {
                    key: 'unlock',
                    value: function unlock() {
                        this.locked = false;
                    }
                }]);

                return Screen;
            }(THREEObject));

            _export('Screen', Screen);

            _export('screen', screen = new Screen());

            _export('screen', screen);

            screen.on('ready', function (evt) {
                evt.target.object3D.position.y = 1.9;
                evt.target.object3D.position.z = -4;
                evt.target.raycastable = true;
                scene.add(evt.target.object3D);
            });

            screen.on(EVENT_NAMES.CONTROLLER_HOVER, function (evt) {
                if (evt.target.animator.isPlaying('hoverout')) {
                    evt.target.animator.stop('hoverout', false);
                }
                evt.target.animator.start('hover');
            });

            screen.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
                if (evt.target.animator.isPlaying('hover')) {
                    evt.target.animator.stop('hover', false);
                }
                evt.target.animator.start('hoverout');
            });

            screen.on(EVENT_NAMES.CONTROLLER_KEY_UP, function (evt) {
                evt.target.next();
            });
        }
    };
});