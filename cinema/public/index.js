// Função para redirecionar para a página do filme
function goToMovie(movieId) {
    window.location.href = `movie.html?id=${movieId}`;
}

document.querySelectorAll('.movie-card').forEach(card => {
        card.style.cursor = 'pointer';
});

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
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot click events
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
        
        // Auto slide
        this.startAutoSlide();
        
        // Pause auto slide on hover
        const hero = document.querySelector('.hero');
            hero.addEventListener('mouseenter', () => this.stopAutoSlide());
            hero.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
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
        }, 5000); // Muda a cada 5 segundos
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
        this.slides = document.querySelectorAll('.movie-slide');
        this.prevBtn = document.getElementById('prevBtnMovies');
        this.nextBtn = document.getElementById('nextBtnMovies');
        this.indicatorsContainer = document.getElementById('moviesIndicators');
        
        this.currentPosition = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.maxPosition = Math.max(0, this.totalSlides - this.slidesPerView);
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Criar indicadores
        this.createIndicators();
        
        // Atualizar responsividade
        window.addEventListener('resize', () => this.handleResize());
        
        // Atualizar controles
        this.updateControls();
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 2;
        if (width < 1200) return 3;
        return 4;
    }
    
    createIndicators() {
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
        const slideWidth = this.slides[0].offsetWidth + 20; // 20px é o gap
        this.slider.style.transform = `translateX(-${this.currentPosition * slideWidth}px)`;
        this.updateIndicators();
        this.updateControls();
    }
    
    updateIndicators() {
        const currentPage = Math.floor(this.currentPosition / this.slidesPerView);
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
    }
    
    updateControls() {
        this.prevBtn.disabled = this.currentPosition === 0;
        this.nextBtn.disabled = this.currentPosition >= this.maxPosition;
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
        
        // Ajustar posição atual se necessário
        if (this.currentPosition > this.maxPosition) {
            this.currentPosition = this.maxPosition;
        }
        
        // Recriar indicadores se o número de páginas mudou
        const oldTotalPages = Math.ceil(this.totalSlides / oldSlidesPerView);
        const newTotalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        
        if (oldTotalPages !== newTotalPages) {
            this.createIndicators();
        }
        
        this.updateSlider();
    }
}

// Inicializar o slider quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new MoviesSlider();
    new HeroSlider();
});

