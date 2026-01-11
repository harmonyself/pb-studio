// youtube_data.js - Fact-Based Reliable Data Engine

// ==========================================
// 1. 트렌드 분석 (유튜브 역대 최다 좋아요 영상 - Fact Based)
// ==========================================
const STYLE_TRENDS = [
    {
        category: "1. 전 세계가 사랑한 뮤직비디오 (Most Liked MVs)",
        desc: "수천만 개의 '좋아요'를 기록한 글로벌 메가 히트곡들의 썸네일",
        videos: [
            { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito ft. Daddy Yankee", channel: "Luis Fonsi", desc: "좋아요 5,300만 개. 남미의 색채를 담은 강렬한 썸네일." },
            { id: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again ft. Charlie Puth", channel: "Wiz Khalifa", desc: "좋아요 4,200만 개. 영화의 감동적인 엔딩 장면 활용." },
            { id: "gdZLi9oWNZg", title: "BTS (방탄소년단) 'Dynamite' Official MV", channel: "HYBE LABELS", desc: "좋아요 3,700만 개. 파스텔톤 색감과 레트로 무드." },
            { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You", channel: "Ed Sheeran", desc: "좋아요 3,300만 개. 아티스트를 상징하는 그래픽 아트워크." }
        ]
    },
    {
        category: "2. K-POP 레전드 (K-Pop Giants)",
        desc: "전 세계 팬덤을 움직인 K-POP 대표 영상들의 비주얼 전략",
        videos: [
            { id: "9bZkp7q19f0", title: "PSY - GANGNAM STYLE(강남스타일) M/V", channel: "officialpsy", desc: "좋아요 2,800만 개. 유튜브 시대를 연 상징적인 비주얼." },
            { id: "ioNng23DkIM", title: "BLACKPINK - 'How You Like That' M/V", channel: "BLACKPINK", desc: "좋아요 2,500만 개. 압도적인 세트와 멤버들의 카리스마." },
            { id: "WMweEpGlu_U", title: "BTS (방탄소년단) 'Butter' Official MV", channel: "HYBE LABELS", desc: "좋아요 2,300만 개. 흑백과 컬러의 대비를 통한 인물 강조." },
            { id: "CuklIb9d3fI", title: "BTS (방탄소년단) 'Permission to Dance' Official MV", channel: "HYBE LABELS", desc: "좋아요 2,000만 개. 누구나 따라 할 수 있는 즐거운 분위기." }
        ]
    },
    {
        category: "3. 유튜브 오리지널 & 크리에이터 (Top Creators)",
        desc: "방송국을 뛰어넘은 개인 크리에이터들의 조회수 치트키",
        videos: [
            { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "좋아요 1,600만 개. 실제 세트장을 보여주며 압도적 스케일 과시." },
            { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "좋아요 450만 개. 성공의 짜릿한 순간을 포착하여 클릭 유도." },
            { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "좋아요 380만 개. 공학적 결과물을 미리 보여주어 호기심 자극." },
            { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "좋아요 350만 개. 파괴 본능을 자극하는 실험 썸네일." }
        ]
    },
    {
        category: "4. 바이럴 & 키즈 (Viral & Kids)",
        desc: "언어 장벽 없이 전 세계를 강타한 직관적인 썸네일",
        videos: [
            { id: "XqZsoesa55w", title: "Baby Shark Dance", channel: "Pinkfong Baby Shark", desc: "좋아요 4,100만 개. 아이들의 시선을 사로잡는 원색 캐릭터." },
            { id: "F8hU5tIrKh8", title: "Johny Johny Yes Papa", channel: "LooLoo Kids", desc: "좋아요 2,000만 개. 단순하고 명확한 3D 애니메이션 캐릭터." },
            { id: "OPf0YbXqDm0", title: "Mark Ronson - Uptown Funk ft. Bruno Mars", channel: "Mark Ronson", desc: "좋아요 2,100만 개. 레트로한 색감과 아티스트의 멋진 포즈." },
            { id: "fRh_vgS2dFE", title: "Justin Bieber - Sorry", channel: "Justin Bieber", desc: "좋아요 1,900만 개. 인물이 아닌 댄서들의 움직임과 색감 강조." }
        ]
    }
];

// ==========================================
// 2. 렌더링 함수 (안정성 최우선)
// ==========================================

function createTrendSection(sectionData) {
    const cardsHtml = sectionData.videos.map(video => createCard(video, 'trend')).join('');
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

function createCard(item, type = 'trend') {
    // 썸네일 안정성 100% 확보: hqdefault.jpg 사용 (유튜브 표준 4:3)
    // CSS object-fit: cover + transform: scale(1.35)로 16:9 영역에 꽉 차게 보정
    const thumbUrl = `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    // 카드 내부 콘텐츠
    let metaHtml = `<div style="font-size: 0.85rem; color: var(--primary-text-color); background: var(--highlight-bg); padding: 8px; border-radius: 6px; line-height: 1.4;">💡 ${item.desc}</div>`;

    return `
        <div class="trend-card" style="position:relative; display: flex; flex-direction: column;">
            <a href="${videoUrl}" target="_blank" class="thumb-link" style="display: block; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; position: relative; background: #000;">
                <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" 
                     style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.35);"
                     onerror="this.src='https://placehold.co/640x360?text=Image+Not+Found'">
            </a>
            <div style="padding: 15px 0 0; flex: 1; display: flex; flex-direction: column;">
                <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.title}</h4>
                <p style="font-size: 0.9rem; color: var(--secondary-text-color); margin: 0 0 10px;">${item.channel}</p>
                <div style="margin-top: auto;">
                    ${metaHtml}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 3. 초기화 실행
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지 렌더링
    const trendList = document.getElementById('trend-list');
    if (trendList) {
        try {
            trendList.style.display = 'block'; 
            trendList.innerHTML = STYLE_TRENDS.map(section => createTrendSection(section)).join('');
        } catch (e) {
            console.error("Trend rendering error:", e);
            trendList.innerHTML = '<p style="text-align:center; padding:20px;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
});