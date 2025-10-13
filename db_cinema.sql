CREATE DATABASE cinema_db;
USE cinema_db;

-- Tabela de Filmes
CREATE TABLE filmes (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    duracao VARCHAR(20) NOT NULL,
    genero VARCHAR(100) NOT NULL,
    classificacao VARCHAR(20) NOT NULL,
    descricao TEXT,
    poster_url VARCHAR(500),
    banner_url VARCHAR(500),
    trailer_url VARCHAR(500),
    em_cartaz BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Salas
CREATE TABLE salas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    capacidade INT NOT NULL,
    tipo_sala VARCHAR(50) -- NORMAL, VIP, IMAX, etc
);

-- Tabela de Sessões
CREATE TABLE sessoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filme_id VARCHAR(50) NOT NULL,
    sala_id BIGINT NOT NULL,
    data_sessao DATE NOT NULL,
    horario TIME NOT NULL,
    tipo_exibicao VARCHAR(50), -- 2D, 3D, DUBLADO, LEGENDADO
    preco DECIMAL(10,2) NOT NULL,
    assentos_disponiveis INT NOT NULL,
    FOREIGN KEY (filme_id) REFERENCES filmes(id),
    FOREIGN KEY (sala_id) REFERENCES salas(id)
);

-- Tabela de Assentos
CREATE TABLE assentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sessao_id BIGINT NOT NULL,
    numero_assento VARCHAR(10) NOT NULL, -- A1, A2, B1, etc
    status ENUM('DISPONIVEL', 'OCUPADO', 'RESERVADO') DEFAULT 'DISPONIVEL',
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
);

-- Tabela de Reservas
CREATE TABLE reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sessao_id BIGINT NOT NULL,
    assento_id BIGINT NOT NULL,
    usuario_cpf VARCHAR(14),
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMADA', 'CANCELADA') DEFAULT 'CONFIRMADA',
    codigo_reserva VARCHAR(20) UNIQUE,
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id),
    FOREIGN KEY (assento_id) REFERENCES assentos(id)
);

-- Tabela para Analytics
CREATE TABLE analytics_filmes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filme_id VARCHAR(50) NOT NULL,
    sessao_id BIGINT NOT NULL,
    assentos_vendidos INT DEFAULT 0,
    data_registro DATE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id),
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
);