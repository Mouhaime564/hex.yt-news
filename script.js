document.addEventListener("DOMContentLoaded", function() {
    const feeds = {
        transfermarkt: 'https://www.transfermarkt.com/rss/news',
        skysports: 'https://your-server-address/fetch_feed?url=https://www.skysports.com/rss/12040',
        kooora: 'https://your-server-address/fetch_feed?url=https://www.kooora.com/?rss',
        asharq: 'https://your-server-address/fetch_feed?url=https://www.sports.asharq.com/rss',
        marca: 'https://your-server-address/fetch_feed?url=https://e00-marca.uecdn.es/rss/en/football.xml',
        nytimes: 'https://your-server-address/fetch_feed?url=https://rss.nytimes.com/services/xml/rss/nyt/Soccer.xml'
    };

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
                let items = xml.querySelectorAll("item");
                let container = document.querySelector(`#${containerId} .news-container`);
                container.innerHTML = '';

                if (items.length === 0) {
                    container.innerHTML = "No news items found.";
                } else {
                    items.forEach(item => {
                        let title = item.querySelector("title").textContent;
                        let link = item.querySelector("link").textContent;
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
                container.innerHTML = "Failed to load news. Please try again later.";
            });
    }

    function updateAllFeeds() {
        fetchFeed(feeds.transfermarkt, 'transfermarkt');
        fetchFeed(feeds.skysports, 'skysports');
        fetchFeed(feeds.kooora, 'kooora');
        fetchFeed(feeds.asharq, 'asharq');
        fetchFeed(feeds.marca, 'marca');
        fetchFeed(feeds.nytimes, 'nytimes');
    }

    // Update feeds immediately on page load
    updateAllFeeds();

    // Set an interval to update feeds every 10 minutes (600000 milliseconds)
    setInterval(updateAllFeeds, 600000);

    // Reload the page every 10 minutes
    setInterval(function() {
        location.reload();
    }, 600000);

    // Button for 1-minute updates
    document.getElementById("updateButton").addEventListener("click", function() {
        setInterval(updateAllFeeds, 60000); // Update every 1 minute (60000 milliseconds)
        alert("The page will now update every 1 minute!");
    });
});
