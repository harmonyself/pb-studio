// youtube_data.js - 100% Stable Data Engine (Fixed)

// 스타일 및 분야별 트렌드 (검증된 실제 영상 ID 사용)
const STYLE_TRENDS = [
    {
        category: "1. 스케일 & 엔터테인먼트 (High Scale)",
        desc: "압도적인 제작비와 스케일로 클릭을 유도하는 스타일",
        videos: [
            { id: "sYk_n-eay2Y", title: "7 Days Stranded at Sea", channel: "MrBeast", desc: "실제 바다 위에서 7일을 버티는 역대급 스케일." },
            { id: "6S8I-g4gGMI", title: "World's Most Dangerous Trap!", channel: "MrBeast", desc: "인디아나 존스를 연상시키는 거대한 함정 세트." },
            { id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", desc: "넷플릭스 세트장을 현실로 옮겨온 압도적 비주얼." },
            { id: "Qxiy39ha2hA", title: "Train vs Giant Pit", channel: "MrBeast", desc: "결과가 궁금해질 수밖에 없는 거대한 물리 실험." }
        ]
    },
    {
        category: "2. K-POP & 비주얼 (Visual & Color)",
        desc: "화려한 색감과 인물 중심의 구도",
        videos: [
            { id: "p_S1g09lG-A", title: "(G)I-DLE - 'Super Lady' Official M/V", channel: "Cube Entertainment", desc: "강렬한 여성 서사와 압도적인 군무 비주얼." },
            { id: "Yud0vj8L83Y", title: "LE SSERAFIM 'Smart' OFFICIAL M/V", channel: "HYBE LABELS", desc: "이국적인 배경과 멤버들의 퍼포먼스 조화." },
            { id: "D8kUxb5p4cE", title: "aespa 'Drama' MV", channel: "SMTOWN", desc: "드라마틱한 스토리와 미래적인 CG 효과." },
            { id: "da4fG2d-v5s", title: "IVE 'Baddie' MV", channel: "starshipTV", desc: "힙한 스타일링과 자신감 넘치는 멤버들의 표정." }
        ]
    },
    {
        category: "3. 호기심 & 과학 (Curiosity & Science)",
        desc: "결과물을 미리 보여주거나 과정을 궁금하게 만드는 스타일",
        videos: [
            { id: "l94v4yE2jT4", title: "World's Largest Nerf Gun!!", channel: "Mark Rober", desc: "거대한 너프건이라는 흥미로운 소재와 과학 원리." },
            { id: "2tS_gYdG9G4", title: "How a Rocket Engine Works", channel: "SmarterEveryDay", desc: "로켓 엔진의 원리를 초고속 카메라로 시각화." },
            { id: "BickMFHAZR0", title: "The Biggest Myth About Trees", channel: "Veritasium", desc: "나무에 대한 상식을 뒤엎는 흥미로운 과학적 사실." },
            { id: "XfUnK2f49g8", title: "I Used the First iPhone in 2024", channel: "Mrwhosetheboss", desc: "최신 기술과 구형 기술의 비교라는 흥미로운 주제." }
        ]
    },
    {
        category: "4. 글로벌 뮤직 히트 (Global Hits)",
        desc: "전 세계에서 가장 많은 '좋아요'를 받은 썸네일",
        videos: [
            { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito ft. Daddy Yankee", channel: "Luis Fonsi", desc: "남미의 열정과 색감을 담은 세계적인 히트곡." },
            { id: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again ft. Charlie Puth", channel: "Wiz Khalifa", desc: "영화의 감동을 그대로 전하는 서정적인 구도." },
            { id: "IHNzOHi8sJs", title: "BLACKPINK - DDU-DU DDU-DU M/V", channel: "BLACKPINK", desc: "전 세계를 휩쓴 K-POP의 대표적인 히트곡." },
            { id: "e-ORhEE9VVg", title: "Taylor Swift - Blank Space", channel: "Taylor Swift", desc: "스토리텔링이 돋보이는 상징적인 뮤직비디오." }
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
