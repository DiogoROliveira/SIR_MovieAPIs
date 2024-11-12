document.addEventListener("DOMContentLoaded",async function() {

    const movieResults = document.getElementById("movieResults");
    
    let TMDB_API_KEY = null;

    
    async function getConfig() {
        const response = await fetch(`https://sir-movieapis.onrender.com/config`);
        const config = await response.json();

        TMDB_API_KEY = config.TMDB_API_KEY;
    }

    await getConfig();
    
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const currentPage = parseInt(urlParams.get('page')) || 1;
    if (query) {
        await getMovies(query, currentPage);
    }

    function showMovies(data, query) {
        movieResults.innerHTML = '';
    
        // show results for query text
        const title = document.createElement('h2');
        title.textContent = `Showing results for "${query}"`;
        title.style.marginBottom = '20px';
        movieResults.appendChild(title);
    
        if (data.results.length === 0) {
            movieResults.innerHTML += '<p>No movies found.</p>';
            return;
        }
    
        data.results.forEach(movie => {
            // create movie card
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-card');
    
            // get movie poster
            const img = document.createElement('img');
            img.src = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
            img.alt = movie.title;
            movieItem.appendChild(img);
    
            const movieDetails = document.createElement('div');
            movieDetails.classList.add('movie-details');
    
            // clickable title and image
            const title = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = `javascript:navigateToMovieDetails(${movie.id}, "${query}", ${data.page})`;
            img.addEventListener('click', () => {
                navigateToMovieDetails(movie.id, query, data.page);
            })
            titleLink.textContent = movie.title;
            title.appendChild(titleLink);
    
            // adds year of release
            const year = document.createElement('span');
            year.classList.add('movie-year');
            year.textContent = ` ${new Date(movie.release_date).getFullYear()}`;
            title.appendChild(year);
    
            movieDetails.appendChild(title);
    
            // adds description
            const description = document.createElement('p');
            description.textContent = movie.overview || 'No description available.';
            movieDetails.appendChild(description);
    
            // adds orginal title
            const ogTitle = document.createElement('p');
            ogTitle.classList.add('movie-director');
            ogTitle.textContent = 'Original Title: ';
            const ogTitleValue = document.createElement('span');
            ogTitleValue.textContent = movie.original_title || 'Unknown';
            ogTitle.appendChild(ogTitleValue);
            movieDetails.appendChild(ogTitle);
    
            movieItem.appendChild(movieDetails);
            movieResults.appendChild(movieItem);
    
            // add break line
            const separator = document.createElement('hr');
            separator.classList.add('separator');
            movieResults.appendChild(separator);
        });
    
        // pagination call
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
            pageButton.addEventListener('click', () => goToPage(page, query));
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
    
    async function getMovies(query, page = 1) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`;
    
        try {
            await fetch(url)
            .then((response) => response.json())
            .then((data) => { 
                showMovies(data, query);
            })
            .catch((error) => { console.log("Error fetching data: ", error); });
        } catch (error) {
            console.error(error);
        }
    }
        

    function goToPage(page, query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}&page=${page}`;
    }
});



function navigateToMovieDetails(movieId, query, page) {
    window.location.href = `/movie.html?id=${movieId}&query=${encodeURIComponent(query)}&page=${page}`;
}