# Movie Finder App


## Índice 📄
1. [Descrição do Projeto](#descrição-do-projeto-)
2. [Objetivos](#objetivos-)
3. [Autores](#autores-)
4. [Link de Publicação](#link-de-publicação-)
5. [Funcionalidades](#funcionalidades-)
6. [APIs Utilizadas](#apis-utilizadas-)
7. [Tecnologias e Bibliotecas Usadas](#tecnologias-e-bibliotecas-usadas-)
8. [Como Instalar e Configurar](#como-instalar-e-configurar-)
9. [Licencia](#licencia-)



## Descrição do Projeto 📙

O Movie Finder App foi desenvolvido no âmbito da unidade curricular SIR (Sistemas de Informação e Redes) do 3º Ano de Licenciatura em Engenharia Informática na ESTG-IPVC, com o objetivo de desenvolver uma página/app web que consuma e integre diversas RESTful APIs . A aplicação foi projetada para ser simples, intuitiva e responsiva, com foco na utilização de APIs para acessar dados de filmes populares, bem classificados, e muito mais.

## Objetivos ✅

O objetivo do projeto foi desenvolver uma aplicação que integre informações sobre filmes através de uma interface amigável, fornecendo funcionalidades como:
- Pesquisa por filmes populares.
- Exibição de detalhes sobre os filmes, incluindo título, sinopse, trailer, elenco e classificação.
- Implementação de navegação paginada para exibir grandes volumes de dados de forma eficiente.
- Visualização de trailers de filmes num *video player* embutido.
- Suporte para o modo escuro, garantindo uma melhor experiência ao usuário.

## Autores 🧑🏻‍💻

- Diogo Oliveira, nº29950
- David Reis, nº29216

## Link de Publicação 🔗

A aplicação foi publicada na plataforma Render.com. É possível encontrar a app no URL: https://sir-movieapis.onrender.com

## Funcionalidades ⚙

- **Pesquisa de Filmes**: Permite ao utilizador procurar filmes por título.
- **Filmes com Melhor Avaliação**: Página com os filmes que possuem melhor avaliação, ordenados do melhor ao pior.
- **Detalhes do Filme**: Exibe informações detalhadas como sinopse, trailer, elenco e classificação do filme.
- **Páginas de Resultados**: Navegação eficiente através de páginas com resultados paginados.
- **Modo Escuro**: Suporte para alterar o tema da aplicação para modo escuro.

## APIs Utilizadas 🧩

A aplicação utiliza várias APIs para fornecer os dados necessários para os filmes e suas informações, incluindo detalhes sobre os filmes, trailers, avaliações, e mais. As principais APIs utilizadas são:

### 1. TMDb API (The Movie Database)
- **Descrição**: A API do TMDb é utilizada para acessar informações sobre filmes, como detalhes, elenco, título e sinopse. É a principal fonte de dados para os filmes exibidos na aplicação.
- **Endereço**: [https://developer.themoviedb.org/docs/getting-started](https://developer.themoviedb.org/docs/getting-started)
- **Principais Funcionalidades**:
  - Pesquisa de filmes populares, em alta e mais avaliados.
  - Obtenção de informações detalhadas sobre um filme, incluindo título, resumo, poster, sinopse, etc.
  
### 2. YouTube Data API
- **Descrição**: A API do YouTube é utilizada para procurar trailers dos filmes diretamente no YouTube, fornecendo links e vídeos para cada filme.
- **Endereço**: [https://developers.google.com/youtube/v3](https://developers.google.com/youtube/v3)
- **Principais Funcionalidades**:
  - Procura de vídeos relacionados a filmes no YouTube, como trailers.
  - Exibição de vídeos diretamente na interface da aplicação, utilizando o URL do vídeo.
  
### 3. MDBList API (RapidAPI)
- **Descrição**: A API MDBList, disponível no RapidAPI, fornece informações adicionais sobre filmes, como avaliações do filme provenientes de várias plataformas como o Metacritic.
- **Endereço**: [https://rapidapi.com/linaspurinis/api/mdblist](https://rapidapi.com/linaspurinis/api/mdblist)
- **Principais Funcionalidades**:
  - Acesso a listas de avaliações de filmes por parte de várias plataformas de avaliação.
  
Estas APIs são integradas na aplicação através de chamadas HTTP, utilizando métodos `fetch()` para obter os dados em formato JSON, que são então processados e exibidos na interface do utilizador.

## Tecnologias e Bibliotecas Usadas 🛠

- **Node.js e Express.js**: Servem como o servidor backend para a aplicação.
- **HTML, CSS e JavaScript**: Para a construção da interface e interação com o utilizador.
- **Bootstrap 4**: Para a estruturação e estilização da interface.
- **dotenv**: Para gerir variáveis de ambiente como a chave da API do TMDb.

## Como Instalar e Configurar 💾

### Passo 1: Clonar o Repositório

Clone o repositório para o seu ambiente local:

```bash
  git clone https://github.com/DiogoROliveira/SIR_MovieAPIs.git
  cd SIR_MovieAPIs
```

### Passo 2: Instalar Dependências

Instale as dependências necessárias com o npm:

```bash
  npm install
```

### Passo 3: Configurar as Variáveis de Ambiente

Crie um ficheiro .env na raiz do projeto e adicione as seguintes variávies:

```env
  TMDB_API_KEY="YOUR_TMDB_KEY"
  YT_KEY="YOUR_YT_KEY"
  RAPID_API_KEY="YOUR_RAPID_KEY"
  PORT=(Express.js server port)
```

### Passo 4: Correr o Servidor Localmente

Execute o servidor localmente com o comando:

```bash
  npm start
```

## Licença 📝

[MIT](LICENSE) (c) 2024 Movie Finder App
