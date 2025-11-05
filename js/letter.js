// Letter class
import { Particle } from './particles.js';

export class Letter {
  constructor(char, x, y, index, customFontSize = 80, sentenceId = 0, state, getBackgroundColorAt, createEnterHint) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.index = index; // 글자 생성 순서
    this.fontSize = customFontSize; // 커스텀 폰트 크기
    this.particles = [];
    this.createdAt = Date.now();
    this.dispersed = false;
    this.width = 0; // 글자 너비
    this.sentenceId = sentenceId; // 문장 ID
    this.sentenceStartTime = Date.now(); // 이 문장이 시작된 시간
    this.state = state;
    this.getBackgroundColorAt = getBackgroundColorAt;
    this.createEnterHint = createEnterHint;

    this.createParticles();
  }

  createParticles() {
    const startTime = performance.now();
    
    // 임시 캔버스에 글자 그리기
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const fontSize = this.fontSize;
    tempCanvas.width = fontSize * 2;
    tempCanvas.height = fontSize * 2;

    // 아라비안 나이트 느낌의 우아하고 흐르는 듯한 폰트
    tempCtx.font = `italic bold ${fontSize}px 'Cormorant Garamond', serif`;

    // 글자 너비 측정
    const metrics = tempCtx.measureText(this.char);
    this.width = metrics.width;

    tempCtx.fillStyle = 'white';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(this.char, fontSize, fontSize);

    // 픽셀 데이터 가져오기
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;

    const particleCreationStart = performance.now();
    let colorSampleTime = 0;
    let colorSampleCount = 0;

    // 모래 입자 생성 (픽셀 샘플링)
    const mainParticles = [];
    for (let y = 0; y < tempCanvas.height; y += 1) {
      for (let x = 0; x < tempCanvas.width; x += 1) {
        const index = (y * tempCanvas.width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 128) { // 불투명한 픽셀에만 입자 생성
          // 위치에 약간의 랜덤 오프셋 추가 (더 자연스러운 모래 느낌)
          const offsetX = (Math.random() - 0.5) * 2;
          const offsetY = (Math.random() - 0.5) * 2;
          const px = this.x + x - fontSize + offsetX;
          const py = this.y + y - fontSize + offsetY;
          
          // 생성 시 색상을 미리 가져와서 고정 (성능 최적화)
          const colorStart = performance.now();
          const particleColor = this.getBackgroundColorAt(px, py);
          colorSampleTime += performance.now() - colorStart;
          colorSampleCount++;
          
          const particle = new Particle(px, py, this.state.letters.length, this.getBackgroundColorAt);
          particle.color = particleColor; // 색상 고정
          
          this.particles.push(particle);
          mainParticles.push({ x: px, y: py });
        }
      }
    }

    // 글자 주변에 추가 랜덤 파티클 생성 (모래가 흩어진 느낌)
    // 글자 크기에 따라 추가 파티클 비율 조정 (작은 글씨는 적게)
    const extraParticleRatio = Math.min(0.5, (fontSize / 80) * 0.5);
    const extraParticleCount = Math.floor(mainParticles.length * extraParticleRatio);

    for (let i = 0; i < extraParticleCount; i++) {
      // 기존 파티클 중 랜덤하게 선택
      const baseParticle = mainParticles[Math.floor(Math.random() * mainParticles.length)];
      if (baseParticle) {
        // 주변 3~10픽셀 범위에 랜덤 배치
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 7 + 3;
        const px = baseParticle.x + Math.cos(angle) * distance;
        const py = baseParticle.y + Math.sin(angle) * distance;
        
        // 생성 시 색상을 미리 가져와서 고정 (성능 최적화)
        const colorStart = performance.now();
        const particleColor = this.getBackgroundColorAt(px, py);
        colorSampleTime += performance.now() - colorStart;
        colorSampleCount++;
        
        const particle = new Particle(px, py, this.state.letters.length, this.getBackgroundColorAt);
        particle.color = particleColor; // 색상 고정
        
        this.particles.push(particle);
      }
    }
    
    const totalTime = performance.now() - startTime;
    if (totalTime > 5) { // 5ms 이상 걸리면 로그
      console.warn(`⏱️ Letter '${this.char}' creation took ${totalTime.toFixed(2)}ms`, {
        totalParticles: this.particles.length,
        colorSampleCount,
        avgColorSampleTime: (colorSampleTime / colorSampleCount).toFixed(3) + 'ms',
        totalColorSampleTime: colorSampleTime.toFixed(2) + 'ms'
      });
    }
  }

  update() {
    // 특별 메시지들은 별도 처리
    if (this.isWishMessage || this.isGenieResponse || this.isIntroMessage || this.isKoreanWarning || this.isTouchHint || this.isClickHint || this.isEnterHint) {
      this.particles.forEach(p => p.update());
      return;
    }

    // 이 문장의 마지막 입력 시간 찾기 (같은 sentenceId를 가진 글자들 중)
    const sameSentenceLetters = this.state.letters.filter(l => l.sentenceId === this.sentenceId);
    const sentenceLastInputTime = Math.max(...sameSentenceLetters.map(l => l.createdAt));

    // 이 문장 기준으로 시간 계산
    const timeSinceSentenceLastInput = Date.now() - sentenceLastInputTime;
    const timeSinceCreation = Date.now() - this.createdAt;

    // 같은 문장 내에서의 인덱스 계산
    const sentenceIndex = sameSentenceLetters.findIndex(l => l === this);

    // 기본 대기 시간 (wishMessage 이후에는 더 오래 유지: 3초)
    const baseDelay = this.state.wishMessage ? 4500 : 1500;
    const disperseDelay = baseDelay + (Math.pow(sentenceIndex, 0.6) * 150);

    // 형성이 완료되고(1.5초 경과) + 문장 마지막 입력 + 순차 딜레이 후 흩어짐
    if (!this.dispersed && timeSinceCreation > 1500 && timeSinceSentenceLastInput > disperseDelay) {
      this.dispersed = true;

      // 문장의 마지막 글자일 때만 체크
      const isLastInSentence = sentenceIndex === sameSentenceLetters.length - 1;
      if (isLastInSentence) {
        // Enter로 완료된 문장이 아닐 때만 카운터 증가
        if (!this.state.sentencesWithEnter.has(this.sentenceId)) {
          this.state.sentencesWithoutEnter++;
          console.log(`📝 Sentence ${this.sentenceId} dispersed without Enter. Count: ${this.state.sentencesWithoutEnter}`);

          // 3번째 엔터 없이 사라진 문장이면 Enter 힌트 생성
          if (this.state.sentencesWithoutEnter >= 3 && !this.state.wishMessage && !this.state.enterHintShown) {
            this.createEnterHint();
            this.state.sentencesWithoutEnter = 0; // 리셋
          }
        } else {
          console.log(`✅ Sentence ${this.sentenceId} was completed with Enter, not counting`);
        }
      }

      // 글자의 x 위치를 기준으로 왼쪽부터 날아가도록
      this.particles.forEach(p => p.disperse(this.x));
    }

    this.particles.forEach(p => p.update());
  }

  checkShouldDisperse() {
    // 형성이 완료되었는지 확인
    const timeSinceCreation = Date.now() - this.createdAt;
    return timeSinceCreation > 1000;
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  isFinished() {
    // 모든 입자가 사라졌는지 확인
    return this.dispersed && this.particles.every(p => p.alpha <= 0);
  }
}
