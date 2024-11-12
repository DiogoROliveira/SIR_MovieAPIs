document.addEventListener('DOMContentLoaded', async function() {
    const TMDB_API_KEY = process.env.MY_KEY;
    const YT_KEY = process.env.YT_KEY;
    const RAPID_API_KEY = process.env.RATING_KEY;
    let currentBackdropPath = null;

    const movieId = new URLSearchParams(window.location.search).get('id');

    if (movieId) {
        const movieData = await fetchMovieDetails(movieId);
        currentBackdropPath = movieData.backdrop_path;
        updateBackdrop(currentBackdropPath);
        document.getElementById('watchTrailerBtn').addEventListener('click', () => fetchMovieTrailer(movieData.title));

        await fetchMovieCredits(movieId);
        await fetchMovieRatings(movieData);
    }

    // reset backdrop when body class changes (i.e. when navigating away and back).
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateBackdrop(currentBackdropPath);
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    async function fetchMovieDetails(id) {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovieDetails(data);
        return data;
    }

    function displayMovieDetails(data) {
        // movie poster
        document.getElementById('poster').src = `https://image.tmdb.org/t/p/original${data.poster_path}`;
        
        // movie details structure
        const detailsContainer = document.querySelector('.details-container');
        detailsContainer.innerHTML = `
            <h1 id="movieTitle">${data.title}</h1>
            ${data.tagline ? `<div id="tagline">${data.tagline}</div>` : ''}
            <p id="overview">${data.overview}</p>
            <div class="movie-meta">
                <strong>Release Date:</strong>
                <span>${formatDate(data.release_date)}</span>
                <strong>Original Title:</strong>
                <span>${data.original_title}</span>
                ${data.runtime ? `
                    <strong>Runtime:</strong>
                    <span>${formatRuntime(data.runtime)}</span>
                ` : ''}
                ${data.genres?.length ? `
                    <strong>Genres:</strong>
                    <span>${data.genres.map(genre => genre.name).join(', ')}</span>
                ` : ''}
            </div>
        `;
        
        
        document.getElementById('watchTrailerBtn').addEventListener('click', () => fetchMovieTrailer(data.title));
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatRuntime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function updateBackdrop(backdropPath) {
        if (!backdropPath) return;
        const backdropContainer = document.getElementById('backdropContainer');
        backdropContainer.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
    }

    async function fetchMovieTrailer(query) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query + ' trailer')}&key=${YT_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            document.getElementById('trailerContainer').innerHTML = `
                <iframe width="100%" height="400"
                        src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                </iframe>`;
            
            const trailerModal = $('#trailerModal');
            trailerModal.modal('show');
            
            trailerModal.on('hidden.bs.modal', function () {
                document.getElementById('trailerContainer').innerHTML = '';
            });
        } else {
            console.log('No trailer found for this movie.');
        }
    }

    async function fetchMovieCredits(id) {
        try {
            const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            displayCredits(data);
        }catch (error) {
            console.error('Error fetching movie credits:', error);
        }
    }

    function displayCredits(data) {
        const castContainer = document.createElement('div');
        const crewContainer = document.createElement('div');
        castContainer.classList.add('credits-column', 'cast-column');
        crewContainer.classList.add('credits-column', 'crew-column');
    

        const castTitle = document.createElement('h3');
        castTitle.textContent = "Cast";
        castTitle.classList.add('credits-title');
        castContainer.prepend(castTitle);

        
        const crewTitle = document.createElement('h3');
        crewTitle.textContent = "Crew";
        crewTitle.classList.add('credits-title');
        crewContainer.prepend(crewTitle);


        // gets first 7 cast members
        data.cast.slice(0, 7).forEach(member => {
            const castMember = document.createElement('div');
            castMember.classList.add('credit-item');
            castMember.innerText = member.name;
            castMember.setAttribute('title', `Character: ${member.character}`); // tooltip
            castContainer.appendChild(castMember);
        });
    
        //gets directors and producers
        data.crew
            .filter(member => member.job === 'Director' || member.job === 'Producer')
            .forEach(member => {
                const crewMember = document.createElement('div');
                crewMember.classList.add('credit-item');
                crewMember.innerText = member.name;
                crewMember.setAttribute('title', `Role: ${member.job}`); // tooltip
                crewContainer.appendChild(crewMember);
            });
    
        
        const detailsContainer = document.querySelector('.details-container');
        const creditsWrapper = document.createElement('div');
        creditsWrapper.classList.add('credits-wrapper');
        creditsWrapper.appendChild(castContainer);
        creditsWrapper.appendChild(crewContainer);
        detailsContainer.appendChild(creditsWrapper);
    }

    async function fetchMovieRatings(movieData) {
        const imdbId = movieData.imdb_id;

            const url = `https://mdblist.p.rapidapi.com/?i=${imdbId}`;
            console.log(url);
            const options = {
                method: 'GET',
	            headers: {
		            'x-rapidapi-key': RAPID_API_KEY,
		            'x-rapidapi-host': 'mdblist.p.rapidapi.com'
	            }
            }
        
        try {
            const response = await fetch(url, options);
            const data = await response.text();

            if(!data && response.status === 429){
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        
            displayRatings(data);
        } catch (error) {
            console.error('Error fetching movie ratings:', error);
        }
    }

    function displayRatings(data) {
        const ratingsList = document.getElementById('ratingsList');
        ratingsList.innerHTML = ''; 
    
        data = JSON.parse(data);

        const ratingsData = data.ratings || [];

        if (ratingsData.length === 0) {
            const noRatingsMessage = document.createElement('p');
            noRatingsMessage.textContent = 'No ratings found for this movie.';
            ratingsList.appendChild(noRatingsMessage);
            return;
        }

        const validScores = ratingsData
        .filter(rating => rating.score > 0)
        .map(rating => rating.score);

        // calculate avg rating
        const totalScore = validScores.reduce((acc, score) => acc + score, 0);
        const averageRating = validScores.length ? (totalScore / validScores.length).toFixed(1) : 'N/A';

        // creates list item and adds each rating to list
        ratingsData.forEach(rating => {
            if (rating.score > 0 && rating.score) {

                switch (rating.source) {
                    case 'imdb':
                        rating.source = 'IMDb';
                        break;
                    case 'tomatoes':
                        rating.source = 'Rotten Tomatoes';
                        break;
                    case 'metacritic':
                        rating.source = 'Metacritic';
                        break;
                    case 'metacriticuser':
                        rating.source = 'Metacritic User';
                        break;
                    case 'tmdb':
                        rating.source = 'TMDb';
                        break;
                    case 'tomatoesaudience':
                        rating.source = 'Rotten Tomatoes Audience';
                        break;
                    case 'letterboxd':
                        rating.source = 'Letterboxd';
                        break;
                    case 'trakt':
                        rating.source = 'Trakt';
                        break;
                    default:
                        rating.source = rating.source;
                        break;
                }

                const ratingItem = document.createElement('li');
                ratingItem.classList.add('rating-item');
                ratingItem.innerHTML = `<span class="rating-source">${rating.source}:</span> <span class="rating-score">${(rating.score / 10).toFixed(1)}</span>`;
                ratingsList.appendChild(ratingItem);
            }
        });

        // adds avg rating to list
        const averageItem = document.createElement('li');
        averageItem.classList.add('rating-item');
        averageItem.innerHTML = `<span class="rating-source">Average Rating:</span> <span class="rating-score">${(averageRating / 10).toFixed(1)}</span>`;
        ratingsList.appendChild(averageItem);
       
    }
});