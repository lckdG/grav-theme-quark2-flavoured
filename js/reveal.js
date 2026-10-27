(function () {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = document.querySelectorAll('.section-head, .project-grid .project-card, .carousel, .skill-group, .loot-row, .timeline-item, .timeline-aside-title, .edu-card');
    if (!targets.length) return;

    document.documentElement.classList.add('reveal-ready');

    var observer = new IntersectionObserver(function (entries) {
        var batch = entries.filter(function (entry) { return entry.isIntersecting; });
        batch.forEach(function (entry, i) {
            entry.target.style.setProperty('--reveal-delay', i * 100 + 'ms');
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
})();
