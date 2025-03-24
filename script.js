document.addEventListener("DOMContentLoaded", function() {
    // Définition des flux RSS
    const feeds = {
        transfermarkt: 'https://www.transfermarkt.com/rss/news',
        uefa: 'https://www.espn.com/espn/rss/news', // UEFA via ESPN
        eyefootball: 'https://www.eyefootball.com/football_news.xml',
        bbc: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://feeds.bbci.co.uk/sport/football/rss.xml'), // BBC via proxy CORS
        footballlondon: 'https://www.football.london/?service=rss',
        espn: 'https://www.espn.com/espn/rss/news' // Ajout de ESPN News
    };

    // Fonction pour récupérer et afficher les flux RSS
    function fetchFeed(url, containerId) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                let parser = new DOMParser();
                let xml = parser.parseFromString(data, "text/xml");

                // Si BBC Sport utilise le proxy, extraire le XML correct
                if (containerId === "bbc") {
                    let jsonData = JSON.parse(data);
                    xml = parser.parseFromString(jsonData.contents, "text/xml");
                }

                let items = xml.querySelectorAll("item");
                let container = document.querySelector(`#${containerId} .news-container`);
                
                container.innerHTML = ''; // Effacer le contenu existant

                if (items.length === 0) {
                    container.innerHTML = "<p class='loading'>No news found.</p>";
                } else {
                    items.forEach(item => {
                        let title = item.querySelector("title")?.textContent || "No title";
                        let link = item.querySelector("link")?.textContent || "#";
                        let newsItem = document.createElement("div");
                        newsItem.className = "news-item";
                        newsItem.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                        container.appendChild(newsItem);
                    });
                }
            })
            .catch(error => {
                console.error(`Error fetching the RSS feed from ${url}:`, error);
                let container = document.querySelector(`#${containerId} .news-container`);
                container.innerHTML = "<p class='loading'>Failed to load news. Please try again later.</p>";
            });
    }

    // Fonction pour mettre à jour tous les flux RSS
    function updateAllFeeds() {
        Object.keys(feeds).forEach(key => {
            fetchFeed(feeds[key], key);
        });
    }

    // Mettre à jour les flux immédiatement au chargement
    updateAllFeeds();

    // Rafraîchir les flux toutes les 15 minutes
    setInterval(updateAllFeeds, 900000); // 15 minutes
});
