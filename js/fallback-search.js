// Fallback search system for unmatched keywords
// Extracts key terms and redirects to Wikipedia

// 불용어 (검색에서 제외할 단어들)
const stopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'should', 'could', 'may', 'might', 'must', 'can', 'i', 'you', 'he',
  'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our',
  'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who',
  'when', 'where', 'why', 'how', 'want', 'need', 'like', 'get', 'make'
]);

// 핵심 키워드 추출
export function extractKeywords(text) {
  // 소문자로 변환 및 특수문자 제거
  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // 단어로 분리
  const words = cleaned.split(/\s+/).filter(word => word.length > 0);
  
  // 불용어 제거 및 길이 2 이상인 단어만 선택
  const keywords = words.filter(word => 
    !stopWords.has(word) && word.length >= 2
  );
  
  // 중복 제거
  const uniqueKeywords = [...new Set(keywords)];
  
  console.log('📝 Extracted keywords:', uniqueKeywords);
  
  return uniqueKeywords;
}

// Wikipedia URL 생성
export function createWikipediaUrl(keywords) {
  if (keywords.length === 0) {
    // 키워드가 없으면 Wikipedia 메인 페이지
    return 'https://en.wikipedia.org/wiki/Main_Page';
  }
  
  // 첫 번째 키워드 사용 (가장 중요한 키워드)
  const mainKeyword = keywords[0];
  
  // Wikipedia 검색 URL 생성 (첫 글자 대문자)
  const searchTerm = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);
  const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`;
  
  console.log('🔗 Wikipedia URL:', url);
  
  return url;
}

// 지니 응답 메시지 생성
export function createFallbackMessage(keywords) {
  if (keywords.length === 0) {
    return "Let me show you the world of knowledge...";
  }
  
  const mainKeyword = keywords[0];
  const responses = [
    `Let me tell you about ${mainKeyword}...`,
    `I'll show you what I know about ${mainKeyword}...`,
    `Discovering ${mainKeyword} for you...`,
    `Let's explore ${mainKeyword} together...`
  ];
  
  // 랜덤 응답 선택
  const message = responses[Math.floor(Math.random() * responses.length)];
  
  console.log('💬 Fallback message:', message);
  
  return message;
}

// 전체 fallback 처리
export function handleFallbackSearch(userInput) {
  console.log('🔍 Fallback search triggered for:', userInput);
  
  // 키워드 추출
  const keywords = extractKeywords(userInput);
  
  // Wikipedia URL 생성
  const url = createWikipediaUrl(keywords);
  
  // 지니 응답 메시지
  const message = createFallbackMessage(keywords);
  
  return {
    keywords,
    url,
    message
  };
}
