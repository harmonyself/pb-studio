document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 참조 ---
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');

    // 입력 요소
    const speakerImageInput = document.getElementById('speakerImage');
    
    // 배경 이미지 입력 3개
    const bgImageInput1 = document.getElementById('bgImage1');
    const bgImageInput2 = document.getElementById('bgImage2');
    const bgImageInput3 = document.getElementById('bgImage3');
    
    const logoImageInput = document.getElementById('logoImage');
    
    // 강연자 정보 분리
    const speakerNameTextInput = document.getElementById('speakerNameText');
    const speakerAffiliationTextInput = document.getElementById('speakerAffiliationText');

    const mainText1Input = document.getElementById('mainText1');
    const mainText2Input = document.getElementById('mainText2');
    const highlightColorInput = document.getElementById('highlightColor');
    const fineTuneControlsContainer = document.getElementById('fine-tune-controls');
    
    // 벤치마킹 & 유튜브 추출 요소
    const benchmarkImageInput = document.getElementById('benchmarkImage');
    const referenceContainer = document.getElementById('referenceContainer');
    const referenceImg = document.getElementById('referenceImg');
    const closeRefBtn = document.getElementById('closeRefBtn');
    
    const ytUrlInput = document.getElementById('ytUrlInput');
    const ytExtractBtn = document.getElementById('ytExtractBtn');
    const ytPreviewArea = document.getElementById('ytPreviewArea');
    const ytPreviewImg = document.getElementById('ytPreviewImg');
    const ytDownloadLink = document.getElementById('ytDownloadLink');
    const ytUseRefBtn = document.getElementById('ytUseRefBtn');

    // 버튼
    const downloadBtn = document.getElementById('downloadBtn');
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    const loadProjectInput = document.getElementById('loadProjectInput');


    // 로딩 오버레이
    const loadingOverlay = document.getElementById('loading-overlay');



    // --- 상태 관리 객체 ---
    const state = {
        speaker: { img: null, x: 640, y: 720, scale: 1 }, 
        backgrounds: [
            { img: null, x: 640, y: 360, scale: 1 },
            { img: null, x: 640, y: 360, scale: 1 },
            { img: null, x: 640, y: 360, scale: 1 }
        ],
        logo: { img: null, x: 1100, y: 50, scale: 0.8 }, // 원래 설정값으로 복원
        // 이름/소속 통합 관리 (좌표는 공유)
        speakerInfo: { name: '홍길동', affiliation: '유썸생 대표', x: 640, y: 450, size: 40 },
        mainText1: { text: '', x: 640, y: 550, size: 90 },
        mainText2: { text: '', x: 640, y: 650, size: 90 },
        highlightColor: '#FFFF00'
    };

    const defaultLogoPath = 'imgs/logo_GroundofDream.png'; // 기본 로고 파일 경로

    // --- 메인 그리기 함수 ---
    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBlendedBackground();

        if (state.speaker.img) {
            drawImage(state.speaker);
        }

        if (state.logo.img) {
            drawImage(state.logo);
        }

        // 이름 & 소속 그리기 (복합 스타일)
        drawSpeakerInfo();

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

    /** 이름과 소속을 구분하여 그리는 함수 */
    function drawSpeakerInfo() {
        const info = state.speakerInfo;
        if (!info.name && !info.affiliation) return;

        const nameFont = `900 ${info.size * 1.2}px Pretendard, sans-serif`; // 이름: 더 크고 진하게
        const affFont = `500 ${info.size}px Pretendard, sans-serif`; // 소속: 보통
        const separator = " | ";

        ctx.textBaseline = 'middle';
        
        // 1. 전체 너비 계산 (중앙 정렬용)
        ctx.font = nameFont;
        const nameWidth = ctx.measureText(info.name).width;
        
        ctx.font = affFont;
        const affWidth = ctx.measureText(info.affiliation).width;
        const sepWidth = ctx.measureText(separator).width;

        const totalWidth = nameWidth + sepWidth + affWidth;
        let startX = info.x - (totalWidth / 2);

        // 2. 그리기 (이름 -> 구분자 -> 소속)
        
        // 이름 (Bold)
        ctx.font = nameFont;
        ctx.textAlign = 'left';
        
        // 외곽선
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = info.size * 0.12;
        ctx.lineJoin = 'round';
        ctx.strokeText(info.name, startX, info.y);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(info.name, startX, info.y);
        
        startX += nameWidth;

        // 구분자 + 소속 (Normal)
        const restText = separator + info.affiliation;
        ctx.font = affFont;
        
        ctx.strokeText(restText, startX, info.y);
        ctx.fillText(restText, startX, info.y);
    }

    function drawBlendedBackground() {
        if (!state.backgrounds[0].img && !state.backgrounds[1].img && !state.backgrounds[2].img) {
            ctx.fillStyle = '#121212';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const w = canvas.width;
        const h = canvas.height;

        if (state.backgrounds[0].img) {
            drawImage(state.backgrounds[0]);
        }
        
        if (state.backgrounds[1].img) {
            ctx.save();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tCtx = tempCanvas.getContext('2d');
            
            const bgState = state.backgrounds[1];
            const width = bgState.img.width * bgState.scale;
            const height = bgState.img.height * bgState.scale;
            tCtx.drawImage(bgState.img, bgState.x - width / 2, bgState.y - height / 2, width, height);
            
            tCtx.globalCompositeOperation = 'destination-in';
            const grad = tCtx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.2, 'rgba(0,0,0,1)');
            grad.addColorStop(0.8, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            tCtx.fillStyle = grad;
            tCtx.fillRect(0, 0, w, h);
            
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        }

        if (state.backgrounds[2].img) {
            ctx.save();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tCtx = tempCanvas.getContext('2d');
            
            const bgState = state.backgrounds[2];
            const width = bgState.img.width * bgState.scale;
            const height = bgState.img.height * bgState.scale;
            tCtx.drawImage(bgState.img, bgState.x - width / 2, bgState.y - height / 2, width, height);
            
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

    function drawImage(elementState) {
        if (!elementState.img) return;
        const w = elementState.img.width * elementState.scale;
        const h = elementState.img.height * elementState.scale;
        ctx.drawImage(elementState.img, elementState.x - w / 2, elementState.y - h / 2, w, h);
    }

    function drawHighlightedText(text, x, y, size) {
        if (!text) return;

        ctx.font = `900 ${size}px Pretendard, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        const parts = text.split(/(\([^)]+\))/g);
        
        let totalWidth = 0;
        const segments = parts.map(part => {
            let content = part;
            let isHighlight = false;
            if (part.startsWith('(') && part.endsWith(')')) {
                content = part.slice(1, -1);
                isHighlight = true;
            }
            if (content === '') return null;
            const width = ctx.measureText(content).width;
            totalWidth += width;
            return { text: content, highlight: isHighlight, width: width };
        }).filter(s => s !== null);

        let currentX = x - (totalWidth / 2);

        segments.forEach(segment => {
            ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = size * 0.12;
            ctx.lineJoin = 'round';
            ctx.strokeText(segment.text, currentX, y);
            ctx.fillStyle = segment.highlight ? state.highlightColor : '#FFFFFF';
            ctx.fillText(segment.text, currentX, y);
            currentX += segment.width;
        });
    }

    function loadImage(file, targetState, isSpeaker = false) {
        if (!file) return;
        if (isSpeaker) {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.style.display = 'flex';

            if (typeof imglyRemoveBackground !== 'undefined') {
                const config = {
                    publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.0.3/dist/',
                    progress: (key, current, total) => {}
                };
                imglyRemoveBackground(file, config).then(blob => {
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = () => {
                        targetState.img = img;
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
                    console.error("배경 제거 실패:", err);
                    alert("배경 제거 실패. 원본 사용.");
                    if (overlay) overlay.style.display = 'none';
                    loadNormalImage(file, targetState, true);
                });
            } else {
                if (overlay) overlay.style.display = 'none';
                loadNormalImage(file, targetState, true);
            }
        } else {
            loadNormalImage(file, targetState);
        }
    }

    function loadBackground(file, index) {
        if (!file) {
            state.backgrounds[index].img = null;
            drawCanvas();
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const bgState = state.backgrounds[index];
                bgState.img = img;
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                bgState.scale = scale;
                bgState.x = canvas.width / 2;
                bgState.y = canvas.height / 2;
                const names = ['배경1 (좌측)', '배경2 (중앙)', '배경3 (우측)'];
                updateSliders(names[index]);
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

    // UI 컨트롤 그룹 매핑
    const controlsMap = {
        '강연자': state.speaker,
        '배경1 (좌측)': state.backgrounds[0],
        '배경2 (중앙)': state.backgrounds[1],
        '배경3 (우측)': state.backgrounds[2],
        '로고': state.logo,
        '이름/소속': state.speakerInfo, // 통합 제어
        '강조문구1': state.mainText1,
        '강조문구2': state.mainText2
    };

    function createFineTuneControls(name, elementState) {
        const wrapper = document.createElement('div');
        wrapper.className = 'fine-tune-group';

        const title = document.createElement('h4');
        title.textContent = name;
        wrapper.appendChild(title);

        const props = ['x', 'y', 'scale', 'size'];

        props.forEach(prop => {
            if (elementState[prop] === undefined) return;

            const row = document.createElement('div');
            row.className = 'fine-tune-row';

            const label = document.createElement('label');
            label.textContent = prop.toUpperCase();

            const slider = document.createElement('input');
            slider.type = 'range';
            
            if (prop === 'scale') {
                slider.min = 0.1; slider.max = 3.0; slider.step = 0.01;
            } else if (prop === 'size') {
                slider.min = 10; slider.max = 300; slider.step = 1;
            } else { 
                slider.min = -500; slider.max = 2000; slider.step = 1;
            }
            
            slider.value = elementState[prop];
            slider.dataset.group = name; 
            slider.dataset.prop = prop;

            const valueLabel = document.createElement('span');
            valueLabel.className = 'value-label';
            valueLabel.textContent = slider.value;

            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                elementState[prop] = val;
                valueLabel.textContent = val;
                drawCanvas();
            });

            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(valueLabel);
            wrapper.appendChild(row);
        });

        return wrapper;
    }

    function updateSliders(groupName) {
        const sliders = fineTuneControlsContainer.querySelectorAll(`input[data-group="${groupName}"]`);
        const elementState = controlsMap[groupName];
        if (!elementState) return;

        sliders.forEach(slider => {
            const prop = slider.dataset.prop;
            if (elementState[prop] !== undefined) {
                slider.value = elementState[prop];
                const valueLabel = slider.parentNode.querySelector('.value-label');
                if (valueLabel) valueLabel.textContent = slider.value;
            }
        });
    }

    // --- 프로젝트 저장/불러오기 기능 ---
    function saveState() {
        // Image 객체를 Data URL(string)로 변환
        const serializableState = {
            speaker: { ...state.speaker, img: state.speaker.img ? state.speaker.img.src : null },
            backgrounds: state.backgrounds.map(bg => ({ ...bg, img: bg.img ? bg.img.src : null })),
            logo: { ...state.logo, img: state.logo.img ? state.logo.img.src : null },
            speakerInfo: { ...state.speakerInfo },
            mainText1: { ...state.mainText1 },
            mainText2: { ...state.mainText2 },
            highlightColor: state.highlightColor,
            // 참고 이미지 상태 추가
            reference: {
                src: referenceImg.src,
                display: referenceContainer.style.display
            }
        };

        const jsonString = JSON.stringify(serializableState, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'project.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function loadState(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                restoreState(loadedData);
            } catch (err) {
                console.error("프로젝트 파일(JSON)을 불러오는 데 실패했습니다.", err);
                alert("잘못된 프로젝트 파일입니다.");
            }
        };
        reader.readAsText(file);
    }

    function restoreState(data) {
        // 1. 텍스트 및 단순 값 복원
        speakerNameTextInput.value = data.speakerInfo.name;
        speakerAffiliationTextInput.value = data.speakerInfo.affiliation;
        mainText1Input.value = data.mainText1.text;
        mainText2Input.value = data.mainText2.text;
        highlightColorInput.value = data.highlightColor;

        Object.assign(state.speakerInfo, data.speakerInfo);
        Object.assign(state.mainText1, data.mainText1);
        Object.assign(state.mainText2, data.mainText2);
        state.highlightColor = data.highlightColor;
        
        // 2. 이미지 로딩 준비 (비동기)
        const imagePromises = [];

        const loadImagePromise = (src) => {
            return new Promise((resolve, reject) => {
                if (!src) return resolve(null);
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        imagePromises.push(loadImagePromise(data.speaker.img));
        data.backgrounds.forEach(bg => imagePromises.push(loadImagePromise(bg.img)));
        imagePromises.push(loadImagePromise(data.logo.img));
        
        // 참고 이미지
        if (data.reference && data.reference.src) {
             referenceImg.src = data.reference.src;
             referenceContainer.style.display = data.reference.display;
        } else {
             referenceContainer.style.display = 'none';
        }

        // 3. 모든 이미지 로딩 완료 후 상태 최종 복원
        Promise.all(imagePromises).then(images => {
            const [speakerImg, bg1, bg2, bg3, logoImg] = images;

            state.speaker = { ...data.speaker, img: speakerImg };
            state.backgrounds[0] = { ...data.backgrounds[0], img: bg1 };
            state.backgrounds[1] = { ...data.backgrounds[1], img: bg2 };
            state.backgrounds[2] = { ...data.backgrounds[2], img: bg3 };
            state.logo = { ...data.logo, img: logoImg };

            // 4. 슬라이더 업데이트 및 캔버스 다시 그리기
            for (const name of Object.keys(controlsMap)) {
                updateSliders(name);
            }
            drawCanvas();
            alert("프로젝트를 성공적으로 불러왔습니다.");
        }).catch(err => {
            console.error("이미지 복원에 실패했습니다.", err);
            alert("프로젝트에 포함된 이미지를 불러오는 데 실패했습니다.");
        });
    }

    function init() {
        // 상태값 초기화
        if (speakerNameTextInput) state.speakerInfo.name = speakerNameTextInput.value;
        if (speakerAffiliationTextInput) state.speakerInfo.affiliation = speakerAffiliationTextInput.value;
        if (mainText1Input) state.mainText1.text = mainText1Input.value;
        if (mainText2Input) state.mainText2.text = mainText2Input.value;
        if (highlightColorInput) state.highlightColor = highlightColorInput.value;

        fineTuneControlsContainer.innerHTML = ''; 
        for (const [name, elementState] of Object.entries(controlsMap)) {
            if (elementState) {
                try {
                    const control = createFineTuneControls(name, elementState);
                    if (control) fineTuneControlsContainer.appendChild(control);
                } catch (e) {
                    console.warn('Control generation error:', name);
                }
            }
        }

        if (speakerImageInput) speakerImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.speaker, true));
        if (bgImageInput1) bgImageInput1.addEventListener('change', e => loadBackground(e.target.files[0], 0));
        if (bgImageInput2) bgImageInput2.addEventListener('change', e => loadBackground(e.target.files[0], 1));
        if (bgImageInput3) bgImageInput3.addEventListener('change', e => loadBackground(e.target.files[0], 2));
        if (logoImageInput) logoImageInput.addEventListener('change', e => loadImage(e.target.files[0], state.logo));
        
        // 이름/소속 입력 이벤트 (상태 업데이트 & 그리기)
        if (speakerNameTextInput) {
            speakerNameTextInput.addEventListener('input', e => { 
                state.speakerInfo.name = e.target.value; 
                drawCanvas(); 
            });
        }
        if (speakerAffiliationTextInput) {
            speakerAffiliationTextInput.addEventListener('input', e => { 
                state.speakerInfo.affiliation = e.target.value; 
                drawCanvas(); 
            });
        }

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
        
        // 프로젝트 저장/불러오기 이벤트 리스너
        if (saveProjectBtn) {
            saveProjectBtn.addEventListener('click', saveState);
        }
        if (loadProjectInput) {
            loadProjectInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    loadState(file);
                }
            });
        }


        // 벤치마킹: 내 이미지 업로드 (참고용 이미지)
        if (benchmarkImageInput) {
            benchmarkImageInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => {
                    if (referenceImg && referenceContainer) {
                        referenceImg.src = evt.target.result;
                        referenceContainer.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        
        // 참고 이미지 닫기 버튼
        if (closeRefBtn) {
            closeRefBtn.addEventListener('click', () => {
                referenceContainer.style.display = 'none';
                benchmarkImageInput.value = ''; // 파일 입력 초기화
            });
        }

        // 유튜브 썸네일 추출기
        if (ytExtractBtn && ytUrlInput) {
            ytExtractBtn.addEventListener('click', () => {
                const url = ytUrlInput.value;
                let videoId = '';
                
                if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1].split('?')[0];
                } else if (url.includes('v=')) {
                    videoId = url.split('v=')[1].split('&')[0];
                }

                if (videoId) {
                    const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    
                    if (ytPreviewImg) {
                        ytPreviewImg.src = thumbUrl;
                        ytPreviewArea.style.display = 'block';
                        ytDownloadLink.href = thumbUrl;
                    }
                } else {
                    alert('유효한 유튜브 주소가 아닙니다.');
                }
            });
        }

        // 추출된 이미지를 '참고용'으로 등록
        if (ytUseRefBtn && ytPreviewImg) {
            ytUseRefBtn.addEventListener('click', () => {
                if (referenceImg && referenceContainer) {
                    referenceImg.src = ytPreviewImg.src;
                    referenceContainer.style.display = 'block';
                }
            });
        }

        // 기본 로고 로드
        const defaultLogo = new Image();
        defaultLogo.onload = () => {
            state.logo.img = defaultLogo;
            // 로고의 x, y, scale은 state 초기값에서 이미 설정되어 있음
            drawCanvas(); // 기본 로고 로드 후 캔버스 다시 그리기
        };
        defaultLogo.onerror = (err) => {
            console.error("기본 로고를 불러오는 데 실패했습니다:", err);
            // 기본 로고 로드 실패 시, state.logo.img는 null로 유지됨
            drawCanvas(); // 에러 발생 시에도 캔버스 초기 그리기
        };
        defaultLogo.src = defaultLogoPath;
        
        document.fonts.ready.then(() => {
            // 기본 로고가 비동기로 로드되므로, 여기서 drawCanvas는 초기 상태를 그리도록 함
            // 로고 로드 완료 시점에 다시 drawCanvas가 호출될 것임
            if (!state.logo.img) { // 기본 로고 로드 실패 또는 아직 로드 중인 경우
                 drawCanvas();
            }
        });
    }

    init();
});