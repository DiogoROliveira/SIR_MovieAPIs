document.addEventListener("DOMContentLoaded", function() {

const movieResults = document.getElementById("movieResults");

// defined in config.js
const TMDB_API_KEY = myconfig.MY_KEY;

// number of movies to display
const NUMBER_OF_MOVIES = 40;


const searchIcon = document.getElementById('searchIcon'); // ID do ícone de busca
const searchInput = document.getElementById('searchInput'); // ID do campo de texto
const searchBtn = document.getElementById('searchBtn'); // ID do novo ícone de busca
const closeBtn = document.getElementById('closeBtn'); // ID do botão de fechar

// Evento para mostrar e expandir o campo de texto ao clicar no ícone
searchIcon.addEventListener('click', function() {
    searchInput.style.display = 'block'; // Mostra o campo de texto
    searchInput.classList.toggle('expanded'); // Expande ou contrai
    searchInput.focus(); // Foca no campo de texto
    searchIcon.style.display = 'none'; // Oculta o ícone da lupa
    closeBtn.style.display = 'block'; // Mostra o ícone de fechar à esquerda
    searchBtn.style.display = 'block'; // Mostra o ícone de busca à direita
});

// Evento para buscar filmes quando o usuário pressiona Enter ou clica no ícone
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const query = searchInput.value; // Obtém o valor do campo de texto
        console.log('Searching for:', query); // Log para depuração (opcional)
        getMovies(query); // Chama a função de busca passando a consulta
    }
});

searchBtn.addEventListener('click', function() {
    const query = searchInput.value; // Obtém o valor do campo de texto
    console.log('Searching for:', query); // Log para depuração (opcional)
    getMovies(query); // Chama a função de busca passando a consulta
});

// Evento para fechar o campo de texto ao clicar no ícone "X"
closeBtn.addEventListener('click', function() {
    searchInput.value = ''; // Limpa o campo de texto
    searchInput.style.display = 'none'; // Oculta o campo de texto
    searchIcon.style.display = 'block'; // Mostra o ícone da lupa novamente
    closeBtn.style.display = 'none'; // Oculta o ícone de fechar
    searchBtn.style.display = 'none'; // Oculta o ícone de busca
});

// Adicionei um event listener para o botão de mudar light e dark mode
const toggle = document.querySelector(".toggle");
const body = document.body;

// check if dark mode is enabled in local storage
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}


toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // save dark mode status in local storage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});


function getMovies() {
    const query = document.getElementById("searchInput").value;
    console.log(query);
    console.log(TMDB_API_KEY);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            console.log(data);
            showMovies(data);  // chama showMovies para mostrar os filmes
        })
        .catch((error) => { console.log("Error fetching data: ", error); });

}

function showMovies(data) {
    // Limpar resultados anteriores
    movieResults.innerHTML = '';

    // Verificar se há resultados
    if (data.results.length === 0) {
        movieResults.innerHTML = '<p>No movies found.</p>';
        return;
    }

    // Loop pelos filmes e criar a estrutura de lista para cada filme
    data.results.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item'); // Classe para estilo da lista

        // Poster do filme (usar imagem padrão se não houver poster)
        const img = document.createElement('img');
        if (movie.poster_path) {
            // Se houver poster, usa a imagem do TMDB
            img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        } else {
            // Se não houver poster, usa a imagem placeholder especificada
            img.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
            img.classList.add('no-poster');  // Adiciona uma classe para um estilo específico
        }
        img.alt = movie.title;
      
        movieItem.appendChild(img);

        movieItem.addEventListener('click', () => {
            window.location.href = `/public/movie.html?id=${movie.id}`;
        });

        // Detalhes do filme (título e descrição)
        const movieDetails = document.createElement('div');
        movieDetails.classList.add('movie-details'); // Classe para os detalhes do filme


        const title = document.createElement('h3');
        title.textContent = movie.title;
        movieDetails.appendChild(title);

        // Descrição (usar mensagem padrão se não houver descrição)
        const description = document.createElement('p');
        description.textContent = movie.overview || 'No description available.';
        movieDetails.appendChild(description);

        // Adiciona os detalhes e a imagem ao item da lista
        movieItem.appendChild(movieDetails);

        // Linha de separação
        const separator = document.createElement('hr');
        movieItem.appendChild(separator);

        // Adiciona o item completo na seção de resultados
        movieResults.appendChild(movieItem);
    });
}


});