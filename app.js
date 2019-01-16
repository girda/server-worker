const keyApi = 'f88bf2dc9a894d3f9522fe3cd8ab7c2d'
const main = document.querySelector('main')
const sourcesSelector = document.querySelector('#sourcesSelector')
const defaultSource = 'techcrunch'

window.addEventListener('load', async e => {
	updateNews()
	await updateSources()
	sourcesSelector.value = defaultSource

	sourcesSelector.addEventListener('change', e => {
		updateNews(e.target.value)
	});

	if ( 'serviceWorker' in navigator ) {
		try {
			navigator.serviceWorker.register('sw.js')
			console.log('SW registered');
		} catch (error) {
			console.log('SW reg failed')
		}
	}
});

async function updateSources() {
	const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${keyApi}`)
	const json = await res.json()

	sourcesSelector.innerHTML = json.sources
		.map(src => `<option value="${src.id}">${src.name}</option>`)
		.join('\n');
}

async function updateNews(source = defaultSource) {
	const res = await fetch(`https://newsapi.org/v2/everything?q=${source}&from=2018-12-16&sortBy=publishedAt&apiKey=${keyApi}`)
	const json = await res.json()

	main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
	return `
	<div class="article">
		<a href="${article.url}">
			<h2>${article.title}</h2>
			<img src="${article.urlToImage}" >
			<p>${article.description}</p>
		</a>
	</div>
		`
}