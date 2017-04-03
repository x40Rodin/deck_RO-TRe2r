'use strict';

System.register(['./room.js', './screen.js', './space.js', './floor.js', './sky.js'], function (_export, _context) {
   "use strict";

   var room, screen, space, floor, sky, env;


   function enterDarkMode() {
      if (env.mode === 'dark') return;
      room.object3D.parent.remove(room.object3D);
      sky.object3D.parent.remove(sky.object3D);
      screen.unlock();
      space.show();
      floor.animate();
      env.mode = 'dark';
   }

   return {
      setters: [function (_roomJs) {
         room = _roomJs.room;
      }, function (_screenJs) {
         screen = _screenJs.screen;
      }, function (_spaceJs) {
         space = _spaceJs.space;
      }, function (_floorJs) {
         floor = _floorJs.floor;
      }, function (_skyJs) {
         sky = _skyJs.sky;
      }],
      execute: function () {
         _export('env', env = {
            mode: 'light',
            enterDarkMode: enterDarkMode
         });

         _export('env', env);
      }
   };
});