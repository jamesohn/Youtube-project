const collector = require('./collector'),
  cheerio = require('cheerio'),
  Pqueue = require('p-queue'),
  franc = require('franc'),
  fs = require('fs'),
  stuff = require('./stuff.js'),
  deepCopy = require('./deep-copy.js')

module.exports = class Crawler extends collector {

  async parse(url) {
    if(typeof url === 'string') {
      let crawlerOpt = deepCopy(this.config.crawlerOpt);

      Object.assign(crawlerOpt, {
        url: url
      })
      let body = this.retryRequest(crawlerOpt);
      return body
    }
    else console.log('Url type is not string');
  }

  async loc(url) {
    let body = await this.parse(url);
    let $ = cheerio.load(body);
    // Parse html
    let location = $('.country-inline');
    // Delete white space
    let locationText = location.text().trim()

    return locationText
  }

  async langDetect(text) {
    if(typeof text === 'string') return franc(text, {minLength: 3});
    else console.log('Input text is not string');
  }

  async onIdle() {
    await this.queue.onIdle()
  }

  async collect(authorchannelId, text) {
    let url = `https://www.youtube.com/channel/${authorchannelId}/about`;
    let locationText = await this.loc(url);
    let lang = await this.langDetect(text);

    return {locale: locationText, language: lang}
  }
}
