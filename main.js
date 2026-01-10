const targetThumbnailInput = document.getElementById('target-thumbnail');
const backgroundImageInput = document.getElementById('background-image');
const personImageInput = document.getElementById('person-image');
const copyTextInput = document.getElementById('copy-text');
const generateBtn = document.getElementById('generate-btn');
const canvas = document.getElementById('thumbnail-canvas');
const downloadBtn = document.getElementById('download-btn');
const ctx = canvas.getContext('2d');

const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const htmlElement = document.documentElement;

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

async function generateThumbnail() {
    const [backgroundImg, personImg] = await Promise.all([
        loadImage(backgroundImageInput.files[0]),
        loadImage(personImageInput.files[0])
    ]);

    // Draw background image
    if (backgroundImg) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        // Default background if none provided
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw person image
    if (personImg) {
        // Simple positioning for the person image (can be improved)
        const scale = Math.min(canvas.width / 2 / personImg.width, canvas.height / personImg.height);
        const width = personImg.width * scale;
        const height = personImg.height * scale;
        ctx.drawImage(personImg, canvas.width - width, 0, width, height);
    }

    // Draw text
    const text = copyTextInput.value;
    if (text) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.font = 'bold 100px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(text, canvas.width / 2, canvas.height - 100);
        ctx.fillText(text, canvas.width / 2, canvas.height - 100);
    }

    downloadBtn.style.display = 'inline-flex';
}

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

function downloadThumbnail() {
    const link = document.createElement('a');
    link.download = 'thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

generateBtn.addEventListener('click', generateThumbnail);
downloadBtn.addEventListener('click', downloadThumbnail);
