(function () {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
        var track = root.querySelector('[data-carousel-track]');
        var cards = track.children;
        var dotBox = root.querySelector('[data-carousel-dots]');
        var dots = [];
        var prev = root.querySelector('[data-carousel-prev]');
        var next = root.querySelector('[data-carousel-next]');

        function step() {
            var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return cards[0].offsetWidth + gap;
        }

        function stops() {
            var max = track.scrollWidth - track.clientWidth;
            return max > 1 ? Math.ceil(max / step() - 0.25) + 1 : 1;
        }

        function buildDots() {
            var count = stops();
            if (count === dots.length) return;
            dotBox.innerHTML = '';
            dots = [];
            for (var i = 0; i < count && count > 1; i++) {
                var dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dotBox.appendChild(dot);
                dots.push(dot);
            }
        }

        function update() {
            var max = track.scrollWidth - track.clientWidth;
            var index = max > 1 ? Math.round(track.scrollLeft / max * (dots.length - 1)) : 0;
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
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
        window.addEventListener('resize', function () {
            buildDots();
            update();
        });
        buildDots();
        update();
    });
})();
