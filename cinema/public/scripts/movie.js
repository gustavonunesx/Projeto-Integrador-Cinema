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
    
    // Atualizar datas
    updateDateSelector();
    
    console.log(`[MOVIE] Dados exibidos - Origem: ${isFromBackend ? 'Backend' : 'Local'}`);
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
            dateOption.addEventListener('click', handleDateClick);
        }
    }
}

/**
 * CARREGAR SESSÕES DO BACKEND
 */
async function loadSessoes(filmeId, dataFormatada) {

    console.log(`[MOVIE] Buscando sessões para ${filmeId} em ${dataFormatada}`);

    // Mostra um "Carregando" temporário
    const cinemasContainer = document.querySelector('.cinemas-container');
    cinemasContainer.innerHTML = '<p style="color: white; text-align: center;">Carregando sessões...</p>';
    
    const result = await ApiService.getSessoesPorFilme(filmeId, dataFormatada);
    
    if (result.success && result.data && result.data.length > 0) {
        currentSessions = result.data;
        console.log('[MOVIE] Sessões carregadas:', currentSessions.length);
        displaySessoes(result.data);
    } else {
        console.warn('[MOVIE] Erro ao carregar sessões ou nenhuma encontrada:', result.error);
        displayNoSessions();
    }
}

/**
 * LIDAR COM O CLIQUE EM UM BOTÃO DE DATA
 */
async function handleDateClick(event) {
    // 1. Pega o botão que foi clicado
    const clickedButton = event.currentTarget;
    
    // 2. Pega a data completa (ex: '2025-10-23') que guardamos no dataset
    const selectedDate = clickedButton.dataset.fullDate;
    
    if (!selectedDate || !currentMovie) return; // Não faz nada se não tiver data ou filme
    
    // 3. Atualiza o visual (destaca o botão clicado)
    document.querySelectorAll('.date-option').forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // 4. Limpa a seleção de horário anterior
    selectedSessionId = null;
    
    // 5. Chama a função loadSessoes com a nova data
    await loadSessoes(currentMovie.id, selectedDate);
}

// ===================================
//      LÓGICA DO MODAL DE ASSENTOS
// ===================================

let selectedSeats = []; // Guarda os assentos selecionados (ex: ['A1', 'A2'])
let currentSessionDetails = null; // Guarda os dados da sessão (incluindo preço)

/**
 * 1. FUNÇÃO PRINCIPAL DO BOTÃO "ESCOLHER ASSENTOS"
 */
async function selectSession() {
    // Verifica se um horário foi selecionado primeiro
   if (!selectedSessionId) {
        showCustomAlert("Por favor, selecione um horário antes de escolher os assentos.");
        return;
    }
    
    // Mostra "Carregando" no modal
    const modal = document.getElementById('seat-modal');
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '<p style="color: white; grid-column: 1 / -1;">Carregando assentos...</p>';
    modal.style.display = 'flex';
    
    // Busca os dados dos assentos na API
    console.log(`[MOVIE] Buscando assentos para a sessão: ${selectedSessionId}`);
    const result = await ApiService.getAssentosSessao(selectedSessionId);
    
    if (result.success && result.data) {
        currentSessionDetails = result.data; // Salva os dados (sessao, assentos)
        console.log("[MOVIE] Assentos recebidos:", currentSessionDetails);
        
        // Desenha o grid de assentos
        renderSeatGrid(currentSessionDetails);
    } else {
        alert(`Erro ao carregar assentos: ${result.error}`);
        grid.innerHTML = `<p style="color: red; grid-column: 1 / -1;">${result.error}</p>`;
    }
}

/**
 * 2. DESENHA OS ASSENTOS NO MODAL
 */
function renderSeatGrid(sessionData) {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = ''; // Limpa o "Carregando"
    selectedSeats = []; // Reseta a seleção
    
    const sessao = sessionData.sessao;
    const assentos = sessionData.assentos;

    if (!assentos || assentos.length === 0) {
        grid.innerHTML = '<p style="color: white; grid-column: 1 / -1;">Não foi possível carregar os assentos.</p>';
        return;
    }
    
    // --- INÍCIO DA NOVA LÓGICA ---
    let maxColumn = 0;
    
    // 1. Descobre o número máximo de colunas
    assentos.forEach(assento => {
        // Extrai o número do assento (ex: "A10" -> 10, "B8" -> 8, "C12" -> 12)
        const colNumMatch = assento.numeroAssento.match(/\d+$/); // Pega a parte numérica
        if (colNumMatch) {
            const colNum = parseInt(colNumMatch[0]);
            if (colNum > maxColumn) {
                maxColumn = colNum; // Atualiza o máximo
            }
        }
    });

    // Se, por algum motivo, não encontrar (improvável), usa 10 como padrão
    if (maxColumn === 0) {
        maxColumn = 10; 
    }
    
    console.log(`[MOVIE] Sala detectada com ${maxColumn} colunas.`);
    
    // 2. Define dinamicamente o número de colunas do grid
    grid.style.gridTemplateColumns = `repeat(${maxColumn}, 1fr)`;
    // --- FIM DA NOVA LÓGICA ---
    
    // 3. O resto da função continua igual, populando o grid
    assentos.forEach(assento => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.dataset.numeroAssento = assento.numeroAssento;
        seatElement.dataset.status = assento.status;
        seatElement.textContent = assento.numeroAssento; // Ex: "A1"
        
        if (assento.status === 'DISPONIVEL') {
            seatElement.classList.add('available');
            seatElement.onclick = (e) => toggleSeatSelection(e, sessao.preco);
        } else {
            seatElement.classList.add('occupied');
        }
        grid.appendChild(seatElement);
    });
    
    // Atualiza o resumo (preço, horário)
    const sessionInfo = JSON.parse(sessionStorage.getItem('selectedSession'));
    document.getElementById('summary-session-time').textContent = sessionInfo.horario;
    updateBookingSummary(sessao.preco);
}

/**
 * 3. ALTERNA A SELEÇÃO DE UM ASSENTO
 */
function toggleSeatSelection(event, preco) {
    const seatElement = event.currentTarget;
    const seatNumber = seatElement.dataset.numeroAssento;
    
    if (seatElement.classList.contains('selected')) {
        // Desselecionar
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
        // Selecionar
        seatElement.classList.add('selected');
        selectedSeats.push(seatNumber);
    }
    
    // Atualiza o resumo (preço total, lista de assentos)
    updateBookingSummary(preco);
}

/**
 * 4. ATUALIZA O RESUMO (TOTAL A PAGAR, ASSENTOS)
 */
function updateBookingSummary(preco) {
    const summarySeats = document.getElementById('summary-seats');
    const summaryTotal = document.getElementById('summary-total');
    
    if (selectedSeats.length === 0) {
        summarySeats.textContent = 'Nenhum';
        summaryTotal.textContent = 'R$ 0,00';
    } else {
        summarySeats.textContent = selectedSeats.sort().join(', ');
        const total = selectedSeats.length * parseFloat(preco);
        summaryTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

/**
 * 5. CONFIRMA A RESERVA
 */
async function confirmBooking() {
    if (selectedSeats.length === 0) {
        // Reutiliza o alerta customizado
        showCustomAlert("Você precisa selecionar pelo menos um assento.");
        return;
    }
    
    // Pede o CPF (necessário para a API)
    showCpfModal();
    if (!cpf) {
        alert("CPF é obrigatório para a reserva.");
        return;
    }
    
    console.log(`[MOVIE] Tentando reservar ${selectedSeats.length} assentos...`);
    
    // Aqui fazemos a chamada na API para CADA assento
    // (O ideal seria uma API que aceita uma lista, mas seguimos o backend)
    
    let sucessos = [];
    let falhas = [];
    
    const btnConfirm = document.querySelector('.btn-confirm-booking');
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Reservando...';
    
    for (const assento of selectedSeats) {
        const result = await ApiService.reservarAssento(selectedSessionId, assento, cpf);
        
        if (result.success) {
            sucessos.push(assento);
        } else {
            falhas.push(assento);
        }
    }
    
    btnConfirm.disabled = false;
    btnConfirm.textContent = 'Confirmar Reserva';
    
    // Exibe o resultado
    if (falhas.length > 0) {
        alert(`Houve um erro ao reservar os assentos: ${falhas.join(', ')}.\n\nAssentos reservados com sucesso: ${sucessos.join(', ')}`);
    } else {
        alert(`Reserva realizada com sucesso!
Assentos: ${sucessos.join(', ')}
Total: ${document.getElementById('summary-total').textContent}`);
    }
    
    // Fecha o modal e recarrega as sessões (para atualizar assentos disponíveis)
    closeSeatModal();
    const selectedDate = document.querySelector('.date-option.active').dataset.fullDate;
    await loadSessoes(currentMovie.id, selectedDate);
}

/**
 * 6. FECHA O MODAL
 */
function closeSeatModal() {
    const modal = document.getElementById('seat-modal');
    modal.style.display = 'none';
}


// ===================================
//      LÓGICA DOS MODAIS DE ALERTA
// ===================================

/**
 * MOSTRA UM ALERTA CUSTOMIZADO
 */
function showCustomAlert(message, title = "Atenção") {
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-modal').style.display = 'flex';
}

/**
 * FECHA O ALERTA CUSTOMIZADO
 */
function closeCustomAlert() {
    document.getElementById('alert-modal').style.display = 'none';
}

/**
 * MOSTRA O MODAL DE CPF
 */
function showCpfModal() {
    document.getElementById('cpf-input').value = ''; // Limpa o campo
    document.getElementById('cpf-modal').style.display = 'flex';
    document.getElementById('cpf-input').focus(); // Foca no campo
}

/**
 * FECHA O MODAL DE CPF
 */
function closeCpfModal() {
    document.getElementById('cpf-modal').style.display = 'none';
}

/**
 * LIDA COM O ENVIO DO CPF
 * (Esta é a 2ª parte da antiga função 'confirmBooking')
 */
async function handleCpfSubmit() {
    const cpfInput = document.getElementById('cpf-input');
    const cpf = cpfInput.value.trim();

    // Validação simples de CPF
    if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
        closeCpfModal();
        showCustomAlert("CPF inválido. Por favor, digite os 11 dígitos, apenas números.");
        return;
    }

    closeCpfModal();

    console.log(`[MOVIE] Tentando reservar ${selectedSeats.length} assentos...`);
    
    let sucessos = [];
    let falhas = [];
    
    const btnConfirm = document.querySelector('.btn-confirm-booking');
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Reservando...';
    
    for (const assento of selectedSeats) {
        const result = await ApiService.reservarAssento(selectedSessionId, assento, cpf);
        
        if (result.success) {
            sucessos.push(assento);
        } else {
            falhas.push(assento);
        }
    }
    
    btnConfirm.disabled = false;
    btnConfirm.textContent = 'Confirmar Reserva';
    
    closeSeatModal();

    if (falhas.length > 0) {
        showCustomAlert(`Houve um erro ao reservar os assentos: ${falhas.join(', ')}.\n\nReservados com sucesso: ${sucessos.join(', ')}`, "Erro na Reserva");
    } else {
        // GERA O TICKET
        const reservaData = {
            assentos: sucessos,
            cpf: cpf,
            total: document.getElementById('summary-total').textContent
        };
        
        const { html: ticketHTML, code: ticketCode } = generateTicket(reservaData);
        
        // MOSTRA MODAL DE SUCESSO COM OPÇÕES DE TICKET
        showSuccessModalWithTicket(reservaData, ticketHTML, ticketCode);
    }
    
    const selectedDate = document.querySelector('.date-option.active').dataset.fullDate;
    await loadSessoes(currentMovie.id, selectedDate);
}


/**
 * MODAL DE SUCESSO COM OPÇÕES DO TICKET
 */
function showSuccessModalWithTicket(reservaData, ticketHTML, ticketCode) {
    const sessionInfo = JSON.parse(sessionStorage.getItem('selectedSession'));
    
    // SALVAR TICKET NO LOCALSTORAGE
    saveTicketToStorage(reservaData, ticketCode, sessionInfo);
    
    const modalHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>Reserva Confirmada!</h3>
            <div class="success-details">
                <p><strong>Filme:</strong> ${sessionInfo.filmeTitulo}</p>
                <p><strong>Horário:</strong> ${sessionInfo.horario}</p>
                <p><strong>Assentos:</strong> ${reservaData.assentos.join(', ')}</p>
                <p><strong>Total:</strong> ${reservaData.total}</p>
                <p><strong>Código:</strong> ${ticketCode}</p>
            </div>
            <div class="ticket-actions">
                <button class="btn-ticket" onclick="downloadCurrentTicket()">
                    📥 Baixar Ingresso
                </button>
                <button class="btn-ticket btn-print" onclick="printCurrentTicket()">
                    🖨️ Imprimir
                </button>
                <button class="btn-ticket btn-view-all" onclick="goToTicketsPage()">
                    🎫 Ver Meus Ingressos
                </button>
            </div>
            <button class="btn-confirm-booking" onclick="closeSuccessModal()">Fechar</button>
        </div>
    `;
    
    const alertModal = document.getElementById('alert-modal');
    const alertContent = alertModal.querySelector('.alert-content');
    
    // Salva o ticket no sessionStorage temporariamente
    sessionStorage.setItem('currentTicket', ticketHTML);
    sessionStorage.setItem('currentTicketCode', ticketCode);
    
    alertContent.innerHTML = modalHTML;
    alertModal.style.display = 'flex';
}

/**
 * SALVAR TICKET NO LOCALSTORAGE
 */
function saveTicketToStorage(reservaData, ticketCode, sessionInfo) {
    const hoje = new Date();
    const dataCompra = hoje.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const ticket = {
        code: ticketCode,
        filmeTitulo: sessionInfo.filmeTitulo,
        horario: sessionInfo.horario,
        data: document.querySelector('.date-option.active .date').textContent,
        assentos: reservaData.assentos,
        total: reservaData.total,
        cpf: reservaData.cpf,
        dataCompra: dataCompra,
        cinema: document.querySelector('.cinema-name').textContent,
        sala: currentSessionDetails?.sessao?.sala?.nome || 'Sala 1',
        timestamp: Date.now()
    };
    
    // Recupera tickets existentes
    let tickets = [];
    const ticketsData = localStorage.getItem('cinemax_tickets');
    
    if (ticketsData) {
        try {
            tickets = JSON.parse(ticketsData);
        } catch (error) {
            console.error('[TICKET] Erro ao recuperar tickets:', error);
            tickets = [];
        }
    }
    
    // Adiciona novo ticket
    tickets.push(ticket);
    
    // Salva de volta no localStorage
    localStorage.setItem('cinemax_tickets', JSON.stringify(tickets));
    console.log('[TICKET] Ingresso salvo com sucesso:', ticketCode);
}

/**
 * REDIRECIONAR PARA PÁGINA DE TICKETS
 */
function goToTicketsPage() {
    window.location.href = 'tickets.html';
}

/**
 * FUNÇÕES AUXILIARES PARA OS BOTÕES DO TICKET
 */
/**
 * FUNÇÕES AUXILIARES PARA OS BOTÕES DO TICKET
 */
function downloadCurrentTicket() {
    const ticketHTML = sessionStorage.getItem('currentTicket');
    const ticketCode = sessionStorage.getItem('currentTicketCode');
    const sessionInfo = JSON.parse(sessionStorage.getItem('selectedSession'));
    
    const fileName = `ingresso-${sessionInfo.filmeTitulo.replace(/\s+/g, '-')}-${ticketCode}.html`;
    downloadTicket(ticketHTML, fileName);
}

function printCurrentTicket() {
    const ticketHTML = sessionStorage.getItem('currentTicket');
    printTicket(ticketHTML);
}

function closeSuccessModal() {
    const alertModal = document.getElementById('alert-modal');
    alertModal.style.display = 'none';
    
    // Limpa os dados temporários
    sessionStorage.removeItem('currentTicket');
    sessionStorage.removeItem('currentTicketCode');
    
    // Restaura o conteúdo original do modal de alerta
    const alertContent = alertModal.querySelector('.alert-content');
    alertContent.innerHTML = `
        <h3 id="alert-title">Atenção</h3>
        <p id="alert-message">Mensagem de alerta aqui.</p>
        <button class="btn-confirm-booking" onclick="closeCustomAlert()">OK</button>
    `;
}

function printCurrentTicket() {
    const ticketHTML = sessionStorage.getItem('currentTicket');
    printTicket(ticketHTML);
}

function closeSuccessModal() {
    const alertModal = document.getElementById('alert-modal');
    alertModal.style.display = 'none';
    
    // Limpa os dados temporários
    sessionStorage.removeItem('currentTicket');
    sessionStorage.removeItem('currentTicketCode');
    
    // Restaura o conteúdo original do modal de alerta
    const alertContent = alertModal.querySelector('.alert-content');
    alertContent.innerHTML = `
        <h3 id="alert-title">Atenção</h3>
        <p id="alert-message">Mensagem de alerta aqui.</p>
        <button class="btn-confirm-booking" onclick="closeCustomAlert()">OK</button>
    `;
}


// Controle do menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = mainMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    menuOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Fechar menu ao clicar em um link
    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});
document.addEventListener('DOMContentLoaded', loadMovieData);

// Sistema de Compartilhamento
class ShareSystem {
    constructor() {
        this.shareModal = document.getElementById('share-modal');
        this.closeShareModal = document.getElementById('close-share-modal');
        this.btnShare = document.getElementById('btn-share');
        this.shareOptions = document.querySelectorAll('.share-option');
        this.shareUrlInput = document.getElementById('share-url');
        this.btnCopyUrl = document.getElementById('btn-copy-url');
        
         // IMPORTANTE: Garantir que o modal comece fechado
        if (this.shareModal) {
            this.shareModal.style.display = 'none';
        }
        this.init();
    }
    
    init() {
        // Event Listeners
        this.btnShare.addEventListener('click', () => this.openShareModal());
        this.closeShareModal.addEventListener('click', () => this.closeShareModalFunc());
        this.shareModal.addEventListener('click', (e) => {
            if (e.target === this.shareModal) this.closeShareModalFunc();
        });
        
        this.shareOptions.forEach(option => {
            option.addEventListener('click', () => this.handleShare(option.dataset.platform));
        });
        
        this.btnCopyUrl.addEventListener('click', () => this.copyToClipboard());
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeShareModalFunc();
        });
    }
    
    openShareModal() {
        // Atualizar URL atual no input
        const currentUrl = window.location.href;
        this.shareUrlInput.value = currentUrl;
        
        // Gerar texto para compartilhamento
        const movieTitle = document.getElementById('movie-title').textContent;
        this.shareText = `Confira o filme "${movieTitle}" no CineMax!`;
        
        // Mostrar modal
        this.shareModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeShareModalFunc() {
        this.shareModal.style.display = 'none';
        document.body.style.overflow = '';
        this.btnCopyUrl.textContent = 'Copiar';
        this.btnCopyUrl.classList.remove('copied');
    }
    
    handleShare(platform) {
        const url = encodeURIComponent(this.shareUrlInput.value);
        const text = encodeURIComponent(this.shareText);
        
        let shareUrl;
        
        switch(platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('Confira este filme!')}&body=${text}%20${url}`;
                break;
            case 'copy':
                this.copyToClipboard();
                return;
        }
        
        if (platform === 'email') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        this.closeShareModalFunc();
    }
    
    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.shareUrlInput.value);
            this.btnCopyUrl.textContent = 'Copiado!';
            this.btnCopyUrl.classList.add('copied');
            
            // Reset após 2 segundos
            setTimeout(() => {
                this.btnCopyUrl.textContent = 'Copiar';
                this.btnCopyUrl.classList.remove('copied');
            }, 2000);
        } catch (err) {
            // Fallback para navegadores mais antigos
            this.shareUrlInput.select();
            document.execCommand('copy');
            this.btnCopyUrl.textContent = 'Copiado!';
            this.btnCopyUrl.classList.add('copied');
            
            setTimeout(() => {
                this.btnCopyUrl.textContent = 'Copiar';
                this.btnCopyUrl.classList.remove('copied');
            }, 2000);
        }
    }
}

/**
 * GERA O TICKET EM HTML E PERMITE DOWNLOAD
 */
function generateTicket(reservaData) {
    const sessionInfo = JSON.parse(sessionStorage.getItem('selectedSession'));
    const hoje = new Date();
    const dataCompra = hoje.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Gera um código único para o ticket
    const ticketCode = `TKT${Date.now().toString().slice(-8)}`;
    
    const ticketHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - ${sessionInfo.filmeTitulo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .ticket-container {
            background: white;
            width: 100%;
            max-width: 400px;
            border: 3px dashed #333;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .ticket-header {
            background: linear-gradient(135deg, #1a1a1a 0%, #e50914 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        
        .ticket-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
            letter-spacing: 2px;
        }
        
        .ticket-header p {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .ticket-body {
            padding: 25px;
        }
        
        .ticket-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #ccc;
        }
        
        .ticket-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .ticket-section h2 {
            font-size: 14px;
            color: #e50914;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .ticket-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
        }
        
        .ticket-info strong {
            color: #333;
        }
        
        .ticket-info span {
            color: #666;
            text-align: right;
        }
        
        .seats-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        
        .seat-tag {
            background: #e50914;
            color: white;
            padding: 5px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
        }
        
        .ticket-code {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin-top: 15px;
        }
        
        .ticket-code .code {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
        }
        
        .ticket-code .label {
            font-size: 11px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .barcode {
            text-align: center;
            margin-top: 15px;
        }
        
        .barcode svg {
            width: 100%;
            max-width: 250px;
            height: 60px;
        }
        
        .ticket-footer {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 5px 5px;
            font-size: 11px;
            color: #666;
        }
        
        .total-price {
            background: #1a1a1a;
            color: white;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin-top: 10px;
        }
        
        .total-price .label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        
        .total-price .value {
            font-size: 28px;
            font-weight: bold;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .ticket-container {
                box-shadow: none;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-header">
            <h1>🎬 CINEMAX</h1>
            <p>Ingresso de Cinema</p>
        </div>
        
        <div class="ticket-body">
            <div class="ticket-section">
                <h2>📽️ Filme</h2>
                <div class="ticket-info">
                    <strong>Título:</strong>
                    <span>${sessionInfo.filmeTitulo}</span>
                </div>
                <div class="ticket-info">
                    <strong>Sessão:</strong>
                    <span>${sessionInfo.horario}</span>
                </div>
                <div class="ticket-info">
                    <strong>Data:</strong>
                    <span>${document.querySelector('.date-option.active .date').textContent}</span>
                </div>
            </div>
            
            <div class="ticket-section">
                <h2>🎭 Sala e Assentos</h2>
                <div class="ticket-info">
                    <strong>Cinema:</strong>
                    <span>${document.querySelector('.cinema-name').textContent}</span>
                </div>
                <div class="ticket-info">
                    <strong>Sala:</strong>
                    <span>Sala ${currentSessionDetails?.sessao?.sala?.nome || '1'}</span>
                </div>
                <div class="ticket-info">
                    <strong>Quantidade:</strong>
                    <span>${reservaData.assentos.length} ingresso(s)</span>
                </div>
                <div class="seats-grid">
                    ${reservaData.assentos.map(seat => `<span class="seat-tag">${seat}</span>`).join('')}
                </div>
            </div>
            
            <div class="ticket-section">
                <h2>💳 Pagamento</h2>
                <div class="ticket-info">
                    <strong>CPF:</strong>
                    <span>${reservaData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</span>
                </div>
                <div class="ticket-info">
                    <strong>Data da Compra:</strong>
                    <span>${dataCompra}</span>
                </div>
                <div class="total-price">
                    <div class="label">TOTAL PAGO</div>
                    <div class="value">${reservaData.total}</div>
                </div>
            </div>
            
            <div class="ticket-code">
                <div class="label">CÓDIGO DO INGRESSO</div>
                <div class="code">${ticketCode}</div>
            </div>
            
            <div class="barcode">
                <svg viewBox="0 0 200 60">
                    ${generateBarcodeSVG(ticketCode)}
                </svg>
            </div>
        </div>
        
        <div class="ticket-footer">
            <p><strong>IMPORTANTE:</strong> Apresente este ingresso na entrada da sala.</p>
            <p>Chegue com 15 minutos de antecedência.</p>
            <p>© 2023 CineMax - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>
    `;
    
    return { html: ticketHTML, code: ticketCode };
}


/**
 * GERA UM CÓDIGO DE BARRAS SVG SIMPLES
 */
function generateBarcodeSVG(code) {
    // Converte o código em uma sequência de barras (simulação simplificada)
    let bars = '';
    let x = 0;
    const width = 3;
    
    // Para cada caractere, cria uma sequência de barras baseada no código ASCII
    for (let i = 0; i < code.length; i++) {
        const charCode = code.charCodeAt(i) % 2; // Alterna entre preto e branco
        
        if (charCode === 1) {
            bars += `<rect x="${x}" y="0" width="${width}" height="60" fill="#000"/>`;
        }
        x += width;
        
        // Adiciona espaço
        x += width * 0.5;
    }
    
    // Adiciona barras aleatórias extras para parecer mais realista
    for (let i = 0; i < 20; i++) {
        const shouldDraw = Math.random() > 0.5;
        if (shouldDraw) {
            bars += `<rect x="${x}" y="0" width="${width}" height="60" fill="#000"/>`;
        }
        x += width + 1;
    }
    
    return bars;
}

/**
 * FAZ O DOWNLOAD DO TICKET COMO HTML
 */
function downloadTicket(ticketHTML, fileName) {
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


/**
 * ABRE O TICKET EM NOVA ABA PARA IMPRESSÃO
 */
function printTicket(ticketHTML) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    
    // Aguarda o carregamento e abre o diálogo de impressão
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };
}


// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ShareSystem();
});