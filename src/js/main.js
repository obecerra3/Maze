//start the maze, detector will detect if the client's computer supports webgl
require( ['detector', 'maze', 'container'],
(Detector, maze, container) =>
{
    if (!Detector.webgl)
    {
        Detector.addGetWebGLMessage();
        container.innerHTML = "";
    }
    console.log("Main init");
    maze.init();
    maze.update();
});
