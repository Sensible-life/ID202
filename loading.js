// 로딩 화면 관리
(function() {
  'use strict';
  
  // 팁 목록
  const tips = [
    "The Genie only understands commands in English,<br>as they are from Arabia.",
    "If the Genie doesn't respond,<br>think about what you do with a lamp!",
    "The Genie is not omnipotent,<br>some wishes cannot be granted.",
    "Try rubbing, touching, or polishing the lamp<br>to summon the Genie.",
    "Make your wish clear and specific<br>for the best results."
  ];
  
  // 로딩 화면 생성
  function createLoadingScreen() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-screen';
    
    // 랜덤 팁 선택
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    loadingDiv.innerHTML = `
      <div class="loading-lamp">🪔</div>
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading...</div>
      <div class="loading-tip">
        ${randomTip}
      </div>
    `;
    
    document.body.appendChild(loadingDiv);
    
    return loadingDiv;
  }
  
  // 로딩 화면 제거
  function hideLoadingScreen(loadingScreen) {
    loadingScreen.classList.add('fade-out');
    
    // 애니메이션 완료 후 DOM에서 제거
    setTimeout(() => {
      if (loadingScreen && loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 500); // fade-out 애니메이션 시간과 일치
  }
  
  // 페이지 로드 시 실행
  document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = createLoadingScreen();
    
    // 5초 후 로딩 화면 숨김
    setTimeout(() => {
      hideLoadingScreen(loadingScreen);
      console.log('🪔 Genie is ready! Type in English.');
    }, 5000);
  });
})();

