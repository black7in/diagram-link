import * as go from 'gojs';

export function setupContextMenu(diagram, cxElement) {
    var myContextMenu = new go.HTMLInfo({
        show: showContextMenu,
        hide: hideContextMenu
    });

    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener(
        'contextmenu',
        (e) => {
            e.preventDefault();
            return false;
        },
        false
    );

    diagram.contextMenu = myContextMenu;

    function showContextMenu(obj, diagram, tool) {
        let hasMenuItem = false;

        function maybeShowItem(elt, pred) {
            if (pred) {
                elt.style.display = 'block';
                hasMenuItem = true;
            } else {
                elt.style.display = 'none';
            }
        }

        maybeShowItem(document.getElementById('color'), obj !== null);

        if (hasMenuItem) {
            cxElement.classList.add('show-menu');
            const mousePt = diagram.lastInput.viewPoint;
            cxElement.style.left = `${mousePt.x + 5}px`;
            cxElement.style.top = `${mousePt.y}px`;
        }

        window.addEventListener('pointerdown', hideContextMenu, true);
    }

    function hideContextMenu() {
        cxElement.classList.remove('show-menu');
        window.removeEventListener('pointerdown', hideContextMenu, true);
    }
}
