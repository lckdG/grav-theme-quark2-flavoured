(function () {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var terminals = document.querySelectorAll('.terminal');
    if (!terminals.length) return;

    function wait(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    async function play(term) {
        var typed = term.querySelector('.term-typed');
        var lines = term.querySelectorAll('.term-cmd, .term-out');

        await wait(800);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.classList.contains('term-out')) {
                line.classList.add('is-shown');
                await wait(300);
                continue;
            }
            var command = line.lastChild.textContent.trim();
            for (var c = 0; c < command.length; c++) {
                typed.textContent += command[c];
                await wait(30 + Math.random() * 40);
            }
            await wait(100);
            typed.textContent = '';
            line.classList.add('is-shown');
        }
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
