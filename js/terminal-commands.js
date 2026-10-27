(function () {
    var allowed = { portfolio: 't-green', blog: 't-blue' };

    function visible(shell) {
        return Object.keys(allowed).filter(function (slug) { return Object.hasOwn(shell.pages, slug); });
    }

    window.Quark2TerminalCommands = {
        whoami: function (arg, shell) {
            shell.text(shell.term.dataset.whoami || 'guest');
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
                    span.className = allowed[slug];
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
