// Guarda os dados dos relatórios para o download
let dadosFilmes = [];
let dadosHorarios = [];
let dadosDias = [];

// Quando o HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Pega os elementos
    const btnGerar = document.getElementById('btn-gerar');
    const btnDownload = document.getElementById('btn-download');
    
    // Define datas padrão (últimos 30 dias)
    setDefaultDates();

    // Adiciona o evento de clique
    btnGerar.addEventListener('click', gerarRelatorio);
    btnDownload.addEventListener('click', iniciarDownload);
});

/**
 * Define as datas padrão (Hoje e 30 dias atrás)
 */
function setDefaultDates() {
    const endDate = document.getElementById('end-date');
    const startDate = document.getElementById('start-date');

    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    // Formato YYYY-MM-DD
    endDate.value = hoje.toISOString().split('T')[0];
    startDate.value = trintaDiasAtras.toISOString().split('T')[0];
}

/**
 * Função principal: busca os dados na API
 */
async function gerarRelatorio() {
    const dataInicio = document.getElementById('start-date').value;
    const dataFim = document.getElementById('end-date').value;
    
    if (!dataInicio || !dataFim) {
        alert("Por favor, selecione as datas de início e fim.");
        return;
    }

    console.log(`[REL] Gerando relatórios de ${dataInicio} a ${dataFim}`);
    
    // Mostra "Carregando..."
    document.getElementById('filmes-populares-container').innerHTML = '<p>Carregando...</p>';
    document.getElementById('horarios-movimento-container').innerHTML = '<p>Carregando...</p>';
    document.getElementById('dias-movimento-container').innerHTML = '<p>Carregando...</p>';

    try {
        // Chama as APIs em paralelo
        const [filmesResult, horariosResult] = await Promise.all([
            ApiService.getFilmesPopulares(dataInicio, dataFim),
            ApiService.getHorariosMovimentados(dataInicio, dataFim)
        ]);

        // Processa resultado dos Filmes
        if (filmesResult.success) {
            dadosFilmes = filmesResult.data.filmes; // Salva para download
            renderFilmesPopulares(dadosFilmes);
        } else {
            document.getElementById('filmes-populares-container').innerHTML = `<p style="color: red;">${filmesResult.error}</p>`;
        }

        // Processa resultado dos Horários e Dias
        if (horariosResult.success) {
            dadosHorarios = horariosResult.data.horarios; // Salva para download
            dadosDias = horariosResult.data.dias; // Salva para download
            renderHorarios(dadosHorarios);
            renderDias(dadosDias);
        } else {
            document.getElementById('horarios-movimento-container').innerHTML = `<p style="color: red;">${horariosResult.error}</p>`;
            document.getElementById('dias-movimento-container').innerHTML = `<p style="color: red;">${horariosResult.error}</p>`;
        }
        
        // Mostra o botão de download
        document.getElementById('btn-download').style.display = 'block';

    } catch (error) {
        console.error("[REL] Erro ao gerar relatórios:", error);
    }
}

/**
 * Renderiza a tabela de Filmes Populares
 */
function renderFilmesPopulares(filmes) {
    const container = document.getElementById('filmes-populares-container');
    if (filmes.length === 0) {
        container.innerHTML = '<p>Nenhum dado encontrado.</p>';
        return;
    }

    let html = '<table class="report-table"><thead><tr><th>Filme</th><th>Vendas</th><th>Receita</th></tr></thead><tbody>';
    
    filmes.forEach(filme => {
        const receita = filme.receitaTotal ? `R$ ${filme.receitaTotal.toFixed(2)}` : 'R$ 0.00';
        html += `
            <tr>
                <td>${filme.titulo}</td>
                <td>${filme.totalVendas}</td>
                <td>${receita}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

/**
 * Renderiza a tabela de Horários de Pico
 */
function renderHorarios(horarios) {
    const container = document.getElementById('horarios-movimento-container');
    if (horarios.length === 0) {
        container.innerHTML = '<p>Nenhum dado encontrado.</p>';
        return;
    }

    let html = '<table class="report-table"><thead><tr><th>Horário</th><th>Total Reservas</th></tr></thead><tbody>';
    
    horarios.forEach(item => {
        html += `
            <tr>
                <td>${item.horario.substring(0, 5)}</td>
                <td>${item.totalReservas}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

/**
 * Renderiza a tabela de Dias da Semana
 */
function renderDias(dias) {
    const container = document.getElementById('dias-movimento-container');
    if (dias.length === 0) {
        container.innerHTML = '<p>Nenhum dado encontrado.</p>';
        return;
    }

    let html = '<table class="report-table"><thead><tr><th>Dia da Semana</th><th>Total Reservas</th></tr></thead><tbody>';
    
    // O backend retorna Object[] (ex: ["Monday", 120])
    dias.forEach(item => {
        html += `
            <tr>
                <td>${item[0]}</td>
                <td>${item[1]}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

/**
 * LÓGICA DE DOWNLOAD CSV
 */

function iniciarDownload() {
    console.log("[REL] Iniciando geração de CSV...");
    
    const dataInicio = document.getElementById('start-date').value;
    const dataFim = document.getElementById('end-date').value;
    
    let csvContent = ""; // Começa o arquivo CSV
    
    csvContent += `RELATÓRIO CINEMAX - Período: ${dataInicio} a ${dataFim}\n\n`;
    
    // Seção Filmes
    csvContent += "Filmes Mais Populares\n";
    csvContent += "Titulo;Total Vendas;Receita Total\n"; // Cabeçalho
    dadosFilmes.forEach(filme => {
        const receita = filme.receitaTotal ? filme.receitaTotal.toFixed(2) : '0.00';
        csvContent += `${filme.titulo};${filme.totalVendas};${receita}\n`;
    });
    
    // Seção Horários
    csvContent += "\nHorários de Pico\n";
    csvContent += "Horario;Total Reservas\n";
    dadosHorarios.forEach(item => {
        csvContent += `${item.horario.substring(0, 5)};${item.totalReservas}\n`;
    });

    // Seção Dias
    csvContent += "\nDias Mais Movimentados\n";
    csvContent += "Dia da Semana;Total Reservas\n";
    dadosDias.forEach(item => {
        csvContent += `${item[0]};${item[1]}\n`;
    });
    
    // Chama a função de download
    downloadCSV(csvContent, `Relatorio_CineMax_${dataInicio}_a_${dataFim}.csv`);
}

/**
 * Função helper que cria e clica em um link de download
 */
function downloadCSV(csvContent, fileName) {
    const bom = '\uFEFF'; // BOM (Byte Order Mark) para garantir a codificação UTF-8 correta no Excel
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) { // Checagem de compatibilidade
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}