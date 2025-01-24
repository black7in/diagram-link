import { cxcommand } from './commands.js';
import { initializeDiagram, createNodeTemplate } from './diagram.js';
import { nodedata } from './data.js';

import { jsonToUmlXml, descargarArchivoXMI } from './helpers.js';

import { exportXML } from './xmlExport.js';

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
        return { isTreeLink: false, fromEndSegmentLength: 0, toEndSegmentLength: 0, };
    }

    // Crear un enlace Association con texto
    // Asociación
    myDiagram.linkTemplateMap.add('Association',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,

        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '1', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '1', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Relation', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myDiagram.linkTemplateMap.add('AssociationManyToMany',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,

        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '*', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '*', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )

    );

    myDiagram.linkTemplateMap.add('Aggregation',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Diamante en el extremo "from" para representar la agregación
            .add(
                new go.Shape({
                    fromArrow: 'StretchedDiamond',
                    fill: 'white', // Diamante vacío
                    stroke: 'black',
                    strokeWidth: 1.5,
                    scale: 2, // Escala del diamante (ajusta según sea necesario)
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(30, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Relation', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myDiagram.linkTemplateMap.add('Composition',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Diamante en el extremo "from" para representar la agregación
            .add(
                new go.Shape({
                    fromArrow: 'StretchedDiamond',
                    fill: 'black', // Diamante vacío
                    stroke: 'black',
                    strokeWidth: 1.5,
                    scale: 2, // Escala del diamante (ajusta según sea necesario)
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(30, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Relation', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myDiagram.linkTemplateMap.add('Generalization',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Flecha de triángulo en el extremo "to" para representar la generalización
            .add(
                new go.Shape({
                    toArrow: 'Triangle',
                    fill: 'white', // Triángulo vacío
                    stroke: 'black',
                    strokeWidth: 1.5,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-20, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Generalization', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myDiagram.linkTemplateMap.add('Realization',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                }),
            )
            // Flecha de triángulo en el extremo "to" para representar la generalización
            .add(
                new go.Shape({
                    toArrow: 'Triangle',
                    fill: 'black', // Triángulo vacío
                    stroke: 'black',
                    strokeWidth: 1.5,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-20, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Realization', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myDiagram.linkTemplateMap.add('Dependency',
        new go.Link({
            reshapable: true,
            resegmentable: true,
            ...linkStyle(),
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
        })
            .add(
                new go.Shape({
                    stroke: 'black',
                    strokeWidth: 2,
                    strokeDashArray: [4, 2] // Línea discontinua
                }),
            )
            // Flecha en el extremo "to" para representar la dependencia
            .add(
                new go.Shape({
                    toArrow: 'OpenTriangle',
                    fill: 'white', // Triángulo vacío
                    stroke: 'black',
                    strokeWidth: 1.5,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Multiplicidad en el extremo "from"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: 0, // Inicio del enlace
                    segmentOffset: new go.Point(15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'fromMultiplicity').makeTwoWay()),
            )
            // Multiplicidad en el extremo "to"
            .add(
                new go.TextBlock({
                    text: '', // Valor inicial de multiplicidad
                    segmentIndex: -1, // Fin del enlace
                    segmentOffset: new go.Point(-15, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'toMultiplicity').makeTwoWay()),
            )
            // Nombre en el centro del enlace
            .add(
                new go.TextBlock({
                    text: 'Dependency', // Valor inicial del nombre
                    segmentFraction: 0.5, // Posición en el centro del enlace
                    segmentOffset: new go.Point(0, -10), // Ajusta la posición
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );



    // Plantilla para los enlaces de la paleta
    myPalette.linkTemplateMap.add('Association',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Asociación', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.linkTemplateMap.add('Aggregation',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2
                }),
            )
            // Diamante en el extremo "from" para representar la agregación
            .add(
                new go.Shape({
                    fromArrow: 'Diamond',
                    fill: 'white', // Diamante vacío
                    stroke: 'black',
                    strokeWidth: 2,
                    scale: 1.5, // Escala del diamante (ajusta según sea necesario)
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Agregación', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.linkTemplateMap.add('Composition',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4,
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2
                }),
            )
            // Diamante relleno en el extremo "from" para representar la composición
            .add(
                new go.Shape({
                    fromArrow: 'Diamond',
                    fill: 'black', // Diamante relleno
                    stroke: 'black',
                    strokeWidth: 2,
                    scale: 1.5, // Escala del diamante (ajusta según sea necesario)
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Composición', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.linkTemplateMap.add('Generalization',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4,
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2
                }),
            )
            // Flecha de triángulo en el extremo "to" para representar la generalización
            .add(
                new go.Shape({
                    toArrow: 'Triangle',
                    fill: 'white', // Triángulo vacío
                    stroke: 'black',
                    strokeWidth: 2,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Generalización', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.linkTemplateMap.add('Realization',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4,
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2,
                    strokeDashArray: [4, 2] // Línea discontinua
                }),
            )
            // Flecha de triángulo rellena en el extremo "to" para representar la realización
            .add(
                new go.Shape({
                    toArrow: 'Triangle',
                    fill: 'black', // Triángulo relleno
                    stroke: 'black',
                    strokeWidth: 2,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Realización', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.linkTemplateMap.add('Dependency',
        new go.Link({
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: new go.Adornment('Link', {
                locationSpot: go.Spot.Center
            }),
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4,
            selectable: true,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
        })
            .bind('points')
            .add(
                new go.Shape({ // the link path shape
                    isPanelMain: true,
                    strokeWidth: 2,
                    strokeDashArray: [4, 2] // Línea discontinua
                }),
            )
            // Flecha de triángulo vacío en el extremo "to" para representar la dependencia
            .add(
                new go.Shape({
                    toArrow: 'OpenTriangle',
                    fill: 'white', // Triángulo vacío
                    stroke: 'black',
                    strokeWidth: 2,
                    scale: 1.5, // Escala del triángulo (ajusta según sea necesario)
                }),
            )
            // Texto en la punta del enlace
            .add(
                new go.TextBlock({
                    text: 'Dependencia', // Valor inicial del texto
                    segmentIndex: -1, // Posición en la punta del enlace
                    segmentOffset: new go.Point(-10, 18), // Ajusta la posición para estar en la punta del enlace
                    font: '10pt sans-serif',
                    editable: true, // Permite editar en el diagrama
                }).bind(new go.Binding('text', 'linkName').makeTwoWay()),
            )
    );

    myPalette.model.linkCategoryProperty = "relationship";  // Esto es correcto



    // Luego agregas los enlaces al modelo de la paleta
    // Modelo de la paleta con nodos y enlaces
    myPalette.model = new go.GraphLinksModel(
        [
            { key: 1, name: "NuevaClase", properties: [], methods: [] },  // Nodo ejemplo
        ],
        [
            // Definición de los diferentes tipos de enlaces en la paleta
            { category: 'Association', relationship: 'Association', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
            { category: 'Aggregation', relationship: 'Aggregation', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
            { category: 'Composition', relationship: 'Composition', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
            { category: 'Generalization', relationship: 'Generalization', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
            { category: 'Realization', relationship: 'Realization', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
            { category: 'Dependency', relationship: 'Dependency', points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) },
        ]
    );

    myDiagram.addDiagramListener('LinkDrawn', function (e) {
        const link = e.subject.part.data;

        if (link.fromMultiplicity === '*' || link.toMultiplicity === '*') {
            //addIntermediateClass(link);
            console.log("Se ha dibujado un enlace con multiplicidad *");
        }
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
    //var json = myDiagram.model.toJson();
    const json = JSON.parse(myDiagram.model.toJson());
    //descargarArchivoXMI(json);
    exportXML(json);

    return;
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