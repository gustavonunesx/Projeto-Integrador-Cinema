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

function getRatingIcon(classificacao) {
    if (!classificacao) return '<span class="rating">--</span>';

    let ratingClass = 'rating-l'; // Padrão: Livre
    let ratingText = 'L';
    let title = 'Livre para todos os públicos';

    // Tenta extrair o número da string (ex: "14 anos" -> "14")
    const match = classificacao.match(/\d+/);
    const rating = match ? parseInt(match[0]) : 0;

    if (rating === 10) {
        ratingClass = 'rating-10';
        ratingText = '10';
        title = 'Não recomendado para menores de 10 anos';
    } else if (rating === 12) {
        ratingClass = 'rating-12';
        ratingText = '12';
        title = 'Não recomendado para menores de 12 anos';
    } else if (rating === 14) {
        ratingClass = 'rating-14';
        ratingText = '14';
        title = 'Não recomendado para menores de 14 anos';
    } else if (rating === 16) {
        ratingClass = 'rating-16';
        ratingText = '16';
        title = 'Não recomendado para menores de 16 anos';
    } else if (rating >= 18) {
        ratingClass = 'rating-18';
        ratingText = '18';
        title = 'Não recomendado para menores de 18 anos';
    }

    // Se a string for "Livre" ou "L"
    if (classificacao.toUpperCase().includes('LIVRE') || classificacao.toUpperCase() === 'L') {
        ratingClass = 'rating-l';
        ratingText = 'L';
        title = 'Livre para todos os públicos';
    }

    // Retorna o HTML baseado nas classes do movie.css
    return `<span class="rating-brazil ${ratingClass}" title="${title}">${ratingText}</span>`;
}

function getYouTubeEmbedUrl(url) {
    if (!url) return null;

    let videoId = '';
    
    // Tenta extrair de URLs no formato "watch?v="
    const urlParams = new URLSearchParams(new URL(url).search);
    if (urlParams.has('v')) {
        videoId = urlParams.get('v');
    } else {
        // Tenta extrair de URLs no formato "embed/"
        const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            videoId = match[1];
        }
    }

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null; // Retorna nulo se não conseguir extrair
}

/**
 * CARREGA O TRAILER NO IFRAME
 */
function loadTrailer(trailerUrl) {
    const placeholder = document.getElementById('trailer-placeholder');
    const iframe = document.getElementById('trailer-iframe');
    
    const embedUrl = getYouTubeEmbedUrl(trailerUrl);

    if (embedUrl) {
        // Se temos uma URL válida
        iframe.src = embedUrl;
        iframe.style.display = 'block'; // Mostra o iframe
        if (placeholder) {
            placeholder.style.display = 'none'; // Esconde o "Carregando..."
        }
    } else {
        // Se a URL for inválida ou nula
        if (placeholder) {
            placeholder.innerHTML = '<p>😕 Trailer indisponível.</p>';
        }
        iframe.style.display = 'none'; // Garante que o iframe está escondido
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

function updateDateSelector() {
    const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const hoje = new Date();

    for (let i = 0; i < 5; i++) { // Loop 5 vezes (para HOJE, AMANHÃ, +3 dias)
        const dataAtual = new Date(hoje);
        dataAtual.setDate(hoje.getDate() + i);

        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Meses são 0-11
        const diaSemana = diasSemana[dataAtual.getDay()];

        const dateLabel = document.getElementById(`date-${i}`);
        
        // Pega a tag <span> que mostra o dia da semana
        const dayLabel = dateLabel.previousElementSibling; 
        
        if (dayLabel) {
             if (i === 0) {
                dayLabel.textContent = 'HOJE';
            } else if (i === 1) {
                dayLabel.textContent = 'AMANHÃ';
            } else {
                dayLabel.textContent = diaSemana;
            }
        }

        if (dateLabel) {
            dateLabel.textContent = `${dia}/${mes}`;
        }

        // Adiciona a data completa no formato YYYY-MM-DD ao container
        const dateOption = document.querySelector(`.date-option[data-date="${i}"]`);
        if (dateOption) {
            dateOption.dataset.fullDate = `${dataAtual.getFullYear()}-${mes}-${dia}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', loadMovieData);