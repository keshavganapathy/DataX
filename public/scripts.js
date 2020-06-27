let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer({
	antialias: true,
	//alpha: false
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

controls = new THREE.OrbitControls(camera, renderer.domElement)

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
scene.add( cube );


let edges = new THREE.EdgesGeometry( geometry );
let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );


scene.add(line);

camera.position.z = 5;

let animate = function () {
	requestAnimationFrame( animate );

	renderer.render(scene, camera);
};

animate();

function renderData(data, mapping, options) {
	scene = new THREE.Scene();
	for (const item of data) {
		let mappedData = {};
		for (const key in mapping) {
			mappedData[key] = item[mapping[key]]
		}
	}
	switch (options.type) {
		case "Rectangular Prisms":
			rectFromData(mappedData, options)
			break;
		case "Spheres":
			rectFromData(mappedData, options)
			break;
	}

}

function rectFromData(data, options) {
	let [x, y, z, width, height, depth, color] = [0, 0, 0, 10, 10, 10, 0xFFFFFF];
	{x, y, z, width, height, depth, color} = data;

	let geometry = new THREE.BoxGeometry(width, height, depth);
	let material = new THREE.MeshBasicMaterial({ color });
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(x, y, z);
	scene.add(cube);

	let edges = new THREE.EdgesGeometry(geometry);
	let lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: options.edgeColor || 0x000000 }));
	lines.position.set(x, y, z);
	scene.add(lines)
	
}

function state() {
	
}