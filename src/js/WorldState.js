
class WorldState {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        this.mazeMesh = null;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1f1e33);
        this.scene.fog = new THREE.Fog(0xa3a3a3, 0, 1000);

        var axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);

        var light = new THREE.AmbientLight(0x404040);
        this.scene.add(light);

        this.otherPlayers = {};

        this.prevUpdateTime = -Utils.UPDATE_DELTA;
        this.prevTime = performance.now();

        var floorGeometry = new THREE.PlaneBufferGeometry(5000, 5000);
        floorGeometry.rotateX(-Math.PI/2);
        let floorMaterial = new THREE.MeshPhongMaterial( { vertexColors: THREE.NoColors } );
        floorMaterial.color = new THREE.Color(0x81a68c);

        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.scene.add(this.floor);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // this.renderer.gammaInput = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaFactor = 2.2;
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }
}

module.exports = WorldState;
