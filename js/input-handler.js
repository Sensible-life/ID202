// Keyboard input handler
import { Letter } from './letter.js';
import { isKorean } from './utils.js';
import { createKoreanWarningMessage, createTouchHint, createEnterHint } from './hint-system.js';
import { changeBackground, getBackgroundColorAt } from './background.js';

export function setupInputHandlers(state, threeScene, canvas) {
  const { scene, cameraAngle, updateCameraAngle } = threeScene;

  // 마우스 위치 추적 (항상 추적)
  window.addEventListener('mousemove', function (event) {
    state.mouseX = event.clientX;
    state.mouseY = event.clientY;

    // 마우스가 움직였는지 감지 (10픽셀 이상 움직이면)
    const mouseMoveDistance = Math.sqrt(
      Math.pow(state.mouseX - state.lastMouseX, 2) + Math.pow(state.mouseY - state.lastMouseY, 2)
    );

    if (mouseMoveDistance > 10) {
      state.mouseHasMoved = true;
      console.log('🖱️ Mouse moved significantly, next typing will start at new position');
    }

    state.lastMouseX = state.mouseX;
    state.lastMouseY = state.mouseY;

    // 마우스 위치 1초마다 콘솔 출력
    const now = Date.now();
    if (now - state.lastMouseLogTime > 1000) {
      console.log('Mouse Position:', { x: state.mouseX, y: state.mouseY });
      state.lastMouseLogTime = now;
    }
  });

  // 마우스 클릭 시 카메라 위치 출력
  window.addEventListener('click', function (event) {
    console.log('📸 Camera Position:', {
      x: threeScene.camera.position.x.toFixed(2),
      y: threeScene.camera.position.y.toFixed(2),
      z: threeScene.camera.position.z.toFixed(2)
    });

    // 첫 클릭 힌트가 이미 표시된 경우 무시
    if (state.clickHintShown) {
      console.log('🚫 Click hint already shown, ignoring click event');
      return;
    }

    // 클릭 힌트가 이미 나타나는 중이면 무시 (완전히 끝날 때까지 기다림)
    if (state.clickHintMessage) {
      console.log('🚫 Click hint already in progress, ignoring click event');
      return;
    }

    // 클릭 힌트 생성
    import('./hint-system.js').then(({ createClickHint }) => {
      createClickHint(state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));
    });
  });

  // 터치 이벤트도 추가 (모바일 대응)
  window.addEventListener('touchstart', function (event) {
    // 첫 클릭 힌트가 이미 표시된 경우 무시
    if (state.clickHintShown) {
      console.log('🚫 Click hint already shown, ignoring touch event');
      return;
    }

    // 클릭 힌트가 이미 나타나는 중이면 무시 (완전히 끝날 때까지 기다림)
    if (state.clickHintMessage) {
      console.log('🚫 Click hint already in progress, ignoring touch event');
      return;
    }

    // 클릭 힌트 생성
    import('./hint-system.js').then(({ createClickHint }) => {
      createClickHint(state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));
    });
  });

  // 키보드 입력 처리 (타이핑 + 카메라 회전)
  document.addEventListener('keydown', function (event) {
    console.log('Key pressed:', event.key);

    // 힌트는 자동으로 나타남→유지→사라짐 사이클을 완료하므로 여기서 분산시키지 않음

    // 카메라 회전 (방향키) - 누르고 있으면 계속 회전
    if (event.key === 'ArrowLeft') {
      state.isRotatingLeft = true;
      return;
    } else if (event.key === 'ArrowRight') {
      state.isRotatingRight = true;
      return;
    }

    // 타이핑 처리
    if (event.key === 'Backspace') {
      event.preventDefault();

      // Make your wish 이후: 키워드의 마지막 글자 제거 (화면에도 적용)
      if (state.wishMessage && state.wishInputText.length > 0) {
        state.wishInputText = state.wishInputText.slice(0, -1);
        console.log('Wish keyword:', state.wishInputText);
        // 화면에도 반영되도록 return 제거
      }

      // 마지막 글자 제거
      if (state.letters.length > 0) {
        const lastLetter = state.letters.pop();
        const spacing = Math.min(Math.max(lastLetter.width + 8, 45), 58);
        state.currentX -= spacing;
        // 현재 텍스트에서도 마지막 글자 제거
        state.currentTypedText = state.currentTypedText.slice(0, -1);
      }
      // 모든 글자가 지워지면 타이핑 상태 해제
      if (state.letters.length === 0) {
        state.isTyping = false;
        state.currentTypedText = '';
      }
      state.lastInputTime = Date.now();
    } else if (event.key === 'Enter') {
      event.preventDefault();

      // Enter 키를 눌렀으므로 엔터 없이 사라짐 카운터 리셋
      state.sentencesWithoutEnter = 0;

      // Enter 힌트는 자동으로 사라지므로 여기서 분산시키지 않음

      // touch 상호작용이 활성화되어 있을 때만 처리
      if (state.touchInteractionsEnabled) {
        // 램프 관련 키워드 포함 여부 확인
        console.log('Enter pressed. Current text:', state.currentTypedText);
        const lampKeywords = ['touch', 'rub', 'polish', 'scratch', 'stroke', 'caress', 'pat', 'tap'];
        const textLower = state.currentTypedText.toLowerCase();
        const hasLampKeyword = lampKeywords.some(keyword => textLower.includes(keyword));

        if (hasLampKeyword) {
          // 세 번째 touch 이후에는 무시
          if (state.touchCount >= 3) {
            console.log('🚫 Already touched 3 times, ignoring additional touch');
          } else {
            state.touchCount++;
            console.log('✨ LAMP INTERACTION DETECTED! Count:', state.touchCount);

            // 램프 흔들림 시작
            state.lampShaking = true;
            state.lampShakeStartTime = Date.now();
            console.log('🪔 Lamp shaking started!');

            // 세 번째 touch일 때 카메라 회전 시작 (흔들림과 동시에)
            if (state.touchCount === 3) {
              console.log('📸 Starting camera return to initial position');
              state.isCameraReturning = true;
              state.cameraReturnStartTime = Date.now();
              state.cameraStartAngle = cameraAngle;
              state.cameraTargetAngle = Math.atan2(-4.35, 1.98); // 초기 각도
              updateCameraAngle(state.cameraStartAngle);
            }

            // touch 힌트는 자동으로 사라지므로 여기서 분산시키지 않음

            // touch가 없는 문장 완성 카운터 리셋
            state.completedSentences = 0;
          }
        } else {
          // touch가 없는 문장 완성
          state.completedSentences++;
          console.log(`📝 Sentence completed without touch. Count: ${state.completedSentences}`);

          // 세 번째 문장이면 힌트 생성 (wishMessage가 없을 때만)
          if (state.completedSentences >= 3 && !state.wishMessage) {
            createTouchHint(state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));
            state.completedSentences = 0; // 리셋
          }
        }
      }

      // Make your wish 이후: 소원 키워드 처리 (Enter 키로만)
      if (state.wishMessage && state.wishInputText.trim() !== '') {
        const text = state.wishInputText.trim().toLowerCase();
        console.log('🌍 Analyzing wish on Enter:', text);

        // 텍스트에서 키워드 찾기 (keywords.js에서 불러온 데이터 사용)
        let detectedKeyword = null;
        for (const [category, keywords] of Object.entries(keywordMap)) {
          if (keywords.some(keyword => text.includes(keyword))) {
            detectedKeyword = category;
            break;
          }
        }

        if (detectedKeyword && backgroundImages[detectedKeyword]) {
          const imageUrl = backgroundImages[detectedKeyword];
          changeBackground(imageUrl, state, threeScene);
          state.wishInputText = ''; // 리셋
        } else {
          console.log('⚠️ No matching keyword found in wish. Try: 부자/rich/wealth, 사랑/love, 건강/health, 성공/success, 행복/happiness, ocean, forest, tokyo, space, etc.');
        }
      }

      // 줄바꿈 - 마우스 위치 기준으로 새로운 줄 시작
      state.isTyping = false;
      state.currentX = state.mouseX;
      state.currentY = state.mouseY;
      state.currentTypedText = ''; // 텍스트 리셋
      state.lastInputTime = Date.now();
    } else if (event.key === ' ') {
      event.preventDefault();

      // Make your wish 이후: 키워드에 스페이스 추가 (화면에도 표시)
      if (state.wishMessage) {
        state.wishInputText += ' ';
        console.log('Wish keyword:', state.wishInputText);
        // 글자는 화면에도 표시하도록 return 제거
      }

      // 스페이스
      state.currentX += 25;
      state.currentTypedText += ' ';
      state.isTyping = true;
      state.lastInputTime = Date.now();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();

      // 한글 입력 감지 - 지니 메시지만 생성하고 글자는 그대로 표시
      if (isKorean(event.key)) {
        console.log('🇰🇷 Korean input detected:', event.key);
        createKoreanWarningMessage(state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));
        // 한글도 화면에 표시하도록 return 제거
      }

      // Make your wish 이후: 키워드 입력 (화면에도 표시)
      if (state.wishMessage) {
        state.wishInputText += event.key;
        console.log('Wish keyword:', state.wishInputText);
        // 글자는 화면에도 표시
      }

      // 새로운 타이핑 시작 조건:
      // 1) 타이핑 중이 아니거나
      // 2) 마우스가 움직였거나
      // 3) 마지막 입력으로부터 2초 이상 지났거나
      // 4) 현재 위치가 화면 끝에 가까우면
      const timeSinceLastInput = Date.now() - state.lastInputTime;
      const shouldStartNewLine = !state.isTyping ||
        state.mouseHasMoved ||
        timeSinceLastInput > 2000 ||
        state.currentX > canvas.width - 100;

      if (shouldStartNewLine) {
        state.currentX = state.mouseX;
        state.currentY = state.mouseY;
        state.mouseHasMoved = false; // 마우스 이동 플래그 리셋
        state.currentSentenceId++; // 새로운 문장 ID 할당
        console.log('🖱️ Starting new typing at mouse position:', { x: state.mouseX, y: state.mouseY, sentenceId: state.currentSentenceId });
      }

      // 새 글자 생성 (인덱스와 문장 ID 전달)
      const letter = new Letter(event.key, state.currentX, state.currentY, state.letters.length, 80, state.currentSentenceId, state, (x, y) => getBackgroundColorAt(x, y, state), () => createEnterHint(state, (x, y) => getBackgroundColorAt(x, y, state)));
      state.letters.push(letter);

      // 현재 타이핑 텍스트에 추가
      state.currentTypedText += event.key;

      // 램프 관련 키워드가 완성되었는지 실시간 체크
      const lampKeywordsCheck = ['touch', 'rub', 'polish', 'scratch', 'stroke', 'caress', 'pat', 'tap'];
      const detectedKeyword = lampKeywordsCheck.find(kw => state.currentTypedText.toLowerCase().includes(kw));
      if (detectedKeyword) {
        console.log(`"${detectedKeyword}" detected in text:`, state.currentTypedText);
      }

      // 글자 너비 + 간격(8px), 최소 45px, 최대 58px - 넓은 글자도 적절한 간격
      const spacing = Math.min(Math.max(letter.width + 8, 45), 58);
      state.currentX += spacing;
      state.isTyping = true; // 타이핑 상태로 전환
      state.lastInputTime = Date.now();
    }
  });

  // 키보드 keyup 처리 (회전 멈춤)
  document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
      state.isRotatingLeft = false;
    } else if (event.key === 'ArrowRight') {
      state.isRotatingRight = false;
    }
  });
}
