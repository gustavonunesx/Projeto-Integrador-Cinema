// Função para redirecionar para a página do filme
function redirectToMovie(movieId) {
    // Simulação de redirecionamento - em um sistema real, isso seria um link para outra página
    window.location.href = `movie.html?id=${movieId}`;
}

// Simulação de dados dos filmes
const movies = {
    'duna-2': {
        title: 'Duna: Parte Dois',
        genre: 'Ficção Científica, Aventura',
        duration: '2h 46min',
        rating: '14 anos',
        description: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.',
        price: 'R$ 32,00',
        poster: 'https://via.placeholder.com/400x600/333/fff?text=Duna+2',
        trailer: 'https://www.youtube.com/embed/U2Qp5pL3ovA'
    },
    'deadpool-3': {
        title: 'Deadpool & Wolverine',
        genre: 'Ação, Comédia',
        duration: '2h 07min',
        rating: '16 anos',
        description: 'Wolverine está se recuperando quando cruza com o irreverente Deadpool. Juntos, eles formam uma equipe para enfrentar um inimigo comum.',
        price: 'R$ 30,00',
        poster: 'https://via.placeholder.com/400x600/333/fff?text=Deadpool+3',
        trailer: 'https://www.youtube.com/embed/7M4axk49eC0'
    }
    // Outros filmes seriam adicionados aqui
};

// Simulação de dados de sessões
const sessions = [
    { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
    { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
    { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
    { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
    { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
];

// Simulação de assentos
const seats = [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'available' },
    { id: 'A3', status: 'occupied' },
    { id: 'A4', status: 'available' },
    { id: 'A5', status: 'available' },
    { id: 'A6', status: 'occupied' },
    { id: 'A7', status: 'available' },
    { id: 'A8', status: 'available' },
    { id: 'A9', status: 'available' },
    { id: 'A10', status: 'occupied' },
    { id: 'B1', status: 'available' },
    { id: 'B2', status: 'available' },
    { id: 'B3', status: 'available' },
    { id: 'B4', status: 'occupied' },
    { id: 'B5', status: 'available' },
    { id: 'B6', status: 'available' },
    { id: 'B7', status: 'occupied' },
    { id: 'B8', status: 'available' },
    { id: 'B9', status: 'available' },
    { id: 'B10', status: 'available' }
];

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

// Inicializar o slider quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});