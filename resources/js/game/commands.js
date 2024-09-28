// This is the general menu command handler, parameterized by the name of the command.
// Definir la función cxcommand en el ámbito global
export function cxcommand(event, val, myDiagram) {
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
};

function logNodeName(event, diagram) {
    var node = diagram.selection.first(); // Obtén el nodo que fue clicado
    if (node !== null) {
        console.log("Nombre de la clase: " + node.data.name); // Imprime el nombre de la clase
    }
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