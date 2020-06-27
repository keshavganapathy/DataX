
let scene = new THREE.Scene();
//scene.frustumCulled = false;
//let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let frustumSize = 100;
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

let renderer = new THREE.WebGLRenderer({
	antialias: true,
	//alpha: false
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let controls = new THREE.OrbitControls(camera, renderer.domElement);
//let controls = new FlyControls(camera, renderer.domElement);

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

function renderData(data, mapping, restrictions, options = {type: "Rectangular Prisms"}) {
	scene = new THREE.Scene();
	outer: for (const item of data) {
		for (const key in restrictions) { // like {1: 'July'} says the column 1 (0 indexed) must be July
			if (item[key] != restrictions[key]) {
				continue outer;
			}
		}
		let mappedData = {};
		for (const key in mapping) { // properties to column indices like [{radius: 0}, {height: 1}]
			if (Array.isArray(mapping[key])) { // if the mapping is an array (like: [1, function(a){return a/2}])
				mappedData[key] = mapping[key][1](item[mapping[key][0]]);
			} else {
				mappedData[key] = item[mapping[key]];
			}
		}
		switch (options.type) {
			case "Rectangular Prisms":
				console.log(mappedData);
				rectFromData(mappedData, options);
				break;
			case "Spheres":
				sphereFromData(mappedData, options);
				break;
		}
	}

}

function rectFromData(data, options) {
	let {x, y, z, width, height, depth, color} = data;
	x = x || 0;
	y = y || 0;
	z = z || 0;
	width = width || 10;
	height = height || 10;
	depth = depth || 10;
	color = color || 0xFFFFFF;

	console.log({x, y, z, width, height, depth, color});

	let geometry = new THREE.BoxGeometry(width, height, depth);
	let material = new THREE.MeshBasicMaterial({ color });
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(x, y, z);
	scene.add(cube);

	let edges = new THREE.EdgesGeometry(geometry);
	let lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: options.edgeColor || 0x000000 }));
	lines.position.set(x, y, z);
	scene.add(lines);

}

function sphereFromData(data, options) {
	let {x, y, z, radius, color} = data;
	x = x || 0;
	y = y || 0;
	z = z || 0;
	radius = width || 10;
	color = color || 0xFFFFFF;

	let geometry = new THREE.SphereGeometry(width, height, depth);
	let material = new THREE.MeshBasicMaterial({ color });
	let sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(x, y, z);
	scene.add(sphere);

	//let edges = new THREE.EdgesGeometry(geometry);
	//let lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: options.edgeColor || 0x000000 }));
	//lines.position.set(x, y, z);
	//scene.add(lines);
	
}

let allControls = [];
let state = {x:0, y:0, z:0, width: 10, height: 10, depth: 10, color: 0xFFFFFF};
let data = [];
let gui = new dat.GUI();

function genGui(columnNames) {
	for (const prop of ['x', 'y', 'z', 'width', 'height', 'depth', 'color']) {
		gui.add(state, prop, columnNames);
	}
	

	state = {render: ()=>{
		let mappings = {};
		for (const key in state) {
			mappings[key] = columnNames.indexOf(state[key]);
		}
		renderData(data,{x:0,y:1,color:2},[]);

	}}
	/*
	for (let i = 0; i < columnNames.length; i++) {
		state[i] = {}
		const folder = gui.addFolder(name);
		folder.add(state[i], 'Axis', ['x', 'y', 'z', 'width', 'height', 'depth']);
	}*/
	gui.add(state, 'render');
}

genGui(['country', 'population', 'infected', 'deaths'])
