/* Report this page's height to the parent frame, and open at the top.
   The hub on MajesticAdvising.com shows this site inside a frame.
   The parent sets that frame to this height, so the page ends with the
   content and the site footer sits just below it.
   A direct visit has no parent. This script still scrolls this page to the top.
   The first height message also asks the parent to bring the frame to the top.
   Later height updates (resize, expanding sections) do not move the parent. */
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var anchorStyle = document.createElement('style');
  anchorStyle.textContent = 'html { overflow-anchor: none; }';
  document.head.appendChild(anchorStyle);

  function toTop() {
    window.scrollTo(0, 0);
    var root = document.scrollingElement || document.documentElement;
    if (root) root.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }

  /* Run again after the browser's own fragment scroll on load. */
  function toTopSoon() {
    toTop();
    setTimeout(toTop, 0);
    setTimeout(toTop, 60);
  }

   toTopSoon();
  window.addEventListener('pageshow', toTopSoon);
  window.addEventListener('load', toTopSoon);

  /* In-page tabs call this. A new page load does not.
     The offset is inside this document. The parent frame, if any,
     scrolls by the same amount so the section stays in view. */
  window.majesticShowSection = function (el) {
    if (!el || !el.getBoundingClientRect) return;
    var banner = document.querySelector('.demo-only');
    var bannerH = banner ? banner.offsetHeight : 0;
    var y = el.getBoundingClientRect().top + window.pageYOffset - bannerH - 12;
    if (y < 0) y = 0;
    window.scrollTo(0, y);
    if (window.parent !== window) {
      window.parent.postMessage({ source: 'majestic-page', scrollTo: y }, '*');
    }
  };

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
  var announced = false;

  function send(scrollToTop) {
    var h = pageHeight();
    if (!h) return;
    var changed = h !== last;
    var askScroll = scrollToTop && !announced;
    if (!changed && !askScroll) return;
    last = h;
    var msg = { source: 'majestic-page', height: h };
    if (askScroll) {
      msg.scrollToTop = true;
      announced = true;
    }
    window.parent.postMessage(msg, '*');
  }

  function announce() {
    announced = false;
    send(true);
  }

  window.addEventListener('load', announce);
  window.addEventListener('pageshow', announce);
  window.addEventListener('resize', function () { send(false); });
  if (window.ResizeObserver && document.body) {
    new ResizeObserver(function () { send(false); }).observe(document.body);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { send(false); });
  else send(false);
})();
