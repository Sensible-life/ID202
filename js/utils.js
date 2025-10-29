// Utility functions

// 배경색에서 대비되는 색상 계산 함수
export function getContrastColor(r, g, b) {
  // 명도 계산 (0~255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 밝은 배경이면 어두운 색, 어두운 배경이면 밝은 색
  if (brightness > 128) {
    // 밝은 배경 -> 어두운 금색/갈색
    return `rgba(139, 90, 43, ${0.8 + Math.random() * 0.2})`;
  } else {
    // 어두운 배경 -> 밝은 금색
    return `rgba(255, 215, 100, ${0.8 + Math.random() * 0.2})`;
  }
}

// 배경 이미지 밝기 분석 및 램프 조명 조정 함수
export function adjustLampLightingBasedOnBackground(imageData, lights) {
  const { ambientLight, lampLight, mainLight } = lights;
  const data = imageData.data;
  let totalBrightness = 0;
  let sampleCount = 0;

  // 이미지 중앙 영역의 밝기를 샘플링 (램프가 위치한 부분)
  const centerX = Math.floor(imageData.width / 2);
  const centerY = Math.floor(imageData.height / 2);
  const sampleRadius = Math.min(imageData.width, imageData.height) / 6; // 중앙 1/3 영역

  for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y += 10) {
    for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x += 10) {
      if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
        const index = (y * imageData.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // 명도 계산 (0~255)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        totalBrightness += brightness;
        sampleCount++;
      }
    }
  }

  const averageBrightness = totalBrightness / sampleCount;
  const normalizedBrightness = averageBrightness / 255; // 0~1

  console.log(`📊 Background brightness: ${averageBrightness.toFixed(1)} (normalized: ${normalizedBrightness.toFixed(2)})`);

  // 어두운 배경일수록 조명을 밝게 (0.3~1.0 범위에서 1.5~4.0으로 매핑)
  const lightIntensity = Math.max(1.5, (1 - normalizedBrightness) * 2.5 + 1.5);

  // 앰비언트 라이트 조정
  ambientLight.intensity = Math.max(0.8, (1 - normalizedBrightness) * 1.0 + 0.8);

  // 램프 라이트 조정
  lampLight.intensity = Math.max(6, lightIntensity * 8);

  // 메인 라이트 조정
  mainLight.intensity = Math.max(1.0, lightIntensity * 1.2);

  console.log(`💡 Adjusted lighting - Ambient: ${ambientLight.intensity.toFixed(2)}, Lamp: ${lampLight.intensity.toFixed(2)}, Main: ${mainLight.intensity.toFixed(2)}`);
}

// 한글 입력 감지 함수
export function isKorean(text) {
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
}
