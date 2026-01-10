document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const numbersContainer = document.getElementById('numbers-container');
  const themeToggle = document.getElementById('theme-toggle');

  // Theme Logic
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Lotto Logic
  generateBtn.addEventListener('click', () => {
    generateNumbers();
  });

  function generateNumbers() {
    // Clear previous numbers
    numbersContainer.innerHTML = '';

    const numbers = new Set();
    // User requested 5 numbers specifically
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    // Sort numbers
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    // Create and append balls with delay for animation effect
    sortedNumbers.forEach((num, index) => {
      const ball = document.createElement('div');
      ball.classList.add('ball');
      ball.textContent = num;
      
      // Assign color class based on number range
      if (num <= 10) ball.classList.add('ball-range-1');
      else if (num <= 20) ball.classList.add('ball-range-2');
      else if (num <= 30) ball.classList.add('ball-range-3');
      else if (num <= 40) ball.classList.add('ball-range-4');
      else ball.classList.add('ball-range-5');

      // Stagger animation
      ball.style.animationDelay = `${index * 0.1}s`;

      numbersContainer.appendChild(ball);
    });
  }
});