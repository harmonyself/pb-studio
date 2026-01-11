// youtube_data.js - 100% Stable Data Engine (Fixed)

// 스타일 및 분야별 트렌드 (검증된 실제 영상 ID 사용)
const STYLE_TRENDS = [
    {
        category: "1. 스케일 & 엔터테인먼트 (High Scale)",
        desc: "압도적인 제작비와 스케일로 클릭을 유도하는 스타일",
        videos: [
            { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "넷플릭스 세트장을 현실로 옮겨온 압도적 비주얼." },
            { id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", desc: "슈퍼카와 분쇄기라는 자극적인 소재의 대비." },
            { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "결과가 궁금해질 수밖에 없는 물리 실험." },
            { id: "ZN5xQ5Z9D2M", title: "Last To Leave Circle Wins $500,000", channel: "MrBeast", desc: "단순한 룰과 거액의 상금, 명확한 목표 제시." }
        ]
    },
    {
        category: "2. K-POP & 비주얼 (Visual & Color)",
        desc: "화려한 색감과 인물 중심의 구도",
        videos: [
            { id: "gdZLi9oWNZg", title: "BTS 'Dynamite' Official MV", channel: "HYBE LABELS", desc: "파스텔톤 색감과 레트로한 분위기의 조화." },
            { id: "gNi_6U5Pm_o", title: "BLACKPINK - ‘Shut Down’ M/V", channel: "BLACKPINK", desc: "강렬한 인물 포커싱과 힙합 무드." },
            { id: "9bZkp7q19f0", title: "PSY - GANGNAM STYLE M/V", channel: "officialpsy", desc: "원색적인 색감과 역동적인 포즈." },
            { id: "f5_wn8mexMM", title: "TWICE 'The Feels' M/V", channel: "JYP Entertainment", desc: "멤버 전원의 매력을 살린 하이틴 컨셉." }
        ]
    },
    {
        category: "3. 호기심 & 과학 (Curiosity & Science)",
        desc: "결과물을 미리 보여주거나 과정을 궁금하게 만드는 스타일",
        videos: [
            { id: "xoxhDk-hwuo", title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", desc: "엔지니어링 과정을 흥미롭게 시각화." },
            { id: "hFZFjoX2cGg", title: "Backyard Squirrel Maze 1.0", channel: "Mark Rober", desc: "다람쥐와 미로라는 독특한 소재 매칭." },
            { id: "y97rBdSYbkg", title: "The Slinky Drop", channel: "Veritasium", desc: "일상적인 물건의 낯선 물리 현상 포착." },
            { id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", desc: "성공의 짜릿한 순간을 썸네일로 고정." }
        ]
    },
    {
        category: "4. 글로벌 뮤직 히트 (Global Hits)",
        desc: "전 세계에서 가장 많은 '좋아요'를 받은 썸네일",
        videos: [
            { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", desc: "남미의 열정과 색감을 담은 썸네일." },
            { id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", desc: "영화의 감동을 그대로 전하는 구도." },
            { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", desc: "아티스트를 상징하는 그래픽 아트워크." },
            { id: "60ItHLz5WEA", title: "Faded", channel: "Alan Walker", desc: "신비로운 분위기의 마스크와 폐허 배경." }
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
    // 1. i.ytimg.com 사용 (공식 도메인)
    // 2. mqdefault.jpg 사용 (320x180, 16:9 비율) -> hqdefault(4:3)보다 썸네일 리스트에 적합
    // 3. onerror: 이미지 로드 실패 시 고화질(hqdefault) 시도 -> 그래도 안되면 색상 박스 처리
    const thumbUrl = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
    const fallbackUrl = `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    return `
        <div class="trend-card" style="position:relative; display: flex; flex-direction: column;">
            <a href="${videoUrl}" target="_blank" class="thumb-link" style="display: block; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; background-color: #000;">
                <img src="${thumbUrl}" alt="${item.title}" class="real-thumb" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.onerror=null; this.src='${fallbackUrl}';">
            </a>
            <div style="padding: 15px 0 0; flex: 1; display: flex; flex-direction: column;">
                <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.title}</h4>
                <p style="font-size: 0.9rem; color: var(--secondary-text-color); margin: 0 0 10px;">${item.channel}</p>
                <div style="margin-top: auto; font-size: 0.85rem; color: var(--primary-text-color); background: var(--highlight-bg); padding: 8px; border-radius: 6px; line-height: 1.4;">
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
            trendList.style.display = 'block'; 
            trendList.innerHTML = STYLE_TRENDS.map(section => createTrendSection(section)).join('');
        } catch (e) {
            console.error("Trend rendering error:", e);
            trendList.innerHTML = '<p style="text-align:center; padding:20px;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
});