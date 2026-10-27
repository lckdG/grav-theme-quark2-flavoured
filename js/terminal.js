(function () {
    var terminals = document.querySelectorAll('.terminal');
    if (!terminals.length) return;

    var animate = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches;

    function wait(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    function fill(field, value) {
        field.value = value;
        field.style.width = 'calc(' + value.length + 'ch + 2px)';
    }

    async function play(term) {
        var field = term.querySelector('.term-field');
        var lines = term.querySelectorAll('.term-cmd, .term-out');

        await wait(2000);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.classList.contains('term-out')) {
                line.classList.add('is-shown');
                await wait(300);
                continue;
            }
            var command = line.lastChild.textContent.trim();
            for (var c = 0; c < command.length; c++) {
                fill(field, field.value + command[c]);
                await wait(30 + Math.random() * 40);
            }
            await wait(100);
            fill(field, '');
            line.classList.add('is-shown');
        }
    }

    function interactive(term) {
        var body = term.querySelector('.term-body');
        var inputLine = term.querySelector('.term-input');
        var field = term.querySelector('.term-field');
        var pages = JSON.parse(term.dataset.pages || '{}');
        var past = [];
        var cursor = 0;

        var outputs = {};
        term.querySelectorAll('.term-cmd').forEach(function (cmd) {
            var next = cmd.nextElementSibling;
            outputs[cmd.lastChild.textContent.trim()] = next && next.classList.contains('term-out') ? next.innerHTML : '';
        });

        function print(className, build) {
            var line = document.createElement(className === 'term-cmd' ? 'p' : 'div');
            line.className = className + ' is-shown';
            build(line);
            body.insertBefore(line, inputLine);
        }

        function text(message) {
            print('term-out', function (line) { line.textContent = message; });
        }

        var commands = window.Quark2TerminalCommands || {};
        var shell = { term: term, pages: pages, outputs: outputs, commands: commands, print: print, text: text };

        function run(input) {
            var parts = input.trim().split(/\s+/);
            print('term-cmd', function (line) {
                line.innerHTML = '<span class="term-prompt">❯</span> ';
                line.appendChild(document.createTextNode(input));
            });
            if (!parts[0]) return;
            if (Object.hasOwn(commands, parts[0])) commands[parts[0]](parts.slice(1).join(' '), shell);
            else if (Object.hasOwn(outputs, parts[0])) print('term-out', function (line) { line.innerHTML = outputs[parts[0]]; });
            else text(parts[0] + ': ' + term.dataset.notFound);
        }

        field.addEventListener('input', function () {
            fill(field, field.value);
        });

        field.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                body.style.maxHeight = body.style.maxHeight || body.offsetHeight + 'px';
                if (field.value.trim()) past.push(field.value);
                cursor = past.length;
                run(field.value);
                fill(field, '');
                body.scrollTop = body.scrollHeight;
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                cursor = Math.max(0, Math.min(past.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)));
                fill(field, past[cursor] || '');
            }
        });

        term.addEventListener('click', function () {
            if (!field.disabled && !getSelection().toString()) field.focus();
        });

        field.disabled = false;
    }

    if (!animate) {
        terminals.forEach(interactive);
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            play(entry.target).then(function () { interactive(entry.target); });
        });
    }, { threshold: 0.3 });

    terminals.forEach(function (term) {
        term.classList.add('is-typing');
        observer.observe(term);
    });
})();
