import * as THREE from 'three'
import { WEBGL } from './webgl'
//import './modal'
import '../static/styles/main.css';
import square from '../static/textures/square.png';
import vertex from './vertexParticles.glsl';
import fragment from './fragment.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


if (WEBGL.isWebGLAvailable()) {
  var camera, scene, renderer
  var plane
  var mouse,
    raycaster,
    isShiftDown = false

  var rollOverMesh, rollOverMaterial
  var cubeGeo, cubeMaterial

  var objects = []

  init()
  render()

  function init() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(500, 800, 1300)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // roll-over helpers
    // var rollOverGeo = new THREE.BoxBufferGeometry(50, 50, 50)
    // rollOverMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   opacity: 0.5,
    //   transparent: true,
    // })
    // rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
    // scene.add(rollOverMesh)

    // cubes
    // cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50)
    // cubeMaterial = new THREE.MeshLambertMaterial({
    //   color: 0xfeb74c,
    //   map: new THREE.TextureLoader().load(square),
    // })

    // grid
    // var gridHelper = new THREE.GridHelper(1000, 20)
    // scene.add(gridHelper)

    //

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    var geometry = new THREE.PlaneBufferGeometry(1000, 1000)
    geometry.rotateX(-Math.PI / 2)

    plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ visible: true })
    )
    scene.add(plane)

    // objects.push(plane)
    addObjects();
    // lights

    var ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)

    var directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 0.75, 0.5).normalize()
    scene.add(directionalLight)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    

    // document.addEventListener('mousemove', onDocumentMouseMove, false)
    // document.addEventListener('mousedown', onDocumentMouseDown, false)
    // document.addEventListener('keydown', onDocumentKeyDown, false)
    // document.addEventListener('keyup', onDocumentKeyUp, false)
    //
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true

    document.body.appendChild(renderer.domElement)
    window.addEventListener('resize', onWindowResize, false)
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
      fragmentShader: fragment
    });

    let geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    let point = new THREE.Points(geometry, material);

    scene.add(point);
    objects.push(point);

  }


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(objects)

    if (intersects.length > 0) {
      var intersect = intersects[0]

      rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
      rollOverMesh.position
        .divideScalar(50)
        .floor()
        .multiplyScalar(50)
        .addScalar(25)
    }

    render()
  }

  function onDocumentMouseDown(event) {
    event.preventDefault()

    mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(objects)

    if (intersects.length > 0) {
      var intersect = intersects[0]

      // delete cube

      if (isShiftDown) {
        if (intersect.object !== plane) {
          scene.remove(intersect.object)

          objects.splice(objects.indexOf(intersect.object), 1)
        }

        // create cube
      } else {
        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial)
        voxel.position.copy(intersect.point).add(intersect.face.normal)
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
        scene.add(voxel)

        objects.push(voxel)
      }

      render()
    }
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = true
        break
    }
  }

  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = false
        break
    }
  }

  function render() {
    renderer.render(scene, camera)
  }
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
