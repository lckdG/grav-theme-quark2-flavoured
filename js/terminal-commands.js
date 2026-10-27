(function () {
    function visible(shell) {
        return Object.keys(shell.allowed).filter(function (slug) { return Object.hasOwn(shell.pages, slug); });
    }

    window.Quark2TerminalCommands = {
        whoami: function (arg, shell) {
            shell.print('term-out', function(line) {
                var span = document.createElement('span');
                span.className = 't-accent';
                span.textContent = shell.term.dataset.whoami || 'guest';
                line.appendChild(span);
            });
        },
        help: function (arg, shell) {
            shell.text(Object.keys(shell.commands).concat(Object.keys(shell.outputs).filter(function (name) {
                return !Object.hasOwn(shell.commands, name);
            })).join('  '));
        },
        ls: function (arg, shell) {
            shell.print('term-out', function (line) {
                visible(shell).forEach(function (slug) {
                    var span = document.createElement('span');
                    span.className = shell.allowed[slug];
                    span.textContent = slug + '/  ';
                    line.appendChild(span);
                });
            });
        },
        cd: function (arg, shell) {
            if (visible(shell).includes(arg)) location.href = shell.pages[arg];
            else shell.text('cd: ' + shell.term.dataset.noPage + ': ' + arg);
        }
    };
})();
