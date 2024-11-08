document.addEventListener("DOMContentLoaded", function() {

const movieResults = document.getElementById("movieResults");

// defined in config.js
const TMDB_API_KEY = myconfig.MY_KEY;

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

if (query) {
    getMovies(query);
}


// handles search 
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");

searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("expanded");
    searchInput.focus();
});

searchInput.addEventListener("blur", function () {
    if (searchInput.value === "") {
        searchInput.classList.remove("expanded");
    }
});

searchInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") getMovies(searchInput.value);
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


function getMovies(query) {
    
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            console.log(data);
            showMovies(data, query);  
        })
        .catch((error) => { console.log("Error fetching data: ", error); });

}


function showMovies(data, query) {
    movieResults.innerHTML = '';

    // Título "Showing results for..."
    const title = document.createElement('h2');
    title.textContent = `Showing results for "${query}"`;
    title.style.marginBottom = '20px';
    movieResults.appendChild(title);

    if (data.results.length === 0) {
        movieResults.innerHTML += '<p>No movies found.</p>';
        return;
    }

    data.results.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-card');

        const img = document.createElement('img');
        img.src = movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                  : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
        img.alt = movie.title;
        movieItem.appendChild(img);

        const movieDetails = document.createElement('div');
        movieDetails.classList.add('movie-details');

        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = `javascript:navigateToMovieDetails(${movie.id}, "${query}")`;
        titleLink.textContent = movie.title;
        title.appendChild(titleLink);

        // Adiciona o ano ao lado do título
        const year = document.createElement('span');
        year.classList.add('movie-year');
        year.textContent = ` ${new Date(movie.release_date).getFullYear()}`;
        title.appendChild(year);

        movieDetails.appendChild(title);

        const description = document.createElement('p');
        description.textContent = movie.overview || 'No description available.';
        movieDetails.appendChild(description);

        const rating = document.createElement('p');
        rating.classList.add('movie-director');
        rating.textContent = 'Avg rating: ';
        const movieRating = document.createElement('span');
        movieRating.textContent = movie.vote_average.toFixed(1) + '/10' || 'Unknown';
        rating.appendChild(movieRating);
        movieDetails.appendChild(rating);

        movieItem.appendChild(movieDetails);
        movieResults.appendChild(movieItem);

        // Adiciona um separador entre os resultados
        const separator = document.createElement('hr');
        separator.classList.add('separator');
        movieResults.appendChild(separator);
    });
}

});

function navigateToMovieDetails(movieId, query) {
    window.location.href = `/public/movie.html?id=${movieId}&query=${encodeURIComponent(query)}`;
}