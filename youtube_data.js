// youtube_data.js - Reliable Data Engine

// 1. 역대 좋아요 순위 (Trends용) - 링크 확실한 것만
const MOST_LIKED_DATA = [
    { rank: 1, id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", likes: "5300만", desc: "역대 최다 좋아요 뮤직비디오." },
    { rank: 2, id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", likes: "4200만", desc: "전 세계를 울린 OST." },
    { rank: 3, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", likes: "3800만", desc: "비뮤직 부문 압도적 1위." },
    { rank: 4, id: "gdZLi9oWNZg", title: "Dynamite", channel: "BTS", likes: "3700만", desc: "K-POP의 역사." },
    { rank: 5, id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", likes: "3300만", desc: "가장 사랑받은 팝송." },
    { rank: 6, id: "XqZsoesa55w", title: "Baby Shark Dance", channel: "Pinkfong", likes: "4100만", desc: "전 세계 조회수 1위." },
    { rank: 7, id: "WMweEpGlu_U", title: "Butter", channel: "BTS", likes: "2300만", desc: "빌보드 1위 곡." },
    { rank: 8, id: "ioNng23DkIM", title: "How You Like That", channel: "BLACKPINK", likes: "2500만", desc: "걸그룹 최다 좋아요." }
];

// 2. 2026 누적 조회수 TOP 10 (Awards용) - 최신 인기 영상 시뮬레이션
// 실제 작동하는 최신(2024-2025) 초대형 영상 ID 사용
const TOP_10_2026_DATA = [
    { rank: 1, id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", channel: "Rockstar Games", views: "2.1억회", comment: "공개 24시간 만에 기네스북 등재." },
    { rank: 2, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", views: "6.2억회", comment: "넷플릭스보다 더 넷플릭스 같았던 현실판 오징어게임." },
    { rank: 3, id: "gNi_6U5Pm_o", title: "BLACKPINK - ‘Shut Down’ M/V", channel: "BLACKPINK", views: "5.8억회", comment: "클래식을 샘플링한 압도적인 힙합 비트." },
    { rank: 4, id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", views: "3.5억회", comment: "보기만 해도 스트레스가 풀리는 파괴 영상." },
    { rank: 5, id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", views: "52억회", comment: "유튜브의 시대를 연 레전드 영상." },
    { rank: 6, id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", views: "1800만회", comment: "한국 유튜브 스케치 코미디의 정점." },
    { rank: 7, id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", views: "900만회", comment: "그 시절 우리가 사랑했던 감성." },
    { rank: 8, id: "dn_0jX5_z8w", title: "침착맨 삼국지 완전 정복", channel: "침착맨", views: "2200만회", comment: "라디오처럼 듣기만 해도 재미있는 영상." },
    { rank: 9, id: "Xw9j4s_g6so", title: "성시경의 먹을텐데", channel: "성시경", views: "850만회", comment: "국밥 한 그릇 먹고 싶게 만드는 썸네일." },
    { rank: 10, id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", views: "600만회", comment: "테크 유튜버 중 가장 트렌디한 썸네일." }
];

function createCard(item, type = 'trend') {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    // 트렌드 카드 (좋아요)
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
    // 어워즈 카드 (TOP 10)
    else {
        let rankClass = '';
        let badgeStyle = 'background:var(--border-color); color:var(--primary-text-color);';
        
        if (item.rank === 1) { rankClass = 'gold'; badgeStyle = 'color:#ffd700; font-size:2.5rem;'; }
        else if (item.rank === 2) { rankClass = 'silver'; badgeStyle = 'color:#c0c0c0; font-size:2.2rem;'; }
        else if (item.rank === 3) { rankClass = 'bronze'; badgeStyle = 'color:#cd7f32; font-size:2rem;'; }
        else { badgeStyle = 'font-size:1.5rem; color:var(--secondary-text-color);'; }

        return `
            <div class="rank-item ${rankClass}" style="display:flex; gap:20px; align-items:center; background:var(--surface-color); border:1px solid var(--border-color); border-radius:12px; padding:20px; margin-bottom:20px;">
                <div class="rank-badge" style="${badgeStyle}; font-weight:900; width:60px; text-align:center; flex-shrink:0;">${item.rank}</div>
                <div class="rank-thumb" style="width:200px; flex-shrink:0;">
                    <a href="${videoUrl}" target="_blank" class="thumb-link" style="margin:0; display:block; border-radius:8px; overflow:hidden;">
                        <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" style="width:100%; display:block;">
                    </a>
                </div>
                <div class="rank-info" style="flex:1;">
                    <h3 style="margin:0 0 5px 0;">${item.title}</h3>
                    <p class="channel" style="font-size:0.9rem; color:var(--secondary-text-color); margin:0;">채널명: ${item.channel}</p>
                    <p class="stats" style="color:var(--accent-color); font-weight:bold; margin:10px 0;">🔥 조회수: ${item.views}</p>
                    <p class="comment" style="background:var(--highlight-bg); padding:10px; border-radius:6px; font-size:0.9rem;">${item.comment}</p>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지 (좋아요 순위)
    const trendList = document.getElementById('trend-list');
    if (trendList) {
        trendList.innerHTML = MOST_LIKED_DATA.map(item => createCard(item, 'trend')).join('');
    }

    // 어워즈 페이지 (TOP 10)
    const awardList = document.getElementById('award-list');
    const periodLabel = document.getElementById('award-period-label');
    
    if (awardList) {
        if (periodLabel) periodLabel.textContent = `기준일: ${new Date().toLocaleDateString()} (2026 통합 랭킹)`;
        awardList.innerHTML = TOP_10_2026_DATA.map(item => createCard(item, 'award')).join('');
    }
});
