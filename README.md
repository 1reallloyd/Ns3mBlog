# NsemBlog – live Ghana, Nigeria & world news

The live site entry point is `public/index.html`. The older standalone page is kept in `archive/blog-live.html` for reference.

## Run locally (needs Node 18+)
    node server.js
Open the URL printed in the terminal. The server uses port 8080 by default and tries the next port if 8080 is already in use.

## Deploy on Netlify
Drag this whole folder onto https://app.netlify.com/drop (or connect it to a Git repo).
`netlify.toml` publishes `public/` and exposes the feed proxy at `/api/feed`.

## Add or change a feed
1. Edit the `SOURCES` list in `public/index.html`.
2. Add the same URL to `ALLOW` in `netlify/functions/feed.js` (the proxy only fetches allow-listed feeds).
