import { initDiagram, initPalette } from './diagram';
import { setupContextMenu } from './contextMenu';
import { addEventListeners } from './eventListeners';

function init() {
    const myDiagram = initDiagram();
    const myPalette = initPalette(myDiagram);
    const cxElement = document.getElementById('contextMenu');

    setupContextMenu(myDiagram, cxElement);
    addEventListeners(myDiagram);
}

window.addEventListener('DOMContentLoaded', init);
