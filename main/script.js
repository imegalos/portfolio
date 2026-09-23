document.addEventListener('DOMContentLoaded', () => {
    // Inicializar os ícones da biblioteca Lucide
    if (window.lucide) {
        lucide.createIcons();
    }

    // Filtros da Galeria de Projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa dos outros botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth Scroll para navegação interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Idioma padrão pelo navegador ou preferência salva
    const savedLang = localStorage.getItem('preferred_lang');
    const browserLang = navigator.language || navigator.userLanguage;
    const defaultLang = savedLang || (browserLang.startsWith('en') ? 'en' : 'pt');

    setLanguage(defaultLang);

    // Initialize Lucide Icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Filtro dos projetos (main.html)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

function setLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

    // Oculta/Exibe os elementos conforme a classe de idioma
    const ptElements = document.querySelectorAll('.lang-pt');
    const enElements = document.querySelectorAll('.lang-en');

    if (lang === 'en') {
        ptElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = el.tagName === 'SPAN' || el.tagName === 'A' ? 'inline-block' : 'block');
    } else {
        enElements.forEach(el => el.style.display = 'none');
        ptElements.forEach(el => el.style.display = el.tagName === 'SPAN' || el.tagName === 'A' ? 'inline-block' : 'block');
    }

    // Atualiza o texto/estado do botão de alternância de idioma
    const langBtns = document.querySelectorAll('.lang-toggle-btn');
    langBtns.forEach(btn => {
        btn.textContent = lang === 'en' ? 'PT' : 'EN';
        btn.setAttribute('title', lang === 'en' ? 'Mudar para Português' : 'Switch to English');
    });
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('preferred_lang') || 'pt';
    const newLang = currentLang === 'en' ? 'pt' : 'en';
    setLanguage(newLang);
}