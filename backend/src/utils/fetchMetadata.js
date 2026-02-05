/**
 * URL Metadata Fetcher
 * Extracts title from URLs for bookmarks
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch metadata (title) from a URL
 * @param {string} url - URL to fetch metadata from
 * @returns {Promise<string>} Page title or empty string
 */
const fetchMetadata = async (url) => {
    try {
        const fetchUrl = url.startsWith('http') ? url : 'https://' + url;

        const response = await axios.get(fetchUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NotesBookmarksBot/1.0)'
            }
        });

        const $ = cheerio.load(response.data);

        // Try Open Graph title first, then regular title
        const title = $('meta[property="og:title"]').attr('content')
            || $('title').text()
            || '';

        return title.trim().substring(0, 300);
    } catch (error) {
        console.error(`Failed to fetch metadata for ${url}:`, error.message);
        return '';
    }
};

module.exports = fetchMetadata;
