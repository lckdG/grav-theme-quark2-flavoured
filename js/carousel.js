(function () {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
        var track = root.querySelector('[data-carousel-track]');
        var cards = track.children;
        var dots = root.querySelectorAll('.carousel-dot');
        var prev = root.querySelector('[data-carousel-prev]');
        var next = root.querySelector('[data-carousel-next]');

        function step() {
            var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return cards[0].offsetWidth + gap;
        }

        function update() {
            var max = track.scrollWidth - track.clientWidth;
            var index = Math.round(track.scrollLeft / step());
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === Math.min(index, dots.length - 1));
            });
            prev.disabled = track.scrollLeft <= 1;
            next.disabled = track.scrollLeft >= max - 1;
            root.classList.toggle('at-end', track.scrollLeft >= max - 1);
        }

        prev.addEventListener('click', function () {
            track.scrollBy({ left: -step(), behavior: 'smooth' });
        });
        next.addEventListener('click', function () {
            track.scrollBy({ left: step(), behavior: 'smooth' });
        });
        track.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    });
})();
