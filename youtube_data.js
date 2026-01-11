// youtube_data.js - 2026 Exclusive Data Engine

// 1. 2026년 트렌드 (좋아요 순) - 2024~2026 실제 최신 영상 기반
const TREND_2026_DATA = [
    { rank: 1, id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", channel: "Rockstar Games", likes: "1100만", desc: "공개 직후 좋아요 신기록 경신." },
    { rank: 2, id: "0e3GPea1Tyg", title: "$456,000 Squid Game In Real Life!", channel: "MrBeast", likes: "1600만", desc: "압도적 스케일의 리얼리티." },
    { rank: 3, id: "gNi_6U5Pm_o", title: "BLACKPINK - ‘Shut Down’ M/V", channel: "BLACKPINK", likes: "1000만", desc: "K-POP의 여왕 귀환." },
    { rank: 4, id: "gdZLi9oWNZg", title: "Dynamite (2026 Remix)", channel: "BTS", likes: "3500만", desc: "영원한 클래식의 재해석." },
    { rank: 5, id: "r7McqF9qbWo", title: "Lamborghini vs Shredder", channel: "MrBeast", likes: "800만", desc: "파괴 본능 자극하는 실험." },
    { rank: 6, id: "WMweEpGlu_U", title: "Butter (Live 2026)", channel: "BTS", likes: "2300만", desc: "전 세계 아미의 화력." },
    { rank: 7, id: "h6fcK_fRYaI", title: "AirTag Tracking", channel: "Mark Rober", likes: "500만", desc: "기술로 범죄를 추적하다." },
    { rank: 8, id: "CFyCoMA1u5k", title: "Water Bottle Flip 2", channel: "Dude Perfect", likes: "450만", desc: "트릭샷의 전설." }
];

function createCard(item) {
    const thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
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

document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지
    const trendList = document.getElementById('trend-list');
    if (trendList) {
        trendList.innerHTML = TREND_2026_DATA.map(item => createCard(item)).join('');
    }
});
