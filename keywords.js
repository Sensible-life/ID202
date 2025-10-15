// 키워드 매칭 맵 (매우 다양하게 확장)

// 장소/위치 전환
//렌더링 스타일 변경

const keywordMap = {
  // 자연 - 물
  'ocean': ['ocean', 'sea', 'beach', 'wave', 'water', 'seaside', 'shore'],
  'lake': ['lake', 'pond', 'lagoon'],
  'river': ['river', 'stream', 'creek', 'waterfall', 'falls'],
  'underwater': ['underwater', 'coral', 'reef', 'dive', 'submarine'],
  
  // 자연 - 육지
  'forest': ['forest', 'tree', 'jungle', 'wood', 'woods', 'rainforest'],
  'mountain': ['mountain', 'peak', 'hill', 'alps', 'cliff', 'summit'],
  'desert': ['desert', 'sand', 'dune', 'sahara', 'arid', 'cactus'],
  'volcano': ['volcano', 'lava', 'magma', 'eruption'],
  'cave': ['cave', 'cavern', 'grotto', 'underground'],
  'canyon': ['canyon', 'gorge', 'valley', 'ravine'],
  'island': ['island', 'tropical', 'paradise', 'palm'],
  
  // 자연 - 하늘/날씨
  'sky': ['sky', 'cloud', 'heaven', 'blue sky'],
  'sunset': ['sunset', 'dusk', 'twilight', 'golden hour'],
  'sunrise': ['sunrise', 'dawn', 'daybreak', 'morning'],
  'night': ['night', 'midnight', 'darkness', 'nocturnal'],
  'aurora': ['aurora', 'northern lights', 'aurora borealis'],
  'storm': ['storm', 'thunder', 'lightning', 'rain', 'rainy', 'tempest'],
  'fog': ['fog', 'mist', 'misty', 'foggy', 'haze'],
  'rainbow': ['rainbow', 'colorful sky'],
  
  // 우주/공간
  'space': ['space', 'galaxy', 'star', 'universe', 'cosmos', 'nebula', 'milky way'],
  'moon': ['moon', 'lunar', 'moonlight'],
  'planet': ['planet', 'mars', 'saturn', 'jupiter', 'alien'],
  
  // 계절
  'spring': ['spring', 'bloom', 'blossom', 'cherry blossom', 'sakura'],
  'summer': ['summer', 'sunny', 'sunshine', 'bright'],
  'autumn': ['autumn', 'fall', 'maple', 'foliage', 'leaves'],
  'winter': ['winter', 'snow', 'ice', 'frozen', 'cold', 'frost', 'snowflake'],
  
  // 도시/건축
  'city': ['city', 'urban', 'building', 'street', 'downtown', 'metropolis', 'skyline'],
  'tokyo': ['tokyo', 'shibuya', 'shinjuku', 'japan'],
  'paris': ['paris', 'eiffel', 'france', 'french'],
  'newyork': ['new york', 'nyc', 'manhattan', 'brooklyn'],
  'london': ['london', 'uk', 'england', 'british'],
  'castle': ['castle', 'fortress', 'palace', 'medieval', 'kingdom'],
  'temple': ['temple', 'shrine', 'pagoda', 'monastery', 'church', 'cathedral'],
  'bridge': ['bridge', 'suspension', 'crossing'],
  'tower': ['tower', 'skyscraper', 'tall building'],
  'pyramid': ['pyramid', 'egypt', 'egyptian', 'sphinx'],
  'lighthouse': ['lighthouse', 'beacon'],
  
  // 장소/공간
  'house': ['house', 'home', 'apartment', 'interior', 'room'],
  'library': ['library', 'bookshelf', 'books', 'reading'],
  'cafe': ['cafe', 'coffee shop', 'cozy'],
  'restaurant': ['restaurant', 'dining', 'bistro'],
  'hotel': ['hotel', 'resort', 'luxury'],
  'office': ['office', 'workspace', 'desk', 'work'],
  'studio': ['studio', 'art room', 'atelier'],
  
  // 자연물/식물
  'garden': ['garden', 'flower', 'plant', 'botanical', 'greenhouse'],
  'field': ['field', 'meadow', 'grassland', 'prairie', 'wheat'],
  'bamboo': ['bamboo', 'bamboo forest'],
  'lavender': ['lavender', 'purple field'],
  'rose': ['rose', 'red flower'],
  'sunflower': ['sunflower', 'yellow flower'],
  
  // 동물
  'cat': ['cat', 'kitten', 'feline', 'kitty'],
  'dog': ['dog', 'puppy', 'canine'],
  'bird': ['bird', 'eagle', 'hawk', 'owl', 'parrot', 'flamingo'],
  'butterfly': ['butterfly', 'butterflies', 'insect'],
  'whale': ['whale', 'orca', 'dolphin', 'marine'],
  'horse': ['horse', 'stallion', 'equine'],
  
  // 색상 테마
  'pink': ['pink', 'rose', 'magenta', 'feminine'],
  'purple': ['purple', 'violet', 'lavender'],
  'blue': ['blue', 'azure', 'navy', 'cyan'],
  'green': ['green', 'emerald', 'jade'],
  'red': ['red', 'crimson', 'scarlet'],
  'gold': ['gold', 'golden', 'amber'],
  'black': ['black', 'dark', 'noir'],
  'white': ['white', 'pure', 'clean'],
  
  // 추상/분위기
  'dream': ['dream', 'dreamy', 'fantasy', 'surreal', 'dreamlike'],
  'magic': ['magic', 'magical', 'wizard', 'spell', 'enchanted'],
  'mystery': ['mystery', 'mysterious', 'enigma', 'secret'],
  'peace': ['peace', 'peaceful', 'calm', 'serene', 'tranquil', 'zen'],
  'fire': ['fire', 'flame', 'burning', 'blaze', 'inferno'],
  'water': ['water', 'aqua', 'liquid', 'flow'],
  'light': ['light', 'bright', 'illumination', 'glow', 'shine'],
  'shadow': ['shadow', 'silhouette', 'shade'],
  
  // 음식/음료
  'coffee': ['coffee', 'espresso', 'latte', 'cappuccino'],
  'tea': ['tea', 'teacup', 'chai'],
  'wine': ['wine', 'vineyard', 'grape'],
  'cake': ['cake', 'dessert', 'sweet', 'bakery'],
  'fruit': ['fruit', 'berry', 'apple', 'orange'],
  
  // 활동/취미
  'travel': ['travel', 'journey', 'adventure', 'explore', 'wanderlust'],
  'camping': ['camping', 'camp', 'tent', 'campfire', 'outdoor'],
  'music': ['music', 'instrument', 'concert', 'melody', 'song'],
  'art': ['art', 'painting', 'canvas', 'gallery', 'artwork'],
  'photography': ['photography', 'photo', 'camera', 'picture'],
  'sport': ['sport', 'fitness', 'gym', 'exercise', 'yoga'],
  'game': ['game', 'gaming', 'play', 'arcade'],
  
  // 교통수단
  'train': ['train', 'railway', 'subway', 'metro', 'railroad'],
  'plane': ['plane', 'airplane', 'aircraft', 'aviation', 'flight'],
  'car': ['car', 'vehicle', 'automobile', 'drive'],
  'boat': ['boat', 'ship', 'yacht', 'sailing', 'sail'],
  
  // 시간대
  'morning': ['morning', 'breakfast', 'am', 'early'],
  'afternoon': ['afternoon', 'noon', 'midday'],
  'evening': ['evening', 'dusk', 'pm'],
  
  // 특별한 장소
  'beach': ['beach', 'sand beach', 'tropical beach', 'coast'],
  'pool': ['pool', 'swimming pool', 'swim'],
  'park': ['park', 'playground', 'public park'],
  'mall': ['mall', 'shopping', 'store', 'shop'],
  'museum': ['museum', 'exhibition', 'artifact'],
  'zoo': ['zoo', 'safari', 'wildlife'],
  
  // === 소원 카테고리 ===
  
  // 부/돈/재산
  'wealth': ['wealth', 'rich', 'wealthy', 'money', 'fortune', 'treasure', 'gold', 'diamond', 'luxury', 'expensive', 'millionaire', 'billionaire', 'prosperity', 'abundance', 'affluent', '부자', '돈', '재산', '부', '황금', '금', '재물'],
  'success': ['success', 'successful', 'achievement', 'win', 'victory', 'triumph', 'accomplish', 'champion', 'winner', 'top', 'best', '성공', '우승', '승리'],
  'business': ['business', 'company', 'startup', 'entrepreneur', 'ceo', 'executive', 'corporate', 'enterprise', 'venture', '사업', '회사', '기업'],
  
  // 사랑/연애/관계
  'love': ['love', 'romance', 'romantic', 'lover', 'couple', 'relationship', 'dating', 'date', 'heart', 'valentine', 'crush', 'affection', '사랑', '연애', '로맨스', '커플'],
  'marriage': ['marriage', 'wedding', 'bride', 'groom', 'marry', 'spouse', 'husband', 'wife', 'honeymoon', '결혼', '웨딩', '신혼'],
  'friendship': ['friendship', 'friend', 'buddy', 'companion', 'pal', 'best friend', 'friendship', '친구', '우정'],
  'family': ['family', 'parent', 'child', 'baby', 'children', 'mother', 'father', 'mom', 'dad', 'sibling', 'brother', 'sister', '가족', '부모', '아이', '자녀'],
  
  // 건강/웰빙
  'health': ['health', 'healthy', 'wellness', 'fit', 'strong', 'vitality', 'energy', 'vigor', 'stamina', 'robust', '건강', '체력'],
  'healing': ['healing', 'cure', 'recovery', 'heal', 'medicine', 'therapy', 'treatment', '치유', '회복'],
  'longevity': ['longevity', 'long life', 'immortal', 'eternal', 'forever', 'everlasting', '장수', '영생', '불로장생'],
  'beauty': ['beauty', 'beautiful', 'pretty', 'gorgeous', 'attractive', 'handsome', 'elegant', 'charming', '아름다움', '미모', '예쁜'],
  
  // 행복/감정
  'happiness': ['happiness', 'happy', 'joy', 'joyful', 'cheerful', 'delight', 'pleasure', 'bliss', 'smile', 'laugh', 'fun', '행복', '즐거움', '기쁨'],
  'hope': ['hope', 'hopeful', 'optimism', 'optimistic', 'positive', 'bright future', 'promise', '희망', '긍정'],
  'freedom': ['freedom', 'free', 'liberty', 'independent', 'escape', 'liberation', '자유', '해방'],
  'peace': ['peace', 'peaceful', 'calm', 'serene', 'tranquil', 'zen', 'harmony', 'balance', '평화', '평온', '안정'],
  
  // 지식/능력/재능
  'wisdom': ['wisdom', 'wise', 'knowledge', 'intelligent', 'smart', 'clever', 'genius', 'brilliant', 'intellect', '지혜', '지식', '똑똑'],
  'talent': ['talent', 'talented', 'skill', 'skilled', 'ability', 'capable', 'gift', 'gifted', 'expert', 'master', '재능', '능력'],
  'power': ['power', 'powerful', 'strength', 'strong', 'mighty', 'force', 'energy', 'authority', '힘', '파워', '권력'],
  'creativity': ['creativity', 'creative', 'imagination', 'innovative', 'original', 'artistic', 'inspire', 'inspiration', '창의력', '상상력'],
  
  // 명예/인기
  'fame': ['fame', 'famous', 'celebrity', 'star', 'popular', 'recognition', 'reputation', 'glory', 'honor', '명예', '유명', '인기'],
  'respect': ['respect', 'respectful', 'admire', 'admiration', 'esteem', 'prestige', 'dignity', '존경', '존중'],
  
  // 모험/경험
  'adventure': ['adventure', 'adventurous', 'explore', 'exploration', 'discover', 'journey', 'quest', 'expedition', '모험', '탐험'],
  'experience': ['experience', 'memory', 'memories', 'moment', 'life', 'living', '경험', '추억'],
  
  // 목표/꿈
  'future': ['future', 'tomorrow', 'next', 'upcoming', 'destiny', 'fate', '미래', '내일'],
  
  // 특별한 소원
};

// 배경 이미지 URL 맵 (모든 카테고리에 대응)
const backgroundImages = {
  // 자연 - 물
  'ocean': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
  'lake': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop',
  'river': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  'underwater': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
  
  // 자연 - 육지
  'forest': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop',
  'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  'desert': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&h=1080&fit=crop',
  'volcano': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1920&h=1080&fit=crop',
  'cave': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920&h=1080&fit=crop',
  'canyon': 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1920&h=1080&fit=crop',
  'island': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
  
  // 자연 - 하늘/날씨
  'sky': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop',
  'sunset': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  'sunrise': 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&h=1080&fit=crop',
  'night': 'https://images.unsplash.com/photo-1504445097631-2a9b1b6f7e10?w=1920&h=1080&fit=crop',
  'aurora': 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=1920&h=1080&fit=crop',
  'storm': 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&h=1080&fit=crop',
  'fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1920&h=1080&fit=crop',
  'rainbow': 'https://images.unsplash.com/photo-1470163395405-dd2a6d772e7d?w=1920&h=1080&fit=crop',
  
  // 우주/공간
  'space': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop',
  'moon': 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&h=1080&fit=crop',
  'planet': 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1920&h=1080&fit=crop',
  
  // 계절
  'spring': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&h=1080&fit=crop',
  'summer': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&h=1080&fit=crop',
  'autumn': 'https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1920&h=1080&fit=crop',
  'winter': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&h=1080&fit=crop',
  
  // 도시/건축
  'city': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop',
  'newyork': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop',
  'castle': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&h=1080&fit=crop',
  'temple': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&h=1080&fit=crop',
  'bridge': 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=1920&h=1080&fit=crop',
  'tower': 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1920&h=1080&fit=crop',
  'pyramid': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920&h=1080&fit=crop',
  'lighthouse': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&h=1080&fit=crop',
  
  // 장소/공간
  'house': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&h=1080&fit=crop',
  'library': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1080&fit=crop',
  'cafe': 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1920&h=1080&fit=crop',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
  'hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
  'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
  'studio': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1920&h=1080&fit=crop',
  
  // 자연물/식물
  'garden': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&h=1080&fit=crop',
  'field': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop',
  'bamboo': 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1920&h=1080&fit=crop',
  'lavender': 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&h=1080&fit=crop',
  'rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
  'sunflower': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=1920&h=1080&fit=crop',
  
  // 동물
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&h=1080&fit=crop',
  'dog': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1920&h=1080&fit=crop',
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&h=1080&fit=crop',
  'butterfly': 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=1920&h=1080&fit=crop',
  'whale': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
  'horse': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&h=1080&fit=crop',
  
  // 색상 테마
  'pink': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
  'purple': 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&h=1080&fit=crop',
  'blue': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop',
  'green': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  'red': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
  'gold': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&h=1080&fit=crop',
  'black': 'https://images.unsplash.com/photo-1504445097631-2a9b1b6f7e10?w=1920&h=1080&fit=crop',
  'white': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&h=1080&fit=crop',
  
  // 추상/분위기
  'dream': 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1920&h=1080&fit=crop',
  'magic': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
  'mystery': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1920&h=1080&fit=crop',
  'peace': 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=1920&h=1080&fit=crop',
  'fire': 'https://images.unsplash.com/photo-1525824617522-ca086c62def2?w=1920&h=1080&fit=crop',
  'water': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
  'light': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop',
  'shadow': 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=1920&h=1080&fit=crop',
  
  // 음식/음료
  'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1920&h=1080&fit=crop',
  'wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1920&h=1080&fit=crop',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&h=1080&fit=crop',
  'fruit': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1920&h=1080&fit=crop',
  
  // 활동/취미
  'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop',
  'camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop',
  'music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&h=1080&fit=crop',
  'art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&h=1080&fit=crop',
  'photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&h=1080&fit=crop',
  'sport': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=1080&fit=crop',
  'game': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop',
  
  // 교통수단
  'train': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920&h=1080&fit=crop',
  'plane': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop',
  'car': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop',
  'boat': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop',
  
  // 시간대
  'morning': 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&h=1080&fit=crop',
  'afternoon': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&h=1080&fit=crop',
  'evening': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  
  // 특별한 장소
  'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
  'pool': 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1920&h=1080&fit=crop',
  'park': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  'mall': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1920&h=1080&fit=crop',
  'museum': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d3?w=1920&h=1080&fit=crop',
  'zoo': 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop',
  
  // === 소원 배경 이미지 ===
  
  // 부/돈/재산
  'wealth': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop', // 금화/보석
  'success': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop', // 성공한 사람들
  'business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop', // 빌딩/비즈니스
  
  // 사랑/연애/관계
  'love': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&h=1080&fit=crop', // 로맨틱한 풍경
  'marriage': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop', // 웨딩
  'friendship': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop', // 친구들
  'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&h=1080&fit=crop', // 가족
  
  // 건강/웰빙
  'health': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&h=1080&fit=crop', // 건강/운동
  'healing': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop', // 힐링/스파
  'longevity': 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&h=1080&fit=crop', // 평화로운 자연
  'beauty': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1920&h=1080&fit=crop', // 아름다움
  
  // 행복/감정
  'happiness': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920&h=1080&fit=crop', // 행복한 순간
  'hope': 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&h=1080&fit=crop', // 희망찬 일출
  'freedom': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop', // 자유로운 풍경
  
  // 지식/능력/재능
  'wisdom': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop', // 책/도서관
  'talent': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&h=1080&fit=crop', // 예술/재능
  'power': 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=1920&h=1080&fit=crop', // 힘찬 이미지
  'creativity': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&h=1080&fit=crop', // 창의적인 작업
  
  // 명예/인기
  'fame': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop', // 무대/스포트라이트
  'respect': 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1920&h=1080&fit=crop', // 격식있는 장면
  
  // 모험/경험
  'adventure': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1920&h=1080&fit=crop', // 모험
  'experience': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop', // 여행/경험
  
  // 목표/꿈
  'future': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop', // 미래적 이미지

};

