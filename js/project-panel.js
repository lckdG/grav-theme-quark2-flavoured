(function () {
    function open(id) {
        var panel = document.getElementById(id);
        if (panel && !panel.open) panel.showModal();
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
            panel.close();
            open(go.dataset.panelGo);
        } else if (e.target.closest('[data-panel-close]') || e.target === panel) {
            panel.close();
        }
    });
})();
