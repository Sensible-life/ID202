// Main animation loop
import { SandCurtainParticle, BackgroundTransitionParticle } from './particles.js';
import { Letter } from './letter.js';
import { getBackgroundColorAt } from './background.js';
import { audioSystem } from './audio.js';

// Intro message 생성
function createIntroMessage(state, getBackgroundColorAtFunc, createEnterHintFunc) {
  console.log('🌟 Creating intro message with curtain!');

  state.introMessage = [];

  // 3개 파트로 나눔 (쉼표 기준)
  const introParts = [
    "Wish for a new world",
    "a thousand new things",
    "or just a fabulous new look"
  ];

  // 램프 아래 중앙에 3줄로 배치 (작은 글씨)
  const baseY = window.innerHeight * 0.62; // 램프 아래 (더 위로 올림)
  const lineHeight = 65; // 줄 간격 (조금 더 늘림)

  introParts.forEach((text, partIndex) => {
    const y = baseY + lineHeight * partIndex;

    // 먼저 x=0부터 시작해서 Letter 생성하고 너비 계산
    let currentX = 0;
    const partStartX = 0;
    const partLetters = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const msgLetter = new Letter(char, currentX, y, i, 55, 0, state, getBackgroundColorAtFunc, createEnterHintFunc); // 작은 글씨 (55px)
      msgLetter.isIntroMessage = true;
      msgLetter.introPart = partIndex;
      msgLetter.disperseTime = 9.0; // 9초에 모두 날아감
      msgLetter.revealed = false;

      // 모든 파티클을 투명하게 시작 + 황금색으로 설정 (지니 메시지)
      msgLetter.particles.forEach(p => {
        p.alpha = 0;
        p.targetAlpha = 1;
        p.forming = false;
        // 황금색 파티클로 변경
        p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`; // 황금색 (60~75% 밝기)
      });

      partLetters.push(msgLetter);
      const spacing = char === ' ' ? 22 : Math.min(Math.max(msgLetter.width + 8, 30), 37); // 자간 조금 더 키움
      currentX += spacing;
    }

    // 전체 너비 계산 완료
    const totalWidth = currentX;

    // 중앙정렬을 위해 모든 Letter의 x 위치를 오프셋 (살짝 오른쪽으로)
    const offsetX = (window.innerWidth - totalWidth) / 2 + 30;
    partLetters.forEach((msgLetter) => {
      msgLetter.x += offsetX;
      msgLetter.partStartX = offsetX;
      // 파티클 위치도 업데이트
      msgLetter.particles.forEach(p => {
        p.x += offsetX;
        p.originalX += offsetX;
      });
    });

    // introMessage에 추가
    state.introMessage.push(...partLetters);

    // revealDelay 설정 (왼쪽→오른쪽)
    partLetters.forEach((msgLetter) => {
      const relativeX = msgLetter.x - offsetX;
      const normalizedX = relativeX / totalWidth; // 0(왼쪽)~1(오른쪽)
      // 파트별로 2초 간격 (2초, 4초, 6초)
      const partRevealStartTime = 2.0 + partIndex * 2.0;
      // 왼쪽→오른쪽으로 드러남
      msgLetter.revealDelay = partRevealStartTime + normalizedX * 0.8;
    });
  });

  console.log('✨ introMessage created (will reveal with curtain sweep)!');
  
  // Intro 메시지 TTS로 읽기 (1초 딜레이 후)
  setTimeout(() => {
    const fullIntroText = introParts.join(", ");
    audioSystem.speakAsGenie(fullIntroText);
  }, 1000); // 1초 대기
}

// Genie response message 생성 (소원에 대한 반응)
function createGenieResponseMessage(responseText, state, getBackgroundColorAtFunc, createEnterHintFunc) {
  console.log('🧞 Creating genie response message:', responseText);

  state.genieResponseMessage = [];
  const message = responseText;
  const baseY = window.innerHeight * 0.65; // 첫 줄 위치
  const lineHeight = 80; // 줄 간격
  const maxWidth = window.innerWidth * 0.8; // 화면 너비의 80%까지만 사용

  // 먼저 전체 너비 계산하여 줄바꿈 필요 여부 확인
  const tempCanvas2 = document.createElement('canvas');
  const tempCtx2 = tempCanvas2.getContext('2d');
  tempCtx2.font = `italic bold 70px 'Cormorant Garamond', serif`;

  // 단어 단위로 분리하여 줄바꿈 처리
  const words = message.split(' ');
  const lines = [];
  let currentLine = '';
  let currentLineWidth = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    
    // 테스트 라인의 너비 계산
    let testWidth = 0;
    for (let j = 0; j < testLine.length; j++) {
      const char = testLine[j];
      const metrics = tempCtx2.measureText(char);
      const spacing = char === ' ' ? 22 : Math.min(Math.max(metrics.width + 7, 40), 50);
      testWidth += spacing;
    }
    
    // maxWidth 초과하면 줄바꿈
    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  // 마지막 줄 추가
  if (currentLine) {
    lines.push(currentLine);
  }

  console.log(`📝 Genie response split into ${lines.length} lines:`, lines);
  
  // 배경색 샘플링 (메시지가 표시될 위치의 중앙)
  const sampleX = window.innerWidth / 2;
  const sampleY = baseY;
  
  // 배경색 가져오기 (state.bgImageData 사용)
  let avgR = 0, avgG = 0, avgB = 0, sampleCount = 0;
  
  if (state.bgImageData) {
    // 메시지 영역 주변을 샘플링 (더 정확한 색상 계산)
    const sampleRadius = 100;
    for (let dy = -sampleRadius; dy <= sampleRadius; dy += 20) {
      for (let dx = -sampleRadius; dx <= sampleRadius; dx += 20) {
        const px = Math.floor(sampleX + dx);
        const py = Math.floor(sampleY + dy);
        
        if (px >= 0 && px < state.bgImageData.width && py >= 0 && py < state.bgImageData.height) {
          const index = (py * state.bgImageData.width + px) * 4;
          avgR += state.bgImageData.data[index];
          avgG += state.bgImageData.data[index + 1];
          avgB += state.bgImageData.data[index + 2];
          sampleCount++;
        }
      }
    }
    
    avgR /= sampleCount;
    avgG /= sampleCount;
    avgB /= sampleCount;
    
    console.log(`🎨 Background color at message position: RGB(${avgR.toFixed(0)}, ${avgG.toFixed(0)}, ${avgB.toFixed(0)})`);
    
    // 입력 텍스트용 색상도 캐시 (같은 영역이므로 동일한 색상 사용)
    const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
    if (brightness > 140) {
      state.cachedInputTextColor = `rgba(40, 25, 10, ${0.95 + Math.random() * 0.05})`;
    } else if (brightness > 80) {
      state.cachedInputTextColor = `rgba(255, 250, 230, ${0.95 + Math.random() * 0.05})`;
    } else {
      state.cachedInputTextColor = `rgba(255, 255, 240, ${0.95 + Math.random() * 0.05})`;
    }
    console.log(`💾 Cached input text color: ${state.cachedInputTextColor}`);
  }

  // 각 줄별로 Letter 생성
  let totalLetterIndex = 0;
  lines.forEach((line, lineIndex) => {
    const msgY = baseY + (lineIndex * lineHeight);
    
    // 현재 줄의 너비 계산
    let lineWidth = 0;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const metrics = tempCtx2.measureText(char);
      const spacing = char === ' ' ? 22 : Math.min(Math.max(metrics.width + 7, 40), 50);
      lineWidth += spacing;
    }
    
    // 중앙정렬 시작 위치
    const msgX = (window.innerWidth - lineWidth) / 2 + 50;
    let msgCurrentX = msgX;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const msgLetter = new Letter(char, msgCurrentX, msgY, totalLetterIndex, 70, 0, state, getBackgroundColorAtFunc, createEnterHintFunc);
      msgLetter.isGenieResponse = true;
      msgLetter.revealDelay = 0; // 나중에 설정
      msgLetter.revealed = false;

      msgLetter.particles.forEach(p => {
        p.alpha = 0;
        p.targetAlpha = 1;
        p.forming = false;
        p.originalX = p.x;
        p.originalY = p.y;
        
        // 배경색에 따라 대비되는 색상 적용
        if (state.bgImageData && sampleCount > 0) {
          const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
          
          if (brightness > 140) {
            p.color = `rgba(40, 25, 10, ${0.95 + Math.random() * 0.05})`;
          } else if (brightness > 80) {
            p.color = `rgba(255, 250, 230, ${0.95 + Math.random() * 0.05})`;
          } else {
            p.color = `rgba(255, 255, 240, ${0.95 + Math.random() * 0.05})`;
          }
        } else {
          p.color = `rgba(255, 255, 240, 0.95)`;
        }
      });

      state.genieResponseMessage.push(msgLetter);
      const spacing = char === ' ' ? 22 : Math.min(Math.max(msgLetter.width + 7, 40), 50);
      msgCurrentX += spacing;
      totalLetterIndex++;
    }
  });

  // 왼쪽부터 드러나도록 딜레이 설정 (전체 메시지 기준)
  state.genieResponseMessage.forEach((msgLetter, index) => {
    const totalLetters = state.genieResponseMessage.length;
    const normalizedIndex = index / totalLetters;
    // 왼쪽부터 순차적으로 드러남 (빠르게)
    msgLetter.revealDelay = normalizedIndex * 0.5;
  });

  // 지니 반응 시작 시간 기록
  state.genieResponseStartTime = Date.now();

  console.log('✨ genieResponseMessage created!');
  
  // 지니 음성으로 응답 읽기 (TTS)
  console.log('🎙️ Calling speakAsGenie with:', responseText);
  audioSystem.speakAsGenie(responseText);
}

// Wish message 생성
function createWishMessage(state, getBackgroundColorAtFunc, createEnterHintFunc) {
  console.log('🌟 Creating "Make your wish" message!');

  state.wishMessage = [];
  const message = "Make your wish";
  const msgY = window.innerHeight * 0.65;

  // 먼저 전체 너비 계산
  const tempCanvas2 = document.createElement('canvas');
  const tempCtx2 = tempCanvas2.getContext('2d');
  tempCtx2.font = `italic bold 80px 'Cormorant Garamond', serif`;

  let totalMsgWidth = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const metrics = tempCtx2.measureText(char);
    const spacing = char === ' ' ? 25 : Math.min(Math.max(metrics.width + 8, 45), 58);
    totalMsgWidth += spacing;
  }

  // 중앙정렬 시작 위치 (살짝 오른쪽으로)
  const msgX = (window.innerWidth - totalMsgWidth) / 2 + 50;
  let msgCurrentX = msgX;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const msgLetter = new Letter(char, msgCurrentX, msgY, i, 80, 0, state, getBackgroundColorAtFunc, createEnterHintFunc);
    msgLetter.isWishMessage = true;
    msgLetter.revealDelay = 0; // 나중에 설정
    msgLetter.revealed = false;

    msgLetter.particles.forEach(p => {
      p.alpha = 0;
      p.targetAlpha = 1;
      p.forming = false;
      p.originalX = p.x; // 원래 위치 저장 (일렁임용)
      p.originalY = p.y;
      // 황금색 파티클로 변경 (지니 메시지)
      p.color = `hsl(45, 85%, ${Math.random() * 15 + 60}%)`; // 황금색 (60~75% 밝기)
    });

    state.wishMessage.push(msgLetter);
    const spacing = char === ' ' ? 25 : Math.min(Math.max(msgLetter.width + 8, 45), 58);
    msgCurrentX += spacing;
  }

  // 왼쪽부터 드러나도록 딜레이 설정
  const totalWidth = msgCurrentX - msgX;
  state.wishMessage.forEach((msgLetter) => {
    const letterX = msgLetter.x;
    const relativeX = letterX - msgX;
    const normalizedX = relativeX / totalWidth; // 0(왼쪽)~1(오른쪽)
    // 왼쪽부터 드러남
    msgLetter.revealDelay = normalizedX * 0.8;
  });

  console.log('✨ wishMessage created!');
  
  // "Make your wish" 메시지 TTS로 읽기
  audioSystem.speakAsGenie("Make your wish");
}

// Export createGenieResponseMessage for external use
export { createGenieResponseMessage };

// 애니메이션 루프 시작
export function startAnimation(canvas, ctx, state, getBackgroundColorAtFunc, createEnterHintFunc) {
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 투명 배경

    // 성능 디버깅: 30초마다 현재 상태 출력 (최적화됨)
    const now = Date.now();
    if (!state.lastPerformanceLog || now - state.lastPerformanceLog > 30000) {
      // 각 Letter의 파티클 개수 계산
      let totalLetterParticles = 0;
      state.letters.forEach(letter => {
        totalLetterParticles += letter.particles.length;
      });
      
      // 메시지들의 파티클 개수 계산
      let totalMessageParticles = 0;
      [state.introMessage, state.wishMessage, state.genieResponseMessage,
       state.koreanWarningMessage, state.touchHintMessage, 
       state.clickHintMessage, state.enterHintMessage].forEach(msg => {
        if (msg && msg.length > 0) {
          msg.forEach(letter => {
            totalMessageParticles += letter.particles.length;
          });
        }
      });
      
      console.log('🔍 Performance Check:', {
        letters: state.letters.length,
        letterParticles: totalLetterParticles,
        explosionParticles: state.explosionParticles.length,
        transitionParticles: state.backgroundTransitionParticles.length,
        messageLetters: (state.introMessage?.length || 0) + (state.wishMessage?.length || 0) +
                  (state.genieResponseMessage?.length || 0) +
                  (state.koreanWarningMessage?.length || 0) + (state.touchHintMessage?.length || 0) +
                  (state.clickHintMessage?.length || 0) + (state.enterHintMessage?.length || 0),
        messageParticles: totalMessageParticles,
        totalParticles: totalLetterParticles + totalMessageParticles + 
                       state.explosionParticles.length + state.backgroundTransitionParticles.length
      });
      state.lastPerformanceLog = now;
    }

    // 일반 글자 업데이트 및 그리기 (맨 아래)
    state.letters.forEach(letter => {
      letter.update();
      letter.draw(ctx);
    });

    // 사라진 글자 제거
    state.letters = state.letters.filter(letter => !letter.isFinished());

    // 마지막 입력으로부터 2초 이상 지났으면 타이핑 상태 해제 (글자가 남아있어도)
    const timeSinceLastInput = Date.now() - state.lastInputTime;
    if (timeSinceLastInput > 2000) {
      state.isTyping = false;
    }

    // 모든 글자가 사라졌으면 타이핑 상태 해제
    if (state.letters.length === 0) {
      state.isTyping = false;
    }

    // 중간 메시지 렌더링 ("Wish for a new world...") - 커튼과 함께 드러남
    if (state.introMessage && state.introMessage.length > 0) {
      const timeSinceExplosion = (Date.now() - state.explosionStartTime) / 1000;

      state.introMessage.forEach((msgLetter) => {
        msgLetter.update();

        // 커튼이 지나간 후 순차적으로 드러남 (오른쪽→왼쪽, 파트별 시차)
        if (timeSinceExplosion > msgLetter.revealDelay && !msgLetter.revealed) {
          msgLetter.revealed = true;
        }

        // 드러난 글자 페이드인
        if (msgLetter.revealed) {
          msgLetter.particles.forEach(p => {
            if (p.alpha < p.targetAlpha) {
              p.alpha += 0.03; // 빠르게 나타남
            }
          });
        }

        // disperseTime에 도달하면 날아감
        if (timeSinceExplosion > msgLetter.disperseTime && !msgLetter.dispersing) {
          msgLetter.dispersing = true;
          msgLetter.particles.forEach(p => {
            p.dispersing = true;
            p.velocityX = (Math.random() - 0.5) * 3;
            p.velocityY = (Math.random() - 0.5) * 3 - 2; // 위로 날아감
          });
        }

        msgLetter.draw(ctx);
      });

      // 모든 글자가 사라졌는지 확인
      const allGone = state.introMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );

      if (allGone && timeSinceExplosion > 10.0) {
        state.introMessage = null; // 정리
      }
    }

    // "Make your wish" 메시지 렌더링 (순차적 드러남 + 일렁임) - 중간 레이어
    if (state.wishMessage && state.wishMessage.length > 0) {
      const timeSinceExplosion = (Date.now() - state.explosionStartTime) / 1000;

      state.wishMessage.forEach((msgLetter, index) => {
        // update 호출
        msgLetter.update();

        // 9.0초 이후 순차적으로 드러남 (생성 시간과 동일하게)
        const revealStartTime = 9.0;
        const timeSinceRevealStart = timeSinceExplosion - revealStartTime;

        if (timeSinceRevealStart > msgLetter.revealDelay) {
          // 드러나기 시작
          if (!msgLetter.revealed) {
            msgLetter.revealed = true;
          }

          // 파티클 알파 증가 (페이드인) - dispersing 중이 아닐 때만
          msgLetter.particles.forEach(p => {
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.03; // 빠르게 나타남
            }
          });
        }

        // 일렁이는 효과 (드러난 글자만, dispersing 중이 아닐 때만)
        if (msgLetter.revealed) {
          const waveOffset = Math.sin(Date.now() * 0.002 + index * 0.3) * 5;

          msgLetter.particles.forEach(p => {
            if (!p.dispersing) {
              p.y = p.originalY + waveOffset;
            }
          });
        }

        msgLetter.draw(ctx);
      });

      // 모든 파티클이 사라졌으면 wishMessage 제거
      const allGone = state.wishMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );
      if (allGone) {
        console.log('🗑️ wishMessage cleared after dispersing');
        state.wishMessage = null;
      }
    }

    // 한글 경고 메시지 렌더링 (왼쪽→오른쪽 순차 등장, 유지, 날아가기)
    if (state.koreanWarningMessage && state.koreanWarningMessage.length > 0) {
      const timeSinceWarning = Date.now() - state.koreanWarningStartTime;

      // 마지막 글자의 revealDelay 계산
      const lastLetterRevealDelay = Math.max(...state.koreanWarningMessage.map(l => l.revealDelay));

      state.koreanWarningMessage.forEach((msgLetter) => {
        msgLetter.update();

        // 순차적으로 드러남 (왼쪽→오른쪽)
        if (timeSinceWarning > msgLetter.revealDelay && !msgLetter.revealed) {
          msgLetter.revealed = true;
        }

        // 드러난 글자 페이드인
        if (msgLetter.revealed) {
          msgLetter.particles.forEach(p => {
            // 날아가지 않는 파티클만 페이드인 적용
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.04; // 빠르게 나타남
            }
          });
        }

        // 마지막 글자가 드러난 후 3초 후 날아가기 시작
        const disperseStartTime = lastLetterRevealDelay + 3000;
        if (timeSinceWarning > disperseStartTime && msgLetter.revealed && !msgLetter.dispersed) {
          msgLetter.dispersed = true;
          // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
          msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
        }

        msgLetter.draw(ctx);
      });

      // 모든 글자가 완전히 사라졌으면 정리
      const allGone = state.koreanWarningMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );

      if (allGone) {
        state.koreanWarningMessage = null;
        console.log('🗑️ Korean warning message cleared');
      }
    }

    // touch 힌트 메시지 렌더링 (한글 힌트와 동일한 로직)
    if (state.touchHintMessage && state.touchHintMessage.length > 0) {
      const timeSinceHint = Date.now() - state.touchHintStartTime;

      // 마지막 글자의 revealDelay 계산
      const lastLetterRevealDelay = Math.max(...state.touchHintMessage.map(l => l.revealDelay));

      state.touchHintMessage.forEach((msgLetter) => {
        msgLetter.update();

        // 순차적으로 드러남
        if (timeSinceHint > msgLetter.revealDelay && !msgLetter.revealed) {
          msgLetter.revealed = true;
        }

        // 드러난 글자 페이드인
        if (msgLetter.revealed) {
          msgLetter.particles.forEach(p => {
            // 날아가지 않는 파티클만 페이드인 적용
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.03; // 빠르게 나타남
            }
          });
        }

        // 마지막 글자가 드러난 후 3초 후 날아가기 시작
        const disperseStartTime = lastLetterRevealDelay + 3000;
        if (timeSinceHint > disperseStartTime && msgLetter.revealed && !msgLetter.dispersed) {
          msgLetter.dispersed = true;
          // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
          msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
        }

        msgLetter.draw(ctx);
      });

      // 모든 글자가 완전히 사라졌으면 정리
      const allGone = state.touchHintMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );

      if (allGone) {
        state.touchHintMessage = null;
        console.log('💡 Touch hint message cleared');
      }
    }

    // 클릭 힌트 메시지 렌더링 (한글 힌트와 동일한 로직)
    if (state.clickHintMessage && state.clickHintMessage.length > 0) {
      const timeSinceHint = Date.now() - state.clickHintStartTime;

      // 마지막 글자의 revealDelay 계산
      const lastLetterRevealDelay = Math.max(...state.clickHintMessage.map(l => l.revealDelay));

      state.clickHintMessage.forEach((msgLetter) => {
        msgLetter.update();

        // 순차적으로 드러남
        if (timeSinceHint > msgLetter.revealDelay && !msgLetter.revealed) {
          msgLetter.revealed = true;
        }

        // 드러난 글자 페이드인
        if (msgLetter.revealed) {
          msgLetter.particles.forEach(p => {
            // 날아가지 않는 파티클만 페이드인 적용
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.03; // 빠르게 나타남
            }
          });
        }

        // 마지막 글자가 드러난 후 3초 후 날아가기 시작
        const disperseStartTime = lastLetterRevealDelay + 3000;
        if (timeSinceHint > disperseStartTime && msgLetter.revealed && !msgLetter.dispersed) {
          msgLetter.dispersed = true;
          // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
          msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
        }

        msgLetter.draw(ctx);
      });

      // 모든 글자가 완전히 사라졌으면 정리
      const allGone = state.clickHintMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );

      if (allGone) {
        state.clickHintMessage = null;
        console.log('💡 Click hint message cleared');
      }
    }

    // Enter 힌트 메시지 렌더링 (한글 힌트와 동일한 로직)
    if (state.enterHintMessage && state.enterHintMessage.length > 0) {
      const timeSinceHint = Date.now() - state.enterHintStartTime;

      // 마지막 글자의 revealDelay 계산
      const lastLetterRevealDelay = Math.max(...state.enterHintMessage.map(l => l.revealDelay));

      state.enterHintMessage.forEach((msgLetter) => {
        msgLetter.update();

        // 순차적으로 드러남
        if (timeSinceHint > msgLetter.revealDelay && !msgLetter.revealed) {
          msgLetter.revealed = true;
        }

        // 드러난 글자 페이드인
        if (msgLetter.revealed) {
          msgLetter.particles.forEach(p => {
            // 날아가지 않는 파티클만 페이드인 적용
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.03; // 빠르게 나타남
            }
          });
        }

        // 마지막 글자가 드러난 후 3초 후 날아가기 시작
        const disperseStartTime = lastLetterRevealDelay + 3000;
        if (timeSinceHint > disperseStartTime && msgLetter.revealed && !msgLetter.dispersed) {
          msgLetter.dispersed = true;
          // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록 (일반 글자와 동일)
          msgLetter.particles.forEach(p => p.disperse(msgLetter.x));
        }

        msgLetter.draw(ctx);
      });

      // 모든 글자가 완전히 사라졌으면 정리
      const allGone = state.enterHintMessage.every(letter =>
        letter.particles.every(p => p.alpha <= 0)
      );

      if (allGone) {
        state.enterHintMessage = null;
        console.log('💡 Enter hint message cleared');
      }
    }

    // 모래 커튼 애니메이션 (화면 전환 효과) - 맨 위 레이어
    if (state.isExploding || state.explosionParticles.length > 0 || state.introMessage || state.wishMessage) {
      const explosionElapsed = (Date.now() - state.explosionStartTime) / 1000;

      // 타이밍 디버깅 제거 (성능 최적화)

      // 주둥이에서 계속 파티클 생성 (처음 1.5초 동안만 - 더 길게)
      if (state.isExploding && explosionElapsed < 1.5) {
        // 고정된 화면 좌표 사용 (주둥이 끝 위치)
        const spoutX = 469;
        const spoutY = 325; // 아주 살짝 위로 (329 → 325)

        // 왼쪽으로 나가도록 고정 (주둥이가 왼쪽을 향함)
        const direction = -1;

        // 매 프레임마다 파티클 생성 (2배로!)
        for (let i = 0; i < 200; i++) {
          // 주둥이 입구에서 시작 (완전히 한 점에서)
          const offsetX = 0;
          const offsetY = 0;
          const startX = spoutX + offsetX;
          const startY = spoutY + offsetY;

          // 매우 짧은 딜레이로 뾰족하게 (삼각형 끝처럼)
          const spawnDelay = Math.random() * 600; // 0~50ms (매우 짧게)

          state.explosionParticles.push(new SandCurtainParticle(startX, startY, direction, spawnDelay));
        }
      }

      // 파티클 업데이트 및 그리기 (파티클이 있을 때만)
      if (state.explosionParticles.length > 0) {
        state.explosionParticles.forEach(p => {
          p.update();
          p.draw(ctx);
        });

        // 죽은 파티클 제거
        state.explosionParticles = state.explosionParticles.filter(p => !p.isDead());
      }

      // 0.3초 후 중간 메시지 생성 (커튼과 함께 드러남)
      if (explosionElapsed > 0.3 && !state.introMessage && !state.wishMessage) {
        createIntroMessage(state, getBackgroundColorAtFunc, createEnterHintFunc);
      }

      // 9.0초 후 "Make your wish" 메시지 생성 (introMessage가 날아가면서) - 한 번만
      if (explosionElapsed > 9.0 && state.introMessage && !state.wishMessageCreated) {
        createWishMessage(state, getBackgroundColorAtFunc, createEnterHintFunc);
        state.wishMessageCreated = true; // 플래그 설정으로 재생성 방지
      }

      // wishMessage가 생성된 후에만 종료
      if (explosionElapsed > 9.0 && state.explosionParticles.length === 0 && state.wishMessage) {
        if (state.isExploding) { // 상태가 변경될 때만 로그 출력
          console.log('🎬 Animation sequence completed!');
        }
        state.isExploding = false;
      }
    }

    // 배경 전환 파티클 애니메이션 (최상위 레이어)
    if (state.isTransitioningBackground) {
      const transitionElapsed = (Date.now() - state.transitionStartTime) / 1000;

      // 파티클 생성 (처음 0.5초 동안만 생성, 모든 소원에서 표시)
      if (transitionElapsed < 0.5) {
        // 화면을 완전히 덮기 위해 대량 파티클 생성
        for (let i = 0; i < 200; i++) {
          const startX = -50; // 화면 왼쪽 밖에서 시작
          const startY = Math.random() * canvas.height; // 전체 높이에 균등 분포

          state.backgroundTransitionParticles.push(
            new BackgroundTransitionParticle(startX, startY)
          );
        }
      }

      // 파티클 업데이트 및 그리기
      if (state.backgroundTransitionParticles.length > 0) {
        state.backgroundTransitionParticles.forEach(p => {
          p.update();
          p.draw(ctx);
        });

        // 죽은 파티클 제거 (성능 향상)
        const beforeCount = state.backgroundTransitionParticles.length;
        state.backgroundTransitionParticles = state.backgroundTransitionParticles.filter(p => !p.isDead());
        const afterCount = state.backgroundTransitionParticles.length;
        
        if (beforeCount !== afterCount) {
          console.log(`🗑️ Transition particles cleaned: ${beforeCount} → ${afterCount}`);
        }

        // 파티클의 선두(오른쪽 끝)와 후미(왼쪽 끝) 위치 계산
        const frontX = state.backgroundTransitionParticles.length > 0 
          ? Math.max(...state.backgroundTransitionParticles.map(p => p.x), 0) 
          : 0;
        const backX = state.backgroundTransitionParticles.length > 0 
          ? Math.min(...state.backgroundTransitionParticles.map(p => p.x), 0) 
          : 0;

        const progress = Math.min(Math.max(frontX / canvas.width, 0), 1);

        // 오버레이를 파티클 선두 위치까지만 드러냄 (왼쪽부터 점진적으로)
        const overlay = document.getElementById('background-overlay');
        if (overlay) {
          const revealPercent = progress * 100;
          // inset(top right bottom left) - right를 조정해서 왼쪽부터 드러냄
          overlay.style.clipPath = `inset(0 ${100 - revealPercent}% 0 0)`;
        }

        // 지니 반응 메시지를 배경 전환보다 1초 먼저 생성 (파티클 중간에)
        if (transitionElapsed > 2.0) {
          console.log('🔍 Checking genie response:', {
            hasPending: !!state.pendingGenieResponse,
            pending: state.pendingGenieResponse,
            creating: state.genieResponseCreating,
            elapsed: transitionElapsed.toFixed(2)
          });
        }
        
        if (state.pendingGenieResponse && !state.genieResponseCreating && transitionElapsed > 2.0) {
          console.log('🧞 Creating genie response DURING transition (1s early):', state.pendingGenieResponse);
          state.genieResponseCreating = true; // 중복 생성 방지
          createGenieResponseMessage(state.pendingGenieResponse, state, getBackgroundColorAtFunc, createEnterHintFunc);
          state.pendingGenieResponse = null;
        }
      }

      // 전환 완료 조건 - 파티클이 모두 사라질 때까지 기다림
      const shouldComplete = 
        state.backgroundTransitionParticles.length === 0 && transitionElapsed > 2.0;

      if (shouldComplete) {
        console.log('✅ Background transition complete at', transitionElapsed.toFixed(2), 's');

        // 새 배경을 실제 body로 교체
        if (state.pendingBackgroundImage) {
          document.body.style.backgroundImage = `url('${state.pendingBackgroundImage}')`;
          console.log('🖼️ Final background swap complete');
        }

        // 오버레이 초기화
        const overlay = document.getElementById('background-overlay');
        if (overlay) {
          overlay.style.backgroundImage = 'none';
          overlay.style.clipPath = 'inset(0 100% 0 0)';
        }

        // 상태 정리
        state.isTransitioningBackground = false;
        state.backgroundTransitionParticles = [];
        state.pendingBackgroundImage = null;
        state.genieResponseCreating = false; // 다음 전환을 위해 리셋
      }
    }

    // Genie response 메시지 렌더링 (배경 전환 파티클 위에 그리기)
    // Make your wish를 대체하는 메시지이므로 새로운 소원이 입력될 때까지 계속 유지됨
    if (state.genieResponseMessage && state.genieResponseMessage.length > 0) {
      const timeSinceResponse = (Date.now() - state.genieResponseStartTime) / 1000;

      // 디버깅: 첫 프레임에만 로그
      if (!state.genieResponseLogged) {
        console.log('🎨 Rendering genieResponseMessage, letters:', state.genieResponseMessage.length, 'time:', timeSinceResponse.toFixed(2));
        state.genieResponseLogged = true;
      }

      state.genieResponseMessage.forEach((msgLetter, index) => {
        msgLetter.update();

        // 즉시 순차적으로 드러남
        if (timeSinceResponse > msgLetter.revealDelay) {
          if (!msgLetter.revealed) {
            msgLetter.revealed = true;
          }

          // 파티클 알파 증가 (페이드인) - dispersing 중이 아닐 때만
          msgLetter.particles.forEach(p => {
            if (!p.dispersing && p.alpha < p.targetAlpha) {
              p.alpha += 0.04; // 빠르게 나타남
            }
          });
        }

        // 일렁이는 효과 (드러난 글자만, dispersing 중이 아닐 때만)
        // wishMessage와 동일하게 계속 일렁이며 유지됨
        if (msgLetter.revealed && !msgLetter.dispersing) {
          const waveOffset = Math.sin(Date.now() * 0.002 + index * 0.3) * 5;

          msgLetter.particles.forEach(p => {
            if (!p.dispersing) {
              p.y = p.originalY + waveOffset;
            }
          });
        }

        msgLetter.draw(ctx);
      });

      // dispersing 시작 후 모든 파티클이 사라졌을 때만 제거 (background.js에서 처리)
      const allGone = state.genieResponseMessage.every(letter =>
        letter.dispersing && letter.particles.every(p => p.alpha <= 0)
      );
      
      if (allGone) {
        console.log('🗑️ genieResponseMessage cleared after dispersing');
        state.genieResponseMessage = null;
        state.genieResponseLogged = false; // 다음 메시지를 위해 리셋
      }
    }

    // 타이핑 중이 아니면 마우스 위치를 따라감
    if (!state.isTyping) {
      state.currentX = state.mouseX;
      state.currentY = state.mouseY;
    }

    requestAnimationFrame(animate);
  }

  animate();
}
