// movie.js - Versão completa integrada com backend

let currentMovie = null;
let currentSessions = [];
let selectedSessionId = null;

/**
 * CARREGAMENTO PRINCIPAL
 */
async function loadMovieData() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        showError('ID do filme não fornecido');
        return;
    }
    
    console.log(`[MOVIE] Carregando dados do filme: ${movieId}`);
    
    // Tentar carregar do backend primeiro
    const result = await ApiService.getFilmeById(movieId);
    
    if (result.success && result.data) {
        console.log('[MOVIE] Filme carregado do backend:', result.data);
        currentMovie = result.data;
        displayMovieData(result.data, true);
        await loadSessoes(movieId);
    } else {
        console.warn('[MOVIE] Backend indisponível, tentando dados locais...');
        // Fallback para dados locais
        const localMovie = moviesDatabase[movieId];
        
        if (localMovie) {
            currentMovie = localMovie;
            displayMovieData(localMovie, false);
            displaySessoesLocais(localMovie.sessions);
        } else {
            showError('Filme não encontrado');
        }
    }
}

/**
 * EXIBIR DADOS DO FILME
 */
function displayMovieData(movie, isFromBackend) {
    // Adaptar campos conforme origem dos dados
    const titulo = movie.titulo || movie.title;
    const duracao = movie.duracao || movie.duration;
    const genero = movie.genero || movie.genre;
    const classificacao = movie.classificacao || movie.rating;
    const descricao = movie.descricao || movie.description;
    const posterUrl = movie.posterUrl || movie.poster;
    const trailerUrl = movie.trailerUrl || movie.trailer;
    
    // Atualizar DOM
    document.title = `${titulo} - CineMax`;
    document.getElementById('movie-title').textContent = titulo;
    document.getElementById('movie-duration').textContent = duracao;
    document.getElementById('movie-genre').textContent = genero;
    document.getElementById('movie-rating').innerHTML = getRatingIcon(classificacao);
    document.getElementById('movie-description').textContent = descricao;
    
    const posterImg = document.getElementById('movie-poster-img');
    posterImg.src = posterUrl;
    posterImg.alt = titulo;
    posterImg.onerror = () => {
        posterImg.src = '../images/placeholder.jpg';
    };
    
    // Carregar trailer
    if (trailerUrl) {
        loadTrailer(trailerUrl);
    }
    
    // Atualizar datas
    updateDateSelector();
    
    console.log(`[MOVIE] Dados exibidos - Origem: ${isFromBackend ? 'Backend' : 'Local'}`);
}

/**
 * CARREGAR SESSÕES DO BACKEND
 */
async function loadSessoes(filmeId) {
    const hoje = new Date();
    const dataFormatada = ApiService.formatDate(hoje);
    
    console.log(`[MOVIE] Buscando sessões para ${filmeId} em ${dataFormatada}`);
    
    const result = await ApiService.getSessoesPorFilme(filmeId, dataFormatada);
    
    if (result.success && result.data) {
        currentSessions = result.data;
        console.log('[MOVIE] Sessões carregadas:', currentSessions.length);
        displaySessoes(result.data);
    } else {
        console.warn('[MOVIE] Erro ao carregar sessões, usando fallback');
        displayNoSessions();
    }
}

/**
 * EXIBIR SESSÕES DO BACKEND
 */
function displaySessoes(sessoes) {
    const cinemasContainer = document.querySelector('.cinemas-container');
    
    if (!sessoes || sessoes.length === 0) {
        displayNoSessions();
        return;
    }
    
    // Agrupar sessões por cinema/sala
    const sessoesPorCinema = agruparSessoesPorCinema(sessoes);
    
    let html = '';
    
    Object.keys(sessoesPorCinema).forEach(cinemaNome => {
        const sessoesCinema = sessoesPorCinema[cinemaNome];
        const sala = sessoesCinema[0].sala;
        
        html += `
            <div class="cinema-card">
                <h3 class="cinema-name">${cinemaNome}</h3>
                <p class="cinema-address">${sala.nome} | Capacidade: ${sala.capacidade} assentos</p>
                
                <div class="session-types">
                    ${gerarTiposSessao(sessoesCinema)}
                </div>
                
                <button class="btn-book" onclick="selectSession()">Escolher Assentos</button>
            </div>
        `;
    });
    
    cinemasContainer.innerHTML = html;
}

/**
 * AGRUPAR SESSÕES POR CINEMA
 */
function agruparSessoesPorCinema(sessoes) {
    const agrupadas = {};
    
    sessoes.forEach(sessao => {
        const cinemaKey = `Cine ${sessao.sala.nome || 'Principal'}`;
        
        if (!agrupadas[cinemaKey]) {
            agrupadas[cinemaKey] = [];
        }
        
        agrupadas[cinemaKey].push(sessao);
    });
    
    return agrupadas;
}

/**
 * GERAR HTML DOS TIPOS DE SESSÃO
 */
function gerarTiposSessao(sessoes) {
    const sessoesPorTipo = {};
    
    // Agrupar por tipo de exibição
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
        const partes = tipo.split(' ');
        const tipoExibicao = partes[0] || '2D';
        const audio = partes[1] || 'DUBLADO';
        
        html += `
            <div class="session-type">
                <div class="type-header">
                    <span class="type-name">${tipoExibicao}</span>
                    <span class="type-audio">${audio}</span>
                </div>
                <div class="session-times">
                    ${sessoesTipo.map(sessao => {
                        const horario = ApiService.formatTime(sessao.horario);
                        const preco = sessao.preco ? `R$ ${sessao.preco.toFixed(2)}` : '';
                        
                        return `
                            <span class="time-option" 
                                  data-sessao-id="${sessao.id}" 
                                  data-horario="${horario}"
                                  data-preco="${sessao.preco || 0}"
                                  onclick="selectTime(${sessao.id}, '${horario}', ${sessao.preco || 0})">
                                ${horario}
                                ${preco ? `<small>${preco}</small>` : ''}
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * EXIBIR MENSAGEM DE SEM SESSÕES
 */
function displayNoSessions() {
    const cinemasContainer = document.querySelector('.cinemas-container');
    cinemasContainer.innerHTML = `
        <div class="no-sessions">
            <p>😕 Nenhuma sessão disponível para esta data.</p>
            <p>Tente selecionar outra data acima.</p>
        </div>
    `;
}

/**
 * EXIBIR SESSÕES LOCAIS (FALLBACK)
 */
function displaySessoesLocais(sessions) {
    console.log('[MOVIE] Usando sessões locais como fallback');
    // Mantém o HTML estático que já existe
}

/**
 * SELECIONAR HORÁRIO
 */
function selectTime(sessaoId, horario, preco) {
    console.log(`[MOVIE] Horário selecionado: ${horario} - Sessão ID: ${sessaoId}`);
    
    // Remover seleção anterior
    document.querySelectorAll('.time-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    event.target.classList.add('selected');
    
    // Armazenar sessão selecionada
    selectedSessionId = sessaoId;
    sessionStorage.setItem('selectedSession', JSON.stringify({
        id: sessaoId,
        horario: horario,
        preco: preco,
        filmeId: currentMovie?.id,
        filmeTitulo: currentMovie?.titulo || currentMovie?.title
    }));
}