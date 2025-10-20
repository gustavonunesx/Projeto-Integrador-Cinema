// movie.js - Versão com Backend Integration
const API_BASE_URL = 'http://localhost:8080/api';

// Função principal para carregar dados do filme
async function loadMovieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    try {
        // Tenta carregar do backend primeiro
        const response = await fetch(`${API_BASE_URL}/filmes/${movieId}`);
        
        if (response.ok) {
            const movie = await response.json();
            displayMovieData(movie);
            loadSessoes(movieId);
        } else {
            // Fallback para dados locais se backend não responder
            console.log('Backend não disponível, usando dados locais');
            const movie = moviesDatabase[movieId];
            if (movie) {
                displayMovieData(movie);
            } else {
                document.getElementById('movie-title').textContent = 'Filme não encontrado';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar filme:', error);
        // Fallback para dados locais em caso de erro
        const movie = moviesDatabase[movieId];
        if (movie) {
            displayMovieData(movie);
        } else {
            document.getElementById('movie-title').textContent = 'Filme não encontrado';
        }
    }
}

// Função para exibir dados do filme
function displayMovieData(movie) {
    document.title = `${movie.titulo} - BEST MOVIES`;
    document.getElementById('movie-title').textContent = movie.titulo;
    document.getElementById('movie-duration').textContent = movie.duracao;
    document.getElementById('movie-genre').textContent = movie.genero;
    document.getElementById('movie-rating').innerHTML = getRatingIcon(movie.classificacao);
    document.getElementById('movie-description').textContent = movie.descricao;
    document.getElementById('movie-poster-img').src = movie.posterUrl;
    
    // Carrega o trailer se disponível
    if (movie.trailerUrl) {
        loadTrailer(movie.trailerUrl);
    }
}

// Função para carregar sessões do backend
async function loadSessoes(movieId) {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_BASE_URL}/sessoes/filme/${movieId}?data=${hoje}`);
        
        if (response.ok) {
            const sessoes = await response.json();
            displaySessoes(sessoes);
        } else {
            // Fallback para sessões locais
            const movie = moviesDatabase[movieId];
            if (movie && movie.sessions) {
                displaySessoesLocais(movie.sessions);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar sessões:', error);
        // Fallback para sessões locais
        const movie = moviesDatabase[movieId];
        if (movie && movie.sessions) {
            displaySessoesLocais(movie.sessions);
        }
    }
}

// Função para exibir sessões do backend
function displaySessoes(sessoes) {
    const cinemasContainer = document.querySelector('.cinemas-container');
    
    if (!sessoes || sessoes.length === 0) {
        cinemasContainer.innerHTML = '<p class="no-sessions">Nenhuma sessão disponível para hoje.</p>';
        return;
    }
    
    // Agrupa sessões por cinema
    const sessoesPorCinema = agruparSessoesPorCinema(sessoes);
    
    let html = '';
    
    Object.keys(sessoesPorCinema).forEach(cinemaNome => {
        const sessoesCinema = sessoesPorCinema[cinemaNome];
        
        html += `
            <div class="cinema-card">
                <h3 class="cinema-name">${cinemaNome}</h3>
                <p class="cinema-address">${sessoesCinema[0].sala.nome} | Capacidade: ${sessoesCinema[0].sala.capacidade} assentos</p>
                
                <div class="session-types">
                    ${gerarTiposSessao(sessoesCinema)}
                </div>
                
                <button class="btn-book" onclick="selectSession()">Escolher Assentos</button>
            </div>
        `;
    });
    
    cinemasContainer.innerHTML = html;
}

// Função para agrupar sessões por cinema
function agruparSessoesPorCinema(sessoes) {
    const agrupadas = {};
    
    sessoes.forEach(sessao => {
        const cinemaKey = `Cine ${sessao.sala.nome}`;
        
        if (!agrupadas[cinemaKey]) {
            agrupadas[cinemaKey] = [];
        }
        
        agrupadas[cinemaKey].push(sessao);
    });
    
    return agrupadas;
}

// Função para gerar HTML dos tipos de sessão
function gerarTiposSessao(sessoes) {
    const sessoesPorTipo = {};
    
    // Agrupa por tipo de exibição
    sessoes.forEach(sessao => {
        const tipo = sessao.tipoExibicao || '2D DUBLADO';
        
        if (!sessoesPorTipo[tipo]) {
            sessoesPorTipo[tipo] = [];
        }
        
        sessoesPorTipo[tipo].push(sessao);
    });
    
    let html = '';
    
    Object.keys(sessoesPorTipo).forEach(tipo => {
        const sessoesTipo = sessoesPorTipo[tipo];
        const [tipoExibicao, audio] = tipo.split(' ');
        
        html += `
            <div class="session-type">
                <div class="type-header">
                    <span class="type-name">${tipoExibicao}</span>
                    <span class="type-audio">${audio}</span>
                </div>
                <div class="session-times">
                    ${sessoesTipo.map(sessao => `
                        <span class="time-option" onclick="selectTime(${sessao.id}, '${sessao.horario}')">
                            ${formatarHorario(sessao.horario)}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    return html;
}

// Função para exibir sessões locais (fallback)
function displaySessoesLocais(sessions) {
    const cinemasContainer = document.querySelector('.cinemas-container');
    
    // Usa o HTML estático que já existe na página como fallback
    console.log('Usando sessões locais como fallback');
}

// Função para formatar horário
function formatarHorario(horario) {
    if (typeof horario === 'string') {
        return horario.substring(0, 5); // Formata "HH:MM"
    }
    return horario;
}

// Função para selecionar horário
function selectTime(sessaoId, horario) {
    // Remove seleção anterior
    document.querySelectorAll('.time-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Adiciona seleção atual
    event.target.classList.add('selected');
    
    // Armazena a sessão selecionada
    sessionStorage.setItem('selectedSession', JSON.stringify({
        id: sessaoId,
        horario: horario
    }));
    
    console.log(`Sessão ${sessaoId} selecionada para ${horario}`);
}

// Função para selecionar sessão (botão "Escolher Assentos")
async function selectSession() {
    const selectedSession = sessionStorage.getItem('selectedSession');
    
    if (!selectedSession) {
        alert('Por favor, selecione um horário primeiro.');
        return;
    }
    
    const sessionData = JSON.parse(selectedSession);
    
    try {
        // Carrega os assentos disponíveis para a sessão
        const response = await fetch(`${API_BASE_URL}/sessoes/${sessionData.id}/assentos`);
        
        if (response.ok) {
            const assentos = await response.json();
            // Redireciona para a página de seleção de assentos
            window.location.href = `booking.html?sessao=${sessionData.id}&horario=${sessionData.horario}`;
        } else {
            alert('Erro ao carregar assentos. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao selecionar sessão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente.');
    }
}

// Sistema de ícones de classificação
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

// Sistema de trailer
function loadTrailer(trailerUrl) {
    const placeholder = document.getElementById('trailer-placeholder');
    const iframe = document.getElementById('trailer-iframe');
    
    if (trailerUrl && trailerUrl.trim() !== '') {
        placeholder.addEventListener('click', function() {
            const embedUrl = convertToEmbedUrl(trailerUrl);
            iframe.src = embedUrl + '?autoplay=1';
            iframe.style.display = 'block';
            placeholder.style.display = 'none';
        });
        
        placeholder.querySelector('p').textContent = 'Clique para assistir ao trailer';
        placeholder.style.cursor = 'pointer';
    } else {
        placeholder.querySelector('p').textContent = 'Trailer não disponível';
        placeholder.style.cursor = 'default';
    }
}

function convertToEmbedUrl(url) {
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadMovieData();
    
    // Navegação entre datas
    document.querySelectorAll('.date-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Aqui você pode implementar o carregamento de sessões para a data selecionada
            const dataIndex = this.getAttribute('data-date');
            const movieId = new URLSearchParams(window.location.search).get('id');
            // loadSessoesPorData(movieId, dataIndex);
        });
    });
    
    // Botões de ação
    document.getElementById('btn-remember')?.addEventListener('click', function() {
        alert('Filme adicionado aos favoritos!');
    });
    
    document.getElementById('btn-share')?.addEventListener('click', function() {
        alert('Compartilhar filme - Em desenvolvimento');
    });
});

// CSS adicional para estados selecionados
const style = document.createElement('style');
style.textContent = `
    .time-option.selected {
        background: #e50914 !important;
        color: white !important;
        border-color: #e50914 !important;
    }
    
    .no-sessions {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 40px;
    }
`;
document.head.appendChild(style);