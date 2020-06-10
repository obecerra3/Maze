// Configure Require.js
var require = {
    // Default load path for js files
    baseUrl: "js/maze",
    shim: {
        "threeCore": { exports: "THREE" },
        "detector": { exports: "Detector" },
        "stats": { exports: "Stats" }
    },
    paths: {
        //libraries
        ammo: "../lib/ammo",
        ammoDebugDrawer: "../lib/AmmoDebugDrawer",
        detector: "../lib/Detector",
        dracoLoader: "../lib/draco/DRACOLoader",
        gltfLoader: "../lib/GLTFLoader",
        pointerLockControls: "../lib/PointerLockControls",
        stats: "../lib/stats.min",
        text: "../lib/text",
        three: "../lib/three",
        threeCore: "../lib/three.min",

        //this is how we access the shaders we write
        shader: "../lib/shader",
        shaders: "../shaders",

        //game code
        animator: "./utils/Animator",
        collider: "./physics/Collider",
        debug: "./utils/Debug",
        game: "./multiplayer/Game",
        infoManager: "./multiplayer/InfoManager",

        mazeEngine: "./world/MazeEngine",
        messageBuilder: "./multiplayer/MessageBuilder",
        multiplayer: "./multiplayer/Multiplayer",
        observerUtils: "./utils/observerUtils",
        onlinePlayer: "./multiplayer/OnlinePlayer",
        physics: "./physics/Physics",
        ray: "./physics/Ray",
        states: "./utils/States",
        utils: "./utils/Utils",
        world: "./world/World",
    }
};
