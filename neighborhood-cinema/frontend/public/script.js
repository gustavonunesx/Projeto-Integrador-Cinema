   const API_BASE = 'http://localhost:3000/api';

   // Função para carregar filmes (organização de sessões)
   async function loadMovies() {
     try {
       const res = await fetch(`${API_BASE}/movies`);
       if (!res.ok) throw new Error('Erro ao carregar filmes');
       const movies = await res.json();
       const list = document.getElementById('movies-list');
       list.innerHTML = movies.map(m => `
         <div class="movie-card">
           <h3>${m.title}</h3>
           <p>Gênero: ${m.genre || 'Não especificado'}</p>
           <p>Duração: ${m.duration} minutos</p>
           <p>Horário: ${new Date(m.showtime).toLocaleString('pt-BR')}</p>
           <p>Assentos disponíveis: ${m.seatsAvailable - m.seatsOccupied} / ${m.seatsAvailable}</p>
         </div>
       `).join('');
       
       // Preenche o select de filmes para reserva
       const select = document.getElementById('movie-select');
       select.innerHTML = movies.map(m => `<option value="${m.id}">${m.title} (${new Date(m.showtime).toLocaleString('pt-BR')})</option>`).join('');
     } catch (error) {
       alert('Erro ao carregar filmes: ' + error.message + '. Certifique-se de que o backend está rodando em http://localhost:3000');
     }
   }

   // Função para carregar promoções (promoções e fidelização)
   async function loadPromotions() {
     try {
       const res = await fetch(`${API_BASE}/promotions`);
       if (!res.ok) throw new Error('Erro ao carregar promoções');
       const promos = await res.json();
       const select = document.getElementById('promotion-select');
       select.innerHTML = `<option value="">Sem Promoção</option>` + 
         promos.map(p => `<option value="${p.id}">${p.name} (${(p.discount * 100).toFixed(0)}% off) - ${p.description || ''}</option>`).join('');
     } catch (error) {
       alert('Erro ao carregar promoções: ' + error.message);
     }
   }

   // Função para reserva de ingressos (com controle de assentos)
   document.getElementById('reserve-form').addEventListener('submit', async (e) => {
     e.preventDefault();
     const movieId = document.getElementById('movie-select').value;
     const customerName = document.getElementById('customer-name').value;
     const seatsCount = parseInt(document.getElementById('seats-count').value);
     const promotionId = document.getElementById('promotion-select').value;

     if (!movieId || !customerName || !seatsCount) {
       alert('Preencha todos os campos obrigatórios!');
       return;
     }

     // Gera assentos sequenciais simples (ex: para 2 assentos, [1,2])
     const seats = Array.from({ length: seatsCount }, (_, i) => i + 1);

     try {
       const res = await fetch(`${API_BASE}/tickets`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ movieId, seats, customerName, promotionId })
       });
       if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.error || 'Erro na reserva');
       }
       const ticket = await res.json();
       alert(`Reserva confirmada! Ticket ID: ${ticket.id}. Preço total: R$ ${(ticket.price * seats.length).toFixed(2)}. Assentos: ${seats.join(', ')}`);
       
       // Atualiza a lista de filmes para mostrar assentos ocupados
       loadMovies();
       
       // Limpa o formulário
       document.getElementById('reserve-form').reset();
       document.getElementById('seats-selection').innerHTML = ''; // Limpa seleção de assentos se houver
     } catch (error) {
       alert('Erro na reserva: ' + error.message);
     }
   });

   // Função para mostrar seleção de assentos (simples: botões para escolher)
   document.getElementById('movie-select').addEventListener('change', async (e) => {
     const movieId = e.target.value;
     if (!movieId) return;
     
     try {
       const res = await fetch(`${API_BASE}/movies/${movieId}`); // Assumindo que backend tem GET /movies/:id, mas se não, use loadMovies
       const movie = await res.json();
       const available = movie.seatsAvailable - movie.seatsOccupied;
       const seatsSelection = document.getElementById('seats-selection');
       seatsSelection.innerHTML = `
         <p>Assentos disponíveis: ${available}. Escolha até ${available} assentos.</p>
         <div id="seats-buttons"></div>
       `;
       
       // Gera botões simples para assentos (ex: 1 a 10)
       const buttonsDiv = document.getElementById('seats-buttons');
       buttonsDiv.innerHTML = '';
       for (let i = 1; i <= Math.min(10, available); i++) {
         const btn = document.createElement('button');
         btn.textContent = i;
         btn.onclick = () => {
           // Aqui você pode adicionar lógica para selecionar múltiplos, mas simples: alerta
           alert(`Assento ${i} selecionado! Use o número de assentos no form para reservar.`);
         };
         buttonsDiv.appendChild(btn);
       }
     } catch (error) {
       console.error('Erro ao carregar assentos:', error);
     }
   });

   // Seção de Fidelidade (ver e resgatar pontos)
   document.getElementById('check-points').addEventListener('click', async () => {
     const email = document.getElementById('loyalty-email').value;
     if (!email) {
       alert('Digite seu email para ver pontos!');
       return;
     }
     
     try {
       const res = await fetch(`${API_BASE}/loyalty/${email}`);
       const loyalty = await res.json();
       document.getElementById('points-display').textContent = `Você tem ${loyalty.points || 0} pontos!`;
       document.getElementById('redeem-points').style.display = loyalty.points >= 50 ? 'block' : 'none';
     } catch (error) {
       alert('Erro ao carregar pontos: ' + error.message);
     }
   });

   document.getElementById('redeem-points').addEventListener('click', async () => {
     const email = document.getElementById('loyalty-email').value;
     try {
       const res = await fetch(`${API_BASE}/loyalty/redeem`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, pointsToRedeem: 50 })
       });
       if (!res.ok) throw new Error('Não foi possível resgatar');
       const data = await res.json();
       alert(`Pontos resgatados! Restam: ${data.remainingPoints}`);
       document.getElementById('check-points').click(); // Atualiza pontos
     } catch (error) {
       alert('Erro ao resgatar: ' + error.message);
     }
   });

   // Seção de Marketing (compartilhar promoções e campanhas)
   document.getElementById('share-promo').addEventListener('click', async () => {
     try {
       // Cria uma campanha simples via API (ex: promoção de 20% off)
       const res = await fetch(`${API_BASE}/campaigns`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: 'Promo do Dia', description: 'Desconto para famílias!' })
       });
       const data = await res.json();
       
       const shareUrl = data.shareUrl;
       document.getElementById('share-link').textContent = `Link para compartilhar: ${shareUrl}`;
       
       // Compartilha via Web Share API (funciona em mobile) ou copia link
       if (navigator.share) {
         await navigator.share({
           title: 'Venha ao Cinema de Bairro!',
           text: `Assista com ${data.promotion.discount * 100}% off!`,
           url: shareUrl
         });
       } else {
         await navigator.clipboard.writeText(shareUrl);
         alert('Link copiado para a área de transferência! Compartilhe no WhatsApp ou redes sociais.');
       }
       
       // Atualiza promoções na lista
       loadPromotions();
     } catch (error) {
       alert('Erro ao criar/compartilhar promoção: ' + error.message);
     }
   });

   // Inicialização: Carrega tudo quando a página carregar
   document.addEventListener('DOMContentLoaded', () => {
     loadMovies();
     loadPromotions();
   });
   