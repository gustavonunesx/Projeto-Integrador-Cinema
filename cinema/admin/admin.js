// JavaScript para a página de Administração

document.addEventListener('DOMContentLoaded', () => {
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
        init: function() {
            if (!this.getMovies()) {
                console.log("Inicializando dados de filmes no localStorage...");
                const initialMovies = [
                    { id: 1, title: "A Origem", director: "Christopher Nolan", genre: "Ficção Científica", poster: "images/a-origem.jpg" },
                    { id: 2, title: "O Poderoso Chefão", director: "Francis Ford Coppola", genre: "Drama", poster: "images/poderoso-chefao.jpg" },
                    { id: 3, title: "Interestelar", director: "Christopher Nolan", genre: "Ficção Científica", poster: "images/interestelar.jpg" }
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
        },
        generateSeats: function(rows, cols) {
            const seats = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    seats.push({ id: `${String.fromCharCode(65 + i)}${j + 1}`, isOccupied: false });
                }
            }
            return seats;
        }
    };

    dataManager.init();

    // --- LÓGICA DOS FORMULÁRIOS ---

    const movieForm = document.getElementById('add-movie-form');
    const sessionForm = document.getElementById('add-session-form');
    const movieSelect = document.getElementById('session-movie-id');
    const roomSelect = document.getElementById('session-room-id');

    // Popula os selects
    function populateSelects() {
        const movies = dataManager.getMovies();
        const rooms = dataManager.getRooms();
        
        movieSelect.innerHTML = '<option value="">Selecione um Filme</option>';
        movies.forEach(movie => {
            movieSelect.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;
        });

        roomSelect.innerHTML = '<option value="">Selecione uma Sala</option>';
        rooms.forEach(room => {
            roomSelect.innerHTML += `<option value="${room.id}">${room.name}</option>`;
        });
    }

    populateSelects();

    // Adicionar filme
    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const movies = dataManager.getMovies();
        const newMovie = {
            id: movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1,
            title: document.getElementById('movie-title').value,
            director: document.getElementById('movie-director').value,
            genre: document.getElementById('movie-genre').value,
            poster: document.getElementById('movie-poster').value
        };
        movies.push(newMovie);
        dataManager.saveMovies(movies);
        alert('Filme adicionado com sucesso!');
        movieForm.reset();
        populateSelects(); // Atualiza o select de filmes
    });

    // Agendar sessão
    sessionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sessions = dataManager.getSessions();
        const rooms = dataManager.getRooms();
        const roomId = parseInt(document.getElementById('session-room-id').value);
        const room = rooms.find(r => r.id === roomId);

        const newSession = {
            id: sessions.length ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
            movieId: parseInt(document.getElementById('session-movie-id').value),
            roomId: roomId,
            time: document.getElementById('session-time').value,
            seats: dataManager.generateSeats(room.rows, room.cols)
        };
        sessions.push(newSession);
        dataManager.saveSessions(sessions);
        alert('Sessão agendada com sucesso!');
        sessionForm.reset();
    });
});
