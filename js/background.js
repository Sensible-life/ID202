// Background image handling
import { getContrastColor, adjustLampLightingBasedOnBackground } from './utils.js';
import { SandCurtainParticle } from './particles.js';

// 배경 이미지 샘플링용 숨겨진 캔버스
const bgCanvas = document.createElement('canvas');
const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });

export function initBackgroundCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  return { bgCanvas, bgCtx };
}

export function resizeBackgroundCanvas(state) {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  // 배경 이미지가 있으면 다시 그리기
  if (state.currentBackgroundImage) {
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.onload = function () {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      bgCtx.drawImage(bgImage, 0, 0, bgCanvas.width, bgCanvas.height);
      state.bgImageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    };
    bgImage.src = state.currentBackgroundImage;
  }
}

// 파티클 위치의 배경색 가져오기
export function getBackgroundColorAt(x, y, state) {
  if (!state.bgImageData) {
    // 배경 이미지 없으면 기본 밝은 금색 (검은 배경에 잘 보이도록)
    return `rgba(255, 215, 100, ${0.8 + Math.random() * 0.2})`;
  }

  const px = Math.floor(x);
  const py = Math.floor(y);

  if (px < 0 || px >= bgCanvas.width || py < 0 || py >= bgCanvas.height) {
    return `rgba(255, 215, 100, ${0.8 + Math.random() * 0.2})`;
  }

  const index = (py * bgCanvas.width + px) * 4;
  const r = state.bgImageData.data[index];
  const g = state.bgImageData.data[index + 1];
  const b = state.bgImageData.data[index + 2];

  return getContrastColor(r, g, b);
}

// 배경 변경 함수 (파티클 스윕 효과)
export function changeBackground(imageUrl, state, threeScene) {
  const { scene, renderer, lights } = threeScene;

  const overlay = document.getElementById('background-overlay');
  if (!overlay) {
    console.error('Background overlay element not found');
    return;
  }

  // 이미 전환 중이면 무시
  if (state.isTransitioningBackground) {
    console.log('Background transition already in progress');
    return;
  }

  // 오버레이에 새 배경 설정 (처음엔 숨김)
  overlay.style.backgroundImage = `url('${imageUrl}')`;
  overlay.style.clipPath = 'inset(0 100% 0 0)'; // 완전히 숨김

  // 새 배경 URL 저장
  state.pendingBackgroundImage = imageUrl;

  // 파티클 생성 시작
  state.isTransitioningBackground = true;
  state.transitionStartTime = Date.now();
  state.backgroundTransitionParticles = [];

  console.log('🌊 Starting background transition with particle sweep');

  // body 배경 설정
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';

  // Three.js 배경 투명하게
  scene.background = null;
  renderer.setClearColor(0x000000, 0); // 완전 투명

  // 바닥 제거
  if (window.floorMesh) {
    scene.remove(window.floorMesh);
  }

  // 안개 제거
  scene.fog = null;

  // 배경 이미지를 숨겨진 canvas에 그려서 픽셀 데이터 읽기
  state.currentBackgroundImage = imageUrl;
  const bgImage = new Image();
  bgImage.crossOrigin = 'anonymous';
  bgImage.onload = function () {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.drawImage(bgImage, 0, 0, bgCanvas.width, bgCanvas.height);
    state.bgImageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
    console.log('📸 Background image data loaded for particle color adjustment');

    // 배경 이미지 평균 밝기 계산 및 램프 조명 조정
    adjustLampLightingBasedOnBackground(state.bgImageData, lights);
  };
  bgImage.onerror = function () {
    console.warn('⚠️ Failed to load background image for color sampling');
  };
  bgImage.src = imageUrl;

  console.log(`✨ Background transition started: ${imageUrl}!`);
}
