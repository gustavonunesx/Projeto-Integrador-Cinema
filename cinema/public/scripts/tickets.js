// tickets.js - Gerenciamento da página de tickets

class TicketsManager {
    constructor() {
        this.tickets = [];
        this.filteredTickets = [];
        this.currentTicket = null;
        this.init();
    }
    
    init() {
        this.loadTickets();
        this.setupEventListeners();
        this.setupMenuMobile();
    }
    
    /**
     * CARREGA TICKETS DO LOCALSTORAGE
     */
    loadTickets() {
        const ticketsData = localStorage.getItem('cinemax_tickets');
        
        if (ticketsData) {
            try {
                this.tickets = JSON.parse(ticketsData);
                this.filteredTickets = [...this.tickets];
                console.log(`[TICKETS] ${this.tickets.length} ingressos carregados`);
            } catch (error) {
                console.error('[TICKETS] Erro ao carregar ingressos:', error);
                this.tickets = [];
                this.filteredTickets = [];
            }
        } else {
            this.tickets = [];
            this.filteredTickets = [];
            console.log('[TICKETS] Nenhum ingresso encontrado');
        }
        
        this.renderTickets();
    }
    
    /**
     * RENDERIZA OS TICKETS NA GRID
     */
    renderTickets() {
        const grid = document.getElementById('ticketsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) return;
        
        // Remove loading
        const loading = grid.querySelector('.loading');
        if (loading) loading.remove();
        
        if (this.filteredTickets.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        grid.innerHTML = '';
        
        this.filteredTickets.forEach(ticket => {
            const card = this.createTicketCard(ticket);
            grid.appendChild(card);
        });
    }
    
    /**
     * CRIA CARD DE TICKET
     */
    createTicketCard(ticket) {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.onclick = () => this.showTicketModal(ticket);
        
        const status = this.getTicketStatus(ticket);
        
        card.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-status ${status.class}">${status.text}</span>
                <span class="ticket-code">${ticket.code}</span>
            </div>
            <div class="ticket-body">
                <h3 class="ticket-movie-title">${ticket.filmeTitulo}</h3>
                <div class="ticket-info-grid">
                    <div class="ticket-info-item">
                        <span class="ticket-info-label">📅 Data:</span>
                        <span class="ticket-info-value">${ticket.data}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label">🕐 Horário:</span>
                        <span class="ticket-info-value">${ticket.horario}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label">🎭 Assentos:</span>
                        <span class="ticket-info-value">${ticket.assentos.join(', ')}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label">🏛️ Cinema:</span>
                        <span class="ticket-info-value">${ticket.cinema}</span>
                    </div>
                </div>
            </div>
            <div class="ticket-footer">
                <span class="ticket-price">${ticket.total}</span>
                <div class="ticket-actions">
                    <button class="btn-icon" title="Visualizar" onclick="event.stopPropagation(); ticketsManager.showTicketModal(${JSON.stringify(ticket).replace(/"/g, '&quot;')})">
                        👁️
                    </button>
                    <button class="btn-icon" title="Baixar" onclick="event.stopPropagation(); ticketsManager.downloadTicket(${JSON.stringify(ticket).replace(/"/g, '&quot;')})">
                        📥
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    /**
     * DETERMINA STATUS DO TICKET
     */
    getTicketStatus(ticket) {
        const hoje = new Date();
        const dataTicket = this.parseDate(ticket.data, ticket.horario);
        
        if (dataTicket > hoje) {
            return { class: 'upcoming', text: 'Próximo' };
        } else {
            return { class: 'past', text: 'Anterior' };
        }
    }
    
    /**
     * CONVERTE DATA E HORÁRIO PARA OBJETO DATE
     */
    parseDate(dataStr, horarioStr) {
        // Assume formato DD/MM
        const [dia, mes] = dataStr.split('/');
        const [hora, minuto] = horarioStr.split(':');
        const ano = new Date().getFullYear();
        
        return new Date(ano, parseInt(mes) - 1, parseInt(dia), parseInt(hora), parseInt(minuto));
    }
    
    /**
     * MOSTRA MODAL COM TICKET COMPLETO
     */
    showTicketModal(ticket) {
        this.currentTicket = ticket;
        const modal = document.getElementById('ticketModal');
        const preview = document.getElementById('ticketPreview');
        
        if (!modal || !preview) return;
        
        preview.innerHTML = this.generateTicketHTML(ticket);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * GERA HTML COMPLETO DO TICKET
     */
    generateTicketHTML(ticket) {
        return `
            <div style="background: white; color: #333; border-radius: 8px; overflow: hidden; border: 3px dashed #333;">
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #BA2626 100%); color: white; padding: 20px; text-align: center;">
                    <h1 style="font-size: 24px; margin-bottom: 5px; letter-spacing: 2px;">🎬 CINEMAX</h1>
                    <p style="font-size: 12px; opacity: 0.9;">Ingresso de Cinema</p>
                </div>
                
                <div style="padding: 25px;">
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
                        <h2 style="font-size: 14px; color: #BA2626; margin-bottom: 10px; text-transform: uppercase;">📽️ Filme</h2>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Título:</strong>
                            <span>${ticket.filmeTitulo}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Sessão:</strong>
                            <span>${ticket.horario}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px;">
                            <strong>Data:</strong>
                            <span>${ticket.data}</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
                        <h2 style="font-size: 14px; color: #BA2626; margin-bottom: 10px; text-transform: uppercase;">🎭 Sala e Assentos</h2>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Cinema:</strong>
                            <span>${ticket.cinema}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Sala:</strong>
                            <span>${ticket.sala}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Quantidade:</strong>
                            <span>${ticket.assentos.length} ingresso(s)</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                            ${ticket.assentos.map(seat => `<span style="background: #BA2626; color: white; padding: 5px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">${seat}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
                        <h2 style="font-size: 14px; color: #BA2626; margin-bottom: 10px; text-transform: uppercase;">💳 Pagamento</h2>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>CPF:</strong>
                            <span>${ticket.cpf}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                            <strong>Data da Compra:</strong>
                            <span>${ticket.dataCompra}</span>
                        </div>
                        <div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 6px; text-align: center; margin-top: 10px;">
                            <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">TOTAL PAGO</div>
                            <div style="font-size: 28px; font-weight: bold;">${ticket.total}</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 11px; color: #666; margin-bottom: 5px;">CÓDIGO DO INGRESSO</div>
                        <div style="font-size: 20px; font-weight: bold; color: #1a1a1a; letter-spacing: 3px; font-family: 'Courier New', monospace;">${ticket.code}</div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #666;">
                    <p><strong>IMPORTANTE:</strong> Apresente este ingresso na entrada da sala.</p>
                    <p>Chegue com 15 minutos de antecedência.</p>
                    <p>© 2023 CineMax - Todos os direitos reservados</p>
                </div>
            </div>
        `;
    }
    
    /**
     * BAIXAR TICKET
     */
    downloadTicket(ticket) {
        const ticketHTML = this.generateFullTicketHTML(ticket);
        const blob = new Blob([ticketHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ingresso-${ticket.code}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * GERA HTML COMPLETO DO TICKET PARA DOWNLOAD
     */
    generateFullTicketHTML(ticket) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - ${ticket.filmeTitulo}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #f5f5f5; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        @media print { body { background: white; padding: 0; } }
    </style>
</head>
<body>
    ${this.generateTicketHTML(ticket)}
</body>
</html>`;
    }
    
    /**
     * IMPRIMIR TICKET
     */
    printTicket() {
        if (!this.currentTicket) return;
        
        const ticketHTML = this.generateFullTicketHTML(this.currentTicket);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(ticketHTML);
        printWindow.document.close();
        
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };
    }
    
    /**
     * EXCLUIR TICKET
     */
    deleteTicket() {
        if (!this.currentTicket) return;
        
        const index = this.tickets.findIndex(t => t.code === this.currentTicket.code);
        if (index > -1) {
            this.tickets.splice(index, 1);
            localStorage.setItem('cinemax_tickets', JSON.stringify(this.tickets));
            this.closeTicketModal();
            this.closeConfirmDeleteModal();
            this.loadTickets();
            this.showNotification('Ingresso excluído com sucesso!', 'success');
        }
    }
    
    /**
     * FILTRAR TICKETS
     */
    filterTickets() {
        const searchTerm = document.getElementById('searchTicket').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        
        this.filteredTickets = this.tickets.filter(ticket => {
            const matchesSearch = 
                ticket.code.toLowerCase().includes(searchTerm) ||
                ticket.filmeTitulo.toLowerCase().includes(searchTerm) ||
                ticket.cpf.includes(searchTerm);
            
            if (statusFilter === 'all') {
                return matchesSearch;
            }
            
            const status = this.getTicketStatus(ticket);
            const matchesStatus = status.class === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        this.renderTickets();
    }
    
    /**
     * LIMPAR FILTROS
     */
    clearFilters() {
        document.getElementById('searchTicket').value = '';
        document.getElementById('filterStatus').value = 'all';
        this.filteredTickets = [...this.tickets];
        this.renderTickets();
    }
    
    /**
     * FECHAR MODAIS
     */
    closeTicketModal() {
        const modal = document.getElementById('ticketModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeConfirmDeleteModal() {
        const modal = document.getElementById('confirmDeleteModal');
        modal.classList.remove('active');
    }
    
    showConfirmDeleteModal() {
        const modal = document.getElementById('confirmDeleteModal');
        modal.classList.add('active');
    }
    
    /**
     * NOTIFICAÇÃO
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * EVENT LISTENERS
     */
    setupEventListeners() {
        // Busca e filtros
        document.getElementById('searchTicket')?.addEventListener('input', () => this.filterTickets());
        document.getElementById('filterStatus')?.addEventListener('change', () => this.filterTickets());
        document.getElementById('clearFilters')?.addEventListener('click', () => this.clearFilters());
        
        // Modais
        document.getElementById('closeTicketModal')?.addEventListener('click', () => this.closeTicketModal());
        document.getElementById('downloadTicketBtn')?.addEventListener('click', () => this.downloadTicket(this.currentTicket));
        document.getElementById('printTicketBtn')?.addEventListener('click', () => this.printTicket());
        document.getElementById('deleteTicketBtn')?.addEventListener('click', () => this.showConfirmDeleteModal());
        
        // Confirmação de exclusão
        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => this.closeConfirmDeleteModal());
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => this.deleteTicket());
        
        // Fechar modal ao clicar fora
        document.getElementById('ticketModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'ticketModal') this.closeTicketModal();
        });
    }
    
    /**
     * MENU MOBILE
     */
    setupMenuMobile() {
        const menuToggle = document.getElementById('menuToggle');
        const mainMenu = document.getElementById('mainMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (menuToggle && mainMenu && menuOverlay) {
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
            
            const menuLinks = mainMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('active');
                    mainMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
}

// Inicializar quando a página carregar
let ticketsManager;
document.addEventListener('DOMContentLoaded', () => {
    ticketsManager = new TicketsManager();
});