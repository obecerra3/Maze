var THREE = require('three');
var Utils = require('./Utils.js');
var Player = require('./Player.js');
var Game = require('./Game.js');
var MazeBuilder = require('./MazeBuilder.js');
var Collider = require('./Collider.js');
var MessageBuilder = require('./MessageBuilder.js');
var InfoManager = require('./InfoManager.js');
var Stats = require('stats.js');
var PointerLockControls = require('pointerlockcontrols');


const PLAYER_HEIGHT = 10;
const PLAYER_SIZE = 5;
const PLAYER_MASS = 0.00005;
const PLAYER_SPEED = 0.0005;
const PLAYER_JUMP = 0.1;
const GRAVITY = 9.8;
const CELL_SIZE = 12;
const UPDATE_DELTA = 75.0;
const MAZE_SIZE = 55;
const NUM_HUNTERS = 3;

const Y = new THREE.Vector3(0,1,0);

var camera, scene, renderer, controls, mazeMesh, gameinfo;

var otherPlayers = {};

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevUpdateTime = -UPDATE_DELTA;
var prevPosition = new THREE.Vector3();
var prevLookDirection = new THREE.Vector3();
var prevTime = performance.now();
var moveDirection = new THREE.Vector3();

var mazeBuilder = new MazeBuilder();
var messageBuilder = new MessageBuilder();
var collider = new Collider(PLAYER_SIZE);
var infoManager = new InfoManager();

var myPlayer = new Player (username, new THREE.Vector3(0,PLAYER_HEIGHT,0), false);

var flashLight, floor;

console.log(myPlayer.username); 

var socket = new WebSocket("wss://themaze.io:8000");

socket.onopen = () => { socket.send(messageBuilder.hello(username)); }
socket.onmessage = (event) => { 
  receive(event.data);
}

var stats = new Stats();

init();
animate();

function init() {
  
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
  
  infoManager.addPlayerInfo(myPlayer, false);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.y = PLAYER_HEIGHT;
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xd9edfa );
  scene.fog = new THREE.Fog( 0xd3d3d3, 0, 750 );
  
  var axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

//  var light = new THREE.AmbientLight( 0x404040 );
//  scene.add( light );
  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

  controls = new PointerLockControls( camera );

  var blocker = document.getElementById( 'blocker' );

  blocker.addEventListener( 'click', function () {
    controls.lock();
  }, false );

  controls.addEventListener( 'lock', function () {
    blocker.style.display = 'none';
  } );

  controls.addEventListener( 'unlock', function () {
    blocker.style.display = 'block';
  } );

  scene.add(controls.getObject());

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  var floorGeometry = new THREE.PlaneBufferGeometry(1000,1000);
  floorGeometry.rotateX(-Math.PI/2);
  var floorMaterial = new THREE.MeshPhongMaterial( { vertexColors: THREE.NoColors } );
  floorMaterial.color = new THREE.Color(0x81a68c);

  floor = new THREE.Mesh( floorGeometry, floorMaterial );
  scene.add(floor);
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.gammaInput = true;
  renderer.gammaOutput = true;


  document.body.appendChild( renderer.domElement );
  
  flashLight = new THREE.SpotLight( 0xffffff, 1, 300, 0.5, 0.1, 10.0 );
  flashLight.castShadow = true;
  scene.add( flashLight );
  flashLight.visible = true;

  
  scene.add(myPlayer.body);
  

  window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onKeyDown( event ) {
    if (controls.isLocked) {
      switch ( event.keyCode ) {
        case 70:
          flashLight.visible = !flashLight.visible;
          break;
        case 16:
          myPlayer.isCrouched = true;
          if (myPlayer.body.position.y > PLAYER_HEIGHT) myPlayer.velocity.y -= PLAYER_JUMP;
          break;
        case 38: // up
        case 87: // w
          moveForward = true;
          break;
        case 37: // left
        case 65: // a
          moveLeft = true;
          break;
        case 40: // down
        case 83: // s
          moveBackward = true;
          break;
        case 39: // right
        case 68: // d
          moveRight = true;
          break;
        case 32: // space 
          if ( canJump === true ) {
            myPlayer.velocity.y += PLAYER_JUMP;
            //canJump = false;
            socket.send(messageBuilder.jump());
          } 
          break;
      }
    }
}

function onKeyUp ( event ) {
    if (controls.isLocked) {
      switch ( event.keyCode ) {
        case 16:
          myPlayer.isCrouched = false;
        case 38: // up
        case 87: // w
          moveForward = false;
          break;
        case 37: // left
        case 65: // a
          moveLeft = false;
          break;
        case 40: // down
        case 83: // s
          moveBackward = false;
          break;
        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }
    }
}


function animate() {

  requestAnimationFrame(animate);
  stats.begin();
  var time = performance.now();
  var delta = (time - prevTime);
  
  myPlayer.update(delta, moveDirection, moveForward, moveBackward, moveLeft, moveRight, Y, PLAYER_SPEED, controls);
  
  if (mazeMesh != undefined) { collider.collide(myPlayer, mazeMesh); }
  
  myPlayer.move(delta);
  
  camera.position.x = myPlayer.body.position.x;
  camera.position.z = myPlayer.body.position.z;
  
  flashLight.position.copy(camera.position);
  
  flashLight.position.y -= 1;
  flashLight.position.x += myPlayer.lookDirection.x*3.0;
  flashLight.position.z += myPlayer.lookDirection.z*3.0;
  
  flashLight.target.position.set(flashLight.position.x + myPlayer.lookDirection.x,
                                 flashLight.position.y + myPlayer.lookDirection.y,
                                 flashLight.position.z + myPlayer.lookDirection.z);
  
  flashLight.target.updateMatrixWorld();
  
  
  if (myPlayer.isCrouched) {
    camera.position.y -= Math.min(0.75, camera.position.y-PLAYER_HEIGHT/2);
  } else {
    camera.position.y += Math.min(0.75, PLAYER_HEIGHT-camera.position.y);
  }
  
  
  if (myPlayer.body.position.y <= PLAYER_HEIGHT) {
    if (!myPlayer.isCrouched) {
      canJump = true;
    }
    myPlayer.velocity.y = 0;
  } else { 
//    myPlayer.velocity.y -= GRAVITY*PLAYER_MASS*delta;
    camera.position.y = myPlayer.body.position.y;
  }
  
  if (time - prevUpdateTime >= UPDATE_DELTA && socket.readyState == WebSocket.OPEN && controls.isLocked) {
    socket.send(messageBuilder.state(myPlayer));
    prevUpdateTime = time;
  }
  
  Object.values(otherPlayers).forEach((p) => {
    p.body.position.x += p.velocity.x*delta;
    p.body.position.z += p.velocity.z*delta;
    p.body.position.y += p.velocity.y*delta;
  
    if (p.isCrouched) {
      p.body.scale.y = 0.5;
    } else {
      p.body.scale.y = 1.0;
    }
    
    if (p.body.position.y <= PLAYER_HEIGHT) {
      p.velocity.y = 0;
      p.body.position.y = PLAYER_HEIGHT;
    } else {
      p.velocity.y -= GRAVITY * PLAYER_MASS * delta;
    }
  });
  prevTime = time;
  renderer.render( scene, camera );
  stats.end();
}


function processMaze (buffer) {
  var byteArray = new Uint8Array(buffer);
  var mazeArray = byteArray.reduce((array, curr, idx) => {
    var i;
    for (i = 0; i < 8; i++) {
      var type = curr >> (7-i) & 1;
      var overall = idx * 8 + i;
      if ((overall % MAZE_SIZE) == 0) {
        array.push([type]);
      } else {
        array[Math.floor(overall / MAZE_SIZE)].push(type);
      }
    }
    return array;
  }, []);
  mazeMesh = mazeBuilder.build(mazeArray, MAZE_SIZE, CELL_SIZE);
  scene.add(mazeMesh);
}

function processAction (buffer, code) {
  var dataView = new DataView(buffer);
  var id = dataView.getUint8(0);
  var player = otherPlayers[id];
  if (player != undefined) {
    switch (code) {
      case 3:
        player.velocity.y += PLAYER_JUMP;
        break;
      default:
        console.log("unrecognized action"); 
    }
  }
}

function processPlayerState (buffer) {
  var dataView = new DataView(buffer);
  var id = dataView.getUint8(0);
  var isCrouched = dataView.getUint8(1);
  var positionX = dataView.getFloat32(2);
  var positionZ = dataView.getFloat32(6);
  var lookDirectionX = dataView.getFloat32(10);
  var lookDirectionY = dataView.getFloat32(14);
  var lookDirectionZ = dataView.getFloat32(18);
  var player = otherPlayers[id];
  var yVelocity = player.velocity.y;
  var newVelocity = new THREE.Vector3(positionX-player.body.position.x, 0, positionZ-player.body.position.z).divideScalar(UPDATE_DELTA);
  player.velocity.copy(newVelocity);
  player.velocity.y = yVelocity;
  player.lookDirection.x = lookDirectionX;
  player.lookDirection.y = lookDirectionY;
  player.lookDirection.z = lookDirectionZ;
  player.isCrouched = isCrouched; 
}

function processIntroduction (buffer) {
  var dataView = new DataView(buffer);
  var id = dataView.getUint8(0);
  var isHunted = dataView.getUint8(1) != 0;
  var decoder = new TextDecoder("utf-8");
  var username = decoder.decode(buffer.slice(2));
  var player = new Player (username, new THREE.Vector3(), isHunted);
  otherPlayers[id] = player;
  infoManager.addPlayerInfo(player, false);
  if (Object.keys(otherPlayers).length == NUM_HUNTERS) {
    infoManager.showPlayerClass(myPlayer, otherPlayers);
  }
  scene.add(player.body);
}

function processLeft (buffer) {
  var dataView = new DataView(buffer);
  var id = dataView.getUint8(0);
  scene.remove(otherPlayers[id].body);
  delete otherPlayers[id];
  infoManager.playerLeft(myPlayer, Object.values(otherPlayers));
}

async function receive (blob) {
  var arrayBuffer = await new Response(blob).arrayBuffer();
  var dataView = new DataView(arrayBuffer);
  switch (dataView.getUint8(0)) {
    case 0:
      processIntroduction(arrayBuffer.slice(1));
      break;
    case 1:
      processMaze(arrayBuffer.slice(1));
      break;
    case 2:
      processPlayerState(arrayBuffer.slice(1));
      break;
    case 3:
      processAction(arrayBuffer.slice(1), 3);
      break;
    case 4:
      processLeft(arrayBuffer.slice(1));
      break;
  }
}



