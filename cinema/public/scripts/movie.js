// movie.js
function loadMovieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const movie = moviesDatabase[movieId];
    
    if (movie) {
        document.title = `${movie.title} - BEST MOVIES`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-duration').textContent = movie.duration;
        document.getElementById('movie-genre').textContent = movie.genre;
        
        // ⭐ MUDANÇA AQUI - Agora usa ícone em vez de texto
        document.getElementById('movie-rating').innerHTML = getRatingIcon(movie.rating);
        
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-poster-img').src = movie.poster;
        
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

function getRatingIcon(rating) {
    const ratings = {
        'Livre': '<span class="rating-brazil rating-l" title="Classificação Livre">L</span>',
        '10 anos': '<span class="rating-brazil rating-10" title="Não recomendado para menores de 10 anos">10</span>',
        '12 anos': '<span class="rating-brazil rating-12" title="Não recomendado para menores de 12 anos">12</span>',
        '14 anos': '<span class="rating-brazil rating-14" title="Não recomendado para menores de 14 anos">14</span>',
        '16 anos': '<span class="rating-brazil rating-16" title="Não recomendado para menores de 16 anos">16</span>',
        '18 anos': '<span class="rating-brazil rating-18" title="Não recomendado para menores de 18 anos">18</span>'
    };
    
    return ratings[rating] || `<span class="rating-brazil">${rating}</span>`;
}

// Função para carregar trailer
function loadTrailer(trailerUrl) {
    const placeholder = document.getElementById('trailer-placeholder');
    const iframe = document.getElementById('trailer-iframe');
    
    if (trailerUrl) {
        // Configura o evento de clique no placeholder
        placeholder.addEventListener('click', function() {
            // Converte URL do YouTube para embed
            const embedUrl = convertToEmbedUrl(trailerUrl);
            iframe.src = embedUrl + '?autoplay=1';
            iframe.style.display = 'block';
            placeholder.classList.add('hidden');
        });
        
        // Mensagem personalizada
        placeholder.querySelector('p').textContent = 'Clique para assistir ao trailer';
    } else {
        placeholder.querySelector('p').textContent = 'Trailer não disponível';
        placeholder.style.cursor = 'default';
    }
}

// Função para converter URL do YouTube para embed
function convertToEmbedUrl(url) {
    // Se já for uma URL de embed, retorna como está
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    // Converte URL normal do YouTube para embed
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Se for apenas o ID do vídeo
    if (url.includes('youtube.com/embed-')) {
        const videoId = url.split('embed-')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url; // Retorna original se não reconhecer
}

// Modifique a função loadMovieData para incluir o trailer
function loadMovieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const movie = moviesDatabase[movieId];
    
    if (movie) {
        document.title = `${movie.title} - BEST MOVIES`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-duration').textContent = movie.duration;
        document.getElementById('movie-genre').textContent = movie.genre;
        document.getElementById('movie-rating').innerHTML = getRatingIcon(movie.rating);
        document.getElementById('movie-description').textContent = movie.description;
        document.getElementById('movie-poster-img').src = movie.poster;
        
        // ⭐ CARREGA O TRAILER
        loadTrailer(movie.trailer);
        
    } else {
        document.getElementById('movie-title').textContent = 'Filme não encontrado';
    }
}