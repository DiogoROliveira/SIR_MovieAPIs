document.addEventListener('DOMContentLoaded', function() {
    
const TMDB_API_KEY = myconfig.MY_KEY;

// div to display movie details
const movieDetails = document.getElementById('movieDetails');

// calls the function to fetch and display movie details
const movieId = getMovieId();
if (movieId) {
    fetchMovieDetails(movieId);
} else {
    document.getElementById('movieDetails').innerHTML = '<p>No movie selected. Please go back and select a movie.</p>';
}

// extracts movie id from URL
function getMovieId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); 
}


// fetches movie details from TMDB API
async function fetchMovieDetails(id) {
    
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
            document.getElementById('movieDetails').innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
        });
}

// display function
function displayMovieDetails(data) {
    const movie = data;
    const posterPath = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

    movieDetails.innerHTML = `
        <h1>${movie.title}</h1>
        <img src="${posterPath}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
    `;
}

// back button
document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = '/public/index.html';
});


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


});

