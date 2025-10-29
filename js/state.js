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
  koreanWarningMessage: null,
  touchHintMessage: null,
  clickHintMessage: null,
  enterHintMessage: null,

  // Message timing
  koreanWarningStartTime: 0,
  touchHintStartTime: 0,
  clickHintStartTime: 0,
  enterHintStartTime: 0,

  // Explosion effect
  explosionParticles: [],
  isExploding: false,
  explosionStartTime: 0,

  // Sentence tracking
  completedSentences: 0,
  sentencesWithoutEnter: 0,

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

  // Background transition
  backgroundTransitionParticles: [],
  isTransitioningBackground: false,
  transitionStartTime: 0,
  pendingBackgroundImage: null,

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
}
