import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import '../static/styles/main.css';
import vertex from './vertexParticles.glsl';
import fragment from './fragment.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './sketch.js';
import {connectServer} from './socket';
import './sound';
let container, stats;

let camera, scene, renderer;

let plane;

init();
animate();
//connectServer(prompt('Enter Server IP:'));

function init() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.z = 2;
    camera.position.set(0, -3, 0.3);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x000000 );
    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );
    // const helper = new THREE.CameraHelper( camera );
    // scene.add( helper );
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0,0,0), 0);
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    //adjustLighting();
    addObjects();
    //addExperimentalCube();
    window.addEventListener( 'resize', onWindowResize, false );
}

function adjustLighting() {
    let pointLight = new THREE.PointLight(0xdddddd)
    pointLight.position.set(-5, -3, 3)
    scene.add(pointLight)

    let ambientLight = new THREE.AmbientLight(0x505050)
    scene.add(ambientLight)
}

function addObjects() {

    let material = new THREE.ShaderMaterial({
      extensions:{
        derivatives: "#extension GL_OES_standard_derivatives: enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: "f", value: 0},
        resolution: {type: "v4", value: new THREE.Vector4()},
        uvRate1: {
          value: new THREE.Vector2(1,1)
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    let geometry = new THREE.BufferGeometry();
    let count = 1000;
    let position = new Float32Array(count * count * 3);

    for (let i=0; i<count; i++) {
        for (let j=0; j<count; j++) {
            //let u = 

            position.set([
                (i/count - 0.5)*20, 
                (j/count - 0.5)*20, 
                0
            ], 3*(i*count+j));
        }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    plane = new THREE.Points(geometry, material);

    scene.add(plane);
    //objects.push(point);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    const time = performance.now();

    //const object = scene.children[ 0 ];

    //object.rotation.y = time * 0.005;
    plane.material.uniforms.time.value = time;

    renderer.render( scene, camera );
    //console.log(camera.getWorldPosition());
}

export function changeBgColor(color) {
  //  console.log(document.body.style.backgroundColor);
    document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]} )`;
   // console.log(document.body.style.backgroundColor);
}

export function changeBgPos(pos) {
    //console.log(min(7,max(-7, pos[0])));
    camera.position.set(minmax(-7, 7, pos[0]), minmax(-4-3, 3-3, pos[1]-3), minmax(-0.7, 6.3, pos[2]+0.3));

}

function minmax(min, max, num) {
    return Math.min(max,Math.max(min, num))
}