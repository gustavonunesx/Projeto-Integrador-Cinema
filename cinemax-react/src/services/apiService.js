// Baseado no seu arquivo api-service.js original
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 5000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Serviço central para comunicação com a API
 * Todos os métodos retornam { success: boolean, data: any, error: string }
 */
export const ApiService = {
    /**
     * Método genérico para fazer requisições HTTP
     */
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const url = `${API_CONFIG.BASE_URL}${endpoint}`;
            const config = {
                ...options,
                headers: {
                    ...API_CONFIG.HEADERS,
                    ...options.headers
                },
                signal: controller.signal
            };

            console.log(`[API] Requisição: ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[API] Resposta recebida:`, data);
            
            return { success: true, data, error: null };
        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`[API] Erro na requisição:`, error);
            
            return {
                success: false,
                data: null,
                error: error.name === 'AbortError' 
                    ? 'Tempo esgotado - servidor não respondeu'
                    : error.message
            };
        }
    },

    /**
     * FILMES
     */
    
    // Buscar todos os filmes
    async getAllFilmes() {
        return await this.request('/filmes');
    },

    // Buscar filmes em cartaz
    async getFilmesEmCartaz() {
        return await this.request('/filmes/em-cartaz');
    },

    // Buscar filme por ID
    async getFilmeById(id) {
        return await this.request(`/filmes/${id}`);
    },

    // Buscar filmes por título
    async searchFilmes(titulo) {
        return await this.request(`/filmes/buscar?titulo=${encodeURIComponent(titulo)}`);
    },

    /**
     * SESSÕES
     */
    
    // Buscar sessões de um filme em uma data específica
    async getSessoesPorFilme(filmeId, data) {
        // Formato esperado: YYYY-MM-DD
        const dataFormatada = data instanceof Date 
            ? data.toISOString().split('T')[0] 
            : data;
        
        return await this.request(`/sessoes/filme/${filmeId}?data=${dataFormatada}`);
    },

    // Buscar assentos de uma sessão
    async getAssentosSessao(sessaoId) {
        return await this.request(`/sessoes/${sessaoId}/assentos`);
    },

    // Reservar um assento
    async reservarAssento(sessaoId, numeroAssento, cpf) {
        // Constrói a URL com os parâmetros que o @RequestParam espera
        const endpoint = `/sessoes/${sessaoId}/reservar?numeroAssento=${encodeURIComponent(numeroAssento)}&cpf=${encodeURIComponent(cpf)}`;

        return await this.request(endpoint, { 
             method: 'POST',
        });
    },

    /**
     * UTILIDADES
     */
    
    // Verificar se o backend está disponível
    async isBackendAvailable() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/filmes`, {
                method: 'GET',
                signal: AbortSignal.timeout(2000)
            });
            return response.ok;
        } catch (error) {
            console.warn("[API] isBackendAvailable falhou:", error); 
            return false;
        }
    },

    // Formatar data para o padrão esperado pela API (YYYY-MM-DD)
    formatDate(date) {
        if (typeof date === 'string') return date;
        
        const d = date instanceof Date ? date : new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    },

    // Formatar horário para exibição (HH:MM)
    formatTime(time) {
        if (typeof time === 'string') {
            return time.substring(0, 5);
        }
        return time;
    }
};