document.addEventListener("DOMContentLoaded", function() {
    // Define RSS feed URLs
    const feeds = {
        transfermarkt: 'https://www.transfermarkt.com/rss/news',
        skysports: 'https://www.skysports.com/rss/12040',
        kooora: 'https://www.kooora.com/?rss' // Update if this URL is incorrect
    };

    // Function to fetch and display RSS feed
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
                
                container.innerHTML = ''; // Clear existing content

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

    // Function to update all feeds
    function updateAllFeeds() {
        fetchFeed(feeds.transfermarkt, 'transfermarkt');
        fetchFeed(feeds.skysports, 'skysports');
        fetchFeed(feeds.kooora, 'kooora');
    }

    // Update feeds immediately on page load
    updateAllFeeds();

    // Set an interval to update feeds every 15 minutes (900000 milliseconds)
    setInterval(updateAllFeeds, 900000); // 15 minutes in milliseconds
});
