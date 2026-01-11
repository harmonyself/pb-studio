// youtube_data.js - Mock Data & Rendering Logic

const MOCK_DATA = {
    // 트렌드 (실시간/주간 인기)
    trends: {
        global: [
            { title: "I Built Willy Wonka's Chocolate Factory!", channel: "MrBeast", views: "2.1억회", thumb: "https://img.youtube.com/vi/0e3GPea1Tyg/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=0e3GPea1Tyg", desc: "초대형 세트장과 압도적 스케일의 썸네일." },
            { title: "World's Largest T-Shirt Cannon", channel: "Mark Rober", views: "5천만회", thumb: "https://img.youtube.com/vi/xoxhDk-hwuo/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=xoxhDk-hwuo", desc: "공학적 호기심과 결과물을 미리 보여주는 방식." },
            { title: "Water Bottle Flip 2", channel: "Dude Perfect", views: "4.5억회", thumb: "https://img.youtube.com/vi/CFyCoMA1u5k/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=CFyCoMA1u5k", desc: "성공의 순간을 포착하여 클릭 유도." }
        ],
        korea: [
            { title: "장기연애", channel: "숏박스", views: "1500만회", thumb: "https://img.youtube.com/vi/No_4K8o20j4/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=No_4K8o20j4", desc: "하이퍼 리얼리즘 상황극의 정석." },
            { title: "05학번이즈백", channel: "피식대학", views: "800만회", thumb: "https://img.youtube.com/vi/7X_W7kQk1TI/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=7X_W7kQk1TI", desc: "확실한 캐릭터 컨셉과 패션." },
            { title: "갤럭시 Z 플립3", channel: "ITSub잇섭", views: "350만회", thumb: "https://img.youtube.com/vi/7nJg3XJ8jTI/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=7nJg3XJ8jTI", desc: "제품과 표정의 대비를 통한 신뢰감." }
        ]
    },
    // 어워즈 (기간별)
    awards: {
        daily: [
            { rank: 1, title: "오늘의 떡상 영상 1", channel: "채널A", views: "100만회", thumb: "https://img.youtube.com/vi/r7McqF9qbWo/maxresdefault.jpg", url: "#", comment: "오늘 하루 가장 뜨거운 반응을 얻은 썸네일." },
            { rank: 2, title: "오늘의 떡상 영상 2", channel: "채널B", views: "80만회", thumb: "https://img.youtube.com/vi/dn_0jX5_z8w/maxresdefault.jpg", url: "#", comment: "급상승 트렌드에 완벽하게 탑승했습니다." },
            { rank: 3, title: "오늘의 떡상 영상 3", channel: "채널C", views: "50만회", thumb: "https://img.youtube.com/vi/Xw9j4s_g6so/maxresdefault.jpg", url: "#", comment: "심플하지만 강력한 후킹." }
        ],
        weekly: [
            { rank: 1, title: "이번 주 1위", channel: "MrBeast", views: "5000만회", thumb: "https://img.youtube.com/vi/r7McqF9qbWo/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=r7McqF9qbWo", comment: "주간 조회수 압도적 1위. 스케일이 다릅니다." },
            { rank: 2, title: "이번 주 2위", channel: "침착맨", views: "300만회", thumb: "https://img.youtube.com/vi/dn_0jX5_z8w/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=dn_0jX5_z8w", comment: "꾸준한 상승세. 팬덤을 결집시키는 썸네일." },
            { rank: 3, title: "이번 주 3위", channel: "성시경", views: "200만회", thumb: "https://img.youtube.com/vi/Xw9j4s_g6so/maxresdefault.jpg", url: "https://www.youtube.com/watch?v=Xw9j4s_g6so", comment: "알고리즘의 선택을 받은 먹방." }
        ],
        monthly: [
            { rank: 1, title: "이달의 전설", channel: "피식대학", views: "1000만회", thumb: "https://img.youtube.com/vi/7X_W7kQk1TI/maxresdefault.jpg", url: "#", comment: "한 달 내내 화제가 된 밈의 시작점." },
            { rank: 2, title: "이달의 이슈", channel: "숏박스", views: "800만회", thumb: "https://img.youtube.com/vi/No_4K8o20j4/maxresdefault.jpg", url: "#", comment: "전 세대의 공감을 이끌어낸 썸네일." },
            { rank: 3, title: "이달의 루키", channel: "신규채널", views: "500만회", thumb: "https://img.youtube.com/vi/0e3GPea1Tyg/maxresdefault.jpg", url: "#", comment: "혜성처럼 등장한 신인의 무서운 기세." }
        ],
        yearly: [
            { rank: 1, title: "올해의 대상", channel: "BTS", views: "10억회", thumb: "https://img.youtube.com/vi/WMweEpGlu_U/maxresdefault.jpg", url: "#", comment: "전 세계가 주목한 올해 최고의 썸네일." },
            { rank: 2, title: "올해의 최우수상", channel: "BLACKPINK", views: "8억회", thumb: "https://img.youtube.com/vi/ioNng23DkIM/maxresdefault.jpg", url: "#", comment: "압도적인 비주얼과 카리스마." },
            { rank: 3, title: "올해의 우수상", channel: "PSY", views: "5억회", thumb: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg", url: "#", comment: "변하지 않는 클래스." }
        ]
    }
};

// 트렌드 페이지 렌더링
function renderTrends() {
    const globalList = document.getElementById('global-trend-list');
    const koreaList = document.getElementById('korea-trend-list');

    if (globalList) {
        globalList.innerHTML = MOCK_DATA.trends.global.map(item => createTrendCard(item)).join('');
    }
    if (koreaList) {
        koreaList.innerHTML = MOCK_DATA.trends.korea.map(item => createTrendCard(item)).join('');
    }
}

function createTrendCard(item) {
    return `
        <div class="trend-card">
            <a href="${item.url}" target="_blank" class="thumb-link">
                <img src="${item.thumb}" alt="${item.title}" class="real-thumb">
                <span class="views">${item.views}</span>
            </a>
            <h4>${item.title}</h4>
            <p class="channel" style="font-size:0.9rem; color:#888; margin-bottom:5px;">${item.channel}</p>
            <p class="analysis">${item.desc}</p>
        </div>
    `;
}

// 어워즈 페이지 렌더링
function renderAwards(period = 'weekly') {
    const list = document.getElementById('award-list');
    const periodLabel = document.getElementById('award-period-label');
    if (!list) return;

    // 데이터 로딩 시뮬레이션
    list.innerHTML = '<div class="loading-state"><div class="spinner" style="margin:0 auto 20px;"></div><p>데이터 조회 중...</p></div>';
    
    setTimeout(() => {
        const data = MOCK_DATA.awards[period];
        const date = new Date().toLocaleDateString();
        
        if (periodLabel) periodLabel.textContent = `기준일: ${date} (${getPeriodText(period)})`;

        list.innerHTML = data.map((item, index) => {
            const medal = index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze';
            const badge = index === 0 ? '1st' : index === 1 ? '2nd' : '3rd';
            const badgeColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32';
            
            return `
                <div class="rank-item ${medal}">
                    <div class="rank-badge" style="color:${badgeColor}">${badge}</div>
                    <div class="rank-thumb">
                        <a href="${item.url}" target="_blank" class="thumb-link" style="margin:0;">
                            <img src="${item.thumb}" alt="${item.title}" class="real-thumb">
                        </a>
                    </div>
                    <div class="rank-info">
                        <h3>${item.title}</h3>
                        <p class="channel">채널명: ${item.channel}</p>
                        <p class="stats">🔥 조회수: ${item.views}</p>
                        <p class="comment">${item.comment}</p>
                    </div>
                </div>
            `;
        }).join('');
    }, 500); // 0.5초 딜레이로 '조회' 느낌 주기
}

function getPeriodText(period) {
    if(period === 'daily') return '일간 집계';
    if(period === 'weekly') return '주간 집계';
    if(period === 'monthly') return '월간 집계';
    return '연간 집계';
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 트렌드 페이지인 경우
    if (document.getElementById('global-trend-list')) {
        renderTrends();
    }

    // 어워즈 페이지인 경우
    if (document.getElementById('award-list')) {
        renderAwards('weekly'); // 기본 주간

        // 탭 클릭 이벤트
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 활성 탭 변경
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 데이터 로드
                renderAwards(tab.dataset.period);
            });
        });
    }
});
