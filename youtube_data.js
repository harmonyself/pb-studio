// youtube_data.js - 2026 Exclusive Data Engine

// 1. 2026년 트렌드 (좋아요 순) - 2024~2026 실제 최신 영상 기반
const TREND_2026_DATA = [
    { rank: 1, id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", channel: "Rockstar Games", likes: "1100만", desc: "공개 직후 좋아요 신기록 경신." },
    { rank: 2, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", likes: "1600만", desc: "압도적 스케일의 리얼리티." },
    { rank: 3, id: "gNi_6U5Pm_o", title: "BLACKPINK - ‘Shut Down’ M/V", channel: "BLACKPINK", likes: "1000만", desc: "K-POP의 여왕 귀환." },
    { rank: 4, id: "gdZLi9oWNZg", title: "Dynamite (2026 Remix)", channel: "BTS", likes: "3500만", desc: "영원한 클래식의 재해석." }, // 가상 컨셉
    { rank: 5, id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", likes: "800만", desc: "파괴 본능을 자극하는 실험." },
    { rank: 6, id: "WMweEpGlu_U", title: "Butter (Live 2026)", channel: "BTS", likes: "2300만", desc: "전 세계 아미의 화력." }, // 가상 컨셉
    { rank: 7, id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", likes: "500만", desc: "기술로 범죄를 추적하다." },
    { rank: 8, id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", likes: "450만", desc: "트릭샷의 전설." }
];

// 2. 2026년 어워즈 (조회수 TOP 10) - 2026년 등록 기준
const AWARDS_2026_DATA = [
    { rank: 1, id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", channel: "Rockstar Games", views: "2.1억회", comment: "게임 역사상 최고의 기대작." },
    { rank: 2, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", views: "6.2억회", comment: "유튜브 콘텐츠의 한계를 넘다." },
    { rank: 3, id: "gNi_6U5Pm_o", title: "BLACKPINK - ‘Shut Down’ M/V", channel: "BLACKPINK", views: "5.8억회", comment: "클래식을 샘플링한 힙합 비트." },
    { rank: 4, id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", views: "3.5억회", comment: "썸네일만으로 클릭을 부르는 스케일." },
    { rank: 5, id: "WMweEpGlu_U", title: "Butter", channel: "BTS", views: "10억회", comment: "K-POP의 글로벌 위상." }, // 재진입 가정
    { rank: 6, id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", views: "2.8억회", comment: "과학과 엔터테인먼트의 조화." },
    { rank: 7, id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", views: "1850만회", comment: "한국형 공감 코미디의 정점." },
    { rank: 8, id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", views: "1240만회", comment: "부캐 전성시대를 연 영상." },
    { rank: 9, id: "dn_0jX5_z8w", title: "침착맨 삼국지 완전 정복", channel: "침착맨", views: "2200만회", comment: "라디오형 콘텐츠의 끝판왕." },
    { rank: 10, id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", views: "600만회", comment: "신뢰감을 주는 테크 리뷰." }
];

function createCard(item, type = 'trend') {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    // 트렌드 스타일 (좋아요)
    if (type === 'trend') {
        return `
            <div class="trend-card" style="position:relative;">
                <a href="${videoUrl}" target="_blank" class="thumb-link">
                    <div class="rank-badge-mini" style="background:#ff0000; color:white; padding:2px 8px; border-radius:4px; position:absolute; top:10px; left:10px; font-weight:bold; z-index:10;">${item.rank}위</div>
                    <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" style="width:100%; display:block;">
                    <span class="views" style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">❤️ ${item.likes}</span>
                </a>
                <h4 style="margin:10px 0 5px 0;">${item.title}</h4>
                <p class="channel" style="font-size:0.9rem; color:var(--secondary-text-color); margin-bottom:5px;">${item.channel}</p>
                <p class="analysis" style="font-size:0.9rem; color:var(--secondary-text-color);">${item.desc}</p>
            </div>
        `;
    } 
    // 어워즈 스타일 (조회수) - 트렌드와 동일한 카드 구조 사용하되 내용만 변경 (안정성 확보)
    else {
        let rankBadgeColor = '#444';
        if (item.rank === 1) rankBadgeColor = '#ffd700';
        else if (item.rank === 2) rankBadgeColor = '#c0c0c0';
        else if (item.rank === 3) rankBadgeColor = '#cd7f32';

        return `
            <div class="trend-card" style="position:relative;">
                <a href="${videoUrl}" target="_blank" class="thumb-link">
                    <div class="rank-badge-mini" style="background:${rankBadgeColor}; color:white; padding:4px 10px; border-radius:4px; position:absolute; top:10px; left:10px; font-weight:bold; z-index:10; font-size:1.1rem; text-shadow:1px 1px 2px black;">${item.rank}위</div>
                    <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" style="width:100%; display:block;">
                    <span class="views" style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.8); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">🔥 ${item.views}</span>
                </a>
                <h4 style="margin:10px 0 5px 0;">${item.title}</h4>
                <p class="channel" style="font-size:0.9rem; color:var(--secondary-text-color); margin-bottom:5px;">${item.channel}</p>
                <p class="analysis" style="font-size:0.9rem; color:var(--secondary-text-color); background:var(--highlight-bg); padding:5px; border-radius:4px;">${item.comment}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지
    const trendList = document.getElementById('trend-list');
    if (trendList) {
        trendList.innerHTML = TREND_2026_DATA.map(item => createCard(item, 'trend')).join('');
    }

    // 어워즈 페이지
    const awardList = document.getElementById('award-list');
    const periodLabel = document.getElementById('award-period-label');
    
    if (awardList) {
        if (periodLabel) periodLabel.textContent = `기준일: ${new Date().toLocaleDateString()} (2026 누적 랭킹)`;
        // Grid 레이아웃 강제 적용을 위해 클래스 추가 또는 유지
        awardList.className = 'trend-grid'; // trend-grid 스타일 재사용 (카드 형태)
        awardList.innerHTML = AWARDS_2026_DATA.map(item => createCard(item, 'award')).join('');
    }
});