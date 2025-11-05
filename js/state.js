// Global state management
export const state = {
  // Touch interaction
  touchCount: 0,
  lampShaking: false,
  lampShakeStartTime: 0,
  touchInteractionsEnabled: true,

  // Text input
  currentTypedText: '',
  wishInputText: '',

  // Messages
  introMessage: null,
  wishMessage: null,
  wishMessageCreated: false, // 한 번만 생성되도록 플래그
  genieResponseMessage: null,
  koreanWarningMessage: null,
  touchHintMessage: null,
  clickHintMessage: null,
  enterHintMessage: null,

  // Message timing
  koreanWarningStartTime: 0,
  touchHintStartTime: 0,
  clickHintStartTime: 0,
  enterHintStartTime: 0,
  genieResponseStartTime: 0,
  genieResponseLogged: false,

  // Explosion effect
  explosionParticles: [],
  isExploding: false,
  explosionStartTime: 0,

  // Sentence tracking
  completedSentences: 0,
  sentencesWithoutEnter: 0,
  sentencesWithEnter: new Set(), // Enter로 완료된 문장 ID들 추적

  // Hint flags
  touchHintShown: false,
  clickHintShown: false,
  koreanHintShown: false,
  enterHintShown: false,

  // Camera
  isCameraReturning: false,
  cameraReturnStartTime: 0,
  cameraStartAngle: 0,
  cameraTargetAngle: 0,

  // Keyboard rotation
  isRotatingLeft: false,
  isRotatingRight: false,
  rotationVelocity: 0,

  // Canvas
  letters: [],
  currentX: 0,
  currentY: 0,
  mouseX: 0,
  mouseY: 0,
  isTyping: false,
  lastInputTime: Date.now(),
  currentSentenceId: 0,

  // Mouse tracking
  lastMouseLogTime: 0,
  mouseHasMoved: false,
  lastMouseX: 0,
  lastMouseY: 0,

  // IME
  isFirstInput: true,

  // Background
  bgImageData: null,
  currentBackgroundImage: null,
  cachedInputTextColor: null, // 입력 텍스트용 캐시된 색상 (성능 최적화)

  // Background transition
  backgroundTransitionParticles: [],
  isTransitioningBackground: false,
  transitionStartTime: 0,
  pendingBackgroundImage: null,
  pendingGenieResponse: null, // 배경 전환 완료 후 표시할 지니 반응
  genieResponseCreating: false, // 지니 반응 생성 중 플래그 (중복 방지)
  wishCount: 0, // 소원을 몇 번 빌었는지 (카운트용)

  // Performance monitoring
  lastPerformanceLog: 0
};

// Initialize mouse position to center
export function initializeState() {
  state.currentX = window.innerWidth / 2;
  state.currentY = window.innerHeight / 2;
  state.mouseX = window.innerWidth / 2;
  state.mouseY = window.innerHeight / 2;
  state.lastMouseX = window.innerWidth / 2;
  state.lastMouseY = window.innerHeight / 2;
  state.lastInputTime = Date.now();
  
  // 초기 배경은 어두우므로 밝은 금색으로 시작
  state.cachedInputTextColor = 'rgba(255, 215, 100, 0.9)';
}
