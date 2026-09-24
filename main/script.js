document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuração e Aplicação do Idioma
    const savedLang = localStorage.getItem('preferred_lang');
    const browserLang = navigator.language || navigator.userLanguage;
    const defaultLang = savedLang || (browserLang.startsWith('en') ? 'en' : 'pt');

    setLanguage(defaultLang);

    // 2. Inicializar os ícones da biblioteca Lucide
    if (window.lucide || typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Filtros da Galeria de Projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
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

    // 4. Smooth Scroll para navegação interna
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

// Funções de Controle de Idioma
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

let currentIndex = 0;
const players = []; // Armazena as instâncias dos players do Vimeo

function initVimeoPlayers() {
    const iframes = document.querySelectorAll('.vimeo-responsive-wrapper iframe');
    
    iframes.forEach((iframe, index) => {
        // Inicializa cada player com a API do Vimeo
        const player = new Vimeo.Player(iframe);
        players[index] = player;
    });
}

function updateCarousel() {
    const slides = document.querySelectorAll('.vimeo-slide');
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    slides.forEach((slide, index) => {
        // Limpa todas as classes de estado 3D
        slide.classList.remove('active', 'prev', 'next');

        if (index === currentIndex) {
            slide.classList.add('active');
            
            // Dá play no vídeo que entrou em foco
            if (players[index]) {
                players[index].play().catch((error) => {
                    // Trata políticas de Autoplay dos navegadores caso bloqueiem áudio
                    console.warn('Autoplay bloqueado pelo navegador:', error);
                });
            }
        } else {
            if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
                slide.classList.add('prev');
            } else if (index === (currentIndex + 1) % totalSlides) {
                slide.classList.add('next');
            }
            
            // Pausa qualquer outro vídeo que não esteja em foco
            if (players[index]) {
                players[index].pause();
            }
        }
    });

    updateIndicators();
}

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.vimeo-slide');
    const totalSlides = slides.length;
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function createIndicators() {
    const container = document.getElementById('vimeoIndicators');
    const slides = document.querySelectorAll('.vimeo-slide');
    if (!container) return;
    
    container.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        container.appendChild(dot);
    });
}

function updateIndicators() {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Inicializa quando a página e scripts carregam
document.addEventListener('DOMContentLoaded', () => {
    initVimeoPlayers();
    createIndicators();
    updateCarousel();
});