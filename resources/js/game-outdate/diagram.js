import * as go from 'gojs';

export function initDiagram() {
    const myDiagram = new go.Diagram('myDiagramDiv', {
        grid: new go.Panel('Grid')
            .add(
                new go.Shape('LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
                new go.Shape('LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
                new go.Shape('LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
                new go.Shape('LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
            ),
        'draggingTool.dragsLink': true,
        'draggingTool.isGridSnapEnabled': true,
        'linkingTool.isUnconnectedLinkValid': true,
        'linkingTool.portGravity': 20,
        'relinkingTool.isUnconnectedLinkValid': true,
        'relinkingTool.portGravity': 20,
        'undoManager.isEnabled': true,
    });

    myDiagram.nodeTemplate = createNodeTemplate();
    
    setupInitialNodes(myDiagram);

    return myDiagram;
}

export function initPalette(diagram) {
    const myPalette = new go.Palette('myPaletteDiv');
    myPalette.nodeTemplate = diagram.nodeTemplate;
    myPalette.model = new go.GraphLinksModel([
        {
            key: 1,
            name: "NewClass",
            properties: [],
            methods: [],
        },
    ]);
    return myPalette;
}

function createNodeTemplate() {
    const propertyTemplate = new go.Panel('Horizontal')
        .add(
            new go.TextBlock({ isMultiline: false, editable: true, width: 12 })
                .bind('text', 'visibility', convertVisibility),
            new go.TextBlock({ isMultiline: false, editable: true }).bindTwoWay('text', 'name'),
            new go.TextBlock('').bind('text', 'type', (t) => (t ? ': ' : '')),
            new go.TextBlock({ isMultiline: false, editable: true }).bindTwoWay('text', 'type')
        );

    const methodTemplate = new go.Panel('Horizontal')
        .add(
            new go.TextBlock({ isMultiline: false, editable: false, width: 12 })
                .bind('text', 'visibility', convertVisibility),
            new go.TextBlock({ isMultiline: false, editable: true }).bindTwoWay('text', 'name'),
            new go.TextBlock('()').bind('text', 'parameters', formatParameters),
            new go.TextBlock('').bind('text', 'type', (t) => (t ? ': ' : '')),
            new go.TextBlock({ isMultiline: false, editable: true }).bindTwoWay('text', 'type')
        );

    return new go.Node('Auto', {
        locationSpot: go.Spot.Center,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
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
    }).add(
        new go.Shape({ fill: 'palegreen' }),
        new go.Panel('Table', {
            name: 'TABLE',
            defaultRowSeparatorStroke: 'black',
        }).add(
            new go.TextBlock({
                row: 0,
                columnSpan: 2,
                margin: 3,
                alignment: go.Spot.Center,
                font: 'bold 12pt sans-serif',
                isMultiline: false,
                editable: true,
            }).bindTwoWay('text', 'name'),
            new go.Panel('Vertical', {
                name: 'PROPERTIES',
                row: 1,
                margin: 3,
                stretch: go.Stretch.Horizontal,
                defaultAlignment: go.Spot.Left,
                itemTemplate: propertyTemplate,
            }).bind('itemArray', 'properties'),
            new go.Panel('Vertical', {
                name: 'METHODS',
                row: 2,
                margin: 3,
                stretch: go.Stretch.Horizontal,
                defaultAlignment: go.Spot.Left,
                itemTemplate: methodTemplate,
            }).bind('itemArray', 'methods')
        )
    );
}

function setupInitialNodes(diagram) {
    const nodeDataArray = [
        {
            key: 1,
            name: 'BankAccount',
            properties: [
                { name: 'owner', type: 'String', visibility: 'public' },
                { name: 'balance', type: 'Currency', visibility: 'public' },
            ],
            methods: [
                {
                    name: 'deposit',
                    parameters: [{ name: 'amount', type: 'Currency' }],
                    visibility: 'public',
                },
                {
                    name: 'withdraw',
                    parameters: [{ name: 'amount', type: 'Currency' }],
                    visibility: 'private',
                },
            ],
        },
    ];

    diagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray,
    });
}

function convertVisibility(v) {
    switch (v) {
        case 'public': return '+';
        case 'private': return '-';
        case 'protected': return '#';
        case 'package': return '~';
        default: return v;
    }
}

function formatParameters(parr) {
    let s = '(';
    for (let i = 0; i < parr.length; i++) {
        const param = parr[i];
        if (i > 0) s += ', ';
        s += `${param.name}: ${param.type}`;
    }
    return s + ')';
}
