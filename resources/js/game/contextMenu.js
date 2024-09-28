function hideCX() {
    if (myDiagram.currentTool instanceof go.ContextMenuTool) {
        myDiagram.currentTool.doCancel();
    }
}

function showContextMenu(obj, diagram, tool) {
    // Show only the relevant buttons given the current state.
    var cmd = diagram.commandHandler;
    var hasMenuItem = false;

    function maybeShowItem(elt, pred) {
        if (pred) {
            elt.style.display = 'block';
            hasMenuItem = true;
        } else {
            elt.style.display = 'none';
        }
    }
    maybeShowItem(document.getElementById('color'), obj !== null);
    maybeShowItem(document.getElementById('attribute'), obj !== null);

    // Now show the whole context menu element
    if (hasMenuItem) {
        cxElement.classList.add('show-menu');
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 5 + 'px';
        cxElement.style.top = mousePt.y + 'px';
    }

    // Optional: Use a `window` pointerdown listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.addEventListener('pointerdown', hideCX, true);
}

function hideContextMenu() {
    cxElement.classList.remove('show-menu');
    // Optional: Use a `window` pointerdown listener with event capture to
    //           remove the context menu if the user clicks elsewhere on the page
    window.removeEventListener('pointerdown', hideCX, true);
}