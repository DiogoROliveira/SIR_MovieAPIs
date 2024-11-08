document.addEventListener('DOMContentLoaded', function() {
    const TMDB_API_KEY = myconfig.MY_KEY;
    const movieDetails = document.getElementById('movieDetails');

    // Obter o ID do filme e a query da URL
    const movieId = getMovieId();
    const searchQuery = getSearchQuery();
    const currentPage = parseInt(getCurrentPage());



    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        movieDetails.innerHTML = '<p>No movie selected. Please go back and select a movie.</p>';
    }


    function getMovieId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id'); 
    }

    
    function getSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('query'); 
    }

    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('page'); 
    }

    // Função para buscar os detalhes do filme
    async function fetchMovieDetails(id) {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data);
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                movieDetails.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
            });
    }

    // Exibir os detalhes do filme
    function displayMovieDetails(data) {
        const movie = data;
        const posterPath = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        const backdropPath = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;

        movieDetails.innerHTML = `
            <h1>${movie.title}</h1>
            <img src="${posterPath}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
        `;
    }

    // Botão "Voltar"
    document.getElementById('backBtn').addEventListener('click', function() {
        if (searchQuery) {
            window.location.href = `/public/views/search.html?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
        } else {
            window.location.href = '/public/views/search.html';
        }
    });

});

