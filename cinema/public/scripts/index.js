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
        this.currentPosition = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0; // Para otimização do 'touchmove'
        
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
    dragStart(event) {
        this.isDragging = true;
        // Pega a posição inicial X (se for toque, pega o primeiro dedo)
        this.startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        // Guarda a posição atual do slider antes de começar a arrastar
        this.prevTranslate = this.currentTranslate; 
        // Cancela animações pendentes
        cancelAnimationFrame(this.animationID);
        // Remove a transição suave DURANTE o arraste
        this.slider.style.transition = 'none'; 
        // Muda o cursor (desktop)
        this.slider.style.cursor = 'grabbing'; 
        console.log(`[Slider] Drag Start at ${this.startX}`);
    }

    dragging(event) {
        if (!this.isDragging) return;

        // Pega a posição X atual
        const currentX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        // Calcula o quanto o dedo/mouse moveu desde o início
        const diffX = currentX - this.startX;
        // Calcula a nova posição do slider
        this.currentTranslate = this.prevTranslate + diffX;

        // Otimização: Usa requestAnimationFrame para atualizar a posição
        // Isso evita sobrecarregar o navegador durante o 'touchmove'/'mousemove'
        this.animationID = requestAnimationFrame(() => {
            this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        });
        console.log(`[Slider] Dragging, diff: ${diffX}, newTranslate: ${this.currentTranslate}`);
    }

    dragEnd() {
        if (!this.isDragging) return; // Evita execuções múltiplas (ex: mouseup + mouseleave)

        this.isDragging = false;
        cancelAnimationFrame(this.animationID); // Cancela a última animação pendente

        // Adiciona a transição suave de volta para o 'snap'
        this.slider.style.transition = 'transform 0.5s ease-in-out'; 
        this.slider.style.cursor = 'grab'; // Volta o cursor (desktop)

        const movedBy = this.currentTranslate - this.prevTranslate;
        const slideWidth = this.slides.length > 0 ? this.slides[0].offsetWidth + 20 : 270; // Largura + gap
        const threshold = slideWidth / 4; // Quanto precisa arrastar para mudar de slide (ex: 1/4 da largura)

        console.log(`[Slider] Drag End. Moved by: ${movedBy}, Threshold: ${threshold}`);

        // Decide se deve ir para o próximo, anterior ou voltar
        if (movedBy < -threshold && this.currentPosition < this.maxPosition) {
            // Arrastou para a esquerda o suficiente -> vai para o próximo grupo
            console.log("[Slider] Snap Next");
            this.currentPosition = Math.min(this.maxPosition, this.currentPosition + this.slidesPerView);
        } else if (movedBy > threshold && this.currentPosition > 0) {
            // Arrastou para a direita o suficiente -> vai para o grupo anterior
            console.log("[Slider] Snap Previous");
            this.currentPosition = Math.max(0, this.currentPosition - this.slidesPerView);
        } else {
             console.log("[Slider] Snap Back");
             // Não arrastou o suficiente, volta para a posição original do grupo atual
        }

        // Atualiza a posição final e controles/indicadores
        this.updateSlider(); 
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
        this.slider.addEventListener('touchstart', this.dragStart.bind(this));
        this.slider.addEventListener('touchend', this.dragEnd.bind(this));
        this.slider.addEventListener('touchmove', this.dragging.bind(this));

        // Listeners para Mouse (Desktop) - Boa UX
        this.slider.addEventListener('mousedown', this.dragStart.bind(this));
        this.slider.addEventListener('mouseup', this.dragEnd.bind(this));
        this.slider.addEventListener('mouseleave', this.dragEnd.bind(this)); // Cancela se o mouse sair
        this.slider.addEventListener('mousemove', this.dragging.bind(this));
        
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
        if (!this.slides || this.slides.length === 0) return;

        const slideWidth = this.slides[0].offsetWidth + 20; // Largura + gap
        // Calcula a posição final baseada no currentPosition (índice do slide inicial do grupo)
        this.currentTranslate = -this.currentPosition * slideWidth; 

        // Aplica a transformação FINAL (com transição)
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;

        console.log(`[Slider] Updating visual to position index ${this.currentPosition}, translate ${this.currentTranslate}px`);
        this.updateIndicators();
     
        this.updateControls(); 
    }
    
    updateIndicators() {
        // Sai se o container de indicadores não existir ou se não houver slides
        if (!this.indicatorsContainer || !this.slides || this.slides.length === 0) {
            console.log("[Slider Indicators] Abortando: Container ou slides não encontrados.");
            if(this.indicatorsContainer) this.indicatorsContainer.innerHTML = ''; 
            return;
        } 
        
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        if (!indicators || indicators.length === 0) {
            console.log("[Slider Indicators] Abortando: Indicadores não encontrados no container.");
            return;
        }

        // --- Cálculo da Página Atual ---
        const totalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        let currentPage = Math.round(this.currentPosition / this.slidesPerView);
        currentPage = Math.max(0, Math.min(currentPage, totalPages - 1)); 

        console.log(`[Slider Indicators] Update Start. CurrentPos: ${this.currentPosition}, SlidesPerView: ${this.slidesPerView}, TotalPages: ${totalPages}, CalculatedPage: ${currentPage}`);

        let foundActive = false;
        // --- Lógica Explícita de Remoção/Adição ---
        indicators.forEach((indicator, index) => {
            // Remove 'active' de todos, exceto o que deveria estar ativo
            if (indicator.classList.contains('active') && index !== currentPage) {
                indicator.classList.remove('active');
                // console.log(`[Slider Indicators] Removed active from indicator ${index}`); // Log Opcional
            }
            // Adiciona 'active' ao correto, se ele já não tiver
            if (index === currentPage && !indicator.classList.contains('active')) {
                indicator.classList.add('active');
                foundActive = true;
                // console.log(`[Slider Indicators] Added active to indicator ${index}`); // Log Opcional
            } else if (index === currentPage) {
                foundActive = true;
            }
        });

        // Fallback: Se, após o loop, o indicador correto não foi ativado, força a ativação
        if (!foundActive && indicators[currentPage]) {
             console.warn(`[Slider Indicators] Fallback: Forcing activation for indicator ${currentPage}`);
             indicators.forEach(ind => ind.classList.remove('active'));
             indicators[currentPage].classList.add('active');
        } else if (!indicators[currentPage]){
             console.error(`[Slider Indicators] Error: Calculated page ${currentPage} is out of bounds (0-${indicators.length - 1})`);
        }
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
        this.createIndicators(); 
        
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