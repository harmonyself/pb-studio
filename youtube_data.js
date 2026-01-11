// youtube_data.js - Robust Style Reference Engine (2026 Updated)

const STYLE_TRENDS = [
    {
        category: "1. 고대비 & 표정 (High Contrast)",
        desc: "높은 채도와 과장된 표정으로 시선을 강탈하는 스타일",
        videos: [
            { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "원색 배경과 인물의 명확한 대비." },
            { id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", desc: "파괴 본능을 자극하는 붉은색 활용." },
            { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "결과물(폭발)을 미리 보여주는 구도." },
            { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "압도적 스케일의 오브제 배치." }
        ]
    },
    {
        category: "2. 타이포그래피 강조 (Big Typography)",
        desc: "굵고 큰 자막으로 상황을 한눈에 요약하는 스타일",
        videos: [
            { id: "No_4K8o20j4", title: "장기연애: 모텔 편", channel: "숏박스", desc: "상황을 한마디로 종결하는 썸네일 자막." },
            { id: "7X_W7kQk1TI", title: "05학번이즈백", channel: "피식대학", desc: "레트로 폰트로 확실한 컨셉 전달." },
            { id: "V9Ag0V0kL9w", title: "가짜사나이 2기", channel: "피지컬갤러리", desc: "영화 포스터 같은 묵직한 타이틀." },
            { id: "p4aw8_N5cZk", title: "신도시 아재들", channel: "피식대학", desc: "인물의 대사를 자막으로 활용." }
        ]
    },
    {
        category: "3. 인물 & 감성 (Portrait & Vibe)",
        desc: "인물의 매력과 분위기로 클릭을 유도하는 스타일",
        videos: [
            { id: "dn_0jX5_z8w", title: "침착맨 삼국지", channel: "침착맨", desc: "인물의 표정과 제스처에 100% 집중." },
            { id: "Xw9j4s_g6so", title: "먹을텐데", channel: "성시경", desc: "자연스러운 술자리 분위기 연출." },
            { id: "gNi_6U5Pm_o", title: "Shut Down", channel: "BLACKPINK", desc: "압도적인 인물 비주얼 활용." },
            { id: "gdZLi9oWNZg", title: "Dynamite", channel: "BTS", desc: "파스텔톤 색감으로 밝은 분위기 강조." }
        ]
    },
    {
        category: "4. 오브제 & 미니멀 (Minimalism)",
        desc: "핵심 물건 하나로 호기심을 극대화하는 스타일",
        videos: [
            { id: "7nJg3XJ8jTI", title: "갤럭시 Z 플립3 리뷰", channel: "ITSub잇섭", desc: "제품을 주인공으로 내세운 깔끔한 구도." },
            { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "행동의 결정적 순간을 포착." },
            { id: "QdBZY2fkU-0", title: "GTA VI Trailer", channel: "Rockstar Games", desc: "로고 하나만으로 충분한 자신감." },
            { id: "M5QGkOGZubQ", title: "Robot Piano", channel: "Mark Rober", desc: "복잡한 배경 없이 기계장치 강조." }
        ]
    }
];

function createTrendSection(sectionData) {
    const cardsHtml = sectionData.videos.map(video => createCard(video)).join('');
    return `
        <section class="trend-section" style="margin-bottom: 60px;">
            <div style="margin-bottom: 20px; border-left: 4px solid var(--accent-color); padding-left: 15px;">
                <h2 style="margin: 0; font-size: 1.5rem; color: var(--primary-text-color);">${sectionData.category}</h2>
                <p style="margin: 5px 0 0; color: var(--secondary-text-color); font-size: 0.95rem;">${sectionData.desc}</p>
            </div>
            <div class="trend-grid">
                ${cardsHtml}
            </div>
        </section>
    `;
}

function createCard(item) {
    // 썸네일 URL (hqdefault는 4:3 비율이므로 위아래 레터박스가 생길 수 있음 -> maxresdefault 시도 후 에러 처리)
    // 안전하게 hqdefault 사용하되, CSS object-fit으로 커버
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    return `
        <div class="trend-card" style="position:relative; display: flex; flex-direction: column;">
            <a href="${videoUrl}" target="_blank" class="thumb-link" style="display: block; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;">
                <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.src='https://placehold.co/640x360?text=Video+Unavailable'">
            </a>
            <div style="padding: 15px 0 0;">
                <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; line-height: 1.3;">${item.title}</h4>
                <p style="font-size: 0.9rem; color: var(--secondary-text-color); margin: 0 0 10px;">${item.channel}</p>
                <div style="font-size: 0.85rem; color: var(--primary-text-color); background: var(--highlight-bg); padding: 8px; border-radius: 6px; line-height: 1.4;">
                    💡 ${item.desc}
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const trendList = document.getElementById('trend-list');
    
    // 에러 방지: 요소가 존재할 때만 실행
    if (trendList) {
        try {
            // 기존 로딩 스피너 제거 및 리스트 렌더링
            trendList.style.display = 'block'; 
            trendList.innerHTML = STYLE_TRENDS.map(section => createTrendSection(section)).join('');
        } catch (e) {
            console.error("Trend rendering error:", e);
            trendList.innerHTML = '<p style="text-align:center; padding:20px;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
});
