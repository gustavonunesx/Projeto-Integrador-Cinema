// movies-data.js
const moviesDatabase = {
    "duna-2": {
        id: "duna-2",
        title: "Duna: Parte Dois",
        duration: "2h 46min",
        genre: "Ficção Científica, Aventura",
        rating: "14 anos",
        description: "Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.",
        poster: "../images/dunapt2-capa.webp",
        banner: "../images/duna-banner.jpg",
        trailer: "https://www.youtube.com/embed/U2Qp5pL3ovA",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "deadpool-3": {
        id: "deadpool-3",
        title: "Deadpool & Wolverine",
        duration: "2h 07min",
        genre: "Ação, Comédia",
        rating: "16 anos",
        description: "Wolverine está se recuperando quando cruza com o irreverente Deadpool. Juntos, eles formam uma equipe para enfrentar um inimigo comum.",
        poster: "../images/Deadpool_&_Wolverine_cartaz.jpg",
        banner: "../images/deadpool-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=73_1biulkYk",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "inside-out-2": {
        id: "inside-out-2",
        title: "Divertidamente 2",
        duration: "1h 40min",
        genre: "Animação, Comédia",
        rating: "Livre",
        description: "Riley está se adaptando à vida na adolescência quando novas emoções chegam ao quartel-general. Agora, Alegria, Tristeza, Raiva, Medo e Nojinho precisam aprender a lidar com essas novas companheiras.",
        poster: "../images/divertidamente-capa.webp",
        banner: "../images/divertidamente-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=yAZxx8t9zig",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "bad-boys-4": {
        id: "bad-boys-4",
        title: "Bad Boys 4",
        duration: "2h 15min",
        genre: "Ação, Comédia",
        rating: "16 anos",
        description: "Mike Lowrey e Marcus Burnett estão de volta em mais uma missão repleta de ação e comédia.",
        poster: "../images/badboys4.webp",
        banner: "../images/badboys4-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=d7uEO2TsePk",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "the-fall-guy": {
        id: "the-fall-guy",
        title: "O Dublê",
        duration: "2h 05min",
        genre: "Ação, Comédia",
        rating: "12 anos",
        description: "Um dublê aposentado é forcedo a voltar à ativa quando o astro de um grande filme desaparece misteriosamente.",
        poster: "../images/duble-capa.jpg",
        banner: "../images/duble-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=ZCHT7HCtikI",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "furiosa": {
        id: "furiosa",
        title: "Furiosa: Uma Saga Mad Max",
        duration: "2h 28min",
        genre: "Ação, Ficção Científica",
        rating: "16 anos",
        description: "A jovem Furiosa é sequestrada do Green Place of Many Mothers e precisa sobreviver em um mundo pós-apocalíptico.",
        poster: "../images/furiosa-capa.webp",
        banner: "../images/furiosa-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=l_mkh4oRNDE",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "godzilla-x-kong": {
        id: "godzilla-x-kong",
        title: "Godzilla x Kong: O Novo Império",
        duration: "1h 55min",
        genre: "Ação, Ficção Científica",
        rating: "12 anos",
        description: "Godzilla e Kong se unem para enfrentar uma ameaça colossal escondida no mundo humano.",
        poster: "../images/godzilla-capa.webp",
        banner: "../images/godzilla-banner.jpg",
        trailer: "https://www.youtube.com/watch?v=LOIMD084NlE",

        sessions : [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats : [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "kingdom-of-the-planet-of-the-apes": {
        id: "kingdom-of-the-planet-of-the-apes",
        title: "Reino do Planeta dos Macacos",
        duration: "2h 25min",
        genre: "Ação, Ficção Científica, Aventura",
        rating: "12 anos",
        description: "Muitos anos após o reinado de César, os macacos se tornaram a espécie dominante, vivendo em harmonia enquanto a humanidade foi reduzida a se esconder nas sombras. Quando um novo e tirânico líder macaco constrói seu império, um jovem macaco embarca em uma jornada angustiante que o levará a questionar tudo o que sabe sobre o passado e a fazer escolhas que definirão um novo futuro para macacos e humanos.",
        poster: "../images/planeta-dos-macacos-capa.webp",
        banner: "../images/planeta-macacos-banner.jpg",
        trailer: "https://www.youtube.com/embed/XtFI7SNtVpY",
        
        sessions: [
            { date: '2023-11-15', times: ['14:00', '16:30', '19:00', '21:30'] },
            { date: '2023-11-16', times: ['14:30', '17:00', '19:30', '22:00'] },
            { date: '2023-11-17', times: ['15:00', '17:30', '20:00', '22:30'] },
            { date: '2023-11-18', times: ['13:00', '15:30', '18:00', '20:30', '23:00'] },
            { date: '2023-11-19', times: ['13:30', '16:00', '18:30', '21:00'] }
        ],

        seats: [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "oppenheimer": {
        id: "oppenheimer",
        title: "Oppenheimer",
        duration: "3h 00min",
        genre: "Drama, Histórico, Biografia",
        rating: "14 anos",
        description: "O físico J. Robert Oppenheimer trabalha com uma equipe de cientistas durante o Projeto Manhattan, levando ao desenvolvimento da bomba atômica. O filme explora o papel crucial de Oppenheimer como 'pai da bomba atômica' e seu conflito moral com as consequências devastadoras de sua criação, enquanto enfrenta audiências de segurança durante o macarthismo.",
        poster: "../images/openheimer-capa.webp",
        banner: "../images/openheimer-capa.webp",
        trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
        
        sessions: [
            { date: '2023-11-15', times: ['14:00', '17:30', '21:00'] },
            { date: '2023-11-16', times: ['14:30', '18:00', '21:30'] },
            { date: '2023-11-17', times: ['15:00', '18:30', '22:00'] },
            { date: '2023-11-18', times: ['13:00', '16:30', '20:00'] },
            { date: '2023-11-19', times: ['13:30', '17:00', '20:30'] }
        ],

        seats: [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },
    "barbie": {
        id: "barbie",
        title: "Barbie",
        duration: "1h 54min",
        genre: "Comédia, Fantasia, Aventura",
        rating: "12 anos",
        description: "Barbie vive em Barbieland, um mundo perfeito onde todos os Barbies e Kens passam os dias em festas e alegria. No entanto, quando ela começa a ter pensamentos sobre a morte e percebe que algo está errado, precisa viajar para o mundo real para entender o que está acontecendo. Lá, descobre os desafios e as complexidades de ser humano, enquanto Ken se encanta com o conceito de patriarcado.",
        poster: "../images/barbie-capa.jpg",
        banner: "../images/barbie-banner.jpg",
        trailer: "https://www.youtube.com/embed/pBk4NYhWNMM",
        
        sessions: [
            { date: '2023-11-15', times: ['14:00', '17:30', '21:00'] },
            { date: '2023-11-16', times: ['14:30', '18:00', '21:30'] },
            { date: '2023-11-17', times: ['15:00', '18:30', '22:00'] },
            { date: '2023-11-18', times: ['13:00', '16:30', '20:00'] },
            { date: '2023-11-19', times: ['13:30', '17:00', '20:30'] }
        ],

        seats: [
            { id: 'A1', status: 'available' },
            { id: 'A2', status: 'available' },
            { id: 'A3', status: 'occupied' },
            { id: 'A4', status: 'available' },
            { id: 'A5', status: 'available' },
            { id: 'A6', status: 'occupied' },
            { id: 'A7', status: 'available' },
            { id: 'A8', status: 'available' },
            { id: 'A9', status: 'available' },
            { id: 'A10', status: 'occupied' },
            { id: 'B1', status: 'available' },
            { id: 'B2', status: 'available' },
            { id: 'B3', status: 'available' },
            { id: 'B4', status: 'occupied' },
            { id: 'B5', status: 'available' },
            { id: 'B6', status: 'available' },
            { id: 'B7', status: 'occupied' },
            { id: 'B8', status: 'available' },
            { id: 'B9', status: 'available' },
            { id: 'B10', status: 'available' }
        ]
    },

};
