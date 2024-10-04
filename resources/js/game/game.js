import { cxcommand } from './commands.js';
import { initializeDiagram, createNodeTemplate } from './diagram.js';
import { nodedata } from './data.js';

import { jsonToUmlXml } from './helpers.js';

let myDiagram;
let myPalette;

// This is the actual HTML context menu:
var cxElement = document.getElementById('contextMenu');
window.cxcommand = (event, val) => cxcommand(event, val, myDiagram);

function init(/*dataModel*/) {

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

    // Crear un enlance Association, es un enlance que no contiene flechas
    myDiagram.linkTemplateMap.add('Association',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape()
            )
    );

    // Crear enlace Directed Association, es un enlace que contiene una flecha abierta en el extremo del destino
    myDiagram.linkTemplateMap.add('DirectedAssociation',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape(),
                new go.Shape({ toArrow: 'OpenTriangle' })
            )
    );

    // Crear enlace Aggregation, es un enlace que contiene una flecha de diamante en el extremo del origen
    myDiagram.linkTemplateMap.add('Aggregation',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape(),
                new go.Shape({ fromArrow: 'StretchedDiamond', fill: 'white', scale: 1.3 }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            )
    );

    // Crear enlace Composition, es un enlace que contiene una flecha de diamante oscuro en el extremo del origen
    myDiagram.linkTemplateMap.add('Composition',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape(),
                new go.Shape({ fromArrow: 'StretchedDiamond', scale: 1.3 }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            )
    );

    // Crear enlace Dependency, es un enlace punteado que contiene una flecha de punta abierta en el extremo del destino
    myDiagram.linkTemplateMap.add('Dependency',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape({ strokeDashArray: [3, 2] }),
                new go.Shape({ toArrow: 'OpenTriangle' })
            )
    );

    // Crear enlace Generalization, es un enlace que contiene una flecha de punta abierta en el extremo del destino
    myDiagram.linkTemplateMap.add('Generalization',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape(),
                new go.Shape({ toArrow: 'Triangle', fill: 'white' })
            )
    );

    myDiagram.linkTemplateMap.add('Realization',
        new go.Link({
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true // Habilitar redimensionamiento
        })
            .add(
                new go.Shape({ strokeDashArray: [3, 2] }),
                new go.Shape({ toArrow: 'Triangle', fill: 'white' })
            )
    );

    // Plantilla para los enlaces de la paleta
    myPalette.linkTemplate = new go.Link({
        locationSpot: go.Spot.Center,  // Ubicación del enlace en la paleta
        selectionAdornmentTemplate: new go.Adornment('Link', {
            locationSpot: go.Spot.Center
        })
            .add(
                new go.Shape({ isPanelMain: true, stroke: 'deepskyblue', strokeWidth: 2 }),  // Línea del enlace
                new go.Shape({ toArrow: 'Standard', stroke: null })  // Flecha del enlace
            ),
        routing: go.Routing.AvoidsNodes,  // Evitar los nodos
        curve: go.Curve.JumpOver,  // Curvatura con salto sobre otros enlaces
        corner: 5,
        toShortLength: 4
    })
        .bind('points')
        .add(
            new go.Shape({ isPanelMain: true, strokeWidth: 2 }),  // Forma del enlace
            new go.Shape({ toArrow: 'Standard', stroke: null })  // Flecha del enlace
        );

    //myPalette.linkTemplateMap = myDiagram.linkTemplateMap;
    myPalette.model.linkCategoryProperty = "relationship";  // Esto es correcto


    // Luego agregas los enlaces al modelo de la paleta
    // Modelo de la paleta con nodos y enlaces
    myPalette.model = new go.GraphLinksModel(
        [
            { key: 1, name: "NuevaClase", properties: [], methods: [] },  // Nodo ejemplo
        ],
        [
            // Definición de los diferentes tipos de enlaces en la paleta
            { relationship: 'Association', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
            { relationship: 'DirectedAssociation', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
            { relationship: 'Aggregation', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
            { relationship: 'Composition', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
            { relationship: 'Dependency', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
            { relationship: 'Generalization', points: new go.List().addAll([new go.Point(0, 0), new go.Point(60, 40)]) },
        ]
    );


    /*myDiagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        linkCategoryProperty: 'relationship',
        nodeDataArray: nodedata,
        linkDataArray: linkdata
    });*/

    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener(
        'contextmenu',
        (e) => {
            e.preventDefault();
            return false;
        },
        false
    );

    document.getElementById('exportarPNG').addEventListener('click', makeBlob);
    document.getElementById('exportarJSON').addEventListener('click', exportarJSON);
    document.getElementById('saveDB').addEventListener('click', saveDB);
    document.getElementById('abrirD').addEventListener('click', () => {
        window.Livewire.dispatch('cargarDiagrama');
    });
    document.getElementById('exportarArchitect').addEventListener('click', exportarArchitect);


    var selectedLinkType = 'Association'; // Puedes cambiar esto dinámicamente con un menú o botón

    myDiagram.toolManager.linkingTool.archetypeLinkData = {
        relationship: selectedLinkType  // Usa la categoría seleccionada para el tipo de relación
    };

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


// When the blob is complete, make an anchor tag for it and use the tag to initiate a download
// Works in Chrome, Firefox, Safari, Edge, IE11
function myCallback(blob) {
    var url = window.URL.createObjectURL(blob);
    var filename = 'myBlobFile.png';

    var a = document.createElement('a');
    a.style = 'display: none';
    a.href = url;
    a.download = filename;

    // IE 11
    if (window.navigator.msSaveBlob !== undefined) {
        window.navigator.msSaveBlob(blob, filename);
        return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

function makeBlob() {
    var blob = myDiagram.makeImageData({ background: 'white', returnType: 'blob', callback: myCallback });
}

function exportarJSON() {
    var json = myDiagram.model.toJson();
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = 'diagram.json';
    a.href = url;
    a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

    Swal.fire(
        'Descargado',
        'El archivo se ha descargado.',
        'success'
    )
}

function saveDB() {
    var json = myDiagram.model.toJson();
    Livewire.dispatch('storeDiagram', { data: json });
}

function exportarArchitect() {
    var json = myDiagram.model.toJson();
    var xml = jsonToUmlXml(json);

    // Descargar el archivo XML
    var blob = new Blob([xml], { type: "application/xml" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = 'diagram.xml';
    a.href = url;
    a.dataset.downloadurl = ['application/xml', a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

    Swal.fire(
        'Descargado',
        'El archivo se ha descargado.',
        'success'
    )
}

//window.addEventListener('DOMContentLoaded', init);
document.addEventListener('livewire:init', () => {
    init(/*data*/); // iniciar el diagrama
    let transmisionRemota = false; // Bandera para distinguir las actualizaciones remotas\
    let numeroEventosEscuchados = 0;
    Livewire.on('cargarDiagramaInicio', (data) => {
        myDiagram.model = go.Model.fromJson(data[0]); // Actualizar el diagrama
        console.log("Este diagrama se recibe al cargar la página");
    });

    myDiagram.addModelChangedListener(e => {
        if (e.isTransactionFinished) {
            if (!transmisionRemota) {
                numeroEventosEscuchados++;
                // Diagrama actualizado, enviar los datos al servidor
                if (numeroEventosEscuchados > 1) {
                    console.log("El diagrama ha sido actualizado, se enviará al servidor");
                    const json = e.model.toJson();
                    Livewire.dispatch('updateDiagram', { data: json });
                }
            } else {
                transmisionRemota = false; // Mover esta línea aquí
            }
        }
    });

    Livewire.on('actualizarDiagrama', (data) => {
        // Actualizar el diagrama con los datos recibidos del servidor
        console.log("Recibir datos del servidor para actualizar el diagrama");
        transmisionRemota = true;
        myDiagram.model = go.Model.fromJson(data[0]); // Actualizar el diagrama
    });
})