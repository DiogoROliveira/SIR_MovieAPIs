document.addEventListener("DOMContentLoaded", function() {

const movieResults = document.getElementById("movieResults");

// defined in config.js
const TMDB_API_KEY = myconfig.MY_KEY;

// number of movies to display
const NUMBER_OF_MOVIES = 40;


document.getElementById("searchBtn").addEventListener("click", getMovies, false);    


function getMovies() {
    const query = document.getElementById("searchInput").value;
    console.log(query);
    console.log(TMDB_API_KEY);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => { console.log(data); })
        .catch((error) => { console.log("Error fetching data: ", error); });

    
}

function showMovies(data) {
    console.log(data);
}

});