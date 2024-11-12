document.addEventListener("DOMContentLoaded",async function () {
    const TMDB_API_KEY = myconfig.MY_KEY;

    let popularMoviesList = [];

    async function fetchMovies(category, containerId, filterList = []) {
        try {

            const response = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            const data = await response.json();

            if (category === 'popular') {
                popularMoviesList = data.results.map(movie => movie.id);
            }

            displayMovies(data, containerId, filterList);

        } catch(error) {
            console.error('Error fetching data:', error);
        } 
    }

    function displayMovies(data, containerId, filterList = []) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        data.results
            .filter(movie => !filterList.includes(movie.id)) 
            .slice(0, 6) 
            .forEach(movie => {
                const moviePoster = `
                    <a href="/movie.html?id=${movie.id}" class="movie-poster-link">
                    <div class="movie-poster">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                    </div>
                `;
                container.innerHTML += moviePoster;
            });
    }

    await fetchMovies('popular', 'popularMovies');    
    await fetchMovies('upcoming', 'upcomingMovies', popularMoviesList);
    await fetchMovies('top_rated', 'topRatedMovies');
});


