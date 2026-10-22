// Tiny RSS proxy: fetches an allow-listed feed server-side so the browser has no CORS problem.
// Used by Netlify (/api/feed) and by server.js for local development.
const ALLOW = new Set([
  'https://www.myjoyonline.com/feed/',
  'https://3news.com/feed.xml',
  'https://citinewsroom.com/feed/',
  'https://www.ghanabusinessnews.com/feed/',
  'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://www.theguardian.com/world/rss',
  'https://feeds.bbci.co.uk/news/business/rss.xml',
  'https://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://feeds.bbci.co.uk/sport/rss.xml',
]);

exports.handler = async (event) => {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url || !ALLOW.has(url)) return { statusCode: 400, body: 'Feed not allowed' };
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NsemBlog/1.0; +news reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    const body = await r.text();
    return {
      statusCode: r.ok ? 200 : 502,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=120',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  } catch (e) {
    return { statusCode: 502, body: 'Upstream error: ' + e.message };
  }
};
