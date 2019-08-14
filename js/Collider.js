var THREE = require('three');

const XZ = (new THREE.Vector3(1,0,1)).normalize();
const _XZ = (new THREE.Vector3(-1,0,1)).normalize();
const X_Z = (new THREE.Vector3(1,0,-1)).normalize();
const _X_Z = (new THREE.Vector3(-1,0,-1)).normalize();

const EDGE_EPSILON = 25;

class Collider {
  
  constructor (playerSize) {
    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, playerSize);
  }

  
  
  collide (player, wallMesh) {
    var intersections = [];
    this.raycaster.ray.origin.copy(player.body.position);
    
    this.raycaster.ray.direction.copy(XZ);
    intersections = intersections.concat(this.raycaster.intersectObject(wallMesh));
    this.raycaster.ray.direction.copy(X_Z);
    intersections = intersections.concat(this.raycaster.intersectObject(wallMesh));
    this.raycaster.ray.direction.copy(_XZ);
    intersections = intersections.concat(this.raycaster.intersectObject(wallMesh));
    this.raycaster.ray.direction.copy(_X_Z);
    intersections = intersections.concat(this.raycaster.intersectObject(wallMesh));
    
    
    console.log(intersections.length)
    
    if (intersections.length > 0) {
      if (intersections.length == 3) { // special cases (read: dumb hack)
        intersections.sort((x,y)=>x.distance > y.distance);
        intersections.slice(0,2).forEach((x)=> {
          if (x.face.normal.dot(player.velocity) < 0) {
            player.velocity.projectOnPlane(x.face.normal);
          }
        });
      } else if (intersections.length == 5) {
        intersections.sort((x,y)=>x.distance > y.distance);
        intersections.slice(0,3).forEach((x)=> {
          if (x.face.normal.dot(player.velocity) < 0) {
            player.velocity.projectOnPlane(x.face.normal);
          }
        });
      
      } else {
        intersections.forEach((x)=> {
          if (x.face.normal.dot(player.velocity) < 0) {
            player.velocity.projectOnPlane(x.face.normal);
          }
        });
      }
    
    }
  }
}

module.exports = Collider;


