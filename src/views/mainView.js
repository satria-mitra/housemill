import * as THREE from 'three';
import { LoadGLTFByPath, SetAmbientLighting } from '../helpers/ModelHelper.js';
import { setupRenderer } from '../helpers/RendererHelper.js';
import { setBackground } from '../helpers/SkyboxHelper.js';
import { getFirstCameraInScene, updateCameraAspect } from '../helpers/CameraHelper.js';
import { ReplacePlanesWithWater, animateWater } from '../helpers/WaterHelper.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const startingModelPathFBX = './src/models/housemill.fbx';
const startingModelPath = './src/models/housemill_2019.gltf';

export async function setupScene(canvas) {
  const waterPlaneWidth = 30; 
  const waterPlaneLength = 30; 
  const waterPlanePosition = new THREE.Vector3(-1, 2, 0);

  const scene = new THREE.Scene();
  const renderer = setupRenderer();

  // Enable WebXR in the renderer
  renderer.xr.enabled = true;

  // Add VR Button if WebXR is supported
  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      if (supported) {
        document.body.appendChild(VRButton.createButton(renderer));
      } else {
        console.error('WebXR immersive-vr not supported');
        alert('WebXR immersive-vr not supported on this browser.');
      }
    });
  } else {
    console.error('WebXR not supported');
    alert('WebXR not supported on this browser.');
    return;
  }

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5); 
  scene.add(camera);

  await LoadGLTFByPath(scene, startingModelPath)
    .then((gltfScene) => {
      if (gltfScene) {
        console.log('GLTF Scene:', gltfScene);
        if (gltfScene.scale) {
          gltfScene.scale.set(3, 3, 3);
        } else {
          console.error('GLTF scene does not have a scale property');
        }
      } else {
        console.error('GLTF scene is undefined');
      }
      updateCameraAspect(camera);
    })
    .catch((error) => {
      console.error('Error loading JSON scene:', error);
    });

  SetAmbientLighting(scene);
  setBackground(scene);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 

  let waterList;
  waterList = await ReplacePlanesWithWater(scene, waterPlaneWidth, waterPlaneLength, waterPlanePosition);

  function animate() {
    renderer.setAnimationLoop(() => {
      if (waterList !== undefined && waterList.length > 0) {
        waterList.forEach(water => {
          animateWater(water);
        });
      }
      controls.update();
      renderer.render(scene, camera);
    });
  }

  animate();
}

// Initialize the scene
const canvas = document.querySelector('#background');
setupScene(canvas);
