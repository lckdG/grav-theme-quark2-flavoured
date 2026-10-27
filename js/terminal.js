(function () {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var terminals = document.querySelectorAll('.terminal');
    if (!terminals.length) return;

    function wait(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    async function play(term) {
        var cursor = term.querySelector('.term-cursor');
        var input = cursor.parentNode;
        var lines = term.querySelectorAll('.term-cmd, .term-out');

        await wait(300);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line.classList.add('is-shown');
            if (line.classList.contains('term-out')) {
                await wait(100);
                continue;
            }
            var text = line.lastChild;
            var command = text.textContent;
            text.textContent = '';
            line.appendChild(cursor);
            for (var c = 0; c < command.length; c++) {
                text.textContent += command[c];
                await wait(30 + Math.random() * 40);
            }
            await wait(100);
        }
        input.appendChild(cursor);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            play(entry.target);
        });
    }, { threshold: 0.3 });

    terminals.forEach(function (term) {
        term.classList.add('is-typing');
        observer.observe(term);
    });
})();
