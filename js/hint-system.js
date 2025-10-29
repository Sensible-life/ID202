// Hint system for various messages
import { Letter } from './letter.js';

// touch 힌트 메시지 생성 함수 (단순 버전)
export function createTouchHint(state, getBackgroundColorAt, createEnterHint) {
  if (state.touchHintMessage || state.touchHintShown) return; // 이미 생성되었거나 한 번 표시된 경우 무시

  state.touchHintShown = true; // 표시 플래그 설정
  console.log('💡 Creating simple touch hint message!');
  state.touchHintMessage = [];
  state.touchHintStartTime = Date.now();
  const message = "touch?";

  // 램프 아래에 위치 (한글 경고 메시지와 같은 위치)
  const msgY = window.innerHeight * 0.75;

  // 전체 너비 계산 (작은 글씨)
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `italic bold 60px 'Cormorant Garamond', serif`;

  let totalMsgWidth = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const metrics = tempCtx.measureText(char);
    const spacing = Math.min(Math.max(metrics.width + 6, 30), 45);
    totalMsgWidth += spacing;
  }

  // 중앙정렬 시작 위치
  const msgX = (window.innerWidth - totalMsgWidth) / 2;
  let msgCurrentX = msgX;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const msgLetter = new Letter(char, msgCurrentX, msgY, i, 60, -1, state, getBackgroundColorAt, createEnterHint); // sentenceId -1 (특별)
    msgLetter.isTouchHint = true;
    msgLetter.revealDelay = i * 150; // 150ms 간격으로 순차 등장
    msgLetter.revealed = false;

    // 모든 파티클을 투명하게 시작 + 황금색으로 설정 (지니 힌트)
    msgLetter.particles.forEach(p => {
      p.alpha = 0;
      p.targetAlpha = 1;
      p.forming = false;
      p.originalX = p.x;
      p.originalY = p.y;
      // 황금색 파티클
      p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`;
    });

    state.touchHintMessage.push(msgLetter);
    const spacing = Math.min(Math.max(msgLetter.width + 6, 30), 45);
    msgCurrentX += spacing;
  }
}

// touch 힌트 메시지 날리기 함수 (일반 글자와 동일한 로직)
export function disperseTouchHint(state) {
  if (!state.touchHintMessage) return;

  console.log('🌪️ Dispersing touch hint message!');

  state.touchHintMessage.forEach((msgLetter, index) => {
    if (msgLetter.revealed) {
      // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
      msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
    }
  });
}

// Enter 키 힌트 메시지 생성 함수
export function createEnterHint(state, getBackgroundColorAt) {
  if (state.enterHintMessage || state.enterHintShown) return; // 이미 생성되었거나 한 번 표시된 경우 무시

  state.enterHintShown = true; // 표시 플래그 설정
  console.log('💡 Creating Enter key hint message!');
  state.enterHintMessage = [];
  state.enterHintStartTime = Date.now();
  const message = 'type and press "enter" to talk with me';

  // 램프 아래에 위치 (touch 힌트와 같은 위치)
  const msgY = window.innerHeight * 0.75;

  // 전체 너비 계산 (작은 글씨)
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `italic bold 50px 'Cormorant Garamond', serif`;

  let totalMsgWidth = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const metrics = tempCtx.measureText(char);
    const spacing = Math.min(Math.max(metrics.width + 4, 25), 40);
    totalMsgWidth += spacing;
  }

  // 중앙정렬 시작 위치
  const msgX = (window.innerWidth - totalMsgWidth) / 2;
  let msgCurrentX = msgX;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const msgLetter = new Letter(char, msgCurrentX, msgY, i, 50, -3, state, getBackgroundColorAt, createEnterHint); // sentenceId -3 (특별)
    msgLetter.isEnterHint = true;
    msgLetter.revealDelay = i * 80; // 80ms 간격으로 순차 등장
    msgLetter.revealed = false;

    // 모든 파티클을 투명하게 시작 + 황금색으로 설정 (지니 힌트)
    msgLetter.particles.forEach(p => {
      p.alpha = 0;
      p.targetAlpha = 1;
      p.forming = false;
      p.originalX = p.x;
      p.originalY = p.y;
      // 황금색 파티클
      p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`;
    });

    state.enterHintMessage.push(msgLetter);
    const spacing = Math.min(Math.max(msgLetter.width + 4, 25), 40);
    msgCurrentX += spacing;
  }
}

// Enter 힌트 메시지 날리기 함수 (일반 글자와 동일한 로직)
export function disperseEnterHint(state) {
  if (!state.enterHintMessage) return;

  console.log('🌪️ Dispersing Enter hint message!');

  state.enterHintMessage.forEach((msgLetter, index) => {
    if (msgLetter.revealed) {
      // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
      msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
    }
  });
}

// 클릭 힌트 생성 함수
export function createClickHint(state, getBackgroundColorAt, createEnterHint) {
  if (state.clickHintMessage || state.clickHintShown) return; // 이미 생성되었거나 한 번 표시된 경우 무시

  state.clickHintShown = true; // 표시 플래그 설정
  console.log('💡 Creating click hint message!');
  state.clickHintMessage = [];
  state.clickHintStartTime = Date.now();
  const message = "I only recognize keyboard input and mouse position";

  // 램프 위쪽에 위치 (더 위로)
  const msgY = window.innerHeight * 0.15;

  // 전체 너비 계산 (작은 글씨)
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `italic 40px 'Cormorant Garamond', serif`;

  let totalMsgWidth = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const metrics = tempCtx.measureText(char);
    const spacing = Math.min(Math.max(metrics.width + 3, 20), 35);
    totalMsgWidth += spacing;
  }

  // 중앙정렬 시작 위치
  const msgX = (window.innerWidth - totalMsgWidth) / 2;
  let msgCurrentX = msgX;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const msgLetter = new Letter(char, msgCurrentX, msgY, i, 40, -2, state, getBackgroundColorAt, createEnterHint); // sentenceId -2 (특별)
    msgLetter.isClickHint = true;
    msgLetter.revealDelay = i * 100; // 100ms 간격으로 순차 등장
    msgLetter.revealed = false;

    // 모든 파티클을 투명하게 시작 + 은색으로 설정 (사용자 색상)
    msgLetter.particles.forEach(p => {
      p.alpha = 0;
      p.targetAlpha = 1;
      p.forming = false;
      p.originalX = p.x;
      p.originalY = p.y;
      // 황금색 파티클 (지니 색상)
      p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`;
    });

    state.clickHintMessage.push(msgLetter);
    const spacing = Math.min(Math.max(msgLetter.width + 3, 20), 35);
    msgCurrentX += spacing;
  }
}

// 클릭 힌트 분산 함수 (일반 글자와 동일한 로직)
export function disperseClickHint(state) {
  if (!state.clickHintMessage) return;

  console.log('🌪️ Dispersing click hint message!');

  state.clickHintMessage.forEach((msgLetter, index) => {
    if (msgLetter.revealed) {
      // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
      msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
    }
  });

  state.clickHintMessage = null; // 메시지 제거
}

// 한글 경고 메시지 생성 함수
export function createKoreanWarningMessage(state, getBackgroundColorAt, createEnterHint) {
  if (state.koreanWarningMessage || state.koreanHintShown) return; // 이미 생성되었거나 한 번 표시된 경우 무시

  state.koreanHintShown = true; // 표시 플래그 설정
  state.koreanWarningMessage = [];
  state.koreanWarningStartTime = Date.now();
  const message = "I can't speak Korean...";

  // 램프 아래에 위치 (램프가 화면 중앙 아래쪽에 있으므로)
  const msgY = window.innerHeight * 0.75;

  // 전체 너비 계산 (작은 글씨)
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `italic bold 50px 'Cormorant Garamond', serif`; // 70px -> 50px

  let totalMsgWidth = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const metrics = tempCtx.measureText(char);
    // 자간을 줄임: 기존보다 작게 설정
    const spacing = char === ' ' ? 18 : Math.min(Math.max(metrics.width + 4, 25), 35); // 25->18, 40->25, 55->35
    totalMsgWidth += spacing;
  }

  // 중앙정렬 시작 위치
  const msgX = (window.innerWidth - totalMsgWidth) / 2;
  let msgCurrentX = msgX;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const msgLetter = new Letter(char, msgCurrentX, msgY, i, 50, 0, state, getBackgroundColorAt, createEnterHint); // 70 -> 50px
    msgLetter.isKoreanWarning = true;
    msgLetter.revealDelay = i * 100; // 100ms 간격으로 순차 등장
    msgLetter.revealed = false;

    // 모든 파티클을 투명하게 시작 + 황금색으로 설정 (지니 메시지)
    msgLetter.particles.forEach(p => {
      p.alpha = 0;
      p.targetAlpha = 1;
      p.forming = false;
      p.originalX = p.x; // 원래 위치 저장 (일렁임용)
      p.originalY = p.y;
      // 황금색 파티클로 변경
      p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`; // 황금색 (60~75% 밝기)
    });

    state.koreanWarningMessage.push(msgLetter);
    // 동일한 자간 적용
    const spacing = char === ' ' ? 18 : Math.min(Math.max(msgLetter.width + 4, 25), 35);
    msgCurrentX += spacing;
  }

  console.log('⚠️ Korean warning message created!');
}
