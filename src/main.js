document.addEventListener("DOMContentLoaded", function() {

const movieResults = document.getElementById("movieResults");

// defined in config.js
const TMDB_API_KEY = myconfig.MY_KEY;

// number of movies to display
const NUMBER_OF_MOVIES = 40;

// handles search 
document.getElementById("searchBtn").addEventListener("click", getMovies, false);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if(e.key === "Enter") getMovies();
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

    // Loop através dos resultados e criar elementos para cada filme
    data.results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Adicionar imagem do filme
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        img.alt = movie.title;

        movieCard.addEventListener('click', () => {
            window.location.href = `/public/movie.html?id=${movie.id}`;
        });

        movieCard.appendChild(img);

        // Adicionar título do filme
        const title = document.createElement('h3');
        title.textContent = movie.title;
        movieCard.appendChild(title);

        // Adicionar o card à seção de resultados
        movieResults.appendChild(movieCard);
    });
}

});