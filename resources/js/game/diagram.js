import { convertVisibility } from './helpers.js';
import OrthogonalLinkReshapingTool from './OrthogonalLinkReshapingTool.js';

export function initializeDiagram() {
    return new go.Diagram('myDiagramDiv', {
        grid: new go.Panel('Grid')
            .add(
                new go.Shape('LineH', {
                    stroke: 'lightgray',
                    strokeWidth: 0.5
                }),
                new go.Shape('LineH', {
                    stroke: 'gray',
                    strokeWidth: 0.5,
                    interval: 10
                }),
                new go.Shape('LineV', {
                    stroke: 'lightgray',
                    strokeWidth: 0.5
                }),
                new go.Shape('LineV', {
                    stroke: 'gray',
                    strokeWidth: 0.5,
                    interval: 10
                })
            ),
        'undoManager.isEnabled': true,
        'draggingTool.dragsLink': true,
        'draggingTool.isGridSnapEnabled': true,
        'linkingTool.isUnconnectedLinkValid': true,
        'linkingTool.portGravity': 20,
        'relinkingTool.isUnconnectedLinkValid': true,
        'relinkingTool.portGravity': 20,
        linkReshapingTool: new OrthogonalLinkReshapingTool()
    });
}


export function createNodeTemplate(myContextMenu) {
    return new go.Node('Auto', {
        locationSpot: go.Spot.Center,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        contextMenu: myContextMenu,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        mouseEnter: (e, node) => showSmallPorts(node, true),
        mouseLeave: (e, node) => showSmallPorts(node, false),
        resizable: true,
        resizeObjectName: 'TABLE',
        resizeAdornmentTemplate: go.GraphObject.make(
            go.Adornment, 'Spot',
            go.GraphObject.make(go.Placeholder),
            go.GraphObject.make(go.Shape, 'Circle', {
                alignment: go.Spot.BottomRight,
                desiredSize: new go.Size(7, 7),
                fill: 'lightblue',
                stroke: 'dodgerblue',
                cursor: 'se-resize'
            })
        )
    })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .add(
            new go.Shape({
                fill: 'palegreen',
            }),
            new go.Panel('Table', {
                name: 'TABLE', // El panel de la tabla será redimensionado
                defaultRowSeparatorStroke: 'black'
            })
                .add(
                    // header
                    new go.TextBlock({
                        row: 0,
                        columnSpan: 2,
                        margin: 3,
                        alignment: go.Spot.Center,
                        font: 'bold 12pt sans-serif',
                        isMultiline: false,
                        editable: true
                    })
                        .bindTwoWay('text', 'name'),
                    // properties
                    new go.Panel('Vertical', {
                        name: 'PROPERTIES',
                        row: 1,
                        margin: 3,
                        stretch: go.Stretch.Horizontal,
                        defaultAlignment: go.Spot.Left,
                        background: 'palegreen',
                        itemTemplate: propertyTemplate
                    })
                        .bind('itemArray', 'properties'),
                    // methods
                    new go.Panel('Vertical', {
                        name: 'METHODS',
                        row: 2,
                        margin: 3,
                        stretch: go.Stretch.Horizontal,
                        defaultAlignment: go.Spot.Left,
                        background: 'palegreen',
                        itemTemplate: methodTemplate
                    })
                        .bind('itemArray', 'methods')
                ),
            makePort('T', go.Spot.Top, false, true),
            makePort('L', go.Spot.Left, true, true),
            makePort('R', go.Spot.Right, true, true),
            makePort('B', go.Spot.Bottom, true, false)
        );
}

function makePort(name, spot, output, input) {
    return new go.Shape('Circle', {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: 'pointer' // show a different cursor to indicate potential link point
    });
}

var nodeSelectionAdornmentTemplate = new go.Adornment('Auto')
    .add(
        new go.Shape({ fill: null, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        new go.Placeholder()
    );

function showSmallPorts(node, show) {
    node.ports.each((port) => {
        if (port.portId !== '') {
            // don't change the default port, which is the big shape
            port.fill = show ? 'rgba(0,0,0,.3)' : null;
        }
    });
}

// the item template for properties
export var propertyTemplate = new go.Panel('Horizontal')
    .add(
        // property visibility/access
        new go.TextBlock({
            isMultiline: false,
            editable: true,
            width: 12
        })
            .bind('text', 'visibility', convertVisibility),

        // property name, underlined if scope=="class" to indicate static property
        new go.TextBlock({
            isMultiline: false,
            editable: true
        }) // editable set to true
            .bindTwoWay('text', 'name')
            .bind('isUnderline', 'scope', s => s[0] === 'c'),

        // property type, if known
        new go.TextBlock('')
            .bind('text', 'type', t => t ? ': ' : ''),
        new go.TextBlock({
            isMultiline: false,
            editable: true
        }) // editable set to true
            .bindTwoWay('text', 'type')
    );

// the item template for methods
export var methodTemplate = new go.Panel('Horizontal')
    .add(
        // method visibility/access
        new go.TextBlock({
            isMultiline: false,
            editable: false,
            width: 12
        })
            .bind('text', 'visibility', convertVisibility),
        // method name, underlined if scope=="class" to indicate static method
        new go.TextBlock({
            isMultiline: false,
            editable: true
        })
            .bindTwoWay('text', 'name')
            .bind('isUnderline', 'scope', s => s[0] === 'c'),
        // method parameters
        new go.TextBlock('()')
            .bind('text', 'parameters', parr => {
                var s = '(';
                for (var i = 0; i < parr.length; i++) {
                    var param = parr[i];
                    if (i > 0) s += ', ';
                    s += param.name + ': ' + param.type;
                }
                return s + ')';
            }),
        // method return type, if any
        new go.TextBlock('')
            .bind('text', 'type', t => t ? ': ' : ''),
        new go.TextBlock({
            isMultiline: false,
            editable: true
        })
            .bindTwoWay('text', 'type')
    );