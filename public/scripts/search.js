document.addEventListener("DOMContentLoaded", function() {

    const movieResults = document.getElementById("movieResults");
    
    const TMDB_API_KEY = myconfig.MY_KEY;
    
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const currentPage = parseInt(urlParams.get('page')) || 1;
    if (query) {
        getMovies(query, currentPage);
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
            titleLink.href = `javascript:navigateToMovieDetails(${movie.id}, "${query}", ${data.page})`;
            img.addEventListener('click', () => {
                navigateToMovieDetails(movie.id, query, data.page);
            })
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
    
        // Exibe a paginação
        showPagination(data);
    }
    
    function showPagination(data) {

        const paginationContainer = document.getElementById("pagination");
    
    
        paginationContainer.innerHTML = '';
    
        // Adiciona as páginas
        for (let i = 1; i <= data.total_pages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
            
            // Verifica se é a página atual e adiciona uma classe diferente
            if (i === data.page) {
                pageButton.classList.add('active');
            }
    
            // Adiciona o evento de click para carregar os filmes da página
            pageButton.addEventListener('click', () => {
                getMovies(query, i);
            });
    
            paginationContainer.appendChild(pageButton);
        }
    }
    
    function getMovies(query, page = 1) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`;
    
        fetch(url)
            .then((response) => response.json())
            .then((data) => { 
                showMovies(data, query);
            })
            .catch((error) => { console.log("Error fetching data: ", error); });
    }
        
    
});

function goToPage(page, query) {
    window.location.href = `/public/views/search.html?query=${encodeURIComponent(query)}&page=${page}`;
}

function navigateToMovieDetails(movieId, query, page) {
    window.location.href = `/public/views/movie.html?id=${movieId}&query=${encodeURIComponent(query)}&page=${page}`;
}