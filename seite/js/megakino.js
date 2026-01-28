// MEGAKino JavaScript - Nutzt die gemeinsame Datenbank aus megakino-db.js

// STATE
let movies = [...MEGAKINO_MOVIES];
let watchlist = getWatchlist();
let watchHistory = getWatchHistory();
let currentPage = 'home';
let filteredMovies = [...movies];

// DOM ELEMENTS
const moviesGrid = document.getElementById('moviesGrid');
const seriesGrid = document.getElementById('seriesGrid');
const docGrid = document.getElementById('docGrid');
const trendingGrid = document.getElementById('trendingGrid');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');
const searchInput = document.getElementById('searchInput');
const movieModal = document.getElementById('movieModal');
const playerModal = document.getElementById('playerModal');
const modalClose = document.querySelectorAll('.modal-close');
const watchlistContainer = document.getElementById('watchlistContainer');
const watchHistoryEl = document.getElementById('watchHistory');
const topRatedEl = document.getElementById('topRated');

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
	renderMovies('all');
	updateSidebar();
	setupEventListeners();
});

// EVENT LISTENERS
function setupEventListeners() {
	genreFilter.addEventListener('change', filterMovies);
	yearFilter.addEventListener('change', filterMovies);
	ratingFilter.addEventListener('change', filterMovies);
	searchInput.addEventListener('input', handleSearch);
	
	modalClose.forEach(btn => {
		btn.addEventListener('click', closeModal);
	});

	// Close modal on background click
	document.addEventListener('click', (e) => {
		if (e.target.classList.contains('modal')) {
			closeModal();
		}
	});
}

// RENDER MOVIES
function renderMovies(type = 'all') {
	const movies_data = type === 'all' ? filteredMovies : filteredMovies.filter(m => m.type === type);

	// Trending (top rated)
	if (type === 'all' || type === 'trending') {
		const trending = [...movies_data].sort((a, b) => b.rating - a.rating).slice(0, 6);
		renderGrid(trendingGrid, trending);
	}

	// Movies
	if (type === 'all' || type === 'movie') {
		const moviesOnly = movies_data.filter(m => m.type === 'movie');
		renderGrid(moviesGrid, moviesOnly);
	}

	// Series
	if (type === 'all' || type === 'series') {
		const seriesOnly = movies_data.filter(m => m.type === 'series');
		renderGrid(seriesGrid, seriesOnly);
	}

	// Documentary
	if (type === 'all' || type === 'documentary') {
		const docsOnly = movies_data.filter(m => m.type === 'documentary');
		renderGrid(docGrid, docsOnly);
	}
}

function renderGrid(grid, items) {
	grid.innerHTML = '';

	if (items.length === 0) {
		grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888f97; padding: 40px;">Keine Filme gefunden</p>';
		return;
	}

	items.forEach(movie => {
		const card = createMovieCard(movie);
		grid.appendChild(card);
	});
}

function createMovieCard(movie) {
	const card = document.createElement('div');
	card.className = 'movie-card';

	const inWatchlist = watchlist.some(m => m.id === movie.id);

	card.innerHTML = `
		<div class="movie-poster">
			<img src="${movie.image}" alt="${movie.title}">
			<div class="movie-overlay">
				<button class="btn-play" onclick="playMovie(${movie.id})">
					<span class="fal fa-play"></span> Abspielen
				</button>
			</div>
		</div>
		<div class="movie-info">
			<div class="movie-title">${movie.title}</div>
			<div class="movie-year">${movie.year}</div>
			<div class="movie-meta">
				${movie.genres.slice(0, 2).map(g => `<span class="movie-genre">${g}</span>`).join('')}
			</div>
			<div class="movie-rating">⭐ ${movie.rating}</div>
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
	const movie = movies.find(m => m.id === movieId);
	if (!movie) return;

	const inWatchlist = isInWatchlist(movie.id);

	const modalBody = document.getElementById('modalBody');
	modalBody.innerHTML = `
		<div class="modal-header">
			<div class="modal-poster">
				<img src="${movie.image}" alt="${movie.title}">
			</div>
			<div class="modal-info">
				<h2 class="modal-title">${movie.title}</h2>
				<div class="modal-meta">
					<span>📅 ${movie.year}</span>
					<span>⭐ ${movie.rating}</span>
					<span>🎬 ${movie.type === 'movie' ? 'Film' : movie.type === 'series' ? 'Serie' : 'Dokumentation'}</span>
					<span>🎭 ${movie.director}</span>
				</div>
				<p class="modal-description">${movie.description}</p>
				<p style="color: #888f97; font-size: 12px; margin-bottom: 15px;">
					<strong>Mit:</strong> ${movie.cast}
				</p>
				<div class="modal-buttons">
					<button class="btn-play" onclick="playMovie(${movie.id})">
						<span class="fal fa-play"></span> Jetzt abspielen
					</button>
					<button class="btn-add-watchlist ${inWatchlist ? 'active' : ''}" onclick="toggleWatchlist(${movie.id})">
						<span class="fal fa-bookmark"></span> ${inWatchlist ? 'In Watchlist' : 'Zur Watchlist'}
					</button>
				</div>
			</div>
		</div>
	`;

	movieModal.classList.add('active');
}

// PLAY MOVIE
function playMovie(movieId) {
	const movie = movies.find(m => m.id === movieId);
	if (!movie) return;

	// Add to watch history
	addToWatchHistory(movie);

	// Show player modal
	document.getElementById('playerTitle').textContent = movie.title;
	document.getElementById('playerDescription').textContent = movie.description;

	const videoPlayer = document.getElementById('videoPlayer');
	const drivePlayer = document.getElementById('drivePlayer');
	const youtubePlayer = document.getElementById('youtubePlayer');

	// Hide all players first
	videoPlayer.style.display = 'none';
	drivePlayer.style.display = 'none';
	youtubePlayer.style.display = 'none';

	// Determine which player to use
	if (movie.googleDriveId) {
		// Google Drive Video
		drivePlayer.src = `https://drive.google.com/file/d/${movie.googleDriveId}/preview`;
		drivePlayer.style.display = 'block';
	} else if (movie.videoUrl && movie.videoUrl.includes('youtube')) {
		// YouTube Video
		const youtubeId = movie.videoUrl.split('embed/')[1] || movie.videoUrl.split('v=')[1];
		youtubePlayer.src = `https://www.youtube.com/embed/${youtubeId}`;
		youtubePlayer.style.display = 'block';
	} else if (movie.videoUrl) {
		// HTML5 Video
		videoPlayer.src = movie.videoUrl;
		videoPlayer.style.display = 'block';
	} else {
		// Fallback
		alert(`Video für "${movie.title}" ist nicht verfügbar. Bitte versuchen Sie es später erneut.`);
		closeModal();
		return;
	}

	playerModal.classList.add('active');
	movieModal.classList.remove('active');
}

// ADD TO WATCH HISTORY
function addToWatchHistory(movie) {
	// Verwende die globale Funktion aus megakino-db.js
	window.addToWatchHistory(movie);
	watchHistory = getWatchHistory();
	updateSidebar();
}

// TOGGLE WATCHLIST
function toggleWatchlist(movieId) {
	const movie = movies.find(m => m.id === movieId);
	if (!movie) return;

	// Verwende die globale Funktion aus megakino-db.js
	const added = window.toggleWatchlist(movie);
	watchlist = getWatchlist();
	updateSidebar();

	// Update all buttons
	document.querySelectorAll('.btn-add-watchlist').forEach(btn => {
		const inList = isInWatchlist(movieId);
		if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`${movieId}`)) {
			btn.classList.toggle('active', inList);
			btn.innerHTML = `<span class="fal fa-bookmark"></span> ${inList ? 'In Watchlist' : 'Zur Watchlist'}`;
		}
	});
}

// UPDATE SIDEBAR
function updateSidebar() {
	// Top rated
	const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8);
	topRatedEl.innerHTML = topRated.map(m => 
		`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">
			${m.title} <span style="float: right; color: #3bb33b;">⭐${m.rating}</span>
		</a></li>`
	).join('');

	// Watch history
	if (watchHistory.length === 0) {
		watchHistoryEl.innerHTML = '<li class="empty-state">Noch nichts angesehen</li>';
	} else {
		watchHistoryEl.innerHTML = watchHistory.map(m => 
			`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">${m.title}</a></li>`
		).join('');
	}

	// Watchlist
	if (watchlist.length === 0) {
		watchlistContainer.innerHTML = '<li class="empty-state">Watchlist ist leer</li>';
	} else {
		watchlistContainer.innerHTML = watchlist.map(m => 
			`<li><a href="#" onclick="showMovieDetails(${m.id}); return false;">${m.title}</a></li>`
		).join('');
	}
}

// FILTER MOVIES
function filterMovies() {
	const genre = genreFilter.value.toLowerCase();
	const year = yearFilter.value;
	const rating = ratingFilter.value ? parseFloat(ratingFilter.value) : null;

	filteredMovies = movies.filter(movie => {
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
			} else {
				matches = matches && movie.year === parseInt(year);
			}
		}

		if (rating && movie.rating < rating) {
			matches = false;
		}

		return matches;
	});

	renderMovies('all');
}

// SEARCH
function handleSearch(e) {
	const query = e.target.value.toLowerCase();

	if (query === '') {
		filteredMovies = [...movies];
	} else {
		filteredMovies = movies.filter(movie => 
			movie.title.toLowerCase().includes(query) ||
			movie.description.toLowerCase().includes(query) ||
			movie.genres.some(g => g.toLowerCase().includes(query))
		);
	}

	renderMovies('all');
}

// CLOSE MODALS
function closeModal() {
	movieModal.classList.remove('active');
	playerModal.classList.remove('active');
	document.getElementById('videoPlayer').pause();
}

// KEYBOARD SHORTCUT (ESC to close)
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		closeModal();
	}
});

// Prevent default on Enter in search
searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
	}
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	});
});

// Hero carousel auto-rotate
let currentSlide = 1;
setInterval(() => {
	currentSlide = (currentSlide % 3) + 1;
	document.querySelectorAll('.hero-slide').forEach(slide => slide.classList.remove('active'));
	document.querySelectorAll('.hero-dot').forEach(dot => dot.classList.remove('active'));
	
	const activeSlide = document.getElementById(`heroSlide${currentSlide}`);
	if (activeSlide) {
		activeSlide.classList.add('active');
		document.querySelector(`[data-slide="${currentSlide}"]`)?.classList.add('active');
	}
}, 5000);

// Hero dots click
document.querySelectorAll('.hero-dot').forEach(dot => {
	dot.addEventListener('click', () => {
		currentSlide = parseInt(dot.dataset.slide);
		document.querySelectorAll('.hero-slide').forEach(s => s.classList.remove('active'));
		document.querySelectorAll('.hero-dot').forEach(d => d.classList.remove('active'));
		
		const activeSlide = document.getElementById(`heroSlide${currentSlide}`);
		if (activeSlide) {
			activeSlide.classList.add('active');
			dot.classList.add('active');
		}
	});
});
