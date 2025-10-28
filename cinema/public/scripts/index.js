// index.js - Versão integrada com backend
let backendAvailable = false;

// Função para redirecionar para a página do filme
function goToMovie(movieId) {
    window.location.href = `movie.html?id=${movieId}`;
}

// Adicionar cursor pointer aos cards
document.querySelectorAll('.movie-card').forEach(card => {
    card.style.cursor = 'pointer';
});

/**
 * CARREGAMENTO DE FILMES DO BACKEND
 */
async function loadMoviesFromBackend() {
    console.log('[INDEX] Tentando carregar filmes do backend...');
    
    backendAvailable = await ApiService.isBackendAvailable();
    
    if (!backendAvailable) {
        console.warn('[INDEX] Backend não disponível. Nenhuma seção de filmes será carregada.');
        showBackendStatus(false);
        // Limpa as seções caso o backend esteja offline
        document.querySelector('#movies .movies-grid').innerHTML = '<p style="color: white;">Modo Offline. Não foi possível carregar filmes.</p>';
        document.getElementById('moviesSlider').innerHTML = '<p style="color: white;">Modo Offline.</p>';
        return;
    }
    
    console.log('[INDEX] Backend disponível! Carregando filmes...');
    showBackendStatus(true);
    
    let filmesEmAlta = [];
    let todosOsFilmes = [];
    let filmesParaSlider = [];

    // 1. Busca os filmes que estão realmente em cartaz
    const resultEmCartaz = await ApiService.getFilmesEmCartaz();
    if (resultEmCartaz.success && resultEmCartaz.data) {
        // Guarda os 4 primeiros para a seção "Em Alta"
        filmesEmAlta = resultEmCartaz.data.slice(0, 4);
        console.log('[INDEX] Filmes EM ALTA definidos:', filmesEmAlta.map(f => f.id));
        // Renderiza a seção "Filmes em Alta"
        updateFilmesEmAltaSection(filmesEmAlta);
    } else {
        console.error('[INDEX] Erro ao carregar filmes em alta:', resultEmCartaz.error);
        document.querySelector('#movies .movies-grid').innerHTML = '<p style="color: red;">Erro ao carregar filmes em alta.</p>';
    }

    // 2. Busca TODOS os filmes
    const resultTodos = await ApiService.getAllFilmes();
    if (resultTodos.success && resultTodos.data) {
        todosOsFilmes = resultTodos.data;
        console.log('[INDEX] TODOS os filmes recebidos:', todosOsFilmes.length);

        // 3. FILTRA a lista 'todosOsFilmes' para remover os que já estão em 'filmesEmAlta'
        const idsEmAlta = filmesEmAlta.map(filme => filme.id); // Cria um array só com os IDs
        
        filmesParaSlider = todosOsFilmes.filter(filme => {
            // Mantém o filme na lista APENAS SE o ID dele NÃO ESTIVER na lista idsEmAlta
            return !idsEmAlta.includes(filme.id); 
        });
        
        console.log(`[INDEX] Filmes para o SLIDER (após filtro): ${filmesParaSlider.length}`, filmesParaSlider.map(f=>f.id));

        // 4. Renderiza o slider "Em Cartaz" com a lista filtrada
        updateFilmesEmCartazSlider(filmesParaSlider);

    } else {
        console.error('[INDEX] Erro ao carregar todos os filmes para o slider:', resultTodos.error);
        document.getElementById('moviesSlider').innerHTML = '<p style="color: red;">Erro ao carregar filmes para o slider.</p>';
    }
}

/**
 * Carregar filmes em alta (seção principal)
 */
async function loadFilmesEmAlta() {
    const result = await ApiService.getFilmesEmCartaz();
    
    if (!result.success) {
        console.error('[INDEX] Erro ao carregar filmes em alta:', result.error);
        return;
    }
    
    const filmes = result.data;
    console.log('[INDEX] Filmes em alta recebidos:', filmes.length);
    
    // Atualizar apenas se houver filmes
    if (filmes && filmes.length > 0) {
        updateFilmesEmAltaSection(filmes.slice(0, 4)); // Primeiros 4
    }
}

/**
 * Atualizar seção "Filmes em Alta" com dados do backend
 */
function updateFilmesEmAltaSection(filmes) { // Recebe os filmes como argumento
    const moviesGrid = document.querySelector('#movies .movies-grid');
    
    if (!moviesGrid) return;
    moviesGrid.innerHTML = ''; // Limpa o grid
    
    if (filmes && filmes.length > 0) {
        filmes.forEach(filme => {
            const card = createMovieCard(filme);
            moviesGrid.appendChild(card);
        });
    } else {
        moviesGrid.innerHTML = '<p style="color: white;">Nenhum filme em alta no momento.</p>';
    }
}

/**
 * Carregar filmes da seção "Em Cartaz" (slider)
 */
async function loadFilmesEmCartaz() {
    const result = await ApiService.getAllFilmes();
    
    if (!result.success) {
        console.error('[INDEX] Erro ao carregar filmes em cartaz:', result.error);
        return;
    }
    
    const filmes = result.data;
    console.log('[INDEX] Filmes em cartaz recebidos:', filmes.length);
    
    if (filmes && filmes.length > 0) {
        updateFilmesEmCartazSlider(filmes);
    }
}

/**
 * Atualizar slider "Em Cartaz" com dados do backend
 */
function updateFilmesEmCartazSlider(filmes) { // Recebe os filmes FILTRADOS como argumento
    const slider = document.getElementById('moviesSlider');
    
    if (!slider) {
        console.error("[INDEX] Elemento do slider 'moviesSlider' não encontrado.");
        return;
    }
    slider.innerHTML = ''; // Limpa o slider

    if (filmes && filmes.length > 0) {
        filmes.forEach(filme => {
            const slide = document.createElement('div');
            slide.className = 'movie-slide';
            const card = createMovieCard(filme);
            slide.appendChild(card);
            slider.appendChild(slide);
        });
        console.log(`[INDEX] ${filmes.length} slides adicionados ao HTML do slider.`);

        // Reinicializa o slider com os novos slides
        if (window.moviesSliderInstance) {
             window.moviesSliderInstance.reinitialize(); 
        } else {
            console.warn("[INDEX] Instância do slider não encontrada para reinicializar.");
        }

    } else {
        slider.innerHTML = '<p style="color: white; text-align: center;">Nenhum outro filme disponível no momento.</p>';
        // Limpa os indicadores (se ainda existirem) e desabilita botões se não houver filmes
        if (window.moviesSliderInstance) {
            window.moviesSliderInstance.reinitialize(); // Chama para limpar/desabilitar controles
        }
    }
}

/**
 * Criar card de filme (compatível com backend)
 */
function createMovieCard(filme) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.cursor = 'pointer';
    
    // Usar ID do backend ou fallback para ID local
    const movieId = filme.id;
    card.onclick = () => goToMovie(movieId);
    
    // Imagem do poster
    const img = document.createElement('img');
    img.src = filme.posterUrl || filme.poster || '../images/placeholder.jpg';
    img.alt = filme.titulo || filme.title;
    img.className = 'movie-poster';
    img.onerror = () => {
        img.src = '../images/placeholder.jpg';
    };
    
    // Informações do filme
    const info = document.createElement('div');
    info.className = 'movie-info';
    
    const title = document.createElement('div');
    title.className = 'movie-title';
    title.textContent = filme.titulo || filme.title;
    
    const genre = document.createElement('div');
    genre.className = 'movie-genre';
    genre.textContent = filme.genero || filme.genre;
    
    info.appendChild(title);
    info.appendChild(genre);
    
    card.appendChild(img);
    card.appendChild(info);
    
    return card;
}

/**
 * Mostrar status da conexão com backend
 */
function showBackendStatus(isOnline) {
    // Remover status anterior se existir
    const oldStatus = document.querySelector('.backend-status');
    if (oldStatus) oldStatus.remove();
    
    const status = document.createElement('div');
    status.className = 'backend-status';
    status.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: opacity 0.3s;
    `;
    
    if (isOnline) {
        status.style.background = '#4CAF50';
        status.style.color = 'white';
        status.innerHTML = '🟢 Backend Online';
        
        // Remover após 3 segundos
        setTimeout(() => {
            status.style.opacity = '0';
            setTimeout(() => status.remove(), 300);
        }, 3000);
    } else {
        status.style.background = '#ff9800';
        status.style.color = 'white';
        status.innerHTML = '🟡 Modo Offline (usando dados locais)';
    }
    
    document.body.appendChild(status);
}

/**
 * SLIDERS COM SWIPE PARA MOBILE
 */

// Slider Hero com Swipe
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slider .slide');
        this.dots = document.querySelectorAll('.slider-dots .dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return;
        
        // Event listeners para botões
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Event listeners para dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Event listeners para swipe
        this.addSwipeSupport();
        
        // Auto-play
        this.startAutoPlay();
        
        // Esconder setas em mobile
        this.handleResponsive();
        window.addEventListener('resize', () => this.handleResponsive());
    }
    
    addSwipeSupport() {
        const slider = document.querySelector('.hero-slider');
        
        // Eventos de mouse/touch
        slider.addEventListener('mousedown', this.startDrag.bind(this));
        slider.addEventListener('touchstart', this.startDrag.bind(this));
        
        slider.addEventListener('mousemove', this.drag.bind(this));
        slider.addEventListener('touchmove', this.drag.bind(this));
        
        slider.addEventListener('mouseup', this.endDrag.bind(this));
        slider.addEventListener('touchend', this.endDrag.bind(this));
        slider.addEventListener('mouseleave', this.endDrag.bind(this));
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.currentX = this.startX;
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        const minSwipeDistance = 50; // Distância mínima para considerar swipe
        
        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                this.nextSlide(); // Swipe para esquerda
            } else {
                this.prevSlide(); // Swipe para direita
            }
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        // Atualizar slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Atualizar dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        // Auto-play a cada 5 segundos
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    handleResponsive() {
        const isMobile = window.innerWidth <= 768;
        const sliderControls = document.querySelector('.slider-controls');
        
        if (sliderControls) {
            if (isMobile) {
                sliderControls.style.display = 'none';
            } else {
                sliderControls.style.display = 'flex';
            }
        }
    }
}

// Slider para Filmes em Cartaz com Swipe
class MoviesSlider {
    constructor() {
        this.slider = document.getElementById('moviesSlider');
        this.prevBtn = document.getElementById('prevBtnMovies');
        this.nextBtn = document.getElementById('nextBtnMovies');
        this.indicatorsContainer = document.getElementById('moviesIndicators');
        this.currentPosition = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        
        if (!this.slider) return;
        
        this.currentPosition = 0;
        this.slidesPerView = this.getSlidesPerView();
        
        this.init();
    }
    
    init() {
        this.slides = this.slider.querySelectorAll('.movie-slide');
        this.totalSlides = this.slides.length;
        this.maxPosition = Math.max(0, this.totalSlides - this.slidesPerView);
        
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        this.createIndicators();
        this.addSwipeSupport();
        window.addEventListener('resize', () => this.handleResize());
        this.updateControls();
    }
    
    addSwipeSupport() {
        // Touch events para mobile
        this.slider.addEventListener('touchstart', this.dragStart.bind(this));
        this.slider.addEventListener('touchend', this.dragEnd.bind(this));
        this.slider.addEventListener('touchmove', this.dragging.bind(this));

        // Mouse events para desktop
        this.slider.addEventListener('mousedown', this.dragStart.bind(this));
        this.slider.addEventListener('mouseup', this.dragEnd.bind(this));
        this.slider.addEventListener('mouseleave', this.dragEnd.bind(this));
        this.slider.addEventListener('mousemove', this.dragging.bind(this));
    }
    
    dragStart(event) {
        this.isDragging = true;
        this.startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        this.prevTranslate = this.currentTranslate;
        cancelAnimationFrame(this.animationID);
        this.slider.style.transition = 'none';
        this.slider.style.cursor = 'grabbing';
    }

    dragging(event) {
        if (!this.isDragging) return;

        const currentX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        const diffX = currentX - this.startX;
        this.currentTranslate = this.prevTranslate + diffX;

        this.animationID = requestAnimationFrame(() => {
            this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        });
    }

    dragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.slider.style.transition = 'transform 0.5s ease-in-out';
        this.slider.style.cursor = 'grab';

        const movedBy = this.currentTranslate - this.prevTranslate;
        const slideWidth = this.slides.length > 0 ? this.slides[0].offsetWidth + 20 : 270;
        const threshold = slideWidth / 4;

        if (movedBy < -threshold && this.currentPosition < this.maxPosition) {
            this.currentPosition = Math.min(this.maxPosition, this.currentPosition + this.slidesPerView);
        } else if (movedBy > threshold && this.currentPosition > 0) {
            this.currentPosition = Math.max(0, this.currentPosition - this.slidesPerView);
        }

        this.updateSlider();
    }

    reinitialize() {
        console.log("[Slider] Reinicializando...");
        this.slides = this.slider.querySelectorAll('.movie-slide');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) {
            console.warn("[Slider] Nenhum slide encontrado para inicializar.");
            if (this.indicatorsContainer) this.indicatorsContainer.innerHTML = '';
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
            return;
        }

        console.log(`[Slider] Encontrados ${this.totalSlides} slides.`);
        
        this.slidesPerView = this.getSlidesPerView();
        this.maxPosition = Math.max(0, this.totalSlides - this.slidesPerView);
        
        this.currentPosition = 0;
        this.createIndicators();
        this.updateSlider();
        console.log("[Slider] Reinicialização completa.");
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 2;
        if (width < 1200) return 3;
        return 4;
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        const totalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('span');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToPage(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateSlider() {
        if (!this.slides || this.slides.length === 0) return;

        const slideWidth = this.slides[0].offsetWidth + 20;
        this.currentTranslate = -this.currentPosition * slideWidth;

        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updateIndicators();
        this.updateControls();
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer || !this.slides || this.slides.length === 0) {
            if(this.indicatorsContainer) this.indicatorsContainer.innerHTML = '';
            return;
        }
        
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        if (!indicators || indicators.length === 0) return;

        const totalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        let currentPage = Math.round(this.currentPosition / this.slidesPerView);
        currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
    }
    
    updateControls() {
        if (this.prevBtn) this.prevBtn.disabled = this.currentPosition === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentPosition >= this.maxPosition;
    }
    
    next() {
        if (this.currentPosition < this.maxPosition) {
            this.currentPosition += this.slidesPerView;
            if (this.currentPosition > this.maxPosition) {
                this.currentPosition = this.maxPosition;
            }
            this.updateSlider();
        }
    }
    
    prev() {
        if (this.currentPosition > 0) {
            this.currentPosition -= this.slidesPerView;
            if (this.currentPosition < 0) {
                this.currentPosition = 0;
            }
            this.updateSlider();
        }
    }
    
    goToPage(page) {
        this.currentPosition = page * this.slidesPerView;
        if (this.currentPosition > this.maxPosition) {
            this.currentPosition = this.maxPosition;
        }
        this.updateSlider();
    }
    
    handleResize() {
        const oldSlidesPerView = this.slidesPerView;
        this.slidesPerView = this.getSlidesPerView();
        this.maxPosition = Math.max(0, this.totalSlides - this.slidesPerView);
        
        if (this.currentPosition > this.maxPosition) {
            this.currentPosition = this.maxPosition;
        }
        
        const oldTotalPages = Math.ceil(this.totalSlides / oldSlidesPerView);
        const newTotalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        
        if (oldTotalPages !== newTotalPages) {
            this.createIndicators();
        }
        
        this.updateSlider();
    }
}

/**
 * INICIALIZAÇÃO
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[INDEX] Página carregada, inicializando...');
    
    // Inicializar sliders
    new HeroSlider();
    window.moviesSliderInstance = new MoviesSlider();
    window.moviesSliderInstance.reinitialize();
    
    // Carregar filmes do backend
    await loadMoviesFromBackend();
});

// Controle do menu mobile para index.html
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuToggle && mainMenu && menuOverlay) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mainMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        menuOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainMenu.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Fechar menu ao clicar em um link
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});