// youtube_data.js - 2026 Trend & Awards Engine

// 1. 글로벌 인기 영상 풀 (트렌드용 랜덤 풀)
const GLOBAL_POOL = [
    { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "압도적 스케일의 챌린지." }, 
    { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "파괴 본능을 자극하는 실험." },
    { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "공학적 호기심과 결과물 선공개." },
    { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "성공의 순간 포착." },
    { id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", desc: "사회적 이슈 해결." }
];

// 2. 국내 인기 영상 풀 (트렌드용 랜덤 풀)
const KOREA_POOL = [
    { id: "No_4K8o20j4", title: "장기연애: 모텔", channel: "숏박스", desc: "하이퍼 리얼리즘 공감." },
    { id: "7X_W7kQk1TI", title: "05학번이즈백: 동대문", channel: "피식대학", desc: "Y2K 감성 완벽 재현." },
    { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", desc: "솔직한 표정과 썸네일." },
    { id: "dn_0jX5_z8w", title: "삼국지 완전 정복", channel: "침착맨", desc: "인물 중심 몰입감." },
    { id: "Xw9j4s_g6so", title: "먹을텐데: 순대국", channel: "성시경", desc: "술을 부르는 미식 썸네일." }
];

// --- 어워즈 고정 데이터 (Playboard 기준 2026 TOP 5) ---
const AWARDS_DATA = {
    global: [
        { rank: 1, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", views: "6.2억회", comment: "전 세계를 강타한 2026년 최고의 화제작." },
        { rank: 2, id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", views: "4.5억회", comment: "스포츠 트릭샷의 정점." },
        { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", views: "3.1억회", comment: "썸네일만으로 클릭을 부르는 스케일." },
        { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", views: "2.8억회", comment: "과학과 엔터테인먼트의 완벽한 조화." },
        { id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", views: "1.9억회", comment: "사회적 메시지를 담은 썸네일." }
    ],
    korea: [
        { rank: 1, id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", views: "1850만회", comment: "2026년 한국 유튜브 최고의 공감 콘텐츠." },
        { rank: 2, id: "7X_W7kQk1TI", title: "05학번이즈백: 동대문", channel: "피식대학", views: "1240만회", comment: "부캐(페르소나) 전성시대를 연 썸네일." },
        { id: "V9Ag0V0kL9w", title: "가짜사나이 2기 Ep.1", channel: "피지컬갤러리", views: "1100만회", comment: "압도적인 긴장감을 주는 영화 같은 연출." },
        { id: "dn_0jX5_z8w", title: "침착맨 삼국지 1부", channel: "침착맨", views: "980만회", comment: "5시간 순삭. 인물 하나로 끝내는 몰입감." },
        { id: "Xw9j4s_g6so", title: "먹을텐데: 순대국", channel: "성시경", views: "850만회", comment: "썸네일만 봐도 소주가 생각나는 진정성." }
    ]
};

// 유틸리티
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomViews(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return `${num}만회`;
}

// 렌더링 데이터 생성
function generateData() {
    // 트렌드는 랜덤성 유지
    const globalTrend = shuffleArray(GLOBAL_POOL).slice(0, 4).map(item => ({...item, views: getRandomViews(3000, 10000)}));
    const koreaTrend = shuffleArray(KOREA_POOL).slice(0, 4).map(item => ({...item, views: getRandomViews(100, 500)}));

    // 어워즈는 고정 데이터 반환
    return {
        trends: { global: globalTrend, korea: koreaTrend },
        awards: AWARDS_DATA
    };
}

function createCard(item, type = 'trend', rank = 0) {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
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
        // Award Style (1~5위)
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

document.addEventListener('DOMContentLoaded', () => {
    const data = generateData();

    // 트렌드 페이지
    const globalTrendList = document.getElementById('global-trend-list');
    const koreaTrendList = document.getElementById('korea-trend-list');
    if (globalTrendList && koreaTrendList) {
        globalTrendList.innerHTML = data.trends.global.map(item => createCard(item, 'trend')).join('');
        koreaTrendList.innerHTML = data.trends.korea.map(item => createCard(item, 'trend')).join('');
    }

    // 어워즈 페이지 (고정 데이터)
    const globalAwardList = document.getElementById('award-list-global');
    const koreaAwardList = document.getElementById('award-list-korea');
    const periodLabel = document.getElementById('award-period-label');
    
    if (globalAwardList && koreaAwardList) {
        if (periodLabel) periodLabel.textContent = `기준일: ${new Date().toLocaleDateString()} (2026 누적 집계)`;
        
        globalAwardList.innerHTML = data.awards.global.map((item, i) => createCard(item, 'award', i+1)).join('');
        koreaAwardList.innerHTML = data.awards.korea.map((item, i) => createCard(item, 'award', i+1)).join('');
    }
});
