window.Quark2TerminalCommands = {
    help: function (arg, shell) {
        shell.text(Object.keys(shell.commands).concat(Object.keys(shell.outputs).filter(function (name) {
            return !Object.hasOwn(shell.commands, name);
        })).join('  '));
    },
    ls: function (arg, shell) {
        shell.print('term-out', function (line) {
            Object.keys(shell.pages).forEach(function (slug) {
                var dir = document.createElement('span');
                dir.className = 't-blue';
                dir.textContent = slug + '/  ';
                line.appendChild(dir);
            });
        });
    },
    cd: function (arg, shell) {
        if (Object.hasOwn(shell.pages, arg)) location.href = shell.pages[arg];
        else shell.text('cd: ' + shell.term.dataset.noPage + ': ' + arg);
    }
};
