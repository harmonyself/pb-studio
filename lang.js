const translations = {
    ko: {
        nav_tool: "썸네일 생성기",
        nav_guide: "제작 노하우",
        nav_trends: "트렌드 분석",
        nav_jobs: "작업 의뢰",
        nav_help: "도움말",
        nav_cta: "지금 만들기",
        footer_rights: "© 2026 유썸생. All rights reserved.",
        footer_privacy: "개인정보처리방침",
        footer_terms: "이용약관"
    },
    en: {
        nav_tool: "Generator",
        nav_guide: "Guides",
        nav_trends: "Trends",
        nav_jobs: "Request",
        nav_help: "Help",
        nav_cta: "Create Now",
        footer_rights: "© 2026 Youtube Thumb Gen. All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    
    // Inject Language Switcher if it doesn't exist
    if (themeBtn && !document.getElementById('lang-select')) {
        const select = document.createElement('select');
        select.id = 'lang-select';
        select.className = 'lang-selector'; 
        // Inline styles for quick consistency, matching theme button somewhat
        select.style.marginRight = '10px';
        select.style.padding = '4px 8px';
        select.style.borderRadius = '20px';
        select.style.border = '1px solid var(--border-color)';
        select.style.backgroundColor = 'var(--surface-color)';
        select.style.color = 'var(--primary-text-color)';
        select.style.cursor = 'pointer';
        select.style.fontSize = '0.9rem';
        select.style.fontWeight = 'bold';

        select.innerHTML = `
            <option value="ko">🇰🇷 KO</option>
            <option value="en">🇺🇸 EN</option>
        `;
        
        // Insert before the theme button
        themeBtn.parentNode.insertBefore(select, themeBtn);
        
        // Event Listener
        select.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
        
        // Initialization
        const savedLang = localStorage.getItem('lang') || 'ko';
        select.value = savedLang;
        // Apply language immediately
        setLanguage(savedLang);
    }
});

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}
