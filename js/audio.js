// Audio system using Web Audio API
// 소원 종류별 배경음 자동 재생 및 시각 효과 동기화

class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initialized = false;
    this.soundBuffers = {}; // 로드된 사운드 버퍼 저장
    
    // 현재 재생 중인 사운드들
    this.activeSounds = new Map();
    
    // TTS 설정
    this.speechSynthesis = window.speechSynthesis;
    this.genieVoice = null;
    this.loadGenieVoice();
  }

  // 지니 목소리 설정 로드
  loadGenieVoice() {
    // 음성 목록이 로드될 때까지 대기
    const setVoice = () => {
      const voices = this.speechSynthesis.getVoices();
      
      // 우선순위: 낮은 톤의 남성 영어 음성
      // 1. Google UK English Male (매우 낮고 근엄함)
      // 2. Google US English (Daniel)
      // 3. 기타 남성 음성
      this.genieVoice = voices.find(v => v.name.includes('Google UK English Male')) ||
                        voices.find(v => v.name.includes('Daniel')) ||
                        voices.find(v => v.name.includes('Male') && v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0]; // 폴백
      
      if (this.genieVoice) {
        console.log('🎙️ Genie voice loaded:', this.genieVoice.name);
      }
    };

    // 음성 목록이 비동기로 로드됨
    if (this.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      this.speechSynthesis.addEventListener('voiceschanged', setVoice);
    }
  }

  // 지니 음성으로 텍스트 읽기
  speakAsGenie(text) {
    console.log(`🎙️ speakAsGenie called with: "${text}"`);
    
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // 이전 음성 중단
    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 지니 목소리 설정
    if (this.genieVoice) {
      utterance.voice = this.genieVoice;
      console.log(`🎙️ Using voice: ${this.genieVoice.name}`);
    } else {
      console.warn('⚠️ No genie voice loaded yet');
    }
    
    // 낮고 느리고 근엄한 톤
    utterance.pitch = 0.3;  // 매우 낮은 음높이 (0~2, 기본 1)
    utterance.rate = 0.7;   // 느린 속도 (0.1~10, 기본 1)
    utterance.volume = 0.9; // 볼륨 (0~1)
    
    console.log(`🎙️ Speaking: "${text}" with pitch ${utterance.pitch}, rate ${utterance.rate}`);
    
    this.speechSynthesis.speak(utterance);
  }

  // 오디오 시스템 초기화 (사용자 인터랙션 후 호출 필요)
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.4; // 전체 볼륨 40%
      this.masterGain.connect(this.audioContext.destination);
      
      this.initialized = true;
      console.log('🔊 Audio system initialized');
      
      // 램프 흔들림 사운드 미리 로드
      this.loadLampShakeSound();
      
      // 하프 사운드 미리 로드 (화면 전환용)
      this.loadHarpSound();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // 로컬 오디오 파일 로드
  async loadLampShakeSound() {
    try {
      console.log('🔊 Loading lamp jingle sound...');
      
      const response = await fetch('./sounds/lamp_jingle.wav');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.soundBuffers.lampShake = audioBuffer;
      console.log('✅ Lamp jingle sound loaded successfully');
    } catch (error) {
      console.error('⚠️ Failed to load lamp jingle audio:', error);
    }
  }

  // 하프 사운드 로드 (화면 전환용)
  async loadHarpSound() {
    try {
      console.log('🔊 Loading harp sound...');
      
      const response = await fetch('./sounds/Harp.wav');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.soundBuffers.harp = audioBuffer;
      console.log('✅ Harp sound loaded successfully');
    } catch (error) {
      console.error('⚠️ Failed to load harp audio:', error);
    }
  }

  // 램프 애니메이션과 동기화된 사운드 재생
  playLampShakeWithAnimation(touchCount = 1) {
    if (!this.initialized || !this.soundBuffers.lampShake) {
      console.warn('Audio not ready');
      return;
    }

    const now = this.audioContext.currentTime;
    const buffer = this.soundBuffers.lampShake;
    
    // 애니메이션 지속 시간 (three-scene.js와 동일)
    const duration = touchCount === 1 ? 1.5 : (touchCount === 2 ? 2.5 : 4);
    
    // 오디오 재생 시간 계산 (전체 버퍼가 아닌 적절한 길이만)
    const playDuration = Math.min(duration * 0.8, buffer.duration); // 애니메이션의 80% 길이
    
    // 소스 노드 생성
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    
    // touch 횟수에 따른 피치 변화 (점점 빠르게)
    source.playbackRate.value = 0.9 + (touchCount * 0.1); // 0.9, 1.0, 1.1
    
    // Fade-in (0.1초)
    const fadeInDuration = 0.1;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + fadeInDuration);
    
    // 중간 유지 (애니메이션 peak까지)
    const peakTime = duration * 0.3; // 애니메이션 30% 지점에서 peak
    gainNode.gain.setValueAtTime(0.8, now + peakTime);
    
    // Fade-out (애니메이션과 함께 서서히 사라짐)
    const fadeOutStart = peakTime + 0.2;
    const fadeOutDuration = playDuration - fadeOutStart;
    gainNode.gain.linearRampToValueAtTime(0.01, now + playDuration);
    
    // 연결 및 재생
    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    source.start(now);
    source.stop(now + playDuration);
    
    console.log(`🔔 Playing lamp jingle (touch ${touchCount}, duration: ${playDuration.toFixed(2)}s)`);
  }

  // 하프 소리 생성 (평화로운 소원용: 사랑, 행복, 평화)
  playHarp(duration = 3) {
    if (!this.initialized) return;

    const now = this.audioContext.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C (major chord)
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // 부드러운 페이드 인/아웃
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 2);
      }, index * 200);
    });
  }

  // 북소리 생성 (강력한 소원용: 성공, 부, 권력)
  playDrum(intensity = 0.5) {
    if (!this.initialized) return;

    const now = this.audioContext.currentTime;
    
    // 베이스 드럼 효과
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    gain.gain.setValueAtTime(intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 바람소리 생성 (자연 소원용: ocean, forest, mountain)
  playWind(duration = 4) {
    if (!this.initialized) return;

    const now = this.audioContext.currentTime;
    
    // 화이트 노이즈 생성
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();
    
    noise.buffer = buffer;
    
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;
    
    // 바람이 서서히 불어오는 효과
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 1);
    gain.gain.linearRampToValueAtTime(0.1, now + duration - 1);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(now);
    noise.stop(now + duration);
  }

  // 종소리 생성 (신비로운 소원용: space, aurora, magic)
  playBell(pitch = 1.0) {
    if (!this.initialized) return;

    const now = this.audioContext.currentTime;
    const frequencies = [800, 1000, 1200, 1600].map(f => f * pitch);
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const delay = index * 0.1;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1 / (index + 1), now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 3);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now + delay);
      osc.stop(now + delay + 3);
    });
  }

  // 램프 흔들림 사운드 (레거시 - 하위 호환성)
  playLampShake(intensity = 0.3) {
    // 기본값으로 touch 1회 애니메이션 재생
    this.playLampShakeWithAnimation(1);
  }

  // 배경 전환 소리 (스윕 효과)
  // 배경 전환 시 하프 사운드 재생
  playTransitionSweep() {
    if (!this.initialized) return;

    // Harp.wav 파일이 로드되어 있으면 재생
    if (this.soundBuffers.harp) {
      console.log('🎵 Playing harp sound for transition');
      
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.soundBuffers.harp;
      
      const now = this.audioContext.currentTime;
      const duration = 3.0; // 3초 재생 (지니 메시지 나올 때까지)
      
      // 페이드 인 (볼륨 증가)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1.0, now + 0.3);
      
      // 2.5초 유지 후 페이드 아웃
      gainNode.gain.setValueAtTime(1.0, now + 2.5);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      source.start(0);
      source.stop(now + duration);
    } else {
      console.warn('⚠️ Harp sound not loaded, using fallback');
      
      // 폴백: 기존 합성 사운드
      const now = this.audioContext.currentTime;
      const duration = 2.0;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + duration);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + duration);
    }
  }

  // 소원 종류에 따른 자동 사운드 재생
  playWishSound(keyword) {
    if (!this.initialized) return;

    console.log('🎵 Playing sound for keyword:', keyword);

    // 카테고리별 사운드 매핑
    const soundMap = {
      // 평화로운 소원 (하프)
      'love': () => this.playHarp(),
      'happiness': () => this.playHarp(),
      'peace': () => this.playHarp(),
      'family': () => this.playHarp(),
      
      // 강력한 소원 (북)
      'success': () => this.playDrum(0.6),
      'wealth': () => this.playDrum(0.5),
      'power': () => this.playDrum(0.7),
      'victory': () => this.playDrum(0.6),
      
      // 자연 소원 (바람)
      'ocean': () => this.playWind(3),
      'forest': () => this.playWind(3),
      'mountain': () => this.playWind(3),
      'river': () => this.playWind(2.5),
      
      // 신비로운 소원 (종)
      'space': () => this.playBell(0.8),
      'aurora': () => this.playBell(1.2),
      'magic': () => this.playBell(1.0),
      'dream': () => this.playBell(1.1),
    };

    const soundFunc = soundMap[keyword];
    if (soundFunc) {
      soundFunc();
    } else {
      // 기본 사운드 (하프)
      this.playHarp();
    }
  }

  // 전체 볼륨 조절
  setVolume(volume) {
    if (!this.initialized) return;
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  // 정리
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.initialized = false;
      console.log('🔇 Audio system disposed');
    }
  }
}

// 싱글톤 인스턴스
export const audioSystem = new AudioSystem();
