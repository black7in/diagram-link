<div>
    <style type="text/css">
        /* CSS for the traditional context menu */
        .menu {
            display: none;
            position: absolute;
            opacity: 0;
            margin: 0;
            padding: 8px 0;
            z-index: 999;
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
            list-style: none;
            background-color: #ffffff;
            border-radius: 4px;
        }

        .menu-item {
            display: block;
            position: relative;
            min-width: 60px;
            margin: 0;
            padding: 6px 16px;
            font: bold 12px sans-serif;
            color: rgba(0, 0, 0, 0.87);
            cursor: pointer;
        }

        .menu-item::before {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            pointer-events: none;
            content: '';
            width: 100%;
            height: 100%;
            background-color: #000000;
        }

        .menu-item:hover::before {
            opacity: 0.04;
        }

        .menu .menu {
            top: -8px;
            left: 100%;
        }

        .show-menu,
        .menu-item:hover>.menu {
            display: block;
            opacity: 1;
        }
    </style>
    <style>
        .no-padding {
            padding: 0 !important;
        }

        .row.no-gutter {
            --bs-gutter-x: 0;
        }
    </style>
    <div class="row no-gutter flex-grow-1 justify-content-center" style="height: 82vh;">
        <div class="col-md-1 d-flex no-padding" style="background-color:  #e4e7ea;">
            <div id="myPaletteDiv" style="border: solid 1px black; border-right: 0; width:100%; height:100%;"></div>
        </div>
        <div class="col-md-11 d-flex no-padding">
            <div style="display: flex; width: 100%; height: 100%;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <div id="myDiagramDiv" style="border: solid 1px black; width: 100%; height: 100%;"></div>
                    <ul id="contextMenu" class="menu">
                        <!-- Imprimir nombre -->
                        <li id="printname" class="menu-item" onpointerdown="cxcommand(event)">Print Name</li>
                        <!-- Agregar Atributo -->
                        <li id="attribute" class="menu-item" onpointerdown="cxcommand(event)">Add Attribute
                            <ul class="menu">
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributepublic')">Public</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributeprivate')">Private</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributeprotected')">Protected
                                </li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributepacket')">Packet</li>
                            </ul>
                        </li>
                        <!-- Agregar Método -->
                        <li id="method" class="menu-item" onpointerdown="cxcommand(event)">Add Method
                            <ul class="menu">
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodpublic')">Public</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodprivate')">Private</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodprotected')">Protected</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodpacket')">Packet</li>
                            </ul>
                        </li>

                        <!-- Cambiar color -->
                        <li id="color" class="menu-item">
                            Color
                            <ul class="menu">
                                <li class="menu-item" style="background-color: #f38181"
                                    onpointerdown="cxcommand(event, 'color')">Red</li>
                                <li class="menu-item" style="background-color: #eaffd0"
                                    onpointerdown="cxcommand(event, 'color')">Green</li>
                                <li class="menu-item" style="background-color: #95e1d3"
                                    onpointerdown="cxcommand(event, 'color')">Blue</li>
                                <li class="menu-item" style="background-color: #fce38a"
                                    onpointerdown="cxcommand(event, 'color')">Yellow</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    {{-- Script para inicializar el diagrama con GoJS --}}
    <script>
        let myDiagram; // Declaración de la variable en el ámbito global
        let myPalette;

        function init() {

            myDiagram =
                new go.Diagram('myDiagramDiv', {
                    'undoManager.isEnabled': true,
                });

            myPalette = new go.Palette('myPaletteDiv'); // debe ser el ID de un DIV en tu página
            myPalette.nodeTemplate = myDiagram.nodeTemplate; // comparte la plantilla de nodo con el diagrama

            // Puedes agregar nodos a la paleta de la misma manera que al diagrama
            myPalette.model = new go.GraphLinksModel([{
                    key: 1,
                    name: "NewClass", // Nombre por defecto de la clase
                    properties: [], // Propiedades vacías por defecto
                    methods: [] // Métodos vacíos por defecto
                },
                {
                    key: 2,
                    name: "AnotherClass",
                    properties: [],
                    methods: []
                }
                // Agrega más nodos aquí...
            ]);

            // This is the actual HTML context menu:
            var cxElement = document.getElementById('contextMenu');

            // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
            var myContextMenu = new go.HTMLInfo({
                show: showContextMenu,
                hide: hideContextMenu
            });


            // the item template for properties
            var propertyTemplate = new go.Panel('Horizontal')
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
                    .bindTwoWay('text', 'type'),
                    // property default value, if any
                    /*new go.TextBlock({
                        isMultiline: false,
                        editable: true
                    }) // editable set to true
                    .bind('text', 'default', s => s ? ' = ' + s : '')*/
                );

            // the item template for methods
            var methodTemplate = new go.Panel('Horizontal')
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

            // the node template
            myDiagram.nodeTemplate =
                new go.Node('Auto', {
                    locationSpot: go.Spot.Center,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides,
                    contextMenu: myContextMenu
                    /*contextMenu: go.GraphObject.build("ContextMenu")
                        .add(

                            // botón para cambiar color
                            go.GraphObject.build("ContextMenuButton", {
                                click: changeColor,
                                //margin: 3,
                                "ButtonBorder.fill": "white",
                                "_buttonFillOver": "skyblue",
                            })
                            .add(new go.TextBlock("Cambiar Color", {
                                alignment: go.Spot.Left
                            })),

                            // botón para agregar atributo
                            go.GraphObject.build("ContextMenuButton", {
                                click: addAttribute,
                                "ButtonBorder.fill": "white",
                                "_buttonFillOver": "skyblue",
                            })
                            .add(new go.TextBlock("Add Attribute", {
                                alignment: go.Spot.Left
                            })),

                            // botón para agregar método
                            go.GraphObject.build("ContextMenuButton", {
                                click: addMethod,
                                "ButtonBorder.fill": "white",
                                "_buttonFillOver": "skyblue",
                            })
                            .add(new go.TextBlock("Add Method", {
                                alignment: go.Spot.Left
                            })),

                            // botón para imprimir el nombre de la clase
                            go.GraphObject.build("ContextMenuButton", {
                                click: logNodeName,
                                "ButtonBorder.fill": "white",
                                "_buttonFillOver": "skyblue",
                            })
                            .add(new go.TextBlock("Print Name", {
                                alignment: go.Spot.Left
                            }))
                        )*/
                })
                .add(
                    new go.Shape({
                        fill: 'palegreen'
                    }),
                    new go.Panel('Table', {
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
                    )
                );

            // setup a few example class nodes and relationships
            var nodedata = [{
                key: 1,
                name: 'BankAccount',
                properties: [{
                        name: 'owner',
                        type: 'String',
                        visibility: 'public'
                    },
                    {
                        name: 'balance',
                        type: 'Currency',
                        visibility: 'public',
                        //default: '0'
                    }
                ],
                methods: [{
                        name: 'deposit',
                        parameters: [{
                            name: 'amount',
                            type: 'Currency'
                        }],
                        visibility: 'public'
                    },
                    {
                        name: 'withdraw',
                        parameters: [{
                            name: 'amount',
                            type: 'Currency'
                        }],
                        visibility: 'private'
                    }
                ]
            }, ];

            myDiagram.model = new go.GraphLinksModel({
                copiesArrays: true,
                copiesArrayObjects: true,
                //linkCategoryProperty: 'relationship',
                nodeDataArray: nodedata,
                //linkDataArray: linkdata
            });

            myDiagram.contextMenu = myContextMenu;

            // We don't want the div acting as a context menu to have a (browser) context menu!
            cxElement.addEventListener(
                'contextmenu',
                (e) => {
                    e.preventDefault();
                    return false;
                },
                false
            );

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
        }

        // show visibility or access as a single character at the beginning of each property or method
        function convertVisibility(v) {
            switch (v) {
                case 'public':
                    return '+';
                case 'private':
                    return '-';
                case 'protected':
                    return '#';
                case 'package':
                    return '~';
                default:
                    return v;
            }
        }

        // This is the general menu command handler, parameterized by the name of the command.
        function cxcommand(event, val) {
            if (val === undefined) val = event.currentTarget.id;
            var diagram = myDiagram;
            switch (val) {
                case 'printname':
                    logNodeName(event, diagram);
                    break;
                case 'attributepublic': {
                    addAttribute(event, diagram, 'public');
                    break;
                }
                case 'attributeprivate': {
                    addAttribute(event, diagram, 'private');
                    break;
                }
                case 'attributeprotected': {
                    addAttribute(event, diagram, 'protected');
                    break;
                }
                case 'attributepacket': {
                    addAttribute(event, diagram, 'package');
                    break;
                }
                case 'color': {
                    var color = window.getComputedStyle(event.target)['background-color'];
                    changeColor(diagram, color);
                    break;
                }
                case 'methodpublic': {
                    addMethod(event, diagram, 'public');
                    break;
                }
                case 'methodprivate': {
                    addMethod(event, diagram, 'private');
                    break;
                }
                case 'methodprotected': {
                    addMethod(event, diagram, 'protected');
                    break;
                }
                case 'methodpacket': {
                    addMethod(event, diagram, 'package');
                    break;
                }
            }
            diagram.currentTool.stopTool();
        }

        // A custom command, for changing the color of the selected node(s).
        function changeColor(diagram, color) {
            // Always make changes in a transaction, except when initializing the diagram.
            diagram.startTransaction('change color');
            diagram.selection.each((node) => {
                if (node instanceof go.Node) {
                    // ignore any selected Links and simple Parts
                    // Examine and modify the data, not the Node directly.
                    var data = node.data;
                    // Call setDataProperty to support undo/redo as well as
                    // automatically evaluating any relevant bindings.
                    diagram.model.setDataProperty(data, 'color', color);
                }
            });
            diagram.commitTransaction('change color');
        }

        function logNodeName(event, diagram) {
            var node = diagram.selection.first(); // Obtén el nodo que fue clicado
            if (node !== null) {
                console.log("Nombre de la clase: " + node.data.name); // Imprime el nombre de la clase
            }
        }

        function changeColor(e, obj) {
            console.log('cambiar color')
        }

        // Función para agregar un nuevo método a un nodo (clase)
        function addMethod(event, diagram, visibility) {
            var node = diagram.selection.first(); // Obtén el nodo que fue clicado
            if (node !== null) {
                diagram.startTransaction("add method"); // Inicia una transacción para agregar el método

                // Obtén el arreglo actual de métodos del nodo
                var methods = node.data.methods || [];

                // Crear un nuevo método con valores por defecto
                var newMethod = {
                    name: "newMethod", // Nombre por defecto del método
                    parameters: [], // Sin parámetros por defecto
                    type: "void", // Tipo de retorno por defecto
                    visibility: visibility || "public" // Visibilidad por defecto
                };

                // Agrega el nuevo método al arreglo de métodos
                diagram.model.insertArrayItem(methods, -1, newMethod);

                diagram.commitTransaction("add method"); // Termina la transacción
            }
        }

        function addAttribute(event, diagram, visibility) {
            var node = diagram.selection.first(); // Obtén el nodo que fue clicado
            if (node !== null) {
                diagram.startTransaction("add property"); // Inicia una transacción para agregar el atributo
                // Obtén el arreglo actual de propiedades del nodo
                var properties = node.data.properties || [];

                // Crear un nuevo atributo con valores por defecto
                var newProperty = {
                    name: "newProperty", // Nombre por defecto del atributo
                    type: "String", // Tipo por defecto
                    visibility: visibility || "public" // Visibilidad por defecto
                };

                // Agrega el nuevo atributo al arreglo de propiedades
                diagram.model.insertArrayItem(properties, -1, newProperty);

                diagram.commitTransaction("add property"); // Termina la transacción
            }
        }

        window.addEventListener('DOMContentLoaded', init);
    </script>
</div>
