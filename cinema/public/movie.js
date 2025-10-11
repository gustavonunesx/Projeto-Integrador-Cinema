// movie.js
function loadMovieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const movie = moviesDatabase[movieId];
    
    if (movie) {
        // Preenche dados básicos
        document.title = `${movie.title} - BEST MOVIES`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-duration').textContent = movie.duration;
        document.getElementById('movie-genre').textContent = movie.genre;
        document.getElementById('movie-rating').textContent = movie.rating;
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-poster-img').src = movie.poster;
        document.getElementById('movie-poster-img').alt = movie.title;
        
        // Trailer
        document.getElementById('trailer-placeholder').innerHTML = `
            <div class="play-button">▶</div>
            <p>Trailer de ${movie.title}</p>
        `;
        
    } else {
        document.getElementById('movie-title').textContent = 'Filme não encontrado';
    }
}

function selectSession() {
    alert('Redirecionando para seleção de assentos...');
    // Em sistema real: window.location.href = `booking.html?movie=${movieId}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadMovieData);

// Navegação entre datas
document.querySelectorAll('.date-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// Botões de ação
document.getElementById('btn-remember')?.addEventListener('click', function() {
    alert('Filme adicionado aos favoritos!');
});

document.getElementById('btn-share')?.addEventListener('click', function() {
    alert('Compartilhar filme - Em desenvolvimento');
});