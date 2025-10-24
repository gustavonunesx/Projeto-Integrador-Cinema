create database cinema_db;
use cinema_db;


-- ================================================
-- 3. POPULAR FILMES
-- ================================================

INSERT INTO filmes (id, titulo, duracao, genero, classificacao, descricao, poster_url, banner_url, trailer_url, em_cartaz) VALUES
('duna-2', 'Duna: Parte Dois', '2h 46min', 'Ficção Científica, Aventura', '14 anos', 
'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.',
'../images/dunapt2-capa.webp', '../images/duna-banner.jpg', 'https://www.youtube.com/embed/U2Qp5pL3ovA', TRUE),

('deadpool-3', 'Deadpool & Wolverine', '2h 07min', 'Ação, Comédia', '16 anos',
'Wolverine está se recuperando quando cruza com o irreverente Deadpool. Juntos, eles formam uma equipe para enfrentar um inimigo comum.',
'../images/Deadpool_&_Wolverine_cartaz.jpg', '../images/deadpool-banner.jpg', 'https://www.youtube.com/watch?v=73_1biulkYk', TRUE),

('inside-out-2', 'Divertidamente 2', '1h 40min', 'Animação, Comédia', 'Livre',
'Riley está se adaptando à vida na adolescência quando novas emoções chegam ao quartel-general. Agora, Alegria, Tristeza, Raiva, Medo e Nojinho precisam aprender a lidar com essas novas companheiras.',
'../images/divertidamente-capa.webp', '../images/divertidamente-banner.jpg', 'https://www.youtube.com/watch?v=yAZxx8t9zig', TRUE),

('bad-boys-4', 'Bad Boys 4', '2h 15min', 'Ação, Comédia', '16 anos',
'Mike Lowrey e Marcus Burnett estão de volta em mais uma missão repleta de ação e comédia.',
'../images/badboys4.webp', '../images/badboys4-banner.jpg', 'https://www.youtube.com/watch?v=d7uEO2TsePk', TRUE),

('the-fall-guy', 'O Dublê', '2h 05min', 'Ação, Comédia', '12 anos',
'Um dublê aposentado é forçado a voltar à ativa quando o astro de um grande filme desaparece misteriosamente.',
'../images/duble-capa.jpg', '../images/duble-banner.jpg', 'https://www.youtube.com/watch?v=ZCHT7HCtikI', TRUE),

('furiosa', 'Furiosa: Uma Saga Mad Max', '2h 28min', 'Ação, Ficção Científica', '16 anos',
'A jovem Furiosa é sequestrada do Green Place of Many Mothers e precisa sobreviver em um mundo pós-apocalíptico.',
'../images/furiosa-capa.webp', '../images/furiosa-banner.jpg', 'https://www.youtube.com/watch?v=l_mkh4oRNDE', TRUE),

('godzilla-x-kong', 'Godzilla x Kong: O Novo Império', '1h 55min', 'Ação, Ficção Científica', '12 anos',
'Godzilla e Kong se unem para enfrentar uma ameaça colossal escondida no mundo humano.',
'../images/godzilla-capa.webp', '../images/godzilla-banner.jpg', 'https://www.youtube.com/watch?v=LOIMD084NlE', TRUE),

('kingdom-of-the-planet-of-the-apes', 'O Reino do Planeta dos Macacos', '2h 25min', 'Ação, Ficção Científica, Aventura', '12 anos',
'Muitos anos após o reinado de César, os macacos se tornaram a espécie dominante, vivendo em harmonia enquanto a humanidade foi reduzida a se esconder nas sombras. Quando um novo e tirânico líder macaco constrói seu império, um jovem macaco embarca em uma jornada angustiante.',
'../images/planeta-dos-macacos-capa.webp', '../images/planeta-macacos-banner.jpg', 'https://www.youtube.com/embed/XtFI7SNtVpY', TRUE),

('oppenheimer', 'Oppenheimer', '3h 00min', 'Drama, Histórico, Biografia', '14 anos',
'O físico J. Robert Oppenheimer trabalha com uma equipe de cientistas durante o Projeto Manhattan, levando ao desenvolvimento da bomba atômica. O filme explora o papel crucial de Oppenheimer como pai da bomba atômica e seu conflito moral.',
'../images/openheimer-capa.webp', '../images/openheimer-capa.webp', 'https://www.youtube.com/embed/uYPbbksJxIg', TRUE),

('barbie', 'Barbie', '1h 54min', 'Comédia, Fantasia, Aventura', '12 anos',
'Barbie vive em Barbieland, um mundo perfeito onde todos os Barbies e Kens passam os dias em festas e alegria. No entanto, quando ela começa a ter pensamentos sobre a morte e percebe que algo está errado, precisa viajar para o mundo real.',
'../images/barbie-capa.jpg', '../images/barbie-banner.jpg', 'https://www.youtube.com/embed/pBk4NYhWNMM', TRUE);

UPDATE filmes SET em_cartaz = FALSE WHERE id = 'kingdom-of-the-planet-of-the-apes';
UPDATE filmes SET em_cartaz = FALSE WHERE id = 'inside-out-2';
UPDATE filmes SET em_cartaz = FALSE WHERE id = 'furiosa';
UPDATE filmes SET em_cartaz = FALSE WHERE id = 'the-fall-guy';
UPDATE filmes SET em_cartaz = FALSE WHERE id = 'godzilla-x-kong';
UPDATE filmes SET em_cartaz = FALSE WHERE id = 'oppenheimer';

-- ================================================
-- 4. POPULAR SALAS
-- ================================================

INSERT INTO salas (nome, capacidade, tipo, ativa) VALUES
('Sala 1', 100, '2D', TRUE),
('Sala 2', 120, '3D', TRUE),
('Sala 3', 80, 'IMAX', TRUE),
('Sala VIP', 50, 'VIP', TRUE),
('Sala 4', 100, '2D', TRUE);

-- ================================================
-- 5. POPULAR SESSÕES (próximos 5 dias)
-- ================================================

-- Sessões para HOJE e próximos dias
-- Duna 2
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('duna-2', 1, CURDATE(), '14:00:00', '2D DUBLADO', 25.00, 100),
('duna-2', 2, CURDATE(), '16:30:00', '3D DUBLADO', 35.00, 120),
('duna-2', 3, CURDATE(), '19:00:00', 'IMAX DUBLADO', 45.00, 80),
('duna-2', 1, CURDATE(), '21:30:00', '2D LEGENDADO', 25.00, 100),

('duna-2', 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '2D DUBLADO', 25.00, 100),
('duna-2', 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '3D DUBLADO', 35.00, 120),
('duna-2', 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'IMAX DUBLADO', 45.00, 80);

-- Deadpool & Wolverine
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('deadpool-3', 1, CURDATE(), '15:00:00', '2D LEGENDADO', 28.00, 100),
('deadpool-3', 2, CURDATE(), '18:00:00', '3D DUBLADO', 38.00, 120),
('deadpool-3', 4, CURDATE(), '20:30:00', 'VIP DUBLADO', 50.00, 50),

('deadpool-3', 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:30:00', '2D LEGENDADO', 28.00, 100),
('deadpool-3', 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:30:00', '3D DUBLADO', 38.00, 120);

-- Divertidamente 2
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('inside-out-2', 1, CURDATE(), '13:00:00', '2D DUBLADO', 22.00, 100),
('inside-out-2', 5, CURDATE(), '15:30:00', '2D DUBLADO', 22.00, 100),
('inside-out-2', 1, CURDATE(), '17:30:00', '2D DUBLADO', 22.00, 100),

('inside-out-2', 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:30:00', '2D DUBLADO', 22.00, 100),
('inside-out-2', 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:00:00', '2D DUBLADO', 22.00, 100);

-- Bad Boys 4
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('bad-boys-4', 1, CURDATE(), '16:00:00', '2D DUBLADO', 26.00, 100),
('bad-boys-4', 2, CURDATE(), '19:30:00', '3D DUBLADO', 36.00, 120),

('bad-boys-4', 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:30:00', '2D DUBLADO', 26.00, 100);

-- Oppenheimer
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('oppenheimer', 3, CURDATE(), '14:00:00', 'IMAX LEGENDADO', 45.00, 80),
('oppenheimer', 3, CURDATE(), '18:00:00', 'IMAX LEGENDADO', 45.00, 80),

('oppenheimer', 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:30:00', 'IMAX LEGENDADO', 45.00, 80);

-- O Dublê (the-fall-guy) - Adicionando sessões
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('the-fall-guy', 4, CURDATE(), '17:00:00', 'VIP DUBLADO', 50.00, 50),
('the-fall-guy', 5, CURDATE(), '19:00:00', '2D LEGENDADO', 24.00, 100),
('the-fall-guy', 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:30:00', 'VIP DUBLADO', 50.00, 50),
('the-fall-guy', 5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:30:00', '2D LEGENDADO', 24.00, 100); -- Dia +2

-- Furiosa (furiosa) - Adicionando sessões
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('furiosa', 3, CURDATE(), '21:00:00', 'IMAX LEGENDADO', 45.00, 80),
('furiosa', 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00:00', '2D DUBLADO', 27.00, 100), -- Dia +2
('furiosa', 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:30:00', 'IMAX LEGENDADO', 45.00, 80); -- Dia +3

-- Godzilla x Kong (godzilla-x-kong) - Adicionando sessões
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('godzilla-x-kong', 2, CURDATE(), '14:30:00', '3D DUBLADO', 35.00, 120),
('godzilla-x-kong', 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', '2D DUBLADO', 25.00, 100),
('godzilla-x-kong', 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00:00', '3D DUBLADO', 35.00, 120); -- Dia +3

-- O Reino do Planeta dos Macacos (kingdom-of-the-planet-of-the-apes) - Adicionando sessões
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('kingdom-of-the-planet-of-the-apes', 1, CURDATE(), '18:30:00', '2D LEGENDADO', 25.00, 100),
('kingdom-of-the-planet-of-the-apes', 4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:00:00', 'VIP DUBLADO', 50.00, 50), -- Dia +2
('kingdom-of-the-planet-of-the-apes', 1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:00:00', '2D DUBLADO', 25.00, 100); -- Dia +4

-- Barbie (barbie) - Adicionando sessões
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('barbie', 5, CURDATE(), '14:00:00', '2D DUBLADO', 22.00, 100),
('barbie', 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', 'VIP DUBLADO', 50.00, 50),
('barbie', 5, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '16:30:00', '2D DUBLADO', 22.00, 100); -- Dia +3

-- Adicionando mais sessões para DIAS FUTUROS (Exemplos)
INSERT INTO sessoes (filme_id, sala_id, data_sessao, horario, tipo_exibicao, preco, assentos_disponiveis) VALUES
('duna-2', 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '2D DUBLADO', 25.00, 100), -- Dia +2
('deadpool-3', 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00:00', '3D DUBLADO', 38.00, 120), -- Dia +2
('bad-boys-4', 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '19:00:00', '2D LEGENDADO', 26.00, 100), -- Dia +3
('inside-out-2', 5, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '2D DUBLADO', 22.00, 100); -- Dia +4

-- ================================================
-- 6. CRIAR ASSENTOS PARA TODAS AS SESSÕES
-- ================================================

DELIMITER $$

CREATE PROCEDURE criar_assentos_sessoes()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_sessao_id BIGINT;
    DECLARE v_capacidade INT;
    DECLARE v_sala_id BIGINT;
    DECLARE i INT;
    DECLARE row_letter CHAR(1);
    DECLARE seat_number INT;
    
    DECLARE cur CURSOR FOR 
        SELECT s.id, sa.capacidade, s.sala_id 
        FROM sessoes s 
        JOIN salas sa ON s.sala_id = sa.id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_sessao_id, v_capacidade, v_sala_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Criar assentos em formato A1, A2, ... J10
        SET i = 1;
        WHILE i <= v_capacidade DO
            SET row_letter = CHAR(65 + FLOOR((i-1) / 10)); -- A, B, C, etc
            SET seat_number = ((i-1) MOD 10) + 1;
            
            INSERT INTO assentos (sessao_id, numero_assento, status)
            VALUES (v_sessao_id, CONCAT(row_letter, seat_number), 'DISPONIVEL');
            
            SET i = i + 1;
        END WHILE;
        
    END LOOP;
    
    CLOSE cur;
END$$

DELIMITER ;

-- Executar procedure
CALL criar_assentos_sessoes();

-- Remover procedure após uso
DROP PROCEDURE criar_assentos_sessoes;
