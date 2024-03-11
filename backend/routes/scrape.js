// server/scrape.js

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeNewsContent(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract news content from HTML using Cheerio selectors
    const newsContent = $('.article-content').text(); // Adjust the selector according to the structure of the news page

    return newsContent;
  } catch (error) {
    console.error('Error scraping news content:', error);
    return null;
  }
}

module.exports = scrapeNewsContent;
