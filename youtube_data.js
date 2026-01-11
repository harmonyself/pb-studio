// youtube_data.js - 2026 Trend & Awards Engine

// 1. 글로벌 인기 영상 풀 (2026년 기준)
const GLOBAL_POOL = [
    { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "압도적 스케일의 챌린지." }, 
    { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "파괴 본능을 자극하는 실험." },
    { id: "zZ7aim1UtXc", title: "I Spent 50 Hours In Solitary Confinement", channel: "MrBeast", desc: "극한의 심리 체험." },
    { id: "ZN5xQ5Z9D2M", title: "Last To Leave Circle Wins $500,000", channel: "MrBeast", desc: "단순하지만 강력한 룰." },
    { id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", desc: "기술을 활용한 정의 구현." },
    { id: "M5QGkOGZubQ", title: "Robot Piano", channel: "Mark Rober", desc: "공학적 신기함." },
    { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "성공의 순간 포착." },
    { id: "U_LL29tC76U", title: "Stereotypes: Gym", channel: "Dude Perfect", desc: "누구나 공감하는 코미디." },
    { id: "3Q3eRXkX5z8", title: "Sidemen Hide & Seek", channel: "Sidemen", desc: "대규모 술래잡기 예능." },
    { id: "W8xX2r2X5z8", title: "20 vs 1", channel: "Sidemen", desc: "자극적인 데이팅 포맷." }
];

// 2. 국내 인기 영상 풀 (2026년 기준)
const KOREA_POOL = [
    { id: "No_4K8o20j4", title: "장기연애: 모텔", channel: "숏박스", desc: "하이퍼 리얼리즘 공감." },
    { id: "7X_W7kQk1TI", title: "05학번이즈백: 동대문", channel: "피식대학", desc: "Y2K 감성 완벽 재현." },
    { id: "p4aw8_N5cZk", title: "신도시 아재들", channel: "피식대학", desc: "확실한 캐릭터 페르소나." },
    { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", desc: "솔직한 표정과 썸네일." },
    { id: "dn_0jX5_z8w", title: "삼국지 완전 정복", channel: "침착맨", desc: "긴 호흡의 스토리텔링." },
    { id: "Xw9j4s_g6so", title: "먹을텐데: 순대국", channel: "성시경", desc: "술을 부르는 미식 썸네일." },
    { id: "V9Ag0V0kL9w", title: "가짜사나이 2기", channel: "피지컬갤러리", desc: "블록버스터급 웹 예능." },
    { id: "DexVideo1", title: "덱스의 냉터뷰", channel: "일일칠", desc: "인물 매력 극대화." },
    { id: "PsickShow1", title: "피식쇼: 손흥민", channel: "피식대학", desc: "글로벌 토크쇼." },
    { id: "Pinggyego1", title: "핑계고: 유재석", channel: "뜬뜬", desc: "편안한 수다 콘텐츠." }
];

// --- 일간 트렌드 고정 데이터 (Playboard Daily Chart 시뮬레이션) ---
// 실제 API 연동 불가로 인해, 해당 차트의 상위권에 위치할 법한 최신 영상들로 고정
const DAILY_DATA = {
    global: [
        { rank: 1, id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", views: "1.2억회", desc: "일간 최다 조회수." },
        { rank: 2, id: "M5QGkOGZubQ", title: "Robot Piano", channel: "Mark Rober", views: "8500만회", desc: "과학 카테고리 1위." },
        { rank: 3, id: "U_LL29tC76U", title: "Stereotypes: Gym", channel: "Dude Perfect", views: "4200만회", desc: "코미디 부문 급상승." },
        { rank: 4, id: "3Q3eRXkX5z8", title: "Sidemen Hide & Seek", channel: "Sidemen", views: "3800만회", desc: "영국 인기 1위." },
        { rank: 5, id: "0e3GPea1Tyg", title: "Squid Game IRL", channel: "MrBeast", views: "3500만회", desc: "스테디셀러 역주행." }
    ],
    korea: [
        { rank: 1, id: "7nJg3XJ8jTI", title: "갤럭시 신제품 언박싱", channel: "ITSub잇섭", views: "350만회", desc: "테크 일간 1위." },
        { rank: 2, id: "No_4K8o20j4", title: "장기연애 최신화", channel: "숏박스", views: "280만회", desc: "공감 코미디 1위." },
        { rank: 3, id: "Xw9j4s_g6so", title: "먹을텐데: 국밥 로드", channel: "성시경", views: "210만회", desc: "음식 부문 1위." },
        { rank: 4, id: "dn_0jX5_z8w", title: "침착맨 라이브 하이라이트", channel: "침착맨", views: "150만회", desc: "토크 부문 1위." },
        { rank: 5, id: "p4aw8_N5cZk", title: "신도시 아재들 골프", channel: "피식대학", views: "120만회", desc: "급상승 동영상." }
    ]
};

// --- 어워즈 고정 데이터 (Playboard 2026 누적 TOP 5) ---
const AWARDS_DATA = {
    global: [
        { rank: 1, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", views: "6.2억회", comment: "전 세계를 강타한 2026년 최고의 화제작." },
        { rank: 2, id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", views: "4.5억회", comment: "스포츠 트릭샷의 정점." },
        { rank: 3, id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", views: "3.1억회", comment: "썸네일만으로 클릭을 부르는 스케일." },
        { rank: 4, id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", views: "2.8억회", comment: "과학과 엔터테인먼트의 완벽한 조화." },
        { rank: 5, id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", views: "1.9억회", comment: "사회적 메시지를 담은 썸네일." }
    ],
    korea: [
        { rank: 1, id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", views: "1850만회", comment: "2026년 한국 유튜브 최고의 공감 콘텐츠." },
        { rank: 2, id: "7X_W7kQk1TI", title: "05학번이즈백: 동대문", channel: "피식대학", views: "1240만회", comment: "부캐(페르소나) 전성시대를 연 썸네일." },
        { rank: 3, id: "V9Ag0V0kL9w", title: "가짜사나이 2기 Ep.1", channel: "피지컬갤러리", views: "1100만회", comment: "압도적인 긴장감을 주는 영화 같은 연출." },
        { rank: 4, id: "dn_0jX5_z8w", title: "침착맨 삼국지 1부", channel: "침착맨", views: "980만회", comment: "5시간 순삭. 인물 하나로 끝내는 몰입감." },
        { rank: 5, id: "Xw9j4s_g6so", title: "먹을텐데: 순대국", channel: "성시경", views: "850만회", comment: "썸네일만 봐도 소주가 생각나는 진정성." }
    ]
};

function createCard(item, type = 'trend', rank = 0) {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    if (!item.id || item.id.includes("ID")) return ''; // 가상 ID 제외

    if (type === 'trend') {
        // Trend also gets ranking style for Daily Chart
        const rankBadge = rank > 0 ? `<div class="rank-badge-mini" style="background:#f00; color:white; padding:2px 8px; border-radius:4px; position:absolute; top:10px; left:10px; font-weight:bold;">${rank}위</div>` : '';
        return `
            <div class="trend-card" style="position:relative;">
                <a href="${videoUrl}" target="_blank" class="thumb-link">
                    ${rankBadge}
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

document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지 (일간 데이터)
    const globalTrendList = document.getElementById('global-trend-list');
    const koreaTrendList = document.getElementById('korea-trend-list');
    if (globalTrendList && koreaTrendList) {
        globalTrendList.innerHTML = DAILY_DATA.global.map((item, i) => createCard(item, 'trend', i+1)).join('');
        koreaTrendList.innerHTML = DAILY_DATA.korea.map((item, i) => createCard(item, 'trend', i+1)).join('');
    }

    // 어워즈 페이지 (고정 데이터)
    const globalAwardList = document.getElementById('award-list-global');
    const koreaAwardList = document.getElementById('award-list-korea');
    const periodLabel = document.getElementById('award-period-label');
    
    if (globalAwardList && koreaAwardList) {
        if (periodLabel) periodLabel.textContent = `기준일: ${new Date().toLocaleDateString()} (2026 누적 집계)`;
        
        globalAwardList.innerHTML = AWARDS_DATA.global.map((item, i) => createCard(item, 'award', i+1)).join('');
        koreaAwardList.innerHTML = AWARDS_DATA.korea.map((item, i) => createCard(item, 'award', i+1)).join('');
    }
});