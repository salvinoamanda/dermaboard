# DermaBoard

Sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC) para acompanhar as **internações por câncer de pele no Brasil** pelo SUS. O DermaBoard reúne dashboards com séries temporais e taxas de incidência, conteúdo informativo sobre a doença e uma área autenticada, onde cada usuário gerencia o próprio perfil e suas anotações sobre consultas.

## Sobre o projeto

Os dados vêm das internações registradas no SUS (arquivos `.dbc` do DATASUS), filtradas pelos CIDs de câncer de pele: **C43** e **D03** (melanoma) e **C44** e **D04** (não melanoma). O recorte vai de **2015 a 2025**, com informações como estado e região do paciente, sexo, raça/cor, idade, diagnóstico, caráter da internação, complexidade, óbito e valor pago.

Esses dados passam por um tratamento em R, são guardados em um banco PostgreSQL e depois consumidos pela API e pelo frontend, que mostram os resultados em dashboards.

## Estrutura do repositório

```
Dermaboard/
├── frontend/             # interface web (React + TypeScript)
├── backend/              # API REST (Node.js + Express + TypeScript)
├── time_series_reading/  # scripts de leitura, tratamento e séries temporais
├── database/             # scripts SQL do banco de dados PostgreSQL
├── LICENSE          
└── README.md
```

## Frontend (`frontend/`)

Interface web com os dashboards de internações por câncer de pele, o conteúdo informativo sobre a doença, o login e o gerenciamento de perfil e de anotações sobre consultas. Também tem a gestão de usuários, disponível para o administrador.

Os dashboards são feitos no Power BI e incorporados ao frontend por links de publicação: um público, na página de dashboards, e outro exibido apenas para usuários logados.

**Tecnologias:** React, TypeScript, Vite e React Router DOM

**Pré-requisitos**
- Node.js instalado
- Backend rodando (por padrão em `http://localhost:5000`)

**Instalação**
1. Entre na pasta: `cd frontend`
2. Instale as dependências: `npm install`
3. Troque `<url-da-api>` no código pelo endereço do seu backend (por exemplo, `http://localhost:5000`)
4. Rode em modo desenvolvimento: `npm run dev`

O servidor sobe em `http://localhost:3000` (porta configurada em `vite.config.ts`).

**Estrutura**
```
src/
├── components/   # componentes reutilizáveis (Navbar, Button, Footer, etc.)
├── pages/        # páginas da aplicação (Home, Login, Dashboards, etc.)
├── routes/       # definição das rotas
```

## Backend (`backend/`)

API REST que cuida da autenticação (JWT), do controle de acesso por perfil e do gerenciamento de usuários e de anotações sobre consultas.

**Tecnologias:** Node.js, Express, TypeScript, PostgreSQL (via `pg`, sem ORM), JWT e bcrypt (hash de senha)

**Pré-requisitos**
- Node.js instalado
- PostgreSQL com o banco `dermaboard` já criado

**Instalação**
1. Entre na pasta: `cd backend`
2. Instale as dependências: `npm install`
3. Copie o `.env.example` para `.env` e preencha com as suas credenciais:
   - Windows (CMD): `copy .env.example .env`
   - Linux/Mac/Git Bash: `cp .env.example .env`
4. Rode em modo desenvolvimento: `npm run watch`

O servidor sobe em `http://localhost:5000` (ou na porta definida em `PORT`).

**Variáveis de ambiente**

| Variável | Descrição |
|---|---|
| `DB_HOST` | Endereço do banco Postgres |
| `DB_PORT` | Porta do Postgres |
| `DB_NAME` | Nome do banco de dados |
| `DB_USER` | Usuário do Postgres |
| `DB_PASSWORD` | Senha do Postgres |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT |
| `PORT` | Porta em que a API roda |

**Estrutura**
```
src/
├── config/        # conexão com o banco
├── routes/        # definição das rotas
├── controllers/   # lógica de requisição/resposta
├── services/      # regras de negócio
├── middlewares/   # autenticação e autorização
└── models/        # queries SQL
```

## Análise de dados em R (`time_series_reading/`)

Scripts que fazem o trabalho com os dados antes de chegarem ao sistema.

**`dermaboard_data_reading.R`** (leitura e tratamento das internações)
- Lê os arquivos `.dbc` do DATASUS em **lotes (blocos) de estados**: foram 9 blocos, de 132 a 660 arquivos cada
- Seleciona só os campos necessários e filtra os CIDs **C43, C44, D03 e D04**
- Junta com a tabela de CIDs para trazer a descrição dos diagnósticos
- Padroniza os valores e cria as colunas de **estado** e **região**
- Separa os registros de **2015 a 2025** dos de **outros anos**
- Salva em CSV e grava no PostgreSQL

**`dermaboard_temporal_series.R`** (séries temporais e taxas de incidência)
- Busca a **população por estado** no IBGE (SIDRA e planilhas de projeção), de 2015 a 2025
- Classifica as internações em **melanoma** ou **não melanoma**
- Transforma cada categoria (sexo, raça/cor, óbito, caráter da internação, complexidade, diagnóstico e outras) em **contagens diárias**, nos níveis nacional, estado e região
- Calcula valor total e médio, permanência média e idade média por dia
- Calcula a **taxa de incidência por 100 mil habitantes** por ano, para estados, regiões e Brasil

**Pacotes:** `read.dbc`, `dplyr`, `tidyr`, `lubridate`, `readxl`, `foreign`, `DBI`, `RPostgres`, `sidrar`

**Antes de rodar**
- Os scripts pedem a **senha do banco** em uma janela, então ela não fica salva no código
- Troque os *placeholders* pelos seus valores:
  - `your-host`, `your-port` e `your-user`: dados de conexão do seu PostgreSQL
  - `<caminho/da/pasta>` e `<caminho/da/pasta/arquivo>`: caminhos da sua máquina
- Os arquivos de entrada **não estão no repositório** e precisam ser baixados separadamente:
  - Arquivos `.dbc` de internações hospitalares do SUS (DATASUS)
  - Tabela de CIDs em planilha, com a aba `CID-10-SUBCATEGORIAS`
  - Planilhas de população do IBGE: projeção da população (2023) e estimativas de 2024 e 2025, com a aba `BRASIL E UFs`

## Banco de dados (`database/`)

Scripts SQL do banco PostgreSQL `dermaboard`.

**`dermaboard_db.sql`** cria as tabelas:

| Tabela | Para que serve |
|---|---|
| `users` | Usuários do sistema: nome, e-mail, senha (hash), foto, se está ativo, datas e se é administrador |
| `search_history` | Histórico de anotações sobre as consultas de cada usuário |
| `skin_cancer_records` | Internações por câncer de pele de **2015 a 2025** |
| `skin_cancer_records_other_years` | Mesma estrutura, para internações **fora** de 2015–2025 |
| `skin_cancer_annual_rates` | Casos, população e taxa de incidência por 100 mil habitantes, por ano, estado, região e Brasil |

**`home_page_indicators.sql`** calcula os indicadores da página inicial para o Brasil:
- **Projeção de casos** para o próximo ano (casos do último ano + média do aumento anual dos últimos 5 anos)
- **Média anual de óbitos**
- **Incidência mais recente** por 100 mil habitantes

A tabela `skin_cancer_time_series` (séries temporais diárias) **não** é criada pelo SQL: ela é gerada pelo script `dermaboard_temporal_series.R`. Por isso `home_page_indicators.sql` só funciona depois de rodar esse script.

## Como rodar

1. Crie o banco `dermaboard` no PostgreSQL e execute `database/dermaboard_db.sql`.
2. Carregue os dados rodando `time_series_reading/dermaboard_data_reading.R` (uma vez por bloco) e depois `time_series_reading/dermaboard_temporal_series.R`.
3. Suba o backend, seguindo a seção **Backend**.
4. Suba o frontend, seguindo a seção **Frontend**.

## Observações

- Este repositório é uma versão para apresentação do TCC. Senhas, chaves e endereços reais foram removidos e substituídos por *placeholders* (valores de exemplo). Para rodar o projeto, substitua pelos seus próprios valores.
- Os links dos dashboards do Power BI foram mantidos no código, para que seja possível visualizá-los.
- Os arquivos de dados brutos (`.dbc` do DATASUS e planilhas de população do IBGE) não estão incluídos por causa do tamanho.