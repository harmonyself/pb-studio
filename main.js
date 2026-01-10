class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="container">
                <h1>Lotto Number Generator</h1>
                <div class="numbers"></div>
                <button>Generate</button>
            </div>
        `;

        this.shadowRoot.querySelector('button').addEventListener('click', () => this.generateNumbers());
    }

    generateNumbers() {
        const numbersContainer = this.shadowRoot.querySelector('.numbers');
        numbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        for (const number of [...numbers].sort((a, b) => a - b)) {
            const numberEl = document.createElement('div');
            numberEl.classList.add('number');
            numberEl.textContent = number;
            numbersContainer.appendChild(numberEl);
        }
    }
}

customElements.define('lotto-generator', LottoGenerator);
