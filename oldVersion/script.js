// JavaScript para o sistema de Cinema de Bairro
console.log("Cinema de Bairro - JS Carregado");

// --- GERENCIADOR DE DADOS com localStorage ---
const dataManager = {
    getMovies: function() {
        return JSON.parse(localStorage.getItem('cinema_movies'));
    },
    getRooms: function() {
        return JSON.parse(localStorage.getItem('cinema_rooms'));
    },
    getSessions: function() {
        return JSON.parse(localStorage.getItem('cinema_sessions'));
    },
    saveMovies: function(movies) {
        localStorage.setItem('cinema_movies', JSON.stringify(movies));
    },
    saveSessions: function(sessions) {
        localStorage.setItem('cinema_sessions', JSON.stringify(sessions));
    },
    generateSeats: function(rows, cols) {
        const seats = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                seats.push({ id: `${String.fromCharCode(65 + i)}${j + 1}`, isOccupied: false });
            }
        }
        return seats;
    },
    init: function() {
        if (!this.getMovies()) {
            console.log("Inicializando dados de filmes no localStorage...");
            const initialMovies = [
                { id: 1, title: "A Origem", director: "Christopher Nolan", genre: "Ficção Científica", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7LjIJ5gwqT1jDZjp60mJmBc27KFhNeW3BI_LSSwJRGrtTO1ld2UNDXFD9ZGBziYeP9QI&usqp=CAU" },
                { id: 2, title: "O Poderoso Chefão", director: "Francis Ford Coppola", genre: "Drama", poster: "https://m.media-amazon.com/images/I/71nJYTNc-sL._UF1000,1000_QL80_.jpg" },
                { id: 3, title: "Interestelar", director: "Christopher Nolan", genre: "Ficção Científica", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0WX5DKMxRvBbVtopzQVpmpUpaOKwd-VcSQ&s" }
            ];
            this.saveMovies(initialMovies);
        }
        if (!this.getRooms()) {
             console.log("Inicializando dados de salas no localStorage...");
             const initialRooms = [ { id: 1, name: "Sala 1", rows: 5, cols: 8 } ];
             localStorage.setItem('cinema_rooms', JSON.stringify(initialRooms));
        }
        if (!this.getSessions()) {
            console.log("Inicializando dados de sessões no localStorage...");
             const initialSessions = [
                { id: 1, movieId: 1, roomId: 1, time: "18:00", seats: this.generateSeats(5, 8) },
                { id: 2, movieId: 1, roomId: 1, time: "21:00", seats: this.generateSeats(5, 8) },
                { id: 3, movieId: 2, roomId: 1, time: "20:00", seats: this.generateSeats(5, 8) },
                { id: 4, movieId: 3, roomId: 1, time: "19:30", seats: this.generateSeats(5, 8) }
             ];
             this.saveSessions(initialSessions);
        }
    }
};

// Inicializa e carrega os dados
dataManager.init();
let movies = dataManager.getMovies();
let rooms = dataManager.getRooms();
let sessions = dataManager.getSessions();

// --- LÓGICA PRINCIPAL DA APLICAÇÃO ---

const app = document.getElementById('app');
let selectedSeats = [];

// Função para renderizar a tela de seleção de assentos
function renderSeats(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    const movie = movies.find(m => m.id === session.movieId);
    const room = rooms.find(r => r.id === session.roomId);
    selectedSeats = []; // Limpa os assentos selecionados ao renderizar

    app.innerHTML = `
        <div class="seat-selection">
            <h2>${movie.title}</h2>
            <p>Sessão: ${session.time} - ${room.name}</p>
            <div class="screen">TELA</div>
            <div class="seat-grid" style="grid-template-columns: repeat(${room.cols}, 1fr);">
                <!-- Assentos serão gerados aqui -->
            </div>
            <div class="legend">
                <div><div class="seat"></div> Disponível</div>
                <div><div class="seat selected"></div> Selecionado</div>
                <div><div class="seat occupied"></div> Ocupado</div>
            </div>
            <button id="buy-button" disabled>Comprar Ingressos</button>
            <button id="back-to-movies">Voltar aos Filmes</button>
        </div>
    `;

    const seatGrid = app.querySelector('.seat-grid');
    session.seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.dataset.seatId = seat.id;
        if (seat.isOccupied) {
            seatElement.classList.add('occupied');
        } else {
            seatElement.addEventListener('click', () => {
                // Lógica de seleção de assento
                if (!seatElement.classList.contains('selected')) {
                    seatElement.classList.add('selected');
                    selectedSeats.push(seat.id);
                } else {
                    seatElement.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s !== seat.id);
                }
                // Habilita/desabilita o botão de compra
                document.getElementById('buy-button').disabled = selectedSeats.length === 0;
            });
        }
        seatGrid.appendChild(seatElement);
    });

    // Event listener para o botão de compra
    document.getElementById('buy-button').addEventListener('click', () => {
        // Encontra a sessão atual
        const session = sessions.find(s => s.id === sessionId);
        // Atualiza o status dos assentos selecionados para ocupado
        selectedSeats.forEach(seatId => {
            const seat = session.seats.find(s => s.id === seatId);
            if (seat) {
                seat.isOccupied = true;
            }
        });

        // Salva o novo estado das sessões no localStorage
        dataManager.saveSessions(sessions);

        // Exibe uma mensagem de confirmação
        alert(`Compra realizada com sucesso!\nIngressos para: ${selectedSeats.join(', ')}`);

        // Re-renderiza a tela de assentos para mostrar o novo estado
        renderSeats(sessionId);
    });

    // Event listener para o botão de voltar
    document.getElementById('back-to-movies').addEventListener('click', renderMovies);
}

// Função para renderizar as sessões de um filme
function renderSessions(movieId) {
    const movie = movies.find(m => m.id === movieId);
    const movieSessions = sessions.filter(s => s.movieId === movieId);

    app.innerHTML = `
        <div class="session-selection">
            <h2>Sessões para ${movie.title}</h2>
            <div class="session-list">
                ${movieSessions.map(session => `
                    <button class="session-time" data-session-id="${session.id}">${session.time}</button>
                `).join('')}
            </div>
            <button id="back-to-movies">Voltar aos Filmes</button>
        </div>
    `;

    document.querySelectorAll('.session-time').forEach(button => {
        button.addEventListener('click', (e) => {
            const sessionId = parseInt(e.target.dataset.sessionId);
            renderSeats(sessionId);
        });
    });
    
    document.getElementById('back-to-movies').addEventListener('click', renderMovies);
}

// Função para renderizar a lista de filmes, agrupados por gênero
function renderMovies() {
    app.innerHTML = '<h2>Filmes em Cartaz</h2>';

    // Agrupa os filmes por gênero
    const moviesByGenre = movies.reduce((acc, movie) => {
        const genre = movie.genre || 'Sem Gênero';
        if (!acc[genre]) {
            acc[genre] = [];
        }
        acc[genre].push(movie);
        return acc;
    }, {});

    // Renderiza uma seção para cada gênero
    for (const genre in moviesByGenre) {
        const genreSection = document.createElement('div');
        genreSection.className = 'genre-section';

        const title = document.createElement('h3');
        title.className = 'genre-title';
        title.textContent = genre;
        genreSection.appendChild(title);

        const movieList = document.createElement('div');
        movieList.className = 'horizontal-movie-list';

        moviesByGenre[genre].forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="Pôster de ${movie.title}">
                <div class="movie-card-info">
                    <h4>${movie.title}</h4>
                    <p>${movie.director}</p>
                </div>
            `;
            movieCard.addEventListener('click', () => {
                renderSessions(movie.id);
            });
            movieList.appendChild(movieCard);
        });
        
        genreSection.appendChild(movieList);
        app.appendChild(genreSection);
    }
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
});
