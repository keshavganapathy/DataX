
let scene = new THREE.Scene();
//scene.frustumCulled = false;
//let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let frustumSize = 500;
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000000000, 1000000000 );

let renderer = new THREE.WebGLRenderer({
	antialias: true,
	//alpha: false
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//let controls = new THREE.OrbitControls(camera, renderer.domElement);
let controls = new FlyControls(camera, renderer.domElement);

controls.movementSpeed = 1;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / (24*4);
controls.dragToLook = true;

let geometry = new THREE.BoxGeometry( 20, 20, 20 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
scene.add( cube );


let edges = new THREE.EdgesGeometry( geometry );
let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );

scene.add(line);

function axes() {
	
	let origin = new THREE.Vector3( 0, 0, 0 );

	scene.add(new THREE.Line( new THREE.BufferGeometry().setFromPoints( [origin, new THREE.Vector3(1000000, 0, 0)] ), new THREE.LineBasicMaterial({
		color: 0xffffff
	})));
	scene.add(new THREE.Line( new THREE.BufferGeometry().setFromPoints( [origin, new THREE.Vector3(0, 1000000, 0)] ), new THREE.LineBasicMaterial({
		color: 0xffffff
	})));
	scene.add(new THREE.Line( new THREE.BufferGeometry().setFromPoints( [origin, new THREE.Vector3(0, 0, 1000000)] ), new THREE.LineBasicMaterial({
		color: 0xffffff
	})));

}

axes()



camera.position.set(100, 100, 100); // Set position like this
camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

let animate = function () {
	requestAnimationFrame( animate );

	resizeRendererToDisplaySize(renderer)

	controls.update( 1 );
	renderer.render(scene, camera);
};

animate();

function resizeRendererToDisplaySize(renderer) { // credit https://threejsfundamentals.org/
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width  = canvas.clientWidth  * pixelRatio | 0;
	const height = canvas.clientHeight * pixelRatio | 0;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	return needResize;
}


function newScene() {
	recursiveDispose(scene);
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x333333 );
	let backgroundColor = {Background: "#000000"};
	var axesHelper = new THREE.AxesHelper( 100000 );
	scene.add( axesHelper );
}

function renderData(data, mapping, restrictions, options = {type: "Rectangular Prisms"}) {
	outer: for (const item of data) {
		for (const key in restrictions) { // like {1: 'July'} says the column 1 (0 indexed) must be July
			if (item[key] != restrictions[key]) {
				continue outer;
			}
		}
		let mappedData = {};
		for (const key in mapping) { // properties to column indices like [{radius: 0}, {height: 1}]
			if (Array.isArray(mapping[key])) { // if the mapping is an array (like: [function(a){return a/2}, 1])
				mappedData[key] = mapping[key][0](item[mapping[key][1]]);
			} else {
				mappedData[key] = item[mapping[key]];
			}
		}
		switch (options.type) {
			case "Rectangular Prisms":
				console.log(mappedData);
				if (isZeroOrTruthy(mappedData.x) && isZeroOrTruthy(mappedData.y) && isZeroOrTruthy(mappedData.z) && isZeroOrTruthy(mappedData.width) && isZeroOrTruthy(mappedData.height) && isZeroOrTruthy(mappedData.depth) && isZeroOrTruthy(mappedData.color)) {
					rectFromData(mappedData, options);
				}
				break;
			case "Spheres":
				if (isZeroOrTruthy(mappedData.x) && isZeroOrTruthy(mappedData.y) && isZeroOrTruthy(mappedData.z) && isZeroOrTruthy(mappedData.radius) && isZeroOrTruthy(mappedData.color)) {
					sphereFromData(mappedData, options);
				}
				break;
		}
	}

}

function isZeroOrTruthy(val) {
	return val || val === 0;
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

	let geometry = new THREE.BoxBufferGeometry(width, height, depth);
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
	radius = radius || 10;
	color = color || 0xFFFFFF;

	let geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
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
let allControlFolders = [];
let state = {x:0, y:0, z:0, width: 10, height: 10, depth: 10, color: 0xFFFFFF};
let data = [];
let gui = new dat.GUI();

function add(...rest) {
	let result = gui.add(...rest)
	allControls.push(result);
	return result;
}

function addFolder(...rest) {
	let result = gui.addFolder(...rest)
	allControlFolders.push(result);
	return result;
}

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

//genGui({'country': 0, 'population': 1, 'infected': 2, 'deaths': 3});

function disposeUI() {
	while (allControls.length>0) {
		gui.remove(allControls.shift());
	}
	while (allControlFolders.length>0) {
		gui.removeFolder(allControlFolders.shift());
	}
}

gui.add({ renderVisualizations }, 'renderVisualizations').name("Render");
gui.add({ showPopUp }, 'showPopUp').name("New Data");

scene.background = new THREE.Color( 0x333333 );
let backgroundColor = {Background: "#000000"};
gui.addColor({Background: "#000000"}, 'Background').onChange(color => {scene.background.set(color)});

newGui();

function newGui() {
	disposeUI();

	const create = addFolder('New Visualization');
	const createObj = {
		type: "Rectangular Prisms",
		createFunction
	};

	function createFunction() {
		newSubGui(createObj.type);
	}

	create.add(createObj, 'type', ["Rectangular Prisms", "Spheres"]).name("Type");
	create.add(createObj, 'createFunction').name("Click to Create");
	create.open();

}

let visualizations = [];
let rectVisNum = 0;
let sphereVisNum = 0;

function newSubGui(type) {
	let state = { type };
	visualizations.push(state);
	let folder;
	switch (type) {
		case "Rectangular Prisms":
			//let state = {x: {}, y: {}, z: {}, length: {}, width: {}, depth: {}, color: {}, remove};

			folder = addFolder("Rectangular Prism Visualization #"+(rectVisNum++));
			['x', 'y', 'z', 'width', 'height', 'depth', 'color'].forEach(a => {newSubGuiFolder(folder, state, a)})
			break;
		case "Spheres":
			//let state = {x: {}, y: {}, z: {}, radius: {}, remove};
			folder = addFolder("Sphere Visualization #"+(sphereVisNum++));
			['x', 'y', 'z', 'radius', 'color'].forEach(a => {newSubGuiFolder(folder, state, a)})
			break;
	}
	const removeState = { remove };
	folder.add(removeState, 'remove').name('Remove');
	function remove() {
		allControlFolders.splice(allControlFolders.indexOf(folder), 1);
		gui.removeFolder(folder);
		visualizations.splice(visualizations.indexOf(state), 1);
	}
}

function newSubGuiFolder(topFolder, stateAll, name) {
	stateAll[name] = {type: 'value', value: 0, /*constraint: 0,*/ column: 0}
	const state = stateAll[name];
	let folder = topFolder.addFolder(name.charAt(0).toUpperCase() + name.slice(1))
	//folder.open();
	folder.add(state, 'type', {'Column': 'column', 'Fixed Value': 'value'/*, 'Constraint': 'constraint'*/}).onFinishChange(switchActive);
	let activeElement = folder.add(state, 'value').name("Value");
	
	function switchActive() {
		folder.remove(activeElement);
		switch (state.type) {
			case 'value':
				activeElement = folder.add(state, 'value').name("Value");
				break;
			case 'column':
				activeElement = folder.add(state, 'column', getColumnNameObj()).name("Column");
				break;
			/*case 'constraint':
				activeElement = folder.add(state, 'constraint').name("Constraint");
				break;*/
		}
	}

}

function getColumnNameObj() {
	return Object.fromEntries(columnNames.map((a,b)=>([a, b])));
}

let restrictions = {};

function renderVisualizations() {
	newScene();
	for (const vis of visualizations) {
		let mapping = {};
		for (const key in vis) {
			const item = vis[key];
			if (key != 'type') {
				switch (item.type) {
					case 'column':
						mapping[key] = item.column;
						break;
					case 'value':
						mapping[key] = [() => (item.value)];
						break;
					/*case 'constraint':
						activeElement = folder.add(state, 'constraint').name("Constraint");
						break;*/
				}
			}
		}
		renderData(data, mapping, restrictions, {type: vis.type});
	}
	//axes();
}



async function recursiveDispose(obj) {
	if (obj.children) {
		for (const child of obj.children) {
			recursiveDispose(child);
		}
	}
	if (obj.material) {
		recursiveDispose(obj.material);
	}
	if (obj.material) {
		recursiveDispose(obj.material);
	}
	if (obj.dispose) {
		obj.dispose();
	}
}