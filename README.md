# 🎬 Sistema de Gerenciamento de Cinema

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Maven](https://img.shields.io/badge/Maven-3.9.11-red)

Sistema completo de gerenciamento de cinema desenvolvido com Spring Boot, oferecendo funcionalidades de gestão de filmes, sessões, reservas de assentos e análise de dados (analytics).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Modelo de Dados](#modelo-de-dados)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Este é um sistema backend completo para gerenciamento de cinemas, desenvolvido como projeto educacional utilizando as melhores práticas de desenvolvimento Spring Boot. O sistema permite o gerenciamento completo de filmes, salas, sessões e reservas de assentos, além de fornecer estatísticas e análises de dados para tomada de decisões.

### Principais características:

- **API RESTful** completa e bem documentada
- **Arquitetura em camadas** (Controller, Service, Repository)
- **Persistência de dados** com JPA/Hibernate
- **Validações** e tratamento de erros
- **Transações** para garantir integridade dos dados
- **Analytics** para análise de dados e relatórios
- **CORS configurado** para integração com frontend

## ✨ Funcionalidades

### 🎥 Gestão de Filmes
- Listar todos os filmes cadastrados
- Filtrar filmes em cartaz
- Buscar filme por ID
- Pesquisar filmes por título
- Buscar filmes por gênero

### 🎭 Gestão de Sessões
- Listar sessões por filme e data
- Visualizar assentos disponíveis em uma sessão
- Consultar próximas sessões de um filme
- Filtrar sessões com vagas disponíveis

### 🪑 Sistema de Reservas
- Reservar assentos em sessões específicas
- Validação de disponibilidade em tempo real
- Controle de status de assentos (Disponível, Ocupado, Reservado)
- Sistema de transações para garantir consistência

### 📊 Analytics e Relatórios
- Filmes mais populares por período
- Horários mais movimentados
- Dias da semana com maior movimento
- Dashboard com resumo dos últimos 7 e 30 dias

## 🛠 Tecnologias Utilizadas

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **Spring Web** - API REST
- **Hibernate** - ORM (Object-Relational Mapping)
- **Maven** - Gerenciamento de dependências

### Banco de Dados
- **MySQL 8.0** - Sistema de gerenciamento de banco de dados

### Bibliotecas Auxiliares
- **Lombok** - Redução de código boilerplate
- **Jackson** - Serialização/Deserialização JSON
- **Spring Boot DevTools** - Ferramentas de desenvolvimento

## 🏗 Arquitetura do Sistema

O projeto segue uma arquitetura em camadas bem definida:

```
cinema-backend/
│
├── src/main/java/cimema/backend/
│   ├── controller/          # Camada de Controle (REST Controllers)
│   │   ├── AnalyticsController.java
│   │   ├── FilmeController.java
│   │   └── SessaoController.java
│   │
│   ├── service/             # Camada de Serviço (Lógica de Negócio)
│   │   ├── AnalyticsService.java
│   │   ├── FilmeService.java
│   │   └── SessaoService.java
│   │
│   ├── repository/          # Camada de Persistência (Acesso a Dados)
│   │   ├── AnalyticsRepository.java
│   │   ├── AssentoRepository.java
│   │   ├── FilmeRepository.java
│   │   ├── ReservaRepository.java
│   │   ├── SalaRepository.java
│   │   └── SessaoRepository.java
│   │
│   ├── model/               # Entidades do Domínio
│   │   ├── Assento.java
│   │   ├── Filme.java
│   │   ├── Reserva.java
│   │   ├── Sala.java
│   │   ├── Sessao.java
│   │   ├── StatusAssento.java
│   │   └── StatusReserva.java
│   │
│   ├── dto/                 # Data Transfer Objects
│   │   ├── FilmePopularDTO.java
│   │   └── HorarioMovimentoDTO.java
│   │
│   └── BackendApplication.java
│
├── src/main/resources/
│   └── application.properties
│
└── cinema_db.sql            # Script de criação e população do banco
```

### Responsabilidades das Camadas

#### **Controllers** 
Recebem requisições HTTP, validam dados de entrada e retornam respostas apropriadas. Não contêm lógica de negócio.

#### **Services**
Contêm a lógica de negócio da aplicação, orquestram operações, validam regras e coordenam múltiplos repositories.

#### **Repositories**
Interface com o banco de dados. Usam Spring Data JPA para fornecer operações CRUD e queries customizadas.

#### **Models**
Representam as entidades do domínio e suas relações. Mapeadas diretamente para tabelas do banco de dados.

#### **DTOs**
Objetos otimizados para transferência de dados, especialmente para agregações e relatórios.

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **JDK 21** ou superior
  - [Download OpenJDK](https://adoptium.net/)
  - Verifique a instalação: `java -version`

- **Maven 3.9+** (ou use o Maven Wrapper incluído)
  - [Download Maven](https://maven.apache.org/download.cgi)
  - Verifique a instalação: `mvn -version`

- **MySQL 8.0+**
  - [Download MySQL](https://dev.mysql.com/downloads/)
  - Verifique a instalação: `mysql --version`

- **Git** (para clonar o repositório)
  - [Download Git](https://git-scm.com/downloads)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Projeto-Integrador-Cinema.git
cd Projeto-Integrador-Cinema
```

### 2. Configure o banco de dados MySQL

Inicie o servidor MySQL e execute o script de criação do banco:

```bash
mysql -u root -p < cinema_db.sql
```

Ou manualmente:

```sql
-- Conecte ao MySQL
mysql -u root -p

-- Execute os comandos do arquivo cinema_db.sql
source /caminho/para/cinema_db.sql
```

O script irá:
- Criar o banco de dados `cinema_db`
- Criar todas as tabelas necessárias
- Popular com dados de exemplo (filmes, salas, sessões)
- Gerar automaticamente os assentos para cada sessão

### 3. Configure as credenciais do banco de dados

Edite o arquivo `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_db
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080
```

**⚠️ Importante:** Substitua `SUA_SENHA_AQUI` pela senha do seu usuário MySQL.

## ⚙️ Configuração

### Configurações Opcionais

#### Alterar a porta do servidor

```properties
server.port=8081
```

#### Desabilitar SQL logs (produção)

```properties
spring.jpa.show-sql=false
```

#### Configurar CORS para outros domínios

Edite as anotações `@CrossOrigin` nos controllers:

```java
@CrossOrigin(origins = {"http://seu-dominio.com", "http://localhost:3000"})
```

## 🎮 Executando o Projeto

### Usando Maven Wrapper (Recomendado)

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

### Usando Maven instalado

```bash
mvn spring-boot:run
```

### Executando o JAR compilado

```bash
# Compilar o projeto
mvn clean package

# Executar o JAR gerado
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Verificando se está funcionando

Após iniciar, você verá no console algo como:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.5.6)

...
Started BackendApplication in 3.456 seconds
```

Acesse: [http://localhost:8080/api/filmes](http://localhost:8080/api/filmes)

## 🗄 Estrutura do Banco de Dados

### Diagrama ER (Entidade-Relacionamento)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   FILMES    │         │   SESSOES    │         │    SALAS    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │───┐     │ id (PK)      │    ┌───│ id (PK)     │
│ titulo      │   │     │ filme_id (FK)│────┘   │ nome        │
│ duracao     │   │     │ sala_id (FK) │        │ capacidade  │
│ genero      │   └────→│ data_sessao  │        │ tipo        │
│ ...         │         │ horario      │        │ ativa       │
└─────────────┘         │ preco        │        └─────────────┘
                        │ ...          │
                        └──────┬───────┘
                               │
                    ┌──────────┴───────────┐
                    ↓                      ↓
            ┌───────────────┐      ┌──────────────┐
            │   ASSENTOS    │      │   RESERVAS   │
            ├───────────────┤      ├──────────────┤
            │ id (PK)       │←────┐│ id (PK)      │
            │ sessao_id(FK) │     └│ sessao_id(FK)│
            │ numero_assento│      │ assento_id(FK)│
            │ status        │      │ cpf_cliente  │
            └───────────────┘      │ data_reserva │
                                   │ status       │
                                   └──────────────┘
```

### Tabelas Principais

#### **filmes**
Armazena informações dos filmes disponíveis no cinema.

#### **salas**
Representa as salas físicas do cinema com suas capacidades e tipos.

#### **sessoes**
Eventos específicos de exibição (filme + sala + data/hora + preço).

#### **assentos**
Assentos individuais de cada sessão com seus status.

#### **reservas**
Registro das reservas feitas pelos clientes.

## 📡 Endpoints da API

### Base URL
```
http://localhost:8080/api
```

### 🎬 Filmes

#### Listar todos os filmes
```http
GET /filmes
```

**Resposta:**
```json
[
  {
    "id": "duna-2",
    "titulo": "Duna: Parte Dois",
    "duracao": "2h 46min",
    "genero": "Ficção Científica, Aventura",
    "classificacao": "14 anos",
    "descricao": "Paul Atreides se une a Chani...",
    "posterUrl": "../images/dunapt2-capa.webp",
    "emCartaz": true
  }
]
```

#### Listar filmes em cartaz
```http
GET /filmes/em-cartaz
```

#### Buscar filme por ID
```http
GET /filmes/{id}
```

**Exemplo:**
```http
GET /filmes/duna-2
```

#### Buscar filmes por título
```http
GET /filmes/buscar?titulo={titulo}
```

**Exemplo:**
```http
GET /filmes/buscar?titulo=Duna
```

### 🎭 Sessões

#### Listar sessões por filme e data
```http
GET /sessoes/filme/{filmeId}?data={data}
```

**Exemplo:**
```http
GET /sessoes/filme/duna-2?data=2025-12-10
```

**Resposta:**
```json
[
  {
    "id": 1,
    "sala": {
      "id": 1,
      "nome": "Sala 1",
      "tipo": "2D"
    },
    "dataSessao": "2025-12-10",
    "horario": "14:00:00",
    "tipoExibicao": "2D DUBLADO",
    "preco": 25.00,
    "assentosDisponiveis": 100
  }
]
```

#### Visualizar assentos de uma sessão
```http
GET /sessoes/{id}/assentos
```

**Exemplo:**
```http
GET /sessoes/1/assentos
```

**Resposta:**
```json
{
  "sessao": {
    "id": 1,
    "dataSessao": "2025-12-10",
    "horario": "14:00:00"
  },
  "assentos": [
    {
      "id": 1,
      "numeroAssento": "A1",
      "status": "DISPONIVEL"
    },
    {
      "id": 2,
      "numeroAssento": "A2",
      "status": "OCUPADO"
    }
  ],
  "assentosDisponiveis": 98
}
```

#### Reservar assento
```http
POST /sessoes/{sessaoId}/reservar?numeroAssento={numero}&cpf={cpf}
```

**Exemplo:**
```http
POST /sessoes/1/reservar?numeroAssento=A5&cpf=12345678900
```

**Resposta de Sucesso:**
```json
{
  "mensagem": "Reserva realizada com sucesso!",
  "reserva": {
    "id": 1,
    "cpfCliente": "12345678900",
    "dataReserva": "2025-12-05T10:30:00",
    "status": "CONFIRMADA"
  }
}
```

**Resposta de Erro:**
```json
"Assento já está ocupado ou reservado"
```

### 📊 Analytics

#### Filmes mais populares
```http
GET /analytics/filmes-populares?inicio={data}&fim={data}
```

**Exemplo:**
```http
GET /analytics/filmes-populares?inicio=2025-12-01&fim=2025-12-31
```

**Resposta:**
```json
{
  "periodo": "2025-12-01 a 2025-12-31",
  "totalFilmes": 5,
  "filmes": [
    {
      "titulo": "Duna: Parte Dois",
      "filmeId": "duna-2",
      "totalVendas": 150,
      "receitaTotal": 3750.00
    }
  ]
}
```

#### Horários mais movimentados
```http
GET /analytics/horarios-movimento?inicio={data}&fim={data}
```

#### Dashboard completo
```http
GET /analytics/dashboard
```

**Resposta:**
```json
{
  "filmesPopularesSemana": [...],
  "horariosPopularesMes": [...],
  "resumoPeriodo": {
    "semana": "2025-11-28 a 2025-12-05",
    "mes": "2025-11-05 a 2025-12-05"
  }
}
```

## 💡 Exemplos de Uso

### Exemplo 1: Buscar e Reservar Assento

```javascript
// 1. Buscar filmes em cartaz
fetch('http://localhost:8080/api/filmes/em-cartaz')
  .then(response => response.json())
  .then(filmes => console.log(filmes));

// 2. Buscar sessões do filme escolhido
fetch('http://localhost:8080/api/sessoes/filme/duna-2?data=2025-12-10')
  .then(response => response.json())
  .then(sessoes => console.log(sessoes));

// 3. Ver assentos disponíveis
fetch('http://localhost:8080/api/sessoes/1/assentos')
  .then(response => response.json())
  .then(dados => console.log(dados));

// 4. Reservar assento
fetch('http://localhost:8080/api/sessoes/1/reservar?numeroAssento=A5&cpf=12345678900', {
  method: 'POST'
})
  .then(response => response.json())
  .then(resultado => console.log(resultado));
```

### Exemplo 2: Gerar Relatório de Vendas

```javascript
// Buscar filmes mais vendidos do mês
const dataInicio = '2025-12-01';
const dataFim = '2025-12-31';

fetch(`http://localhost:8080/api/analytics/filmes-populares?inicio=${dataInicio}&fim=${dataFim}`)
  .then(response => response.json())
  .then(relatorio => {
    console.log('Filmes mais vendidos:', relatorio.filmes);
    console.log('Receita total do período:', 
      relatorio.filmes.reduce((acc, f) => acc + f.receitaTotal, 0)
    );
  });
```

## 🎨 Modelo de Dados

### Entidades e Relacionamentos

#### **Filme** (1:N) **Sessão**
Um filme pode ter várias sessões, mas cada sessão pertence a um único filme.

#### **Sala** (1:N) **Sessão**
Uma sala pode ter várias sessões, mas cada sessão acontece em uma única sala.

#### **Sessão** (1:N) **Assento**
Uma sessão tem vários assentos, cada assento pertence a uma sessão específica.

#### **Sessão** (1:N) **Reserva**
Uma sessão pode ter várias reservas.

#### **Assento** (1:N) **Reserva**
Um assento pode ter várias reservas ao longo do tempo (histórico).

### Enums

#### **StatusAssento**
- `DISPONIVEL` - Assento livre para reserva
- `OCUPADO` - Assento vendido/confirmado
- `RESERVADO` - Assento temporariamente reservado

#### **StatusReserva**
- `CONFIRMADA` - Reserva confirmada
- `CANCELADA` - Reserva cancelada
- `FINALIZADA` - Cliente compareceu

## 🧪 Testando a API

### Usando cURL

```bash
# Listar filmes
curl http://localhost:8080/api/filmes

# Buscar sessões
curl "http://localhost:8080/api/sessoes/filme/duna-2?data=2025-12-10"

# Reservar assento
curl -X POST "http://localhost:8080/api/sessoes/1/reservar?numeroAssento=A5&cpf=12345678900"
```

### Usando Postman/Insomnia

1. Importe a coleção de endpoints (se disponível)
2. Configure a base URL: `http://localhost:8080/api`
3. Teste cada endpoint conforme documentado

## 🐛 Troubleshooting

### Erro: "Access denied for user"
**Solução:** Verifique as credenciais no `application.properties`

### Erro: "Table doesn't exist"
**Solução:** Execute o script `cinema_db.sql` novamente

### Erro: "Port 8080 already in use"
**Solução:** Altere a porta no `application.properties` ou finalize o processo que está usando a porta 8080

### Erro: "Could not create connection to database"
**Solução:** Verifique se o MySQL está rodando: `sudo service mysql status`

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻

Desenvolvido como projeto educacional para aprendizado de Spring Boot e desenvolvimento de APIs RESTful.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

📧 Dúvidas ou sugestões? Abra uma issue!