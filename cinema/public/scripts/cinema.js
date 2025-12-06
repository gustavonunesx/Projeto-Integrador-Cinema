document.addEventListener("DOMContentLoaded", () => {
    const cinemaList = document.getElementById("cinemaList");

    // Simulação de cinemas próximos
    const cinemas = [
        { nome: "CineMax Shopping Center", endereco: "Av. Paulista, 1234 - São Paulo, SP", distancia: "1.2 km" },
        { nome: "CineMax Central", endereco: "Rua XV de Novembro, 230 - São Paulo, SP", distancia: "2.8 km" },
        { nome: "CineMax Norte", endereco: "Av. dos Autonomistas, 3000 - Osasco, SP", distancia: "7.4 km" },
        { nome: "CineMax Premium", endereco: "Av. Ibirapuera, 1789 - São Paulo, SP", distancia: "5.6 km" }
    ];

    function exibirCinemas(lista) {
        cinemaList.innerHTML = "";
        lista.forEach(cinema => {
            const card = document.createElement("div");
            card.className = "cinema-card";
            card.innerHTML = `
                <h3 class="cinema-name">${cinema.nome}</h3>
                <p class="cinema-address">${cinema.endereco}</p>
                <p class="cinema-distance">Distância: ${cinema.distancia}</p>
            `;
            cinemaList.appendChild(card);
        });
    }

    // Simula carregamento
    setTimeout(() => exibirCinemas(cinemas), 1000);
});