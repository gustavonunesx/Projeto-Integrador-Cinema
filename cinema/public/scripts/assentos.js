document.addEventListener('DOMContentLoaded', function() {
    const seatsMap = document.getElementById('seats-map');
    const selectedSeatsElement = document.getElementById('selected-seats');
    const totalPriceElement = document.getElementById('total-price');
    const confirmBtn = document.getElementById('confirm-btn');
    
    const seatPrice = 25.00;
    let selectedSeats = [];
    
    // Criar assentos (20% ocupados aleatoriamente para demonstração)
    for (let i = 1; i <= 50; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        
        // Aleatoriamente definir alguns assentos como ocupados
        const isOccupied = Math.random() < 0.2;
        
        if (isOccupied) {
            seat.classList.add('occupied');
        } else {
            seat.classList.add('available');
            seat.addEventListener('click', toggleSeatSelection);
        }
        
        seat.dataset.seatNumber = i;
        seat.textContent = i;
        seatsMap.appendChild(seat);
    }
    
    function toggleSeatSelection(e) {
        const seat = e.target;
        const seatNumber = seat.dataset.seatNumber;
        
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
            selectedSeats = selectedSeats.filter(num => num !== seatNumber);
        } else {
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeats.push(seatNumber);
        }
        
        updateSummary();
    }
    
    function updateSummary() {
        selectedSeatsElement.textContent = selectedSeats.length;
        const totalPrice = (selectedSeats.length * seatPrice).toFixed(2);
        totalPriceElement.textContent = totalPrice;
    }
    
    confirmBtn.addEventListener('click', function() {
        if (selectedSeats.length === 0) {
            alert('Por favor, selecione pelo menos um assento.');
            return;
        }
        
        alert(`Compra confirmada para os assentos: ${selectedSeats.join(', ')}\nTotal: R$ ${(selectedSeats.length * seatPrice).toFixed(2)}`);
        
        // Marcar assentos como ocupados (em um sistema real, isso seria feito no backend)
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('occupied');
            seat.removeEventListener('click', toggleSeatSelection);
        });
        
        selectedSeats = [];
        updateSummary();
    });
});