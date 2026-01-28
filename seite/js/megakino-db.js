// MEGAKino - Umfassende Film Datenbank

const MEGAKINO_MOVIES = [
	{
		id: 1,
		title: "Die werwölfe der düsterwald",
		year: 2024,
		genres: ["Horror", "Fantasy", "Thriller"],
		rating: 7.5,
		image: "cover/Wald.jpg",
		cover: "cover/Wald.jpg",
		description: "Eine düstere Geschichte über Werwölfe, die in den tiefen Wäldern lauern.",
		longDescription: "In einem abgelegenen Wald verschwinden Menschen unter mysteriösen Umständen. Die Wahrheit ist noch viel schrecklicher als die Legenden besagen.",
		cast: "Cast TBA",
		director: "Director TBA",
		rating_count: 2400,
		type: "movie",
		googleDriveId: "1IDA8oWAnlGNZ_RTy7Bptfxr4aLpTIIMi",
		videoUrl: "https://www.youtube.com/embed/example21",
		tagline: "Der Wald verbirgt ein dunkles Geheimnis"
	},
	{
		id: 2,
		title: "Checker Tobi 3 - Die heimliche Herrscharin der Erde",
		year: 2024,
		genres: ["Abenteuer", "Familie"],
		rating: 7.3,
		image: "cover/checkertobi3.jpg",
		cover: "cover/checkertobi3.jpg",
		description: "Checker Tobi (Tobi Krell) begibt sich zusammen mit Marina Blanke auf eine weltweite Spurensuche. Von Madagaskar bis in die Arktis sucht er die Antwort auf ein Rätsel aus seiner Kindheit: Wer hinterlässt die tiefsten Spuren im Erdreich?",
		longDescription: "Checker Tobi 3 - Die heimliche Herrscharin der Erde. Eine spannende Abenteuerreise um die Welt auf der Suche nach dem größten Geheimnis der Erde. Mit atemberaubenden Aufnahmen von der Arktis bis zu den tropischen Wäldern Madagaskars.",
		cast: "Tobi Krell, Marina Blanke",
		director: "Antonia Simm",
		rating_count: 3200,
		type: "movie",
		googleDriveId: "1G2vtddVOid_4caGBopD0FjS3IXEY24dv",
		videoUrl: "https://www.youtube.com/embed/example22",
		tagline: "Eine weltweite Spurensuche nach dem größten Geheimnis"
	},
	{
		id: 3,
		title: "Five Nights at Freddy's 2",
		year: 2025,
		genres: ["Horror", "Thriller"],
		rating: 8.5,
		image: "cover/freddy2.jpg",
		cover: "cover/freddy2.jpg",
		description: "Das Grauen kehrt zurück, als Mike und Vanessa versuchen, Abby vor den neuen Animatronics zu schützen.",
		longDescription: "Five Nights at Freddy's 2 - Das Grauen kehrt zurück. Mike und Vanessa müssen sich einer noch größeren Bedrohung stellen, als sie versuchen, die junge Abby vor den gefährlichen neuen Animatronics zu beschützen. Ein intensiver Horror-Thriller mit schockerregenden Wendungen.",
		cast: "Josh Hutcherson, Piper Rubio, Elizabeth Lail",
		director: "Emma Tammi",
		rating_count: 4500,
		type: "movie",
		googleDriveId: "1GTCq_fbQUW3_Ds4LJudwesfJTNeNyM60",
		videoUrl: "https://www.youtube.com/embed/example23",
		tagline: "Das Grauen kehrt zurück - und es ist stärker denn je"
	}
];

// LOCAL STORAGE VERWALTUNG
function saveWatchlist(watchlist) {
	localStorage.setItem('megakino_watchlist', JSON.stringify(watchlist));
}

function getWatchlist() {
	return JSON.parse(localStorage.getItem('megakino_watchlist')) || [];
}

function saveWatchHistory(history) {
	localStorage.setItem('megakino_history', JSON.stringify(history));
}

function getWatchHistory() {
	return JSON.parse(localStorage.getItem('megakino_history')) || [];
}

function addToWatchHistory(movie) {
	let history = getWatchHistory();
	history = history.filter(m => m.id !== movie.id);
	history.unshift({id: movie.id, title: movie.title, timestamp: new Date().toISOString()});
	history = history.slice(0, 20);
	saveWatchHistory(history);
}

function toggleWatchlist(movie) {
	let watchlist = getWatchlist();
	const index = watchlist.findIndex(m => m.id === movie.id);
	if (index > -1) {
		watchlist.splice(index, 1);
	} else {
		watchlist.push({id: movie.id, title: movie.title, year: movie.year});
	}
	saveWatchlist(watchlist);
	return index === -1; // Returns true if added
}

function isInWatchlist(movieId) {
	return getWatchlist().some(m => m.id === movieId);
}
