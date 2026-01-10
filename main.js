document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 참조 ---
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');

    // 입력 요소
    const speakerImageInput = document.getElementById('speakerImage');
    const bgImageInput = document.getElementById('bgImage');
    const logoImageInput = document.getElementById('logoImage');
    const speakerNameInput = document.getElementById('speakerName');
    const mainText1Input = document.getElementById('mainText1');
    const mainText2Input = document.getElementById('mainText2');
    const highlightColorInput = document.getElementById('highlightColor');
    const fineTuneControlsContainer = document.getElementById('fine-tune-controls');

    // 버튼
    const downloadBtn = document.getElementById('downloadBtn');

    // --- 상태 관리 객체 ---
    const state = {
        speaker: { img: null, x: 50, y: 150, scale: 1.2 },
        background: { img: null, x: 0, y: 0, scale: 1 },
        logo: { img: null, x: 1050, y: 40, scale: 0.8 },
        speakerName: { text: '', x: 650, y: 450, size: 40 },
        mainText1: { text: '', x: 650, y: 550, size: 90 },
        mainText2: { text: '', x: 650, y: 650, size: 90 },
        highlightColor: '#FFFF00'
    };

    // --- 함수 ---

    /** 캔버스를 다시 그리는 메인 함수 */
    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 배경 이미지
        if (state.background.img) {
            drawImage(state.background);
        }

        // 2. 강연자 이미지
        if (state.speaker.img) {
            drawImage(state.speaker);
        }

        // 3. 로고 이미지
        if (state.logo.img) {
            drawImage(state.logo);
        }

        // 4. 텍스트
        drawText(state.speakerName.text, state.speakerName.x, state.speakerName.y, state.speakerName.size, '#FFFFFF', '500');
        drawHighlightedText(state.mainText1.text, state.mainText1.x, state.mainText1.y, state.mainText1.size);
        drawHighlightedText(state.mainText2.text, state.mainText2.x, state.mainText2.y, state.mainText2.size);
    }

    /** 이미지를 캔버스에 그리는 함수 */
    function drawImage(element) {
        const { img, x, y, scale } = element;
        if (!img) return;
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, x, y, w, h);
    }
    
    /** 기본 텍스트를 캔버스에 그리는 함수 */
    function drawText(text, x, y, size, color, weight) {
        ctx.font = `${weight} ${size}px Pretendard, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 가독성을 위한 외곽선
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = size * 0.1;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
        
        ctx.fillText(text, x, y);
    }

    /** 강조 텍스트를 그리는 함수 (괄호를 강조 색상으로) */
    function drawHighlightedText(text, x, y, size) {
        if (!text) return;

        ctx.font = `bold ${size}px Pretendard, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        const parts = text.split(/(\(.*?\))/g);
        const segments = parts.map(part => {
            if (part.startsWith('(') && part.endsWith(')')) {
                return { text: part.slice(1, -1), highlight: true };
            }
            return { text: part, highlight: false };
        }).filter(s => s.text.length > 0);

        let totalWidth = 0;
        segments.forEach(s => {
            totalWidth += ctx.measureText(s.text).width;
        });

        let currentX = x - totalWidth / 2;

        segments.forEach(s => {
            ctx.fillStyle = s.highlight ? state.highlightColor : '#FFFFFF';
            
            ctx.strokeStyle = 'rgba(0,0,0,0.7)';
            ctx.lineWidth = size * 0.15;
            ctx.lineJoin = 'round';
            ctx.strokeText(s.text, currentX, y);
            
            ctx.fillText(s.text, currentX, y);
            currentX += ctx.measureText(s.text).width;
        });
    }

    /** 파일 입력으로부터 이미지를 로드하는 함수 */
    function loadImage(file, targetState) {
        if (!file) {
            targetState.img = null;
            drawCanvas();
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                targetState.img = img;
                drawCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    /** 정밀 조정 UI를 생성하는 함수 */
    function createFineTuneControls(elementName, elementState) {
        const container = document.createElement('div');
        container.className = 'fine-tune-control';
        
        const title = document.createElement('h3');
        title.textContent = elementName;
        container.appendChild(title);

        // X, Y, Scale 슬라이더 생성
        ['x', 'y', 'scale', 'size'].forEach(prop => {
            if (elementState[prop] === undefined) return;

            const isScale = prop === 'scale';
            const isSize = prop === 'size';
            const max = isScale ? 3 : (isSize ? 150 : canvas.width);
            const min = isScale ? 0.1 : (isSize? 10 : -200);
            const step = isScale ? 0.01 : 1;
            
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-control';
            
            const label = document.createElement('label');
            label.textContent = prop.toUpperCase();
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.step = step;
            slider.value = elementState[prop];

            slider.addEventListener('input', (e) => {
                elementState[prop] = parseFloat(e.target.value);
                drawCanvas();
            });

            sliderContainer.append(label, slider);
            container.appendChild(sliderContainer);
        });

        return container;
    }

    /** 모든 컨트롤 UI를 초기화하는 함수 */
    function init() {
        // 초기 텍스트 상태 업데이트
        state.speakerName.text = speakerNameInput.value;
        state.mainText1.text = mainText1Input.value;
        state.mainText2.text = mainText2Input.value;

        // 정밀 조정 UI 생성 및 추가
        fineTuneControlsContainer.appendChild(createFineTuneControls('강연자', state.speaker));
        fineTuneControlsContainer.appendChild(createFineTuneControls('로고', state.logo));
        fineTuneControlsContainer.appendChild(createFineTuneControls('이름/소속', state.speakerName));
        fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구1', state.mainText1));
        fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구2', state.mainText2));
        
        // 이벤트 리스너 연결
        speakerImageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.style.display = 'flex';

            try {
                // @imgly/background-removal 사용
                // CDN에서 로드된 전역 함수 imglyRemoveBackground 사용
                const blob = await imglyRemoveBackground(file);
                const url = URL.createObjectURL(blob);
                
                const img = new Image();
                img.onload = () => {
                    state.speaker.img = img;
                    
                    // 가슴 높이 크롭 효과를 위한 자동 배치
                    // 1. 적절한 크기로 스케일 조정 (화면 높이의 80% 정도 차지하도록)
                    const scale = (canvas.height * 0.9) / img.height;
                    state.speaker.scale = scale;

                    // 2. 가로 중앙 정렬
                    state.speaker.x = (canvas.width / 2) - ((img.width * scale) / 2);

                    // 3. 세로 위치 조정 (하단 정렬 + 약간 아래로 내려서 상반신 크롭 효과)
                    // 이미지가 캔버스 하단보다 약간 더 내려가도록 설정
                    state.speaker.y = canvas.height - (img.height * scale) + (img.height * scale * 0.1);

                    // UI 슬라이더 값 업데이트 (동기화)
                    // (UI 재생성 필요할 수 있음 - 간단히 값만 바꾸면 drawCanvas시 반영됨, 
                    // 하지만 슬라이더 UI 자체는 createFineTuneControls에서 생성되므로
                    // 동적으로 찾아서 업데이트하거나, 사용자가 조작할 때 반영됨.
                    // 여기서는 내부 state만 바꾸고 다시 그리면 됨.)
                    
                    loadingOverlay.style.display = 'none';
                    drawCanvas();
                    
                    // 정밀 조정 패널을 다시 그려서 슬라이더 값을 최신 상태로 동기화하는 것이 좋음
                    // (기존 컨트롤 제거 후 다시 생성)
                    fineTuneControlsContainer.innerHTML = '';
                    fineTuneControlsContainer.appendChild(createFineTuneControls('강연자', state.speaker));
                    fineTuneControlsContainer.appendChild(createFineTuneControls('로고', state.logo));
                    fineTuneControlsContainer.appendChild(createFineTuneControls('이름/소속', state.speakerName));
                    fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구1', state.mainText1));
                    fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구2', state.mainText2));
                };
                img.src = url;

            } catch (error) {
                console.error("배경 제거 실패:", error);
                alert("배경 제거 중 오류가 발생했습니다. 원본 이미지를 사용합니다.");
                loadingOverlay.style.display = 'none';
                loadImage(file, state.speaker);
            }
        });
        
        bgImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.background));
        logoImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.logo));

        speakerNameInput.addEventListener('input', e => { state.speakerName.text = e.target.value; drawCanvas(); });
        mainText1Input.addEventListener('input', e => { state.mainText1.text = e.target.value; drawCanvas(); });
        mainText2Input.addEventListener('input', e => { state.mainText2.text = e.target.value; drawCanvas(); });
        highlightColorInput.addEventListener('input', e => { state.highlightColor = e.target.value; drawCanvas(); });

        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'thumbnail.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
        
        // 초기 캔버스 그리기
        drawCanvas();
    }

    // --- 실행 ---
    init();
});
