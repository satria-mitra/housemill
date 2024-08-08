import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const LoadGLTFByPath = (scene, startingModelPath) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      startingModelPath,
      (gltf) => {
        scene.add(gltf.scene);
        resolve(gltf.scene); // Ensure this returns the GLTF scene
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

export const SetAmbientLighting = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 4); // Color: white, Intensity: 4
  scene.add(ambientLight);
};
