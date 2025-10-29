// Particle classes

// 모래 커튼 파티클 클래스 (입체적 화면 전환)
export class SandCurtainParticle {
  constructor(x, y, direction, spawnDelay) {
    this.spawnDelay = spawnDelay;
    this.spawned = false;

    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    // 훨씬 더 다양한 크기 (작은 입자부터 큰 입자까지)
    const sizeRandom = Math.random();
    this.baseSize = sizeRandom < 0.6
      ? Math.random() * 0.5 + 0.2 // 60%는 작은 입자 (0.2~0.7)
      : Math.random() * 1.5 + 0.5;   // 40%는 큰 입자 (0.5~2.0)
    this.size = this.baseSize;

    // 황금색 파티클 (지니의 마법 같은 느낌)
    const hue = 40 + Math.random() * 15; // 40~55 (황금색)
    const saturation = 70 + Math.random() * 20; // 70~90 (높은 채도)
    const lightness = 50 + Math.random() * 20; // 50~70 (밝은 황금색)
    this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    this.direction = direction; // 1: 오른쪽, -1: 왼쪽

    // 좁은 범위로 방사 (한 점에서 집중적으로)
    const angleVariation = (Math.random() - 0.3) * 1.0; // -0.3~0.7 라디안 (좁게)
    const baseSpeed = Math.random() * 20 + 15; // 15~35 (더 다양한 속도)
    this.vx = direction * baseSpeed * Math.cos(angleVariation);
    this.vy = baseSpeed * Math.sin(angleVariation);

    // 중력 효과
    this.gravity = 0.15 + Math.random() * 0.1; // 0.15~0.25 (개별 중력)

    // 랜덤 요소 추가 (불규칙성)
    this.randomOffset = Math.random();
    this.curveStrength = (Math.random() - 0.5) * 0.5; // 곡선 강도 증가

    // 회전 효과
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2; // -0.1~0.1

    // 투명도 랜덤 변화
    this.baseAlpha = 0.7 + Math.random() * 0.3; // 0.7~1.0
    this.alphaFlicker = Math.random() * 0.1; // 깜빡임 강도

    this.z = 0;
    this.vz = 0;

    this.phase = 0;
    this.alpha = this.baseAlpha;
    this.createdAt = Date.now();
  }

  update() {
    if (!this.spawned) {
      if (Date.now() - this.createdAt > this.spawnDelay) {
        this.spawned = true;
      } else {
        return;
      }
    }

    const elapsed = (Date.now() - this.createdAt - this.spawnDelay) / 1000;

    if (this.phase === 0) {
      // Phase 0: 주둥이에서 화면 밖으로 (0~0.7초) - 곡선 궤적 + 중력
      // 중력 적용
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;

      // 곡선 움직임 추가 (불규칙한 곡선으로 퍼짐)
      this.vy += Math.sin(elapsed * 8 + this.randomOffset * 20) * this.curveStrength * 5;
      this.vx += Math.cos(elapsed * 6 + this.randomOffset * 15) * this.curveStrength * 3;

      // 회전
      this.rotation += this.rotationSpeed;

      // 투명도 깜빡임 (자연스러운 변화)
      this.alpha = this.baseAlpha + Math.sin(elapsed * 10 + this.randomOffset * 20) * this.alphaFlicker;

      // 화면 완전히 벗어날 때까지
      const reachedEdge = this.direction > 0
        ? this.x > window.innerWidth + 150
        : this.x < -150;

      if (reachedEdge || elapsed > 0.7) {
        this.phase = 1;
        // y 위치를 화면 전체로 재배치
        this.targetY = Math.random() * window.innerHeight;
      }
    } else if (this.phase === 1) {
      // Phase 1: 화면 밖에서 y 재배치하며 같은 쪽 화면 끝으로 (0.7~1.0초)
      this.y += (this.targetY - this.y) * 0.2;

      // 같은 쪽 화면 끝으로 이동
      const edgeX = this.direction > 0 ? window.innerWidth + 100 : -100;
      this.x += (edgeX - this.x) * 0.2;

      if (elapsed > 1.0) {
        this.phase = 2;
        this.x = edgeX;
        this.sweepStartX = this.x;
      }
    } else if (this.phase === 2) {
      // Phase 2: 같은 쪽에서 들어와 반대편으로 이동하며 점진적으로 커짐 (1.0~3초)
      // x 이동 거리로 진행도 계산
      const totalDistance = window.innerWidth + 300;
      const startX = this.sweepStartX;
      const currentDistance = Math.abs(this.x - startX);
      const sweepProgress = Math.min(1, currentDistance / totalDistance);

      // 이동하면서 크기가 점진적으로 커짐
      const minScale = 0.3 + this.randomOffset * 0.5; // 0.3~0.8
      const maxScale = 4.5 + this.randomOffset * 4.5; // 4.5~9.0 (1.5배 확대)
      const scale = minScale + sweepProgress * (maxScale - minScale);
      this.size = this.baseSize * scale;

      // 반대편으로 빠르게 이동 (속도도 약간 랜덤)
      this.vx = -this.direction * (45 + this.randomOffset * 10);
      this.x += this.vx;

      // y도 불규칙하게 이동 + shake 효과
      const shakeX = Math.sin(elapsed * 15 + this.randomOffset * 30) * 2;
      const shakeY = Math.sin(elapsed * 12 + this.randomOffset * 25) * 3;
      this.x += shakeX;
      this.y += shakeY + Math.sin(elapsed * 5 + this.randomOffset * 10) * 4;

      // 회전 지속
      this.rotation += this.rotationSpeed * (1 + sweepProgress);

      // 투명도 변화 (가까워질수록 약간 더 불투명)
      this.alpha = this.baseAlpha * (0.7 + sweepProgress * 0.3) +
        Math.sin(elapsed * 8 + this.randomOffset * 15) * this.alphaFlicker;

      // 화면 반대편 벗어나면 사라짐
      if ((this.direction > 0 && this.x < -200) ||
        (this.direction < 0 && this.x > window.innerWidth + 200)) {
        this.phase = 3;
      }
    } else if (this.phase === 3) {
      // Phase 3: 빠르게 사라짐
      this.alpha -= 0.1;
    }
  }

  draw(ctx) {
    if (this.alpha > 0 && this.spawned) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // 약간 불규칙한 모양 (완벽한 원이 아닌)
      ctx.fillStyle = this.color;
      ctx.beginPath();

      // 타원형으로 그려서 더 자연스럽게
      const scaleX = 1 + Math.sin(this.randomOffset * 10) * 0.2;
      const scaleY = 1 + Math.cos(this.randomOffset * 10) * 0.2;
      ctx.scale(scaleX, scaleY);
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();

      // 부드러운 엣지 효과 (약간의 블러)
      if (this.size > 0.8) {
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha)) * 0.3;
        ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  isDead() {
    return this.alpha <= 0;
  }
}

// 입자(모래알) 클래스
export class Particle {
  constructor(x, y, letterIndex, getBackgroundColorAt) {
    // 위치 (처음부터 최종 위치에 생성)
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.letterIndex = letterIndex;
    this.size = Math.random() * 0.4 + 0.3; // 0.3~0.7 사이의 매우 작은 입자
    this.color = null; // 배경색에 따라 동적으로 변경되도록 null로 설정
    this.velocityX = 0;
    this.velocityY = 0;
    this.forming = true; // 형성 중
    this.dispersing = false;
    this.disperseDelay = 0; // 흩어지기 전 딜레이
    this.alpha = 0; // 투명하게 시작
    this.targetAlpha = 1; // 목표 투명도
    this.fadeInDelay = Math.random() * 40; // 0~40 프레임 랜덤 딜레이
    this.fadeInSpeed = Math.random() * 0.02 + 0.015; // 0.015~0.035 랜덤 속도 (더 느리게)
    this.getBackgroundColorAt = getBackgroundColorAt; // 배경색 가져오기 함수
  }

  update() {
    if (this.forming) {
      // 랜덤 딜레이 후 opacity만 서서히 증가
      if (this.fadeInDelay > 0) {
        this.fadeInDelay--;
      } else {
        this.alpha += this.fadeInSpeed;
        if (this.alpha >= this.targetAlpha) {
          this.alpha = this.targetAlpha;
          this.forming = false;
        }
      }
    } else if (this.dispersing) {
      // 딜레이가 있으면 대기
      if (this.disperseDelay > 0) {
        this.disperseDelay--;
        return;
      }

      // 바람에 날아가는 효과 (더 느리게)
      this.velocityX += 0.1; // 0.15 -> 0.1
      this.velocityY += (Math.random() - 0.5) * 0.2; // 0.3 -> 0.2

      // 바람에 흔들림
      this.velocityY += Math.sin(Date.now() * 0.01 + this.x) * 0.08; // 0.1 -> 0.08

      this.x += this.velocityX;
      this.y += this.velocityY;
      this.alpha -= 0.008; // 0.012 -> 0.008 (더 천천히 사라짐)
    }
  }

  draw(ctx) {
    if (this.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      // 파티클에 고유 색상이 있으면 사용, 없으면 배경에 따라 동적 변경
      const fillColor = this.color || this.getBackgroundColorAt(this.x, this.y);
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  disperse(baseX) {
    this.forming = false;
    this.dispersing = true;

    // 왼쪽 파티클부터 먼저 날아가도록 딜레이 설정 (더 느리게)
    const relativeX = this.x - baseX;
    this.disperseDelay = Math.max(0, relativeX * 0.4); // 0.25 -> 0.4로 늘림

    // 초기 속도도 약간 느리게
    this.velocityX = Math.random() * 1.5 + 0.8; // 2+1 -> 1.5+0.8
    this.velocityY = (Math.random() - 0.7) * 1.5; // *2 -> *1.5
  }
}
