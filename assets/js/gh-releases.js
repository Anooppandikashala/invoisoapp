// ─── GitHub releases (shared by index.html + download.html) ──────────────────
// Unauthenticated GitHub API = 60 req/hour per IP; shared carrier IPs (CGNAT)
// hit that fast. Cache a trimmed copy for 1 hour and fall back to it on error.
function fetchReleases() {
  var KEY = 'invoiso_gh_releases';
  var TTL = 3600000; // 1 hour
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (cached && Date.now() - cached.ts < TTL) return Promise.resolve(cached.data);

  return fetch('https://api.github.com/repos/Anooppandikashala/invoiso/releases?per_page=100')
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API ' + res.status);
      return res.json();
    })
    .then(function (releases) {
      var data = releases.map(function (r, i) {
        return {
          tag_name: r.tag_name,
          name: r.name,
          html_url: r.html_url,
          published_at: r.published_at,
          body: i === 0 ? r.body : '', // only latest notes are shown
          assets: (r.assets || []).map(function (a) {
            return { name: a.name, size: a.size, download_count: a.download_count, browser_download_url: a.browser_download_url };
          }),
        };
      });
      try { localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
      return data;
    })
    .catch(function (err) {
      if (cached) return cached.data; // stale beats nothing (e.g. 403 rate limit)
      throw err;
    });
}
