# Neighborhood Cinema - Sistema de Gestão para Cinemas de Bairro

## Descrição
Sistema para revitalizar cinemas locais: gerencia sessões, ingressos, promoções e marketing. Permite reservas online, controle de assentos, relatórios de público e campanhas promocionais. Responsivo para desktop/mobile. Sem integração de pagamentos (simula reservas).

## Benefícios
- Organização de sessões e horários.
- Venda/reserva de ingressos online/presencial.
- Promoções e fidelização (descontos, pontos).
- Análises de público (filmes/horários populares).
- Controle de assentos (evita superlotação).
- Marketing (links para redes sociais).

## Estrutura
- **cinema/**: Frontend (público e admin).
- **neighborhood-cinema/backend/**: API Node.js/Express/Sequelize (SQLite para dev).

## Setup e Execução
1. Instale dependências: `cd neighborhood-cinema/backend && npm install`.
2. Configure .env (veja abaixo).
3. Inicie servidor: `npm start` (roda em http://localhost:3000).
4. Acesse frontend: Abra `cinema/index.html` no browser (ou sirva via `npx http-server cinema` em porta 8080; API em 3000).
5. Teste: Registre user/admin via POST /api/register; login em admin.html; reserve tickets em index.html.

## Configuração .env (Backend)
DB_PATH=./db.sqlite # SQLite persistente PORT=3000 
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_isso 
NODE_ENV=development


## Funcionalidades
- **Autenticação**: POST /api/register (user/admin), POST /api/login (retorna JWT).
- **Filmes/Sessões**: GET/POST/PUT/DELETE /api/movies.
- **Ingressos**: POST /api/tickets (reserva com assentos; valida disponibilidade).
- **Promoções**: GET/POST /api/promotions; aplique em ticket via body.
- **Relatórios**: GET /api/reports (análises público).
- **Backup**: Rode `node backup.js` no backend (exporta DB para backup.json).

## Testes
- Crie movie via Postman: POST /api/movies {title: "Filme1", time: "18:00", seatsAvailable: 20}.
- Reserve: POST /api/tickets {userId:1, movieId:1, seats:[1,2], promotionId:1} (com JWT header).
- Admin: Acesse cinema/admin/admin.html, login, gerencie.

## Tecnologias
- Backend: Node.js, Express, Sequelize (SQLite), JWT, bcrypt.
- Frontend: HTML/JS/CSS vanilla (responsivo).
- Segurança: JWT auth, validações, backups manuais.

Commit e push para GitHub após setup.