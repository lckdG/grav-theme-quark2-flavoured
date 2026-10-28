(function () {
    function open(id, dir) {
        var panel = document.getElementById(id);
        if (!panel || panel.open) return;
        if (dir) panel.dataset.dir = dir;
        else delete panel.dataset.dir;
        panel.showModal();
    }

    // swap panels without fading the scrim out and back in
    function swap(from, id, dir) {
        var to = document.getElementById(id);
        if (!to) return;
        from.classList.add('is-switching');
        to.classList.add('is-switching');
        from.close();
        open(id, dir);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                from.classList.remove('is-switching');
                to.classList.remove('is-switching');
            });
        });
    }

    document.addEventListener('click', function (e) {
        var opener = e.target.closest('[data-panel-open]');
        if (opener) {
            open(opener.dataset.panelOpen);
            return;
        }

        var panel = e.target.closest('.project-panel');
        if (!panel) return;

        var go = e.target.closest('[data-panel-go]');
        if (go) {
            swap(panel, go.dataset.panelGo, go.classList.contains('panel-prev') ? 'prev' : 'next');
        } else if (e.target.closest('[data-panel-close]') || e.target === panel) {
            panel.close();
        }
    });
})();
