import { cxcommand } from './commands.js';
import { initializeDiagram, createNodeTemplate } from './diagram.js';
import { nodedata } from './data.js';

let myDiagram;
let myPalette;

// This is the actual HTML context menu:
var cxElement = document.getElementById('contextMenu');
window.cxcommand = (event, val) => cxcommand(event, val, myDiagram);

function init() {
    myDiagram = initializeDiagram();
    myPalette = new go.Palette('myPaletteDiv', {
        maxSelectionCount: 1,
    }); // debe ser el ID de un DIV en tu página

    // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
    var myContextMenu = new go.HTMLInfo({
        show: showContextMenu,
        hide: hideContextMenu
    });

    // the node template
    myDiagram.nodeTemplate = createNodeTemplate(myContextMenu);
    myPalette.nodeTemplate = createNodeTemplate(null);
    myPalette.contentAlignment = go.Spot.Center;

    function linkStyle() {
        return { isTreeLink: false, fromEndSegmentLength: 0, toEndSegmentLength: 0 };
    }

    myDiagram.linkTemplate = new go.Link({ // by default, "Inheritance" or "Generalization"
        ...linkStyle(),
        isTreeLink: true
    })
        .add(
            new go.Shape(),
            new go.Shape({ toArrow: 'Triangle', fill: 'white' })
        );

    myDiagram.linkTemplateMap.add('Association',
        new go.Link(linkStyle())
            .add(
                new go.Shape()
            ));

    myDiagram.linkTemplateMap.add('Realization',
        new go.Link(linkStyle())
            .add(
                new go.Shape({ strokeDashArray: [3, 2] }),
                new go.Shape({ toArrow: 'Triangle', fill: 'white' })
            ));

    myDiagram.linkTemplateMap.add('Dependency',
        new go.Link(linkStyle())
            .add(
                new go.Shape({ strokeDashArray: [3, 2] }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            ));

    myDiagram.linkTemplateMap.add('Composition',
        new go.Link(linkStyle())
            .add(
                new go.Shape(),
                new go.Shape({ fromArrow: 'StretchedDiamond', scale: 1.3 }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            ));

    myDiagram.linkTemplateMap.add('Aggregation',
        new go.Link(linkStyle())
            .add(
                new go.Shape(),
                new go.Shape({ fromArrow: 'StretchedDiamond', fill: 'white', scale: 1.3 }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            ));

    var linkdata = [
        { from: 1, to: 11, relationship: 'Dependency' }
    ];

    myPalette.model = new go.GraphLinksModel([{
        key: 1,
        name: "NuevaClase",
        properties: [],
        methods: []
    },
    ],);

    myDiagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        linkCategoryProperty: 'relationship',
        nodeDataArray: nodedata,
        linkDataArray: linkdata
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

    myDiagram.model.addChangedListener(function (e) {
        if (e.isTransactionFinished) {
            const modelChanges = e.model.toIncrementalJson(e.oldValue, e.newValue);
            //socket.emit('diagram-changes', modelChanges);
            //console.log(modelChanges);

            
        }
    });
}

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

window.addEventListener('DOMContentLoaded', init);
