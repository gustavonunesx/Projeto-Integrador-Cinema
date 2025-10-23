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
    
    // Verificar se backend está disponível
    backendAvailable = await ApiService.isBackendAvailable();
    
    if (!backendAvailable) {
        console.warn('[INDEX] Backend não disponível, usando dados locais');
        showBackendStatus(false);
        return;
    }
    
    console.log('[INDEX] Backend disponível! Carregando filmes...');
    showBackendStatus(true);
    
    // Carregar filmes em cartaz
    await loadFilmesEmCartaz();
    
    // Carregar filmes em alta (todos os filmes)
    await loadFilmesEmAlta();
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
function updateFilmesEmAltaSection(filmes) {
    const moviesGrid = document.querySelector('#movies .movies-grid');
    
    if (!moviesGrid) return;
    
    // Limpar grid atual
    moviesGrid.innerHTML = '';
    
    // Adicionar filmes do backend
    filmes.forEach(filme => {
        const card = createMovieCard(filme);
        moviesGrid.appendChild(card);
    });
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
function updateFilmesEmCartazSlider(filmes) {
    const slider = document.getElementById('moviesSlider');
    
    if (!slider) {
        console.error("[INDEX] Elemento do slider 'moviesSlider' não encontrado.");
        return;
    }
    
    // Limpar slider (removendo o <p>Carregando...</p>)
    slider.innerHTML = '';
    
    // Adicionar filmes do backend
    if (filmes && filmes.length > 0) {
        filmes.forEach(filme => {
            const slide = document.createElement('div');
            slide.className = 'movie-slide';
            
            const card = createMovieCard(filme); // Reutiliza a função que cria o card
            slide.appendChild(card);
            
            slider.appendChild(slide);
        });
    } else {
        // Caso a API retorne uma lista vazia
        slider.innerHTML = '<p style="color: white; text-align: center;">Nenhum filme encontrado.</p>';
        // Limpa os indicadores se não houver filmes
        const indicatorsContainer = document.getElementById('moviesIndicators');
        if (indicatorsContainer) indicatorsContainer.innerHTML = '';
        return; // Não precisa inicializar o slider se não houver filmes
    }
    
    // --- INÍCIO DA CORREÇÃO IMPORTANTE ---
    // Reinicializar e Atualizar o slider
    if (window.moviesSliderInstance) {
        const sliderInstance = window.moviesSliderInstance;
        
        if(!slider){
            console.log(`[INDEX] Atualizando slider com ${filmes.length} filmes.`);
            return;
        }

        slider.innerHTML = '';

        if (filmes && filmes.length > 0) {
            filmes.forEach(filme => {
                const slide = document.createElement('div');
                slide.className = 'movie-slide';
                const card = createMovieCard(filme);
                slide.appendChild(card);
                slider.appendChild(slide);
            });
        console.log(`[INDEX] ${filmes.length} slides adicionados ao HTML do slider.`);

        // --- CORREÇÃO AQUI ---
        // Chama o método reinitialize DEPOIS que os slides estão no HTML
        if (window.moviesSliderInstance) {
             window.moviesSliderInstance.reinitialize(); 
        } else {
            console.warn("[INDEX] Instância do slider não encontrada para reinicializar.");
        }
        // --- FIM DA CORREÇÃO ---

    } else {
        // Caso a API retorne uma lista vazia
        slider.innerHTML = '<p style="color: white; text-align: center;">Nenhum filme encontrado.</p>';
        // Limpa os indicadores se não houver filmes
        if (window.moviesSliderInstance && window.moviesSliderInstance.indicatorsContainer) {
            window.moviesSliderInstance.indicatorsContainer.innerHTML = '';
        }
    }

        

        // 1. Atualiza a lista interna de slides DENTRO do objeto sliderInstance
        sliderInstance.slides = slider.querySelectorAll('.movie-slide'); 
        sliderInstance.totalSlides = sliderInstance.slides.length;
        
        // 2. Recalcula quantas páginas/posições existem
        // É importante recalcular slidesPerView caso a janela tenha mudado de tamanho
        sliderInstance.slidesPerView = sliderInstance.getSlidesPerView(); 
        sliderInstance.maxPosition = Math.max(0, sliderInstance.totalSlides - sliderInstance.slidesPerView);
        
        // 3. Garante que a posição atual não seja inválida (ex: estava na pág 3 e agora só tem 2)
        // Reinicia na primeira página para simplificar
        sliderInstance.currentPosition = 0; 

        // 4. Recria os indicadores (bolinhas) com base no novo número de slides e páginas
        sliderInstance.createIndicators(); 
        
        // 5. Atualiza a posição visual do slider (translateX) e habilita/desabilita os botões
        sliderInstance.updateSlider(); 
        
        console.log("[INDEX] Slider de 'Em Cartaz' atualizado.");
    } else {
        console.warn("[INDEX] Instância do slider (window.moviesSliderInstance) não encontrada para atualização.");
    }
    // --- FIM DA CORREÇÃO IMPORTANTE ---
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
 * SLIDERS (mantém funcionalidade original)
 */

// Slider Hero
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.slides.length) return;
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
        
        this.startAutoSlide();
        
        const hero = document.querySelector('.hero');
        hero.addEventListener('mouseenter', () => this.stopAutoSlide());
        hero.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Slider para Filmes em Cartaz
class MoviesSlider {
    constructor() {
        this.slider = document.getElementById('moviesSlider');
        this.prevBtn = document.getElementById('prevBtnMovies');
        this.nextBtn = document.getElementById('nextBtnMovies');
        this.indicatorsContainer = document.getElementById('moviesIndicators');
        
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
        window.addEventListener('resize', () => this.handleResize());
        this.updateControls();
    }

    reinitialize() {
        console.log("[Slider] Reinicializando...");
        this.slides = this.slider.querySelectorAll('.movie-slide');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) {
            console.warn("[Slider] Nenhum slide encontrado para inicializar.");
             // Limpa indicadores se não houver slides
            if (this.indicatorsContainer) this.indicatorsContainer.innerHTML = '';
             // Desabilita botões
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
            return; 
        }

        console.log(`[Slider] Encontrados ${this.totalSlides} slides.`);
        
        this.slidesPerView = this.getSlidesPerView();
        this.maxPosition = Math.max(0, this.totalSlides - this.slidesPerView);
        
        // Sempre volta para o início ao recarregar
        this.currentPosition = 0; 

        this.createIndicators(); // Recria as bolinhas
        this.updateSlider();     // Atualiza a posição visual e os botões
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
        if (!this.slides.length) return;
        
        const slideWidth = this.slides[0].offsetWidth + 20;
        this.slider.style.transform = `translateX(-${this.currentPosition * slideWidth}px)`;
        this.updateIndicators();
        this.updateControls();
        console.log(`[Slider] Atualizando para posição ${this.currentPosition}, max ${this.maxPosition}`);
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const currentPage = Math.floor(this.currentPosition / this.slidesPerView);
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        
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
  
    window.moviesSliderInstance.reinitialize(); // Faz a inicialização completa
    
    // Carregar filmes do backend
    await loadMoviesFromBackend();
});