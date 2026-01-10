document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 참조 ---
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');

    // 입력 요소
    const speakerImageInput = document.getElementById('speakerImage');
    const removeSpeakerBgInput = document.getElementById('removeSpeakerBg'); // (옵션, 현재 미구현 UI)
    
    // 배경 이미지 입력 3개
    const bgImageInput1 = document.getElementById('bgImage1');
    const bgImageInput2 = document.getElementById('bgImage2');
    const bgImageInput3 = document.getElementById('bgImage3');
    
    const logoImageInput = document.getElementById('logoImage');
    const speakerNameInput = document.getElementById('speakerName');
    const mainText1Input = document.getElementById('mainText1');
    const mainText2Input = document.getElementById('mainText2');
    const highlightColorInput = document.getElementById('highlightColor');
    const fineTuneControlsContainer = document.getElementById('fine-tune-controls');

    // 버튼
    const downloadBtn = document.getElementById('downloadBtn');

    // --- 테마 토글 로직 ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
    
    // 초기 테마 설정
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // 로딩 오버레이 (배경 제거 시 사용)
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
        // 오버레이가 없으면 생성 (안전장치)
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.display = 'none';
        loadingOverlay.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;">
                <div class="spinner" style="width:50px;height:50px;border:5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 1s infinite linear;margin-bottom:20px;"></div>
                <p>배경 제거 처리 중...</p>
                <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    // --- 랜덤 샘플 이미지 로직 ---
    const sampleImages = [
        '04XRaG6B2eY.jpg', '8mmdj8QAkJ4.jpg', '8-SB7L-WiHM.jpg', 'D1vl4VmYWjo.jpg', 
        'E6_5VwK9knc.jpg', 'gxajbaGlJn4.jpg', 'Ia7IAMYlh2o.jpg', 'kfPvELNvP7w.jpg', 
        'mOGXTUqS8Cc.jpg', 'o7tpNfJOk4M.jpg', 'obR3cGk50hU.jpg', 'TRIxJpBXJCU.jpg', 
        'Wdp_sTGF7h4.jpg', '-XHZ4y98sd4.jpg', '_qNWSGlcUeI.jpg'
    ];
    
    const sampleThumbElement = document.querySelector('.sample-thumb');
    if (sampleThumbElement) {
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        sampleThumbElement.src = `imgs/${randomImage}`;
    }

    // --- 상태 관리 객체 ---
    // 초기값은 캔버스 크기(1280x720)에 맞춰 설정
    const state = {
        speaker: { img: null, x: 640, y: 720, scale: 1 }, 
        // 배경 상태 변경: 단일 img -> 3개의 이미지 배열
        backgrounds: [null, null, null], 
        background: { x: 0, y: 0, scale: 1 }, // 배경 전체의 위치/크기 조절용 (필요시)
        logo: { img: null, x: 1100, y: 50, scale: 0.8 },
        speakerName: { text: '', x: 640, y: 450, size: 40 },
        mainText1: { text: '', x: 640, y: 550, size: 90 },
        mainText2: { text: '', x: 640, y: 650, size: 90 },
        highlightColor: '#FFFF00'
    };

    // --- 메인 그리기 함수 ---
    function drawCanvas() {
        // 1. 캔버스 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. 배경 합성 및 그리기
        drawBlendedBackground();

        // 3. 강연자 그리기
        if (state.speaker.img) {
            drawImage(state.speaker);
        }

        // 4. 로고 그리기
        if (state.logo.img) {
            drawImage(state.logo);
        }

        // 5. 텍스트 그리기
        drawText(
            state.speakerName.text,
            state.speakerName.x,
            state.speakerName.y,
            state.speakerName.size,
            '#FFFFFF',
            '500' // Medium weight
        );

        drawHighlightedText(
            state.mainText1.text,
            state.mainText1.x,
            state.mainText1.y,
            state.mainText1.size
        );

        drawHighlightedText(
            state.mainText2.text,
            state.mainText2.x,
            state.mainText2.y,
            state.mainText2.size
        );
    }

    /** 3장의 배경 이미지를 자연스럽게 합성하여 그리는 함수 */
    function drawBlendedBackground() {
        // 이미지가 하나도 없으면 검은색 배경
        if (!state.backgrounds[0] && !state.backgrounds[1] && !state.backgrounds[2]) {
            ctx.fillStyle = '#121212';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const w = canvas.width;
        const h = canvas.height;

        // 1. 첫 번째 이미지 (좌측) - 기본 베이스로 전체 혹은 좌측 영역
        if (state.backgrounds[0]) {
            drawCoverImage(state.backgrounds[0]);
        }
        
        // 2. 두 번째 이미지 (중앙) - 좌우 투명 그라데이션 마스크로 중앙에 합성
        if (state.backgrounds[1]) {
            ctx.save();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tCtx = tempCanvas.getContext('2d');
            
            // 이미지 그리기 (Cover 모드)
            const img = state.backgrounds[1];
            const scale = Math.max(w / img.width, h / img.height);
            const x = (w - img.width * scale) / 2;
            const y = (h - img.height * scale) / 2;
            tCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            // 마스크 적용 (좌우 투명하게)
            tCtx.globalCompositeOperation = 'destination-in';
            const grad = tCtx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.2, 'rgba(0,0,0,1)');
            grad.addColorStop(0.8, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            tCtx.fillStyle = grad;
            tCtx.fillRect(0, 0, w, h);
            
            // 본 캔버스에 합성
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        }

        // 3. 세 번째 이미지 (우측) - 좌측 투명 그라데이션 마스크로 우측에 합성
        if (state.backgrounds[2]) {
            ctx.save();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tCtx = tempCanvas.getContext('2d');
            
            const img = state.backgrounds[2];
            const scale = Math.max(w / img.width, h / img.height);
            const x = (w - img.width * scale) / 2;
            const y = (h - img.height * scale) / 2;
            tCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            // 마스크 적용 (좌측 투명하게)
            tCtx.globalCompositeOperation = 'destination-in';
            const grad = tCtx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0.5, 'rgba(0,0,0,0)');
            grad.addColorStop(0.8, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,1)');
            tCtx.fillStyle = grad;
            tCtx.fillRect(0, 0, w, h);
            
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        }
    }

    /** 이미지를 화면 꽉 차게 그리는 헬퍼 (Cover 모드) */
    function drawCoverImage(img) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // --- 헬퍼 함수들 ---

    /** 이미지를 상태값에 따라 그리는 함수 */
    function drawImage(elementState) {
        if (!elementState.img) return;
        
        const w = elementState.img.width * elementState.scale;
        const h = elementState.img.height * elementState.scale;
        
        ctx.drawImage(
            elementState.img, 
            elementState.x - w / 2, 
            elementState.y - h / 2, 
            w, 
            h
        );
    }

    /** 일반 텍스트 그리기 (중앙 정렬, 외곽선 포함) */
    function drawText(text, x, y, size, color, weight) {
        if (!text) return;
        ctx.font = `${weight} ${size}px Pretendard, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 외곽선
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = size * 0.1;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
        
        // 채우기
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    /** 강조 텍스트 그리기 (괄호 안의 글자색 변경) */
    function drawHighlightedText(text, x, y, size) {
        if (!text) return;

        ctx.font = `900 ${size}px Pretendard, sans-serif`; // ExtraBold
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left'; // 부분별로 그려야 하므로 left 정렬 사용

        // 1. 텍스트 파싱: (문구) 패턴 분리
        // 예: "최고의 (기술) 입니다" -> ["최고의 ", "(기술)", " 입니다"]
        const parts = text.split(/(\([^)]+\))/g);
        
        // 2. 전체 너비 계산 (중앙 정렬을 위해)
        let totalWidth = 0;
        const segments = parts.map(part => {
            let content = part;
            let isHighlight = false;
            
            if (part.startsWith('(') && part.endsWith(')')) {
                content = part.slice(1, -1); // 괄호 제거
                isHighlight = true;
            }
            
            if (content === '') return null; // 빈 문자열 무시

            const width = ctx.measureText(content).width;
            totalWidth += width;
            
            return { text: content, highlight: isHighlight, width: width };
        }).filter(s => s !== null);

        // 3. 그리기 시작 위치 (중앙 정렬 보정)
        let currentX = x - (totalWidth / 2);

        // 4. 각 세그먼트 그리기
        segments.forEach(segment => {
            // 외곽선
            ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = size * 0.12;
            ctx.lineJoin = 'round';
            ctx.strokeText(segment.text, currentX, y);
            
            // 글자색
            ctx.fillStyle = segment.highlight ? state.highlightColor : '#FFFFFF';
            ctx.fillText(segment.text, currentX, y);

            // 다음 글자 위치로 이동
            currentX += segment.width;
        });
    }

    /** 파일 로드 및 이미지 설정 */
    function loadImage(file, targetState, isSpeaker = false) {
        if (!file) return;

        if (isSpeaker) {
            // 강연자 사진: 배경 제거 시도
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.style.display = 'flex';

            // 1. 라이브러리 존재 여부 확인
            if (typeof imglyRemoveBackground !== 'undefined') {
                // 2. 배경 제거 실행
                imglyRemoveBackground(file).then(blob => {
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = () => {
                        targetState.img = img;
                        
                        // 스마트 크롭 (자동 배치)
                        const targetScale = (canvas.height * 0.7) / img.height;
                        targetState.scale = targetScale;
                        targetState.x = canvas.width / 2;
                        targetState.y = canvas.height - (img.height * targetScale / 2) + 50;
                        
                        updateSliders('강연자');
                        drawCanvas();
                        if (overlay) overlay.style.display = 'none';
                    };
                    img.src = url;
                }).catch(err => {
                    // 3. 실패 시 원본 사용 (Fallback)
                    console.error("배경 제거 실패 (원본 사용):", err);
                    alert("배경 제거에 실패했습니다. 원본 이미지를 사용합니다.");
                    if (overlay) overlay.style.display = 'none';
                    loadNormalImage(file, targetState, true);
                });
            } else {
                // 라이브러리 로드 안됨
                console.warn("배경 제거 라이브러리 없음 (원본 사용)");
                if (overlay) overlay.style.display = 'none';
                loadNormalImage(file, targetState, true);
            }
        } else {
            // 일반 이미지 (로고, 배경 등)
            loadNormalImage(file, targetState);
        }
    }

    /** 배경 이미지 로드 전용 함수 (배열 인덱스 사용) */
    function loadBackground(file, index) {
        if (!file) {
            state.backgrounds[index] = null;
            drawCanvas();
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                state.backgrounds[index] = img;
                drawCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function loadNormalImage(file, targetState, isSpeaker = false) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                targetState.img = img;
                if (isSpeaker) {
                    // 강연자 기본 배치 (배경 제거 실패 시에도)
                    targetState.scale = (canvas.height * 0.7) / img.height;
                    targetState.x = canvas.width / 2;
                    targetState.y = canvas.height - (img.height * targetState.scale / 2);
                    updateSliders('강연자');
                }
                drawCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // --- 정밀 조정 UI ---
    
    // UI 컨트롤 그룹 매핑 (이름 -> 상태 객체)
    const controlsMap = {
        '강연자': state.speaker,
        '로고': state.logo,
        '이름/소속': state.speakerName,
        '강조문구1': state.mainText1,
        '강조문구2': state.mainText2
    };

    /** 컨트롤 생성 함수 */
    function createFineTuneControls(name, elementState) {
        const wrapper = document.createElement('div');
        wrapper.className = 'fine-tune-group';
        wrapper.style.marginBottom = '20px';
        wrapper.style.padding = '10px';
        wrapper.style.background = 'rgba(255,255,255,0.05)';
        wrapper.style.borderRadius = '8px';

        const title = document.createElement('h4');
        title.textContent = name;
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '14px';
        title.style.color = '#ddd';
        wrapper.appendChild(title);

        ['x', 'y', 'scale', 'size'].forEach(prop => {
            if (elementState[prop] === undefined) return;

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.marginBottom = '5px';

            const label = document.createElement('label');
            label.textContent = prop.toUpperCase();
            label.style.width = '50px';
            label.style.fontSize = '12px';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.style.flex = '1';
            
            // 슬라이더 범위 설정
            if (prop === 'scale') {
                slider.min = 0.1; slider.max = 3.0; slider.step = 0.01;
            } else if (prop === 'size') {
                slider.min = 10; slider.max = 300; slider.step = 1;
            } else { // x, y
                slider.min = -500; slider.max = 2000; slider.step = 1;
            }
            
            slider.value = elementState[prop];
            slider.dataset.group = name; // 식별용 데이터 속성
            slider.dataset.prop = prop;

            // 이벤트 리스너: 슬라이더 조작 시 상태 업데이트 및 다시 그리기
            slider.addEventListener('input', (e) => {
                elementState[prop] = parseFloat(e.target.value);
                drawCanvas();
            });

            row.appendChild(label);
            row.appendChild(slider);
            wrapper.appendChild(row);
        });

        return wrapper;
    }

    /** 특정 그룹의 슬라이더 값을 현재 state 값으로 업데이트 (자동 배치 후 호출) */
    function updateSliders(groupName) {
        const sliders = fineTuneControlsContainer.querySelectorAll(`input[data-group="${groupName}"]`);
        const elementState = controlsMap[groupName];
        if (!elementState) return;

        sliders.forEach(slider => {
            const prop = slider.dataset.prop;
            if (elementState[prop] !== undefined) {
                slider.value = elementState[prop];
            }
        });
    }

    // --- 초기화 및 실행 ---
    function init() {
        // 1. 상태값 초기화 (input 값과 동기화)
        if (speakerNameInput) state.speakerName.text = speakerNameInput.value;
        if (mainText1Input) state.mainText1.text = mainText1Input.value;
        if (mainText2Input) state.mainText2.text = mainText2Input.value;
        if (highlightColorInput) state.highlightColor = highlightColorInput.value;

        // 2. 정밀 조정 UI 생성
        fineTuneControlsContainer.innerHTML = ''; // 초기화
        for (const [name, elementState] of Object.entries(controlsMap)) {
            fineTuneControlsContainer.appendChild(createFineTuneControls(name, elementState));
        }

        // 3. 정적 Input 이벤트 리스너 연결
        if (speakerImageInput) speakerImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.speaker, true));
        
        // 배경 이미지 입력 리스너 (3개)
        if (bgImageInput1) bgImageInput1.addEventListener('change', e => loadBackground(e.target.files[0], 0));
        if (bgImageInput2) bgImageInput2.addEventListener('change', e => loadBackground(e.target.files[0], 1));
        if (bgImageInput3) bgImageInput3.addEventListener('change', e => loadBackground(e.target.files[0], 2));

        if (logoImageInput) logoImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.logo));
        
        if (speakerNameInput) speakerNameInput.addEventListener('input', e => { state.speakerName.text = e.target.value; drawCanvas(); });
        if (mainText1Input) mainText1Input.addEventListener('input', e => { state.mainText1.text = e.target.value; drawCanvas(); });
        if (mainText2Input) mainText2Input.addEventListener('input', e => { state.mainText2.text = e.target.value; drawCanvas(); });
        if (highlightColorInput) highlightColorInput.addEventListener('input', e => { state.highlightColor = e.target.value; drawCanvas(); });

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'thumbnail.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }

        // 4. 초기 그리기
        // 폰트 로딩 대기 후 그리기
        document.fonts.ready.then(() => {
            drawCanvas();
        });
    }

    init();
});
