/* Report this page's height to the parent frame.
   The hub on MajesticAdvising.com shows this site inside a frame.
   The parent sets that frame to this height, so the page ends with the
   content and the site footer sits just below it.
   A direct visit has no parent, so this does nothing. */
(function () {
  if (window.parent === window) return;

  function pageHeight() {
    var body = document.body;
    if (!body) return 0;
    /* The document's scroll height grows to fill a tall frame.
       Reporting that number would keep the empty space.
       The body box is the real content. */
    return Math.ceil(body.getBoundingClientRect().height);
  }

  var last = 0;
  function send() {
    var h = pageHeight();
    if (!h || h === last) return;
    last = h;
    window.parent.postMessage({ source: 'majestic-page', height: h }, '*');
  }

  window.addEventListener('load', send);
  window.addEventListener('resize', send);
  if (window.ResizeObserver) new ResizeObserver(send).observe(document.body);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', send);
  else send();
})();
