document.addEventListener('DOMContentLoaded', async function() {
    
    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    if(currentPage >= 1) {
        await fetchPopularMovies(currentPage);    
    }

    async function fetchPopularMovies(page) {

        const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            displayTopRated(data);
        } catch(error) {
            console.error('Error fetching data:', error);
        }
    }


    function displayTopRated(data) {
        const movieResults = document.getElementById('topratedMovies');
        movieResults.innerHTML = '';
    
        if (data.results.length === 0) {
            movieResults.innerHTML += '<p>No movies found.</p>';
            return;
        }
    
        data.results.forEach((movie, index) => {
            // var to store index of movie positions
            const globalIndex = (data.page - 1) * data.results.length + index + 1;
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-card');
            movieItem.innerHTML = `
                <div class="movie-poster">
                    <a href="/movie.html?id=${movie.id}" class="movie-poster-link">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <span class="movie-rank">${globalIndex}.</span>
                    <h5 class="movie-title">${movie.title}</h5>
                    <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
                </div>
            `;
            movieResults.appendChild(movieItem);
        });
    
        showPagination(data);
    }

    function showPagination(data) {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = '';
    
        const totalPages = data.total_pages;
        const currentPage = data.page;
        const maxVisiblePages = 5;  
    
        // create button function
        function createPageButton(page, isActive = false) {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.classList.add('pagination-button');
            if (isActive) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => goToPage(page));
            paginationContainer.appendChild(pageButton);
        }
    
        // creates 1st page button
        createPageButton(1, currentPage === 1);
    
        // sets interval between pages and adds buttons for them
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
    
        // shows 
        if (currentPage <= 2) {
            endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);
        } else if (currentPage >= totalPages - 1) {
            startPage = Math.max(2, endPage - maxVisiblePages + 2);
        }
    
        // add "..." if there is a gap between the start page and the first page
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    
        // adds buttons to the pages available
        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i, i === currentPage);
        }
    
        // add "..." if there is a gap between the last page and the end page
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    
        // add last page
        if (totalPages > 1) {
            createPageButton(totalPages, currentPage === totalPages);
        }
    }
      
    function goToPage(page) {
        window.location.href = `/toprated.html?&page=${page}`;
    }

});