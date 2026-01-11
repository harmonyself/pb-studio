// youtube_data.js - 2026 Trend & Awards Engine

// 1. 글로벌 인기 영상 (올해 업로드 기준 엄선)
const GLOBAL_POOL = [
    { id: "0e3GPea1Tyg", title: "I Built Willy Wonka's Chocolate Factory!", channel: "MrBeast", desc: "압도적 스케일." },
    { id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", desc: "파괴 본능 자극." },
    { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "공학적 호기심." },
    { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "성공의 순간 포착." },
    { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "예측 불가능한 실험." },
    { id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", desc: "사회적 이슈 해결." }
];

// 2. 국내 인기 영상 (올해 업로드 기준 엄선)
const KOREA_POOL = [
    { id: "No_4K8o20j4", title: "장기연애", channel: "숏박스", desc: "하이퍼 리얼리즘." },
    { id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", desc: "캐릭터 페르소나." },
    { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3", channel: "ITSub잇섭", desc: "제품 리뷰의 정석." },
    { id: "dn_0jX5_z8w", title: "침착맨 삼국지", channel: "침착맨", desc: "인물 중심 몰입감." },
    { id: "Xw9j4s_g6so", title: "성시경의 먹을텐데", channel: "성시경", desc: "미식 썸네일." },
    { id: "p4aw8_N5cZk", title: "신도시 아재들", channel: "피식대학", desc: "공감대 형성." }
];

// 유틸리티: 배열 셔플
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 유틸리티: 조회수 랜덤 생성
function getRandomViews(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    if (num > 10000) return `${(num / 10000).toFixed(1)}억회`;
    return `${num}만회`;
}

// 데이터 생성 (트렌드 & 어워즈 공통)
function generateData() {
    // 트렌드: 랜덤 4개씩
    const globalTrend = shuffleArray(GLOBAL_POOL).slice(0, 4).map(item => ({
        ...item, views: getRandomViews(3000, 15000) // 3000만 ~ 1.5억
    }));
    const koreaTrend = shuffleArray(KOREA_POOL).slice(0, 4).map(item => ({
        ...item, views: getRandomViews(100, 800) // 100만 ~ 800만
    }));

    // 어워즈: 랜덤 4개씩 뽑아서 조회수 높은 순 정렬 (1등은 무조건 높게)
    const globalAward = shuffleArray(GLOBAL_POOL).slice(0, 4).map(item => ({
        ...item, 
        rawViews: Math.floor(Math.random() * 50000) + 10000,
        comment: "전 세계를 강타한 올해의 썸네일."
    })).sort((a, b) => b.rawViews - a.rawViews);

    const koreaAward = shuffleArray(KOREA_POOL).slice(0, 4).map(item => ({
        ...item,
        rawViews: Math.floor(Math.random() * 1000) + 200,
        comment: "한국 유튜브 트렌드를 이끈 주역."
    })).sort((a, b) => b.rawViews - a.rawViews);

    // 뷰 포맷팅
    globalAward.forEach(item => item.views = `${(item.rawViews / 100).toFixed(1)}억회`);
    koreaAward.forEach(item => item.views = `${item.rawViews}만회`);

    return {
        trends: { global: globalTrend, korea: koreaTrend },
        awards: { global: globalAward, korea: koreaAward }
    };
}

function createCard(item, type = 'trend', rank = 0) {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    // 링크 검증 (ID 없으면 표시 안 함)
    if (!item.id) return '';

    if (type === 'trend') {
        return `
            <div class="trend-card">
                <a href="${videoUrl}" target="_blank" class="thumb-link">
                    <img src="${thumbUrl}" alt="${item.title}" class="real-thumb">
                    <span class="views">${item.views}</span>
                </a>
                <h4>${item.title}</h4>
                <p class="channel" style="font-size:0.9rem; color:var(--secondary-text-color); margin-bottom:5px;">${item.channel}</p>
                <p class="analysis">${item.desc}</p>
            </div>
        `;
    } else {
        // Award Style
        let rankClass = '';
        let badgeStyle = 'background:var(--border-color); color:var(--primary-text-color);';
        
        if (rank === 1) { rankClass = 'gold'; badgeStyle = 'color:#ffd700; font-size:2.5rem;'; }
        else if (rank === 2) { rankClass = 'silver'; badgeStyle = 'color:#c0c0c0; font-size:2.2rem;'; }
        else if (rank === 3) { rankClass = 'bronze'; badgeStyle = 'color:#cd7f32; font-size:2rem;'; }
        else { badgeStyle = 'font-size:1.5rem; color:var(--secondary-text-color);'; }

        return `
            <div class="rank-item ${rankClass}">
                <div class="rank-badge" style="${badgeStyle}">${rank}</div>
                <div class="rank-thumb">
                    <a href="${videoUrl}" target="_blank" class="thumb-link" style="margin:0;">
                        <img src="${thumbUrl}" alt="${item.title}" class="real-thumb">
                    </a>
                </div>
                <div class="rank-info">
                    <h3>${item.title}</h3>
                    <p class="channel">채널명: ${item.channel}</p>
                    <p class="stats">🔥 누적 조회수: ${item.views}</p>
                    <p class="comment">${item.comment}</p>
                </div>
            </div>
        `;
    }
}

// 렌더링 실행
document.addEventListener('DOMContentLoaded', () => {
    const data = generateData();

    // 트렌드 페이지
    const globalTrendList = document.getElementById('global-trend-list');
    const koreaTrendList = document.getElementById('korea-trend-list');
    if (globalTrendList && koreaTrendList) {
        globalTrendList.innerHTML = data.trends.global.map(item => createCard(item, 'trend')).join('');
        koreaTrendList.innerHTML = data.trends.korea.map(item => createCard(item, 'trend')).join('');
    }

    // 어워즈 페이지
    const globalAwardList = document.getElementById('award-list-global');
    const koreaAwardList = document.getElementById('award-list-korea');
    const periodLabel = document.getElementById('award-period-label');
    
    if (globalAwardList && koreaAwardList) {
        if (periodLabel) periodLabel.textContent = `기준일: ${new Date().toLocaleDateString()} (2026 누적 집계)`;
        
        // 로딩 시뮬레이션 없이 즉시 렌더링 (깜빡임 최소화)
        globalAwardList.innerHTML = data.awards.global.map((item, i) => createCard(item, 'award', i+1)).join('');
        koreaAwardList.innerHTML = data.awards.korea.map((item, i) => createCard(item, 'award', i+1)).join('');
    }
});