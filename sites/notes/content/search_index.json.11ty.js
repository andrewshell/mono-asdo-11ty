import { DateTime } from 'luxon';
import lunr from 'lunr';
import lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support.js';
import filters from 'nunjucks/src/filters.js';

lunrStemmerSupport(lunr);

function stripLinks(md) {
  return md.replaceAll(
    new RegExp('\\[([^\\]]+)\\]\\([^\\)]+\\)', "ig"),
    '$1'
  );
}

export default class SearchIndex {
  data() {
    return {
      permalink: "/search_index.json",
      eleventyExcludeFromCollections: true
    }
  }

  render(data) {
    const response = {
      en: {
        index: null,
        store: {}
      }
    };
    const idx = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 20 });
      this.field('excerpt', { boost: 5 });
      this.field('content');

      for (let item of data.collections.all) {
        let title = item.data.title;
        let content = filters.striptags(item.content, true);
        let excerpt = filters.truncate(content, 280);
        let date = '';

        if (item.data.date) {
          date = DateTime.fromJSDate(item.data.date, "utc").toFormat("DDD");
        }
        this.add({
          id: item.url,
          title,
          content,
          excerpt
        });
        response.en.store[item.url] = {
          title,
          excerpt,
          date
        };
      }
    });

    response.en.index = idx;

    return JSON.stringify(response);
  }
}
