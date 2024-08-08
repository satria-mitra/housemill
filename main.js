import { setupScene } from './src/views/mainView.js';

if (import.meta.env.MODE === 'development') {
  import('webxr-polyfill').then((module) => {
    const WebXRPolyfill = module.default;
    new WebXRPolyfill();
  });
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

setupScene(canvas);
