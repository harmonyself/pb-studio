// youtube_data.js - Enhanced Mock Data Engine

// 실제 인기 영상 데이터 풀 (유효한 ID만 엄선)
const REAL_TREND_POOL = [
    { id: "0e3GPea1Tyg", title: "I Built Willy Wonka's Chocolate Factory!", channel: "MrBeast", desc: "초대형 세트장과 압도적 스케일." },
    { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "공학적 호기심과 결과물 선공개." },
    { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "성공의 순간 포착." },
    { id: "No_4K8o20j4", title: "장기연애", channel: "숏박스", desc: "하이퍼 리얼리즘 공감." },
    { id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", desc: "확실한 캐릭터 컨셉." },
    { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3", channel: "ITSub잇섭", desc: "제품 vs 표정 대비." },
    { id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", desc: "파괴 본능 자극." },
    { id: "dn_0jX5_z8w", title: "침착맨 삼국지", channel: "침착맨", desc: "인물 중심의 몰입감." },
    { id: "Xw9j4s_g6so", title: "성시경의 먹을텐데", channel: "성시경", desc: "식욕 자극 미식 썸네일." },
    { id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", desc: "전설의 시작." },
    { id: "WMweEpGlu_U", title: "Butter", channel: "BTS", desc: "글로벌 팬덤 결집." },
    { id: "ioNng23DkIM", title: "How You Like That", channel: "BLACKPINK", desc: "압도적 비주얼." },
    { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", desc: "남미의 열정." },
    { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", desc: "심플함의 미학." },
    { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", desc: "레트로 감성." },
    { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", desc: "정글 컨셉의 화려함." },
    { id: "0ksZWGaHQww", title: "Sugar", channel: "Maroon 5", desc: "현장감 넘치는 웨딩." },
    { id: "fRh_vgS2dFE", title: "Sorry", channel: "Justin Bieber", desc: "자연스러운 색감." },
    { id: "nfWlot6h_JM", title: "Shake It Off", channel: "Taylor Swift", desc: "역동적인 댄스." },
    { id: "VDvr08sCPOc", title: "Counting Stars", channel: "OneRepublic", desc: "어두운 배경과 조명." }
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

// 유틸리티: 조회수 랜덤 생성 (단위: 억/만)
function getRandomViews(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    if (num > 10000) return `${(num / 10000).toFixed(1)}억회`;
    return `${num}만회`;
}

// 렌더링 데이터 생성
function generateDynamicData() {
    const shuffled = shuffleArray(REAL_TREND_POOL);
    
    // 트렌드용: 섞어서 6개
    const trends = {
        global: shuffled.slice(0, 3).map(item => ({...item, views: getRandomViews(5000, 30000)})), // 5천만~3억
        korea: shuffled.slice(3, 6).map(item => ({...item, views: getRandomViews(100, 1500)})) // 100만~1500만
    };

    // 어워즈용: 10개 뽑아서 조회수 기준 내림차순 정렬
    const awardsRaw = shuffled.slice(0, 10).map(item => {
        // 비교를 위해 숫자형 viewCount 추가
        const viewCount = Math.floor(Math.random() * 50000) + 5000; // 5000만 ~ 5.5억
        return {
            ...item,
            rawViews: viewCount,
            views: `${(viewCount / 100).toFixed(1)}억회`, // 표기용
            comment: "올해 가장 압도적인 클릭률을 기록했습니다."
        };
    });

    // 조회수 높은 순 정렬
    const awards = awardsRaw.sort((a, b) => b.rawViews - a.rawViews);

    return { trends, awards };
}

// 트렌드 페이지 렌더링
function renderTrends() {
    const globalList = document.getElementById('global-trend-list');
    const koreaList = document.getElementById('korea-trend-list');
    
    if (!globalList && !koreaList) return;

    const data = generateDynamicData().trends;

    if (globalList) {
        globalList.innerHTML = data.global.map(item => createTrendCard(item)).join('');
    }
    if (koreaList) {
        koreaList.innerHTML = data.korea.map(item => createTrendCard(item)).join('');
    }
}

function createTrendCard(item) {
    // 썸네일 URL 생성 (hqdefault 사용 - 안정성 확보)
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`; 
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;

    // 링크 유효성 체크: ID가 없으면 렌더링 하지 않음 (상위 로직에서 필터링됨)
    if (!item.id) return '';

    return `
        <div class="trend-card">
            <a href="${videoUrl}" target="_blank" class="thumb-link">
                <img src="${thumbUrl}" alt="${item.title}" class="real-thumb">
                <span class="views">${item.views}</span>
            </a>
            <h4>${item.title}</h4>
            <p class="channel" style="font-size:0.9rem; color:#888; margin-bottom:5px;">${item.channel}</p>
            <p class="analysis">${item.desc}</p>
        </div>
    `;
}

// 어워즈 페이지 렌더링 (TOP 10)
function renderAwards() {
    const list = document.getElementById('award-list');
    const periodLabel = document.getElementById('award-period-label');
    if (!list) return;

    // 로딩 효과
    list.innerHTML = '<div class="loading-state"><div class="spinner" style="margin:0 auto 20px;"></div><p>2026년 누적 데이터 집계 중...</p></div>';
    
    setTimeout(() => {
        const data = generateDynamicData().awards;
        const date = new Date().toLocaleDateString();
        
        if (periodLabel) periodLabel.textContent = `기준일: ${date} (실시간 누적 집계)`;

        list.innerHTML = data.map((item, index) => {
            const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
            const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
            const rank = index + 1;
            
            // 메달 색상 및 스타일
            let rankClass = '';
            let badgeStyle = 'background:#444; color:white;'; // 기본 (4~10위)
            
            if (rank === 1) { rankClass = 'gold'; badgeStyle = 'color:#ffd700; font-size:2.5rem;'; }
            else if (rank === 2) { rankClass = 'silver'; badgeStyle = 'color:#c0c0c0; font-size:2.2rem;'; }
            else if (rank === 3) { rankClass = 'bronze'; badgeStyle = 'color:#cd7f32; font-size:2rem;'; }
            else { badgeStyle = 'font-size:1.5rem; color:#888;'; }

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
        }).join('');
    }, 800); // 조회 연출 딜레이
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderTrends();
    renderAwards();
});
