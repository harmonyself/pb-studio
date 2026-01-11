// youtube_data.js - Reliable Style Reference Engine

// 스타일별 추천 영상 데이터 (ID 검증 완료)
const STYLE_TRENDS = [
    {
        category: "고대비 & 표정 (High Contrast)",
        videos: [
            { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "높은 채도와 과장된 표정으로 시선 강탈." },
            { id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", desc: "원색 대비를 활용한 파괴 본능 자극." },
            { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "결과물을 미리 보여주어 호기심 유발." }
        ]
    },
    {
        category: "타이포그래피 강조 (Big Typography)",
        videos: [
            { id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", desc: "상황을 한마디로 요약하는 굵은 자막." },
            { id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", desc: "레트로 폰트로 컨셉을 확실하게 전달." },
            { id: "V9Ag0V0kL9w", title: "가짜사나이 2기", channel: "피지컬갤러리", desc: "영화 포스터 같은 묵직한 타이틀." }
        ]
    },
    {
        category: "인물 & 감성 (Portrait & Vibe)",
        videos: [
            { id: "dn_0jX5_z8w", title: "침착맨 삼국지", channel: "침착맨", desc: "인물의 표정과 제스처에 집중." },
            { id: "Xw9j4s_g6so", title: "먹을텐데", channel: "성시경", desc: "음식과 사람의 조화로운 배치." },
            { id: "gNi_6U5Pm_o", title: "Shut Down", channel: "BLACKPINK", desc: "압도적인 비주얼로 클릭 유도." }
        ]
    },
    {
        category: "오브제 & 미니멀 (Minimalism)",
        videos: [
            { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", desc: "제품을 주인공으로 내세운 깔끔한 구도." },
            { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "행동의 결정적 순간을 포착." },
            { id: "QdBZY2fkU-0", title: "GTA VI Trailer", channel: "Rockstar Games", desc: "로고 하나만으로 충분한 자신감." }
        ]
    }
];

function createTrendSection(sectionData) {
    const cardsHtml = sectionData.videos.map(video => createCard(video)).join('');
    return `
        <section class="trend-section">
            <h2 style="margin-bottom:20px; color:var(--primary-text-color); border-left:4px solid var(--accent-color); padding-left:15px;">${sectionData.category}</h2>
            <div class="trend-grid">
                ${cardsHtml}
            </div>
        </section>
    `;
}

function createCard(item) {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    return `
        <div class="trend-card" style="position:relative;">
            <a href="${videoUrl}" target="_blank" class="thumb-link">
                <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" style="width:100%; display:block;">
            </a>
            <h4 style="margin:10px 0 5px 0;">${item.title}</h4>
            <p class="channel" style="font-size:0.9rem; color:var(--secondary-text-color); margin-bottom:5px;">${item.channel}</p>
            <p class="analysis" style="font-size:0.9rem; color:var(--secondary-text-color); background:var(--highlight-bg); padding:8px; border-radius:6px; line-height:1.4;">💡 ${item.desc}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const trendList = document.getElementById('trend-list');
    if (trendList) {
        // 기존 Grid 레이아웃 해제 (섹션별로 보여주기 위함)
        trendList.style.display = 'block'; 
        trendList.innerHTML = STYLE_TRENDS.map(section => createTrendSection(section)).join('');
    }
});