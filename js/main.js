// Main entry point
import { state, initializeState } from './state.js';
import { setupThreeScene } from './three-scene.js';
import { initBackgroundCanvas, resizeBackgroundCanvas, getBackgroundColorAt } from './background.js';
import { setupInputHandlers } from './input-handler.js';
import { startAnimation } from './animation.js';
import { createEnterHint } from './hint-system.js';

// 페이지 로드 시 IME(한글 입력) 비활성화 유도
document.addEventListener('DOMContentLoaded', function () {
  document.body.setAttribute('lang', 'en');
  // 페이지 포커스 시 영어 입력 모드 유도
  window.focus();
});

// 키 입력 시작 시 영어 입력 유도
document.addEventListener('keydown', function (e) {
  if (state.isFirstInput && e.key.length === 1) {
    state.isFirstInput = false;
    console.log('✍️ English input mode recommended');
  }
}, { once: false });

// 초기화
initializeState();

// 2D 캔버스 설정
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 배경 캔버스 초기화
const { bgCanvas, bgCtx } = initBackgroundCanvas();

// Three.js 씬 설정
const threeScene = setupThreeScene(state);

// 입력 핸들러 설정
setupInputHandlers(state, threeScene, canvas);

// 애니메이션 시작
startAnimation(canvas, ctx, state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));

// 윈도우 리사이즈
window.addEventListener('resize', () => {
  // Three.js 리사이즈
  threeScene.camera.aspect = window.innerWidth / window.innerHeight;
  threeScene.camera.updateProjectionMatrix();
  threeScene.renderer.setSize(window.innerWidth, window.innerHeight);

  // 2D 캔버스 리사이즈
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 배경 캔버스 리사이즈
  resizeBackgroundCanvas(state);
});
