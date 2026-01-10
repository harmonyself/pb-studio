document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 참조 ---
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');

    // 입력 요소
    const speakerImageInput = document.getElementById('speakerImage');
    const removeSpeakerBgInput = document.getElementById('removeSpeakerBg');
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
        speaker: { img: null, x: 50, y: 150, scale: 1.2, removeBg: false },
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
        ctx.font = '16px Pretendard'; // 폰트 로딩을 위한 기본 설정

        // 1. 배경 이미지
        if (state.background.img) drawImage(state.background);

        // 2. 강연자 이미지
        if (state.speaker.img) drawImage(state.speaker);

        // 3. 로고 이미지
        if (state.logo.img) drawImage(state.logo);

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
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(text, x, y);
    }

    /** 강조 태그가 포함된 텍스트를 그리는 함수 (버그 수정) */
    function drawHighlightedText(text, x, y, size) {
        ctx.font = `900 ${size}px Pretendard, sans-serif`;
        ctx.textBaseline = 'alphabetic';

        const highlightRegex = /\(강조\)([^()]+)/g;
        let currentX = x;
        let lastIndex = 0;
        let match;

        while ((match = highlightRegex.exec(text)) !== null) {
            const before = text.substring(lastIndex, match.index);
            const content = match[1];

            // 1. 강조 아닌 텍스트 그리기
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(before, currentX, y);
            currentX += ctx.measureText(before).width;

            // 2. 강조 텍스트 그리기
            const metrics = ctx.measureText(content);
            ctx.fillStyle = state.highlightColor;
            ctx.fillRect(currentX - 5, y - size + 5, metrics.width + 10, size + 10);
            ctx.fillStyle = '#000000';
            ctx.fillText(content, currentX, y);
            currentX += metrics.width;

            lastIndex = highlightRegex.lastIndex;
        }

        // 3. 마지막 매치 후 남은 텍스트 그리기
        const remaining = text.substring(lastIndex);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(remaining, currentX, y);
    }

    /** 파일 입력으로부터 이미지를 로드하는 함수 */
    function loadImage(file, targetState) {
        if (!file) {
            targetState.img = null;
            drawCanvas();
            return;
        }
        if (targetState.removeBg) {
            console.log('배경 제거 기능은 현재 준비 중입니다. 원본 이미지를 로드합니다.');
            // 나중에 여기에 배경 제거 API 호출 로직 추가
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

        ['x', 'y', 'scale', 'size'].forEach(prop => {
            if (elementState[prop] === undefined) return;
            const isScale = prop === 'scale';
            const isSize = prop === 'size';
            const max = isScale ? 3 : (isSize ? 150 : canvas.width);
            const min = isScale ? 0.1 : (isSize ? 10 : -canvas.width);
            const step = isScale ? 0.01 : 1;
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-control';
            const label = document.createElement('label');
            label.textContent = prop.toUpperCase();
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min; slider.max = max; slider.step = step; slider.value = elementState[prop];
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

        // 정밀 조정 UI 생성
        fineTuneControlsContainer.appendChild(createFineTuneControls('강연자', state.speaker));
        fineTuneControlsContainer.appendChild(createFineTuneControls('로고', state.logo));
        fineTuneControlsContainer.appendChild(createFineTuneControls('이름/소속', state.speakerName));
        fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구1', state.mainText1));
        fineTuneControlsContainer.appendChild(createFineTuneControls('강조문구2', state.mainText2));
        
        // 이벤트 리스너 연결
        removeSpeakerBgInput.addEventListener('change', e => { 
            state.speaker.removeBg = e.target.checked;
            if(e.target.checked) alert('배경 제거 기능은 현재 준비 중입니다. 외부 프로그램을 이용해 PNG 파일을 올려주세요.');
        });
        speakerImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.speaker));
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
        
        // 폰트가 로드될 시간을 준 후 초기 캔버스 그리기
        setTimeout(drawCanvas, 100); 
    }

    // --- 실행 ---
    init();
});
