// ─── GitHub releases (shared by index.html + download.html) ──────────────────
// Unauthenticated GitHub API = 60 req/hour per IP; shared carrier IPs (CGNAT)
// hit that fast. Always fetch fresh; keep a trimmed copy to fall back to on error.
function fetchReleases() {
  var KEY = 'invoiso_gh_releases';
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}

  // API returns max 100 releases per page; keep fetching until a short page
  function fetchPage(page, acc) {
    return fetch('https://api.github.com/repos/Anooppandikashala/invoiso/releases?per_page=100&page=' + page)
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API ' + res.status);
        return res.json();
      })
      .then(function (releases) {
        acc = acc.concat(releases);
        return releases.length === 100 ? fetchPage(page + 1, acc) : acc;
      });
  }

  return fetchPage(1, [])
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
