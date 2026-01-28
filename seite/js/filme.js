// Filme.html - Alle Filme Seite

const moviesGrid = document.getElementById('moviesGrid');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const movieModal = document.getElementById('movieModal');
const playerModal = document.getElementById('playerModal');
const modalClose = document.querySelectorAll('.modal-close');

let currentMovies = [...MEGAKINO_MOVIES];
let filteredMovies = [...MEGAKINO_MOVIES];

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
	renderMovies(filteredMovies);
	updateSidebar();
	setupEventListeners();
});

// EVENT LISTENERS
function setupEventListeners() {
	genreFilter.addEventListener('change', applyFilters);
	yearFilter.addEventListener('change', applyFilters);
	ratingFilter.addEventListener('change', applyFilters);
	sortFilter.addEventListener('change', applySort);
	searchInput.addEventListener('input', handleSearch);

	modalClose.forEach(btn => {
		btn.addEventListener('click', closeModal);
	});

	document.addEventListener('click', (e) => {
		if (e.target.id === 'movieModal' || e.target.id === 'playerModal') {
			closeModal();
		}
	});

	// Keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeModal();
	});
}

// RENDER MOVIES
function renderMovies(movies) {
	moviesGrid.innerHTML = '';

	if (movies.length === 0) {
		moviesGrid.innerHTML = `
			<div style="grid-column: 1/-1; text-align: center; color: #a0a0a0; padding: 60px 20px;">
				<p style="font-size: 18px; margin-bottom: 10px;">🔍 Keine Filme gefunden</p>
				<p style="font-size: 14px;">Versuche andere Filter oder Suchbegriffe</p>
			</div>
		`;
		return;
	}

	movies.forEach(movie => {
		const card = createMovieCard(movie);
		moviesGrid.appendChild(card);
	});
}

function createMovieCard(movie) {
	const card = document.createElement('div');
	card.className = 'movie-card';

	const inWatchlist = isInWatchlist(movie.id);
	const ratingColor = movie.rating >= 8.5 ? '#ffb84d' : movie.rating >= 7 ? '#ff6b35' : '#a0a0a0';

	card.innerHTML = `
		<div class="movie-poster">
			<img src="${movie.image}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/180x270?text=${encodeURIComponent(movie.title)}&bg=2d2d2d&fg=fff'">
			<div class="movie-overlay">
				<button class="btn-play" onclick="playMovie(${movie.id}); return false;">
					<span class="fal fa-play"></span> Abspielen
				</button>
			</div>
			<div class="movie-year-badge">${movie.year}</div>
		</div>
		<div class="movie-info">
			<div class="movie-title" title="${movie.title}">${movie.title}</div>
			<div class="movie-rating" style="color: ${ratingColor};">⭐ ${movie.rating} <span style="font-size: 10px; color: #707070;">(${movie.rating_count.toLocaleString()})</span></div>
			<div class="movie-meta">
				${movie.genres.slice(0, 2).map(g => `<span class="movie-genre">${g}</span>`).join('')}
			</div>
		</div>
	`;

	card.addEventListener('click', (e) => {
		if (!e.target.closest('.btn-play')) {
			showMovieDetails(movie.id);
		}
	});

	return card;
}

// SHOW MOVIE DETAILS
function showMovieDetails(movieId) {
	const movie = MEGAKINO_MOVIES.find(m => m.id === movieId);
	if (!movie) return;

	const inWatchlist = isInWatchlist(movie.id);

	const modalBody = document.getElementById('modalBody');
	modalBody.innerHTML = `
		<div class="modal-header">
			<div class="modal-poster">
				<img src="${movie.cover}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}&bg=2d2d2d&fg=fff'">
			</div>
			<div class="modal-info">
				<h2 class="modal-title">${movie.title}</h2>
				<p class="modal-tagline">"${movie.tagline}"</p>
				<div class="modal-meta">
					<span>📅 ${movie.year}</span>
					<span>⭐ ${movie.rating}</span>
					<span>👥 ${movie.rating_count.toLocaleString()} Bewertungen</span>
				</div>
				<p style="color: #e0e0e0; font-size: 12px; margin-bottom: 15px; margin-top: 10px;">
					<strong>Regisseur:</strong> ${movie.director}
				</p>
				<p style="color: #a0a0a0; font-size: 12px; margin-bottom: 15px;">
					<strong>Mit:</strong> ${movie.cast}
				</p>
				<p class="modal-description">${movie.longDescription}</p>
				<div class="modal-buttons">
					<button class="btn-play" onclick="playMovie(${movie.id}); return false;">
						<span class="fal fa-play"></span> Jetzt abspielen
					</button>
					<button class="btn-add-watchlist ${inWatchlist ? 'active' : ''}" onclick="handleWatchlistToggle(${movie.id}); return false;">
						<span class="fal fa-bookmark"></span> ${inWatchlist ? 'In Watchlist' : 'Zur Watchlist'}
					</button>
				</div>
			</div>
		</div>
	`;

	movieModal.classList.add('active');
}

// PLAY MOVIE - Google Drive Support
function playMovie(movieId) {
	const movie = MEGAKINO_MOVIES.find(m => m.id === movieId);
	if (!movie) return;

	// Add to watch history
	addToWatchHistory(movie);
	updateSidebar();

	// Set player title
	document.getElementById('playerTitle').textContent = movie.title;
	document.getElementById('playerDescription').textContent = movie.longDescription;

	const playerContainer = document.getElementById('playerContainer');

	// Check if Google Drive ID is available
	if (movie.googleDriveId) {
		// Google Drive Player
		playerContainer.innerHTML = `
			<iframe src="https://drive.google.com/file/d/${movie.googleDriveId}/preview" 
				width="100%" height="600" allow="autoplay" style="border-radius: 8px; display: block;">
			</iframe>
		`;
	} else if (movie.videoUrl) {
		// YouTube Embed
		playerContainer.innerHTML = `
			<iframe src="${movie.videoUrl}" 
				width="100%" height="600" allow="autoplay; encrypted-media" 
				frameborder="0" allowfullscreen style="border-radius: 8px; display: block;">
			</iframe>
		`;
	} else {
		// Fallback: Video element
		playerContainer.innerHTML = `
			<video controls style="width: 100%; height: 600px; border-radius: 8px; display: block; background: #000;">
				<source src="https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4" type="video/mp4">
				Your browser does not support the video tag.
			</video>
		`;
	}

	playerModal.classList.add('active');
	movieModal.classList.remove('active');
}

// HANDLE WATCHLIST
function handleWatchlistToggle(movieId) {
	const movie = MEGAKINO_MOVIES.find(m => m.id === movieId);
	const wasAdded = toggleWatchlist(movie);
	updateSidebar();

	// Update button
	const buttons = document.querySelectorAll('.btn-add-watchlist');
	buttons.forEach(btn => {
		if (btn.onclick.toString().includes(movieId)) {
			btn.classList.toggle('active', wasAdded);
			btn.innerHTML = `<span class="fal fa-bookmark"></span> ${wasAdded ? 'In Watchlist' : 'Zur Watchlist'}`;
		}
	});
}

// APPLY FILTERS
function applyFilters() {
	const genre = genreFilter.value.toLowerCase();
	const year = yearFilter.value;
	const rating = ratingFilter.value ? parseFloat(ratingFilter.value) : null;

	filteredMovies = MEGAKINO_MOVIES.filter(movie => {
		let matches = true;

		if (genre && !movie.genres.some(g => g.toLowerCase() === genre)) {
			matches = false;
		}

		if (year) {
			if (year === '2024') {
				matches = matches && movie.year >= 2024;
			} else if (year === '2020') {
				matches = matches && movie.year >= 2020 && movie.year < 2030;
			} else if (year === '2010') {
				matches = matches && movie.year >= 2010 && movie.year < 2020;
			} else if (year === '2000') {
				matches = matches && movie.year >= 2000 && movie.year < 2010;
			} else if (year === '1990') {
				matches = matches && movie.year >= 1990 && movie.year < 2000;
			} else {
				matches = matches && movie.year === parseInt(year);
			}
		}

		if (rating && movie.rating < rating) {
			matches = false;
		}

		return matches;
	});

	applySort();
}

// APPLY SORT
function applySort() {
	const sortBy = sortFilter.value || 'trending';

	let sorted = [...filteredMovies];

	if (sortBy === 'rating') {
		sorted.sort((a, b) => b.rating - a.rating);
	} else if (sortBy === 'newest') {
		sorted.sort((a, b) => b.year - a.year);
	} else if (sortBy === 'az') {
		sorted.sort((a, b) => a.title.localeCompare(b.title));
	} else {
		// trending = by rating count
		sorted.sort((a, b) => b.rating_count - a.rating_count);
	}

	renderMovies(sorted);
}

// SEARCH
function handleSearch(e) {
	const query = e.target.value.toLowerCase();

	if (query === '') {
		applyFilters();
		return;
	}

	filteredMovies = MEGAKINO_MOVIES.filter(movie =>
		movie.title.toLowerCase().includes(query) ||
		movie.description.toLowerCase().includes(query) ||
		movie.cast.toLowerCase().includes(query) ||
		movie.director.toLowerCase().includes(query) ||
		movie.genres.some(g => g.toLowerCase().includes(query))
	);

	applySort();
}

// UPDATE SIDEBAR
function updateSidebar() {
	// Trending Today
	const trending = [...MEGAKINO_MOVIES]
		.sort((a, b) => b.rating_count - a.rating_count)
		.slice(0, 5);

	document.getElementById('trendingToday').innerHTML = trending.map((m, i) =>
		`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">
			<span style="color: #ff6b35; font-weight: bold; margin-right: 8px;">#${i + 1}</span>
			${m.title}
		</a></li>`
	).join('');

	// Top Rated
	const topRated = [...MEGAKINO_MOVIES]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 10);

	document.getElementById('topRated').innerHTML = topRated.map(m =>
		`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">
			${m.title} <span style="float: right; color: #ffb84d;">⭐${m.rating}</span>
		</a></li>`
	).join('');

	// Watch History
	const history = getWatchHistory();
	const historyEl = document.getElementById('watchHistory');

	if (history.length === 0) {
		historyEl.innerHTML = '<li class="empty-state">Noch nichts angesehen</li>';
	} else {
		historyEl.innerHTML = history.slice(0, 5).map(m =>
			`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">${m.title}</a></li>`
		).join('');
	}
}

// CLOSE MODALS
function closeModal() {
	movieModal.classList.remove('active');
	playerModal.classList.remove('active');
}

// UTILITY
function formatNumber(num) {
	return num.toLocaleString('de-DE');
}
