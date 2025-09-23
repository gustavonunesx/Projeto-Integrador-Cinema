// JavaScript para o sistema de Cinema de Bairro
console.log("Cinema de Bairro - JS Carregado");

// --- GERENCIADOR DE DADOS com localStorage ---
// Garante que os dados do admin.js sejam usados aqui.
const dataManager = {
    getMovies: function() {
        // Se não houver dados, retorna um array vazio para não quebrar a aplicação
        return JSON.parse(localStorage.getItem('cinema_movies')) || [];
    },
    getRooms: function() {
        return JSON.parse(localStorage.getItem('cinema_rooms')) || [];
    },
    getSessions: function() {
        return JSON.parse(localStorage.getItem('cinema_sessions')) || [];
    },
    saveSessions: function(sessions) {
        localStorage.setItem('cinema_sessions', JSON.stringify(sessions));
    }
};

// Carrega os dados na inicialização
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

// Função para renderizar a lista de filmes
function renderMovies() {
    app.innerHTML = '<h2>Filmes em Cartaz</h2>';
    const movieList = document.createElement('div');
    movieList.className = 'movie-list';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="Pôster de ${movie.title}">
            <h3>${movie.title}</h3>
            <p><strong>Gênero:</strong> ${movie.genre}</p>
            <p><strong>Diretor:</strong> ${movie.director}</p>
        `;
        movieCard.addEventListener('click', () => {
            renderSessions(movie.id);
        });
        movieList.appendChild(movieCard);
    });

    app.appendChild(movieList);
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
});
