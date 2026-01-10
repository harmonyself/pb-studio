const targetThumbnailInput = document.getElementById('target-thumbnail');
const targetOpacityInput = document.getElementById('target-opacity');

const backgroundImageInput = document.getElementById('background-image');

const personImageInput = document.getElementById('person-image');
const personXInput = document.getElementById('person-x');
const personYInput = document.getElementById('person-y');
const personScaleInput = document.getElementById('person-scale');

const copyTextInput = document.getElementById('copy-text');
const textXInput = document.getElementById('text-x');
const textYInput = document.getElementById('text-y');
const textSizeInput = document.getElementById('text-size');

const generateBtn = document.getElementById('generate-btn');
const canvas = document.getElementById('thumbnail-canvas');
const downloadBtn = document.getElementById('download-btn');
const ctx = canvas.getContext('2d');

const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const htmlElement = document.documentElement;

// State to store loaded images
let loadedImages = {
    target: null,
    background: null,
    person: null
};

// Theme Toggle Logic
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Initial Theme Check
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Image Loading Helper
function loadImage(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle File Inputs
targetThumbnailInput.addEventListener('change', async (e) => {
    loadedImages.target = await loadImage(e.target.files[0]);
    drawCanvas();
});

backgroundImageInput.addEventListener('change', async (e) => {
    loadedImages.background = await loadImage(e.target.files[0]);
    drawCanvas();
});

personImageInput.addEventListener('change', async (e) => {
    loadedImages.person = await loadImage(e.target.files[0]);
    drawCanvas();
});

// Handle Sliders and Text Input
[targetOpacityInput, personXInput, personYInput, personScaleInput, copyTextInput, textXInput, textYInput, textSizeInput].forEach(input => {
    input.addEventListener('input', drawCanvas);
});

function drawCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Background
    if (loadedImages.background) {
        ctx.drawImage(loadedImages.background, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Person Image
    if (loadedImages.person) {
        const x = parseInt(personXInput.value);
        const y = parseInt(personYInput.value);
        const scale = parseFloat(personScaleInput.value);
        
        const width = loadedImages.person.width * scale;
        const height = loadedImages.person.height * scale;
        
        // Draw centered at X, Y
        ctx.drawImage(loadedImages.person, x - width / 2, y - height / 2, width, height);
    }

    // 3. Draw Text
    const text = copyTextInput.value;
    if (text) {
        const x = parseInt(textXInput.value);
        const y = parseInt(textYInput.value);
        const size = parseInt(textSizeInput.value);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = size * 0.08; // Proportional outline
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }

    // 4. Draw Target Thumbnail (Overlay)
    if (loadedImages.target) {
        ctx.save();
        ctx.globalAlpha = parseFloat(targetOpacityInput.value);
        ctx.drawImage(loadedImages.target, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // Update download button visibility
    downloadBtn.style.display = 'inline-flex';
}

function downloadThumbnail() {
    // Temporarily hide the overlay for the final download
    // or let the user decide. Usually, we want to download WITHOUT the guide if opacity is low, 
    // or MAYBE the user wants it.
    // Let's assume for "Production" we might want to hide the overlay if opacity < 1?
    // For now, WYSIWYG (What You See Is What You Get). 
    // But logically, if it's a "Guide", you don't want it in the final image.
    
    // Quick re-draw without overlay for download
    const currentOpacity = targetOpacityInput.value;
    targetOpacityInput.value = 0; // Hide overlay
    drawCanvas();
    
    const link = document.createElement('a');
    link.download = 'youtube_thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Restore overlay
    targetOpacityInput.value = currentOpacity;
    drawCanvas();
}

generateBtn.addEventListener('click', drawCanvas); // Keep for compatibility/explicit action
downloadBtn.addEventListener('click', downloadThumbnail);
