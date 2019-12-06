var THREE = require('three');

module.exports = {
    PLAYER_HEIGHT: 10,
    PLAYER_SIZE: 5,
    PLAYER_MASS: 100,//0.00005,
    PLAYER_WALKING_SPEED: 70,//0.0005,
    PLAYER_RUNNING_SPEED: 200,
    PLAYER_JUMP: 100,//0.1,
    VELOCITY_DAMP: 2.5,//0.01,
    GRAVITY: 9.8,
    CELL_SIZE: 12,
    UPDATE_DELTA: 100.0,
    MAZE_SIZE: 55,
    DEFAULT_WEIGHT: 1.0, //default weight for animation action in animationData
    DURATION_THRESHOLD: 4, //duration of animation for determining synchronizeCrossFade or executeCrossFade
    Y: new THREE.Vector3(0,1,0),

    pair: (a, b) => {
        /* http://szudzik.com/ElegantPairing.pdf */
        var A = a >= 0 ? 2 * a : -2 * a - 1;
        var B = b >= 0 ? 2 * b : -2 * b - 1;
        return A >= B ? A * A + A + B : A + B * B;
    },

    getRandomColor: () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    inRange: (c) => {
      return [{x: c.x-1, z: c.z-1},
              {x: c.x-1, z: c.z},
              {x: c.x-1, z: c.z+1},
              {x: c.x, z: c.z-1},
              {x: c.x, z: c.z},
              {x: c.x, z: c.z+1},
              {x: c.x+1, z: c.z-1},
              {x: c.x+1, z: c.z},
              {x: c.x+1, z: c.z+1}];
    }
}

//
// let animationData = {
//     TPose: {
//         action: mixer.clipAction(animations[0]),
//         weight: 1.0,
//         duration: animations[0].duration,
//     },
//     Idle: {
//         action: mixer.clipAction(animations[1]),
//         weight: 1.0,
//         duration: animations[1].duration,
//     },
//     Jump: {
//         action: mixer.clipAction(animations[2]),
//         weight: 1.0,
//         duration: animations[2].duration,
//     },
//     LeftStrafeWalk: {
//         action: mixer.clipAction(animations[3]),
//         weight: 1.0,
//         duration: animations[3].duration,
//     },
//     LeftTurn: {
//         action: mixer.clipAction(animations[4]),
//         weight: 1.0,
//         duration: animations[4].duration,
//     },
//     RightStrafeWalk: {
//         action: mixer.clipAction(animations[5]),
//         weight: 1.0,
//         duration: animations[5].duration,
//     },
//     RightTurn: {
//         action: mixer.clipAction(animations[6]),
//         weight: 1.0,
//         duration: animations[6].duration,
//     },
//     Run: {
//         action: mixer.clipAction(animations[7]),
//         weight: 1.0,
//         duration: animations[7].duration,
//     },
//     CrouchIdle: {
//         action: mixer.clipAction(animations[8]),
//         weight: 1.0,
//         duration: animations[8].duration,
//     },
//     CrouchWalk: {
//         action: mixer.clipAction(animations[9]),
//         weight: 1.0,
//         duration: animations[9].duration,
//     },
//     Slide: {
//         action: mixer.clipAction(animations[10]),
//         weight: 1.0,
//         duration: animations[10].duration,
//     },
//     Death: {
//         action: mixer.clipAction(animations[11]),
//         weight: 1.0,
//         duration: animations[11].duration,
//     },
//     FallIdle: {
//         action: mixer.clipAction(animations[12]),
//         weight: 1.0,
//         duration: animations[12].duration,
//     },
//     Walk: {
//         action: mixer.clipAction(animations[13]),
//         weight: 1.0,
//         duration: animations[13].duration,
//     }
// }

// /* http://szudzik.com/ElegantPairing.pdf */
// exports.pair = function pair (a, b) {
//   var A = a >= 0 ? 2 * a : -2 * a - 1;
//   var B = b >= 0 ? 2 * b : -2 * b - 1;
//   return A >= B ? A * A + A + B : A + B * B;
// }
//
//
// exports.getRandomColor = function getRandomColor() {
// var letters = '0123456789ABCDEF';
// var color = '#';
// for (var i = 0; i < 6; i++) {
// color += letters[Math.floor(Math.random() * 16)];
// }
// return color;
// }


// this.TPoseAnim = this.mixer.clipAction(animations[0]);
// this.IdleAnim = this.mixer.clipAction(animations[1]);
// this.JumpAnim = this.mixer.clipAction(animations[2]);
// this.LeftStrafeWalkAnim = this.mixer.clipAction(animations[3]);
// this.LeftTurnAnim = this.mixer.clipAction(animations[4]);
// this.RightStrafeWalkAnim = this.mixer.clipAction(animations[5]);
// this.RightTurnAnim = this.mixer.clipAction(animations[6]);
// this.RunAnim = this.mixer.clipAction(animations[7]);
// this.CrouchIdleAnim = this.mixer.clipAction(animations[8]);
// this.CrouchWalkAnim = this.mixer.clipAction(animations[9]);
// this.SlideAnim = this.mixer.clipAction(animations[10]);
// this.DeathAnim = this.mixer.clipAction(animations[11]);
// this.FallIdleAnim = this.mixer.clipAction(animations[12]);
// this.WalkAnim = this.mixer.clipAction(animations[13]);

// this.animations = [this.TPoseAnim, this.IdleAnim, this.JumpAnim,
//                    this.LeftStrafeWalkAnim, this.LeftTurnAnim,
//                    this.RightStrafeWalkAnim, this.RightTurnAnim,
//                    this.RunAnim, this.CrouchIdleAnim,
//                    this.CrouchWalkAnim, this.SlideAnim, this.DeathAnim,
//                    this.FallIdleAnim, this.WalkAnim];
