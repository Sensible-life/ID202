# 🔊 오디오 시스템 가이드

## 개요
Web Audio API 기반 실시간 사운드 합성 시스템으로, 소원 종류에 따라 자동으로 배경음을 생성하고 시각 효과와 동기화합니다.

## 구현된 기능

### 1. 소원 종류별 자동 사운드 재생

#### 하프 소리 (평화로운 소원)
- **대상**: love, happiness, peace, family
- **특징**: C-E-G-C 메이저 코드, 부드러운 아르페지오
- **지속**: 약 3초

#### 북소리 (강력한 소원)  
- **대상**: success, wealth, power, victory
- **특징**: 베이스 드럼 효과, 150Hz → 50Hz 하강
- **지속**: 0.5초

#### 바람소리 (자연 소원)
- **대상**: ocean, forest, mountain, river  
- **특징**: 화이트 노이즈 + 밴드패스 필터
- **지속**: 2.5~4초

#### 종소리 (신비로운 소원)
- **대상**: space, aurora, magic, dream
- **특징**: 800~1600Hz 배음, 순차적 울림
- **지속**: 약 3초

### 2. 인터랙션 사운드

#### 램프 흔들림 사운드
- **트리거**: touch 키워드 입력 시
- **특징**: 금속 울림 (200, 400, 600, 1000Hz 배음)
- **강도**: 터치 횟수에 따라 점진적 증가

#### 배경 전환 사운드
- **트리거**: 소원 배경 전환 시
- **특징**: 200Hz → 800Hz 상승 스윕
- **지속**: 2초

## 사용 방법

### 1. 자동 초기화
```javascript
// 첫 사용자 인터랙션(클릭/키입력) 시 자동 초기화
// 브라우저 정책상 사용자 인터랙션 필요
```

### 2. 볼륨 조절
```javascript
import { audioSystem } from './js/audio.js';

// 볼륨 설정 (0.0 ~ 1.0)
audioSystem.setVolume(0.5); // 50%
```

### 3. 수동 사운드 재생
```javascript
// 하프
audioSystem.playHarp(duration);

// 북
audioSystem.playDrum(intensity);

// 바람
audioSystem.playWind(duration);

// 종
audioSystem.playBell(pitch);

// 램프 흔들림
audioSystem.playLampShake(intensity);

// 배경 전환
audioSystem.playTransitionSweep();
```

## 시각 효과 동기화

### 현재 구현
1. **소원 입력 → 램프 흔들림 사운드** (즉시)
2. **램프 흔들림 → 소원 종류별 사운드** (동시)
3. **배경 전환 시작 → 스윕 사운드** (1.8초 후)

### 추가 가능한 동기화
```javascript
// 파티클 생성 시 pitch 상승
const particleCount = state.backgroundTransitionParticles.length;
const pitchMultiplier = 1 + (particleCount / 1000) * 0.2;
audioSystem.playBell(pitchMultiplier);

// 지니 메시지 표시 시 종소리
audioSystem.playBell(1.0);
```

## 성능 최적화

- **동시 재생 제한**: Map으로 active sounds 관리
- **자동 정리**: 사운드 종료 시 자동 disconnect
- **메모리 효율**: BufferSource 재사용 없이 매번 생성

## 브라우저 호환성

✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari 14.1+
⚠️ iOS Safari (음소거 스위치 영향)

## 확장 아이디어

### 1. 음성 합성 추가
```javascript
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance("Your wish is granted");
utterance.pitch = 0.8;
utterance.rate = 0.9;
synth.speak(utterance);
```

### 2. 실시간 pitch 변조
```javascript
// 파티클 개수에 따라 pitch 자동 조절
osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, now);
```

### 3. 공간 오디오 (Panner)
```javascript
const panner = audioContext.createPanner();
panner.setPosition(x, y, z); // 3D 위치 기반 사운드
```

### 4. 리버브 효과
```javascript
const convolver = audioContext.createConvolver();
// Impulse response로 공간감 추가
```

## 주의사항

1. **사용자 인터랙션 필수**: 브라우저 autoplay 정책상 첫 인터랙션 후에만 사운드 재생 가능
2. **볼륨 조절**: 기본 30%로 설정 (masterGain.gain.value = 0.3)
3. **모바일 최적화**: iOS에서는 음소거 스위치 상태 확인 필요

## 문제 해결

### 소리가 안 나요
1. 브라우저 콘솔에서 "Audio system initialized" 확인
2. 사용자 인터랙션(클릭/키입력) 후 테스트
3. 브라우저 음소거 상태 확인

### 소리가 작아요
```javascript
audioSystem.setVolume(0.8); // 볼륨 증가
```

### 특정 소원에 사운드 추가
```javascript
// audio.js의 soundMap에 추가
const soundMap = {
  'mynewkeyword': () => this.playHarp(),
  // ...
};
```
