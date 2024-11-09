document.addEventListener('DOMContentLoaded', async function() {
    const TMDB_API_KEY = myconfig.MY_KEY;
    const YT_KEY = myconfig.YT_KEY;
    let currentBackdropPath = null;

    const movieId = new URLSearchParams(window.location.search).get('id');

    if (movieId) {
        const movieData = await fetchMovieDetails(movieId);
        currentBackdropPath = movieData.backdrop_path;
        updateBackdrop(currentBackdropPath);
        document.getElementById('watchTrailerBtn').addEventListener('click', () => fetchMovieTrailer(movieData.title));

        fetchMovieCredits(movieId);
    }

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
        // Update poster and backdrop
        document.getElementById('poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        
        // Update content structure
        const detailsContainer = document.querySelector('.details-container');
        detailsContainer.innerHTML = `
            <h1 id="movieTitle">${data.title}</h1>
            ${data.tagline ? `<div id="tagline">${data.tagline}</div>` : ''}
            <p id="overview">${data.overview}</p>
            <div class="movie-meta">
                <strong>Release Date:</strong>
                <span>${formatDate(data.release_date)}</span>
                <strong>Rating:</strong>
                <span>${data.vote_average.toFixed(1)}/10</span>
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
        
        // Reattach event listener for trailer button
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
        backdropContainer.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${backdropPath})`;
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


        // Processa o elenco para adicionar tooltips com os personagens
        data.cast.slice(0, 7).forEach(member => {
            const castMember = document.createElement('div');
            castMember.classList.add('credit-item');
            castMember.innerText = member.name;
            castMember.setAttribute('title', `Character: ${member.character}`); // Tooltip
            castContainer.appendChild(castMember);
        });
    
        // Processa a equipe para adicionar tooltips com o trabalho
        data.crew
            .filter(member => member.job === 'Director' || member.job === 'Producer')
            .forEach(member => {
                const crewMember = document.createElement('div');
                crewMember.classList.add('credit-item');
                crewMember.innerText = member.name;
                crewMember.setAttribute('title', `Role: ${member.job}`); // Tooltip
                crewContainer.appendChild(crewMember);
            });
    
        // Adiciona as colunas ao contêiner de detalhes
        const detailsContainer = document.querySelector('.details-container');
        const creditsWrapper = document.createElement('div');
        creditsWrapper.classList.add('credits-wrapper');
        creditsWrapper.appendChild(castContainer);
        creditsWrapper.appendChild(crewContainer);
        detailsContainer.appendChild(creditsWrapper);
    }
});